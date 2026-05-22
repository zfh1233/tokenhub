import mongoose from 'mongoose';
import Tutorial from '../models/Tutorial.js';

export const getTutorials = async (req, res) => {
  try {
    const { agent, search, tag, page = 1, limit = 12, status } = req.query;
    const match = {};
    if (agent) match.agent = new mongoose.Types.ObjectId(agent);
    if (tag) match.tags = tag;
    if (status) match.status = status;
    else match.status = 'approved';
    if (search) match.$text = { $search: search };

    const pipeline = [
      { $match: match },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $skip: (page - 1) * Number(limit) },
      { $limit: Number(limit) },
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
      { $lookup: { from: 'agents', localField: 'agent', foreignField: '_id', as: 'agent' } },
      { $unwind: '$author' },
      { $unwind: '$agent' },
      {
        $project: {
          title: 1, content: 1, summary: 1, tags: 1, attachments: 1, likes: 1, likesCount: 1, status: 1, createdAt: 1, updatedAt: 1,
          'author.username': 1, 'author.avatar': 1,
          'agent.name': 1, 'agent.icon': 1, 'agent.color': 1,
        },
      },
    ];

    const total = await Tutorial.countDocuments(match);
    const tutorials = await Tutorial.aggregate(pipeline);

    res.json({ tutorials, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('agent', 'name icon color')
      .populate('likes', 'username');
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    res.json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTutorial = async (req, res) => {
  try {
    const { title, content, summary, agent, tags } = req.body;
    const attachments = req.files?.map(f => ({
      url: `/uploads/${f.mimetype.startsWith('image/') ? 'images' : 'videos'}/${f.filename}`,
      type: f.mimetype,
      name: f.originalname,
    })) || [];

    const tutorial = await Tutorial.create({
      title, content, summary, agent,
      tags: tags ? JSON.parse(tags) : [],
      attachments,
      author: req.user.id,
    });
    res.status(201).json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, content, summary, agent, tags } = req.body;
    Object.assign(tutorial, {
      ...(title && { title }),
      ...(content && { content }),
      ...(summary && { summary }),
      ...(agent && { agent }),
      ...(tags && { tags: JSON.parse(tags) }),
    });
    await tutorial.save();
    res.json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await tutorial.deleteOne();
    res.json({ message: 'Tutorial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    const userId = req.user.id;
    const liked = tutorial.likes.includes(userId);
    if (liked) tutorial.likes.pull(userId);
    else tutorial.likes.push(userId);
    await tutorial.save();
    res.json({ liked: !liked, likesCount: tutorial.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

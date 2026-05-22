import Tutorial from '../models/Tutorial.js';

export const getTutorials = async (req, res) => {
  try {
    const { agent, search, tag, page = 1, limit = 12, status } = req.query;
    const filter = {};
    if (agent) filter.agent = agent;
    if (tag) filter.tags = tag;
    if (status) filter.status = status;
    else filter.status = 'approved';
    if (search) filter.$text = { $search: search };

    const total = await Tutorial.countDocuments(filter);
    const tutorials = await Tutorial.find(filter)
      .populate('author', 'username avatar')
      .populate('agent', 'name icon color')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tutorials, total, page: Number(page), pages: Math.ceil(total / limit) });
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

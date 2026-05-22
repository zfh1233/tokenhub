import Agent from '../models/Agent.js';

export const getAgents = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const agents = await Agent.find(filter).sort({ name: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, default: '#8b5cf6' },
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema);

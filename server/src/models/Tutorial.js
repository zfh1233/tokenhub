import mongoose from 'mongoose';

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  tags: [{ type: String }],
  attachments: [{ url: String, type: String, name: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

tutorialSchema.index({ title: 'text', summary: 'text', tags: 'text' });

export default mongoose.model('Tutorial', tutorialSchema);

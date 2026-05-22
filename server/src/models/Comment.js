import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);

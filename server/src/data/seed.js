import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Agent from '../models/Agent.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const agents = [
  { name: 'ChatGPT', icon: '🤖', description: 'OpenAI 旗下强大的对话式 AI，擅长问答、写作、编程等多种任务', category: '对话', color: '#10a37f' },
  { name: 'Claude', icon: '🧠', description: 'Anthropic 出品的 AI 助手，以安全性和长文本处理著称', category: '对话', color: '#8b5cf6' },
  { name: 'Gemini', icon: '💎', description: 'Google DeepMind 开发的多模态 AI，支持文本、图片、视频理解', category: '对话', color: '#4285f4' },
  { name: 'GitHub Copilot', icon: '👨‍💻', description: '基于 AI 的代码补全工具，深度集成于 VS Code 和 IDE', category: '编程', color: '#6e40c9' },
  { name: 'Cursor', icon: '🖱️', description: 'AI 驱动的代码编辑器，内置 Chat 和代码生成功能', category: '编程', color: '#1a1a2e' },
  { name: 'Midjourney', icon: '🎨', description: '领先的 AI 图像生成工具，擅长艺术风格创作', category: '绘画', color: '#ff6b6b' },
  { name: 'DALL·E', icon: '🖼️', description: 'OpenAI 的图像生成模型，支持文本到图像的创作', category: '绘画', color: '#00a67e' },
  { name: 'Perplexity', icon: '🔍', description: 'AI 搜索引擎，结合大模型和网络搜索提供精准答案', category: '搜索', color: '#20b2aa' },
  { name: 'Suno', icon: '🎵', description: 'AI 音乐生成平台，支持歌词创作和全曲生成', category: '音乐', color: '#ff7eb3' },
  { name: 'Sora', icon: '🎬', description: 'OpenAI 的文本生成视频模型，开创视频创作新范式', category: '视频', color: '#6366f1' },
  { name: 'Jasper', icon: '✍️', description: 'AI 写作助手，专注于营销文案和内容创作', category: '写作', color: '#f59e0b' },
  { name: 'Notion AI', icon: '📝', description: '集成在 Notion 中的 AI 助手，支持笔记、摘要和翻译', category: '写作', color: '#000000' },
];

const seed = async () => {
  await connectDB();

  await Agent.deleteMany({});
  await Agent.insertMany(agents);
  console.log('Agents seeded');

  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', email: 'admin@example.com', password: hashed, role: 'admin', bio: 'Site Administrator' });
    console.log('Admin user created (admin@example.com / admin123)');
  }

  await mongoose.connection.close();
  console.log('Done');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });

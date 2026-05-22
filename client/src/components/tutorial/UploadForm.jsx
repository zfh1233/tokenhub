import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import useAuthStore from '../../store/authStore';
import { agentAPI, tutorialAPI } from '../../services/api';

const UploadForm = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ title: '', summary: '', content: '', agent: '', tags: '' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agentAPI.getAll().then(({ data }) => setAgents(data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.summary || !form.agent) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('summary', form.summary);
      formData.append('content', form.content);
      formData.append('agent', form.agent);
      formData.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
      Array.from(files).forEach((f) => formData.append('files', f));

      const { data } = await tutorialAPI.create(formData);
      navigate(`/tutorial/${data._id}`);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">摘要 *</label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={2}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">AI Agent *</label>
        <select
          value={form.agent}
          onChange={(e) => setForm({ ...form, agent: e.target.value })}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          required
        >
          <option value="">选择 AI Agent</option>
          {agents.map((a) => (
            <option key={a._id} value={a._id}>{a.icon} {a.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="入门, 提示词, 实战"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div data-color-mode="light">
        <label className="block text-sm font-medium text-gray-700 mb-1">教程内容 *</label>
        <MDEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} height={400} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">附件（图片/视频）</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
        <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors">
          {submitting ? '提交中...' : '提交教程'}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;

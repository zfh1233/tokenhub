import { useState, useEffect } from 'react';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/home/CategoryFilter';
import AgentGrid from '../components/home/AgentGrid';
import TutorialCard from '../components/tutorial/TutorialCard';
import SocialQRModal, { useSocialModal } from '../components/common/SocialQRModal';
import { agentAPI, tutorialAPI } from '../services/api';

const WECHAT_ICON = 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.133 0 .241-.11.241-.246 0-.06-.023-.118-.039-.177l-.326-1.233a.492.492 0 01.177-.554C23.024 18.076 24 16.944 24 14.834c0-3.252-2.83-5.94-7.062-5.976zM14.53 13.39c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z';

const HomePage = () => {
  const [agents, setAgents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hotTutorials, setHotTutorials] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const socialModal = useSocialModal();

  useEffect(() => {
    agentAPI.getAll({ category }).then(({ data }) => {
      setAgents(data);
      setFiltered(data);
    }).finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    tutorialAPI.getAll({ limit: 6 }).then(({ data }) => setHotTutorials(data.tutorials)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(agents); return; }
    const q = search.toLowerCase();
    setFiltered(agents.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)));
  }, [search, agents]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">探索 AI 的无限可能</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">发现和学习各类 AI Agent 的使用教程，从入门到精通</p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={() => socialModal.open('微信')} title="微信"
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 hover:border-primary-200 flex items-center justify-center text-gray-400 hover:text-primary-500 transition-all hover:shadow-sm cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={WECHAT_ICON} /></svg>
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索 AI Agent..." />
        </div>

        <div className="flex justify-center mb-8">
          <CategoryFilter active={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">没有找到匹配的 AI Agent</div>
        ) : (
          <AgentGrid agents={filtered} />
        )}

        {hotTutorials.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🔥</span>
              <h2 className="text-xl font-bold text-gray-900">热门教程排行</h2>
              <span className="text-sm text-gray-400">按点赞数排序</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotTutorials.map((t, i) => <TutorialCard key={t._id} tutorial={t} rank={i + 1} />)}
            </div>
          </div>
        )}
      </div>
      <SocialQRModal isOpen={socialModal.open} onClose={socialModal.close} socialName={socialModal.name} />
    </div>
  );
};

export default HomePage;

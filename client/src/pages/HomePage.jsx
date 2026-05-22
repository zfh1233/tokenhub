import { useState, useEffect } from 'react';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/home/CategoryFilter';
import AgentGrid from '../components/home/AgentGrid';
import { agentAPI } from '../services/api';

const HomePage = () => {
  const [agents, setAgents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getAll({ category }).then(({ data }) => {
      setAgents(data);
      setFiltered(data);
    }).finally(() => setLoading(false));
  }, [category]);

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
      </div>
    </div>
  );
};

export default HomePage;

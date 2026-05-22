import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import TutorialCard from '../components/tutorial/TutorialCard';
import { agentAPI, tutorialAPI } from '../services/api';

const AgentTutorials = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getOne(id).then(({ data }) => setAgent(data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    tutorialAPI.getAll({ agent: id, search, limit: 50 }).then(({ data }) => setTutorials(data.tutorials)).finally(() => setLoading(false));
  }, [id, search]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {agent && (
          <div className="mb-8">
            <Link to="/" className="text-sm text-gray-400 hover:text-primary-500 mb-2 inline-block">← 返回首页</Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: agent.color + '15' }}>
                {agent.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                <p className="text-gray-500">{agent.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-xl mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : tutorials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">暂无教程</p>
            <Link to="/upload" className="text-sm text-primary-500 hover:underline">上传第一个教程 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((t, i) => <TutorialCard key={t._id} tutorial={t} rank={i + 1} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTutorials;

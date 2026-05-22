import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const TutorialTable = () => {
  const [tutorials, setTutorials] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetch = async () => {
    const { data } = await adminAPI.getTutorials({ status: statusFilter, page, limit: 15 });
    setTutorials(data.tutorials);
    setPages(data.pages);
  };

  useEffect(() => { fetch(); }, [statusFilter, page]);

  const handleReview = async (id, status) => {
    await adminAPI.reviewTutorial(id, { status });
    fetch();
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  const statusLabels = { pending: '待审核', approved: '已通过', rejected: '已拒绝' };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1 text-xs rounded-full ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {s ? statusLabels[s] : '全部'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">标题</th>
              <th className="px-4 py-3 text-left font-medium">作者</th>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">日期</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tutorials.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{t.title}</td>
                <td className="px-4 py-3 text-gray-600">{t.author?.username}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                    {statusLabels[t.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString('zh-CN')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {t.status !== 'approved' && (
                      <button onClick={() => handleReview(t._id, 'approved')} className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100">通过</button>
                    )}
                    {t.status !== 'rejected' && (
                      <button onClick={() => handleReview(t._id, 'rejected')} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">拒绝</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-sm rounded-lg ${page === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorialTable;

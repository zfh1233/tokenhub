import { useState } from 'react';
import TutorialTable from '../components/admin/TutorialTable';
import UserTable from '../components/admin/UserTable';

const AdminDashboard = () => {
  const [tab, setTab] = useState('tutorials');

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">管理后台</h1>

        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 p-1 w-fit">
          <button onClick={() => setTab('tutorials')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === 'tutorials' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            教程审核
          </button>
          <button onClick={() => setTab('users')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === 'users' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            用户管理
          </button>
        </div>

        {tab === 'tutorials' ? <TutorialTable /> : <UserTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;

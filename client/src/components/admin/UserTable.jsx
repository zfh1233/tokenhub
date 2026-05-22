import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const fetch = async () => {
    const { data } = await adminAPI.getUsers();
    setUsers(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleRoleChange = async (id, role) => {
    await adminAPI.updateUserRole(id, { role });
    fetch();
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">用户名</th>
            <th className="px-4 py-3 text-left font-medium">邮箱</th>
            <th className="px-4 py-3 text-left font-medium">角色</th>
            <th className="px-4 py-3 text-left font-medium">注册日期</th>
            <th className="px-4 py-3 text-left font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
              <td className="px-4 py-3 text-gray-600">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {u.role === 'admin' ? '管理员' : '用户'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                  className="px-2 py-1 text-xs bg-primary-50 text-primary-600 rounded hover:bg-primary-100"
                >
                  {u.role === 'admin' ? '设为用户' : '设为管理员'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

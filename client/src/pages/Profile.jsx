import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI, tutorialAPI } from '../services/api';
import TutorialCard from '../components/tutorial/TutorialCard';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [myTutorials, setMyTutorials] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', bio: '' });

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', bio: user.bio || '' });
      tutorialAPI.getAll({ status: 'approved', limit: 50 }).then(({ data }) => {
        setMyTutorials(data.tutorials.filter((t) => t.author?._id === user._id));
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 shrink-0">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} placeholder="个人简介..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600">保存</button>
                    <button onClick={() => setEditing(false)} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">取消</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-600 mt-2">{user.bio || '暂无简介'}</p>
                  <button onClick={() => setEditing(true)} className="mt-3 text-sm text-primary-500 hover:underline">编辑资料</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">我的教程 ({myTutorials.length})</h3>
          {myTutorials.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>还没有上传教程</p>
              <Link to="/upload" className="text-primary-500 hover:underline text-sm mt-2 inline-block">上传第一个 →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {myTutorials.map((t) => <TutorialCard key={t._id} tutorial={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

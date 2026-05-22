import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-2xl">🧠</span>
            <span>OpenTokenHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors">首页</Link>
            {isAuthenticated && (
              <Link to="/upload" className="text-gray-600 hover:text-primary-500 transition-colors">上传教程</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-500 transition-colors">管理后台</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-600">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm">{user?.username}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-gray-500 hover:text-red-500 transition-colors">退出</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">登录</Link>
                <Link to="/register" className="text-sm px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

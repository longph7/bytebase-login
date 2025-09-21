import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import type { GitHubUser } from './services/githubAuth';
import { GitHubAuthService } from './services/githubAuth';
import './App.css';

/**
 * 主应用组件
 * 根据用户登录状态渲染登录页面或用户信息页面
 */
function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 检查用户登录状态
   */
  const checkLoginStatus = () => {
    const storedUser = GitHubAuthService.getStoredUser();
    if (storedUser && GitHubAuthService.isLoggedIn()) {
      console.log('✅ 检测到已登录用户:', storedUser.login);
      setUser(storedUser);
    } else {
      console.log('❌ 未检测到登录用户');
      setUser(null);
    }
    setIsLoading(false);
  };

  /**
   * 初始化时检查登录状态
   */
  useEffect(() => {
    checkLoginStatus();
  }, []);

  /**
   * 监听存储变化，当用户登录状态改变时更新UI
   */
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 检测到存储变化，重新检查登录状态');
      checkLoginStatus();
    };

    // 监听 localStorage 变化
    window.addEventListener('storage', handleStorageChange);
    
    // 监听自定义事件（用于同一页面内的状态变化）
    window.addEventListener('github-login-success', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('github-login-success', handleStorageChange);
    };
  }, []);

  /**
   * 处理用户登出
   */
  const handleLogout = () => {
    console.log('🚪 用户登出');
    GitHubAuthService.logout();
    setUser(null);
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <UserProfile user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;

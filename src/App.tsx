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
  useEffect(() => {
    const storedUser = GitHubAuthService.getStoredUser();
    if (storedUser && GitHubAuthService.isLoggedIn()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * 处理用户登出
   */
  const handleLogout = () => {
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

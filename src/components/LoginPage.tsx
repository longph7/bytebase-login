import React, { useState, useEffect } from 'react';
import { GitHubAuthService } from '../services/githubAuth';
import './LoginPage.css';

/**
 * 登录页面组件
 * 实现Bytebase风格的登录界面，包含用户名/密码输入和登录功能
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');

  /**
   * 处理 GitHub 登录
   */
  const handleGitHubLogin = () => {
    GitHubAuthService.initiateLogin();
  };

  /**
   * 处理 GitHub OAuth 回调
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      GitHubAuthService.handleCallback(code)
        .then(user => {
          console.log('GitHub 登录成功:', user);
          // 刷新页面以更新应用状态
          window.location.href = window.location.origin;
        })
        .catch(error => {
          console.error('GitHub 登录失败:', error);
          alert('GitHub 登录失败，请重试。');
          // 清除 URL 中的参数
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  /**
   * 处理登录表单提交
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email });
    // 这里可以添加实际的登录逻辑
  };

  return (
    <div className="login-container">
      {/* div3: 左侧容器区域 */}
      <div className="div3">
        {/* 可以在这里添加左侧内容，比如背景图片或其他元素 */}
      </div>
      
      {/* div1: 中间线左侧的30px区域 */}
      <div className="div1"></div>
      
      {/* div2: 中间线右侧的30px区域 */}
      <div className="div2"></div>
      
      {/* div4: 右侧容器区域，包含登录框 */}
      <div className="div4">
        <div className="login-card">
          {/* 标题区域 - 高度213px */}
          <div className="title-section">
            <img 
                src="https://www.bytebase.com/images/logo.svg" 
                alt="Bytebase Logo" 
                width="300"
                height="300"
              />
            <h2 className="login-title">欢迎</h2>
            <p className="login-subtitle">登录 Bytebase 以继续使用 Bytebase Hub。</p>
          </div>

          {/* 登录选项区域 - 高度437px */}
          <div className="login-options-section">
            {/* 第三方登录选项 */}
            <div className="social-login-section">
              <button className="social-login-button google">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                继续使用 Google
              </button>
              
              <button className="social-login-button github" onClick={handleGitHubLogin}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 4.029 0 9c0 3.975 2.58 7.35 6.155 8.537.45.082.615-.195.615-.435 0-.214-.008-.78-.012-1.53-2.505.544-3.033-1.208-3.033-1.208-.409-1.04-1-1.316-1-1.316-.817-.559.062-.547.062-.547.903.063 1.378.927 1.378.927.803 1.376 2.107.978 2.62.748.082-.582.314-.978.571-1.203-1.996-.227-4.096-1-4.096-4.448 0-.982.35-1.786.927-2.414-.093-.227-.402-1.14.088-2.378 0 0 .755-.242 2.475.923A8.63 8.63 0 019 4.347c.765.004 1.535.103 2.255.303 1.718-1.165 2.472-.923 2.472-.923.492 1.238.183 2.151.09 2.378.578.628.926 1.432.926 2.414 0 3.457-2.104 4.218-4.108 4.44.323.278.61.827.61 1.667 0 1.204-.011 2.175-.011 2.47 0 .242.163.52.619.433C15.422 16.347 18 12.974 18 9c0-4.971-4.029-9-9-9z" fill="currentColor"/>
                </svg>
                继续使用 GitHub
              </button>
              
              <button className="social-login-button microsoft">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 0h8.5v8.5H0V0z" fill="#F25022"/>
                  <path d="M9.5 0H18v8.5H9.5V0z" fill="#7FBA00"/>
                  <path d="M0 9.5h8.5V18H0V9.5z" fill="#00A4EF"/>
                  <path d="M9.5 9.5H18V18H9.5V9.5z" fill="#FFB900"/>
                </svg>
                继续使用 Microsoft Account
              </button>
            </div>
            
            <div className="divider">
              <span>或</span>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="电子邮件地址*"
                  required
                />
              </div>

              <button type="submit" className="login-button">
                继续
              </button>
            </form>

            <div className="signup-link">
              <span>没有账户？ </span>
              <a href="#" className="signup-text">注册</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
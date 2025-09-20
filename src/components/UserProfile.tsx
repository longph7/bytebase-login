import React from 'react';
import type { GitHubUser } from '../services/githubAuth';
import { GitHubAuthService } from '../services/githubAuth';
import './UserProfile.css';

interface UserProfileProps {
  user: GitHubUser;
  onLogout?: () => void;
}

/**
 * 用户信息显示组件
 * 展示 GitHub 用户的头像、姓名、用户名等基本信息
 */
const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  /**
   * 处理登出操作
   */
  const handleLogout = () => {
    GitHubAuthService.logout();
    if (onLogout) {
      onLogout();
    }
    // 刷新页面或重定向到登录页
    window.location.reload();
  };

  /**
   * 格式化日期显示
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        {/* 用户头像 */}
        <div className="user-avatar-section">
          <img 
            src={user.avatar_url} 
            alt={`${user.login} 的头像`}
            className="user-avatar"
          />
          <div className="user-status">
            <span className="status-indicator online"></span>
            在线
          </div>
        </div>

        {/* 用户基本信息 */}
        <div className="user-info-section">
          <h2 className="user-name">{user.name || user.login}</h2>
          <p className="user-username">@{user.login}</p>
          
          {user.bio && (
            <p className="user-bio">{user.bio}</p>
          )}

          {user.email && (
            <div className="user-detail">
              <span className="detail-icon">📧</span>
              <span className="detail-text">{user.email}</span>
            </div>
          )}

          <div className="user-detail">
            <span className="detail-icon">🔗</span>
            <a 
              href={user.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="detail-link"
            >
              GitHub 主页
            </a>
          </div>

          <div className="user-detail">
            <span className="detail-icon">📅</span>
            <span className="detail-text">加入于 {formatDate(user.created_at)}</span>
          </div>
        </div>

        {/* 用户统计信息 */}
        <div className="user-stats-section">
          <div className="stat-item">
            <span className="stat-number">{user.public_repos}</span>
            <span className="stat-label">仓库</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.followers}</span>
            <span className="stat-label">关注者</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.following}</span>
            <span className="stat-label">关注中</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="user-actions-section">
          <button 
            className="action-button primary"
            onClick={() => window.open(user.html_url, '_blank')}
          >
            查看 GitHub
          </button>
          <button 
            className="action-button secondary"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
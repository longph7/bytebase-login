/**
 * GitHub OAuth 认证服务
 * 处理 GitHub OAuth 登录流程
 */

import axios from 'axios';

// GitHub OAuth 配置
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23liEIfqA1p3w27SLR';
const CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || '7b31ace978d5c31d49f8b1c1d8ff4bbbb9a13842';

// 根据环境设置回调 URL
const getRedirectUri = () => {
  if (import.meta.env.PROD) {
    // 生产环境：GitHub Pages URL
    return 'https://longph7.github.io/bytebase-login/auth/github/callback';
  } else {
    // 开发环境：本地 URL
    return 'http://localhost:5173/auth/github/callback';
  }
};
const REDIRECT_URI = getRedirectUri();

// GitHub 用户信息接口
export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// GitHub 认证服务类
export class GitHubAuthService {
  /**
   * 获取 GitHub OAuth 授权 URL
   * @returns GitHub 授权页面 URL
   */
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'user:email',
      state: Math.random().toString(36).substring(2, 15)
    });
    
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * 使用授权码获取访问令牌
   * @param code GitHub 返回的授权码
   * @returns 访问令牌
   */
  static async getAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI // 这里也要使用相同的回调地址
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new Error('获取访问令牌失败');
      }
    } catch (error) {
      console.error('获取 GitHub 访问令牌时出错:', error);
      throw new Error('GitHub 认证失败');
    }
  }

  // 以下代码保持不变...
  static async getUserInfo(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.data as GitHubUser;
    } catch (error) {
      console.error('获取 GitHub 用户信息时出错:', error);
      throw new Error('获取用户信息失败');
    }
  }

  static async getUserEmails(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('获取 GitHub 用户邮箱时出错:', error);
      return [];
    }
  }

  static initiateLogin(): void {
    const authUrl = this.getAuthUrl();
    console.log('GitHub OAuth URL:', authUrl);
    console.log('Client ID:', CLIENT_ID);
    console.log('Redirect URI:', REDIRECT_URI);
    
    // 检查必要的配置是否存在
     if (CLIENT_ID === 'your_github_client_id' || 
         CLIENT_ID === 'your_github_client_id_here' ||
         CLIENT_ID === 'test_client_id_placeholder') {
       alert('请先配置 GitHub OAuth 应用的 Client ID！\n\n请查看 GITHUB_OAUTH_SETUP.md 文件了解如何配置。');
       return;
     }
    
    window.location.href = authUrl;
  }

  static async handleCallback(code: string): Promise<GitHubUser> {
    try {
      const accessToken = await this.getAccessToken(code);
      const userInfo = await this.getUserInfo(accessToken);
      
      if (!userInfo.email) {
        const emails = await this.getUserEmails(accessToken);
        const primaryEmail = emails.find(email => email.primary);
        if (primaryEmail) {
          userInfo.email = primaryEmail.email;
        }
      }

      localStorage.setItem('github_access_token', accessToken);
      localStorage.setItem('github_user', JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error('处理 GitHub 回调时出错:', error);
      throw error;
    }
  }

  static getStoredUser(): GitHubUser | null {
    try {
      const userStr = localStorage.getItem('github_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取本地用户信息时出错:', error);
      return null;
    }
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('github_access_token');
  }

  static logout(): void {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user');
  }

  static isLoggedIn(): boolean {
    return !!(this.getStoredToken() && this.getStoredUser());
  }
}

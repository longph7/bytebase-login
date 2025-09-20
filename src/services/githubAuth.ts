import axios from 'axios';

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || 'your_github_client_secret';
const REDIRECT_URI = `${window.location.origin}/auth/github/callback`;

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
      client_id: GITHUB_CLIENT_ID,
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
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
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

  /**
   * 使用访问令牌获取用户信息
   * @param accessToken GitHub 访问令牌
   * @returns 用户信息
   */
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

  /**
   * 获取用户的邮箱地址（如果公开邮箱为空）
   * @param accessToken GitHub 访问令牌
   * @returns 用户邮箱列表
   */
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

  /**
   * 发起 GitHub 登录
   * 重定向到 GitHub 授权页面
   */
  static initiateLogin(): void {
    const authUrl = this.getAuthUrl();
    console.log('GitHub OAuth URL:', authUrl);
    console.log('Client ID:', GITHUB_CLIENT_ID);
    console.log('Redirect URI:', REDIRECT_URI);
    
    // 检查必要的配置是否存在
     if (GITHUB_CLIENT_ID === 'your_github_client_id' || 
         GITHUB_CLIENT_ID === 'your_github_client_id_here' ||
         GITHUB_CLIENT_ID === 'test_client_id_placeholder') {
       alert('请先配置 GitHub OAuth 应用的 Client ID！\n\n请查看 GITHUB_OAUTH_SETUP.md 文件了解如何配置。');
       return;
     }
    
    window.location.href = authUrl;
  }

  /**
   * 处理 GitHub OAuth 回调
   * @param code 授权码
   * @returns 完整的用户信息
   */
  static async handleCallback(code: string): Promise<GitHubUser> {
    try {
      // 获取访问令牌
      const accessToken = await this.getAccessToken(code);
      
      // 获取用户信息
      const userInfo = await this.getUserInfo(accessToken);
      
      // 如果用户邮箱为空，尝试获取邮箱列表
      if (!userInfo.email) {
        const emails = await this.getUserEmails(accessToken);
        const primaryEmail = emails.find(email => email.primary);
        if (primaryEmail) {
          userInfo.email = primaryEmail.email;
        }
      }

      // 将访问令牌和用户信息存储到本地存储
      localStorage.setItem('github_access_token', accessToken);
      localStorage.setItem('github_user', JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error('处理 GitHub 回调时出错:', error);
      throw error;
    }
  }

  /**
   * 获取本地存储的用户信息
   * @returns 用户信息或 null
   */
  static getStoredUser(): GitHubUser | null {
    try {
      const userStr = localStorage.getItem('github_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取本地用户信息时出错:', error);
      return null;
    }
  }

  /**
   * 获取本地存储的访问令牌
   * @returns 访问令牌或 null
   */
  static getStoredToken(): string | null {
    return localStorage.getItem('github_access_token');
  }

  /**
   * 登出用户，清除本地存储
   */
  static logout(): void {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user');
  }

  /**
   * 检查用户是否已登录
   * @returns 是否已登录
   */
  static isLoggedIn(): boolean {
    return !!(this.getStoredToken() && this.getStoredUser());
  }
}
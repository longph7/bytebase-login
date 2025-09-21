/**
 * GitHub OAuth 认证服务
 * 处理 GitHub OAuth 登录流程
 */

import axios from 'axios';

// GitHub OAuth 配置
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23liEIfqA1p3w27SLR';
const CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || '7b31ace978d5c31d49f8b1c1d8ff4bbbb9a13842';

// 根据环境设置回调 URL - 现在指向Vercel无服务器函数
const getRedirectUri = () => {
  if (import.meta.env.PROD) {
    // 生产环境：Vercel函数URL
    return 'https://bytebase-login.vercel.app/api/auth/github/redirect';
  } else {
    // 开发环境：本地Vercel函数URL
    return 'http://localhost:3000/api/auth/github/redirect';
  }
};
const REDIRECT_URI = getRedirectUri();

// 调试信息
console.log('🔗 GitHub OAuth 回调 URL:', REDIRECT_URI);

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
    
    const authUrl = `https://github.com/login/oauth/authorize?${params}`;
    
    // 添加调试日志
    console.log('🔗 生成 GitHub OAuth 授权 URL:', authUrl);
    console.log('📍 重定向 URI:', REDIRECT_URI);
    console.log('🆔 客户端 ID:', CLIENT_ID);
    
    return authUrl;
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

  /**
   * 获取 GitHub 用户信息
   * @param accessToken GitHub 访问令牌
   * @returns 用户信息
   */
  static async getUserInfo(accessToken: string): Promise<GitHubUser> {
    try {
      console.log('📡 正在从 GitHub API 获取用户信息...');
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let user = response.data as GitHubUser;
      console.log('👤 获取到用户基本信息:', user.login);

      // 如果用户没有公开邮箱，尝试获取邮箱信息
      if (!user.email) {
        console.log('📧 用户邮箱未公开，尝试获取邮箱信息...');
        try {
          const emails = await this.getUserEmails(accessToken);
          const primaryEmail = emails.find(email => email.primary);
          if (primaryEmail) {
            user.email = primaryEmail.email;
            console.log('✅ 获取到用户主邮箱:', user.email);
          }
        } catch (emailError) {
          console.warn('⚠️ 获取邮箱信息失败，但不影响登录:', emailError);
        }
      }

      return user;
    } catch (error) {
      console.error('❌ 获取 GitHub 用户信息时出错:', error);
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

  /**
   * 启动 GitHub 登录流程
   * 重定向到 GitHub OAuth 授权页面
   */
  static initiateLogin(): void {
    console.log('🚀 启动 GitHub 登录流程...');
    const authUrl = this.getAuthUrl();
    console.log('🔄 即将跳转到:', authUrl);
    window.location.href = authUrl;
  }

  /**
   * 处理 GitHub OAuth 回调 - 现在通过URL参数获取用户信息
   * @param urlParams URL参数对象
   * @returns 用户信息
   */
  static async handleCallback(urlParams: URLSearchParams): Promise<GitHubUser> {
    try {
      console.log('🔄 处理 GitHub OAuth 回调');
      
      // 检查是否有错误
      const error = urlParams.get('error');
      if (error) {
        const errorDescription = urlParams.get('error_description') || error;
        throw new Error(`OAuth 授权失败: ${errorDescription}`);
      }

      // 检查是否有用户信息（来自Vercel函数）
      const userStr = urlParams.get('user');
      const token = urlParams.get('token');
      
      if (!userStr || !token) {
        throw new Error('未收到用户信息或访问令牌');
      }

      const user = JSON.parse(decodeURIComponent(userStr));
      const accessToken = decodeURIComponent(token);
      
      console.log('✅ 用户信息获取成功:', user.login);
      
      // 存储用户信息和令牌
      localStorage.setItem('github_user', JSON.stringify(user));
      localStorage.setItem('github_token', accessToken);
      console.log('💾 用户信息已保存到本地存储');
      
      return user;
    } catch (error) {
      console.error('❌ 处理 GitHub 回调时出错:', error);
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
    return localStorage.getItem('github_token');
  }

  static logout(): void {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  }

  static isLoggedIn(): boolean {
    return !!(this.getStoredToken() && this.getStoredUser());
  }
}

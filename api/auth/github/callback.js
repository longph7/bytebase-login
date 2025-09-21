/**
 * Vercel无服务器函数：处理GitHub OAuth回调
 * 安全地交换authorization code为access token
 */
export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state } = req.query;

    // 验证必需参数
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // GitHub OAuth配置
    const clientId = process.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = process.env.VITE_GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Missing OAuth configuration' });
    }

    // 向GitHub交换access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ 
        error: 'OAuth token exchange failed', 
        details: tokenData.error_description 
      });
    }

    // 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return res.status(400).json({ 
        error: 'Failed to fetch user data', 
        details: userData.message 
      });
    }

    // 获取用户邮箱
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find(email => email.primary)?.email || userData.email;

    // 返回成功响应
    return res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: primaryEmail,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
      },
      access_token: tokenData.access_token,
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
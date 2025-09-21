/**
 * Vercel无服务器函数：处理OAuth成功后的重定向
 * 将用户重定向回前端应用并传递认证结果
 */
export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;

  // 构建前端应用的URL
  const frontendUrl = process.env.NODE_ENV === 'production' 
    ? 'https://longph7.github.io/bytebase-login'
    : 'http://localhost:5173';

  if (error) {
    // OAuth授权失败，重定向到错误页面
    const errorUrl = `${frontendUrl}?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`;
    return res.redirect(302, errorUrl);
  }

  if (!code) {
    // 缺少授权码
    const errorUrl = `${frontendUrl}?error=missing_code`;
    return res.redirect(302, errorUrl);
  }

  try {
    // 调用我们的callback API获取用户信息
    const callbackUrl = `${req.headers.host}/api/auth/github/callback?code=${code}&state=${state || ''}`;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    
    const response = await fetch(`${protocol}://${callbackUrl}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      // API调用失败
      const errorUrl = `${frontendUrl}?error=api_error&error_description=${encodeURIComponent(data.error || 'Unknown error')}`;
      return res.redirect(302, errorUrl);
    }

    // 成功获取用户信息，重定向到前端并传递用户数据
    const successUrl = `${frontendUrl}?auth=success&user=${encodeURIComponent(JSON.stringify(data.user))}&token=${encodeURIComponent(data.access_token)}`;
    return res.redirect(302, successUrl);

  } catch (error) {
    console.error('Redirect handler error:', error);
    const errorUrl = `${frontendUrl}?error=server_error&error_description=${encodeURIComponent(error.message)}`;
    return res.redirect(302, errorUrl);
  }
}
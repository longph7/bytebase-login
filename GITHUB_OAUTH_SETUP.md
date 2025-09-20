# GitHub OAuth 设置指南

本文档将指导您如何设置 GitHub OAuth 应用，以便在 Bytebase 登录页面中使用 GitHub 登录功能。

## 步骤 1：创建 GitHub OAuth 应用

1. 登录您的 GitHub 账户
2. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
3. 点击 "OAuth Apps" 选项卡
4. 点击 "New OAuth App" 按钮

## 步骤 2：填写应用信息

在创建 OAuth 应用的表单中，填写以下信息：

- **Application name**: `Bytebase Login` (或您喜欢的名称)
- **Homepage URL**: `http://localhost:5173` (开发环境) 或您的实际域名
- **Application description**: `Bytebase 登录系统的 GitHub OAuth 集成`
- **Authorization callback URL**: `http://localhost:5173/` (开发环境) 或 `https://yourdomain.com/`

⚠️ **重要提示**: Authorization callback URL 必须与您的应用运行地址完全匹配！

## 步骤 3：获取客户端凭据

创建应用后，您将看到：
- **Client ID**: 一个公开的标识符
- **Client Secret**: 一个私密的密钥（点击 "Generate a new client secret" 生成）

## 步骤 4：配置环境变量

1. 在项目根目录找到 `.env` 文件
2. 将您的 GitHub OAuth 凭据填入：

```env
VITE_GITHUB_CLIENT_ID=your_actual_client_id_here
VITE_GITHUB_CLIENT_SECRET=your_actual_client_secret_here
```

**示例**:
```env
VITE_GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
VITE_GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

## 步骤 5：重启开发服务器

配置完成后，重启您的开发服务器：

```bash
npm run dev
```

## 安全注意事项

⚠️ **生产环境警告**: 
- 在生产环境中，**绝对不要**将 `Client Secret` 暴露在前端代码中
- 应该在后端服务器处理 OAuth 令牌交换
- 当前实现仅用于开发和演示目的

## 测试 GitHub 登录

1. 访问 `http://localhost:5173`
2. 点击 "继续使用 GitHub" 按钮
3. 您将被重定向到 GitHub 授权页面
4. 授权后，您将返回到应用并看到您的 GitHub 用户信息

## 常见问题

### Q: 点击 GitHub 登录按钮没有反应？
A: 检查浏览器控制台是否有错误，确保 `.env` 文件中的 `VITE_GITHUB_CLIENT_ID` 已正确设置。

### Q: 授权后返回应用时出现错误？
A: 检查 GitHub OAuth 应用设置中的 "Authorization callback URL" 是否与当前应用地址匹配。

### Q: 无法获取用户信息？
A: 确保 `.env` 文件中的 `VITE_GITHUB_CLIENT_SECRET` 已正确设置，并且 GitHub OAuth 应用的权限范围包含 `user:email`。

## 生产环境部署

在生产环境中部署时：

1. 创建新的 GitHub OAuth 应用（或更新现有应用）
2. 将 "Homepage URL" 和 "Authorization callback URL" 更新为您的生产域名
3. 实施后端 OAuth 流程以保护客户端密钥
4. 使用环境变量管理系统安全地存储凭据

## 相关链接

- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [OAuth 2.0 规范](https://tools.ietf.org/html/rfc6749)
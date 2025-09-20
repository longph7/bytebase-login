# Bytebase Login Page

一个美观的登录页面，集成了 GitHub OAuth 认证功能。

## ✨ 功能特性

- 🎨 现代化的 UI 设计
- 🔐 GitHub OAuth 登录集成
- 👤 用户信息展示
- 📱 响应式设计
- 🚀 自动部署到 GitHub Pages

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + Flexbox
- **认证**: GitHub OAuth 2.0
- **HTTP 客户端**: Axios
- **部署**: GitHub Pages + GitHub Actions

## 🚀 快速开始

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/你的用户名/bytebase-login.git
cd bytebase-login
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env` 文件并填入你的 GitHub OAuth 配置：
```bash
VITE_GITHUB_CLIENT_ID=你的_GitHub_Client_ID
VITE_GITHUB_CLIENT_SECRET=你的_GitHub_Client_Secret
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 `http://localhost:5173`

### GitHub OAuth 配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth 应用
3. 设置回调 URL：
   - 开发环境: `http://localhost:5173/auth/github/callback`
   - 生产环境: `https://你的用户名.github.io/bytebase-login/auth/github/callback`

## 📦 构建和部署

### 本地构建
```bash
npm run build
npm run preview
```

### 部署到 GitHub Pages

详细的部署指南请查看 [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)

简要步骤：
1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 配置 GitHub Actions secrets
4. 自动部署完成

## 📁 项目结构

```
bytebase-login/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── LoginPage.tsx   # 登录页面
│   │   ├── LoginPage.css   # 登录页面样式
│   │   ├── UserProfile.tsx # 用户信息页面
│   │   └── UserProfile.css # 用户信息样式
│   ├── services/           # 服务层
│   │   └── githubAuth.ts   # GitHub 认证服务
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 应用样式
│   └── main.tsx           # 应用入口
├── .github/workflows/      # GitHub Actions 工作流
├── .env                   # 环境变量配置
├── vite.config.ts         # Vite 配置
└── package.json           # 项目配置
```

## 🔧 开发指南

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/services/` 中添加相关服务
3. 更新路由和状态管理

### 样式规范

- 使用 CSS3 和 Flexbox 布局
- 遵循响应式设计原则
- 保持一致的颜色主题和字体

### 代码规范

- 使用 TypeScript 进行类型检查
- 添加适当的注释和文档
- 遵循 React 最佳实践

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [GitHub](https://github.com/) - 代码托管和 OAuth 服务
- [GitHub Pages](https://pages.github.com/) - 静态网站托管

## 📞 联系方式

如果你有任何问题或建议，请通过以下方式联系：

- 创建 [Issue](https://github.com/你的用户名/bytebase-login/issues)
- 发送邮件到：你的邮箱@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

# GitHub Pages 部署指南

本文档将指导你如何将 Bytebase 登录页面项目部署到 GitHub Pages，让全世界都能访问你的作品。

## 📋 部署前准备

### 1. 确保项目可以正常构建
在部署之前，先确保项目可以正常构建：

```bash
npm run build
```

如果构建成功，会在项目根目录生成 `dist` 文件夹。

### 2. 更新 Vite 配置
由于 GitHub Pages 的路径结构，需要更新 `vite.config.ts` 文件：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/你的仓库名称/', // 替换为实际的仓库名称
})
```

## 🚀 部署步骤

### 步骤 1: 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `bytebase-login` (或你喜欢的名称)
   - **Description**: `A beautiful login page with GitHub OAuth integration`
   - **Public**: 选择 Public (GitHub Pages 免费版需要公开仓库)
   - **Initialize this repository with**: 不要勾选任何选项
4. 点击 "Create repository"

### 步骤 2: 将本地项目推送到 GitHub

在项目根目录执行以下命令：

```bash
# 初始化 Git 仓库（如果还没有的话）
git init

# 添加所有文件到暂存区
git add .

# 提交代码
git commit -m "Initial commit: Bytebase login page with GitHub OAuth"

# 添加远程仓库地址（替换为你的用户名和仓库名）
git remote add origin https://github.com/longph7/bytebase-login.git


git push -u origin main
```

### 步骤 3: 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"
4. 这将启用 GitHub Actions 来自动构建和部署你的项目

### 步骤 4: 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 步骤 5: 更新环境变量配置

由于 GitHub Pages 是静态托管，需要在构建时设置环境变量。

1. 在 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Secrets and variables" → "Actions"
3. 点击 "New repository secret" 添加以下密钥：
   - `VITE_GITHUB_CLIENT_ID`: 你的 GitHub OAuth Client ID
   - `VITE_GITHUB_CLIENT_SECRET`: 你的 GitHub OAuth Client Secret

4. 更新 GitHub Actions 工作流，在构建步骤中添加环境变量：

```yaml
    - name: Build
      run: npm run build
      env:
        VITE_GITHUB_CLIENT_ID: ${{ secrets.VITE_GITHUB_CLIENT_ID }}
        VITE_GITHUB_CLIENT_SECRET: ${{ secrets.VITE_GITHUB_CLIENT_SECRET }}
```

### 步骤 6: 更新 GitHub OAuth 应用设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 找到你的 OAuth 应用，点击编辑
3. 更新以下设置：
   - **Homepage URL**: `https://你的用户名.github.io/bytebase-login/`
   - **Authorization callback URL**: `https://你的用户名.github.io/bytebase-login/auth/github/callback`

### 步骤 7: 提交并推送更改

```bash
# 添加新文件
git add .

# 提交更改
git commit -m "Add GitHub Pages deployment configuration"

# 推送到 GitHub
git push origin main
```

## 🎉 访问你的网站

部署完成后，你可以通过以下地址访问你的网站：

```
https://你的用户名.github.io/bytebase-login/
```

## 🔧 故障排除

### 常见问题

1. **页面显示 404**
   - 检查 `vite.config.ts` 中的 `base` 配置是否正确
   - 确保仓库名称和配置中的路径一致

2. **GitHub OAuth 不工作**
   - 检查 GitHub OAuth 应用的回调 URL 是否正确设置
   - 确保环境变量在 GitHub Actions 中正确配置

3. **构建失败**
   - 检查 GitHub Actions 的构建日志
   - 确保所有依赖都在 `package.json` 中正确声明

4. **样式或资源加载失败**
   - 检查 `vite.config.ts` 中的 `base` 配置
   - 确保所有资源路径都是相对路径

### 调试技巧

1. **查看 GitHub Actions 日志**
   - 在仓库页面点击 "Actions" 选项卡
   - 点击最新的工作流运行查看详细日志

2. **本地测试构建**
   ```bash
   npm run build
   npm run preview
   ```

3. **检查部署状态**
   - 在仓库 Settings → Pages 页面查看部署状态
   - 部署成功后会显示绿色的勾号和网站地址

## 📚 进阶配置

### 自定义域名

如果你有自己的域名，可以：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 在文件中写入你的域名，如：`login.yourdomain.com`
3. 在你的域名 DNS 设置中添加 CNAME 记录指向 `你的用户名.github.io`

### 启用 HTTPS

GitHub Pages 默认支持 HTTPS，建议：

1. 在 Settings → Pages 中勾选 "Enforce HTTPS"
2. 更新 OAuth 应用设置使用 HTTPS 地址

## 🎯 总结

完成以上步骤后，你的 Bytebase 登录页面就会自动部署到 GitHub Pages，并且每次推送代码到 main 分支时都会自动更新。

你的项目现在具备了：
- ✅ 自动化部署
- ✅ 版本控制
- ✅ 全球 CDN 加速
- ✅ 免费托管
- ✅ HTTPS 支持

享受你的在线作品吧！🚀
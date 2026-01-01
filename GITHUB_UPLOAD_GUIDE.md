# GitHub 上传指南

## 📋 准备工作

您的代码已经在 Git 仓库中，位置：`/workspace/app-8f89mleb1ts1`

所有更改都已提交，可以直接上传到 GitHub。

## 🚀 上传步骤

### 方式一：使用 GitHub CLI（推荐）

如果您安装了 GitHub CLI（gh），可以直接创建仓库并推送：

```bash
cd /workspace/app-8f89mleb1ts1

# 登录 GitHub（如果还未登录）
gh auth login

# 创建 GitHub 仓库并推送
gh repo create wanmei-anhui-miniprogram --public --source=. --remote=origin --push
```

### 方式二：手动创建仓库后推送

#### 1. 在 GitHub 上创建新仓库

访问 https://github.com/new 创建新仓库：

- **Repository name**: `wanmei-anhui-miniprogram`（或您喜欢的名称）
- **Description**: `皖美 - 安徽介绍微信小程序`
- **Visibility**: Public 或 Private
- **不要**勾选 "Initialize this repository with a README"（因为本地已有）

#### 2. 添加远程仓库并推送

创建完成后，GitHub 会显示仓库 URL，执行以下命令：

```bash
cd /workspace/app-8f89mleb1ts1

# 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/wanmei-anhui-miniprogram.git

# 推送代码
git branch -M main
git push -u origin main
```

### 方式三：使用 SSH（如果已配置 SSH 密钥）

```bash
cd /workspace/app-8f89mleb1ts1

# 添加远程仓库（SSH 方式）
git remote add origin git@github.com:YOUR_USERNAME/wanmei-anhui-miniprogram.git

# 推送代码
git branch -M main
git push -u origin main
```

## ⚠️ 重要提醒

### 1. 环境变量文件

`.env` 文件包含 Supabase 密钥等敏感信息，**已在 .gitignore 中排除**，不会上传到 GitHub。

但建议您创建一个 `.env.example` 文件作为模板：

```bash
cd /workspace/app-8f89mleb1ts1

# 创建环境变量模板
cat > .env.example << 'EOF'
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF

# 提交模板文件
git add .env.example
git commit -m "docs: 添加环境变量配置模板"
git push
```

### 2. 不会上传的文件/目录

以下文件/目录已在 `.gitignore` 中，不会上传：

- `node_modules/` - 依赖包
- `dist/` - 构建产物
- `.env` - 环境变量（敏感信息）
- `.env*.local` - 本地环境变量
- `.vscode/` - VS Code 配置
- `*.log` - 日志文件

### 3. 会上传的重要文件

以下文件会上传到 GitHub：

- `src/` - 源代码
- `supabase/migrations/` - 数据库迁移文件
- `package.json` - 依赖配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.ts` - Tailwind 配置
- `README.md` - 项目说明
- `.gitignore` - Git 忽略规则

## 📝 后续操作

### 1. 添加 GitHub Topics

在 GitHub 仓库页面，点击右侧的 "Add topics"，添加相关标签：

```
taro
react
typescript
wechat-miniprogram
tailwindcss
supabase
anhui
miniprogram
```

### 2. 设置仓库描述

在仓库页面点击 "About" 旁边的齿轮图标，设置：

- **Description**: `皖美 - 展示安徽美好形象的微信小程序，采用 Taro + React + TypeScript 开发`
- **Website**: 如果有演示地址可以填写
- **Topics**: 添加相关标签

### 3. 创建 Release（可选）

如果想发布一个正式版本：

```bash
# 创建标签
git tag -a v1.0.0 -m "首次发布：皖美安徽介绍小程序"

# 推送标签
git push origin v1.0.0
```

然后在 GitHub 上创建 Release。

## 🔍 验证上传

上传完成后，访问您的 GitHub 仓库页面，检查：

- ✅ 所有源代码文件都已上传
- ✅ README.md 正确显示
- ✅ .env 文件没有被上传（保护敏感信息）
- ✅ 提交历史完整

## 📞 遇到问题？

### 问题1：推送被拒绝

```
error: failed to push some refs
```

**解决方案**：

```bash
# 先拉取远程更改
git pull origin main --rebase

# 再推送
git push origin main
```

### 问题2：认证失败

```
remote: Support for password authentication was removed
```

**解决方案**：

GitHub 已不支持密码认证，需要使用：
- Personal Access Token (PAT)
- SSH 密钥
- GitHub CLI

推荐使用 GitHub CLI：

```bash
# 安装 GitHub CLI
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: 参考 https://github.com/cli/cli#installation

# 登录
gh auth login
```

### 问题3：仓库已存在

如果远程仓库已经有内容，需要先拉取：

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

## 📚 相关资源

- [GitHub 官方文档](https://docs.github.com/)
- [Git 基础教程](https://git-scm.com/book/zh/v2)
- [GitHub CLI 文档](https://cli.github.com/manual/)

---

## 🎉 完成！

按照以上步骤操作后，您的「皖美」小程序代码就成功上传到 GitHub 了！

如有任何问题，欢迎随时询问。

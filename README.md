# AI 导航 - 职场人AI工具箱

一站式 AI 工具导航 + 100 条职场 AI 提示词库。

## 功能

- 🌐 **网址导航** — AI 工具、效率办公、设计资源、开发者工具分类
- 💬 **提示词库** — 100 条中国职场 AI 提示词（行政/销售/新媒体/文案）
- 💰 **返利链接** — AI 工具推广/返利链接（支持自定义）
- 📦 **资源下载** — AI 工具安装包、模板资源

## 本地使用

直接双击 `index.html` 即可在浏览器中打开使用。

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库
在 GitHub 上创建一个新仓库（如 `ai-nav`），**不要**勾选 "Add a README file"。

### 2. 推送代码
```bash
cd ai-nav-site
git remote add origin https://github.com/你的用户名/ai-nav.git
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages
- 进入仓库 Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 `main`，目录选择 `/ (root)`
- 保存，等待 1-2 分钟即可访问

### 4. 自定义域名（可选）
在 Settings → Pages → Custom domain 填写你的域名。

## 自定义数据

所有数据在 `js/data.js` 中：

- `navData` — 导航站点
- `promptsData` — 提示词库
- `rebateLinks` — 返利链接（替换 `url: "#"` 为实际链接）
- `downloadLinks` — 下载链接（替换 `url: "#"` 为实际链接）

## 技术栈

纯静态 HTML + CSS + JS，零依赖，无需构建工具。

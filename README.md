# AI 英语阅读出题神器

测词汇 → 定水平 → AI 出卷 → 自适应进阶。

**🔗 在线使用：<https://liyucheng1997.github.io/300_lab-AI-English-Reading/>**（浏览器直连 Anthropic API，需在设置里填自己的 API Key，Key 只存本机）

## 功能

1. **词汇量测试**：24 道「选词义」题，阶梯自适应算法（答对升档、答错降档），按 8 个词频档估算词汇量（含猜测校正），映射到小学 → 雅思/托福的年级水平。
2. **定制组卷**：选择目标水平（默认取测试结果）、题型（阅读理解 / 完形填空 / 阅读判断 / 词汇语法）、题量和文章话题，调用 Claude 生成全新试卷（本地开发走 **Claude Code CLI** `claude -p`，线上版浏览器**直连 Anthropic API**）。
3. **在线作答**：交卷自动评分，每题附中文解析。
4. **自适应难度**：得分 ≥85 建议升档、<60 建议降档，「生成下一份」会把调整要求带给 AI。
5. **打印导出**：一键打印成纸质试卷（交卷后打印含解析版）。

## 运行

```bash
npm install
npm run dev
```

打开 http://localhost:5301

## AI 出题原理（两种后端，自动切换）

- **本地开发（推荐，无需 API Key）**：出题请求由开发服务器转给本机的 **Claude Code CLI**（`claude -p < 出题prompt`），使用你已登录的 Claude 账号订阅额度。前提：本机已安装并登录 Claude Code（终端运行 `claude` 完成登录）。
- **在线版（GitHub Pages）**：静态站点没有本地 CLI，浏览器**直连 Anthropic API**。在「⚙️ 设置」里填入自己的 API Key（只存 localStorage、不上传任何服务器）即可。

启动时应用会自动检测本地 CLI 是否可用：可用走 CLI；不可用且填了 Key 走直连 API；两者都没有则进入**演示模式**（内置样卷体验完整流程）。

「⚙️ 设置」里可选填模型名（如 `claude-sonnet-5`），CLI 模式留空使用默认模型。

## 目录结构

```
server/claudeApi.js     # Vite 中间件：/api/health、/api/generate（调用 claude -p）
src/
  data/vocabBands.js    # 8 档分级词表 + 词汇量→水平映射
  data/samplePaper.js   # 演示样卷
  lib/assessment.js     # 自适应词汇测试与词汇量估算算法
  lib/ai.js             # 出题 prompt 构建 + 请求本地 /api 接口
  components/           # 测试、结果、组卷、试卷、设置 界面
```

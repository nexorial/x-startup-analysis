# x-startup-analysis

[English README](README.md)

`x-startup-analysis` 是一个可复用的 Codex Skill 和本地 CLI 工作流，用来从外部视角研究任意 X 账号是如何增长的。

它会从 X 公开个人页和已登录浏览器会话中采集时间线数据，保守地区分 posts / replies，分析公开互动指标，并生成可以回答以下问题的报告：

- 这个账号主要发什么？
- 哪些内容获得了曝光、点赞、评论、转发、引用和收藏？
- 哪些格式、主题和发布时间看起来表现更好？
- 如果 reply 元数据可用，这个账号主要和谁互动？
- 其他创作者可以从这个账号复制什么增长方法？

这个项目**不需要使用 X 官方 API**，也不需要访问账号所有者自己的 X Analytics dashboard。

## 为什么做这个 Skill

X 自带 analytics 只对账号所有者有用。但很多增长学习其实来自外部观察：

- 一个账号变大之前发了什么？
- 什么内容会被收藏或转发？
- 它的分发有多少来自 replies 和互动？
- 关注者到底奖励什么价值？

我做这个 Skill，是为了把这种 outside-in account analysis 变成可重复流程。给它一个公开 X handle，运行本地工作流，就能得到结构化报告，用来学习、分享和继续改进。

## 功能

- **不需要 X API**：可以从已登录浏览器页面或已有本地 GraphQL/JSON capture 生成报告。
- **CLI-first**：一条命令生成 raw capture、timeline Markdown、CSV、insights Markdown 和 run summary。
- **可复用 Codex Skill**：`skills/x-startup-analysis/SKILL.md` 可安装到 `~/.codex/skills`。
- **语言预配置**：通过 `--language en|zh` 生成英文或中文报告。
- **保守分类**：DOM-only 且没有父帖/reply 证据的记录标为 `unclassified`，不会武断当作 top-level posts。
- **采集质量标签**：run summary 会标注 `graphql`、`mixed`、`dom-only` 或 `unknown`。
- **丰富的洞察报告**：每份报告会说明数据来源/采集边界，分析曝光、点赞、评论、转发、引用、收藏之间的相关性，也会分析文本长度、媒体、链接、发布时间等属性相关性，并总结主题信号、公开指标最高的内容、互动账号和可复制经验。
- **账号风格与习惯分析**：报告会总结被分析账号的内容风格、长期习惯、给读者提供的价值、所在 niche，以及关注者似乎奖励什么。
- **外部视角增长洞察**：核心目标是回答这个账号做了什么才获得关注，以及其他创作者可以从中学习什么。
- **本地优先输出**：Markdown 和 CSV 易于检查、提交或发布。

## 示例分析

本仓库包含一个经过验证的 [`@aleabitoreddit`](https://x.com/aleabitoreddit) 近期窗口 DOM-only 示例分析，采集于 2026-06-14：

- [英文时间线报告](reports/aleabitoreddit-2026-06-14.md)
- [英文洞察报告](reports/aleabitoreddit-insights-2026-06-14.md)
- [CSV 导出](reports/aleabitoreddit-2026-06-14.csv)
- [Run summary](reports/aleabitoreddit-run-summary-2026-06-14.json)
- [中文时间线报告](reports/zh/aleabitoreddit-2026-06-14.md)
- [中文洞察报告](reports/zh/aleabitoreddit-insights-2026-06-14.md)

重要边界：这个示例是 `dom-only`，覆盖 X 在 profile timeline 到达页脚前实际加载出来的近期记录。它适合分析公开互动数据，但真正的全历史账号分析需要 GraphQL/Relay capture、更长的可访问时间线，或其他历史数据源。

## 文件结构

```text
.
├── SKILL.md                         # 仓库内 Skill 入口
├── skills/x-startup-analysis/        # 可分发 Codex Skill 包
├── scripts/
│   ├── x-startup-analysis-run.mjs    # CLI 编排器
│   ├── x-startup-analysis.mjs        # Timeline Markdown/CSV 渲染
│   ├── x-startup-analysis-insights.mjs
│   └── x-startup-analysis-capture.js # DevTools capture 脚本
├── lib/
│   └── x-startup-analysis-core.mjs   # 抽取、合并、分类、渲染核心逻辑
├── fixtures/                         # 小型确定性测试样本
├── reports/                          # 示例分析报告
└── tests/                            # Node 测试
```

`data/raw/` 下的浏览器 capture 默认被忽略，因为它们可能很大，也可能包含账号相关的公开数据。建议只提交你明确想发布的报告。

## 安装

要求：

- Node.js 20+
- npm
- 如果要 live capture，需要 Google Chrome
- 如果要更强的自动 GraphQL capture，可选开启 Chrome remote debugging/CDP

克隆并测试：

```bash
git clone https://github.com/Nexorial/x-startup-analysis.git
cd x-startup-analysis
npm test
```

安装 Codex Skill 到本机：

```bash
mkdir -p ~/.codex/skills
cp -R skills/x-startup-analysis ~/.codex/skills/x-startup-analysis
```

## 使用

先选择报告语言：

- 英文：`--language en`
- 中文：`--language zh`

默认运行：

```bash
npm run run -- --username aleabitoreddit --language zh
```

CLI 会输出：

```text
data/raw/<username>-YYYY-MM-DD.json
reports/<username>-YYYY-MM-DD.md
reports/<username>-YYYY-MM-DD.csv
reports/<username>-insights-YYYY-MM-DD.md
reports/<username>-run-summary-YYYY-MM-DD.json
```

如果你已经有 capture JSON/JSONL：

```bash
npm run run -- \
  --username aleabitoreddit \
  --language zh \
  --input data/raw/aleabitoreddit.json \
  --no-snapshot
```

只生成 timeline：

```bash
npm run analyze -- \
  --username aleabitoreddit \
  --language zh \
  --input data/raw/aleabitoreddit.json \
  --out reports/aleabitoreddit.md \
  --csv reports/aleabitoreddit.csv
```

只生成 insights：

```bash
npm run insights -- \
  --username aleabitoreddit \
  --language zh \
  --input data/raw/aleabitoreddit.json \
  --out reports/aleabitoreddit-insights.md
```

## Capture Quality

每次 run summary 都会包含 `captureQuality`：

- `graphql`：有 GraphQL/Relay/SSR 数据，reply 分类最可靠。
- `mixed`：GraphQL 和 DOM 行被合并。
- `dom-only`：只读取可见 DOM。没有明确 reply context 的行保持 `unclassified`。
- `unknown`：输入为空或来源不足。

如果需要最高保真度，在已登录浏览器打开：

```text
https://x.com/<username>/with_replies
```

滚动前把 `scripts/x-startup-analysis-capture.js` 粘贴到 DevTools Console，然后运行：

```js
await XStartupAnalysis.collect({
  username: 'aleabitoreddit',
  maxScrolls: 240,
  pauseMs: 1200
})
XStartupAnalysis.downloadJson()
```

再用 `--input` 重新跑 CLI。

## 反馈

欢迎建议和反馈。可以在 X.com 发给 [@kiskirHQ](https://x.com/kiskirHQ)。

## License

MIT。见 [LICENSE](LICENSE)。

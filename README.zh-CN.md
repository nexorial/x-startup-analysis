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
- **Full-history gate**：可发布的账号示例应使用已耗尽 cursor 的 GraphQL posts+replies 分页。使用 `--require-full-history`，当采集不能证明覆盖全部 posts/replies 时直接停止生成报告。
- **自动 CDP GraphQL 分页**：使用 remote-debugging Chrome profile，让 CLI 捕获已登录态下的 `UserTweets` / `UserTweetsAndReplies` 请求模板，并在本地继续分页；credential 只在内存中使用，不写入报告。
- **Authenticated cURL import**：CDP 不可用时，可以从 Chrome DevTools 复制 `UserTweets` 和 `UserTweetsAndReplies` 请求到本地 gitignored 文件，让 CLI 继续分页抓取。
- **明确暴露限制**：run summary 会保留采集质量、cursor 是否耗尽、rate limit 和 source boundary 证据，避免把不完整 capture 包装成完整账号历史。
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

重要边界：只有 run summary 中 `completeness.isFullHistory: true` 的报告才算完整账号画像。DOM-only 近期窗口报告只能作为验证 artifact。完整 posts/replies 分析需要来自 CDP 的 GraphQL/Relay 分页，或本地 DevTools cURL 文件。

当前 `@aleabitoreddit` 验证状态：本地多个 capture 的最佳 union 一共采到 1,474 条 unique records，约等于可见 profile count 7,267 posts 的 20.3%。这对方法验证和局部分析有用，但不是完整账号历史。X 在 cursor 耗尽前返回了 rate limit 和 cursor error。

## 当前限制

这个项目是 outside-in 分析工具，不是 X 的特权历史归档。

- **不能保证任意账号都能 full coverage**：X 可能通过 rate limit、服务端 cursor error、404、不可用记录、已删除帖子、protected content、viewer block 或其他账号/会话边界停止分页。
- **不要求也不预期采集 subscriber-only 内容**：工具目标是外部可见分析。subscriber-only posts 可能被计入 X profile total，但当前 viewer 不可见；这类内容不应被当作“漏掉的公开数据”。
- **profile post count 不是完美分母**：X 会显示类似 “7,267 posts” 的总数，但不会单独给出 “available non-subscriber posts/replies” 数量。因此相对于 profile count 的 coverage 是保守估算，可能低估可公开访问内容的覆盖率。
- **DOM-only capture 天生不完整**：浏览器 DOM 行会受 X virtualization、搜索索引、自动翻译和分页限制影响。没有明确 reply context 的 DOM 行会标为 `unclassified`，不会当作 top-level posts。
- **GraphQL/CDP 是 best effort，不是万能钥匙**：已登录 CDP 可以捕获真实 GraphQL 请求模板并分页，但 X 仍可能对 `UserTweets` rate limit，或对 `UserTweetsAndReplies` 返回 cursor failure。CLI 会记录这些失败，并在 source 没有耗尽时拒绝 full-history 输出。
- **只有通过 gate 的报告才能当作完整报告发布**：canonical examples 应使用 `--require-full-history`。如果 run summary 是 `not-exhausted`、`partial-dom-only`、`missing-replies-source` 或 `source-exhausted-count-gap`，应视为 partial report。
- **不能只靠 X 公开页回溯 follower 增长历史**：公开 profile 通常只暴露当前 follower count。历史增长需要重复 snapshot 或外部 archive。

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

使用隔离的 CDP Chrome profile 运行可发布的 full-history workflow：

```bash
npm run chrome:cdp
# 在打开的 Chrome 窗口中登录 X。
npm run run -- \
  --username aleabitoreddit \
  --language zh \
  --require-full-history
```

CDP workflow 只在内存中使用请求 credential，不会写入 raw JSON、Markdown、CSV 或 run summary。专用的 `.chrome-cdp-profile/` 浏览器状态目录已经 gitignore。

如果 CDP 不可用，使用本地 DevTools cURL 文件运行可发布的 full-history workflow：

```bash
mkdir -p x_curl
# 将 Chrome DevTools "Copy as cURL" 输出保存为：
# x_curl/UserTweets.curl
# x_curl/UserTweetsAndReplies.curl
npm run run -- \
  --username aleabitoreddit \
  --language zh \
  --curl-dir x_curl \
  --require-full-history
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

每个 run summary 还会包含 `completeness`：

- `full-history`：GraphQL-backed posts+replies source 已经分页到 cursor 结束，并满足 profile count coverage。
- `source-exhausted-count-gap`：GraphQL source 已经结束，但 unique record 数低于 profile post count。除非能解释 unavailable/deleted/subscriber-only 行，否则视为不完整。
- `not-exhausted`：分页在 bottom cursor 结束前停止。
- `missing-replies-source`：只采到了 posts，没有 replies。
- `partial-dom-only`：只读取了可见 DOM 行。

准备用作 canonical examples 的报告请加 `--require-full-history`。如果不是完整采集，它会在生成报告前退出。

### 复制 Full-History cURL 请求

优先路径：运行 `npm run chrome:cdp`，在专用 Chrome 窗口登录 X，然后用 `--require-full-history` 运行正常 CLI。CLI 会通过 CDP 观察 `UserTweets` 和 `UserTweetsAndReplies`，并自动分页。

兜底路径：如果 CDP 不可用，使用 Chrome DevTools：

1. 在 Chrome 登录 X，打开 `https://x.com/<username>/with_replies`。
2. 打开 DevTools，进入 `Network`，选择 `Fetch/XHR`。
3. 过滤 `UserTweets`。
4. 刷新并滚动，让 X 加载 profile timeline 请求。
5. 右键 `UserTweets` 请求，选择 `Copy` -> `Copy as cURL`，保存为 `x_curl/UserTweets.curl`。
6. 右键 `UserTweetsAndReplies` 请求，选择 `Copy` -> `Copy as cURL`，保存为 `x_curl/UserTweetsAndReplies.curl`。

`x_curl/*.curl` 已经被 gitignore，因为这些文件包含登录 cookie/token。不要提交或分享。

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

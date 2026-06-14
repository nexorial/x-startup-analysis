# @aleabitoreddit X 账号外部视角分析

生成时间：2026-06-14T07:37:55.516Z

## 数据来源与分类边界

- 输入记录：来自本地浏览器采集的 14 条时间线记录。
- Capture quality：dom-only。
- 当前账号快照：836,400 followers，175 following，profile post count 7,267。
- 当前数据集中可确定的 replies：1。
- 缺少 reply 元数据的 DOM-only 记录：13。这些只能视为 unclassified/top-level-unknown，不能证明是 posts。
- 本输入的正确解读：1 条 definite replies，加 13 条 DOM-only unclassified。没有 GraphQL/SSR reply enrichment 时，不要把 unclassified 当作 top-level posts。
- 采集限制：Chrome plugin read-only DOM capture; GraphQL/Relay reply fields were not available.
- 文本限制：DOM recapture 保存的是 X 当前可见文本。如果 X UI 自动翻译了帖子，抓到的可能是译文而非原文。

## 互动指标相关性

基于采集到的公开计数，计算指标之间的 Spearman 相关性：

| pair | rho | interpretation |
|---|---:|---|
| likes vs retweets | 0.94 | very strong |
| likes vs comments | 0.84 | very strong |
| impressions vs comments | 0.82 | very strong |
| likes vs bookmarks | 0.82 | very strong |
| impressions vs bookmarks | 0.81 | very strong |
| retweets vs bookmarks | 0.81 | very strong |
| comments vs retweets | 0.80 | very strong |
| impressions vs likes | 0.78 | very strong |
| impressions vs retweets | 0.77 | very strong |
| comments vs bookmarks | 0.74 | strong |
| impressions vs quotes | 0.00 | weak |
| likes vs quotes | 0.00 | weak |

内容属性与 reach / saves 的相关性：

| attribute | impressions rho | likes rho | bookmarks rho |
|---|---:|---:|---:|
| text length | 0.50 | 0.47 | 0.46 |
| line count | 0.24 | 0.17 | 0.07 |
| has media | 0.45 | 0.54 | 0.32 |
| has external link | 0.00 | 0.00 | 0.00 |
| definite reply | 0.38 | 0.24 | 0.38 |
| local posting hour | 0.53 | 0.31 | 0.17 |

## 发布时间与格式模式

| local time bucket | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 18-23 | 4 | 377,012 | 1,016 | 90 |
| 06-11 | 3 | 137,406 | 492 | 16 |
| 12-17 | 5 | 28,300 | 125 | 26 |
| 00-05 | 2 | 10,062 | 128 | 12 |

| text length | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 281+ | 2 | 526,046 | 1,016 | 173 |
| 121-280 | 6 | 180,037 | 367 | 69 |
| 41-120 | 5 | 28,269 | 328 | 8 |
| 0 | 1 | 20,063 | 125 | 16 |

| media | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| has media | 3 | 338,875 | 1,240 | 112 |
| text only | 11 | 28,269 | 149 | 16 |

## 主题信号

| topic | records | median impressions | median likes | median bookmarks | example high-reach post |
|---|---:|---:|---:|---:|---|
| AI / semiconductors | 8 | 345,006 | 512 | 99 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| markets / investing | 7 | 28,269 | 328 | 15 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| supply chain / geopolitics | 6 | 345,006 | 512 | 149 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| culture / regional observations | 6 | 238,141 | 539 | 78 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| product / build notes | 1 | 28,300 | 122 | 26 | [Japan can just stop NCI/Rasa from shipping red phosphorous over to China and cripple the p](https://x.com/aleabitoreddit/status/2065355321338630384) |

## 公开信号最高的时间线记录

按曝光排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-12T14:00:28.000Z | unclassified | 629,842 | 1,240 | 205 | 67 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| 2026-06-13T11:27:47.000Z | reply | 422,250 | 791 | 119 | 279 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| 2026-06-12T08:14:56.000Z | unclassified | 376,659 | 439 | 72 | 167 | [So doing research into some random $TSM, SK Hynix,…](https://x.com/aleabitoreddit/status/2065347103417897423) |
| 2026-06-13T22:51:12.000Z | unclassified | 351,136 | 2,149 | 445 | 379 | [If I had to stereotype my X experiences with markets: China : set on cloning me with AI, c](https://x.com/aleabitoreddit/status/2065930011023204509) |
| 2026-06-12T08:31:08.000Z | unclassified | 338,875 | 585 | 253 | 130 | [Bro I still can't believe Japan's WF6 supply chain got shut down from China export control](https://x.com/aleabitoreddit/status/2065351180314955924) |
| 2026-06-13T12:53:13.000Z | unclassified | 331,774 | 1,331 | 266 | 112 | [It’s been officially 3 months since I posted my $SIVE long thesis back at 4 SEK. This idea](https://x.com/aleabitoreddit/status/2065779524248510758) |
| 2026-06-14T01:43:24.000Z | unclassified | 137,406 | 492 | 130 | 16 | [Do people in Sweden have a hard time making plans for lunch a day in advance?](https://x.com/aleabitoreddit/status/2065973347897557093) |
| 2026-06-12T08:47:35.000Z | unclassified | 28,300 | 122 | 18 | 26 | [Japan can just stop NCI/Rasa from shipping red phosphorous over to China and cripple the p](https://x.com/aleabitoreddit/status/2065355321338630384) |
| 2026-06-12T15:06:12.000Z | unclassified | 28,269 | 328 | 9 | 7 | [Wow it’s cool to see $SIVE on CNBC now! I’m surprised it’s up there lol](https://x.com/aleabitoreddit/status/2065450603623653587) |
| 2026-06-12T08:48:36.000Z | unclassified | 23,036 | 70 | 9 | 4 | [I don't think there's going to be direct military confrontation due to nukes nowadays. Jus](https://x.com/aleabitoreddit/status/2065355577191243893) |
| 2026-06-12T08:22:26.000Z | unclassified | 20,063 | 125 | 6 | 16 | [(no text)](https://x.com/aleabitoreddit/status/2065348990703661373) |
| 2026-06-14T02:19:51.000Z | unclassified | 15,100 | 104 | 9 | 2 | [Local swedish markets are not very forward looking, so it’s understandable if this is the ](https://x.com/aleabitoreddit/status/2065982517992452441) |

按收藏排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-13T22:51:12.000Z | unclassified | 351,136 | 2,149 | 445 | 379 | [If I had to stereotype my X experiences with markets: China : set on cloning me with AI, c](https://x.com/aleabitoreddit/status/2065930011023204509) |
| 2026-06-13T11:27:47.000Z | reply | 422,250 | 791 | 119 | 279 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| 2026-06-12T08:14:56.000Z | unclassified | 376,659 | 439 | 72 | 167 | [So doing research into some random $TSM, SK Hynix,…](https://x.com/aleabitoreddit/status/2065347103417897423) |
| 2026-06-12T08:31:08.000Z | unclassified | 338,875 | 585 | 253 | 130 | [Bro I still can't believe Japan's WF6 supply chain got shut down from China export control](https://x.com/aleabitoreddit/status/2065351180314955924) |
| 2026-06-13T12:53:13.000Z | unclassified | 331,774 | 1,331 | 266 | 112 | [It’s been officially 3 months since I posted my $SIVE long thesis back at 4 SEK. This idea](https://x.com/aleabitoreddit/status/2065779524248510758) |
| 2026-06-12T14:00:28.000Z | unclassified | 629,842 | 1,240 | 205 | 67 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| 2026-06-12T08:47:35.000Z | unclassified | 28,300 | 122 | 18 | 26 | [Japan can just stop NCI/Rasa from shipping red phosphorous over to China and cripple the p](https://x.com/aleabitoreddit/status/2065355321338630384) |
| 2026-06-12T08:22:26.000Z | unclassified | 20,063 | 125 | 6 | 16 | [(no text)](https://x.com/aleabitoreddit/status/2065348990703661373) |
| 2026-06-14T01:43:24.000Z | unclassified | 137,406 | 492 | 130 | 16 | [Do people in Sweden have a hard time making plans for lunch a day in advance?](https://x.com/aleabitoreddit/status/2065973347897557093) |
| 2026-06-13T21:26:19.000Z | unclassified | 11,983 | 149 | 6 | 15 | [I personally like $SIVE, usually the same names keep on compounding like $SNDK if they’re ](https://x.com/aleabitoreddit/status/2065908647981699572) |

按加权互动分排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-13T22:51:12.000Z | unclassified | 351,136 | 2,149 | 445 | 379 | [If I had to stereotype my X experiences with markets: China : set on cloning me with AI, c](https://x.com/aleabitoreddit/status/2065930011023204509) |
| 2026-06-13T12:53:13.000Z | unclassified | 331,774 | 1,331 | 266 | 112 | [It’s been officially 3 months since I posted my $SIVE long thesis back at 4 SEK. This idea](https://x.com/aleabitoreddit/status/2065779524248510758) |
| 2026-06-12T14:00:28.000Z | unclassified | 629,842 | 1,240 | 205 | 67 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| 2026-06-13T11:27:47.000Z | reply | 422,250 | 791 | 119 | 279 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| 2026-06-12T08:31:08.000Z | unclassified | 338,875 | 585 | 253 | 130 | [Bro I still can't believe Japan's WF6 supply chain got shut down from China export control](https://x.com/aleabitoreddit/status/2065351180314955924) |
| 2026-06-12T08:14:56.000Z | unclassified | 376,659 | 439 | 72 | 167 | [So doing research into some random $TSM, SK Hynix,…](https://x.com/aleabitoreddit/status/2065347103417897423) |
| 2026-06-14T01:43:24.000Z | unclassified | 137,406 | 492 | 130 | 16 | [Do people in Sweden have a hard time making plans for lunch a day in advance?](https://x.com/aleabitoreddit/status/2065973347897557093) |
| 2026-06-12T15:06:12.000Z | unclassified | 28,269 | 328 | 9 | 7 | [Wow it’s cool to see $SIVE on CNBC now! I’m surprised it’s up there lol](https://x.com/aleabitoreddit/status/2065450603623653587) |
| 2026-06-12T08:47:35.000Z | unclassified | 28,300 | 122 | 18 | 26 | [Japan can just stop NCI/Rasa from shipping red phosphorous over to China and cripple the p](https://x.com/aleabitoreddit/status/2065355321338630384) |
| 2026-06-13T21:26:19.000Z | unclassified | 11,983 | 149 | 6 | 15 | [I personally like $SIVE, usually the same names keep on compounding like $SNDK if they’re ](https://x.com/aleabitoreddit/status/2065908647981699572) |

## 互动账号

| account | definite replies | median impressions | example |
|---|---:|---:|---|
| @aleabitoreddit | 1 | 422,250 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |

## 账号风格与增长启发

- 这个账号的核心风格是市场原生研究评论：以 ticker 为入口，给出强观点、供应链推理和公开 thesis update，而不是泛泛转述新闻。
- 它给读者的可见价值是非对称上下文：把冷门供应商、出口管制、地区行为和市场反应串成可投资、可讨论、可收藏的叙事。
- 本次采集中收藏最高的内容是 https://x.com/aleabitoreddit/status/2065930011023204509，说明读者会奖励“具体 thesis + 足够推理、值得回看”的内容。
- 图片/截图有助于让判断看起来有证据，但账号主要还是靠文字推理和市场 framing 获得传播。
- 可复制经验：选择一个窄的信息优势，持续发布有证据的高置信 thesis，公开更新成败，并把复杂供应链事实翻译成简单市场后果。

## 推荐的下一次采集

- 若要 full-fidelity 运行，在滚动前把更新后的 capture script 粘贴到 DevTools Console 的 `https://x.com/aleabitoreddit/with_replies`，以便 hook fetch/XHR 并保留 GraphQL/Relay reply 字段。
- 尽量保留 raw GraphQL responses 或 status-page SSR reply enrichment；DOM-only 行只有出现明确 reply context 时才可判为 reply，否则保持 `unclassified`。
- GraphQL-backed 运行后重新生成本报告，并比较 reply-target leaderboard，这会显著增强“这个账号和谁互动”部分。


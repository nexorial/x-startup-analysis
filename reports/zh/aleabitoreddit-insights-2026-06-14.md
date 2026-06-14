# @aleabitoreddit X 账号外部视角分析

生成时间：2026-06-14T09:01:27.631Z

## 数据来源与分类边界

- 输入记录：来自本地浏览器采集的 39 条时间线记录。
- Capture quality：dom-only。
- 当前账号快照：836,500 followers，175 following，profile post count 7,267。
- 当前数据集中可确定的 replies：1。
- 缺少 reply 元数据的 DOM-only 记录：38。这些只能视为 unclassified/top-level-unknown，不能证明是 posts。
- 本输入的正确解读：1 条 definite replies，加 38 条 DOM-only unclassified。没有 GraphQL/SSR reply enrichment 时，不要把 unclassified 当作 top-level posts。
- 采集限制：Chrome plugin read-only DOM capture; GraphQL/Relay reply fields were not available.
- 采集限制：DOM-only rows without explicit reply context must remain unclassified.
- 采集限制：X virtualizes timelines and appears to stop loading older rows after a small recent window for this account/session.
- 文本限制：DOM recapture 保存的是 X 当前可见文本。如果 X UI 自动翻译了帖子，抓到的可能是译文而非原文。

## 互动指标相关性

基于采集到的公开计数，计算指标之间的 Spearman 相关性：

| pair | rho | interpretation |
|---|---:|---|
| likes vs retweets | 0.95 | very strong |
| retweets vs bookmarks | 0.92 | very strong |
| likes vs bookmarks | 0.89 | very strong |
| likes vs comments | 0.84 | very strong |
| impressions vs bookmarks | 0.84 | very strong |
| impressions vs comments | 0.84 | very strong |
| impressions vs retweets | 0.82 | very strong |
| impressions vs likes | 0.80 | very strong |
| comments vs retweets | 0.80 | very strong |
| comments vs bookmarks | 0.74 | strong |
| impressions vs quotes | 0.00 | weak |
| likes vs quotes | 0.00 | weak |

内容属性与 reach / saves 的相关性：

| attribute | impressions rho | likes rho | bookmarks rho |
|---|---:|---:|---:|
| text length | 0.57 | 0.46 | 0.59 |
| line count | 0.17 | 0.07 | 0.05 |
| has media | 0.63 | 0.62 | 0.50 |
| has external link | 0.00 | 0.00 | 0.00 |
| definite reply | 0.16 | 0.07 | 0.20 |
| local posting hour | 0.20 | 0.03 | -0.09 |

## 发布时间与格式模式

| local time bucket | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 18-23 | 13 | 337,573 | 794 | 41 |
| 00-05 | 8 | 153,671 | 564 | 43 |
| 12-17 | 11 | 40,380 | 156 | 27 |
| 06-11 | 7 | 31,585 | 275 | 16 |

| text length | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 281+ | 7 | 562,794 | 1,080 | 174 |
| 121-280 | 19 | 40,380 | 157 | 27 |
| 41-120 | 12 | 29,300 | 109 | 8 |
| 0 | 1 | 20,119 | 126 | 16 |

| media | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| has media | 14 | 398,114 | 1,285 | 125 |
| text only | 25 | 24,769 | 122 | 10 |

## 主题信号

| topic | records | median impressions | median likes | median bookmarks | example high-reach post |
|---|---:|---:|---:|---:|---|
| AI / semiconductors | 22 | 353,165 | 499 | 93 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |
| markets / investing | 16 | 351,999 | 1,049 | 68 | [Woah, Frankfurt Bank strategists say: 8% of US current-account deficit could be refinanced](https://x.com/aleabitoreddit/status/2065073494220849660) |
| supply chain / geopolitics | 15 | 366,425 | 558 | 130 | [The AI supremacy Wars begins. Think a lot of the upstream supply chain bottlenecks caused ](https://x.com/aleabitoreddit/status/2065650434644304165) |
| culture / regional observations | 11 | 147,226 | 516 | 26 | [If you haven’t noticed too with my other investment themes with 800V DC and CPO recently. ](https://x.com/aleabitoreddit/status/2065114293767741950) |
| product / build notes | 5 | 389,049 | 558 | 119 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |

## 公开信号最高的时间线记录

按曝光排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-11T14:07:42.000Z | unclassified | 951,652 | 1,018 | 348 | 107 | [Woah, Frankfurt Bank strategists say: 8% of US current-account deficit could be refinanced](https://x.com/aleabitoreddit/status/2065073494220849660) |
| 2026-06-11T15:05:53.000Z | unclassified | 753,671 | 1,080 | 294 | 139 | [At this point I can't tell anymore if markets from $META to $MSFT are correcting because o](https://x.com/aleabitoreddit/status/2065088136884220158) |
| 2026-06-11T16:13:28.000Z | unclassified | 700,040 | 1,670 | 226 | 340 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |
| 2026-06-13T04:20:16.000Z | unclassified | 669,920 | 1,876 | 266 | 424 | [The AI supremacy Wars begins. Think a lot of the upstream supply chain bottlenecks caused ](https://x.com/aleabitoreddit/status/2065650434644304165) |
| 2026-06-12T14:00:28.000Z | unclassified | 631,481 | 1,241 | 205 | 67 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| 2026-06-12T04:26:43.000Z | unclassified | 562,794 | 1,440 | 304 | 269 | [Just some reflection, my core high conviction ideas from 2025 aged super well! From $ALAB ](https://x.com/aleabitoreddit/status/2065289672356745561) |
| 2026-06-11T16:49:50.000Z | unclassified | 476,889 | 971 | 185 | 174 | [If you haven’t noticed too with my other investment themes with 800V DC and CPO recently. ](https://x.com/aleabitoreddit/status/2065114293767741950) |
| 2026-06-12T02:39:57.000Z | unclassified | 467,263 | 2,222 | 318 | 272 | [Woah, $NBIS , $ALAB , and $RKLB got added to Nasdaq 100! Fun to see both Astera, Rocketlab](https://x.com/aleabitoreddit/status/2065262802328293497) |
| 2026-06-13T11:27:47.000Z | reply | 427,557 | 794 | 121 | 285 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| 2026-06-13T10:03:47.000Z | unclassified | 403,981 | 1,563 | 182 | 1,013 | [Okay my fellow Koreans, it's been awhile. Foosung (093370, ~$1.2B MC) looks like a massive](https://x.com/aleabitoreddit/status/2065736884752703865) |
| 2026-06-11T17:54:35.000Z | unclassified | 392,246 | 1,328 | 218 | 422 | [New Anthropic news looks like a potential tailwind for the Neocloud colo sector. Such as $](https://x.com/aleabitoreddit/status/2065130589204992048) |
| 2026-06-12T07:22:33.000Z | unclassified | 389,049 | 558 | 212 | 119 | [VPEC new price hikes on Epiwafers today. Positive bottleneck read through on companies lik](https://x.com/aleabitoreddit/status/2065333919252418913) |

按收藏排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-13T10:03:47.000Z | unclassified | 403,981 | 1,563 | 182 | 1,013 | [Okay my fellow Koreans, it's been awhile. Foosung (093370, ~$1.2B MC) looks like a massive](https://x.com/aleabitoreddit/status/2065736884752703865) |
| 2026-06-13T04:20:16.000Z | unclassified | 669,920 | 1,876 | 266 | 424 | [The AI supremacy Wars begins. Think a lot of the upstream supply chain bottlenecks caused ](https://x.com/aleabitoreddit/status/2065650434644304165) |
| 2026-06-11T17:54:35.000Z | unclassified | 392,246 | 1,328 | 218 | 422 | [New Anthropic news looks like a potential tailwind for the Neocloud colo sector. Such as $](https://x.com/aleabitoreddit/status/2065130589204992048) |
| 2026-06-13T22:51:12.000Z | unclassified | 366,425 | 2,212 | 450 | 387 | [If I had to stereotype my X experiences with markets: China : set on cloning me with AI, c](https://x.com/aleabitoreddit/status/2065930011023204509) |
| 2026-06-11T16:13:28.000Z | unclassified | 700,040 | 1,670 | 226 | 340 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |
| 2026-06-13T11:27:47.000Z | reply | 427,557 | 794 | 121 | 285 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| 2026-06-12T02:39:57.000Z | unclassified | 467,263 | 2,222 | 318 | 272 | [Woah, $NBIS , $ALAB , and $RKLB got added to Nasdaq 100! Fun to see both Astera, Rocketlab](https://x.com/aleabitoreddit/status/2065262802328293497) |
| 2026-06-12T04:26:43.000Z | unclassified | 562,794 | 1,440 | 304 | 269 | [Just some reflection, my core high conviction ideas from 2025 aged super well! From $ALAB ](https://x.com/aleabitoreddit/status/2065289672356745561) |
| 2026-06-11T16:49:50.000Z | unclassified | 476,889 | 971 | 185 | 174 | [If you haven’t noticed too with my other investment themes with 800V DC and CPO recently. ](https://x.com/aleabitoreddit/status/2065114293767741950) |
| 2026-06-12T08:14:56.000Z | unclassified | 377,580 | 439 | 72 | 166 | [So doing research into some random $TSM, SK Hynix,…](https://x.com/aleabitoreddit/status/2065347103417897423) |

按加权互动分排序：

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-06-13T10:03:47.000Z | unclassified | 403,981 | 1,563 | 182 | 1,013 | [Okay my fellow Koreans, it's been awhile. Foosung (093370, ~$1.2B MC) looks like a massive](https://x.com/aleabitoreddit/status/2065736884752703865) |
| 2026-06-13T22:51:12.000Z | unclassified | 366,425 | 2,212 | 450 | 387 | [If I had to stereotype my X experiences with markets: China : set on cloning me with AI, c](https://x.com/aleabitoreddit/status/2065930011023204509) |
| 2026-06-12T02:39:57.000Z | unclassified | 467,263 | 2,222 | 318 | 272 | [Woah, $NBIS , $ALAB , and $RKLB got added to Nasdaq 100! Fun to see both Astera, Rocketlab](https://x.com/aleabitoreddit/status/2065262802328293497) |
| 2026-06-13T04:20:16.000Z | unclassified | 669,920 | 1,876 | 266 | 424 | [The AI supremacy Wars begins. Think a lot of the upstream supply chain bottlenecks caused ](https://x.com/aleabitoreddit/status/2065650434644304165) |
| 2026-06-11T16:13:28.000Z | unclassified | 700,040 | 1,670 | 226 | 340 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |
| 2026-06-11T17:54:35.000Z | unclassified | 392,246 | 1,328 | 218 | 422 | [New Anthropic news looks like a potential tailwind for the Neocloud colo sector. Such as $](https://x.com/aleabitoreddit/status/2065130589204992048) |
| 2026-06-12T04:26:43.000Z | unclassified | 562,794 | 1,440 | 304 | 269 | [Just some reflection, my core high conviction ideas from 2025 aged super well! From $ALAB ](https://x.com/aleabitoreddit/status/2065289672356745561) |
| 2026-06-12T15:55:15.000Z | unclassified | 372,641 | 1,553 | 290 | 41 | [$SPCX is now trading! And it’s now over $2.15T+ MC.](https://x.com/aleabitoreddit/status/2065462946785030506) |
| 2026-06-13T12:53:13.000Z | unclassified | 337,573 | 1,338 | 266 | 113 | [It’s been officially 3 months since I posted my $SIVE long thesis back at 4 SEK. This idea](https://x.com/aleabitoreddit/status/2065779524248510758) |
| 2026-06-11T15:05:53.000Z | unclassified | 753,671 | 1,080 | 294 | 139 | [At this point I can't tell anymore if markets from $META to $MSFT are correcting because o](https://x.com/aleabitoreddit/status/2065088136884220158) |

## 互动账号

| account | definite replies | median impressions | example |
|---|---:|---:|---|
| @aleabitoreddit | 1 | 427,557 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |

## 账号风格与增长启发

- 这个账号的核心风格是市场原生研究评论：以 ticker 为入口，给出强观点、供应链推理和公开 thesis update，而不是泛泛转述新闻。
- 它给读者的可见价值是非对称上下文：把冷门供应商、出口管制、地区行为和市场反应串成可投资、可讨论、可收藏的叙事。
- 本次采集中收藏最高的内容是 https://x.com/aleabitoreddit/status/2065736884752703865，说明读者会奖励“具体 thesis + 足够推理、值得回看”的内容。
- 图片/截图有助于让判断看起来有证据，但账号主要还是靠文字推理和市场 framing 获得传播。
- 可复制经验：选择一个窄的信息优势，持续发布有证据的高置信 thesis，公开更新成败，并把复杂供应链事实翻译成简单市场后果。

## 推荐的下一次采集

- 若要 full-fidelity 运行，在滚动前把更新后的 capture script 粘贴到 DevTools Console 的 `https://x.com/aleabitoreddit/with_replies`，以便 hook fetch/XHR 并保留 GraphQL/Relay reply 字段。
- 尽量保留 raw GraphQL responses 或 status-page SSR reply enrichment；DOM-only 行只有出现明确 reply context 时才可判为 reply，否则保持 `unclassified`。
- GraphQL-backed 运行后重新生成本报告，并比较 reply-target leaderboard，这会显著增强“这个账号和谁互动”部分。


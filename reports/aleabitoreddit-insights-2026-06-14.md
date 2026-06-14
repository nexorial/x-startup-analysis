# @aleabitoreddit outside-in X account analysis

Generated: 2026-06-14T09:21:48.183Z

## Source and Classification Boundary

- Input records: 39 timeline items from local browser capture.
- Capture quality: dom-only.
- Full-history status: partial-dom-only. Captured 39 / profile count 7,267.
- Important: this is not a full-history report and should not be treated as a complete picture of all posts/replies.
- Current captured account snapshot: 836,500 followers, 175 following, 7,267 profile post count.
- Definite replies in the current dataset: 1.
- DOM-only items without reply metadata: 38. These must be treated as unclassified/top-level-unknown, not proven posts.
- Correct interpretation for this input: 1 definite replies plus 38 DOM-only unclassified items. Do not treat unclassified rows as top-level posts without GraphQL/SSR reply enrichment.
- Capture limitation: Chrome plugin read-only DOM capture; GraphQL/Relay reply fields were not available.
- Capture limitation: DOM-only rows without explicit reply context must remain unclassified.
- Capture limitation: X virtualizes timelines and appears to stop loading older rows after a small recent window for this account/session.
- Text limitation: DOM recapture stores the text currently visible in X. If X auto-translates a post in the UI, the captured text can be translated rather than the original-language text.

## Engagement Correlations

Metric-to-metric Spearman correlations, using public counts from the capture:

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

Attribute correlations with reach and saves:

| attribute | impressions rho | likes rho | bookmarks rho |
|---|---:|---:|---:|
| text length | 0.57 | 0.46 | 0.59 |
| line count | 0.17 | 0.07 | 0.05 |
| has media | 0.63 | 0.62 | 0.50 |
| has external link | 0.00 | 0.00 | 0.00 |
| definite reply | 0.16 | 0.07 | 0.20 |
| local posting hour | 0.20 | 0.03 | -0.09 |

## Timing and Format Patterns

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

## Topic Signals

| topic | records | median impressions | median likes | median bookmarks | example high-reach post |
|---|---:|---:|---:|---:|---|
| AI / semiconductors | 22 | 353,165 | 499 | 93 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |
| markets / investing | 16 | 351,999 | 1,049 | 68 | [Woah, Frankfurt Bank strategists say: 8% of US current-account deficit could be refinanced](https://x.com/aleabitoreddit/status/2065073494220849660) |
| supply chain / geopolitics | 15 | 366,425 | 558 | 130 | [The AI supremacy Wars begins. Think a lot of the upstream supply chain bottlenecks caused ](https://x.com/aleabitoreddit/status/2065650434644304165) |
| culture / regional observations | 11 | 147,226 | 516 | 26 | [If you haven’t noticed too with my other investment themes with 800V DC and CPO recently. ](https://x.com/aleabitoreddit/status/2065114293767741950) |
| product / build notes | 5 | 389,049 | 558 | 119 | [Markets should be cheering on domestic champions like $AAOI . Since it's ideal to support ](https://x.com/aleabitoreddit/status/2065105141238489398) |

## Top Timeline Items by Public Signals

By impressions:

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

By bookmarks:

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

By weighted engagement score:

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

## Interaction Accounts

| account | definite replies | median impressions | example |
|---|---:|---:|---|
| @aleabitoreddit | 1 | 427,557 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |

## Account Style and Growth Lessons

- The account’s core style is market-native research commentary: ticker-led posts, strong opinions, supply-chain reasoning, and public thesis updates rather than generic news aggregation.
- The visible value to followers is asymmetric context: it links obscure suppliers, export controls, regional behavior, and market reactions into investable narratives readers can debate or save.
- The strongest saved item in this capture is https://x.com/aleabitoreddit/status/2065736884752703865, which suggests followers reward posts that combine a concrete thesis with enough reasoning to revisit later.
- Media appears to help because screenshots/charts make the claim feel evidenced, but the account still relies primarily on text reasoning and market framing.
- Replication lesson: pick a narrow information edge, publish high-conviction theses with receipts, update winners and losers publicly, and turn complex supply-chain facts into simple market consequences.

## Recommended Next Capture

- For the next full-fidelity run, paste the updated capture script directly into DevTools Console on `https://x.com/aleabitoreddit/with_replies` before scrolling so it can hook fetch/XHR and preserve GraphQL/Relay reply fields.
- Keep raw GraphQL responses or status-page SSR reply enrichment when possible; DOM-only rows should remain `unclassified` unless an explicit reply context is present.
- Regenerate this report after the GraphQL-backed run and compare the reply-target leaderboard. That will make the “who this account interacts with” section much stronger.


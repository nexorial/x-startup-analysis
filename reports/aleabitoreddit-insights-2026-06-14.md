# @aleabitoreddit outside-in X account analysis

Generated: 2026-06-14T07:37:55.525Z

## Source and Classification Boundary

- Input records: 14 timeline items from local browser capture.
- Capture quality: dom-only.
- Current captured account snapshot: 836,400 followers, 175 following, 7,267 profile post count.
- Definite replies in the current dataset: 1.
- DOM-only items without reply metadata: 13. These must be treated as unclassified/top-level-unknown, not proven posts.
- Correct interpretation for this input: 1 definite replies plus 13 DOM-only unclassified items. Do not treat unclassified rows as top-level posts without GraphQL/SSR reply enrichment.
- Capture limitation: Chrome plugin read-only DOM capture; GraphQL/Relay reply fields were not available.
- Text limitation: DOM recapture stores the text currently visible in X. If X auto-translates a post in the UI, the captured text can be translated rather than the original-language text.

## Engagement Correlations

Metric-to-metric Spearman correlations, using public counts from the capture:

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

Attribute correlations with reach and saves:

| attribute | impressions rho | likes rho | bookmarks rho |
|---|---:|---:|---:|
| text length | 0.50 | 0.47 | 0.46 |
| line count | 0.24 | 0.17 | 0.07 |
| has media | 0.45 | 0.54 | 0.32 |
| has external link | 0.00 | 0.00 | 0.00 |
| definite reply | 0.38 | 0.24 | 0.38 |
| local posting hour | 0.53 | 0.31 | 0.17 |

## Timing and Format Patterns

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

## Topic Signals

| topic | records | median impressions | median likes | median bookmarks | example high-reach post |
|---|---:|---:|---:|---:|---|
| AI / semiconductors | 8 | 345,006 | 512 | 99 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| markets / investing | 7 | 28,269 | 328 | 15 | [All the $SNDK short sellers went extinct. Can’t believe it’s almost $2000 now? That aside ](https://x.com/aleabitoreddit/status/2065434058474307866) |
| supply chain / geopolitics | 6 | 345,006 | 512 | 149 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| culture / regional observations | 6 | 238,141 | 539 | 78 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |
| product / build notes | 1 | 28,300 | 122 | 26 | [Japan can just stop NCI/Rasa from shipping red phosphorous over to China and cripple the p](https://x.com/aleabitoreddit/status/2065355321338630384) |

## Top Timeline Items by Public Signals

By impressions:

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

By bookmarks:

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

By weighted engagement score:

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

## Interaction Accounts

| account | definite replies | median impressions | example |
|---|---:|---:|---|
| @aleabitoreddit | 1 | 422,250 | [Are Korean mothers naturally this impressive? It's truly astonishing that your mother gras](https://x.com/aleabitoreddit/status/2065758024896037020) |

## Account Style and Growth Lessons

- The account’s core style is market-native research commentary: ticker-led posts, strong opinions, supply-chain reasoning, and public thesis updates rather than generic news aggregation.
- The visible value to followers is asymmetric context: it links obscure suppliers, export controls, regional behavior, and market reactions into investable narratives readers can debate or save.
- The strongest saved item in this capture is https://x.com/aleabitoreddit/status/2065930011023204509, which suggests followers reward posts that combine a concrete thesis with enough reasoning to revisit later.
- Media appears to help because screenshots/charts make the claim feel evidenced, but the account still relies primarily on text reasoning and market framing.
- Replication lesson: pick a narrow information edge, publish high-conviction theses with receipts, update winners and losers publicly, and turn complex supply-chain facts into simple market consequences.

## Recommended Next Capture

- For the next full-fidelity run, paste the updated capture script directly into DevTools Console on `https://x.com/aleabitoreddit/with_replies` before scrolling so it can hook fetch/XHR and preserve GraphQL/Relay reply fields.
- Keep raw GraphQL responses or status-page SSR reply enrichment when possible; DOM-only rows should remain `unclassified` unless an explicit reply context is present.
- Regenerate this report after the GraphQL-backed run and compare the reply-target leaderboard. That will make the “who this account interacts with” section much stronger.


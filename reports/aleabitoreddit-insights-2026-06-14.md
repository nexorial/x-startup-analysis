# @aleabitoreddit outside-in X account analysis

Generated: 2026-06-14T11:12:42.594Z

## Source and Classification Boundary

- Input records: 1,474 timeline items from local browser capture.
- Capture quality: mixed.
- Full-history status: not-exhausted. Captured 1,474 / profile count 7,267.
- Important: this is not a full-history report and should not be treated as a complete picture of all posts/replies.
- Current captured account snapshot: 837,000 followers, 175 following, 7,267 profile post count.
- Definite replies in the current dataset: 1,002.
- DOM-only items without reply metadata: 260. These must be treated as unclassified/top-level-unknown, not proven posts.
- Correct interpretation for this input: 1,002 definite replies plus 260 DOM-only unclassified items. Do not treat unclassified rows as top-level posts without GraphQL/SSR reply enrichment.
- Capture limitation: CDP captured GraphQL/Relay responses and merged visible DOM rows.
- Capture limitation: CDP request credentials are used in memory for local pagination and are not written to raw/report outputs.
- Capture limitation: UserTweets page 25 failed with HTTP 429 (limit=50, remaining=0, reset=2026-06-14T10:50:56.000Z): Rate limit exceeded
- Capture limitation: UserTweetsAndReplies page 5 failed with HTTP 404 (limit=500, remaining=492, reset=2026-06-14T10:51:46.000Z):
- Capture limitation: CDP full-history pagination is not proven because at least one required GraphQL source was missing or stopped before cursor exhaustion.
- Capture limitation: DOM automation cannot prove top-level status for rows without explicit reply context; those rows must remain unclassified.
- Capture limitation: X search date-window DOM capture; GraphQL/Relay reply fields were not available.
- Capture limitation: Rows without explicit Replying to @... context remain unclassified.
- Capture limitation: Browser-only X search can omit deleted, unavailable, subscriber-only, or de-indexed posts and may stop paginating inside a date window.
- Capture limitation: X search DOM capture; GraphQL/Relay reply fields were not available.
- Capture limitation: Search results may omit posts or stop paginating before the full account history.
- Capture limitation: DOM-only rows without explicit reply context must remain unclassified.
- Capture limitation: Chrome plugin read-only DOM capture; GraphQL/Relay reply fields were not available.
- Capture limitation: X virtualizes timelines and appears to stop loading older rows after a small recent window for this account/session.
- Capture limitation: X virtualizes timelines, so the report covers the rows loaded before the timeline stopped changing.
- Capture limitation: This capture is the best local union of available aleabitoreddit captures, not an exhausted full-history capture.
- Capture limitation: The best local union captured 1,474 unique records against a visible profile count of 7,267 posts (about 20.3%).
- Capture limitation: CDP GraphQL pagination did not reach source exhaustion: UserTweets hit rate-limit boundaries and UserTweetsAndReplies hit cursor/source errors in the latest live attempts.
- Capture limitation: DOM-only records without explicit reply or conversation evidence remain unclassified and must not be counted as top-level posts.
- Capture limitation: X does not expose an available-public non-subscriber denominator; subscriber-only, deleted, unavailable, protected, or session-gated records may be included in the profile count but unavailable to this viewer.
- Capture limitation: Chrome plugin read-only search DOM capture; GraphQL/Relay reply fields were not available.
- Text limitation: DOM recapture stores the text currently visible in X. If X auto-translates a post in the UI, the captured text can be translated rather than the original-language text.

## Engagement Correlations

Metric-to-metric Spearman correlations, using public counts from the capture:

| pair | rho | interpretation |
|---|---:|---|
| retweets vs bookmarks | 0.90 | very strong |
| likes vs retweets | 0.90 | very strong |
| impressions vs likes | 0.90 | very strong |
| likes vs comments | 0.90 | very strong |
| impressions vs retweets | 0.88 | very strong |
| impressions vs comments | 0.86 | very strong |
| impressions vs bookmarks | 0.86 | very strong |
| likes vs bookmarks | 0.85 | very strong |
| comments vs retweets | 0.83 | very strong |
| comments vs bookmarks | 0.78 | very strong |
| impressions vs quotes | 0.78 | very strong |
| comments vs quotes | 0.77 | very strong |

Attribute correlations with reach and saves:

| attribute | impressions rho | likes rho | bookmarks rho |
|---|---:|---:|---:|
| text length | 0.58 | 0.56 | 0.67 |
| line count | 0.03 | 0.04 | 0.03 |
| has media | 0.60 | 0.57 | 0.55 |
| has external link | 0.07 | 0.07 | 0.09 |
| definite reply | -0.71 | -0.73 | -0.70 |
| local posting hour | 0.10 | 0.11 | 0.03 |

## Timing and Format Patterns

| local time bucket | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 18-23 | 329 | 40,175 | 219 | 26 |
| 06-11 | 355 | 34,079 | 208 | 28 |
| 12-17 | 420 | 29,801 | 185 | 21 |
| 00-05 | 370 | 24,047 | 139 | 19 |

| text length | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| 281+ | 317 | 387,413 | 1,044 | 247 |
| 121-280 | 794 | 25,279 | 159 | 20 |
| 41-120 | 289 | 15,294 | 99 | 4 |
| 0 | 5 | 14,717 | 126 | 9 |
| 1-40 | 69 | 13,302 | 90 | 3 |

| media | records | median impressions | median likes | median bookmarks |
|---|---:|---:|---:|---:|
| has media | 549 | 310,158 | 1,041 | 198 |
| text only | 925 | 17,544 | 118 | 10 |

## Topic Signals

| topic | records | median impressions | median likes | median bookmarks | example high-reach post |
|---|---:|---:|---:|---:|---|
| AI / semiconductors | 696 | 160,847 | 588 | 83 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| markets / investing | 522 | 194,317 | 637 | 102 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| supply chain / geopolitics | 360 | 194,074 | 632 | 128 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| culture / regional observations | 205 | 189,868 | 703 | 100 | [Here's a bunch of random 30 US-available random stocks I like today and why: 1. $INTC - Am](https://x.com/aleabitoreddit/status/2042187668931616964) |
| product / build notes | 132 | 287,644 | 750 | 187 | [Here's a bunch of random 30 US-available random stocks I like today and why: 1. $INTC - Am](https://x.com/aleabitoreddit/status/2042187668931616964) |

## Top Timeline Items by Public Signals

By impressions:

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2025-12-26T15:08:13.000Z | post | 6,462,079 | 4,014 | 140 | 6,553 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| 2026-06-05T02:31:16.000Z | post | 4,834,455 | 7,238 | 1,770 | 3,270 | [Specially written for my Chinese readers: LeaderDrive (688017, 57.73 billion RMB) is the C](https://x.com/aleabitoreddit/status/2062723902728802341) |
| 2026-06-04T04:24:55.000Z | reply | 4,791,191 | 7,197 | 1,036 | 372 | [I now am the #1 most subscribed to account on the entire X platform! After overtaking Elon](https://x.com/aleabitoreddit/status/2062390116820365350) |
| 2026-04-09T10:27:36.000Z | quote | 4,159,838 | 7,687 | 229 | 15,501 | [Here's a bunch of random 30 US-available random stocks I like today and why: 1. $INTC - Am](https://x.com/aleabitoreddit/status/2042187668931616964) |
| 2026-03-11T08:28:37.000Z | post | 3,142,814 | 918 | 85 | 816 | [Changed my mind about Soitec ( $SLOIF ) and took a sizable position ~43 for CPO exposure. ](https://x.com/aleabitoreddit/status/2031648475310616604) |
| 2026-05-17T15:39:47.000Z | post | 2,992,403 | 3,389 | 276 | 927 | [Donald Trump is apparently long Sushi. I genuinely find it hilarious the President took a ](https://x.com/aleabitoreddit/status/2056036968220528767) |
| 2026-05-24T15:56:29.000Z | post | 2,852,509 | 2,805 | 570 | 3,117 | [All right chat, crowdsourcing your #1 highest conviction (10x only) stock long for the Pow](https://x.com/aleabitoreddit/status/2058577885754163382) |
| 2026-01-22T10:06:37.000Z | quote | 2,353,447 | 1,742 | 120 | 917 | [$MU looks like the next Nvidia. When Nvidia was $400B (now $4.5T+), markets thought GPUs w](https://x.com/aleabitoreddit/status/2014278521741553793) |
| 2026-05-23T06:50:41.000Z | post | 2,260,194 | 3,955 | 341 | 463 | [2 Year Return: 22,561.99% Pretty decent, right anon?](https://x.com/aleabitoreddit/status/2058078143559372866) |
| 2026-06-08T06:22:58.000Z | quote | 2,155,730 | 1,952 | 381 | 2,180 | [Okay chat, here's your compiled list chat of your favorite 800V DC related ideas. 1. $IFNN](https://x.com/aleabitoreddit/status/2063869376542192013) |
| 2026-02-13T12:16:49.000Z | quote | 2,020,912 | 785 | 45 | 664 | [Trade idea that I published to my shower thoughts channel: Korean Index volatility arbitra](https://x.com/aleabitoreddit/status/2022283819374854167) |
| 2026-06-08T06:51:10.000Z | quote | 2,017,263 | 817 | 597 | 171 | [???? Everyone knows this is just a crowdsourced list, right? How did 300376 rise by 20% lo](https://x.com/aleabitoreddit/status/2063876472419533110) |

By bookmarks:

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-04-09T10:27:36.000Z | quote | 4,159,838 | 7,687 | 229 | 15,501 | [Here's a bunch of random 30 US-available random stocks I like today and why: 1. $INTC - Am](https://x.com/aleabitoreddit/status/2042187668931616964) |
| 2025-12-26T15:08:13.000Z | post | 6,462,079 | 4,014 | 140 | 6,553 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| 2026-05-12T23:00:30.000Z | quote | 761,017 | 3,619 | 235 | 5,166 | [Here's the humanoid exposure crowdsourced list: - $OUST - Rainbow Robotics (277810) - $AMB](https://x.com/aleabitoreddit/status/2054335940026573222) |
| 2026-04-26T17:09:03.000Z | unclassified | 538,050 | 2,826 | 149 | 3,503 | [TLDR of recent news + bottlenecks that go brr: 1. CPU bottleneck - $INTC CEO said AI infer](https://x.com/aleabitoreddit/status/2048449289152778686) |
| 2026-05-17T01:28:37.000Z | quote | 654,208 | 2,734 | 153 | 3,326 | [When I see comments like this (and there are a lot) from retail investors: I immediately t](https://x.com/aleabitoreddit/status/2055822766600016238) |
| 2026-06-05T02:31:16.000Z | post | 4,834,455 | 7,238 | 1,770 | 3,270 | [Specially written for my Chinese readers: LeaderDrive (688017, 57.73 billion RMB) is the C](https://x.com/aleabitoreddit/status/2062723902728802341) |
| 2026-05-24T15:56:29.000Z | post | 2,852,509 | 2,805 | 570 | 3,117 | [All right chat, crowdsourcing your #1 highest conviction (10x only) stock long for the Pow](https://x.com/aleabitoreddit/status/2058577885754163382) |
| 2026-05-15T21:34:26.000Z | quote | 1,464,286 | 4,893 | 316 | 3,109 | [Leopold Aschenbrenner is a legend, but I'm not quite sure he can beat 3152.77% YTD in the ](https://x.com/aleabitoreddit/status/2055401446397690311) |
| 2026-05-30T01:39:24.000Z | reply | 979,123 | 2,919 | 252 | 2,756 | [- $AAOI at $12B - $SIVE at $2B - Foci at $2.8B - Shunsin at $2B Usually the best risk/rewa](https://x.com/aleabitoreddit/status/2060536520952754374) |
| 2026-05-19T10:59:03.000Z | post | 1,048,056 | 2,929 | 234 | 2,697 | [https://t.co/IJPmDDBHcq](https://x.com/aleabitoreddit/status/2056691097594925522) |

By weighted engagement score:

| time | type | impressions | likes | comments | bookmarks | text |
|---|---|---:|---:|---:|---:|---|
| 2026-04-09T10:27:36.000Z | quote | 4,159,838 | 7,687 | 229 | 15,501 | [Here's a bunch of random 30 US-available random stocks I like today and why: 1. $INTC - Am](https://x.com/aleabitoreddit/status/2042187668931616964) |
| 2026-06-05T02:31:16.000Z | post | 4,834,455 | 7,238 | 1,770 | 3,270 | [Specially written for my Chinese readers: LeaderDrive (688017, 57.73 billion RMB) is the C](https://x.com/aleabitoreddit/status/2062723902728802341) |
| 2025-12-26T15:08:13.000Z | post | 6,462,079 | 4,014 | 140 | 6,553 | [Warning: The entire AI industry will likely be bottlenecked by two companies: 1. $AXTI ($7](https://x.com/aleabitoreddit/status/2004569946492453003) |
| 2026-05-12T23:00:30.000Z | quote | 761,017 | 3,619 | 235 | 5,166 | [Here's the humanoid exposure crowdsourced list: - $OUST - Rainbow Robotics (277810) - $AMB](https://x.com/aleabitoreddit/status/2054335940026573222) |
| 2026-05-15T21:34:26.000Z | quote | 1,464,286 | 4,893 | 316 | 3,109 | [Leopold Aschenbrenner is a legend, but I'm not quite sure he can beat 3152.77% YTD in the ](https://x.com/aleabitoreddit/status/2055401446397690311) |
| 2026-05-23T16:55:31.000Z | reply | 1,749,296 | 4,997 | 402 | 2,086 | [I don't post dollar amounts because they don't matter. What matters is return %. Speaking ](https://x.com/aleabitoreddit/status/2058230354063102028) |
| 2026-04-26T17:09:03.000Z | unclassified | 538,050 | 2,826 | 149 | 3,503 | [TLDR of recent news + bottlenecks that go brr: 1. CPU bottleneck - $INTC CEO said AI infer](https://x.com/aleabitoreddit/status/2048449289152778686) |
| 2026-05-24T15:56:29.000Z | post | 2,852,509 | 2,805 | 570 | 3,117 | [All right chat, crowdsourcing your #1 highest conviction (10x only) stock long for the Pow](https://x.com/aleabitoreddit/status/2058577885754163382) |
| 2026-05-17T01:28:37.000Z | quote | 654,208 | 2,734 | 153 | 3,326 | [When I see comments like this (and there are a lot) from retail investors: I immediately t](https://x.com/aleabitoreddit/status/2055822766600016238) |
| 2026-06-04T04:24:55.000Z | reply | 4,791,191 | 7,197 | 1,036 | 372 | [I now am the #1 most subscribed to account on the entire X platform! After overtaking Elon](https://x.com/aleabitoreddit/status/2062390116820365350) |

## Interaction Accounts

| account | definite replies | median impressions | example |
|---|---:|---:|---|
| @aleabitoreddit | 77 | 436,292 | [I now am the #1 most subscribed to account on the entire X platform! After overtaking Elon](https://x.com/aleabitoreddit/status/2062390116820365350) |
| @beauty_oe | 14 | 25,559 | [Yeah! This is the first time I’m seeing $SIVE listed on EU chips act 2. I think it’s very ](https://x.com/aleabitoreddit/status/2059563134030164060) |
| @PhotonCap | 8 | 24,723 | [Yep spot on, there’s a lot of nuance in more advanced fields that AI doesn’t fully underst](https://x.com/aleabitoreddit/status/2058460048800821738) |
| @soulbiri1 | 8 | 20,195 | [I think only $IBIT / $XLU / $META / $CRCL are red since that mention. Maybe like 1-2 flat ](https://x.com/aleabitoreddit/status/2063989689280061694) |
| @Jornka329996 | 7 | 35,647 | [I’d be disappointed if $FLNC didn’t triple digit return in two months. I’m trying to hit 3](https://x.com/aleabitoreddit/status/2053751559033692218) |
| @XtineFang | 7 | 21,926 | [It’s probably going to end up a lot less if you’re curious! There’s likely flat TX fees fr](https://x.com/aleabitoreddit/status/2062451355684663399) |
| @ravietweet | 6 | 167,828 | [Not exactly! I'm just a tad more familiar with photonic supply chains than I am with energ](https://x.com/aleabitoreddit/status/2026647347237966298) |
| @_king142 | 6 | 24,065 | [Both at once](https://x.com/aleabitoreddit/status/2062698410743148811) |
| @softmaxedx | 6 | 12,121 | [Thanks! Really nice of you to say. Yeah I’ve gotten a lot of mean comments even back at 8 ](https://x.com/aleabitoreddit/status/2061769121134788656) |
| @StormDirac | 6 | 10,428 | [“Sivers Semiconductors’ laser arrays will be integrated into reference designs built on GF](https://x.com/aleabitoreddit/status/2061691323242148281) |
| @aphexinvests | 5 | 43,630 | [$SIVE was a massive transfer from Swedish locals to US investors. Locals waited many, many](https://x.com/aleabitoreddit/status/2050272539851821157) |
| @tw_crypto_ | 5 | 14,428 | [Early? It's at the very beginning, and everyone gets to frontrun the next major supercycle](https://x.com/aleabitoreddit/status/2051804731946021161) |
| @crux_capital_ | 5 | 10,658 | [Oh nice! Did you have a transcript of the interview](https://x.com/aleabitoreddit/status/2046620969645826372) |
| @jukan05 | 4 | 235,605 | [Sorry but Stacy is trolling if they are applying standard financial modeling to $INTC and ](https://x.com/aleabitoreddit/status/2011006623893123154) |
| @halldj00 | 4 | 29,294 | [There's stuff I trade, and stuff I invest in. I haven't sold a single $SIVE share since I ](https://x.com/aleabitoreddit/status/2047230186739900428) |
| @pennycheck | 4 | 26,245 | [Was aware of $AOSL , just went with $NVTS instead.](https://x.com/aleabitoreddit/status/2047021963391238380) |
| @pepemoonboy | 4 | 20,706 | [Yep, $NBIS in specific looks like the next hyperscaler! excited to see its growth](https://x.com/aleabitoreddit/status/2065263956768457132) |
| @offermemoneyXYZ | 4 | 17,747 | [$LITE is a lobster and the final surf and turf. $AAOI is the steamer who also sells the fi](https://x.com/aleabitoreddit/status/2049021098176704596) |
| @TLEROY5 | 4 | 16,585 | [I mean $SIVE delivered everything I wanted to hear on their optical side? -> Volume ramp s](https://x.com/aleabitoreddit/status/2054870737618604515) |
| @SidkMena | 4 | 16,518 | [I don't have positions anymore, so no comment there. I'm just saying it's probably not a g](https://x.com/aleabitoreddit/status/2057133389485162877) |

## Account Style and Growth Lessons

- The account’s core style is market-native research commentary: ticker-led posts, strong opinions, supply-chain reasoning, and public thesis updates rather than generic news aggregation.
- The visible value to followers is asymmetric context: it links obscure suppliers, export controls, regional behavior, and market reactions into investable narratives readers can debate or save.
- The strongest saved item in this capture is https://x.com/aleabitoreddit/status/2042187668931616964, which suggests followers reward posts that combine a concrete thesis with enough reasoning to revisit later.
- Media appears to help because screenshots/charts make the claim feel evidenced, but the account still relies primarily on text reasoning and market framing.
- Replication lesson: pick a narrow information edge, publish high-conviction theses with receipts, update winners and losers publicly, and turn complex supply-chain facts into simple market consequences.

## Recommended Next Capture

- For the next full-fidelity run, paste the updated capture script directly into DevTools Console on `https://x.com/aleabitoreddit/with_replies` before scrolling so it can hook fetch/XHR and preserve GraphQL/Relay reply fields.
- Keep raw GraphQL responses or status-page SSR reply enrichment when possible; DOM-only rows should remain `unclassified` unless an explicit reply context is present.
- Regenerate this report after the GraphQL-backed run and compare the reply-target leaderboard. That will make the “who this account interacts with” section much stronger.


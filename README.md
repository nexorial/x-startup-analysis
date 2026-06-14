# x-startup-analysis

[中文说明](README.zh-CN.md)

`x-startup-analysis` is a reusable Codex Skill and local CLI workflow for studying how an X account grew from the outside.

It captures public timeline data from an X profile, classifies posts/replies conservatively, analyzes public engagement metrics, and generates reports that answer:

- What does this account post about?
- Which posts got reach, likes, replies, reposts, quotes, and bookmarks?
- Which formats, topics, and posting times appear to perform better?
- Which accounts does the target interact with when reply metadata is available?
- What can another creator learn or copy from this account?

The project does **not** require X's official API and does not need access to the account owner's X analytics dashboard.

## Why I Created This

X's own analytics dashboard is useful only if you own the account. But a lot of growth learning comes from studying accounts from the outside:

- What did they publish before they became large?
- What kind of content gets saved or shared?
- How much of their distribution comes from replies and interactions?
- What value do followers seem to reward?

This Skill was created to make that outside-in analysis repeatable. Give it any public X handle, run the workflow, and get a structured local report that can be inspected, shared, or improved.

## Features

- **No X API required**: capture from logged-in browser pages or existing local GraphQL/JSON captures.
- **CLI-first workflow**: one command generates raw capture, timeline Markdown, CSV, insights Markdown, and a run summary.
- **Reusable Codex Skill**: includes `skills/x-startup-analysis/SKILL.md` for installation into `~/.codex/skills`.
- **Language pre-config**: reports can be generated in English or Chinese with `--language en|zh`.
- **Conservative post/reply classification**: DOM-only rows without parent/reply evidence are marked `unclassified`, never blindly treated as top-level posts.
- **Capture quality labels**: summaries expose `graphql`, `mixed`, `dom-only`, or `unknown`.
- **Full-history gate**: publishable account examples should use exhausted GraphQL posts+replies pagination. Use `--require-full-history` to stop before report generation when the capture cannot prove full posts/replies coverage.
- **Automated CDP GraphQL pagination**: use a remote-debugging Chrome profile to let the CLI capture authenticated `UserTweets` and `UserTweetsAndReplies` request templates, then paginate cursors locally without writing credentials to reports.
- **Authenticated cURL import**: when CDP is unavailable, copy `UserTweets` and `UserTweetsAndReplies` requests from Chrome DevTools into local gitignored files and let the CLI paginate cursors from those requests.
- **Explicit limitation reporting**: run summaries preserve capture quality, cursor exhaustion, rate-limit, and source-boundary evidence so incomplete captures are not presented as full account history.
- **Rich insights reports**: each report explains the account's source/capture boundary, metric correlations across impressions, likes, replies, reposts, quotes, and bookmarks, attribute correlations for text length/media/links/timing, topic signals, top timeline items by public signals, interaction accounts, and concrete replication lessons.
- **Account style and habit analysis**: reports summarize the underlying account's posting style, recurring habits, reader value, niche positioning, and what followers appear to reward.
- **Outside-in growth insights**: designed to answer what the account did to gain followers and what another creator can learn from it.
- **Local-first outputs**: Markdown and CSV files are easy to inspect, commit, or publish.

## Example Analysis

This repository includes a verified recent-window DOM-only analysis for [`@aleabitoreddit`](https://x.com/aleabitoreddit), captured on June 14, 2026:

- [Timeline report](reports/aleabitoreddit-2026-06-14.md)
- [Insights report](reports/aleabitoreddit-insights-2026-06-14.md)
- [CSV export](reports/aleabitoreddit-2026-06-14.csv)
- [Run summary](reports/aleabitoreddit-run-summary-2026-06-14.json)
- [Chinese timeline report](reports/zh/aleabitoreddit-2026-06-14.md)
- [Chinese insights report](reports/zh/aleabitoreddit-insights-2026-06-14.md)

Important boundary: a report is not considered a full account picture unless the run summary says `completeness.isFullHistory: true`. DOM-only recent-window reports are validation artifacts only. Full posts/replies analysis requires GraphQL/Relay pagination from CDP or local DevTools cURL files.

Current `@aleabitoreddit` validation status: the best local union captured 1,474 unique records, about 20.3% of the visible profile count of 7,267 posts. That is useful for method validation and partial analysis, but it is not a complete account history. X returned rate limits and cursor errors before cursor exhaustion.

## Current Limitations

This project is an outside-in analysis tool, not a privileged archive of X.

- **No guarantee of full coverage for every account**: X can stop pagination through rate limits, server-side cursor errors, 404 responses, unavailable records, deleted posts, protected content, viewer blocks, or other account/session boundaries.
- **Subscriber-only content is not required or expected**: the tool is designed for externally available analysis. Subscriber-only posts may be counted in X's profile total but unavailable to the current viewer and should not be treated as missing public data.
- **The profile post count is an imperfect denominator**: X exposes a visible total such as "7,267 posts," but it does not separately expose "available non-subscriber posts/replies." Coverage percentages against the profile count are therefore conservative and may understate available-public coverage.
- **DOM-only capture is incomplete by design**: browser DOM rows are affected by X virtualization, search indexing, translation, and pagination limits. DOM rows without explicit reply context are marked `unclassified`, not top-level posts.
- **GraphQL/CDP is best effort, not magic**: authenticated CDP can capture real GraphQL request templates and paginate them, but X can still rate-limit `UserTweets` or return cursor failures for `UserTweetsAndReplies`. The CLI records those failures and refuses full-history output when sources are not exhausted.
- **Reports are only publishable as full-history when gated**: use `--require-full-history` for canonical examples. If the run summary says `not-exhausted`, `partial-dom-only`, `missing-replies-source`, or `source-exhausted-count-gap`, treat the report as partial.
- **Historical follower growth is not reconstructed from X alone**: public profile pages generally expose the current follower count only. Historical growth needs repeated snapshots or external archives.

## Repository Structure

```text
.
├── SKILL.md                         # Repo-local Skill entrypoint
├── skills/x-startup-analysis/        # Distributable Codex Skill package
├── scripts/
│   ├── x-startup-analysis-run.mjs    # CLI orchestrator
│   ├── x-startup-analysis.mjs        # Timeline Markdown/CSV renderer
│   ├── x-startup-analysis-insights.mjs
│   └── x-startup-analysis-capture.js # DevTools capture script
├── lib/
│   └── x-startup-analysis-core.mjs   # Extraction, merge, classification, rendering core
├── fixtures/                         # Small deterministic test capture
├── reports/                          # Example analysis reports
└── tests/                            # Node test suite
```

Generated browser captures under `data/raw/` are ignored by default because they may contain large or account-adjacent public data. Commit only the reports you intend to publish.

## Installation

Requirements:

- Node.js 20+
- npm
- Google Chrome if you want live browser capture
- Optional: Chrome remote debugging/CDP if you want stronger automatic GraphQL capture

Clone and test:

```bash
git clone https://github.com/Nexorial/x-startup-analysis.git
cd x-startup-analysis
npm test
```

Install the Codex Skill locally:

```bash
mkdir -p ~/.codex/skills
cp -R skills/x-startup-analysis ~/.codex/skills/x-startup-analysis
```

## Usage

First choose a report language:

- English: `--language en`
- Chinese: `--language zh`

Run the default workflow:

```bash
npm run run -- --username aleabitoreddit --language en
```

Run a publishable full-history workflow from an isolated CDP Chrome profile:

```bash
npm run chrome:cdp
# Log in to X in the Chrome window that opens.
npm run run -- \
  --username aleabitoreddit \
  --language en \
  --require-full-history
```

The CDP workflow uses request credentials in memory only. They are not written to raw JSON, Markdown, CSV, or run-summary outputs. The dedicated `.chrome-cdp-profile/` browser state is gitignored.

If CDP is unavailable, run a publishable full-history workflow from local DevTools cURL files:

```bash
mkdir -p x_curl
# Save Chrome DevTools "Copy as cURL" output as:
# x_curl/UserTweets.curl
# x_curl/UserTweetsAndReplies.curl
npm run run -- \
  --username aleabitoreddit \
  --language en \
  --curl-dir x_curl \
  --require-full-history
```

The CLI writes:

```text
data/raw/<username>-YYYY-MM-DD.json
reports/<username>-YYYY-MM-DD.md
reports/<username>-YYYY-MM-DD.csv
reports/<username>-insights-YYYY-MM-DD.md
reports/<username>-run-summary-YYYY-MM-DD.json
```

If you already have a capture JSON/JSONL file:

```bash
npm run run -- \
  --username aleabitoreddit \
  --language en \
  --input data/raw/aleabitoreddit.json \
  --no-snapshot
```

Generate only the timeline report:

```bash
npm run analyze -- \
  --username aleabitoreddit \
  --language en \
  --input data/raw/aleabitoreddit.json \
  --out reports/aleabitoreddit.md \
  --csv reports/aleabitoreddit.csv
```

Generate only the insights report:

```bash
npm run insights -- \
  --username aleabitoreddit \
  --language en \
  --input data/raw/aleabitoreddit.json \
  --out reports/aleabitoreddit-insights.md
```

## Capture Quality

Every run summary includes `captureQuality`:

- `graphql`: GraphQL/Relay/SSR data was available. Reply classification is strongest.
- `mixed`: GraphQL and DOM rows were merged.
- `dom-only`: visible DOM rows only. Rows without explicit reply context remain `unclassified`.
- `unknown`: empty or source-poor input.

Every run summary also includes `completeness`:

- `full-history`: GraphQL-backed posts+replies sources were exhausted and profile count coverage is satisfied.
- `source-exhausted-count-gap`: GraphQL sources ended, but the captured unique record count is lower than the profile post count. Treat as incomplete unless you can explain unavailable/deleted/subscriber-only rows.
- `not-exhausted`: pagination stopped before the bottom cursor ended.
- `missing-replies-source`: posts were captured, but replies were not.
- `partial-dom-only`: visible DOM rows only.

Use `--require-full-history` for reports intended as canonical examples. It exits before report generation unless the run is full.

### Copy Full-History cURL Requests

Preferred path: run `npm run chrome:cdp`, log in to X in the dedicated Chrome window, then run the normal CLI with `--require-full-history`. The CLI will observe `UserTweets` and `UserTweetsAndReplies` through CDP and paginate them automatically.

Fallback path: if CDP is unavailable, use Chrome DevTools:

1. Log in to X in Chrome and open `https://x.com/<username>/with_replies`.
2. Open DevTools, select `Network`, then `Fetch/XHR`.
3. Filter by `UserTweets`.
4. Refresh and scroll enough for X to load both profile timeline request types.
5. Right-click the `UserTweets` request, choose `Copy` -> `Copy as cURL`, and save it as `x_curl/UserTweets.curl`.
6. Right-click the `UserTweetsAndReplies` request, choose `Copy` -> `Copy as cURL`, and save it as `x_curl/UserTweetsAndReplies.curl`.

`x_curl/*.curl` is gitignored because those files contain login cookies/tokens. Never commit or share them.

For full-fidelity manual capture, open the target account in a logged-in browser:

```text
https://x.com/<username>/with_replies
```

Paste `scripts/x-startup-analysis-capture.js` into DevTools Console before scrolling, then run:

```js
await XStartupAnalysis.collect({
  username: 'aleabitoreddit',
  maxScrolls: 240,
  pauseMs: 1200
})
XStartupAnalysis.downloadJson()
```

Then rerun the CLI with `--input`.

## Feedback

Suggestions and feedback are welcome. Send them to [@kiskirHQ](https://x.com/kiskirHQ) on X.com.

## License

MIT. See [LICENSE](LICENSE).

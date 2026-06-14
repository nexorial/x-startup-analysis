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
- **Outside-in growth insights**: correlations, topic patterns, timing/format patterns, top posts, interaction accounts, and replication lessons.
- **Local-first outputs**: Markdown and CSV files are easy to inspect, commit, or publish.

## Example Analysis

This repository includes an actual DOM-only analysis for [`@aleabitoreddit`](https://x.com/aleabitoreddit), captured on June 14, 2026:

- [Timeline report](reports/aleabitoreddit-2026-06-14.md)
- [Insights report](reports/aleabitoreddit-insights-2026-06-14.md)
- [CSV export](reports/aleabitoreddit-2026-06-14.csv)
- [Run summary](reports/aleabitoreddit-run-summary-2026-06-14.json)
- [Chinese timeline report](reports/zh/aleabitoreddit-2026-06-14.md)
- [Chinese insights report](reports/zh/aleabitoreddit-insights-2026-06-14.md)

Important boundary: the included example is `dom-only`. It is useful for public engagement analysis, but precise post/reply ratios require GraphQL/Relay capture or status-page enrichment.

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

---
name: x-startup-analysis
description: Analyze how an X/Twitter account grows from the outside using a CLI-first local workflow. Use when Codex needs to capture an X account timeline, classify posts versus replies, generate timeline/CSV/insights reports, compare public engagement metrics, find interaction accounts, or extract reusable growth lessons from an account without relying on the account owner's X analytics dashboard.
---

# x-startup-analysis

Use the project CLI first. The canonical example handle is `aleabitoreddit`.

## Pre-config

Before running reports, ask the user which language they prefer:

- English: pass `--language en`.
- Chinese: pass `--language zh`.

If they do not answer and no prior preference is available, default to Chinese.

## Default Command

From the `x-startup-analysis` repo:

```bash
npm run run -- --username aleabitoreddit --language zh
```

For another account, replace `aleabitoreddit` with the requested handle. The CLI writes raw JSON, timeline Markdown, CSV, insights Markdown, and a run summary.

For fixture/offline analysis:

```bash
npm run run -- --username aleabitoreddit --language en --input fixtures/aleabitoreddit-sample-capture.json --no-snapshot
```

## Capture Quality

Read the run summary before claiming completion.

- `graphql`: GraphQL/Relay/SSR data was available; reply classification is strongest.
- `mixed`: GraphQL and DOM rows were merged.
- `dom-only`: Chrome automation read visible DOM rows only. Treat rows without explicit reply context as `unclassified`, not posts.
- `unknown`: Empty or source-poor input.

The CLI may use Chrome DOM automation when CDP/GraphQL capture is unavailable. If precise post/reply ratios matter and the run is `dom-only`, use the manual DevTools script before scrolling:

```js
await XStartupAnalysis.collect({
  username: 'aleabitoreddit',
  maxScrolls: 240,
  pauseMs: 1200
})
XStartupAnalysis.downloadJson()
```

Then rerun the CLI with `--input`.

## Output Expectations

The insights report should answer:

- What styles and habits define the account?
- What value does it provide readers?
- Which content attributes correlate with impressions, likes, comments, reposts, quotes, and bookmarks?
- Which accounts does it interact with when reply metadata is available?
- What can a reader copy to grow a similar account?

Keep historical follower claims bounded: public X pages usually expose only the current follower count unless local snapshots or external history exist.

## Verification

Run:

```bash
npm test
```

For Skill packaging, validate:

```bash
python3 /Users/sihangchen/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/.codex/skills/x-startup-analysis
```

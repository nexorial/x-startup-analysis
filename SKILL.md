---
name: x-startup-analysis
description: Analyze how an X account grows from the outside using local capture, post/reply classification, public engagement metrics, and reusable growth insights. Use when Codex needs to inspect an X/Twitter account, capture posts and replies, generate timeline/CSV/insights reports, compare engagement signals, or package lessons about what the account did to gain followers.
---

# x-startup-analysis

## Pre-config

Ask the user which report language they prefer before running the workflow:

- English: pass `--language en`.
- Chinese: pass `--language zh`.

If the user does not answer and no prior preference is available, default to Chinese.

## Default Workflow

Use the CLI orchestrator first:

```bash
npm run run -- --username aleabitoreddit --language zh
```

For a different target, replace `aleabitoreddit` with the requested X handle. The orchestrator writes raw capture, timeline Markdown, CSV, insights Markdown, and a run summary.

## Capture Quality Rules

- Prefer GraphQL/Relay/SSR data when available because it preserves reply metadata.
- Chrome automation may fall back to DOM-only capture. In that case, do not treat non-reply rows as posts unless parent/conversation evidence exists.
- `reply`: GraphQL/Relay/SSR has `in_reply_to_*`, `reply_to_results`, `reply_to_user_results`, or DOM explicitly shows `Replying to @...` / `回复给 @...`.
- `unclassified`: DOM-only row without reply/top-level evidence.

## Manual Full-fidelity Upgrade

If the run summary says `dom-only` and the user needs precise post/reply ratios, use the browser DevTools capture script:

```js
await XStartupAnalysis.collect({
  username: 'aleabitoreddit',
  maxScrolls: 240,
  pauseMs: 1200
})
XStartupAnalysis.downloadJson()
```

Then rerun:

```bash
npm run run -- --username aleabitoreddit --language zh --input data/raw/aleabitoreddit.json --no-snapshot
```

## Verification

Run:

```bash
npm test
```

Check the run summary for `captureQuality`, limitations, output paths, and tweet counts before claiming completion.

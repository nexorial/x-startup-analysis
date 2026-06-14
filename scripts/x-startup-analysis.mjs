#!/usr/bin/env node
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import {
  classifyTweetType,
  extractFromGraphqlPayload,
  mergeCaptureRecords,
  renderMarkdown,
  normalizeLanguage,
} from '../lib/x-startup-analysis-core.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.username || !args.input || !args.out) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const username = args.username.replace(/^@/, '');
const language = normalizeLanguage(args.language);
const inputFiles = Array.isArray(args.input) ? args.input : [args.input];
const captures = [];

for (const input of inputFiles) {
  captures.push(...await readInput(resolve(input), username));
}

const merged = mergeCaptureRecords(captures, username);
const snapshotDir = args['snapshot-dir'] || 'data/follower-snapshots';
const snapshotPath = resolve(snapshotDir, `${username}.jsonl`);
const latestUser = merged.users[0];
if (latestUser && !args['no-snapshot']) {
  await mkdir(dirname(snapshotPath), { recursive: true });
  await appendFile(snapshotPath, `${JSON.stringify({ ...latestUser, capturedAt: new Date().toISOString() })}\n`);
}
const followerSnapshots = await readFollowerSnapshots(snapshotPath);
const markdown = renderMarkdown({
  username,
  tweets: merged.tweets,
  users: merged.users,
  followerSnapshots,
  language,
});

const outPath = resolve(args.out);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);

let csvPath = '';
if (args.csv) {
  csvPath = resolve(args.csv);
  await mkdir(dirname(csvPath), { recursive: true });
  await writeFile(csvPath, renderCsv(merged.tweets));
}

console.log(JSON.stringify({
  username,
  language,
  tweets: merged.tweets.length,
  users: merged.users.length,
  followerSnapshots: followerSnapshots.length,
  out: outPath,
  csv: csvPath || null,
  snapshotPath,
  snapshotWritten: Boolean(latestUser && !args['no-snapshot']),
}, null, 2));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      out.help = true;
      continue;
    }
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    if (out[key] == null) out[key] = value;
    else if (Array.isArray(out[key])) out[key].push(value);
    else out[key] = [out[key], value];
  }
  return out;
}

async function readInput(path, username) {
  const text = await readFile(path, 'utf8');
  if (extname(path) === '.jsonl') {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
  const json = JSON.parse(text);
  if (Array.isArray(json)) return json;
  if (json.tweets || json.users) return [json];
  if (json.data?.tweets || json.data?.users) return [json.data];
  return [extractFromGraphqlPayload(json, { username })];
}

async function readFollowerSnapshots(path) {
  if (!existsSync(path)) return [];
  const text = await readFile(path, 'utf8');
  const rows = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  return dedupeSnapshots(rows);
}

function dedupeSnapshots(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const key = `${row.capturedAt}|${row.followers}|${row.following}|${row.posts}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out.sort((a, b) => String(a.capturedAt || '').localeCompare(String(b.capturedAt || '')));
}

function renderCsv(tweets) {
  const header = [
    'created_at',
    'post_type',
    'post_id',
    'url',
    'reply_to',
    'impressions',
    'likes',
    'comments',
    'retweets',
    'bookmarks',
    'quotes',
    'content',
    'media_links',
    'external_links',
    'note',
  ];
  const rows = tweets.map((tweet) => [
    tweet.createdAtIso || tweet.createdAt || '',
    classifyTweetType(tweet),
    tweet.id || '',
    tweet.url || '',
    tweet.isReply ? `@${tweet.inReplyToScreenName || 'unknown'} / ${tweet.inReplyToStatusId || 'unknown'}` : '',
    tweet.metrics?.impressions || 0,
    tweet.metrics?.likes || 0,
    tweet.metrics?.replies || 0,
    tweet.metrics?.retweets || 0,
    tweet.metrics?.bookmarks || 0,
    tweet.metrics?.quotes || 0,
    tweet.text || '',
    (tweet.media || []).map((media) => [media.type, media.url, media.expandedUrl, ...(media.videoUrls || [])].filter(Boolean).join(': ')).join('\n'),
    (tweet.urls || []).map((url) => url.expandedUrl || url.url || '').filter(Boolean).join('\n'),
    classifyTweetType(tweet) === 'unclassified' ? 'DOM-only row without reply/top-level evidence' : '',
  ]);
  return `${[header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`;
}

function csvCell(value) {
  const text = String(value ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function printHelp() {
  console.log(`Usage:
  npm run analyze -- --username aleabitoreddit --input data/raw/aleabitoreddit.json --out reports/aleabitoreddit.md

Options:
  --username       X handle, with or without @
  --input          Capture JSON, raw GraphQL JSON, or JSONL. Repeatable.
  --out            Markdown output path.
  --csv            Optional CSV output path.
  --language       Report language: en or zh. Default: zh
  --snapshot-dir   Follower snapshot directory. Default: data/follower-snapshots
  --no-snapshot    Do not append a new follower snapshot while rendering
`);
}

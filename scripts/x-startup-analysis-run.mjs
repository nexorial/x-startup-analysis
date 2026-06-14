#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import {
  extractFromGraphqlPayload,
  inferCaptureQuality,
  mergeCaptureRecords,
  normalizeLanguage,
  summarizeCaptureCompleteness,
} from '../lib/x-startup-analysis-core.mjs';

const execFileAsync = promisify(execFile);
const args = parseArgs(process.argv.slice(2));

if (args.help || !args.username) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const username = String(args.username).replace(/^@/, '');
const language = normalizeLanguage(args.language);
const today = new Date().toISOString().slice(0, 10);
const rawDir = resolve(args['raw-dir'] || 'data/raw');
const outDir = resolve(args['out-dir'] || 'reports');
const maxScrolls = Number(args['max-scrolls'] || 240);
const maxPages = Number(args['max-pages'] || 500);
const pageSize = args['page-size'] ? Number(args['page-size']) : null;
const dryRun = Boolean(args['dry-run']);
const requireFullHistory = Boolean(args['require-full-history']);
const rawPath = resolve(rawDir, `${username}-${today}.json`);
const timelinePath = resolve(outDir, `${username}-${today}.md`);
const csvPath = resolve(outDir, `${username}-${today}.csv`);
const insightsPath = resolve(outDir, `${username}-insights-${today}.md`);
const summaryPath = resolve(outDir, `${username}-run-summary-${today}.json`);

const cdp = await detectCdpEndpoint();
if (dryRun) {
  console.log(JSON.stringify({
    username,
    language,
    maxScrolls,
    cdpAvailable: Boolean(cdp),
    cdpEndpoint: cdp?.webSocketDebuggerUrl || cdp?.url || null,
    curlDir: args['curl-dir'] ? resolve(args['curl-dir']) : null,
    rawPath,
    timelinePath,
    csvPath,
    insightsPath,
    summaryPath,
  }, null, 2));
  process.exit(0);
}

const inputFiles = args.input ? asArray(args.input).map((path) => resolve(path)) : [];
let capture;
let limitations = [];
let requestedMethod = 'chrome-dom-automation';

if (inputFiles.length) {
  const captures = [];
  const inputLimitations = [];
  const inputProgress = [];
  const inputTail = [];
  const inputMethods = [];
  for (const input of inputFiles) captures.push(...await readInput(input, username));
  for (const captureItem of captures) {
    for (const limitation of captureItem?.collection?.limitations || []) inputLimitations.push(limitation);
    for (const progress of captureItem?.collection?.progress || []) inputProgress.push(progress);
    for (const line of captureItem?.collection?.tail || []) inputTail.push(line);
    if (captureItem?.collection?.method) inputMethods.push(captureItem.collection.method);
  }
  const merged = mergeCaptureRecords(captures, username);
  capture = {
    version: '0.1.0',
    username,
    language,
    capturedAt: new Date().toISOString(),
    collection: {
      method: 'input-file',
      inputFiles,
      inputMethods: [...new Set(inputMethods)],
      cdpAvailable: Boolean(cdp),
      limitations: [...new Set(inputLimitations)],
      progress: inputProgress,
      tail: inputTail,
    },
    tweets: merged.tweets,
    users: merged.users,
  };
  requestedMethod = 'input-file';
} else if (args['curl-dir']) {
  capture = await captureFromCurlDir({
    username,
    curlDir: resolve(args['curl-dir']),
    maxPages,
    pageSize,
  });
  requestedMethod = 'curl-graphql-pagination';
} else {
  try {
    if (cdp) {
      try {
        capture = await captureFromCdp({ username, maxScrolls, cdp });
        requestedMethod = 'chrome-cdp-graphql';
      } catch (cdpError) {
        limitations.push(`CDP capture failed: ${shortError(cdpError)}. Falling back to Chrome DOM automation.`);
        capture = await captureFromChromeDom({ username, maxScrolls });
      }
    } else {
      capture = await captureFromChromeDom({ username, maxScrolls });
    }
    limitations.push('DOM automation cannot prove top-level status for rows without explicit reply context; those rows must remain unclassified.');
  } catch (error) {
    capture = emptyCapture({
      username,
      method: 'chrome-dom-automation-failed',
      limitation: `Chrome DOM automation failed: ${shortError(error)}. Enable Chrome "Allow JavaScript from Apple Events" or provide --input from the DevTools capture script.`,
    });
    limitations = capture.collection.limitations;
  }
  if (!cdp) {
    limitations.push('No Chrome remote debugging endpoint was detected, so this run could not preserve GraphQL/Relay reply fields automatically.');
  }
}

const captureQuality = inferCaptureQuality(capture.tweets || []);
capture.collection = {
  requestedMethod,
  ...(capture.collection || {}),
  cdpAvailable: Boolean(cdp),
  cdpEndpoint: cdp?.webSocketDebuggerUrl || cdp?.url || '',
  captureQuality,
  limitations: [...new Set([...(capture.collection?.limitations || []), ...limitations])],
};
capture.collection.completeness = summarizeCaptureCompleteness(capture);

await mkdir(dirname(rawPath), { recursive: true });
await writeFile(rawPath, `${JSON.stringify(capture, null, 2)}\n`);

if (requireFullHistory && !capture.collection.completeness.isFullHistory) {
  capture.collection.limitations = [...new Set([
    ...(capture.collection.limitations || []),
    `Full-history requirement was not satisfied: ${capture.collection.completeness.status}. Reports were not generated.`,
  ])];
  capture.collection.completeness = summarizeCaptureCompleteness(capture);
  await writeFile(rawPath, `${JSON.stringify(capture, null, 2)}\n`);
  const summary = buildSummary({
    username,
    language,
    capture,
    captureQuality,
    cdp,
    rawPath,
    timelinePath: null,
    csvPath: null,
    insightsPath: null,
    abortedBeforeReports: true,
  });
  await mkdir(dirname(summaryPath), { recursive: true });
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({ ...summary, summaryPath }, null, 2));
  process.exit(2);
}

await runNodeScript('scripts/x-startup-analysis.mjs', [
  '--username', username,
  '--language', language,
  '--input', rawPath,
  '--out', timelinePath,
  '--csv', csvPath,
  ...(args['no-snapshot'] ? ['--no-snapshot'] : []),
]);

await runNodeScript('scripts/x-startup-analysis-insights.mjs', [
  '--username', username,
  '--language', language,
  '--input', rawPath,
  '--out', insightsPath,
]);

const summary = buildSummary({
  username,
  language,
  capture,
  captureQuality,
  cdp,
  rawPath,
  timelinePath,
  csvPath,
  insightsPath,
  abortedBeforeReports: false,
});
await mkdir(dirname(summaryPath), { recursive: true });
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify({ ...summary, summaryPath }, null, 2));

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

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

async function readInput(path, username) {
  const text = await readFile(path, 'utf8');
  if (extname(path) === '.jsonl') {
    return text.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
  }
  const json = JSON.parse(text);
  if (Array.isArray(json)) return json;
  if (json.tweets || json.users) return [json];
  if (json.data?.tweets || json.data?.users) return [json.data];
  return [extractFromGraphqlPayload(json, { username })];
}

async function runNodeScript(script, argv) {
  const { stdout, stderr } = await execFileAsync(process.execPath, [script, ...argv], {
    cwd: resolve('.'),
    maxBuffer: 10 * 1024 * 1024,
  });
  if (stderr.trim()) process.stderr.write(stderr);
  if (stdout.trim()) process.stdout.write(`${stdout.trim()}\n`);
}

function buildSummary({
  username,
  language,
  capture,
  captureQuality,
  cdp,
  rawPath,
  timelinePath,
  csvPath,
  insightsPath,
  abortedBeforeReports,
}) {
  return {
    username,
    language,
    captureQuality,
    completeness: capture.collection?.completeness || summarizeCaptureCompleteness(capture),
    sourceMethod: capture.collection?.method || null,
    cdpAvailable: Boolean(cdp),
    cdpEndpoint: cdp?.webSocketDebuggerUrl || cdp?.url || null,
    tweets: capture.tweets?.length || 0,
    users: capture.users?.length || 0,
    capturedRange: {
      first: capture.tweets?.[0]?.createdAtIso || null,
      last: capture.tweets?.at(-1)?.createdAtIso || null,
    },
    profileSnapshot: capture.users?.[0] || null,
    rawPath,
    timelinePath,
    csvPath,
    insightsPath,
    abortedBeforeReports,
    limitations: capture.collection.limitations,
    sourceEvidence: {
      sources: capture.collection?.sources || [],
      lastProgress: capture.collection?.progress?.at(-1) || null,
      tail: capture.collection?.tail?.slice?.(-12) || null,
    },
  };
}

async function detectCdpEndpoint() {
  const ports = [9222, 9223, 9229, 9333];
  for (const port of ports) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(700) });
      if (!response.ok) continue;
      const json = await response.json();
      return { ...json, url: `http://127.0.0.1:${port}` };
    } catch (_) {
      // Try next common remote-debugging port.
    }
  }
  return null;
}

async function captureFromCdp({ username, maxScrolls, cdp }) {
  if (typeof WebSocket !== 'function') {
    throw new Error('This Node runtime does not expose WebSocket for CDP capture');
  }
  const targetsResponse = await fetch(`${cdp.url}/json`, { signal: AbortSignal.timeout(1000) });
  if (!targetsResponse.ok) throw new Error(`CDP target listing failed: ${targetsResponse.status}`);
  const targets = await targetsResponse.json();
  const pageUrl = `https://x.com/${username}/with_replies`;
  const target = targets.find((item) => item.type === 'page' && String(item.url || '').includes('x.com'))
    || targets.find((item) => item.type === 'page');
  if (!target?.webSocketDebuggerUrl) throw new Error('No CDP page target is available');

  const client = await createCdpClient(target.webSocketDebuggerUrl);
  const graphqlUrls = new Map();
  const rawPayloads = [];
  client.on('Network.responseReceived', (params) => {
    const url = String(params?.response?.url || '');
    if (/\/i\/api\/graphql\/.*(UserTweets|UserTweetsAndReplies|TweetDetail|UserByScreenName|UserByRestId|SearchTimeline|UserMedia)/i.test(url)) {
      graphqlUrls.set(params.requestId, url);
    }
  });
  client.on('Network.loadingFinished', async (params) => {
    if (!graphqlUrls.has(params.requestId)) return;
    try {
      const body = await client.send('Network.getResponseBody', { requestId: params.requestId });
      if (!body.base64Encoded && body.body) rawPayloads.push(JSON.parse(body.body));
    } catch (_) {
      // Some responses are no longer available by the time loadingFinished fires.
    }
  });

  await client.send('Network.enable');
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.navigate', { url: pageUrl });
  await sleep(3500);

  let domCapture = { tweets: [], users: [] };
  let idle = 0;
  let lastCount = 0;
  for (let i = 0; i < maxScrolls && idle < 10; i += 1) {
    domCapture = await evaluateCdpJson(client, domCaptureSnippet(username));
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight); "ok";', returnByValue: true });
    await sleep(1200);
    const graphTweets = rawPayloads.flatMap((payload) => extractFromGraphqlPayload(payload, { username }).tweets || []);
    const count = new Set([...(domCapture.tweets || []).map((tweet) => tweet.id), ...graphTweets.map((tweet) => tweet.id)]).size;
    idle = count === lastCount ? idle + 1 : 0;
    lastCount = count;
  }
  await sleep(500);
  client.close();

  const captures = rawPayloads.map((payload) => extractFromGraphqlPayload(payload, { username }));
  captures.push(domCapture);
  const merged = mergeCaptureRecords(captures, username);
  return {
    version: '0.1.0-cdp-cli',
    username,
    capturedAt: new Date().toISOString(),
    page: pageUrl,
    collection: {
      method: 'chrome-cdp-graphql',
      rawGraphqlResponses: rawPayloads.length,
      limitations: rawPayloads.length
        ? ['CDP captured GraphQL/Relay responses and merged visible DOM rows.']
        : ['CDP was available, but no matching X GraphQL timeline responses were captured; output may be DOM-only.'],
    },
    tweets: merged.tweets,
    users: merged.users,
  };
}

async function evaluateCdpJson(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  const value = result?.result?.value || '{}';
  return JSON.parse(value);
}

function createCdpClient(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let nextId = 1;
    const pending = new Map();
    const handlers = new Map();
    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { res, rej }));
        },
        on(method, handler) {
          const list = handlers.get(method) || [];
          list.push(handler);
          handlers.set(method, list);
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const { res, rej } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) rej(new Error(message.error.message || JSON.stringify(message.error)));
        else res(message.result || {});
        return;
      }
      for (const handler of handlers.get(message.method) || []) {
        Promise.resolve(handler(message.params)).catch(() => {});
      }
    });
    ws.addEventListener('error', () => reject(new Error('CDP WebSocket connection failed')));
  });
}

async function captureFromChromeDom({ username, maxScrolls }) {
  const pageUrl = `https://x.com/${username}/with_replies`;
  await runAppleScript([
    'tell application "Google Chrome"',
    'activate',
    'if not (exists window 1) then make new window',
    `set URL of active tab of front window to "${pageUrl}"`,
    'end tell',
  ]);
  await sleep(3500);

  const tweets = new Map();
  let users = [];
  let idle = 0;
  let lastCount = 0;
  for (let i = 0; i < maxScrolls && idle < 10; i += 1) {
    const batch = await executeChromeJavaScript(domCaptureSnippet(username));
    for (const tweet of batch.tweets || []) tweets.set(tweet.id, mergeDomTweet(tweets.get(tweet.id), tweet));
    users = batch.users?.length ? batch.users : users;
    await executeChromeJavaScript('window.scrollTo(0, document.body.scrollHeight); "ok";');
    await sleep(1200);
    const count = tweets.size;
    idle = count === lastCount ? idle + 1 : 0;
    lastCount = count;
  }

  return {
    version: '0.1.0-dom-cli',
    username,
    capturedAt: new Date().toISOString(),
    page: pageUrl,
    collection: {
      method: 'chrome-dom-automation',
      limitations: [
        'Chrome DOM automation reads visible timeline rows only; X auto-translation and virtualized timeline behavior can affect captured text and completeness.',
      ],
    },
    tweets: [...tweets.values()].sort((a, b) => String(a.createdAtIso || '').localeCompare(String(b.createdAtIso || ''))),
    users,
  };
}

async function captureFromCurlDir({ username, curlDir, maxPages, pageSize }) {
  const sourceFiles = [
    { name: 'UserTweets', file: 'UserTweets.curl', required: true },
    { name: 'UserTweetsAndReplies', file: 'UserTweetsAndReplies.curl', required: true },
    { name: 'UserSuperFollowTweets', file: 'UserSuperFollowTweets.curl', required: false },
  ];
  const captures = [];
  const sources = [];
  const limitations = [];
  for (const source of sourceFiles) {
    const path = join(curlDir, source.file);
    if (!existsSync(path)) {
      const message = `Missing ${source.file} in ${curlDir}. Copy ${source.name} as cURL from Chrome DevTools to enable full pagination.`;
      if (source.required) limitations.push(message);
      continue;
    }
    const result = await paginateCurlSource({ username, path, sourceName: source.name, required: source.required, maxPages, pageSize });
    captures.push(...result.captures);
    sources.push(result.summary);
    limitations.push(...result.limitations);
  }
  const merged = mergeCaptureRecords(captures, username);
  const requiredSourcesPresent = sourceFiles.filter((source) => source.required).every((source) => existsSync(join(curlDir, source.file)));
  const sourceExhausted = requiredSourcesPresent
    && sources.filter((source) => source.required !== false).every((source) => source.exhausted);
  if (!sourceExhausted) {
    limitations.push('Full-history pagination is not proven because at least one required GraphQL source is missing, rate-limited, or stopped before cursor exhaustion.');
  }
  return {
    version: '0.1.0-curl-graphql',
    username,
    capturedAt: new Date().toISOString(),
    collection: {
      method: 'curl-graphql-pagination',
      curlDir,
      maxPages,
      pageSize,
      sourceExhausted,
      sources,
      limitations: [...new Set(limitations)],
    },
    tweets: merged.tweets,
    users: merged.users,
  };
}

async function paginateCurlSource({ username, path, sourceName, required, maxPages, pageSize }) {
  const command = splitShellWords(await readFile(path, 'utf8'));
  if (command[0] !== 'curl' || !command[1]) throw new Error(`${basename(path)} is not a usable curl command`);
  const { url, headers, method, body } = parseCurlCommand(command);
  const captures = [];
  const pages = [];
  const limitations = [];
  const seenCursors = new Set();
  let cursor = null;
  let exhausted = false;
  for (let page = 0; page < maxPages; page += 1) {
    if (seenCursors.has(cursor || '')) {
      limitations.push(`${sourceName} stopped after a repeated cursor.`);
      break;
    }
    seenCursors.add(cursor || '');
    const pageUrl = setGraphqlCursor(url, cursor, pageSize);
    const response = await fetch(pageUrl, {
      method,
      headers,
      body: method === 'GET' ? undefined : body,
      signal: AbortSignal.timeout(30000),
    });
    const text = await response.text();
    if (!response.ok) {
      limitations.push(`${sourceName} page ${page + 1} failed with HTTP ${response.status}.`);
      break;
    }
    const json = JSON.parse(text);
    if (json.errors && !json.data) {
      limitations.push(`${sourceName} page ${page + 1} returned GraphQL errors.`);
      break;
    }
    const extracted = extractFromGraphqlPayload(json, { username });
    captures.push(extracted);
    const nextCursor = findBottomCursor(json);
    pages.push({
      page: page + 1,
      inputCursor: cursor || '',
      nextCursor: nextCursor || '',
      records: extracted.tweets?.length || 0,
    });
    if (!nextCursor || nextCursor === cursor) {
      exhausted = true;
      break;
    }
    cursor = nextCursor;
  }
  if (!exhausted && pages.length >= maxPages) {
    limitations.push(`${sourceName} reached --max-pages ${maxPages} before cursor exhaustion.`);
  }
  return {
    captures,
    limitations,
    summary: {
      name: sourceName,
      file: basename(path),
      required,
      pages: pages.length,
      records: pages.reduce((sum, page) => sum + page.records, 0),
      exhausted,
      lastCursor: pages.at(-1)?.nextCursor || '',
    },
  };
}

function parseCurlCommand(command) {
  let url = '';
  let method = 'GET';
  let body = null;
  const headers = {};
  for (let i = 1; i < command.length; i += 1) {
    const token = command[i];
    if (!url && /^https?:\/\//.test(token)) {
      url = token;
      continue;
    }
    if ((token === '-H' || token === '--header') && command[i + 1]) {
      const header = command[++i];
      const split = header.indexOf(':');
      if (split > 0) headers[header.slice(0, split).trim()] = header.slice(split + 1).trim();
      continue;
    }
    if ((token === '-X' || token === '--request') && command[i + 1]) {
      method = command[++i].toUpperCase();
      continue;
    }
    if (['--data', '--data-raw', '--data-binary', '-d'].includes(token) && command[i + 1]) {
      body = command[++i];
      if (method === 'GET') method = 'POST';
    }
  }
  if (!url) throw new Error('curl command does not contain a URL');
  return { url, headers, method, body };
}

function setGraphqlCursor(url, cursor, pageSize) {
  const parsed = new URL(url);
  const variables = JSON.parse(parsed.searchParams.get('variables') || '{}');
  if (cursor) variables.cursor = cursor;
  else delete variables.cursor;
  if (pageSize) variables.count = pageSize;
  parsed.searchParams.set('variables', JSON.stringify(variables));
  return parsed.toString();
}

function findBottomCursor(data) {
  const stack = [data];
  const seen = new Set();
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object' || seen.has(node)) continue;
    seen.add(node);
    if (node.cursorType === 'Bottom' && node.value) return node.value;
    if (Array.isArray(node)) {
      for (const value of node) stack.push(value);
    } else {
      for (const value of Object.values(node)) {
        if (value && typeof value === 'object') stack.push(value);
      }
    }
  }
  return '';
}

function splitShellWords(text) {
  const words = [];
  let current = '';
  let quote = '';
  let escaped = false;
  for (const char of String(text).replace(/\\\n/g, ' ')) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\' && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      else current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        words.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (current) words.push(current);
  return words;
}

function mergeDomTweet(existing, next) {
  if (!existing) return next;
  return {
    ...existing,
    ...next,
    text: next.text || existing.text || '',
    isReply: Boolean(existing.isReply || next.isReply),
    inReplyToScreenName: next.inReplyToScreenName || existing.inReplyToScreenName || '',
    metrics: {
      impressions: Math.max(existing.metrics?.impressions || 0, next.metrics?.impressions || 0),
      likes: Math.max(existing.metrics?.likes || 0, next.metrics?.likes || 0),
      replies: Math.max(existing.metrics?.replies || 0, next.metrics?.replies || 0),
      retweets: Math.max(existing.metrics?.retweets || 0, next.metrics?.retweets || 0),
      quotes: Math.max(existing.metrics?.quotes || 0, next.metrics?.quotes || 0),
      bookmarks: Math.max(existing.metrics?.bookmarks || 0, next.metrics?.bookmarks || 0),
    },
  };
}

function emptyCapture({ username, method, limitation }) {
  return {
    version: '0.1.0-empty',
    username,
    capturedAt: new Date().toISOString(),
    collection: {
      method,
      limitations: [limitation],
    },
    tweets: [],
    users: [],
  };
}

function shortError(error) {
  const text = String(error?.stderr || error?.message || error || '');
  if (/Access not allowed|-1723|Allow JavaScript from Apple Events/i.test(text)) {
    return 'Chrome JavaScript execution via Apple Events is not allowed';
  }
  return text
    .replace(/\s+/g, ' ')
    .slice(0, 300);
}

async function executeChromeJavaScript(source) {
  const result = await runAppleScript([
    'tell application "Google Chrome"',
    `execute javascript ${appleString(source)} in active tab of front window`,
    'end tell',
  ]);
  return JSON.parse(result || '{}');
}

async function runAppleScript(lines) {
  const args = lines.flatMap((line) => ['-e', line]);
  const { stdout } = await execFileAsync('osascript', args, { maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

function appleString(text) {
  return `"${String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function domCaptureSnippet(username) {
  return `(() => {
    const username = ${JSON.stringify(username.toLowerCase())};
    const parseCount = (value) => {
      if (!value) return 0;
      const text = String(value).trim().replace(/,/g, '');
      const match = text.match(/^([\\d.]+)\\s*([KMB万亿])?$/i);
      if (!match) return parseInt(text.replace(/[^\\d]/g, ''), 10) || 0;
      const n = parseFloat(match[1]);
      const s = (match[2] || '').toLowerCase();
      const factor = s === 'k' ? 1000 : s === 'm' ? 1000000 : s === 'b' ? 1000000000 : s === '万' ? 10000 : s === '亿' ? 100000000 : 1;
      return Math.round(n * factor);
    };
    const toIso = (value) => {
      const d = value ? new Date(value) : new Date('');
      return Number.isNaN(d.getTime()) ? '' : d.toISOString();
    };
    const metricFromAria = (label) => {
      const read = (patterns) => {
        for (const re of patterns) {
          const match = String(label || '').match(re);
          if (match) return parseCount(match[1]);
        }
        return 0;
      };
      return {
        replies: read([/([\\d,.KMB万亿]+)\\s+(?:repl|replies|回复|回覆)/i]),
        retweets: read([/([\\d,.KMB万亿]+)\\s+(?:repost|retweet|转帖|轉發|转发)/i]),
        likes: read([/([\\d,.KMB万亿]+)\\s+(?:like|likes|喜欢|喜歡|点赞)/i]),
        bookmarks: read([/([\\d,.KMB万亿]+)\\s+(?:bookmark|bookmarks|收藏)/i]),
        impressions: read([/([\\d,.KMB万亿]+)\\s+(?:view|views|查看|浏览|瀏覽|展示|曝光)/i]),
        quotes: 0
      };
    };
    const replyTarget = (text) => {
      const patterns = [/Replying to\\s+@([A-Za-z0-9_]{1,15})/i, /回复\\s*@([A-Za-z0-9_]{1,15})/i, /回复给\\s*@([A-Za-z0-9_]{1,15})/i, /正在回复\\s*@([A-Za-z0-9_]{1,15})/i, /回覆\\s*@([A-Za-z0-9_]{1,15})/i];
      for (const pattern of patterns) {
        const match = String(text || '').match(pattern);
        if (match) return match[1];
      }
      return '';
    };
    const lines = document.body.innerText.split('\\n').map((line) => line.trim()).filter(Boolean);
    const followers = (() => {
      for (const line of lines) {
        let match = line.match(/^([\\d,.KMB万亿]+)\\s+Followers$/i) || line.match(/^([\\d,.KMB万亿]+)\\s*粉丝$/i);
        if (match) return parseCount(match[1]);
      }
      return 0;
    })();
    const following = (() => {
      for (const line of lines) {
        let match = line.match(/^([\\d,.KMB万亿]+)\\s+Following$/i) || line.match(/^正在关注\\s*([\\d,.KMB万亿]+)$/i) || line.match(/^([\\d,.KMB万亿]+)\\s*关注中$/i);
        if (match) return parseCount(match[1]);
      }
      return 0;
    })();
    const posts = (() => {
      for (const line of lines) {
        let match = line.match(/^([\\d,.KMB万亿]+)\\s+posts$/i) || line.match(/^([\\d,.KMB万亿]+)\\s*帖子$/i);
        if (match) return parseCount(match[1]);
      }
      return 0;
    })();
    const tweets = [];
    for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
      const href = Array.from(article.querySelectorAll('a[href*="/status/"]')).map((a) => a.getAttribute('href')).find(Boolean);
      const id = href && (href.match(/\\/status\\/(\\d+)/) || [])[1];
      const handle = href && (href.match(/^\\/([^/]+)\\/status\\//) || [])[1];
      if (!id || !handle || handle.toLowerCase() !== username) continue;
      const time = article.querySelector('time')?.getAttribute('datetime') || '';
      const text = Array.from(article.querySelectorAll('[data-testid="tweetText"]')).map((el) => el.innerText).join('\\n').trim();
      const target = replyTarget(article.innerText);
      const aria = article.querySelector('[role="group"]')?.getAttribute('aria-label') || '';
      const media = Array.from(article.querySelectorAll('img[src*="twimg.com/media"], video source')).map((el) => ({ type: el.tagName === 'SOURCE' ? 'video' : 'photo', url: el.src || '', expandedUrl: '', videoUrls: el.src ? [el.src] : [] }));
      tweets.push({
        id,
        url: 'https://x.com/' + handle + '/status/' + id,
        authorUsername: handle,
        authorName: '',
        authorId: '',
        createdAt: time,
        createdAtIso: toIso(time),
        text,
        isReply: Boolean(target),
        isQuote: false,
        isRetweet: false,
        inReplyToStatusId: '',
        inReplyToScreenName: target,
        conversationId: '',
        quotedStatusId: '',
        metrics: metricFromAria(aria),
        media,
        urls: [],
        capturedAt: new Date().toISOString(),
        source: 'chrome-dom-cli'
      });
    }
    return JSON.stringify({ tweets, users: followers || following || posts ? [{ username, followers, following, posts, capturedAt: new Date().toISOString(), source: 'dom-profile' }] : [] });
  })();`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printHelp() {
  console.log(`Usage:
  npm run run -- --username aleabitoreddit --language zh
  npm run run -- --username aleabitoreddit --language en --input fixtures/aleabitoreddit-sample-capture.json --no-snapshot

Options:
  --username       X handle, with or without @
  --language       Report language: en or zh. Default: zh
  --input          Optional existing capture JSON/GraphQL JSON/JSONL. Repeatable; skips live capture.
  --curl-dir       Directory with gitignored UserTweets.curl and UserTweetsAndReplies.curl copied from Chrome DevTools.
  --max-scrolls    Maximum Chrome DOM scroll rounds. Default: 240
  --max-pages      Maximum GraphQL cursor pages per cURL source. Default: 500
  --page-size      Optional GraphQL page size override for cURL sources.
  --out-dir        Report output directory. Default: reports
  --raw-dir        Raw capture output directory. Default: data/raw
  --no-snapshot    Do not append a follower snapshot while rendering the timeline report
  --require-full-history
                   Exit before report generation unless GraphQL posts+replies sources are exhausted and profile count coverage is satisfied.
  --dry-run        Print paths and capture capability detection without writing files
`);
}

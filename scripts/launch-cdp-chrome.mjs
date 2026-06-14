#!/usr/bin/env node
import { execFile, spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const args = parseArgs(process.argv.slice(2));
const port = Number(args.port || 9222);
const profileDir = resolve(args['profile-dir'] || '.chrome-cdp-profile');
const startUrl = args.url || 'https://x.com/login';

await mkdir(profileDir, { recursive: true });
await launchChrome({ port, profileDir, startUrl });
const endpoint = await waitForCdp(port, 12_000);

console.log(JSON.stringify({
  cdpAvailable: Boolean(endpoint),
  cdpEndpoint: endpoint?.url || `http://127.0.0.1:${port}`,
  profileDir,
  nextSteps: [
    'Log in to X in the Chrome window that just opened.',
    'Then run: npm run run -- --username aleabitoreddit --language en --require-full-history',
    'The CLI will use CDP to capture UserTweets/UserTweetsAndReplies request templates and paginate them locally.',
  ],
}, null, 2));

async function launchChrome({ port, profileDir, startUrl }) {
  const chromeArgs = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--new-window',
    startUrl,
  ];
  if (process.platform === 'darwin') {
    await execFileAsync('open', ['-na', 'Google Chrome', '--args', ...chromeArgs]);
    return;
  }

  const candidates = process.platform === 'win32'
    ? [
      'chrome.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ]
    : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];

  for (const command of candidates) {
    try {
      const child = spawn(command, chromeArgs, { detached: true, stdio: 'ignore' });
      child.unref();
      return;
    } catch (_) {
      // Try the next known executable name.
    }
  }
  throw new Error('Could not launch Chrome. Start Chrome manually with --remote-debugging-port and rerun the CLI.');
}

async function waitForCdp(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const url = `http://127.0.0.1:${port}`;
      const response = await fetch(`${url}/json/version`, { signal: AbortSignal.timeout(700) });
      if (response.ok) return { ...(await response.json()), url };
    } catch (_) {
      // Chrome can take a moment to start the debugging endpoint.
    }
    await sleep(500);
  }
  return null;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else out[key] = argv[++i];
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

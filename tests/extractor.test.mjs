import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  classifyTweetType,
  extractFromGraphqlPayload,
  inferCaptureQuality,
  mergeTweet,
  mergeCaptureRecords,
  normalizeLanguage,
  renderMarkdown,
} from '../lib/x-startup-analysis-core.mjs';
import fixture from '../fixtures/aleabitoreddit-sample-capture.json' with { type: 'json' };

const execFileAsync = promisify(execFile);

test('extracts target account posts, replies, metrics, and media from GraphQL-like payloads', () => {
  const extracted = extractFromGraphqlPayload(fixture.graphql, { username: 'aleabitoreddit' });

  assert.equal(extracted.users.length, 1);
  assert.equal(extracted.users[0].followers, 1234);
  assert.equal(extracted.tweets.length, 2);

  const reply = extracted.tweets.find((tweet) => tweet.isReply);
  assert.equal(reply.inReplyToScreenName, 'someone');
  assert.equal(reply.metrics.impressions, 1800);
  assert.equal(reply.metrics.bookmarks, 3);

  const post = extracted.tweets.find((tweet) => !tweet.isReply);
  assert.equal(post.media[0].type, 'photo');
  assert.equal(post.media[0].url, 'https://pbs.twimg.com/media/example.jpg');
});

test('merges captures and renders oldest-first Markdown', () => {
  const merged = mergeCaptureRecords([fixture.capture], 'aleabitoreddit');
  assert.equal(merged.tweets.length, 2);
  assert.equal(merged.tweets[0].id, '100');
  assert.equal(merged.tweets[1].id, '101');

  const md = renderMarkdown({
    username: 'aleabitoreddit',
    tweets: merged.tweets,
    users: merged.users,
    followerSnapshots: [
      { username: 'aleabitoreddit', followers: 1000, following: 80, posts: 20, capturedAt: '2026-06-12T00:00:00.000Z' },
      { username: 'aleabitoreddit', followers: 1234, following: 90, posts: 24, capturedAt: '2026-06-13T00:00:00.000Z' },
    ],
    generatedAt: '2026-06-13T00:00:00.000Z',
  });

  assert.match(md, /^# X 起号分析：@aleabitoreddit/);
  assert.ok(md.indexOf('2026-06-01T00:00:00.000Z') < md.indexOf('2026-06-02T00:00:00.000Z'));
  assert.match(md, /曝光 1,800/);
  assert.match(md, /https:\/\/pbs\.twimg\.com\/media\/example\.jpg/);
});

test('renders reports in English when requested', () => {
  const merged = mergeCaptureRecords([fixture.capture], 'aleabitoreddit');
  const md = renderMarkdown({
    username: 'aleabitoreddit',
    tweets: merged.tweets,
    users: merged.users,
    generatedAt: '2026-06-13T00:00:00.000Z',
    language: 'en',
  });

  assert.match(md, /^# X startup analysis: @aleabitoreddit/);
  assert.match(md, /## Current Account Snapshot/);
  assert.match(md, /Capture quality: graphql/);
  assert.equal(normalizeLanguage('English'), 'en');
  assert.equal(normalizeLanguage('Chinese'), 'zh');
});

test('infers capture quality from sources', () => {
  assert.equal(inferCaptureQuality([{ source: 'graphql' }]), 'graphql');
  assert.equal(inferCaptureQuality([{ source: 'chrome-dom-cli' }]), 'dom-only');
  assert.equal(inferCaptureQuality([{ source: 'graphql' }, { source: 'chrome-dom-cli' }]), 'mixed');
});

test('extracts replies from X Relay detail records without legacy reply fields', () => {
  const extracted = extractFromGraphqlPayload({
    result: {
      __typename: 'Tweet',
      rest_id: '2060940144203698485',
      core: {
        user_results: {
          result: {
            rest_id: 'u-aleabitoreddit',
            core: { screen_name: 'aleabitoreddit', name: 'Example Account' },
          },
        },
      },
      details: {
        full_text: '@rwayne 保密级别太高了 查不到是很正常的',
        created_at_ms: 1780201395000,
      },
      counts: {
        reply_count: 14,
        bookmark_count: 5,
        favorite_count: 867,
        retweet_count: 0,
      },
      views: { count: '238340' },
      reply_to_results: { rest_id: '2060812992732934195' },
      reply_to_user_results: {
        result: {
          rest_id: 'u-rwayne',
          core: { screen_name: 'rwayne', name: 'R Wayne' },
        },
      },
    },
  }, { username: 'aleabitoreddit' });

  assert.equal(extracted.tweets.length, 1);
  assert.equal(extracted.tweets[0].isReply, true);
  assert.equal(extracted.tweets[0].inReplyToStatusId, '2060812992732934195');
  assert.equal(extracted.tweets[0].inReplyToScreenName, 'rwayne');
  assert.equal(extracted.tweets[0].metrics.likes, 867);
});

test('does not let DOM fallback overwrite GraphQL reply classification', () => {
  const reply = {
    id: '101',
    text: 'reply',
    isReply: true,
    inReplyToStatusId: '90',
    inReplyToScreenName: 'someone',
    metrics: { impressions: 100, likes: 2, replies: 0, retweets: 0, quotes: 0, bookmarks: 0 },
    media: [],
    urls: [],
  };
  const domFallback = {
    id: '101',
    text: 'reply',
    isReply: false,
    inReplyToStatusId: '',
    inReplyToScreenName: '',
    metrics: { impressions: 120, likes: 1, replies: 0, retweets: 0, quotes: 0, bookmarks: 0 },
    media: [],
    urls: [],
  };

  const merged = mergeTweet(reply, domFallback);
  assert.equal(merged.isReply, true);
  assert.equal(merged.inReplyToStatusId, '90');
  assert.equal(merged.inReplyToScreenName, 'someone');
  assert.equal(merged.metrics.impressions, 120);
});

test('classifies DOM-only rows without conversation evidence as unclassified', () => {
  assert.equal(classifyTweetType({
    source: 'chrome-dom',
    isReply: false,
    isQuote: false,
    isRetweet: false,
    conversationId: '',
  }), 'unclassified');
});

test('orchestrator supports dry-run and fixture smoke output in both languages', async () => {
  const dry = await execFileAsync(process.execPath, [
    'scripts/x-startup-analysis-run.mjs',
    '--username', 'aleabitoreddit',
    '--language', 'en',
    '--dry-run',
  ], { cwd: resolve('.'), maxBuffer: 10 * 1024 * 1024 });
  const dryJson = JSON.parse(dry.stdout);
  assert.equal(dryJson.username, 'aleabitoreddit');
  assert.equal(dryJson.language, 'en');

  const dir = await mkdtemp(join(tmpdir(), 'xsa-'));
  await execFileAsync(process.execPath, [
    'scripts/x-startup-analysis-run.mjs',
    '--username', 'aleabitoreddit',
    '--language', 'zh',
    '--input', 'fixtures/aleabitoreddit-sample-capture.json',
    '--raw-dir', join(dir, 'raw-zh'),
    '--out-dir', join(dir, 'reports-zh'),
    '--no-snapshot',
  ], { cwd: resolve('.'), maxBuffer: 10 * 1024 * 1024 });
  const zh = await readFile(join(dir, 'reports-zh', `aleabitoreddit-insights-${new Date().toISOString().slice(0, 10)}.md`), 'utf8');
  assert.match(zh, /^# @aleabitoreddit X 账号外部视角分析/);

  await execFileAsync(process.execPath, [
    'scripts/x-startup-analysis-run.mjs',
    '--username', 'aleabitoreddit',
    '--language', 'en',
    '--input', 'fixtures/aleabitoreddit-sample-capture.json',
    '--raw-dir', join(dir, 'raw-en'),
    '--out-dir', join(dir, 'reports-en'),
    '--no-snapshot',
  ], { cwd: resolve('.'), maxBuffer: 10 * 1024 * 1024 });
  const en = await readFile(join(dir, 'reports-en', `aleabitoreddit-insights-${new Date().toISOString().slice(0, 10)}.md`), 'utf8');
  assert.match(en, /^# @aleabitoreddit outside-in X account analysis/);
});

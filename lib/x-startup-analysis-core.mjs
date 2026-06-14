const TWITTER_DATE_FORMAT = /^[A-Z][a-z]{2} [A-Z][a-z]{2} \d{2} /;

export function parseCount(value) {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const text = String(value).trim().replace(/,/g, '');
  const suffix = text.match(/^([\d.]+)\s*([KMB万亿])?$/i);
  if (!suffix) {
    const numeric = Number.parseInt(text.replace(/[^\d-]/g, ''), 10);
    return Number.isFinite(numeric) ? numeric : 0;
  }
  const n = Number.parseFloat(suffix[1]);
  const s = suffix[2]?.toLowerCase();
  const factor = s === 'k' ? 1_000
    : s === 'm' ? 1_000_000
    : s === 'b' ? 1_000_000_000
    : s === '万' ? 10_000
    : s === '亿' ? 100_000_000
    : 1;
  return Math.round(n * factor);
}

export function toIsoDate(value) {
  if (!value) return '';
  const d = TWITTER_DATE_FORMAT.test(String(value))
    ? new Date(value)
    : new Date(String(value));
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

function unwrapResult(node) {
  let current = node;
  const seen = new Set();
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    if (current.result && typeof current.result === 'object') {
      current = current.result;
      continue;
    }
    if (current.tweet && typeof current.tweet === 'object') {
      current = current.tweet;
      continue;
    }
    if (current.tweet_results?.result) {
      current = current.tweet_results.result;
      continue;
    }
    if (current.itemContent?.tweet_results?.result) {
      current = current.itemContent.tweet_results.result;
      continue;
    }
    if (current.content?.itemContent?.tweet_results?.result) {
      current = current.content.itemContent.tweet_results.result;
      continue;
    }
    break;
  }
  return current;
}

function normalizeUserResult(userResult) {
  const user = unwrapResult(userResult);
  const legacy = user?.legacy;
  const core = user?.core;
  const username = legacy?.screen_name || core?.screen_name || '';
  if (!username) return null;
  return {
    id: legacy?.id_str || user.rest_id || '',
    username,
    name: legacy?.name || core?.name || '',
    followers: parseCount(legacy?.followers_count),
    following: parseCount(legacy?.friends_count),
    posts: parseCount(legacy?.statuses_count),
    listed: parseCount(legacy?.listed_count),
    capturedAt: new Date().toISOString(),
  };
}

function mediaFromLegacy(legacy) {
  const media = [];
  for (const item of legacy?.extended_entities?.media || legacy?.entities?.media || []) {
    const variants = item.video_info?.variants
      ?.map((v) => v.url)
      .filter(Boolean) || [];
    media.push({
      type: item.type || '',
      url: item.media_url_https || item.media_url || '',
      expandedUrl: item.expanded_url || item.url || '',
      videoUrls: [...new Set(variants)],
    });
  }
  return media;
}

function urlsFromLegacy(legacy) {
  return (legacy?.entities?.urls || [])
    .map((u) => ({
      url: u.url || '',
      expandedUrl: u.expanded_url || '',
      displayUrl: u.display_url || '',
    }))
    .filter((u) => u.url || u.expandedUrl);
}

export function normalizeTweetNode(node, options = {}) {
  const result = unwrapResult(node);
  const legacy = result?.legacy;
  const details = result?.details;
  const counts = result?.counts;
  if ((!legacy && !details) || !(legacy?.id_str || result?.rest_id)) return null;

  const user = normalizeUserResult(result.core?.user_results || result.user_results);
  const noteText = result.note_tweet?.note_tweet_results?.result?.text
    || result.note_tweet?.note_tweet_results?.result?.entity_set?.text
    || '';
  const text = noteText || details?.full_text || legacy?.full_text || legacy?.text || '';
  const authorUsername = user?.username || '';
  const target = options.username ? String(options.username).toLowerCase() : '';
  if (target && authorUsername.toLowerCase() !== target) return null;

  const id = legacy?.id_str || result.rest_id;
  const createdAtIso = details?.created_at_ms
    ? new Date(Number(details.created_at_ms)).toISOString()
    : toIsoDate(legacy?.created_at);
  const isRetweet = Boolean(legacy?.retweeted_status_result);
  const replyToTweet = unwrapResult(result.reply_to_results);
  const replyToUser = normalizeUserResult(result.reply_to_user_results);
  const inReplyToStatusId = legacy?.in_reply_to_status_id_str || replyToTweet?.rest_id || replyToTweet?.legacy?.id_str || '';
  const inReplyToScreenName = legacy?.in_reply_to_screen_name || replyToUser?.username || '';
  const quoted = unwrapResult(result.quoted_status_result);

  return {
    id,
    url: authorUsername ? `https://x.com/${authorUsername}/status/${id}` : '',
    authorUsername,
    authorName: user?.name || '',
    authorId: user?.id || '',
    createdAt: legacy?.created_at || (details?.created_at_ms ? new Date(Number(details.created_at_ms)).toUTCString() : ''),
    createdAtIso,
    text,
    isReply: Boolean(inReplyToStatusId || inReplyToScreenName || result.reply_to_results || result.reply_to_user_results),
    isQuote: Boolean(legacy?.is_quote_status || quoted?.legacy || result.quoted_tweet_results),
    isRetweet,
    inReplyToStatusId,
    inReplyToScreenName,
    conversationId: legacy?.conversation_id_str || '',
    quotedStatusId: quoted?.legacy?.id_str || quoted?.rest_id || '',
    metrics: {
      impressions: parseCount(result.views?.count),
      likes: parseCount(legacy?.favorite_count ?? counts?.favorite_count),
      replies: parseCount(legacy?.reply_count ?? counts?.reply_count),
      retweets: parseCount(legacy?.retweet_count ?? counts?.retweet_count),
      quotes: parseCount(legacy?.quote_count),
      bookmarks: parseCount(legacy?.bookmark_count ?? counts?.bookmark_count),
    },
    media: mediaFromLegacy(legacy),
    urls: urlsFromLegacy(legacy),
    capturedAt: new Date().toISOString(),
    source: 'graphql',
  };
}

export function extractFromGraphqlPayload(payload, options = {}) {
  const tweets = new Map();
  const users = new Map();
  const stack = [payload];
  const seen = new Set();

  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object' || seen.has(node)) continue;
    seen.add(node);

    const tweet = normalizeTweetNode(node, options);
    if (tweet) tweets.set(tweet.id, mergeTweet(tweets.get(tweet.id), tweet));

    const user = normalizeUserResult(node.user_results || node.core?.user_results || node);
    if (user) {
      const target = options.username ? String(options.username).toLowerCase() : '';
      if (!target || user.username.toLowerCase() === target) users.set(user.username.toLowerCase(), user);
    }

    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
    } else {
      for (const value of Object.values(node)) {
        if (value && typeof value === 'object') stack.push(value);
      }
    }
  }

  return {
    tweets: [...tweets.values()],
    users: [...users.values()],
  };
}

export function mergeTweet(existing, next) {
  if (!existing) return structuredCloneSafe(next);
  const out = { ...existing, ...next };
  out.text = next.text || existing.text || '';
  out.createdAtIso = next.createdAtIso || existing.createdAtIso || '';
  out.isReply = Boolean(existing.isReply || next.isReply);
  out.inReplyToStatusId = next.inReplyToStatusId || existing.inReplyToStatusId || '';
  out.inReplyToScreenName = next.inReplyToScreenName || existing.inReplyToScreenName || '';
  out.conversationId = next.conversationId || existing.conversationId || '';
  out.isQuote = Boolean(existing.isQuote || next.isQuote);
  out.isRetweet = Boolean(existing.isRetweet || next.isRetweet);
  out.media = mergeByKey(existing.media || [], next.media || [], (m) => m.url || m.expandedUrl);
  out.urls = mergeByKey(existing.urls || [], next.urls || [], (u) => u.expandedUrl || u.url);
  out.metrics = {
    impressions: Math.max(existing.metrics?.impressions || 0, next.metrics?.impressions || 0),
    likes: Math.max(existing.metrics?.likes || 0, next.metrics?.likes || 0),
    replies: Math.max(existing.metrics?.replies || 0, next.metrics?.replies || 0),
    retweets: Math.max(existing.metrics?.retweets || 0, next.metrics?.retweets || 0),
    quotes: Math.max(existing.metrics?.quotes || 0, next.metrics?.quotes || 0),
    bookmarks: Math.max(existing.metrics?.bookmarks || 0, next.metrics?.bookmarks || 0),
  };
  return out;
}

export function mergeCaptureRecords(captures, username) {
  const tweets = new Map();
  const users = new Map();
  for (const capture of captures) {
    const extracted = Array.isArray(capture?.tweets)
      ? capture
      : extractFromGraphqlPayload(capture, { username });
    for (const tweet of extracted.tweets || []) {
      if (username && tweet.authorUsername?.toLowerCase() !== username.toLowerCase()) continue;
      tweets.set(tweet.id, mergeTweet(tweets.get(tweet.id), tweet));
    }
    for (const user of extracted.users || []) {
      if (username && user.username?.toLowerCase() !== username.toLowerCase()) continue;
      users.set(user.username.toLowerCase(), user);
    }
  }
  return {
    tweets: [...tweets.values()].sort(compareTweetsAsc),
    users: [...users.values()],
  };
}

export function compareTweetsAsc(a, b) {
  const at = Date.parse(a.createdAtIso || a.createdAt || '') || 0;
  const bt = Date.parse(b.createdAtIso || b.createdAt || '') || 0;
  if (at !== bt) return at - bt;
  return String(a.id).localeCompare(String(b.id));
}

export function classifyTweetType(tweet) {
  if (tweet.isRetweet) return 'repost';
  if (tweet.isReply) return 'reply';
  if (tweet.isQuote) return 'quote';
  if (String(tweet.source || '').includes('dom') && !tweet.conversationId) return 'unclassified';
  return 'post';
}

export function normalizeLanguage(value) {
  const text = String(value || '').trim().toLowerCase();
  if (['en', 'eng', 'english'].includes(text)) return 'en';
  if (['zh', 'cn', 'chinese', '中文', '汉语', '漢語'].includes(text)) return 'zh';
  return 'zh';
}

export function inferCaptureQuality(tweets = []) {
  if (!tweets.length) return 'unknown';
  const hasGraphql = tweets.some((tweet) => String(tweet.source || '').includes('graphql'));
  const hasDom = tweets.some((tweet) => String(tweet.source || '').includes('dom'));
  if (hasGraphql && hasDom) return 'mixed';
  if (hasGraphql) return 'graphql';
  if (hasDom) return 'dom-only';
  return 'unknown';
}

export function summarizeCaptureCompleteness(capture = {}) {
  const tweets = capture.tweets || [];
  const users = capture.users || [];
  const collection = capture.collection || {};
  const latestUser = users.find((user) => Number(user.posts) > 0) || users[0] || {};
  const expectedProfilePosts = Number(latestUser.posts || 0);
  const capturedRecords = tweets.length;
  const captureQuality = collection.captureQuality || inferCaptureQuality(tweets);
  const sourceNames = [
    collection.method,
    collection.requestedMethod,
    ...(collection.inputMethods || []),
    ...(collection.sources || []).map((source) => source.name || source.method || ''),
  ].filter(Boolean);
  const hasGraphql = captureQuality === 'graphql' || captureQuality === 'mixed'
    || tweets.some((tweet) => String(tweet.source || '').includes('graphql'));
  const includesRepliesSource = sourceNames.some((name) => /UserTweetsAndReplies|with[_-]?replies|tweets-and-replies/i.test(name))
    || tweets.some((tweet) => tweet.isReply);
  const sourceExhausted = collection.sourceExhausted === true
    || (collection.sources?.length ? collection.sources.every((source) => source.exhausted) : false);
  const profileCountMatched = expectedProfilePosts ? capturedRecords >= expectedProfilePosts : null;
  const coverageRatio = expectedProfilePosts ? capturedRecords / expectedProfilePosts : null;
  const isFullHistory = Boolean(hasGraphql && includesRepliesSource && sourceExhausted && profileCountMatched !== false);
  let status = 'unknown';
  if (!capturedRecords) status = 'empty';
  else if (captureQuality === 'dom-only') status = 'partial-dom-only';
  else if (!includesRepliesSource) status = 'missing-replies-source';
  else if (!sourceExhausted) status = 'not-exhausted';
  else if (profileCountMatched === false) status = 'source-exhausted-count-gap';
  else if (isFullHistory) status = 'full-history';

  return {
    status,
    isFullHistory,
    captureQuality,
    capturedRecords,
    expectedProfilePosts,
    coverageRatio,
    sourceExhausted,
    includesRepliesSource,
    profileCountMatched,
  };
}

export function renderMarkdown({ username, tweets, users, followerSnapshots = [], generatedAt = new Date().toISOString(), language = 'zh' }) {
  if (normalizeLanguage(language) === 'en') {
    return renderMarkdownEn({ username, tweets, users, followerSnapshots, generatedAt });
  }
  return renderMarkdownZh({ username, tweets, users, followerSnapshots, generatedAt });
}

function renderMarkdownZh({ username, tweets, users, followerSnapshots = [], generatedAt = new Date().toISOString() }) {
  const handle = username.replace(/^@/, '');
  const lines = [];
  lines.push(`# X 起号分析：@${handle}`);
  lines.push('');
  lines.push(`- 生成时间：${generatedAt}`);
  lines.push(`- 推文/回复记录数：${tweets.length}`);
  lines.push(`- 排序：发布时间升序（旧的在上面）`);
  lines.push('');

  const latestUser = users[0] || followerSnapshots.at(-1);
  if (latestUser) {
    lines.push('## 当前账号快照');
    lines.push('');
    lines.push('| username | followers | following | posts | capturedAt |');
    lines.push('|---|---:|---:|---:|---|');
    lines.push(`| @${latestUser.username || handle} | ${fmt(latestUser.followers)} | ${fmt(latestUser.following)} | ${fmt(latestUser.posts)} | ${latestUser.capturedAt || ''} |`);
    lines.push('');
  }

  if (followerSnapshots.length) {
    lines.push('## Follower 快照曲线');
    lines.push('');
    lines.push('> X 公开个人页通常不能回溯历史 follower 数；这里展示的是本工具每次运行累积到本地的快照。');
    lines.push('');
    lines.push('| capturedAt | followers | following | posts |');
    lines.push('|---|---:|---:|---:|');
    for (const row of followerSnapshots) {
      lines.push(`| ${row.capturedAt || ''} | ${fmt(row.followers)} | ${fmt(row.following)} | ${fmt(row.posts)} |`);
    }
    lines.push('');
  }

  lines.push('## 时间线');
  lines.push('');
  if (!tweets.length) {
    lines.push('本次输入没有可用的帖子/回复记录。若 profile header 能看到但时间线为空，常见原因是当前浏览器会话未登录、X 对 headless/未登录页面隐藏 timeline，或页面没有返回可采集的 GraphQL 响应。');
    lines.push('');
  }
  for (const tweet of tweets) {
    const type = classifyTweetType(tweet);
    lines.push(`### ${tweet.createdAtIso || tweet.createdAt || 'unknown time'} · ${type} · ${tweet.id}`);
    lines.push('');
    if (tweet.url) lines.push(`- 链接：${tweet.url}`);
    if (tweet.isReply) lines.push(`- 回复对象：@${tweet.inReplyToScreenName || 'unknown'} / ${tweet.inReplyToStatusId || 'unknown'}`);
    lines.push(`- 指标：评论 ${fmt(tweet.metrics?.replies)} · 曝光 ${fmt(tweet.metrics?.impressions)} · 点赞 ${fmt(tweet.metrics?.likes)} · 转发 ${fmt(tweet.metrics?.retweets)} · 收藏 ${fmt(tweet.metrics?.bookmarks)} · 引用 ${fmt(tweet.metrics?.quotes)}`);
    lines.push('');
    lines.push(normalizeMdText(tweet.text || '(no text)'));
    lines.push('');
    if (tweet.media?.length) {
      lines.push('媒体链接：');
      for (const media of tweet.media) {
        const links = [media.url, media.expandedUrl, ...(media.videoUrls || [])].filter(Boolean);
        lines.push(`- ${media.type || 'media'}: ${links.join(' | ')}`);
      }
      lines.push('');
    }
    if (tweet.urls?.length) {
      lines.push('外链：');
      for (const url of tweet.urls) {
        lines.push(`- ${url.displayUrl || url.expandedUrl || url.url}: ${url.expandedUrl || url.url}`);
      }
      lines.push('');
    }
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

function renderMarkdownEn({ username, tweets, users, followerSnapshots = [], generatedAt = new Date().toISOString() }) {
  const handle = username.replace(/^@/, '');
  const lines = [];
  lines.push(`# X startup analysis: @${handle}`);
  lines.push('');
  lines.push(`- Generated: ${generatedAt}`);
  lines.push(`- Timeline records: ${tweets.length}`);
  lines.push('- Sort order: ascending by creation time, oldest first');
  lines.push(`- Capture quality: ${inferCaptureQuality(tweets)}`);
  lines.push('');

  const latestUser = users[0] || followerSnapshots.at(-1);
  if (latestUser) {
    lines.push('## Current Account Snapshot');
    lines.push('');
    lines.push('| username | followers | following | posts | capturedAt |');
    lines.push('|---|---:|---:|---:|---|');
    lines.push(`| @${latestUser.username || handle} | ${fmt(latestUser.followers)} | ${fmt(latestUser.following)} | ${fmt(latestUser.posts)} | ${latestUser.capturedAt || ''} |`);
    lines.push('');
  }

  if (followerSnapshots.length) {
    lines.push('## Follower Snapshots');
    lines.push('');
    lines.push('> Public X profile pages usually do not expose historical follower counts. This table only shows local snapshots accumulated by this tool.');
    lines.push('');
    lines.push('| capturedAt | followers | following | posts |');
    lines.push('|---|---:|---:|---:|');
    for (const row of followerSnapshots) {
      lines.push(`| ${row.capturedAt || ''} | ${fmt(row.followers)} | ${fmt(row.following)} | ${fmt(row.posts)} |`);
    }
    lines.push('');
  }

  lines.push('## Timeline');
  lines.push('');
  if (!tweets.length) {
    lines.push('No usable posts or replies were found in this input. If the profile header is visible but the timeline is empty, the usual causes are a logged-out browser session, X hiding timelines from headless/logged-out pages, or no capturable GraphQL responses.');
    lines.push('');
  }
  for (const tweet of tweets) {
    const type = classifyTweetType(tweet);
    lines.push(`### ${tweet.createdAtIso || tweet.createdAt || 'unknown time'} · ${type} · ${tweet.id}`);
    lines.push('');
    if (tweet.url) lines.push(`- Link: ${tweet.url}`);
    if (tweet.isReply) lines.push(`- Reply target: @${tweet.inReplyToScreenName || 'unknown'} / ${tweet.inReplyToStatusId || 'unknown'}`);
    lines.push(`- Metrics: comments ${fmt(tweet.metrics?.replies)} · impressions ${fmt(tweet.metrics?.impressions)} · likes ${fmt(tweet.metrics?.likes)} · reposts ${fmt(tweet.metrics?.retweets)} · bookmarks ${fmt(tweet.metrics?.bookmarks)} · quotes ${fmt(tweet.metrics?.quotes)}`);
    lines.push('');
    lines.push(normalizeMdText(tweet.text || '(no text)'));
    lines.push('');
    if (tweet.media?.length) {
      lines.push('Media links:');
      for (const media of tweet.media) {
        const links = [media.url, media.expandedUrl, ...(media.videoUrls || [])].filter(Boolean);
        lines.push(`- ${media.type || 'media'}: ${links.join(' | ')}`);
      }
      lines.push('');
    }
    if (tweet.urls?.length) {
      lines.push('External links:');
      for (const url of tweet.urls) {
        lines.push(`- ${url.displayUrl || url.expandedUrl || url.url}: ${url.expandedUrl || url.url}`);
      }
      lines.push('');
    }
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

function mergeByKey(left, right, keyFn) {
  const out = new Map();
  for (const item of [...left, ...right]) {
    const key = keyFn(item);
    if (key) out.set(key, item);
  }
  return [...out.values()];
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function fmt(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n.toLocaleString('en-US') : '0';
}

function normalizeMdText(text) {
  return String(text).replace(/\r\n/g, '\n').trim();
}

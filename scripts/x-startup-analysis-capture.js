// Paste this whole file into DevTools Console on x.com, then run:
// await XStartupAnalysis.collect({ username: 'aleabitoreddit', maxScrolls: 240 })
(() => {
  if (window.XStartupAnalysis?.version) {
    console.info('[x-startup-analysis] already installed', window.XStartupAnalysis.version);
    return;
  }

  const state = {
    version: '0.1.0',
    username: '',
    tweets: new Map(),
    users: new Map(),
    rawResponses: 0,
    startedAt: new Date().toISOString(),
  };

  const graphqlMatcher = /\/i\/api\/graphql\/.*(UserTweets|UserTweetsAndReplies|TweetDetail|UserByScreenName|UserByRestId|SearchTimeline|UserMedia)/i;

  function configure(options = {}) {
    if (options.username) state.username = String(options.username).replace(/^@/, '').toLowerCase();
    return status();
  }

  function parseCount(value) {
    if (value == null || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const text = String(value).trim().replace(/,/g, '');
    const match = text.match(/^([\d.]+)\s*([KMB万亿])?$/i);
    if (!match) return Number.parseInt(text.replace(/[^\d]/g, ''), 10) || 0;
    const n = Number.parseFloat(match[1]);
    const suffix = match[2]?.toLowerCase();
    const factor = suffix === 'k' ? 1_000
      : suffix === 'm' ? 1_000_000
      : suffix === 'b' ? 1_000_000_000
      : suffix === '万' ? 10_000
      : suffix === '亿' ? 100_000_000
      : 1;
    return Math.round(n * factor);
  }

  function toIsoDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }

  function unwrap(node) {
    let current = node;
    const seen = new Set();
    while (current && typeof current === 'object' && !seen.has(current)) {
      seen.add(current);
      if (current.result && typeof current.result === 'object') current = current.result;
      else if (current.tweet && typeof current.tweet === 'object') current = current.tweet;
      else if (current.tweet_results?.result) current = current.tweet_results.result;
      else if (current.itemContent?.tweet_results?.result) current = current.itemContent.tweet_results.result;
      else if (current.content?.itemContent?.tweet_results?.result) current = current.content.itemContent.tweet_results.result;
      else break;
    }
    return current;
  }

  function normalizeUser(node) {
    const user = unwrap(node);
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

  function normalizeTweet(node, sourceUrl = '') {
    const result = unwrap(node);
    const legacy = result?.legacy;
    const details = result?.details;
    const counts = result?.counts;
    if ((!legacy && !details) || !(legacy?.id_str || result.rest_id)) return null;
    const user = normalizeUser(result.core?.user_results || result.user_results);
    const authorUsername = user?.username || '';
    if (state.username && authorUsername.toLowerCase() !== state.username) return null;
    const id = legacy?.id_str || result.rest_id;
    const noteText = result.note_tweet?.note_tweet_results?.result?.text || '';
    const media = [];
    for (const item of legacy.extended_entities?.media || legacy.entities?.media || []) {
      media.push({
        type: item.type || '',
        url: item.media_url_https || item.media_url || '',
        expandedUrl: item.expanded_url || item.url || '',
        videoUrls: [...new Set((item.video_info?.variants || []).map((v) => v.url).filter(Boolean))],
      });
    }
    const urls = (legacy.entities?.urls || []).map((u) => ({
      url: u.url || '',
      expandedUrl: u.expanded_url || '',
      displayUrl: u.display_url || '',
    }));
    const quoted = unwrap(result.quoted_status_result);
    const replyToTweet = unwrap(result.reply_to_results);
    const replyToUser = normalizeUser(result.reply_to_user_results);
    const inReplyToStatusId = legacy?.in_reply_to_status_id_str || replyToTweet?.rest_id || replyToTweet?.legacy?.id_str || '';
    const inReplyToScreenName = legacy?.in_reply_to_screen_name || replyToUser?.username || '';
    const createdAtIso = details?.created_at_ms
      ? new Date(Number(details.created_at_ms)).toISOString()
      : toIsoDate(legacy?.created_at);
    return {
      id,
      url: authorUsername ? `https://x.com/${authorUsername}/status/${id}` : '',
      authorUsername,
      authorName: user?.name || '',
      authorId: user?.id || '',
      createdAt: legacy?.created_at || (details?.created_at_ms ? new Date(Number(details.created_at_ms)).toUTCString() : ''),
      createdAtIso,
      text: noteText || details?.full_text || legacy?.full_text || legacy?.text || '',
      isReply: Boolean(inReplyToStatusId || inReplyToScreenName || result.reply_to_results || result.reply_to_user_results),
      isQuote: Boolean(legacy?.is_quote_status || quoted?.legacy || result.quoted_tweet_results),
      isRetweet: Boolean(legacy?.retweeted_status_result),
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
      media,
      urls,
      capturedAt: new Date().toISOString(),
      source: sourceUrl || 'graphql',
    };
  }

  function mergeTweet(existing, next) {
    if (!existing) return next;
    return {
      ...existing,
      ...next,
      text: next.text || existing.text || '',
      isReply: Boolean(existing.isReply || next.isReply),
      inReplyToStatusId: next.inReplyToStatusId || existing.inReplyToStatusId || '',
      inReplyToScreenName: next.inReplyToScreenName || existing.inReplyToScreenName || '',
      conversationId: next.conversationId || existing.conversationId || '',
      isQuote: Boolean(existing.isQuote || next.isQuote),
      isRetweet: Boolean(existing.isRetweet || next.isRetweet),
      media: mergeByKey(existing.media || [], next.media || [], (m) => m.url || m.expandedUrl),
      urls: mergeByKey(existing.urls || [], next.urls || [], (u) => u.expandedUrl || u.url),
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

  function mergeByKey(left, right, keyFn) {
    const out = new Map();
    for (const item of [...left, ...right]) {
      const key = keyFn(item);
      if (key) out.set(key, item);
    }
    return [...out.values()];
  }

  function ingest(payload, sourceUrl = '') {
    state.rawResponses += 1;
    const stack = [payload];
    const seen = new Set();
    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object' || seen.has(node)) continue;
      seen.add(node);

      const user = normalizeUser(node.user_results || node.core?.user_results || node);
      if (user && (!state.username || user.username.toLowerCase() === state.username)) {
        state.users.set(user.username.toLowerCase(), user);
      }

      const tweet = normalizeTweet(node, sourceUrl);
      if (tweet) state.tweets.set(tweet.id, mergeTweet(state.tweets.get(tweet.id), tweet));

      if (Array.isArray(node)) {
        for (const item of node) stack.push(item);
      } else {
        for (const value of Object.values(node)) {
          if (value && typeof value === 'object') stack.push(value);
        }
      }
    }
  }

  function hookFetch() {
    const original = window.fetch;
    window.fetch = async function (...args) {
      const response = await original.apply(this, args);
      const url = String(args[0]?.url || args[0] || '');
      if (graphqlMatcher.test(url)) {
        response.clone().json().then((json) => ingest(json, url)).catch(() => {});
      }
      return response;
    };
  }

  function hookXhr() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.__xsaUrl = String(url || '');
      this.addEventListener('load', function () {
        if (!graphqlMatcher.test(this.__xsaUrl || '')) return;
        try { ingest(JSON.parse(this.responseText), this.__xsaUrl); } catch (_) {}
      });
      return originalOpen.call(this, method, url, ...rest);
    };
  }

  function captureVisibleDom() {
    captureProfileHeaderDom();
    for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
      const statusLink = [...article.querySelectorAll('a[href*="/status/"]')]
        .map((a) => a.getAttribute('href'))
        .find(Boolean);
      const id = statusLink?.match(/\/status\/(\d+)/)?.[1];
      if (!id) continue;
      const username = statusLink.match(/^\/([^/]+)\/status\//)?.[1] || state.username || '';
      if (state.username && username.toLowerCase() !== state.username) continue;
      const time = article.querySelector('time')?.getAttribute('datetime') || '';
      const text = [...article.querySelectorAll('[data-testid="tweetText"]')]
        .map((el) => el.innerText)
        .join('\n')
        .trim();
      const replyContext = readReplyContext(article);
      const aria = article.querySelector('[role="group"]')?.getAttribute('aria-label') || '';
      const metrics = metricFromAria(aria);
      const media = [...article.querySelectorAll('img[src*="twimg.com/media"], video source')]
        .map((el) => ({ type: el.tagName === 'SOURCE' ? 'video' : 'photo', url: el.src || '', expandedUrl: '', videoUrls: el.src ? [el.src] : [] }));
      const tweet = {
        id,
        url: `https://x.com/${username}/status/${id}`,
        authorUsername: username,
        authorName: '',
        authorId: '',
        createdAt: time,
        createdAtIso: toIsoDate(time),
        text,
        isReply: Boolean(replyContext.screenName),
        isQuote: false,
        isRetweet: false,
        inReplyToStatusId: '',
        inReplyToScreenName: replyContext.screenName,
        conversationId: '',
        quotedStatusId: '',
        metrics,
        media,
        urls: [],
        capturedAt: new Date().toISOString(),
        source: 'dom',
      };
      state.tweets.set(id, mergeTweet(state.tweets.get(id), tweet));
    }
  }

  function readReplyContext(article) {
    const text = article.innerText || '';
    const patterns = [
      /Replying to\s+@([A-Za-z0-9_]{1,15})/i,
      /回复\s*@([A-Za-z0-9_]{1,15})/i,
      /回复给\s*@([A-Za-z0-9_]{1,15})/i,
      /正在回复\s*@([A-Za-z0-9_]{1,15})/i,
      /回覆\s*@([A-Za-z0-9_]{1,15})/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return { screenName: match[1] };
    }
    return { screenName: '' };
  }

  function captureProfileHeaderDom() {
    const handle = state.username || location.pathname.split('/').filter(Boolean)[0] || '';
    if (!handle) return;
    const lines = document.body.innerText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const handleIndex = lines.findIndex((line) => line.toLowerCase() === `@${handle.toLowerCase()}`);
    const followers = readProfileMetric(lines, [/^([\d,.KMB万亿]+)\s+Followers$/i, /^([\d,.KMB万亿]+)\s*粉丝$/i]);
    const following = readProfileMetric(lines, [/^([\d,.KMB万亿]+)\s+Following$/i, /^正在关注\s*([\d,.KMB万亿]+)$/i, /^([\d,.KMB万亿]+)\s*关注中$/i]);
    const posts = readProfileMetric(lines, [/^([\d,.KMB万亿]+)\s+posts$/i, /^([\d,.KMB万亿]+)\s*帖子$/i]);
    if (!followers && !following && !posts) return;
    const name = handleIndex > 0 ? lines[handleIndex - 1] : handle;
    state.users.set(handle.toLowerCase(), {
      id: '',
      username: handle,
      name,
      followers,
      following,
      posts,
      listed: 0,
      capturedAt: new Date().toISOString(),
      source: 'dom-profile',
    });
  }

  function readProfileMetric(lines, patterns) {
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) return parseCount(match[1]);
      }
    }
    return 0;
  }

  function metricFromAria(label) {
    const read = (patterns) => {
      for (const re of patterns) {
        const match = label.match(re);
        if (match) return parseCount(match[1]);
      }
      return 0;
    };
    return {
      replies: read([/([\d,.KMB万亿]+)\s+(?:repl|replies|回复|回覆)/i]),
      retweets: read([/([\d,.KMB万亿]+)\s+(?:repost|retweet|转帖|轉發|转发)/i]),
      likes: read([/([\d,.KMB万亿]+)\s+(?:like|likes|喜欢|喜歡|点赞)/i]),
      bookmarks: read([/([\d,.KMB万亿]+)\s+(?:bookmark|bookmarks|收藏)/i]),
      impressions: read([/([\d,.KMB万亿]+)\s+(?:view|views|查看|浏览|瀏覽|展示|曝光)/i]),
      quotes: 0,
    };
  }

  async function collect(options = {}) {
    configure(options);
    const maxScrolls = Number(options.maxScrolls || 180);
    const pauseMs = Number(options.pauseMs || 1200);
    const idleLimit = Number(options.idleLimit || 8);
    let idle = 0;
    let lastCount = state.tweets.size;
    for (let i = 0; i < maxScrolls && idle < idleLimit; i += 1) {
      captureVisibleDom();
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(pauseMs);
      captureVisibleDom();
      const nowCount = state.tweets.size;
      idle = nowCount === lastCount ? idle + 1 : 0;
      lastCount = nowCount;
      console.info(`[x-startup-analysis] scroll ${i + 1}/${maxScrolls}, tweets=${state.tweets.size}, users=${state.users.size}, idle=${idle}`);
    }
    return status();
  }

  function status() {
    captureProfileHeaderDom();
    return {
      version: state.version,
      username: state.username,
      tweets: state.tweets.size,
      users: state.users.size,
      rawResponses: state.rawResponses,
      startedAt: state.startedAt,
      page: location.href,
    };
  }

  function exportJson() {
    captureProfileHeaderDom();
    return {
      version: state.version,
      username: state.username,
      capturedAt: new Date().toISOString(),
      page: location.href,
      tweets: [...state.tweets.values()].sort((a, b) => String(a.createdAtIso).localeCompare(String(b.createdAtIso))),
      users: [...state.users.values()],
    };
  }

  async function copyJson() {
    const text = JSON.stringify(exportJson(), null, 2);
    await navigator.clipboard.writeText(text);
    return { bytes: text.length, ...status() };
  }

  function downloadJson() {
    const text = JSON.stringify(exportJson(), null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `x-startup-analysis-${state.username || 'capture'}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    return { bytes: text.length, ...status() };
  }

  function clear() {
    state.tweets.clear();
    state.users.clear();
    state.rawResponses = 0;
    state.startedAt = new Date().toISOString();
    return status();
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  hookFetch();
  hookXhr();

  window.XStartupAnalysis = {
    version: state.version,
    configure,
    collect,
    captureVisibleDom,
    status,
    exportJson,
    copyJson,
    downloadJson,
    clear,
  };

  console.info('[x-startup-analysis] installed. Run: await XStartupAnalysis.collect({ username: "aleabitoreddit" })');
})();

#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import {
  classifyTweetType,
  extractFromGraphqlPayload,
  inferCaptureQuality,
  mergeCaptureRecords,
  normalizeLanguage,
  summarizeCaptureCompleteness,
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
for (const input of inputFiles) captures.push(...await readInput(resolve(input), username));
const inputLimitations = captureLimitationsFromInputs(captures);
const inputCompleteness = captureCompletenessFromInputs(captures);

const merged = mergeCaptureRecords(captures, username);
const report = renderInsights({
  username,
  tweets: merged.tweets,
  users: merged.users,
  generatedAt: new Date().toISOString(),
  language,
  inputLimitations,
  inputCompleteness,
});

const outPath = resolve(args.out);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, report);
console.log(JSON.stringify({ username, language, tweets: merged.tweets.length, out: outPath }, null, 2));

function renderInsights({ username, tweets, users, generatedAt, language = 'zh', inputLimitations = [], inputCompleteness = null }) {
  const zh = normalizeLanguage(language) === 'zh';
  const knownReplies = tweets.filter((tweet) => tweet.isReply);
  const domUnclassified = tweets.filter((tweet) => !tweet.isReply && !tweet.isQuote && !tweet.isRetweet && String(tweet.source || '').includes('dom'));
  const captureLimitations = [...new Set([
    ...inputLimitations,
    ...tweets.map((tweet) => tweet.captureLimitation).filter(Boolean),
  ].map(cleanLine).filter(Boolean))];
  const bugSample = tweets.find((tweet) => tweet.id === '2060940144203698485');
  const topByImpressions = top(tweets, (tweet) => metric(tweet, 'impressions'), 12);
  const topByBookmarks = top(tweets, (tweet) => metric(tweet, 'bookmarks'), 10);
  const topByEngagement = top(tweets, engagementScore, 10);
  const metricCorrelations = correlationPairs(tweets, [
    ['impressions', (tweet) => metric(tweet, 'impressions')],
    ['likes', (tweet) => metric(tweet, 'likes')],
    ['comments', (tweet) => metric(tweet, 'replies')],
    ['retweets', (tweet) => metric(tweet, 'retweets')],
    ['bookmarks', (tweet) => metric(tweet, 'bookmarks')],
    ['quotes', (tweet) => metric(tweet, 'quotes')],
  ]);
  const attributeCorrelations = attributeCorrelationRows(tweets);
  const hourRows = summarizeGroups(tweets, (tweet) => hourBucket(localHour(tweet.createdAtIso)), 'local time bucket');
  const textRows = summarizeGroups(tweets, (tweet) => textBucket(tweet.text), 'text length');
  const mediaRows = summarizeGroups(tweets, (tweet) => tweet.media?.length ? 'has media' : 'text only', 'media');
  const topicRows = summarizeTopics(tweets);
  const styleRows = inferAccountStyle(tweets);
  const interactions = summarizeInteractions(knownReplies);
  const latestUser = users[0];
  const completeness = inputCompleteness || summarizeCaptureCompleteness({ tweets, users });

  const lines = [];
  lines.push(zh ? `# @${username} X 账号外部视角分析` : `# @${username} outside-in X account analysis`);
  lines.push('');
  lines.push(zh ? `生成时间：${generatedAt}` : `Generated: ${generatedAt}`);
  lines.push('');
  lines.push(zh ? '## 数据来源与分类边界' : '## Source and Classification Boundary');
  lines.push('');
  lines.push(zh
    ? `- 输入记录：来自本地浏览器采集的 ${fmt(tweets.length)} 条时间线记录。`
    : `- Input records: ${fmt(tweets.length)} timeline items from local browser capture.`);
  lines.push(zh ? `- Capture quality：${inferCaptureQuality(tweets)}。` : `- Capture quality: ${inferCaptureQuality(tweets)}.`);
  lines.push(zh
    ? `- Full-history status：${completeness.status}。已采集 ${fmt(completeness.capturedRecords)} / profile count ${fmt(completeness.expectedProfilePosts || 0)}。`
    : `- Full-history status: ${completeness.status}. Captured ${fmt(completeness.capturedRecords)} / profile count ${fmt(completeness.expectedProfilePosts || 0)}.`);
  if (!completeness.isFullHistory) {
    lines.push(zh
      ? '- 重要：这不是 full-history 报告，不能当作该账号全部 posts/replies 的完整画像。'
      : '- Important: this is not a full-history report and should not be treated as a complete picture of all posts/replies.');
  }
  if (latestUser) {
    lines.push(zh
      ? `- 当前账号快照：${fmt(latestUser.followers)} followers，${fmt(latestUser.following)} following，profile post count ${fmt(latestUser.posts)}。`
      : `- Current captured account snapshot: ${fmt(latestUser.followers)} followers, ${fmt(latestUser.following)} following, ${fmt(latestUser.posts)} profile post count.`);
  }
  lines.push(zh
    ? `- 当前数据集中可确定的 replies：${fmt(knownReplies.length)}。`
    : `- Definite replies in the current dataset: ${fmt(knownReplies.length)}.`);
  lines.push(zh
    ? `- 缺少 reply 元数据的 DOM-only 记录：${fmt(domUnclassified.length)}。这些只能视为 unclassified/top-level-unknown，不能证明是 posts。`
    : `- DOM-only items without reply metadata: ${fmt(domUnclassified.length)}. These must be treated as unclassified/top-level-unknown, not proven posts.`);
  if (bugSample) {
    const bugType = bugSample.isReply ? 'reply' : 'unclassified';
    lines.push(zh
      ? `- 旧 bug 样本：\`2060940144203698485\` 在本数据中渲染为 \`${bugType}\`。它在 live X status 页可验证为回复 \`@rwayne\`，但当前采集行本身不含足够父帖字段。`
      : `- Bug sample in this dataset: \`2060940144203698485\` is rendered as \`${bugType}\`. It is a verified reply to \`@rwayne\` on the live X status page, but this capture does not include the parent fields needed to prove that from the timeline row alone.`);
  }
  lines.push(zh
    ? `- 本输入的正确解读：${fmt(knownReplies.length)} 条 definite replies，加 ${fmt(domUnclassified.length)} 条 DOM-only unclassified。没有 GraphQL/SSR reply enrichment 时，不要把 unclassified 当作 top-level posts。`
    : `- Correct interpretation for this input: ${fmt(knownReplies.length)} definite replies plus ${fmt(domUnclassified.length)} DOM-only unclassified items. Do not treat unclassified rows as top-level posts without GraphQL/SSR reply enrichment.`);
  for (const limitation of captureLimitations) {
    lines.push(zh ? `- 采集限制：${limitation}` : `- Capture limitation: ${limitation}`);
  }
  if (tweets.some((tweet) => String(tweet.source || '').includes('dom'))) {
    lines.push(zh
      ? '- 文本限制：DOM recapture 保存的是 X 当前可见文本。如果 X UI 自动翻译了帖子，抓到的可能是译文而非原文。'
      : '- Text limitation: DOM recapture stores the text currently visible in X. If X auto-translates a post in the UI, the captured text can be translated rather than the original-language text.');
  }
  lines.push('');

  lines.push(zh ? '## 互动指标相关性' : '## Engagement Correlations');
  lines.push('');
  lines.push(zh ? '基于采集到的公开计数，计算指标之间的 Spearman 相关性：' : 'Metric-to-metric Spearman correlations, using public counts from the capture:');
  lines.push('');
  lines.push('| pair | rho | interpretation |');
  lines.push('|---|---:|---|');
  for (const row of metricCorrelations.slice(0, 12)) {
    lines.push(`| ${row.left} vs ${row.right} | ${row.rho.toFixed(2)} | ${interpretCorrelation(row.rho)} |`);
  }
  lines.push('');
  lines.push(zh ? '内容属性与 reach / saves 的相关性：' : 'Attribute correlations with reach and saves:');
  lines.push('');
  lines.push('| attribute | impressions rho | likes rho | bookmarks rho |');
  lines.push('|---|---:|---:|---:|');
  for (const row of attributeCorrelations) {
    lines.push(`| ${row.attribute} | ${row.impressions.toFixed(2)} | ${row.likes.toFixed(2)} | ${row.bookmarks.toFixed(2)} |`);
  }
  lines.push('');

  lines.push(zh ? '## 发布时间与格式模式' : '## Timing and Format Patterns');
  lines.push('');
  lines.push(renderGroupTable(hourRows));
  lines.push('');
  lines.push(renderGroupTable(textRows));
  lines.push('');
  lines.push(renderGroupTable(mediaRows));
  lines.push('');

  lines.push(zh ? '## 主题信号' : '## Topic Signals');
  lines.push('');
  lines.push('| topic | records | median impressions | median likes | median bookmarks | example high-reach post |');
  lines.push('|---|---:|---:|---:|---:|---|');
  for (const row of topicRows) {
    lines.push(`| ${row.topic} | ${fmt(row.count)} | ${fmt(row.medianImpressions)} | ${fmt(row.medianLikes)} | ${fmt(row.medianBookmarks)} | ${linkCell(row.example)} |`);
  }
  lines.push('');

  lines.push(zh ? '## 公开信号最高的时间线记录' : '## Top Timeline Items by Public Signals');
  lines.push('');
  lines.push(zh ? '按曝光排序：' : 'By impressions:');
  lines.push('');
  lines.push(renderTweetTable(topByImpressions));
  lines.push('');
  lines.push(zh ? '按收藏排序：' : 'By bookmarks:');
  lines.push('');
  lines.push(renderTweetTable(topByBookmarks));
  lines.push('');
  lines.push(zh ? '按加权互动分排序：' : 'By weighted engagement score:');
  lines.push('');
  lines.push(renderTweetTable(topByEngagement));
  lines.push('');

  lines.push(zh ? '## 互动账号' : '## Interaction Accounts');
  lines.push('');
  if (interactions.length) {
    lines.push('| account | definite replies | median impressions | example |');
    lines.push('|---|---:|---:|---|');
    for (const row of interactions.slice(0, 20)) {
      lines.push(`| @${row.account} | ${fmt(row.count)} | ${fmt(row.medianImpressions)} | ${linkCell(row.example)} |`);
    }
  } else {
    lines.push(zh ? '本次采集中没有可确定的 reply target。' : 'No definite reply targets are available in this capture.');
  }
  lines.push('');

  lines.push(zh ? '## 账号风格与增长启发' : '## Account Style and Growth Lessons');
  lines.push('');
  for (const row of styleRows) lines.push(zh ? `- ${row.zh}` : `- ${row.en}`);
  lines.push('');
  lines.push(zh ? '## 推荐的下一次采集' : '## Recommended Next Capture');
  lines.push('');
  lines.push(zh
    ? `- 若要 full-fidelity 运行，在滚动前把更新后的 capture script 粘贴到 DevTools Console 的 \`https://x.com/${username}/with_replies\`，以便 hook fetch/XHR 并保留 GraphQL/Relay reply 字段。`
    : `- For the next full-fidelity run, paste the updated capture script directly into DevTools Console on \`https://x.com/${username}/with_replies\` before scrolling so it can hook fetch/XHR and preserve GraphQL/Relay reply fields.`);
  lines.push(zh
    ? '- 尽量保留 raw GraphQL responses 或 status-page SSR reply enrichment；DOM-only 行只有出现明确 reply context 时才可判为 reply，否则保持 `unclassified`。'
    : '- Keep raw GraphQL responses or status-page SSR reply enrichment when possible; DOM-only rows should remain `unclassified` unless an explicit reply context is present.');
  lines.push(zh
    ? '- GraphQL-backed 运行后重新生成本报告，并比较 reply-target leaderboard，这会显著增强“这个账号和谁互动”部分。'
    : '- Regenerate this report after the GraphQL-backed run and compare the reply-target leaderboard. That will make the “who this account interacts with” section much stronger.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

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
    return text.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
  }
  const json = JSON.parse(text);
  if (Array.isArray(json)) return json;
  if (json.tweets || json.users) return [json];
  if (json.data?.tweets || json.data?.users) return [json.data];
  return [extractFromGraphqlPayload(json, { username })];
}

function captureLimitationsFromInputs(captures) {
  const out = [];
  for (const capture of captures) {
    for (const limitation of capture?.collection?.limitations || []) out.push(limitation);
  }
  return out;
}

function cleanLine(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function captureCompletenessFromInputs(captures) {
  const rows = captures
    .map((capture) => capture?.collection?.completeness)
    .filter(Boolean);
  const full = rows.find((row) => row.isFullHistory);
  return full || rows[0] || null;
}

function metric(tweet, key) {
  return Number(tweet.metrics?.[key] || 0);
}

function engagementScore(tweet) {
  return metric(tweet, 'likes')
    + metric(tweet, 'replies')
    + (2 * metric(tweet, 'retweets'))
    + (2 * metric(tweet, 'bookmarks'))
    + (3 * metric(tweet, 'quotes'));
}

function top(tweets, scoreFn, count) {
  return tweets.slice().sort((a, b) => scoreFn(b) - scoreFn(a)).slice(0, count);
}

function correlationPairs(tweets, fields) {
  const rows = [];
  for (let i = 0; i < fields.length; i += 1) {
    for (let j = i + 1; j < fields.length; j += 1) {
      const [left, leftFn] = fields[i];
      const [right, rightFn] = fields[j];
      rows.push({ left, right, rho: spearman(tweets.map(leftFn), tweets.map(rightFn)) });
    }
  }
  return rows.sort((a, b) => Math.abs(b.rho) - Math.abs(a.rho));
}

function attributeCorrelationRows(tweets) {
  const fields = [
    ['text length', (tweet) => clean(tweet.text).length],
    ['line count', (tweet) => clean(tweet.text).split('\n').filter(Boolean).length],
    ['has media', (tweet) => tweet.media?.length ? 1 : 0],
    ['has external link', (tweet) => tweet.urls?.length ? 1 : 0],
    ['definite reply', (tweet) => tweet.isReply ? 1 : 0],
    ['local posting hour', (tweet) => localHour(tweet.createdAtIso)],
  ];
  return fields.map(([attribute, fn]) => ({
    attribute,
    impressions: spearman(tweets.map(fn), tweets.map((tweet) => metric(tweet, 'impressions'))),
    likes: spearman(tweets.map(fn), tweets.map((tweet) => metric(tweet, 'likes'))),
    bookmarks: spearman(tweets.map(fn), tweets.map((tweet) => metric(tweet, 'bookmarks'))),
  }));
}

function summarizeGroups(tweets, groupFn, label) {
  const groups = new Map();
  for (const tweet of tweets) {
    const key = groupFn(tweet);
    const group = groups.get(key) || [];
    group.push(tweet);
    groups.set(key, group);
  }
  return [...groups.entries()]
    .map(([group, rows]) => ({
      label,
      group,
      count: rows.length,
      medianImpressions: median(rows.map((tweet) => metric(tweet, 'impressions'))),
      medianLikes: median(rows.map((tweet) => metric(tweet, 'likes'))),
      medianBookmarks: median(rows.map((tweet) => metric(tweet, 'bookmarks'))),
    }))
    .sort((a, b) => b.medianImpressions - a.medianImpressions);
}

function summarizeTopics(tweets) {
  const topics = [
    ['markets / investing', /\\$[A-Z]{1,6}\\b|market|markets|stock|stocks|shares|long thesis|short sellers|valuation|liquidity|IPO|Nasdaq|CNBC|institutions|Fidelity|JPM|trade|trading|bullish|compounding|投资|股票|估值|上市|做多|做空/i],
    ['supply chain / geopolitics', /supply chain|export control|controls|China|Japan|Korea|Taiwan|TSM|Hynix|Samsung|phosphorous|tungsten|WF6|photonics|robotics|warfare|geopolitic|供应链|出口管制|地缘/i],
    ['AI / semiconductors', /AI|semiconductor|chip|chips|TSM|SK Hynix|Samsung|photonics|robotics|Nvidia|compute|GPU|晶圆|半导体|芯片|算力/i],
    ['culture / regional observations', /Sweden|Swedish|China|America|Europe|Japan|Korea|markets:|lunch|mother|文化|地区|欧洲|美国|瑞典/i],
    ['product / build notes', /产品|用户|需求|发布|上线|功能|版本|demo|build|插件|开发|MVP|项目|product|launch|users/i],
  ];
  return topics.map(([topic, pattern]) => {
    const rows = tweets.filter((tweet) => pattern.test(clean(tweet.text)));
    const example = top(rows, (tweet) => metric(tweet, 'impressions'), 1)[0];
    return {
      topic,
      count: rows.length,
      medianImpressions: median(rows.map((tweet) => metric(tweet, 'impressions'))),
      medianLikes: median(rows.map((tweet) => metric(tweet, 'likes'))),
      medianBookmarks: median(rows.map((tweet) => metric(tweet, 'bookmarks'))),
      example,
    };
  }).sort((a, b) => b.count - a.count);
}

function inferAccountStyle(tweets) {
  const text = tweets.map((tweet) => clean(tweet.text)).join(' ');
  const tickerCount = (text.match(/\\$[A-Z]{1,6}\\b/g) || []).length;
  const supplyChainHits = /supply chain|export control|WF6|phosphorous|tungsten|photonics|semiconductor|TSM|Hynix|Samsung/i.test(text);
  const mediaShare = tweets.length ? tweets.filter((tweet) => tweet.media?.length).length / tweets.length : 0;
  const bookmarkTop = top(tweets, (tweet) => metric(tweet, 'bookmarks'), 1)[0];
  if (tickerCount >= 3 || supplyChainHits) {
    return [
      {
        en: 'The account’s core style is market-native research commentary: ticker-led posts, strong opinions, supply-chain reasoning, and public thesis updates rather than generic news aggregation.',
        zh: '这个账号的核心风格是市场原生研究评论：以 ticker 为入口，给出强观点、供应链推理和公开 thesis update，而不是泛泛转述新闻。',
      },
      {
        en: 'The visible value to followers is asymmetric context: it links obscure suppliers, export controls, regional behavior, and market reactions into investable narratives readers can debate or save.',
        zh: '它给读者的可见价值是非对称上下文：把冷门供应商、出口管制、地区行为和市场反应串成可投资、可讨论、可收藏的叙事。',
      },
      {
        en: `The strongest saved item in this capture is ${bookmarkTop?.url || 'a high-context market post'}, which suggests followers reward posts that combine a concrete thesis with enough reasoning to revisit later.`,
        zh: `本次采集中收藏最高的内容是 ${bookmarkTop?.url || '一条高上下文市场帖'}，说明读者会奖励“具体 thesis + 足够推理、值得回看”的内容。`,
      },
      {
        en: mediaShare > 0.2
          ? 'Media appears to help because screenshots/charts make the claim feel evidenced, but the account still relies primarily on text reasoning and market framing.'
          : 'The account relies primarily on text reasoning and market framing; media is useful evidence when present but is not the whole product.',
        zh: mediaShare > 0.2
          ? '图片/截图有助于让判断看起来有证据，但账号主要还是靠文字推理和市场 framing 获得传播。'
          : '账号主要靠文字推理和市场 framing；有图片时能增强证据感，但图片不是核心产品。',
      },
      {
        en: 'Replication lesson: pick a narrow information edge, publish high-conviction theses with receipts, update winners and losers publicly, and turn complex supply-chain facts into simple market consequences.',
        zh: '可复制经验：选择一个窄的信息优势，持续发布有证据的高置信 thesis，公开更新成败，并把复杂供应链事实翻译成简单市场后果。',
      },
    ];
  }
  return [
    {
      en: 'The account behaves like a public field notebook: frequent observations, experiments, and tactical lessons rather than a polished media page.',
      zh: '这个账号更像公开 field notebook：高频观察、实验和战术经验，而不是精修媒体页。',
    },
    {
      en: 'The strongest repeatable value is practical context that readers can copy, debate, or save for later.',
      zh: '最可复制的价值是实用上下文：读者可以照做、讨论或收藏后回看。',
    },
    {
      en: 'High-reach posts tend to package a concrete pain point or insight in plain language, then attach proof, a screenshot, or a link.',
      zh: '高 reach 内容通常用直白语言包装具体痛点或洞察，再附上证据、截图或链接。',
    },
    {
      en: 'Replies and interaction may be a distribution channel, but DOM-only capture can undercount that effect.',
      zh: '回复和互动可能是分发渠道，但 DOM-only 采集会低估这部分影响。',
    },
  ];
}

function summarizeInteractions(replies) {
  const groups = new Map();
  for (const tweet of replies) {
    const account = tweet.inReplyToScreenName || 'unknown';
    const rows = groups.get(account) || [];
    rows.push(tweet);
    groups.set(account, rows);
  }
  return [...groups.entries()].map(([account, rows]) => ({
    account,
    count: rows.length,
    medianImpressions: median(rows.map((tweet) => metric(tweet, 'impressions'))),
    example: top(rows, (tweet) => metric(tweet, 'impressions'), 1)[0],
  })).sort((a, b) => b.count - a.count || b.medianImpressions - a.medianImpressions);
}

function renderGroupTable(rows) {
  if (!rows.length) return '';
  const label = rows[0].label;
  const lines = [`| ${label} | records | median impressions | median likes | median bookmarks |`, '|---|---:|---:|---:|---:|'];
  for (const row of rows) {
    lines.push(`| ${row.group} | ${fmt(row.count)} | ${fmt(row.medianImpressions)} | ${fmt(row.medianLikes)} | ${fmt(row.medianBookmarks)} |`);
  }
  return lines.join('\n');
}

function renderTweetTable(rows) {
  const lines = ['| time | type | impressions | likes | comments | bookmarks | text |', '|---|---|---:|---:|---:|---:|---|'];
  for (const tweet of rows) {
    const type = classifyTweetType(tweet);
    lines.push(`| ${tweet.createdAtIso || ''} | ${type} | ${fmt(metric(tweet, 'impressions'))} | ${fmt(metric(tweet, 'likes'))} | ${fmt(metric(tweet, 'replies'))} | ${fmt(metric(tweet, 'bookmarks'))} | ${linkCell(tweet)} |`);
  }
  return lines.join('\n');
}

function linkCell(tweet) {
  if (!tweet) return '';
  const text = clean(tweet.text || '(no text)').replace(/\|/g, '/').slice(0, 90);
  return tweet.url ? `[${text}](${tweet.url})` : text;
}

function localHour(iso) {
  const time = Date.parse(iso || '');
  if (!Number.isFinite(time)) return 0;
  return new Date(time + (8 * 60 * 60 * 1000)).getUTCHours();
}

function hourBucket(hour) {
  if (hour < 6) return '00-05';
  if (hour < 12) return '06-11';
  if (hour < 18) return '12-17';
  return '18-23';
}

function textBucket(text) {
  const length = clean(text).length;
  if (length === 0) return '0';
  if (length <= 40) return '1-40';
  if (length <= 120) return '41-120';
  if (length <= 280) return '121-280';
  return '281+';
}

function clean(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function spearman(xs, ys) {
  if (xs.length !== ys.length || xs.length < 2) return 0;
  return pearson(rank(xs), rank(ys));
}

function rank(values) {
  const sorted = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = Array(values.length);
  for (let i = 0; i < sorted.length;) {
    let j = i + 1;
    while (j < sorted.length && sorted[j].value === sorted[i].value) j += 1;
    const averageRank = (i + j + 1) / 2;
    for (let k = i; k < j; k += 1) ranks[sorted[k].index] = averageRank;
    i = j;
  }
  return ranks;
}

function pearson(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((sum, value) => sum + value, 0) / n;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / n;
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denominator = Math.sqrt(denomX * denomY);
  return denominator ? numerator / denominator : 0;
}

function median(values) {
  const cleanValues = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!cleanValues.length) return 0;
  const mid = Math.floor(cleanValues.length / 2);
  return cleanValues.length % 2 ? cleanValues[mid] : Math.round((cleanValues[mid - 1] + cleanValues[mid]) / 2);
}

function interpretCorrelation(rho) {
  const abs = Math.abs(rho);
  if (abs >= 0.75) return 'very strong';
  if (abs >= 0.5) return 'strong';
  if (abs >= 0.3) return 'moderate';
  return 'weak';
}

function fmt(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n.toLocaleString('en-US') : '0';
}

function printHelp() {
  console.log(`Usage:
  node scripts/x-startup-analysis-insights.mjs --username aleabitoreddit --language zh --input data/raw/aleabitoreddit.json --out reports/aleabitoreddit-insights.md
`);
}

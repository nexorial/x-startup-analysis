# X Startup Analysis: studying how an account grows without owning its analytics

Ever wonder how the f*** an X account gets started and grows its following?

Not in the vague, inspirational way.

I mean mechanically.

What do they post?
What gets saved?
What gets replies?
What topics keep showing up?
Are they growing because of original posts, replies, timing, screenshots, a niche, or some weird repeated habit that is easy to miss when you just scroll the timeline?

That question bothered me because most advice about X growth is either too generic or trapped inside the creator's own analytics dashboard.

"Post consistently."
"Provide value."
"Build in public."
"Engage with others."

All true, but not very useful when you are trying to reverse-engineer a specific account from the outside.

So I built a Codex Skill called `x-startup-analysis`.

The idea is simple:

Give it an X handle.
Let it capture what can be seen from the outside.
Turn the public timeline into local data.
Then generate a report about what the account seems to be doing to earn attention.

No X API.
No owner-side analytics dashboard.
No pretending that public data is more complete than it really is.

The Skill produces a timeline report, a CSV, and an insights report. The insights report looks at correlations between public metrics like impressions, likes, replies, reposts, quotes, and bookmarks. It also looks at content attributes: text length, media, links, posting windows, topics, top posts, reply targets when available, and the account's visible style and habits.

I used `@aleabitoreddit` as the example account.

The public snapshot I captured showed about 836.4K followers, 175 following, and 7,267 profile posts. The current example report is clearly labeled `dom-only`: it used visible browser timeline rows, not private analytics and not X's official API. That matters because DOM-only capture cannot prove every post/reply relationship, so the tool marks uncertain rows as `unclassified` instead of hallucinating that they are top-level posts.

Even with that boundary, the report surfaced useful patterns.

The account is not just "posting about markets."

Its style is market-native research commentary:

- ticker-led observations
- high-conviction theses
- semiconductor and AI supply-chain reasoning
- export-control and geopolitics framing
- public updates on winners and losers
- enough context that readers can save the post and revisit it later

That is already more useful than "post valuable content."

The strongest topic clusters in the sample were AI/semiconductors, markets/investing, supply chain/geopolitics, and regional/culture observations. The account repeatedly turns obscure technical or geopolitical facts into market consequences.

That is a real content strategy.

Not "I have a thought."

More like:

"Here is a chokepoint in the supply chain."
"Here is the company or ticker connected to it."
"Here is why the market may not be pricing it correctly."
"Here is enough reasoning for you to argue with me, save it, or follow for the next update."

The correlation section made the pattern more concrete.

In the captured sample, impressions correlated strongly with comments, bookmarks, likes, and reposts. Likes and reposts were very tightly linked. Bookmarks moved with impressions and likes. Longer posts and posts with media also had positive correlation with reach and saves.

That does not prove causation. The sample is limited.

But it suggests a useful hypothesis:

for this type of account, the best posts are not tiny one-liners. They are high-context claims with enough detail to become reference material.

One of the highest-bookmarked posts in the report was a market/culture framing post. The lesson is not "copy that exact topic." The lesson is that followers reward a combination of strong point of view plus reusable reasoning.

Another high-reach post connected export controls, WF6, TSM, Samsung, SK Hynix, and AI supply-chain warfare. That is not generic finance posting. That is an information edge packaged into a public narrative.

This is the part I find most interesting.

When you analyze an account from the outside, you stop asking:

"What should I post today?"

And you start asking:

"What repeated value does this account train readers to expect?"

For `@aleabitoreddit`, the visible answer is:

asymmetric market context.

The account gives followers a feeling that they are seeing links between supply chains, politics, regional behavior, and market moves earlier than the crowd. The value is not just the ticker. It is the frame.

That is much more actionable than a vanity metric.

If I wanted to replicate the pattern, I would not copy the voice or the tickers. I would copy the underlying machine:

1. Pick a narrow information edge.
2. Publish high-conviction theses with receipts.
3. Explain the second- and third-order consequences.
4. Use screenshots/charts when they make the claim feel evidenced.
5. Publicly update the thesis as reality changes.
6. Optimize for saves and replies, not only likes.
7. Turn complex facts into simple consequences.

That is the payoff of this Skill.

It does not magically tell you "the algorithm."

It gives you a structured way to study what an account is repeatedly doing, what readers seem to reward, and what parts of that behavior might be worth copying.

The tension is that outside-in analysis is messy. X virtualizes timelines. DOM capture can miss reply metadata. Public pages do not give historical follower curves. So the Skill is conservative by design. It labels capture quality as `graphql`, `mixed`, `dom-only`, or `unknown`. It refuses to call uncertain DOM rows "posts." It tells you when you need a fuller capture.

That conservatism is the point.

I would rather have a smaller report with honest boundaries than a confident growth story built on bad classification.

The project is open source now:

https://github.com/nexorial/x-startup-analysis

It includes:

- the reusable Codex Skill
- the local CLI workflow
- bilingual README docs
- MIT license
- an actual `@aleabitoreddit` analysis report
- CSV and Markdown outputs
- tests around post/reply classification

If you are trying to grow on X, use it to study accounts in your niche.

If you are building tools for creators, fork it.

If you have ideas, bugs, or examples of accounts worth analyzing, send feedback to `@kiskirHQ`.

The best way to learn X growth is not to listen to another generic growth thread.

It is to take accounts that already work, inspect them from the outside, and ask:

what value did followers keep coming back for?


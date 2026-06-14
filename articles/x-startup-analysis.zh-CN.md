# X Startup Analysis：不用账号后台，也能研究一个 X 账号是怎么涨起来的

你有没有好奇过：一个 X 账号到底他妈的是怎么从 0 做起来、然后慢慢涨粉的？

不是那种鸡汤式的好奇。

而是非常机械的问题：

它到底发了什么？
什么内容被收藏？
什么内容带来评论？
它靠主帖、回复、发布时间、截图、niche，还是某种反复出现但肉眼很容易忽略的习惯在增长？

我一直觉得这个问题很有意思，因为大部分 X 增长建议都太泛了。

“保持更新。”
“提供价值。”
“build in public。”
“多互动。”

都对，但当你真的想从外部拆解一个具体账号时，这些话帮助很有限。

更麻烦的是，X 自己的 analytics dashboard 只有账号所有者能看。你想研究别人的账号，只能靠公开页面。

所以我做了一个 Codex Skill，叫 `x-startup-analysis`。

它的思路很简单：

给它一个 X handle。
从外部采集公开可见的数据。
把时间线变成本地结构化数据。
然后生成报告，分析这个账号到底在做什么、读者奖励什么、哪些做法可能可以复制。

不需要 X API。
不需要账号所有者的 analytics dashboard。
也不会假装公开数据比它实际更完整。

这个 Skill 会生成 timeline report、CSV 和 insights report。洞察报告会看公开指标之间的相关性，比如曝光、点赞、评论、转发、引用、收藏；也会看内容属性，比如文本长度、是否有媒体、是否有外链、发布时间、主题、top posts、可识别的互动账号，以及账号本身的风格和习惯。

我用 `@aleabitoreddit` 作为示例账号做了一次分析。

采集到的公开快照显示，这个账号大约有 836.4K followers、175 following、7,267 profile posts。当前仓库里的示例报告明确标注为 `dom-only`：它来自浏览器可见时间线，不是私有后台数据，也不是 X 官方 API。

这个边界很重要。

DOM-only capture 不能证明每一条内容到底是不是 top-level post，也不能完整保留所有 reply 元数据。所以工具会把无法证明的行标成 `unclassified`，而不是自信地误判成 posts。

但即使在这个边界内，报告也已经能看到有用模式。

`@aleabitoreddit` 不是简单地“发市场内容”。

它更像是 market-native research commentary：

- 用 ticker 作为入口
- 高频给出强观点
- 反复讨论半导体、AI、供应链
- 把出口管制、地缘政治和市场反应连起来
- 公开更新 thesis 的成败
- 给出足够上下文，让读者愿意收藏、争论或等待下一次更新

这比“提供价值”具体多了。

报告中的主题信号显示，样本里最明显的主题包括 AI/semiconductors、markets/investing、supply chain/geopolitics，以及 regional/culture observations。这个账号擅长把一些很细的技术事实或地缘事件，翻译成市场后果。

这就是一种内容策略。

不是“我有一个想法”。

而是：

“这里有一个供应链 chokepoint。”
“这里有一个公司或 ticker 和它相关。”
“这里有一个市场可能还没有充分定价的后果。”
“这里有足够推理，你可以反驳我、收藏它，或者关注后续更新。”

相关性部分也很有意思。

在这次公开样本里，impressions 和 comments、bookmarks、likes、reposts 都有很强相关性。likes 和 reposts 之间也高度相关。bookmarks 会跟 impressions 和 likes 一起动。更长的内容、带媒体的内容，也和 reach / saves 呈正相关。

这当然不等于因果关系。样本有限。

但它给了一个很有用的假设：

对于这种研究型账号，表现好的内容往往不是一句话小段子，而是高上下文、高密度、可以被当作参考材料回看的判断。

报告里收藏最高的一条内容，是一条市场/地区经验 framing 的帖子。重点不是复制它的具体题材，而是复制它背后的结构：强观点 + 可回看的推理。

另一些高 reach 内容，则把出口管制、WF6、TSM、Samsung、SK Hynix 和 AI supply chain warfare 串在一起。

这不是泛泛的财经内容。

这是把信息优势包装成公开叙事。

我觉得最有价值的是这个转变：

你不再问：

“我今天该发什么？”

你开始问：

“这个账号反复训练读者期待什么价值？”

对 `@aleabitoreddit` 来说，答案像是：

非对称市场上下文。

关注者得到的感觉是：这个账号能比大众更早把供应链、政治、地区行为和市场变化连起来。真正有价值的不只是 ticker，而是 frame。

这比单纯看涨粉数有用得多。

如果我要复制这个模式，我不会复制它的语气，也不会复制它的 ticker。

我会复制它的底层机器：

1. 选择一个足够窄的信息优势。
2. 发布有证据的高置信 thesis。
3. 解释二阶、三阶后果。
4. 用截图或图表增加证据感。
5. 公开更新 thesis 的进展和输赢。
6. 优先看收藏和评论，而不是只看点赞。
7. 把复杂事实翻译成简单市场后果。

这就是这个 Skill 的 payoff。

它不会神奇地告诉你“算法喜欢什么”。

它给你一个结构化方法，去研究一个账号反复做了什么、读者似乎奖励什么、哪些行为值得借鉴。

当然，outside-in analysis 本身是有张力的。

X 会虚拟化时间线。
DOM capture 可能缺 reply metadata。
公开个人页通常没有历史 follower 曲线。

所以这个 Skill 特意做得很保守。它会把 capture quality 标成 `graphql`、`mixed`、`dom-only` 或 `unknown`。它不会把证据不足的 DOM 行强行叫做 posts。它会告诉你什么时候需要更完整的 capture。

这种保守性很重要。

我宁愿要一份边界清楚的小报告，也不要一个建立在错误分类上的自信增长故事。

项目已经开源：

https://github.com/nexorial/x-startup-analysis

里面包括：

- 可复用 Codex Skill
- 本地 CLI 工作流
- 中英文 README
- MIT License
- `@aleabitoreddit` 的真实示例分析
- CSV 和 Markdown 输出
- post/reply 分类测试

如果你想做 X 增长，可以用它研究自己 niche 里的账号。

如果你在做 creator tools，可以 fork 它。

如果你有建议、bug，或者想推荐值得分析的账号，可以在 X.com 发给 `@kiskirHQ`。

学习 X 增长最好的方式，不是再看一条泛泛的增长 thread。

而是拿一个已经有效的账号，从外部拆开它，然后问：

关注者到底为什么一次又一次回来？


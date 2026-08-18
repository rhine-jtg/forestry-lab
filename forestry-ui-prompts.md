# 林业模拟器 UI 样式提示词

## 参考提取

参考了 Forestry 相关界面截图中较有代表性的元素：

- Minecraft 风格的物品图标、格子槽位和像素化图形。
- 木材、黄铜、深色金属和羊皮纸面板。
- 分析仪/养蜂箱中的基因属性列表。
- 蜂种突变路径、箭头、问号和可能结果。
- 农场配置界面的输入、输出、能源和生产进度。

参考页面：

- <https://gaming.stackexchange.com/questions/122408/what-do-the-bee-mutation-pictures-mean>
- <https://forum.feed-the-beast.com/threads/types-of-flowers-that-bees-need.6215/page-2>
- <https://forum.feed-the-beast.com/threads/question-about-forestry-multifarms.41290/>
- <https://www.curseforge.com/minecraft/mc-mods/jefb>

## 方案一：暖木生态工坊 / Desktop Web

```text
Use case: ui-mockup
Asset type: desktop web game UI concept sheet
Create an original forestry ecosystem management simulator interface, not a copy of any existing game UI. Show a polished 16:9 desktop dashboard for a web game called FORESTRY LAB. Use a cozy wooden apiary and tree nursery dashboard. Include a left navigation rail with APIARY, ARBOR, FARM, MACHINES, CODEX; a center bee colony card with two bee slots, progress bar, flower-source status and honeycomb output; a right gene card with SPEED, LIFESPAN, FERTILITY, CLIMATE and a mutation path diagram; and a bottom resource strip with HONEY, WAX, WOOD, SEED OIL. Use pixel-art-inspired item icons inside modern panels, warm wood, aged brass, parchment, moss green and amber honey highlights. Use short, legible English UI labels only. No logos, no watermark, no exact reproduction of any Forestry or Minecraft screenshot.
```

## 方案二：移动端温室 / Android Portrait

```text
Use case: ui-mockup
Asset type: portrait mobile game UI concept
Create an original mobile-first forestry ecosystem simulator interface for Android. Use a 9:16 portrait phone layout with a clean botanical management screen. Include a top status bar with HONEY, WOOD, ENERGY; a central habitat card with a small apiary and tree nursery; a large touch-friendly COLLECT button; bottom navigation HOME, BREED, FARM, CODEX; a bee card showing rarity, production timer, flower icons and gene meters; and a NEXT GOAL quest panel. Use cream white, sage green, honey amber, leaf green, soft terracotta and dark brown. Use subtle paper texture, painted wood accents, small brass screws and friendly illustrated icons. English UI labels only, short readable text, no logos, no watermark.
```

## 方案三：深色基因实验室 / Breeding Screen

```text
Use case: ui-mockup
Asset type: desktop and tablet game UI concept
Create an original advanced bee genetics laboratory interface for a forestry simulator. Use a 16:9 dark laboratory console inspired by analyzer and mutation-path information design, redesigned for clarity. Title the screen GENETICS LAB. Put FOREST BEE and MEADOW BEE parent cards on the left, a glowing hexagonal BREEDING CHAMBER in the center with a progress ring and BREED NOW button, and a right TRAIT COMPARISON table for SPEED, LIFESPAN, FERTILITY, FLOWERING, TEMPERATURE, HUMIDITY. Add a bottom POSSIBLE OFFSPRING strip with percentage cards, unknown species question-mark hexagons, and a PRODUCTION row for HONEY, BEESWAX, POLLEN, PROPOLIS, ROYAL JELLY. Use charcoal, deep navy, oxidized teal, brass gold and amber orange. Use brushed metal, dark wood, glass tubes, honeycomb embossing and blueprint marks. English labels only, no logos, no watermark, no exact screenshot reproduction.
```

## 方案四：复古像素农场 / Browser Game

```text
Use case: ui-mockup
Asset type: browser game UI concept sheet
Create an original retro pixel-art management interface for a forestry ecosystem simulator. Use a 16:9 browser game screen with a top resource bar, left tool buttons, a center tile-based ranch overview showing apiaries, tree plots, a centrifuge and a small crop farm, and a right selected-building panel titled CENTRIFUGE with INPUT slots, OUTPUT slot, a timer, ENERGY gauge and START button. Add bottom shortcut cards BEE, TREE, FARM, CODEX, a small QUEST card and a DISCOVERED species notification. Use crisp 16-bit-inspired pixel art, chunky borders, grid-aligned panels, dark spruce green, pine green, warm tan, ochre, amber, brick red and cream. English labels only, no logos, no watermark, no exact reproduction of any Forestry or Minecraft screenshot.
```

## 选型建议

- 方案一：最适合作为 Web 主界面，信息量和氛围平衡最好。
- 方案二：最适合作为安卓主界面，触控区域和任务引导清晰。
- 方案三：最适合承载复杂的蜜蜂遗传和杂交玩法。
- 方案四：最适合轻量网页版本或低配置设备。

建议最终采用“方案一的整体框架 + 方案二的移动布局 + 方案三的育种页 + 方案四的像素图标”。

Web 原型的移动断点应将探索、分析、亲本选择和花源选择等关键控件提升到约 40px 触控高度；桌面端继续保持紧凑的方形槽位，避免移动端沿用桌面小按钮造成误触。

机器台的当前交互规格：离心机 C-01 使用“蜂巢 ×1 → 蜂蜜 ×1 + 蜂蜡 ×1”方形槽位；榨汁机 S-01 初始显示锁定卡，完成 1 次离心加工后切换为“木材 ×2 + 能源 ×2 → 种子油 ×1”的输入/输出槽位；发酵机 F-01 在图鉴拥有 3 个蜂种后切换为“木材 ×3 + 能源 ×3 → 生物质 ×1”；蒸馏机 ST-01 在完成 1 次发酵加工后切换为“生物质 ×1 + 能源 ×4 → 生物燃料 ×1”。四台机器都必须显示锁定、待命、运行中、可收取和输入不足状态，产物未收取时保留输出槽位，按钮文案只指向当前可执行动作。

引导卡的按钮需要跳转到对应工作台，并用短暂的琥珀色脉冲轮廓指向当前真实操作控件；高亮只负责说明下一步，不自动触发探索、收取、加工或升级。

养蜂台和总览蜂箱卡还应显示“预计每轮蜂巢数”：该数值由当前亲本的寿命与繁殖力共同决定，并在 READY 时显示实际锁定数量，避免玩家只看到基因条却不知道它们如何改变短周期收益。

总览的 NOW / CYCLE / LONG 卡片也应指向当前层级的具体控件：NOW 优先指向收取或启动，CYCLE 优先指向分析、培育或加工，LONG 指向探索、研究或图鉴。资源状态重叠时，以卡片语义优先，不能只按“哪个资源有产物”决定高亮对象。

总览新增 Forestry 风格的“生态委托”方形面板：左侧是委托编号、标题、简短背景和琥珀色奖励说明，右侧是 2 列资源交付槽位，每个槽位显示资源图标、当前数量 / 需求数量和资源名；底部显示生态声望、委托进度和一个只执行当前可用动作的按钮。未解锁、资源不足、仓库空间不足、可交付和档案完成需要有明显但克制的状态差异，避免把长期资源出口藏在图鉴里。

生物燃料应使用金色燃料图标，与青绿色生物质区分；仓库 R-01 LV.03 的升级卡明确显示“生物燃料 ×2”，让玩家从蒸馏机卡片能直接理解下游用途，而不是把生物燃料当成无用途的计数器。

树场 T-01 的方形产出槽应同时显示木材和树脂：树脂数量由当前亲本的 RESIN 属性决定，并在生长完成瞬间锁定；顶部资源栏增加树脂资源芯片，树场 LV.03 的升级卡显示“树脂 ×2”，让树木基因不再只是装饰数值。

机器台底部的 CURRENT RECIPE 台账应随当前最值得处理的机器切换：有待收取或运行中的机器优先显示该机器，否则按离心、榨汁、发酵、蒸馏的未完成阶段显示下一条配方。标题、输入槽、输出槽、时间和能源消耗必须同步更新，不能永远显示离心机配方。

图鉴页的方形卡片需要把长期成长做成可扫描的状态面板：已发现但未分析的条目显示“待分析”和“分析后读取基因参数”；已分析条目显示三项基因数值、`已分析` 状态和“发现区域 / 培育路径”来源；未发现条目保留图标槽位但显示 `LOCKED` 与下一步解锁提示。蜂种使用速度、寿命、繁殖三枚属性标签，树种使用生长、木材、树脂三枚属性标签。卡片状态必须直接读取游戏存档中的发现和分析集合，不能为 UI 单独维护第二套解锁状态。

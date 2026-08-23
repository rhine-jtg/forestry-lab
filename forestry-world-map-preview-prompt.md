# 林业河谷地图预览图生成提示词

版本：v1  
对应设计：[林业河谷总览地图设计](forestry-world-map-design.md)  
生成模式：内置图像生成  
输出：`assets/concepts/forestry-valley-map-preview-v1.png`  
用途：地图 UI 方向确认，不作为最终可直接接入的游戏底图

## 实际使用的详细提示词

```text
Use case: ui-mockup
Asset type: high-fidelity concept preview for a forestry management game world-map screen, wide 16:9 landscape

Primary request:
Create a completely original pixel-art game interface showing “FORESTRY VALLEY”, a living forestry research valley that acts as the spatial hub for a bee genetics, tree breeding, orchard, butterfly ecology, processing, trade, research, and expedition simulation game. The image should feel like a polished playable game screen, not a loose illustration and not a copy of any existing game map.

Scene/backdrop:
A large self-contained green river valley seen from a high three-quarter top-down view, with readable winding dirt roads connecting every district. Dense forest frames the map edges; a river and wetlands curve through the right side; rocky mountains and a glowing cave entrance anchor the left edge; a warm sandy trade road reaches the lower-right edge; northern paths lead toward cold conifer mountains; a late-game dark-purple portal sits subtly at a distant edge. The valley is compact, coherent, lush, and easy to scan.

Core spatial layout:
- Center: a wood-and-stone Central Forestry Station with a small mission plaza, notice board, flags, and radial roads.
- Upper-left: Ancient Apiary Forest, giant old trees, several square hive shelters, honeycomb signs, tiny bees, flowering undergrowth.
- Left-center: Arboretum and Tree Breeding Yard, organized sapling rows, oak and birch specimens, automatic tree-farm structure, stacked logs.
- Upper-center: Genetics Research Institute and Ecology Archive, compact laboratory buildings with stone foundations, muted teal roofs, specimen windows, book/archive motif.
- Upper-right: glass Canopy Greenhouse and Butterfly Garden, flowering habitat, host plants, colorful but restrained pixel butterflies.
- Right-center: Orchard and Pollination Meadow beside the river, mixed fruit trees at different growth stages, flower plots, bee and butterfly activity.
- Lower-left: Processing Workshop with four visually distinct machine bays suggesting centrifuge, squeezer, fermenter, and still; nearby warehouse and energy station with crates, pipes, tanks, and an amber/teal energy glow.
- Lower-right: Villager Market and Contract Outpost, small timber stalls, trade cart, emerald-colored awning, quest board, a few original blocky villagers.
- Map edges: clear expedition gates toward forest, plains, swamp, desert, tropical canopy, taiga, glowing cave, and a late-game otherworldly frontier. Use small biome silhouettes and icon markers, not text labels.

Characters and activity:
Include a small original cube-shaped bee-hive keeper NPC near the path between the apiary and Central Station: golden honeycomb body, dark brown hive bands, tiny wings, pixel-art silhouette. Add a few tiny researchers, villagers, and surveyors as scale references. Keep characters secondary to the map.

Gameplay-state storytelling:
Show resource flow through the roads: one small honeycomb crate traveling from apiary to workshop, logs moving from tree yard toward warehouse, fruit baskets near the orchard, and trade crates near the market. Use only a few state indicators: one gold “ready to collect” bubble over the apiary, one green progress ring over the orchard, one muted red-brown blocked-storage icon near the warehouse, and one scroll quest marker at the mission board. Indicators must be square pixel UI elements, sparse and readable.

Interface frame:
Frame the map as an actual desktop game UI. A thin dark-green Minecraft-inspired pixel frame surrounds the map. Across the top, a compact square resource bar with icon-and-number chips for emeralds, energy, honeycomb, wood, fruit, and ecology. On the right, a narrow selected-location panel with a building thumbnail, 2–3 short status rows represented mostly by bars and icons, and one gold rectangular action button. Along the bottom, six square navigation buttons with original icons for overview, survey, map, production, shop, and archive. Keep UI proportions clean and practical; the map remains at least 75% of the composition.


Style/medium:
Original high-detail modern indie pixel art, crisp integer pixels, 24–32-bit color richness, Minecraft/Forestry-inspired material language without copying any official textures, sprites, logos, characters, buildings, or UI assets. Orthographic/three-quarter top-down map, handmade sprite-sheet clarity, straight square UI borders, subtle stepped pixel shadows, no anti-aliased painterly edges.

Lighting/mood:
Bright calm late-morning light, inviting and productive, with mild local shadows. Healthy ecological mood with clear visual contrast. Buildings feel busy but not industrially dirty.

Color palette:
Deep forest green, moss green, oak brown, warm stone gray, honey amber and gold, muted teal for water and energy, restrained emerald accents, small lavender accents only for genetics or the late-game portal.

Text:
Only one clearly readable title banner: “FORESTRY VALLEY”. No other required text; use icons, bars, and simple numerals to avoid illegible generated copy.

Composition/framing:
Wide 16:9 landscape, entire valley visible, central station near the visual center, districts separated by roads and vegetation, no major building hidden by UI. Strong hierarchy: central station first, production/ecology districts second, UI status markers third, decorative nature last. Keep paths broad and landmarks distinct so the image can later guide an HTML/CSS implementation.

Constraints:
- Brand-new map composition and building designs.
- Must visibly include apiary forest, tree yard, orchard, butterfly greenhouse, research/archive, four-machine processing district, warehouse/energy station, market/contract outpost, river/wetland, cave, and expedition exits.
- Pixel art must be crisp and deliberately low-resolution in form, but the final preview should be polished and high fidelity.
- UI uses square panels, beveled pixel borders, clear contrast, and no rounded mobile-app styling.
- No watermark.

Avoid:
Photorealism, smooth 3D rendering, soft vector art, watercolor, anime close-ups, huge characters, excessive floating labels, illegible paragraphs, overly crowded icons, glossy gradients, rounded glassmorphism, copied town layout, copied buildings, copied Minecraft assets, logos, or exact game textures.
```

## 本次结果观察

符合预期：

- 地图保持了宽屏可玩界面构图，主地图占据绝大多数空间。
- 蜂林、树木培育、研究档案、玻璃温室、果园湿地、四机加工区、仓库能源站和村民市场均可辨认。
- 顶部资源栏、右侧地点卡和底部导航采用方形像素框架。
- 道路能够表达设施之间的连接，金色收取、绿色进度和仓库阻塞状态清楚。
- 寒带、洞穴、沙地与传送门等远征方向已经进入画面。

后续迭代建议：

1. 单独生成不带 UI 的纯河谷底图，便于后续切片和热点布局。
2. 再生成一张 Android 竖屏四分区版本，验证手机镜头。
3. 强化中央工作站与“蜜匠”NPC 的辨识度。
4. 减少建筑的工业蒸汽朋克感，使其更贴近现有 Forestry 工坊。
5. 将地图建筑拆成独立像素素材时，重新按统一网格和固定色板绘制，不能直接从概念图裁切使用。


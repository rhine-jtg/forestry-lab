const LEGACY_STORAGE_KEY = "forestry-lab-prototype-v1";
const SAVE_INDEX_KEY = "forestry-lab-save-index-v2";
const SAVE_SLOT_PREFIX = "forestry-lab-save-slot-v2-";
const SETTINGS_KEY = "forestry-lab-settings-v1";
const SAVE_VERSION = 2;
const SAVE_SLOT_COUNT = 3;
const ALLOWED_EXTERNAL_LINKS = new Set([
  "https://www.minecraft.net/",
  "https://www.curseforge.com/minecraft/mc-mods/forestry",
  "https://ftbwiki.org/Forestry",
  "https://github.com/ForestryMC/ForestryMC/tree/mc-1.12"
].map((link) => new URL(link).href));

const defaultState = {
  resources: { honey: 24, wax: 10, wood: 32, oil: 6, resin: 0, biomass: 0, biofuel: 0, energy: 60 },
  flowerInventory: { wildflower: 3, clover: 0, tropical: 0 },
  activeFlower: "wildflower",
  activeHabitat: "forest",
  rawComb: 0,
  processedHoney: 0,
  processedWax: 0,
  totalCombCollected: 0,
  apiaryCombCollected: 0,
  explorations: 0,
  explorationCounts: { forest: 0, plains: 0, swamp: 0, desert: 0, tropic: 0, snow: 0, cave: 0, end: 0 },
  zoneProgress: {
    forest: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    plains: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    swamp: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    desert: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    tropic: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    snow: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    cave: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 },
    end: { manualRuns: 0, autoRuns: 0, proficiency: 0, rareProgress: 0, bestYield: 0 }
  },
  expedition: null,
  autoSurvey: null,
  pendingSurvey: [],
  surveyResult: null,
  claimedResultIds: [],
  tutorialSurveyCompleted: false,
  analyzed: [],
  discovered: ["forest", "meadows"],
  apiaryProgress: 72,
  apiaryReady: 0,
  apiaryCycles: 0,
  machineProgress: 0,
  machineActive: false,
  machineOutput: 0,
  machineCycles: 0,
  squeezerProgress: 0,
  squeezerActive: false,
  squeezerOutput: 0,
  squeezerCycles: 0,
  fermenterProgress: 0,
  fermenterActive: false,
  fermenterOutput: 0,
  fermenterCycles: 0,
  distillerProgress: 0,
  distillerActive: false,
  distillerOutput: 0,
  distillerCycles: 0,
  automationEnabled: false,
  automationReserveEnergy: 10,
  contractIndex: 0,
  contractsCompleted: 0,
  reputation: 0,
  treeSaplings: { oak: 2, birch: 2 },
  treeDiscovered: ["oak", "birch"],
  treeAnalyzed: [],
  butterflyDiscovered: ["azure"],
  butterflyAnalyzed: [],
  treeProgress: 64,
  treeReady: 0,
  treeReadyYield: 0,
  treeReadyResin: 0,
  treeBreeding: null,
  treeCycles: 0,
  treeHarvests: 0,
  treeBreedingParents: { parentA: "oak", parentB: "birch" },
  breedingParents: { princess: "forest", drone: "meadows" },
  butterflyBreeding: null,
  butterflyBreedingParents: { parentA: "azure", parentB: "brimstone" },
  upgrades: { apiary: 1, treeFarm: 1, centrifuge: 1, warehouse: 1 },
  upgradesBought: 0,
  breeding: null,
  breedings: 0,
  breedingAttempts: 0,
  breedingFailures: 0,
  breedingPity: {},
  treeBreedingAttempts: 0,
  treeBreedingFailures: 0,
  treeBreedingPity: {},
  butterflyBreedingAttempts: 0,
  butterflyBreedingFailures: 0,
  butterflyBreedingPity: {},
  strategyFocus: "ecology",
  strategyActionsRemaining: 3,
  strategyReady: true,
  strategyCycles: 0,
  zoneEnvironments: {
    forest: { temperature: 52, humidity: 58, light: 62, flowerDensity: 68, soil: 74, canopy: 46, leafPressure: 12, workshopLoad: 0 },
    plains: { temperature: 62, humidity: 42, light: 82, flowerDensity: 76, soil: 64, canopy: 22, leafPressure: 8, workshopLoad: 0 },
    swamp: { temperature: 48, humidity: 82, light: 42, flowerDensity: 54, soil: 70, canopy: 58, leafPressure: 18, workshopLoad: 0 },
    desert: { temperature: 86, humidity: 18, light: 92, flowerDensity: 28, soil: 36, canopy: 8, leafPressure: 6, workshopLoad: 0 },
    tropic: { temperature: 82, humidity: 78, light: 64, flowerDensity: 72, soil: 76, canopy: 72, leafPressure: 24, workshopLoad: 0 },
    snow: { temperature: 18, humidity: 52, light: 48, flowerDensity: 32, soil: 54, canopy: 64, leafPressure: 10, workshopLoad: 0 },
    cave: { temperature: 38, humidity: 88, light: 18, flowerDensity: 44, soil: 66, canopy: 92, leafPressure: 20, workshopLoad: 0 },
    end: { temperature: 42, humidity: 12, light: 58, flowerDensity: 18, soil: 24, canopy: 4, leafPressure: 28, workshopLoad: 0 }
  },
  environmentEvent: { current: "clear", remaining: 2, next: "bloom" },
  playTimeSeconds: 0,
  lastTickAt: Date.now(),
  logs: [
    { time: "08:10", text: "蜂箱 A-01 已进入稳定工作状态。", kind: "green" },
    { time: "08:07", text: "花源检查完成，当前野花库存可支持蜂箱继续生产。", kind: "amber" },
    { time: "08:02", text: "欢迎来到森林边缘，开始你的第一轮调查。", kind: "teal" }
  ]
};

let toastTimer;

const species = {
  forest: { name: "森林蜂", english: "Forest Bee", type: "基础蜂种", desc: "温和、稳定，适合森林环境。", icon: "●", color: "amber", traits: { speed: 52, lifespan: 68, fertility: 54 }, habitat: { forest: 1, plains: .85, swamp: .65, tropic: .55 } },
  meadows: { name: "草原蜂", english: "Meadow Bee", type: "基础蜂种", desc: "花源适应力强，生产速度较快。", icon: "●", color: "gold", traits: { speed: 68, lifespan: 50, fertility: 74 }, habitat: { forest: .9, plains: 1, swamp: .55, tropic: .7 } },
  cultivated: { name: "培育蜂", english: "Cultivated Bee", type: "进阶蜂种", desc: "森林与草原蜂的稳定杂交后代。", icon: "✦", color: "green", traits: { speed: 72, lifespan: 57, fertility: 82 }, habitat: { forest: 1, plains: .95, swamp: .75, tropic: .85 } },
  common: { name: "普通蜂", english: "Common Bee", type: "未知蜂种", desc: "等待在下一次突变中发现。", icon: "?", color: "teal", traits: { speed: 45, lifespan: 45, fertility: 50 }, habitat: { forest: .8, plains: .9, swamp: 1, tropic: .7 } },
  noble: { name: "贵族蜂", english: "Noble Bee", type: "二级突变", desc: "普通蜂与培育蜂的稳定稀有后代。", icon: "✦", color: "purple", traits: { speed: 82, lifespan: 76, fertility: 68 }, habitat: { forest: .95, plains: .9, swamp: .8, tropic: .9 } },
  tropical: { name: "热带蜂", english: "Tropical Bee", type: "基础蜂种", desc: "来自热带林冠的稀有品种。", icon: "●", color: "teal", traits: { speed: 76, lifespan: 44, fertility: 78 }, habitat: { forest: .7, plains: .8, swamp: .9, tropic: 1 } },
  majestic: { name: "尊贵蜂", english: "Majestic Bee", type: "二级突变", desc: "贵族蜂与培育蜂延续出的高寿命支系。", icon: "✦", color: "purple", traits: { speed: 84, lifespan: 82, fertility: 65 }, habitat: { forest: .95, plains: .9, swamp: .85, tropic: .92 } },
  diligent: { name: "勤劳蜂", english: "Diligent Bee", type: "二级突变", desc: "普通蜂系的高繁殖力支系，适合扩展蜂群。", icon: "✦", color: "amber", traits: { speed: 68, lifespan: 60, fertility: 88 }, habitat: { forest: .9, plains: 1, swamp: .85, tropic: .78 } },
  unweary: { name: "不倦蜂", english: "Unweary Bee", type: "二级突变", desc: "勤劳蜂与培育蜂的耐久后代，适合长线生产。", icon: "✦", color: "teal", traits: { speed: 80, lifespan: 75, fertility: 84 }, habitat: { forest: .95, plains: .95, swamp: .8, tropic: .85 } },
  industrious: { name: "工业蜂", english: "Industrious Bee", type: "三级突变", desc: "勤劳蜂与不倦蜂的高效率三级支系。", icon: "✦", color: "purple", traits: { speed: 92, lifespan: 62, fertility: 72 }, habitat: { forest: .9, plains: .92, swamp: .82, tropic: .9 } },
  imperial: { name: "帝王蜂", english: "Imperial Bee", type: "三级突变", desc: "贵族蜂与尊贵蜂的王室级后代。", icon: "✦", color: "gold", traits: { speed: 88, lifespan: 94, fertility: 70 }, habitat: { forest: .98, plains: .92, swamp: .85, tropic: .95 } }
};

const treeSpecies = {
  oak: { name: "橡树", english: "Oak", type: "基础树种", desc: "稳定、耐寒，适合建立第一座树场。", icon: "♣", color: "green", traits: { growth: 58, yield: 62, resin: 42 } },
  birch: { name: "白桦", english: "Birch", type: "基础树种", desc: "生长较快，可作为杂交亲本。", icon: "♧", color: "gold", traits: { growth: 76, yield: 48, resin: 36 } },
  larch: { name: "落叶松", english: "Larch", type: "进阶树种", desc: "橡树与白桦的培育后代，木材产量更高。", icon: "♠", color: "amber", traits: { growth: 68, yield: 78, resin: 55 } },
  jungle: { name: "丛林树", english: "Jungle", type: "稀有树种", desc: "适应温暖环境，能提供更多树脂。", icon: "♨", color: "teal", traits: { growth: 72, yield: 64, resin: 82 } },
  teak: { name: "柚木", english: "Teak", type: "二级培育", desc: "落叶松与丛林树的热带树脂支系。", icon: "♠", color: "teal", traits: { growth: 61, yield: 88, resin: 72 } },
  cherry: { name: "樱桃树", english: "Cherry", type: "二级培育", desc: "橡树与丛林树的果木支系，木材和结果能力均衡。", icon: "♣", color: "amber", traits: { growth: 70, yield: 76, resin: 48 } },
  walnut: { name: "核桃树", english: "Walnut", type: "二级培育", desc: "白桦与丛林树的坚果树支系，产量较高。", icon: "♣", color: "gold", traits: { growth: 60, yield: 84, resin: 62 } },
  chestnut: { name: "栗树", english: "Chestnut", type: "三级培育", desc: "樱桃与核桃稳定结合后的三级果木。", icon: "♣", color: "purple", traits: { growth: 64, yield: 90, resin: 70 } },
  pine: { name: "松树", english: "Pine", type: "二级培育", desc: "落叶松与核桃的耐寒高产支系。", icon: "♠", color: "green", traits: { growth: 82, yield: 70, resin: 58 } },
  sequoia: { name: "红杉", english: "Sequoia", type: "三级培育", desc: "松树与柚木的高树脂三级巨木。", icon: "♠", color: "teal", traits: { growth: 54, yield: 98, resin: 86 } }
};

const butterflySpecies = {
  azure: { name: "春蓝蝶", english: "Spring Azure", type: "基础蝶种", desc: "森林边缘常见的小型蝶种，适合观察季节变化。", color: "blue", zone: "forest", traits: { rarity: 28, pollination: 52 } },
  brimstone: { name: "硫磺蛾", english: "Brimstone", type: "基础蝶种", desc: "偏好开阔花地，翅色会随花源质量变亮。", color: "gold", zone: "plains", traits: { rarity: 42, pollination: 64 } },
  swallow: { name: "燕尾蝶", english: "Swallowtail", type: "湿地蝶种", desc: "在湿地植物间活动，可作为生态恢复的指示物种。", color: "teal", zone: "swamp", traits: { rarity: 61, pollination: 76 } },
  atlas: { name: "林冠蝶", english: "Canopy Atlas", type: "三级蝶种", desc: "热带林冠中的稀有蝶种，出现时通常意味着生态值较高。", color: "purple", zone: "tropic", traits: { rarity: 82, pollination: 88 } },
  morpho: { name: "蓝闪蝶", english: "Blue Morpho", type: "二级蝶种", desc: "蓝色翅面会反射林冠光线，授粉能力突出。", color: "blue", zone: "tropic", traits: { rarity: 72, pollination: 82 } },
  monarch: { name: "帝王蝶", english: "Monarch", type: "二级蝶种", desc: "耐迁徙的花地蝶种，适合扩大平原花源的授粉范围。", color: "gold", zone: "plains", traits: { rarity: 67, pollination: 78 } }
};

function knownDiscoveredBees() {
  return state.discovered.filter((id) => species[id]);
}

function knownDiscoveredTrees() {
  return state.treeDiscovered.filter((id) => treeSpecies[id]);
}

function knownDiscoveredButterflies() {
  return state.butterflyDiscovered.filter((id) => butterflySpecies[id]);
}

function getBreedingPairKey(princess, drone) {
  return [princess, drone].sort().join("|");
}

function getBreedingRecipe(princess, drone) {
  return breedingRecipes[getBreedingPairKey(princess, drone)] || null;
}

function normalizePityStore(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([key, amount]) => key.includes("|") && Number.isFinite(Number(amount)))
    .map(([key, amount]) => [key, clamp(Math.floor(Number(amount)), 0, 9)]));
}

function getBreedingPityKey(kind, first, second) {
  if (!first || !second) return "";
  if (kind === "tree") return getTreeBreedingPairKey(first, second);
  if (kind === "butterfly") return getButterflyBreedingPairKey(first, second);
  return getBreedingPairKey(first, second);
}

function getBreedingFailureCount(kind = "bee", first = "", second = "") {
  const key = getBreedingPityKey(kind, first, second);
  const store = kind === "tree" ? state.treeBreedingPity : kind === "butterfly" ? state.butterflyBreedingPity : state.breedingPity;
  if (key && Object.prototype.hasOwnProperty.call(store || {}, key)) return clamp(Number(store[key]) || 0, 0, 9);
  // Old saves only had one global counter. Keep it for the currently selected
  // path until that path receives its first post-migration result.
  if (!Object.keys(store || {}).length) return clamp(Number(kind === "tree" ? state.treeBreedingFailures : kind === "butterfly" ? state.butterflyBreedingFailures : state.breedingFailures) || 0, 0, 9);
  return 0;
}

function setBreedingFailureCount(kind, first, second, amount) {
  const key = getBreedingPityKey(kind, first, second);
  if (!key) return 0;
  const value = clamp(Math.floor(Number(amount) || 0), 0, 9);
  const storeKey = kind === "tree" ? "treeBreedingPity" : kind === "butterfly" ? "butterflyBreedingPity" : "breedingPity";
  state[storeKey] = state[storeKey] && typeof state[storeKey] === "object" ? state[storeKey] : {};
  state[storeKey][key] = value;
  if (kind === "tree") state.treeBreedingFailures = value;
  else if (kind === "butterfly") state.butterflyBreedingFailures = value;
  else state.breedingFailures = value;
  return value;
}

function getMutationChance(recipe, kind = "bee", first = "", second = "") {
  if (!recipe) return 0;
  const failures = getBreedingFailureCount(kind, first, second);
  const strategyModifier = getStrategyConfig().mutation;
  const environmentModifier = getEnvironmentMutationModifier(kind);
  return clamp(recipe.chance + Math.max(0, Number(failures) || 0) * 10 + strategyModifier + environmentModifier, 5, 95);
}

function getMutationBreakdownText(recipe, kind, first, second) {
  if (!recipe) return "";
  const parts = [`基础 ${recipe.chance}%`];
  const strategyModifier = getStrategyConfig().mutation;
  const environmentModifier = getEnvironmentMutationModifier(kind);
  const pity = getBreedingFailureCount(kind, first, second) * 10;
  if (strategyModifier) parts.push(`${getStrategyConfig().short} ${strategyModifier > 0 ? "+" : ""}${strategyModifier}%`);
  if (environmentModifier) parts.push(`生态 ${environmentModifier > 0 ? "+" : ""}${environmentModifier}%`);
  if (pity) parts.push(`保底 +${pity}%`);
  return parts.join(" · ");
}

function getParentId(slot, fallback) {
  const selected = state.breedingParents?.[slot];
  return knownDiscoveredBees().includes(selected) ? selected : fallback;
}

function getTreeBreedingPairKey(parentA, parentB) {
  return [parentA, parentB].sort().join("|");
}

function getTreeBreedingRecipe(parentA, parentB) {
  return treeBreedingRecipes[getTreeBreedingPairKey(parentA, parentB)] || null;
}

function getButterflyBreedingPairKey(parentA, parentB) {
  return [parentA, parentB].sort().join("|");
}

function getButterflyBreedingRecipe(parentA, parentB) {
  return butterflyBreedingRecipes[getButterflyBreedingPairKey(parentA, parentB)] || null;
}

function getButterflyParentId(slot, fallback) {
  const selected = state.butterflyBreedingParents?.[slot];
  return knownDiscoveredButterflies().includes(selected) ? selected : fallback;
}

function getTreeParentId(slot, fallback) {
  const selected = state.treeBreedingParents?.[slot];
  return knownDiscoveredTrees().includes(selected) ? selected : fallback;
}

function getTreeSaplingCount(id) {
  return Math.max(0, Number(state.treeSaplings?.[id]) || 0);
}

function getTreeSaplingCost(parentA, parentB) {
  return { [parentA]: 1, [parentB]: (parentA === parentB ? 2 : 1) };
}

function getMissingTreeSaplings(cost) {
  return Object.entries(cost).filter(([id, amount]) => getTreeSaplingCount(id) < amount);
}

const zones = {
  forest: { name: "森林边缘", difficulty: 1, manualEnergy: 6, autoEnergy: 8, autoDuration: 30, surveyPoints: 10, discoveryBase: 62, discoveryStep: 8, flowerSource: "wildflower", temperature: "温和", humidity: "均衡", art: "forest", desc: "木材、野花、基础蜂巢与树苗线索", unlockText: "初始开放", rewards: [{ kind: "resource", id: "wood", min: 8, max: 14 }, { kind: "flower", id: "wildflower", min: 3, max: 6 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "sapling", id: "oak", min: 0, max: 2 }], baseline: { temperature: 52, humidity: 58, light: 62, flowerDensity: 68, soil: 74, canopy: 46, leafPressure: 12 } },
  plains: { name: "平原花地", difficulty: 1, manualEnergy: 7, autoEnergy: 9, autoDuration: 35, surveyPoints: 10, discoveryBase: 18, discoveryStep: 10, flowerSource: "clover", temperature: "温暖", humidity: "干燥", art: "plains", desc: "三叶草、蜂巢、种子与蝴蝶线索", unlockText: "完成 1 次森林调查", rewards: [{ kind: "resource", id: "wood", min: 6, max: 10 }, { kind: "flower", id: "clover", min: 4, max: 8 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "resource", id: "oil", min: 0, max: 2 }], baseline: { temperature: 62, humidity: 42, light: 82, flowerDensity: 76, soil: 64, canopy: 22, leafPressure: 8 } },
  swamp: { name: "静谧沼泽", difficulty: 2, manualEnergy: 9, autoEnergy: 12, autoDuration: 45, surveyPoints: 9, discoveryBase: 0, discoveryStep: 14, flowerSource: "wildflower", temperature: "凉爽", humidity: "高湿", art: "swamp", desc: "湿地花源、树脂、丛林树苗与蜂种线索", unlockText: "累计 3 次调查并完成 1 次离心", rewards: [{ kind: "resource", id: "wood", min: 5, max: 9 }, { kind: "flower", id: "wildflower", min: 3, max: 6 }, { kind: "resource", id: "resin", min: 1, max: 3 }, { kind: "sapling", id: "jungle", min: 0, max: 1 }], baseline: { temperature: 48, humidity: 82, light: 42, flowerDensity: 54, soil: 70, canopy: 58, leafPressure: 18 } },
  desert: { name: "荒芜沙丘", difficulty: 2, manualEnergy: 10, autoEnergy: 13, autoDuration: 50, surveyPoints: 9, discoveryBase: 0, discoveryStep: 13, flowerSource: "wildflower", temperature: "炎热", humidity: "极干", art: "desert", desc: "旱地花源、种子油与干燥蜂巢", unlockText: "获得种子油并收获 1 次树场", rewards: [{ kind: "resource", id: "wood", min: 2, max: 5 }, { kind: "flower", id: "wildflower", min: 4, max: 8 }, { kind: "resource", id: "oil", min: 2, max: 4 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }], baseline: { temperature: 86, humidity: 18, light: 92, flowerDensity: 28, soil: 36, canopy: 8, leafPressure: 6 } },
  tropic: { name: "热带林冠", difficulty: 3, manualEnergy: 11, autoEnergy: 15, autoDuration: 55, surveyPoints: 8, discoveryBase: 0, discoveryStep: 12, flowerSource: "tropical", temperature: "炎热", humidity: "高湿", art: "tropic", desc: "热带花、树脂、稀有蜂巢与柚木线索", unlockText: "手动调查沼泽并发现丛林树", rewards: [{ kind: "resource", id: "wood", min: 6, max: 12 }, { kind: "flower", id: "tropical", min: 3, max: 6 }, { kind: "resource", id: "resin", min: 2, max: 5 }, { kind: "sapling", id: "teak", min: 0, max: 2 }], baseline: { temperature: 82, humidity: 78, light: 64, flowerDensity: 72, soil: 76, canopy: 72, leafPressure: 24 } },
  snow: { name: "寒带针叶林", difficulty: 3, manualEnergy: 12, autoEnergy: 16, autoDuration: 60, surveyPoints: 8, discoveryBase: 0, discoveryStep: 11, flowerSource: "wildflower", temperature: "寒冷", humidity: "中湿", art: "snow", desc: "高产木材、树脂与耐寒树种线索", unlockText: "发现落叶松并升级养蜂箱 LV.2", rewards: [{ kind: "resource", id: "wood", min: 8, max: 14 }, { kind: "flower", id: "wildflower", min: 2, max: 5 }, { kind: "resource", id: "resin", min: 1, max: 3 }, { kind: "sapling", id: "pine", min: 0, max: 2 }], baseline: { temperature: 18, humidity: 52, light: 48, flowerDensity: 32, soil: 54, canopy: 64, leafPressure: 10 } },
  cave: { name: "荧光菌洞", difficulty: 4, manualEnergy: 14, autoEnergy: 18, autoDuration: 70, surveyPoints: 7, discoveryBase: 0, discoveryStep: 10, flowerSource: "wildflower", temperature: "阴凉", humidity: "极湿", art: "cave", desc: "菌类花源、树脂、种子与蝶种线索", unlockText: "观察 3 个蝶种并拥有 3 类花源", rewards: [{ kind: "flower", id: "wildflower", min: 5, max: 9 }, { kind: "resource", id: "resin", min: 2, max: 4 }, { kind: "resource", id: "oil", min: 1, max: 3 }, { kind: "resource", id: "rawComb", min: 0, max: 1 }], baseline: { temperature: 38, humidity: 88, light: 18, flowerDensity: 44, soil: 66, canopy: 92, leafPressure: 20 } },
  end: { name: "末地边境", difficulty: 5, manualEnergy: 18, autoEnergy: 24, autoDuration: 90, surveyPoints: 7, discoveryBase: 0, discoveryStep: 8, flowerSource: "tropical", temperature: "异温", humidity: "干燥", art: "end", desc: "异域花源、神秘蜂巢与稀有物种线索", unlockText: "养蜂箱 LV.3、8 个蜂种并完成生物燃料链", rewards: [{ kind: "flower", id: "tropical", min: 2, max: 4 }, { kind: "resource", id: "biomass", min: 3, max: 6 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "resource", id: "biofuel", min: 0, max: 1 }], baseline: { temperature: 42, humidity: 12, light: 58, flowerDensity: 18, soil: 24, canopy: 4, leafPressure: 28 } }
};

const breedingRecipes = {
  "forest|meadows": { result: "cultivated", time: 8, chance: 32, requiresApiary: 1, label: "稳定培育后代" },
  "forest|tropical": { result: "common", time: 9, chance: 24, requiresApiary: 1, label: "沼泽适应支系", tier: 2 },
  "common|cultivated": { result: "noble", time: 12, chance: 22, requiresApiary: 2, label: "贵族蜂突变路径", tier: 2 },
  "cultivated|noble": { result: "majestic", time: 14, chance: 16, requiresApiary: 2, label: "尊贵蜂突变路径", tier: 2 },
  "common|meadows": { result: "diligent", time: 11, chance: 18, requiresApiary: 2, label: "勤劳蜂突变路径", tier: 2 },
  "cultivated|diligent": { result: "unweary", time: 14, chance: 14, requiresApiary: 2, label: "不倦蜂突变路径", tier: 2 },
  "diligent|unweary": { result: "industrious", time: 17, chance: 10, requiresApiary: 3, label: "工业蜂三级路径", tier: 3 },
  "majestic|noble": { result: "imperial", time: 17, chance: 9, requiresApiary: 3, label: "帝王蜂三级路径", tier: 3 }
};

const treeBreedingRecipes = {
  "birch|oak": { result: "larch", time: 10, chance: 28, requiresTreeFarm: 1, label: "高产木材培育路径" },
  "jungle|larch": { result: "teak", time: 14, chance: 16, requiresTreeFarm: 2, label: "热带树脂培育路径", tier: 2 },
  "jungle|oak": { result: "cherry", time: 12, chance: 22, requiresTreeFarm: 1, label: "果木培育路径", tier: 2 },
  "birch|jungle": { result: "walnut", time: 12, chance: 20, requiresTreeFarm: 1, label: "坚果树培育路径", tier: 2 },
  "cherry|walnut": { result: "chestnut", time: 16, chance: 12, requiresTreeFarm: 2, label: "栗树三级路径", tier: 3 },
  "larch|walnut": { result: "pine", time: 14, chance: 16, requiresTreeFarm: 2, label: "耐寒木材培育路径", tier: 2 },
  "pine|teak": { result: "sequoia", time: 18, chance: 10, requiresTreeFarm: 3, label: "红杉三级路径", tier: 3 }
};

const butterflyBreedingRecipes = {
  "azure|brimstone": { result: "swallow", time: 10, chance: 18, requiresObservation: 2, label: "花地翅纹突变", tier: 2 },
  "azure|swallow": { result: "morpho", time: 12, chance: 14, requiresObservation: 2, label: "蓝闪蝶支系", tier: 2 },
  "brimstone|swallow": { result: "monarch", time: 12, chance: 14, requiresObservation: 2, label: "帝王蝶支系", tier: 2 },
  "monarch|morpho": { result: "atlas", time: 16, chance: 10, requiresObservation: 3, label: "林冠蝶三级路径", tier: 3 }
};

function getMutationTier(item) {
  const type = String(item?.type || "");
  return type.includes("三级") ? 3 : type.includes("二级") ? 2 : 1;
}

function getDominantSpecies(first, second, source, traitKeys) {
  const score = (id) => traitKeys.reduce((total, key) => total + (Number(source[id]?.traits?.[key]) || 0), 0);
  return score(first) >= score(second) ? first : second;
}

function completeBreedingMatrix(recipes, ids, pairKey, source, traitKeys, options) {
  ids.forEach((first, firstIndex) => ids.slice(firstIndex).forEach((second) => {
    const key = pairKey(first, second);
    if (recipes[key]) return;
    const sameSpecies = first === second;
    const tier = Math.max(getMutationTier(source[first]), getMutationTier(source[second]));
    const result = getDominantSpecies(first, second, source, traitKeys);
    recipes[key] = {
      result,
      time: sameSpecies ? 6 + tier * 2 : 10 + tier * 2,
      chance: sameSpecies ? 58 - (tier - 1) * 4 : 24 - (tier - 1) * 3,
      [options.requireKey]: tier,
      label: sameSpecies ? "纯系稳定繁育" : `属性融合 · ${source[result].name}稳定线`,
      tier,
      stable: true
    };
  }));
}

// Every modeled species can be selected with every other species. Explicit
// Forestry-style mutation paths above remain authoritative; missing pairs use
// a predictable stable-inheritance result instead of becoming dead ends.
completeBreedingMatrix(breedingRecipes, Object.keys(species), getBreedingPairKey, species, ["speed", "lifespan", "fertility"], { requireKey: "requiresApiary" });
completeBreedingMatrix(treeBreedingRecipes, Object.keys(treeSpecies), getTreeBreedingPairKey, treeSpecies, ["growth", "yield", "resin"], { requireKey: "requiresTreeFarm" });

const flowerSources = {
  wildflower: { name: "野花", icon: "✦", color: "amber", speedBonus: 0, zone: "forest", label: "稳定基础花源" },
  clover: { name: "三叶草", icon: "♣", color: "green", speedBonus: .15, zone: "plains", label: "花粉密度高 · 产速 +15%" },
  tropical: { name: "热带花", icon: "✿", color: "teal", speedBonus: .25, zone: "tropic", label: "稀有花粉 · 产速 +25%" }
};

const strategyData = {
  ecology: { name: "生态调查", short: "生态", icon: "♧", effect: "调查优先 · 树场速度 +10%", exploreCost: 6, apiaryRate: 1, treeRate: 1.1, machineRate: 1.1, mutation: 0 },
  genetics: { name: "基因研究", short: "基因", icon: "⌘", effect: "突变概率 +6% · 生产速度 -10%", exploreCost: 5, apiaryRate: .9, treeRate: .9, machineRate: 1, mutation: 6 },
  industry: { name: "工业生产", short: "工业", icon: "⚙", effect: "机器耗时 -15% · 突变概率 -4%", exploreCost: 5, apiaryRate: 1, treeRate: 1, machineRate: .85, mutation: -4 }
};

const environmentEventData = {
  clear: { name: "稳定天气", icon: "◌", detail: "环境保持平稳，没有额外修正。", temperature: 0, humidity: 0, light: 0, flowers: 0, butterflies: 0 },
  bloom: { name: "集中花期", icon: "✿", detail: "花源恢复提高，蝴蝶更活跃。", temperature: 0, humidity: 2, light: 4, flowers: 12, butterflies: .04 },
  rain: { name: "连续降雨", icon: "≈", detail: "湿度上升、光照下降，湿地物种受益。", temperature: -3, humidity: 14, light: -12, flowers: 4, butterflies: -.02 },
  heatwave: { name: "短期热浪", icon: "☀", detail: "温度上升、土壤恢复变慢，热带物种受益。", temperature: 14, humidity: -6, light: 8, flowers: -8, butterflies: -.03 },
  migration: { name: "蝶群迁徙", icon: "◇", detail: "蝶种授粉临时提高，但叶片压力缓慢增加。", temperature: 0, humidity: 0, light: 2, flowers: -2, butterflies: .08 }
};

const upgradeData = {
  apiary: { name: "养蜂箱 A-01", label: "APIARY", icon: "⬡", effect: "提高蜂箱生产速度", costs: [{ honey: 20, wax: 8, wood: 15 }, { honey: 45, wax: 20, wood: 35 }] },
  treeFarm: { name: "树场 T-01", label: "ARBOR", icon: "♣", effect: "提高木材生长速度", costs: [{ wood: 25, oil: 4 }, { wood: 60, oil: 12, resin: 2 }] },
  centrifuge: { name: "离心机 C-01", label: "PROCESSOR", icon: "◉", effect: "缩短蜂巢加工时间", costs: [{ honey: 18, wax: 6, oil: 3 }, { honey: 45, wax: 18, oil: 8 }] },
  warehouse: { name: "仓库 R-01", label: "STORAGE", icon: "▣", effect: "提高各物资独立容量", costs: [{ wood: 25, oil: 4 }, { wood: 60, oil: 12, wax: 8, biofuel: 2 }] }
};

const guideSteps = [
  { title: "开始第一次调查", text: "前往森林边缘，确认后选择手动或自动调查。第一轮手动教学会稳定带回木材、野花与蜂巢。", action: "explore", actionLabel: "前往探索", target: '.explore-button[data-zone="forest"]' },
  { title: "收取第一份蜂巢", text: "等待蜂箱完成一个生产周期，再点击收取蜂巢；同时确认花源库存，避免蜂箱因缺花暂停。", action: "apiary", actionLabel: "查看蜂箱", target: "#collect-button" },
  { title: "分析两种亲本蜂", text: "在养蜂工作台分别分析森林蜂和草原蜂，确认它们的属性。", action: "apiary", actionLabel: "打开养蜂台", target: ".analyze-button:not(.done)" },
  { title: "完成第一次杂交", text: "确认两个亲本后，开始森林蜂 × 草原蜂的杂交实验。", action: "apiary", actionLabel: "进行杂交", target: "#breed-button" },
  { title: "加工蜂巢", text: "前往机器台启动离心机，获得蜂蜜和蜂蜡，完成第一条生产链。", action: "machines", actionLabel: "打开机器台", target: "#machine-button" },
  { title: "启动第二条生产线", text: "离心机完成后，榨汁机 S-01 会解锁；消耗 2 木材和 2 能源，产出 1 份种子油。", action: "machines", actionLabel: "打开榨汁机", target: "#squeezer-button" },
  { title: "培育第一棵进阶树", text: "在树木培育台分析橡树和白桦，完成一次培育并发现落叶松。", action: "arbor", actionLabel: "打开树木台", target: ".tree-analyze-button:not(.done)" },
  { title: "完成第一次设施升级", text: "前往研究台，把资源投入生产设施或仓库扩容；任一物资分区接近上限时优先升级 STORAGE。", action: "research", actionLabel: "打开研究台", target: ".upgrade-grid" },
  { title: "完成第一份生态委托", text: "打开总览的生态委托板，交付指定资源换取补给和声望，让长期生产有明确出口。", action: "overview", actionLabel: "查看生态委托", target: "#contract-button" },
  { title: "建立生物质生产线", text: "拥有 3 个蜂种并完成 1 份委托后解锁发酵机 F-01；消耗 3 木材和 3 能源，产出生物质。", action: "machines", actionLabel: "打开发酵机", target: "#fermenter-button" },
  { title: "蒸馏第一桶生物燃料", text: "发酵机完成 1 批后解锁蒸馏机 ST-01；消耗 1 生物质和 4 能源，产出可用于长期扩张的生物燃料。", action: "machines", actionLabel: "打开蒸馏机", target: "#distiller-button" }
];

const contractData = [
  { id: "field-supply", label: "FIELD SUPPLY 01", title: "林地调查补给", detail: "前线调查站需要一批基础采集物，换取新的探索补给。", requires: { rawComb: 1, wood: 5 }, rewards: { oil: 2, energy: 10 }, reputation: 1 },
  { id: "wax-frame", label: "APIARY FRAME 02", title: "蜂蜡框架委托", detail: "把离心加工后的蜂蜜和蜂蜡交给养蜂工坊，换取建造材料。", unlockText: "完成 1 次离心加工后开放", unlock: () => state.machineCycles >= 1, requires: { honey: 2, wax: 2 }, rewards: { wood: 8, energy: 15 }, reputation: 2 },
  { id: "biofuel", label: "ECO FUEL 03", title: "生态燃料补给", detail: "研究站开始收集生物质，将其转化为能源和研究用蜂蜜。", unlockText: "拥有 3 个蜂种后开放", unlock: () => isFermenterUnlocked(), requires: { biomass: 1, oil: 1 }, rewards: { honey: 4, energy: 35 }, reputation: 3 }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function readJsonStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function loadSaveIndex() {
  const stored = readJsonStorage(SAVE_INDEX_KEY);
  const index = stored?.version === SAVE_VERSION && Array.isArray(stored.slots)
    ? { version: SAVE_VERSION, lastSlotId: stored.lastSlotId || null, slots: stored.slots.filter((slot) => slot && Number(slot.id) >= 1 && Number(slot.id) <= SAVE_SLOT_COUNT) }
    : { version: SAVE_VERSION, lastSlotId: null, slots: [] };
  if (!index.slots.length) {
    const legacy = readJsonStorage(LEGACY_STORAGE_KEY);
    if (legacy && typeof legacy === "object") {
      const now = Date.now();
      const record = { version: SAVE_VERSION, meta: { id: 1, name: "旧版工坊", updatedAt: now, playTime: 0, chapter: "迁移存档" }, state: legacy };
      try {
        localStorage.setItem(`${SAVE_SLOT_PREFIX}1`, JSON.stringify(record));
        if (readJsonStorage(`${SAVE_SLOT_PREFIX}1`)?.version === SAVE_VERSION) {
          index.slots.push(record.meta);
          index.lastSlotId = 1;
          localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(index));
        }
      } catch { /* 保留旧键；存储可用后再次迁移。 */ }
    }
  }
  return index;
}

let saveIndex = loadSaveIndex();
let appSettings = { simplifiedSurvey: readJsonStorage(SETTINGS_KEY)?.simplifiedSurvey === true };
let activeSlotId = saveIndex.lastSlotId || saveIndex.slots[0]?.id || null;
let gameStarted = false;
let state = loadState(activeSlotId);

function loadState(slotId = activeSlotId) {
  try {
    const slotRecord = slotId ? readJsonStorage(`${SAVE_SLOT_PREFIX}${slotId}`) : null;
    const saved = slotRecord?.version === SAVE_VERSION ? slotRecord.state : null;
    if (!saved) return structuredClone(defaultState);
    const merged = {
      ...structuredClone(defaultState),
      ...saved,
      resources: { ...defaultState.resources, ...saved.resources },
      flowerInventory: { ...defaultState.flowerInventory, ...saved.flowerInventory },
      explorationCounts: { ...defaultState.explorationCounts, ...saved.explorationCounts },
      zoneProgress: Object.fromEntries(Object.keys(defaultState.zoneProgress).map((zone) => [zone, { ...defaultState.zoneProgress[zone], ...(saved.zoneProgress?.[zone] || {}) }])),
      treeSaplings: { ...defaultState.treeSaplings, ...saved.treeSaplings },
      treeBreedingParents: { ...defaultState.treeBreedingParents, ...saved.treeBreedingParents },
      breedingParents: { ...defaultState.breedingParents, ...saved.breedingParents },
      butterflyBreedingParents: { ...defaultState.butterflyBreedingParents, ...saved.butterflyBreedingParents },
      zoneEnvironments: Object.fromEntries(Object.keys(defaultState.zoneEnvironments).map((zone) => [zone, { ...defaultState.zoneEnvironments[zone], ...(saved.zoneEnvironments?.[zone] || {}) }])),
      environmentEvent: { ...defaultState.environmentEvent, ...(saved.environmentEvent || {}) },
      breedingPity: normalizePityStore(saved.breedingPity),
      treeBreedingPity: normalizePityStore(saved.treeBreedingPity),
      butterflyBreedingPity: normalizePityStore(saved.butterflyBreedingPity),
      upgrades: { ...defaultState.upgrades, ...saved.upgrades },
      upgradesBought: Number.isFinite(saved.upgradesBought) ? saved.upgradesBought : defaultState.upgradesBought,
      apiaryCombCollected: Number.isFinite(saved.apiaryCombCollected) ? saved.apiaryCombCollected : (Number(saved.apiaryCycles) > 0 && Number(saved.apiaryReady) === 0 ? Math.max(1, Math.min(Number(saved.totalCombCollected) || 1, Number(saved.apiaryCycles))) : defaultState.apiaryCombCollected),
      analyzed: Array.isArray(saved.analyzed) ? saved.analyzed : [...defaultState.analyzed],
      discovered: Array.isArray(saved.discovered) ? saved.discovered : [...defaultState.discovered],
      treeDiscovered: Array.isArray(saved.treeDiscovered) ? saved.treeDiscovered : [...defaultState.treeDiscovered],
      treeAnalyzed: Array.isArray(saved.treeAnalyzed) ? saved.treeAnalyzed : [...defaultState.treeAnalyzed],
      butterflyDiscovered: Array.isArray(saved.butterflyDiscovered) ? saved.butterflyDiscovered : [...defaultState.butterflyDiscovered],
      butterflyAnalyzed: Array.isArray(saved.butterflyAnalyzed) ? saved.butterflyAnalyzed : [...defaultState.butterflyAnalyzed],
      logs: Array.isArray(saved.logs) ? saved.logs.slice(0, 6) : structuredClone(defaultState.logs),
      pendingSurvey: Array.isArray(saved.pendingSurvey) ? saved.pendingSurvey.slice(0, 40) : [],
      claimedResultIds: Array.isArray(saved.claimedResultIds) ? saved.claimedResultIds.slice(-80) : []
    };
    Object.keys(defaultState.resources).forEach((resource) => {
      const value = Number(merged.resources[resource]);
      merged.resources[resource] = Number.isFinite(value) ? resource === "energy" ? clamp(value, 0, 100) : Math.max(0, value) : defaultState.resources[resource];
    });
    Object.keys(defaultState.flowerInventory).forEach((flower) => {
      const value = Number(merged.flowerInventory[flower]);
      merged.flowerInventory[flower] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState.flowerInventory[flower];
    });
    merged.activeFlower = ["wildflower", "clover", "tropical"].includes(merged.activeFlower) ? merged.activeFlower : defaultState.activeFlower;
    merged.activeHabitat = ["forest", "plains", "swamp", "tropic"].includes(merged.activeHabitat) ? merged.activeHabitat : defaultState.activeHabitat;
    merged.strategyFocus = strategyData[merged.strategyFocus] ? merged.strategyFocus : defaultState.strategyFocus;
    merged.strategyReady = merged.strategyReady === true;
    merged.strategyActionsRemaining = clamp(Math.floor(Number(merged.strategyActionsRemaining) || defaultState.strategyActionsRemaining), 0, 3);
    merged.strategyCycles = Math.max(0, Math.floor(Number(merged.strategyCycles) || 0));
    Object.keys(defaultState.zoneEnvironments).forEach((zone) => {
      Object.keys(defaultState.zoneEnvironments[zone]).forEach((key) => {
        const value = Number(merged.zoneEnvironments[zone][key]);
        merged.zoneEnvironments[zone][key] = Number.isFinite(value) ? clamp(value, 0, 100) : defaultState.zoneEnvironments[zone][key];
      });
    });
    merged.environmentEvent.current = environmentEventData[merged.environmentEvent.current] ? merged.environmentEvent.current : defaultState.environmentEvent.current;
    merged.environmentEvent.next = environmentEventData[merged.environmentEvent.next] ? merged.environmentEvent.next : defaultState.environmentEvent.next;
    merged.environmentEvent.remaining = clamp(Math.floor(Number(merged.environmentEvent.remaining) || defaultState.environmentEvent.remaining), 1, 4);
    Object.keys(defaultState.explorationCounts).forEach((zone) => {
      const value = Number(merged.explorationCounts[zone]);
      merged.explorationCounts[zone] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState.explorationCounts[zone];
      Object.keys(defaultState.zoneProgress[zone]).forEach((key) => {
        const progressValue = Number(merged.zoneProgress[zone][key]);
        merged.zoneProgress[zone][key] = Number.isFinite(progressValue) ? Math.max(0, Math.floor(progressValue)) : 0;
      });
      merged.zoneProgress[zone].rareProgress = clamp(merged.zoneProgress[zone].rareProgress, 0, 100);
      merged.zoneProgress[zone].proficiency = clamp(merged.zoneProgress[zone].proficiency, 0, 100);
    });
    Object.keys(merged.treeSaplings).forEach((tree) => {
      const value = Number(merged.treeSaplings[tree]);
      merged.treeSaplings[tree] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState.treeSaplings[tree];
    });
    Object.keys(defaultState.upgrades).forEach((type) => {
      const value = Number(merged.upgrades[type]);
      merged.upgrades[type] = Number.isFinite(value) ? clamp(Math.floor(value), 1, 3) : defaultState.upgrades[type];
    });
    ["princess", "drone"].forEach((slot) => {
      merged.breedingParents[slot] = typeof merged.breedingParents[slot] === "string" ? merged.breedingParents[slot] : defaultState.breedingParents[slot];
    });
    ["parentA", "parentB"].forEach((slot) => {
      merged.treeBreedingParents[slot] = typeof merged.treeBreedingParents[slot] === "string" ? merged.treeBreedingParents[slot] : defaultState.treeBreedingParents[slot];
      merged.butterflyBreedingParents[slot] = typeof merged.butterflyBreedingParents[slot] === "string" ? merged.butterflyBreedingParents[slot] : defaultState.butterflyBreedingParents[slot];
    });
    merged.machineActive = merged.machineActive === true;
    merged.squeezerActive = merged.squeezerActive === true;
    merged.fermenterActive = merged.fermenterActive === true;
    merged.distillerActive = merged.distillerActive === true;
    merged.automationEnabled = merged.automationEnabled === true;
    const automationReserveEnergy = Number(merged.automationReserveEnergy);
    merged.automationReserveEnergy = Number.isFinite(automationReserveEnergy) ? clamp(Math.floor(automationReserveEnergy), 0, 30) : defaultState.automationReserveEnergy;
    ["rawComb", "processedHoney", "processedWax", "totalCombCollected", "apiaryCombCollected", "explorations", "apiaryReady", "apiaryCycles", "machineOutput", "machineCycles", "squeezerOutput", "squeezerCycles", "fermenterOutput", "fermenterCycles", "distillerOutput", "distillerCycles", "contractIndex", "contractsCompleted", "reputation", "treeReady", "treeReadyYield", "treeReadyResin", "treeCycles", "treeHarvests", "breedings", "breedingAttempts", "breedingFailures", "treeBreedingAttempts", "treeBreedingFailures", "butterflyBreedingAttempts", "butterflyBreedingFailures", "upgradesBought", "playTimeSeconds"].forEach((key) => {
      const value = Number(merged[key]);
      merged[key] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState[key];
    });
    if (!Object.keys(merged.breedingPity).length && merged.breedingFailures > 0) {
      const first = typeof merged.breeding?.princess === "string" ? merged.breeding.princess : merged.breedingParents.princess;
      const second = typeof merged.breeding?.drone === "string" ? merged.breeding.drone : merged.breedingParents.drone;
      merged.breedingPity[getBreedingPairKey(first, second)] = clamp(merged.breedingFailures, 0, 9);
    }
    if (!Object.keys(merged.treeBreedingPity).length && merged.treeBreedingFailures > 0) {
      const first = typeof merged.treeBreeding?.parentA === "string" ? merged.treeBreeding.parentA : merged.treeBreedingParents.parentA;
      const second = typeof merged.treeBreeding?.parentB === "string" ? merged.treeBreeding.parentB : merged.treeBreedingParents.parentB;
      merged.treeBreedingPity[getTreeBreedingPairKey(first, second)] = clamp(merged.treeBreedingFailures, 0, 9);
    }
    if (!Object.keys(merged.butterflyBreedingPity).length && merged.butterflyBreedingFailures > 0) {
      const first = typeof merged.butterflyBreeding?.parentA === "string" ? merged.butterflyBreeding.parentA : merged.butterflyBreedingParents.parentA;
      const second = typeof merged.butterflyBreeding?.parentB === "string" ? merged.butterflyBreeding.parentB : merged.butterflyBreedingParents.parentB;
      merged.butterflyBreedingPity[getButterflyBreedingPairKey(first, second)] = clamp(merged.butterflyBreedingFailures, 0, 9);
    }
    if (merged.contractsCompleted < contractData.length) merged.automationEnabled = false;
    if (merged.treeReady === 0) {
      merged.treeReadyYield = 0;
      merged.treeReadyResin = 0;
    }
    ["apiaryProgress", "machineProgress", "squeezerProgress", "fermenterProgress", "distillerProgress", "treeProgress"].forEach((key) => {
      const value = Number(merged[key]);
      merged[key] = Number.isFinite(value) ? clamp(value, 0, 100) : defaultState[key];
    });
    const lastTickAt = Number(merged.lastTickAt);
    merged.lastTickAt = Number.isFinite(lastTickAt) && lastTickAt > 0 ? Math.min(lastTickAt, Date.now()) : Date.now();
    ["breeding", "treeBreeding", "butterflyBreeding"].forEach((key) => {
      if (!merged[key]) return;
      const remaining = Number(merged[key].remaining);
      if (!Number.isFinite(remaining) || remaining <= 0) {
        merged[key] = null;
      } else if (key === "breeding") {
        merged[key] = {
          remaining,
          princess: typeof merged[key].princess === "string" ? merged[key].princess : defaultState.breedingParents.princess,
          drone: typeof merged[key].drone === "string" ? merged[key].drone : defaultState.breedingParents.drone,
          result: Object.prototype.hasOwnProperty.call(species, merged[key].result) ? merged[key].result : "cultivated",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 95) : null
        };
      } else if (key === "treeBreeding") {
        merged[key] = {
          remaining,
          parentA: typeof merged[key].parentA === "string" ? merged[key].parentA : defaultState.treeBreedingParents.parentA,
          parentB: typeof merged[key].parentB === "string" ? merged[key].parentB : defaultState.treeBreedingParents.parentB,
          result: Object.prototype.hasOwnProperty.call(treeSpecies, merged[key].result) ? merged[key].result : "larch",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 95) : null
        };
      } else {
        merged[key] = {
          remaining,
          parentA: typeof merged[key].parentA === "string" ? merged[key].parentA : defaultState.butterflyBreedingParents.parentA,
          parentB: typeof merged[key].parentB === "string" ? merged[key].parentB : defaultState.butterflyBreedingParents.parentB,
          result: Object.prototype.hasOwnProperty.call(butterflySpecies, merged[key].result) ? merged[key].result : "swallow",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 95) : null
        };
      }
    });
    return merged;
  } catch {
    return structuredClone(defaultState);
  }
}

function performSave() {
  if (!activeSlotId) return false;
  state.lastTickAt = Date.now();
  const previous = saveIndex.slots.find((slot) => Number(slot.id) === Number(activeSlotId));
  const meta = {
    id: Number(activeSlotId),
    name: previous?.name || `林业工坊 ${activeSlotId}`,
    updatedAt: Date.now(),
    playTime: Math.max(0, Math.floor(Number(state.playTimeSeconds) || 0)),
    chapter: getGuideStep() >= guideSteps.length ? "自由生态工坊" : `引导 ${getGuideStep() + 1} / ${guideSteps.length}`
  };
  try {
    localStorage.setItem(`${SAVE_SLOT_PREFIX}${activeSlotId}`, JSON.stringify({ version: SAVE_VERSION, meta, state }));
    saveIndex.slots = [...saveIndex.slots.filter((slot) => Number(slot.id) !== Number(activeSlotId)), meta].sort((a, b) => Number(a.id) - Number(b.id));
    saveIndex.lastSlotId = Number(activeSlotId);
    localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(saveIndex));
  } catch {
    showToast("本地存档写入失败，请导出备份后检查浏览器存储空间。");
    return false;
  }
  const status = $("#save-status");
  if (status) status.textContent = "已自动保存";
  window.clearTimeout(saveState.statusTimer);
  saveState.statusTimer = window.setTimeout(() => { if (status) status.textContent = "实时同步"; }, 1600);
  return true;
}

function saveState(immediate = false) {
  if (!gameStarted || !activeSlotId) return;
  if (immediate) {
    window.clearTimeout(saveState.writeTimer);
    saveState.writeTimer = null;
    performSave();
    return;
  }
  const status = $("#save-status");
  if (status) status.textContent = "等待写入";
  if (!saveState.writeTimer) saveState.writeTimer = window.setTimeout(() => {
    saveState.writeTimer = null;
    performSave();
  }, 15000);
}

function formatTime() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function addLog(text, kind = "amber") {
  state.logs.unshift({ time: formatTime(), text, kind });
  state.logs = state.logs.slice(0, 6);
  setText("#last-action", text);
  renderLogs();
  saveState();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setText(selector, value) { const el = $(selector); if (el) el.textContent = value; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function getStrategyConfig() {
  return strategyData[state.strategyFocus] || strategyData.ecology;
}

function getExploreEnergyCost(zone = "forest", mode = "manual") {
  const config = zones[zone] || zones.forest;
  return mode === "auto" ? config.autoEnergy : config.manualEnergy;
}

function getActiveEnvironment() {
  const zone = getActiveHabitatId();
  if (!state.zoneEnvironments?.[zone]) state.zoneEnvironments[zone] = { ...defaultState.zoneEnvironments[zone] };
  return state.zoneEnvironments[zone];
}

function getCurrentEnvironmentEvent() {
  return environmentEventData[state.environmentEvent?.current] || environmentEventData.clear;
}

function getWorkshopLoad() {
  return clamp((state.machineActive ? 4 : 0) + (state.squeezerActive ? 5 : 0) + (state.fermenterActive ? 8 : 0) + (state.distillerActive ? 12 : 0) + (state.automationEnabled ? 4 : 0), 0, 100);
}

function getBeePollinationPotential() {
  if (getFlowerCount() <= 0) return 0;
  const fertility = getCurrentBeeTrait("fertility");
  return clamp((.04 + (fertility - 50) / 250) * getHabitatSuitability(), 0, .18);
}

function getButterflyPollinationBonus() {
  const environment = getActiveEnvironment();
  const event = getCurrentEnvironmentEvent();
  const habitat = getActiveHabitatId();
  const known = knownDiscoveredButterflies();
  if (!known.length || environment.light < 24 || environment.leafPressure >= 88) return 0;
  const activity = clamp((environment.light / 100) * (1 - Math.abs(environment.humidity - (habitat === "swamp" || habitat === "tropic" ? 72 : 52)) / 130), .2, 1);
  const pollination = known.reduce((total, id) => {
    const butterfly = butterflySpecies[id];
    const zoneFit = butterfly?.zone === habitat ? 1 : .62;
    return total + ((butterfly?.traits?.pollination || 40) / 100) * zoneFit * .045;
  }, 0);
  const diversity = known.length >= 4 ? .1 : known.length === 3 ? .06 : known.length === 2 ? .03 : 0;
  return clamp((pollination + diversity + event.butterflies) * activity, 0, .24);
}

function getEcologyBreakdown() {
  const environment = getActiveEnvironment();
  const habitatFit = Math.round(getHabitatSuitability() * 100);
  const flowerSupply = clamp(Math.round(environment.flowerDensity * .72 + Math.min(28, getFlowerCount() * 7)), 0, 100);
  const treeHealth = clamp(Math.round(environment.soil * .58 + environment.light * .24 + (100 - environment.leafPressure) * .18), 0, 100);
  const pollination = clamp(Math.round(34 + getBeePollinationPotential() * 210 + getButterflyPollinationBonus() * 180), 0, 100);
  const diversityCount = knownDiscoveredBees().length + knownDiscoveredTrees().length + knownDiscoveredButterflies().length;
  const diversity = clamp(38 + Math.max(0, diversityCount - 5) * 7, 0, 100);
  const climateStress = Math.max(0, Math.abs(environment.temperature - zones[getActiveHabitatId()].baseline.temperature) - 12);
  const pressure = clamp(Math.round(100 - environment.workshopLoad * .72 - environment.leafPressure * .32 - climateStress * .8), 0, 100);
  const score = Math.round(habitatFit * .25 + flowerSupply * .15 + treeHealth * .15 + pollination * .15 + diversity * .15 + pressure * .15);
  const factors = [
    { id: "habitat", name: "环境适配", value: habitatFit, detail: `${zones[getActiveHabitatId()].name} · 温度 ${Math.round(environment.temperature)} / 湿度 ${Math.round(environment.humidity)}` },
    { id: "flowers", name: "花源供应", value: flowerSupply, detail: `${flowerSources[getActiveFlowerId()].name}库存 ${getFlowerCount()} · 密度 ${Math.round(environment.flowerDensity)}` },
    { id: "trees", name: "树木健康", value: treeHealth, detail: `土壤 ${Math.round(environment.soil)} · 叶片压力 ${Math.round(environment.leafPressure)}` },
    { id: "pollination", name: "授粉网络", value: pollination, detail: `蜜蜂 +${Math.round(getBeePollinationPotential() * 100)}% · 蝴蝶 +${Math.round(getButterflyPollinationBonus() * 100)}%` },
    { id: "diversity", name: "物种多样", value: diversity, detail: `蜂 ${knownDiscoveredBees().length} · 树 ${knownDiscoveredTrees().length} · 蝶 ${knownDiscoveredButterflies().length}` },
    { id: "pressure", name: "环境压力", value: pressure, detail: `工坊 ${Math.round(environment.workshopLoad)} · 冠层 ${Math.round(environment.canopy)}` }
  ];
  const weak = [...factors].sort((a, b) => a.value - b.value).slice(0, 2);
  return { score, factors, weak, environment };
}

function getEcologyProductionMultiplier() {
  return clamp(.55 + getEcologyBreakdown().score / 180, .55, 1.15);
}

function getEnvironmentMutationModifier(kind = "bee") {
  const ecology = getEcologyBreakdown();
  let modifier = ecology.score >= 85 ? 5 : ecology.score < 40 ? -10 : ecology.score < 60 ? -5 : 0;
  if (kind === "tree") modifier += Math.round(getButterflyPollinationBonus() * 20);
  if (kind === "butterfly" && getCurrentEnvironmentEvent() === environmentEventData.migration) modifier += 4;
  return modifier;
}

function advanceEnvironmentEvent() {
  const order = ["clear", "bloom", "rain", "heatwave", "migration"];
  state.environmentEvent.remaining -= 1;
  if (state.environmentEvent.remaining > 0) return;
  state.environmentEvent.current = state.environmentEvent.next;
  const currentIndex = order.indexOf(state.environmentEvent.current);
  state.environmentEvent.next = order[(currentIndex + 1 + (state.strategyCycles % 2)) % order.length];
  state.environmentEvent.remaining = state.environmentEvent.current === "clear" ? 2 : 3;
  addLog(`环境事件变化：${getCurrentEnvironmentEvent().name}。${getCurrentEnvironmentEvent().detail}`, "teal");
}

function consumeStrategyAction() {
  if (state.strategyReady) {
    state.strategyReady = false;
    state.strategyActionsRemaining = 3;
  }
  state.strategyActionsRemaining = Math.max(0, state.strategyActionsRemaining - 1);
  if (state.strategyActionsRemaining > 0) return;
  state.strategyCycles += 1;
  state.strategyReady = true;
  advanceEnvironmentEvent();
}

function selectStrategy(id) {
  if (!strategyData[id]) return;
  if (!state.strategyReady) return showToast(`当前工作周期还剩 ${state.strategyActionsRemaining} 次有效行动，完成后才能切换策略。`);
  state.strategyFocus = id;
  state.strategyActionsRemaining = 3;
  state.strategyReady = false;
  addLog(`工作策略切换为${strategyData[id].name}：${strategyData[id].effect}。`, "amber");
  showToast(`已选择${strategyData[id].name}，本周期 3 次行动`);
  renderAll();
}

function applyEnvironmentCycle(kind) {
  const environment = getActiveEnvironment();
  if (kind === "apiary") {
    const speedPressure = getCurrentBeeTrait("speed") > 70 ? 2 : 0;
    const fertilityPressure = getCurrentBeeTrait("fertility") > 80 ? 1 : 0;
    environment.flowerDensity = clamp(environment.flowerDensity - 4 - speedPressure - fertilityPressure, 0, 100);
  } else if (kind === "tree") {
    const soilCost = 1 + (getCurrentTreeTrait("growth") > 75 ? 1 : 0) + (getCurrentTreeTrait("yield") > 80 ? 1 : 0);
    environment.soil = clamp(environment.soil - soilCost, 0, 100);
    environment.canopy = clamp(environment.canopy + .8, 0, 100);
    environment.flowerDensity = clamp(environment.flowerDensity + (getCurrentTreeTrait("resin") < 60 ? 3 : 1), 0, 100);
  } else if (kind === "butterfly") {
    environment.leafPressure = clamp(environment.leafPressure + 5, 0, 100);
  } else if (kind === "fermenter") {
    environment.soil = clamp(environment.soil + 2, 0, 100);
  } else if (kind === "explore") {
    environment.flowerDensity = clamp(environment.flowerDensity + 8, 0, 100);
    environment.soil = clamp(environment.soil + 2, 0, 100);
  }
}

function advanceEnvironment(seconds) {
  const safeSeconds = clamp(Number(seconds) || 0, 0, 60 * 60 * 8);
  if (safeSeconds <= 0) return;
  const zoneId = getActiveHabitatId();
  const baseline = zones[zoneId].baseline;
  const environment = getActiveEnvironment();
  const event = getCurrentEnvironmentEvent();
  const loadTarget = getWorkshopLoad();
  const blend = Math.min(1, safeSeconds / 150);
  environment.workshopLoad += (loadTarget - environment.workshopLoad) * blend;
  const temperatureTarget = clamp(baseline.temperature + event.temperature + environment.workshopLoad * .18 - Math.max(0, environment.canopy - baseline.canopy) * .08, 0, 100);
  const humidityTarget = clamp(baseline.humidity + event.humidity + Math.max(0, environment.canopy - baseline.canopy) * .08 - environment.workshopLoad * .05, 0, 100);
  const lightTarget = clamp(baseline.light + event.light - Math.max(0, environment.canopy - baseline.canopy) * .16, 0, 100);
  const flowerDemand = getFlowerCount() > 0 ? (getCurrentBeeTrait("speed") > 70 ? 7 : 4) : 12;
  const flowerTarget = clamp(baseline.flowerDensity + event.flowers + Math.min(18, getFlowerCount() * 3) - flowerDemand, 0, 100);
  environment.temperature += (temperatureTarget - environment.temperature) * blend;
  environment.humidity += (humidityTarget - environment.humidity) * blend;
  environment.light += (lightTarget - environment.light) * blend;
  environment.flowerDensity += (flowerTarget - environment.flowerDensity) * Math.min(1, safeSeconds / 420);
  environment.soil += (baseline.soil - environment.soil) * Math.min(1, safeSeconds / 3600);
  const leafTarget = clamp(baseline.leafPressure + knownDiscoveredButterflies().length * 2 + (state.environmentEvent.current === "migration" ? 10 : 0), 0, 100);
  environment.leafPressure += (leafTarget - environment.leafPressure) * Math.min(1, safeSeconds / 900);
  Object.keys(environment).forEach((key) => { environment[key] = clamp(environment[key], 0, 100); });
}

const resourceNames = { rawComb: "蜂巢", honey: "蜂蜜", wax: "蜂蜡", wood: "木材", oil: "种子油", resin: "树脂", biomass: "生物质", biofuel: "生物燃料", energy: "能源" };
const warehouseBaseCapacities = Object.freeze({ rawComb: 24, honey: 60, wax: 40, wood: 80, oil: 30, resin: 24, biomass: 20, biofuel: 16 });
const warehouseResources = Object.keys(warehouseBaseCapacities);

function getUpgradeLevel(type) {
  return clamp(Number(state.upgrades?.[type]) || 1, 1, 3);
}

function getWarehouseCapacity(resource) {
  const baseCapacity = warehouseBaseCapacities[resource];
  if (!baseCapacity) return 0;
  const multiplier = 1 + (getUpgradeLevel("warehouse") - 1) * .5;
  return Math.floor(baseCapacity * multiplier);
}

function getWarehouseLoad(resource) {
  return Math.floor(getStoredResourceAmount(resource));
}

function getWarehouseSpace(resource) {
  return Math.max(0, getWarehouseCapacity(resource) - getWarehouseLoad(resource));
}

function getWarehouseBundleBlocker(bundle, released = {}) {
  for (const [resource, amount] of Object.entries(bundle || {})) {
    if (!(resource in warehouseBaseCapacities)) continue;
    const requested = Math.max(0, Math.floor(Number(amount) || 0));
    const releasedAmount = Math.max(0, Math.floor(Number(released?.[resource]) || 0));
    const storedAfterRelease = Math.max(0, getWarehouseLoad(resource) - releasedAmount);
    const capacity = getWarehouseCapacity(resource);
    const space = Math.max(0, capacity - storedAfterRelease);
    if (requested > space) {
      return { resource, name: resourceNames[resource] || resource, requested, space, capacity, shortage: requested - space };
    }
  }
  return null;
}

function formatWarehouseBlocker(blocker) {
  if (!blocker) return "";
  return `${blocker.resourceName || blocker.name}分区剩余 ${blocker.space}，需要 ${blocker.requested}`;
}

function addToWarehouse(resource, amount) {
  const requested = Math.max(0, Math.floor(Number(amount) || 0));
  const accepted = Math.min(requested, getWarehouseSpace(resource));
  if (resource === "rawComb") state.rawComb += accepted;
  else if (state.resources && resource in state.resources) state.resources[resource] += accepted;
  return { accepted, overflow: requested - accepted };
}

function getStoredResourceAmount(resource) {
  if (resource === "rawComb") return Math.max(0, Number(state.rawComb) || 0);
  return Math.max(0, Number(state.resources?.[resource]) || 0);
}

function getMissingResources(bundle) {
  return Object.entries(bundle).filter(([resource, amount]) => getStoredResourceAmount(resource) < amount);
}

function formatResourceBundle(bundle) {
  return Object.entries(bundle).map(([resource, amount]) => `${resourceNames[resource] || resource} ${amount}`).join(" · ");
}

function getCurrentContract() {
  return contractData[state.contractIndex] || null;
}

function isContractUnlocked(contract) {
  return Boolean(contract && (!contract.unlock || contract.unlock()));
}

function getContractRewardBlocker(contract) {
  if (!contract) return null;
  return getWarehouseBundleBlocker(contract.rewards, contract.requires);
}

function consumeResourceBundle(bundle) {
  Object.entries(bundle).forEach(([resource, amount]) => {
    if (resource === "rawComb") state.rawComb -= amount;
    else state.resources[resource] -= amount;
  });
}

function grantResourceBundle(bundle) {
  Object.entries(bundle).forEach(([resource, amount]) => {
    if (resource === "energy") state.resources.energy = clamp(state.resources.energy + amount, 0, 100);
    else addToWarehouse(resource, amount);
  });
}

function getUpgradeCost(type) {
  const level = getUpgradeLevel(type);
  return upgradeData[type]?.costs[level - 1] || null;
}

function formatCost(cost) {
  return Object.entries(cost).map(([resource, amount]) => `${resourceNames[resource] || resource} ${amount}`).join(" · ");
}

function canAfford(cost) {
  return Object.entries(cost).every(([resource, amount]) => (state.resources[resource] || 0) >= amount);
}

function getCurrentBeeTrait(key, fallback = 50) {
  const ids = [getParentId("princess", "forest"), getParentId("drone", "meadows")];
  const values = ids.map((id) => species[id]?.traits?.[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function getActiveHabitatId() {
  return zones[state.activeHabitat] && isZoneUnlocked(state.activeHabitat) ? state.activeHabitat : "forest";
}

function getHabitatSuitability() {
  const habitat = getActiveHabitatId();
  const ids = [getParentId("princess", "forest"), getParentId("drone", "meadows")];
  const values = ids.map((id) => species[id]?.habitat?.[habitat]).filter(Number.isFinite);
  const inheritedFit = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : .7;
  const environment = state.zoneEnvironments?.[habitat] || defaultState.zoneEnvironments[habitat];
  const baseline = zones[habitat].baseline;
  const climatePenalty = Math.abs(environment.temperature - baseline.temperature) * .0045 + Math.abs(environment.humidity - baseline.humidity) * .0035 + Math.abs(environment.light - baseline.light) * .002;
  return clamp(inheritedFit * (1 - climatePenalty), .2, 1.08);
}

function getCurrentTreeTrait(key, fallback = 50) {
  const ids = [getTreeParentId("parentA", "oak"), getTreeParentId("parentB", "birch")];
  const values = ids.map((id) => treeSpecies[id]?.traits?.[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function getApiaryRate() {
  const baseRate = .8 + (getUpgradeLevel("apiary") - 1) * .18;
  return Math.max(.4, (baseRate + (getCurrentBeeTrait("speed") - 50) * .008) * getHabitatSuitability());
}

function getActiveFlowerId() {
  return flowerSources[state.activeFlower] ? state.activeFlower : "wildflower";
}

function getFlowerCount(id = getActiveFlowerId()) {
  return Math.max(0, Number(state.flowerInventory?.[id]) || 0);
}

function getApiaryEffectiveRate() {
  const source = flowerSources[getActiveFlowerId()];
  return getApiaryRate() * (1 + source.speedBonus) * getStrategyConfig().apiaryRate * getEcologyProductionMultiplier();
}

function getApiaryYieldPerCycle() {
  const lifespan = getCurrentBeeTrait("lifespan");
  const fertility = getCurrentBeeTrait("fertility");
  return Math.max(1, Math.min(2, Math.floor((lifespan + fertility) / 130) + 1));
}

function getPollinationBonus() {
  return clamp(getBeePollinationPotential() + getButterflyPollinationBonus(), 0, .34);
}

function getTreeRate() {
  const baseRate = .65 + (getUpgradeLevel("treeFarm") - 1) * .15;
  const environment = getActiveEnvironment();
  const soilFactor = clamp(.55 + environment.soil / 180, .55, 1.1);
  const lightFactor = clamp(.62 + environment.light / 210, .62, 1.08);
  return Math.max(.25, (baseRate + (getCurrentTreeTrait("growth") - 50) * .004) * (1 + getPollinationBonus()) * soilFactor * lightFactor * getStrategyConfig().treeRate * getEcologyProductionMultiplier());
}

function getTreeYieldMultiplier() {
  const environment = getActiveEnvironment();
  const leafFactor = clamp(1 - Math.max(0, environment.leafPressure - 50) * .004, .72, 1);
  const soilFactor = clamp(.7 + environment.soil / 250, .7, 1.1);
  return clamp((1 + (getCurrentTreeTrait("yield") - 50) / 200) * (1 + getPollinationBonus() * .5) * leafFactor * soilFactor, .55, 1.5);
}

function getTreeYieldPerCycle() {
  return Math.max(1, Math.round(8 * getTreeYieldMultiplier()));
}

function getTreeResinPerCycle() {
  const resinTrait = getCurrentTreeTrait("resin");
  return Math.max(0, Math.round((resinTrait - 45) / 25));
}

function getTreeYieldAmount() {
  if (state.treeReady <= 0) return 0;
  if (state.treeReadyYield <= 0) state.treeReadyYield = state.treeReady * getTreeYieldPerCycle();
  return state.treeReadyYield;
}

function getMachineDuration() {
  return Math.max(3, (6 - (getUpgradeLevel("centrifuge") - 1) * .8) * getStrategyConfig().machineRate);
}

function isSqueezerUnlocked() {
  return state.machineCycles >= 1;
}

function getSqueezerDuration() {
  return 8 * getStrategyConfig().machineRate;
}

function isFermenterUnlocked() {
  return knownDiscoveredBees().length >= 3 && state.contractsCompleted >= 1;
}

function getFermenterDuration() {
  return 10 * getStrategyConfig().machineRate;
}

function isDistillerUnlocked() {
  return state.fermenterCycles >= 1;
}

function isAutomationUnlocked() {
  return state.contractsCompleted >= contractData.length;
}

function getAutomationReserveEnergy() {
  const value = Number(state.automationReserveEnergy);
  return Number.isFinite(value) ? clamp(Math.floor(value), 0, 30) : 10;
}

function getDistillerDuration() {
  return 12 * getStrategyConfig().machineRate;
}

function getCurrentRecipeLedger() {
  if (state.machineActive || state.machineOutput > 0) return { title: "蜂巢基础分离", input: "1 蜂巢", output: "1 蜂蜜 + 1 蜂蜡", duration: getMachineDuration(), energy: 2 };
  if (state.squeezerActive || state.squeezerOutput > 0) return { title: "种子油榨取", input: "2 木材 + 2 能源", output: "1 种子油", duration: getSqueezerDuration(), energy: 2 };
  if (state.fermenterActive || state.fermenterOutput > 0) return { title: "生物质发酵", input: "3 木材 + 3 能源", output: "1 生物质", duration: getFermenterDuration(), energy: 3 };
  if (state.distillerActive || state.distillerOutput > 0) return { title: "生物燃料蒸馏", input: "1 生物质 + 4 能源", output: "1 生物燃料", duration: getDistillerDuration(), energy: 4 };
  if (state.rawComb > 0) return { title: "蜂巢基础分离", input: "1 蜂巢", output: "1 蜂蜜 + 1 蜂蜡", duration: getMachineDuration(), energy: 2 };
  if (isSqueezerUnlocked() && state.squeezerCycles === 0) return { title: "种子油榨取", input: "2 木材 + 2 能源", output: "1 种子油", duration: getSqueezerDuration(), energy: 2 };
  if (isFermenterUnlocked() && state.fermenterCycles === 0) return { title: "生物质发酵", input: "3 木材 + 3 能源", output: "1 生物质", duration: getFermenterDuration(), energy: 3 };
  if (isDistillerUnlocked() && state.distillerCycles === 0) return { title: "生物燃料蒸馏", input: "1 生物质 + 4 能源", output: "1 生物燃料", duration: getDistillerDuration(), energy: 4 };
  return { title: "蜂巢基础分离", input: "1 蜂巢", output: "1 蜂蜜 + 1 蜂蜡", duration: getMachineDuration(), energy: 2 };
}

function getUpgradeEffectText(type) {
  if (type === "apiary") return `${upgradeData[type].effect} · 当前 ${getApiaryEffectiveRate().toFixed(2)}%/s`;
  if (type === "treeFarm") return `${upgradeData[type].effect} · 当前 ${getTreeRate().toFixed(2)}%/s`;
  if (type === "warehouse") return `${upgradeData[type].effect} · 当前基准 ×${(1 + (getUpgradeLevel("warehouse") - 1) * .5).toFixed(1)}`;
  return `${upgradeData[type].effect} · 当前 ${getMachineDuration().toFixed(1)}s/轮`;
}

function combineTraits(ids, catalog, keys, fallback = 50) {
  const entries = ids.map((id) => catalog[id]).filter(Boolean);
  return keys.reduce((traits, key) => {
    const values = entries.map((entry) => entry.traits?.[key]).filter(Number.isFinite);
    traits[key] = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : fallback;
    return traits;
  }, {});
}

function traitWord(value, words) {
  if (value >= 70) return words[2];
  if (value >= 45) return words[1];
  return words[0];
}

function renderTraitBar(barSelector, valueSelector, value, words) {
  const bar = $(barSelector);
  if (bar) bar.style.width = `${clamp(value, 0, 100)}%`;
  setText(valueSelector, traitWord(value, words));
}

function updateStatusPill(selector, text, mode) {
  const pill = $(selector);
  if (!pill) return;
  pill.textContent = text;
  ["online", "waiting", "ready", "blocked"].forEach((name) => pill.classList.toggle(name, name === mode));
}

function upgradeFacility(type) {
  const data = upgradeData[type];
  if (!data) return;
  const level = getUpgradeLevel(type);
  const cost = getUpgradeCost(type);
  if (!cost) return showToast(`${data.name} 已达到最高等级。`);
  if (!canAfford(cost)) return showToast(`资源不足：升级 ${data.name} 需要 ${formatCost(cost)}。`);
  Object.entries(cost).forEach(([resource, amount]) => { state.resources[resource] -= amount; });
  state.upgrades[type] = level + 1;
  state.upgradesBought += 1;
  consumeStrategyAction();
  addLog(`${data.name} 已升级至 LV.${String(level + 1).padStart(2, "0")}，${data.effect}。`, "amber");
  showToast(`${data.name} 升级完成`);
  renderAll();
}

function completeContract() {
  const contract = getCurrentContract();
  if (!contract) return showToast("所有生态委托已完成。");
  if (!isContractUnlocked(contract)) return showToast(contract.unlockText || "先完成委托前置条件。");
  const missing = getMissingResources(contract.requires);
  if (missing.length) return showToast(`资源不足：${formatResourceBundle(Object.fromEntries(missing))}。`);
  const rewardBlocker = getContractRewardBlocker(contract);
  if (rewardBlocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(rewardBlocker)}。`);
  consumeResourceBundle(contract.requires);
  grantResourceBundle(contract.rewards);
  state.contractIndex += 1;
  state.contractsCompleted += 1;
  state.reputation += contract.reputation;
  consumeStrategyAction();
  addLog(`生态委托完成：${contract.title}，获得 ${formatResourceBundle(contract.rewards)}。`, "green");
  showToast(`委托完成：声望 +${contract.reputation}`);
  renderAll();
}

function toggleAutomation() {
  if (!isAutomationUnlocked()) return showToast(`完成 ${contractData.length} 份生态委托后解锁机器队列。`);
  state.automationEnabled = !state.automationEnabled;
  addLog(`机器队列已${state.automationEnabled ? "启动" : "暂停"}，当前顺序：离心机 → 榨汁机 → 发酵机 → 蒸馏机。`, state.automationEnabled ? "green" : "amber");
  showToast(state.automationEnabled ? "自动化协议已启动" : "自动化协议已暂停");
  renderAll();
}

function selectAutomationReserve(value) {
  if (!isAutomationUnlocked()) return showToast(`完成 ${contractData.length} 份生态委托后才能配置机器队列。`);
  const parsed = Number(value);
  state.automationReserveEnergy = Number.isFinite(parsed) ? clamp(Math.floor(parsed), 0, 30) : 10;
  saveState();
  showToast(`机器队列将保留 ${state.automationReserveEnergy} 点探索能源`);
  renderAll();
}

function getGuideCompletionFlags() {
  return [
    state.explorations >= 1,
    state.apiaryCombCollected >= 1,
    state.analyzed.includes("forest") && state.analyzed.includes("meadows"),
    state.breedings > 0,
    state.machineCycles > 0,
    state.squeezerCycles > 0,
    state.treeCycles > 0,
    state.upgradesBought > 0,
    state.contractsCompleted > 0,
    state.fermenterCycles > 0,
    state.distillerCycles > 0
  ];
}

function getGuideStep() {
  const nextStep = getGuideCompletionFlags().findIndex((done) => !done);
  return nextStep === -1 ? guideSteps.length : nextStep;
}

function getMissionPanelData() {
  const stepIndex = getGuideStep();
  if (stepIndex >= guideSteps.length) return { label: "FIELD ARCHIVE", stamp: "OPEN", title: "生态工坊已建立", detail: "基础引导已经完成，可以继续追求稀有物种、树脂产出和三级设施。", action: "codex", actionLabel: "查看图鉴", target: "#codex-grid" };
  if (stepIndex === 0 && state.apiaryReady > 0) return { label: "NOW · APIARY", stamp: "READY", title: "先收取现有蜂巢", detail: `蜂箱已提前完成一轮，本次可收取 ${state.apiaryReady} 个；处理后再去森林边缘调查，补充后续花源和材料。`, action: "apiary", actionLabel: "收取蜂巢", target: "#collect-button" };
  if (stepIndex === 0) return { label: "NOW · FIELD", stamp: "NOW", title: "完成第一次调查", detail: "先去森林边缘补充蜂巢、木材和花源，启动整个生态循环。", action: "explore", actionLabel: "去寻找蜂巢", target: '.explore-button[data-zone="forest"]' };
  if (stepIndex === 1) return { label: "NOW · APIARY", stamp: "NOW", title: "收取第一份蜂巢", detail: "蜂箱已进入生产循环；等待 READY 后收取，再把蜂巢送入离心机。", action: "apiary", actionLabel: "查看蜂箱", target: state.apiaryReady > 0 ? "#collect-button" : "#apiary-countdown" };
  if (stepIndex <= 3) return { label: "CYCLE · BREEDING", stamp: "CYCLE", title: "完成第一次杂交", detail: stepIndex === 2 ? "分析森林蜂和草原蜂的属性，确认第一条稳定培育路径。" : "两个亲本已经分析完成，启动森林蜂 × 草原蜂杂交。", action: "apiary", actionLabel: stepIndex === 2 ? "分析亲本" : "进行杂交", target: getGuideTarget(stepIndex, ".analyze-button:not(.done)") };
  if (stepIndex === 4) return { label: "CYCLE · PROCESS", stamp: "CYCLE", title: "建立第一条生产线", detail: "把收取的蜂巢投入离心机，获得蜂蜜和蜂蜡，完成第一条加工链。", action: "machines", actionLabel: "启动离心机", target: "#machine-button" };
  if (stepIndex === 5) return { label: "CYCLE · EXTRACT", stamp: "CYCLE", title: "连接第二条生产线", detail: "离心机完成后启动榨汁机，种子油将成为树场和设施升级的输入。", action: "machines", actionLabel: "打开榨汁机", target: "#squeezer-button" };
  if (stepIndex === 6) return { label: "CYCLE · ARBOR", stamp: "CYCLE", title: "培育第一棵进阶树", detail: "分析橡树与白桦，培育落叶松，并观察木材和树脂属性。", action: "arbor", actionLabel: "打开树木台", target: ".tree-analyze-button:not(.done)" };
  if (stepIndex === 7) return { label: "LONG · RESEARCH", stamp: "LONG", title: "完成第一次设施升级", detail: "把短周期产物投入研究台，优先升级当前最常等待的设施或最先触顶的仓库分区。", action: "research", actionLabel: "打开研究台", target: ".upgrade-grid" };
  if (stepIndex === 8) return { label: "LONG · CONTRACT", stamp: "LONG", title: "完成第一份生态委托", detail: "交付当前委托，换取补给和声望，同时开放生物质生产线。", action: "overview", actionLabel: "查看生态委托", target: "#contract-button" };
  if (stepIndex <= 10) return { label: "LONG · ENERGY", stamp: "LONG", title: stepIndex === 9 ? "建立生物质生产线" : "蒸馏第一桶生物燃料", detail: stepIndex === 9 ? "拥有 3 个蜂种并完成委托后启动发酵机，继续扩展植物能源链。" : "发酵完成后启动蒸馏机，把生物质转成长期扩张资源。", action: "machines", actionLabel: stepIndex === 9 ? "打开发酵机" : "打开蒸馏机", target: getGuideTarget(stepIndex, stepIndex === 9 ? "#fermenter-button" : "#distiller-button") };
  return { label: "FIELD ARCHIVE", stamp: "OPEN", title: "生态工坊已建立", detail: "基础引导已经完成，可以继续扩展生态网络。", action: "overview", actionLabel: "回到总览", target: "#ecology-network" };
}

function isZoneUnlocked(zone) {
  if (zone === "forest") return true;
  if (zone === "plains") return getZoneVisits("forest") >= 1;
  if (zone === "swamp") return state.explorations >= 3 && state.machineCycles >= 1;
  if (zone === "desert") return (state.squeezerCycles >= 1 || state.resources.oil > 0) && state.treeHarvests >= 1;
  if (zone === "tropic") return getZoneProgress("swamp").manualRuns >= 1 && state.treeDiscovered.includes("jungle");
  if (zone === "snow") return state.treeDiscovered.includes("larch") && getUpgradeLevel("apiary") >= 2;
  if (zone === "cave") return state.butterflyAnalyzed.length >= 3 && Object.values(state.flowerInventory).filter((amount) => amount > 0).length >= 3;
  if (zone === "end") return getUpgradeLevel("apiary") >= 3 && knownDiscoveredBees().length >= 8 && (state.distillerCycles >= 1 || state.resources.biofuel > 0);
  return false;
}

function getZoneProgress(zone) {
  if (!state.zoneProgress?.[zone]) state.zoneProgress[zone] = { ...defaultState.zoneProgress[zone] };
  return state.zoneProgress[zone];
}

function getZoneVisits(zone) {
  return Number(state.explorationCounts?.[zone]) || 0;
}

function getZoneDiscoveryProgress(zone) {
  const config = zones[zone];
  if (!config) return 0;
  const progress = getZoneProgress(zone);
  return clamp(config.discoveryBase + getZoneVisits(zone) * config.discoveryStep + Math.floor(progress.rareProgress / 5), 0, 100);
}

function getGuideCompletionPercent() {
  return Math.round((getGuideStep() / guideSteps.length) * 100);
}

function getGuidePresentation() {
  const stepIndex = getGuideStep();
  if (stepIndex >= guideSteps.length) {
    return {
      stepIndex,
      complete: true,
      temporary: false,
      item: { title: "基础引导完成", text: "你已经掌握探索、养蜂、树木、分析、杂交、四条加工生产线、委托和升级，可以开始自由扩建生态工坊。", action: "overview", actionLabel: "回到总览" }
    };
  }
  if (stepIndex === 0 && state.apiaryReady > 0) {
    return {
      stepIndex,
      complete: false,
      temporary: true,
      item: { title: "先处理现有蜂巢", text: `蜂箱已经完成一轮生产，先收取 ${state.apiaryReady} 个蜂巢，再去森林边缘完成第一次调查。`, action: "apiary", actionLabel: "收取蜂巢", target: "#collect-button" }
    };
  }
  return { stepIndex, complete: false, temporary: false, item: guideSteps[stepIndex] };
}

function getTimedProgress(active, duration) {
  const remaining = Math.max(0, Number(active?.remaining) || 0);
  const total = Math.max(1, Number(duration) || remaining || 1);
  return clamp((1 - remaining / total) * 100, 0, 100);
}

function getLongMilestones() {
  return [
    { title: "区域档案", detail: "完成 4 次区域调查", value: Math.min(4, state.explorations), target: 4 },
    { title: "育种档案", detail: "完成 3 次成功培育", value: Math.min(3, state.breedings + state.treeCycles), target: 3 },
    { title: "工坊档案", detail: "完成 3 次设施升级", value: Math.min(3, state.upgradesBought), target: 3 }
  ];
}

function getCompletedLongMilestones() {
  return getLongMilestones().filter((milestone) => milestone.value >= milestone.target).length;
}

function renderResources() {
  const resourceSelectors = { honey: "#honey-value", wax: "#wax-value", wood: "#wood-value", oil: "#oil-value", resin: "#resin-value", biomass: "#biomass-value", biofuel: "#biofuel-value" };
  Object.entries(resourceSelectors).forEach(([resource, selector]) => {
    const amount = getWarehouseLoad(resource);
    const capacity = getWarehouseCapacity(resource);
    setText(selector, `${amount} / ${capacity}`);
    const value = $(selector);
    const chip = value?.closest(".resource-chip");
    if (chip) {
      chip.title = `${resourceNames[resource]}分区：${amount} / ${capacity}`;
      chip.classList.toggle("resource-full", getWarehouseSpace(resource) <= 0);
    }
  });
  setText("#energy-value", Math.floor(state.resources.energy));
  setText("#flower-label", "花源");
  setText("#flower-value", getFlowerCount());
  setText("#comb-value", state.apiaryReady);
  setText("#machine-input", `${state.rawComb} / ${getWarehouseCapacity("rawComb")}`);
  setText("#machine-output", state.machineOutput);
  setText("#squeezer-input", state.resources.wood);
  setText("#squeezer-output", state.squeezerOutput);
  setText("#overview-comb-count", state.rawComb);
  setText("#comb-goal", `${Math.min(1, state.apiaryCombCollected)} / 1`);
  const coreBeeAnalysisCount = ["forest", "meadows"].filter((id) => state.analyzed.includes(id)).length;
  setText("#analysis-goal", `${coreBeeAnalysisCount} / 2`);
  setText("#breed-goal", state.breedings > 0 ? "1 / 1" : "0 / 1");
  const missionState = [
    ["#mission-comb", "#comb-check", state.apiaryCombCollected >= 1],
    ["#mission-analysis", "#analysis-check", coreBeeAnalysisCount >= 2],
    ["#mission-breed", "#breed-check", state.breedings > 0]
  ];
  missionState.forEach(([rowSelector, checkSelector, done]) => {
    $(rowSelector).classList.toggle("done", done);
    $(checkSelector).textContent = done ? "✓" : "";
  });
  const speciesCount = knownDiscoveredBees().length;
  setText("#species-count", `${String(speciesCount).padStart(2, "0")} / ${Object.keys(species).length} SPECIES`);
  const treeCount = knownDiscoveredTrees().length;
  const butterflyCount = knownDiscoveredButterflies().length;
  setText("#codex-count", `BEE ${String(speciesCount).padStart(2, "0")} / ${String(Object.keys(species).length).padStart(2, "0")} · BUTTERFLY ${String(butterflyCount).padStart(2, "0")} / ${String(Object.keys(butterflySpecies).length).padStart(2, "0")} · TREE ${String(treeCount).padStart(2, "0")} / ${String(Object.keys(treeSpecies).length).padStart(2, "0")}`);
  const goalProgress = getGuideCompletionPercent();
  $("#goal-progress").style.width = `${goalProgress}%`;
  const guidePresentation = getGuidePresentation();
  setText("#goal-title", guidePresentation.complete ? "自由扩展生态工坊" : guidePresentation.item.title);
  setText("#goal-detail", guidePresentation.complete ? "引导完成 · 可以自由扩展生态工坊" : guidePresentation.item.text);
  renderMissionPanel();
}

function renderMissionPanel() {
  const mission = getMissionPanelData();
  const guideStep = getGuideStep();
  const guideComplete = guideStep >= guideSteps.length;
  setText("#mission-label", mission.label);
  setText("#mission-stamp", mission.stamp);
  setText("#mission-title", mission.title);
  setText("#mission-detail", mission.detail);
  const currentRow = $("#mission-current-row");
  if (currentRow) {
    currentRow.classList.toggle("done", guideComplete);
    setText("#current-check", guideComplete ? "✓" : "→");
    setText("#mission-current-label", guideComplete ? "基础引导完成" : mission.title);
    setText("#mission-current-goal", guideComplete ? `${guideSteps.length} / ${guideSteps.length}` : `STEP ${String(guideStep + 1).padStart(2, "0")} / ${String(guideSteps.length).padStart(2, "0")}`);
  }
  const action = $("#mission-action");
  if (!action) return;
  action.dataset.jump = mission.action;
  action.dataset.target = mission.target || "";
  action.innerHTML = `${mission.actionLabel} <span>→</span>`;
}

function renderParentSlot(slot, id) {
  const item = species[id];
  if (!item) return;
  const select = $(`#${slot}-select`);
  if (select) {
    select.innerHTML = knownDiscoveredBees().map((beeId) => `<option value="${beeId}">${species[beeId].name}</option>`).join("");
    select.value = id;
    select.disabled = Boolean(state.breeding);
  }
  const slotElement = $(`#${slot}-slot`);
  if (slotElement) slotElement.dataset.parent = id;
  const icon = $(`#${slot}-icon`);
  if (icon) {
    icon.className = `bee-glyph species-bee-${item.color}`;
    icon.innerHTML = beeSpriteMarkup(id);
  }
  setText(`#${slot}-name`, item.name);
  setText(`#${slot}-detail`, item.type);
  const analyzeButton = $(`#${slot}-analyze`);
  if (analyzeButton) analyzeButton.dataset.analyze = id;
}

function renderFlowerControl() {
  const activeId = getActiveFlowerId();
  const source = flowerSources[activeId];
  const count = getFlowerCount(activeId);
  const select = $("#flower-select");
  if (select) {
    select.innerHTML = Object.entries(flowerSources).map(([id, item]) => `<option value="${id}" ${getFlowerCount(id) === 0 ? "disabled" : ""}>${item.icon} ${item.name} · 库存 ${getFlowerCount(id)}</option>`).join("");
    select.value = activeId;
  }
  setText("#flower-source-effect", `${source.label} · ${count > 0 ? `库存 ${count}` : "需要补充"}`);
  updateStatusPill("#flower-source-status", count > 0 ? "花源可用" : "缺少花源", count > 0 ? "online" : "waiting");
}

function selectFlowerSource(id) {
  if (!flowerSources[id]) return;
  if (getFlowerCount(id) <= 0) return showToast(`${flowerSources[id].name}库存为 0，先去${zones[flowerSources[id].zone].name}探索。`);
  state.activeFlower = id;
  saveState();
  renderAll();
}

function renderHabitatControl() {
  let activeId = getActiveHabitatId();
  if (!isZoneUnlocked(activeId)) {
    activeId = "forest";
    state.activeHabitat = activeId;
  }
  const zone = zones[activeId];
  const suitability = getHabitatSuitability();
  const select = $("#habitat-select");
  if (select) {
    select.innerHTML = Object.entries(zones).filter(([id]) => isZoneUnlocked(id)).map(([id, item]) => `<option value="${id}">${item.name} · ${item.temperature}</option>`).join("");
    select.value = activeId;
  }
  const environment = getActiveEnvironment();
  setText("#habitat-effect", `温度 ${Math.round(environment.temperature)} · 湿度 ${Math.round(environment.humidity)} · 光照 ${Math.round(environment.light)} · 适配 ${Math.round(suitability * 100)}%`);
  updateStatusPill("#habitat-status", suitability >= .85 ? "环境适配" : "环境偏离", suitability >= .85 ? "online" : "waiting");
}

function selectHabitat(id) {
  if (!zones[id]) return;
  if (!isZoneUnlocked(id)) return showToast("这个环境还没有开放，先完成对应探索或加工目标。");
  state.activeHabitat = id;
  saveState();
  renderAll();
}

function renderApiary() {
  const progress = Math.round(state.apiaryProgress);
  renderHabitatControl();
  const apiaryRate = getApiaryEffectiveRate();
  const activeFlower = flowerSources[getActiveFlowerId()];
  const flowerCount = getFlowerCount();
  const beeSpeed = Math.round(getCurrentBeeTrait("speed"));
  const apiaryYield = getApiaryYieldPerCycle();
  const habitatZone = zones[getActiveHabitatId()];
  const habitatSuitability = getHabitatSuitability();
  const apiaryBlocked = state.apiaryReady === 0 && flowerCount === 0;
  const parentIds = state.breeding ? [state.breeding.princess, state.breeding.drone] : [getParentId("princess", "forest"), getParentId("drone", "meadows")];
  state.breedingParents.princess = parentIds[0];
  state.breedingParents.drone = parentIds[1];
  if (state.breeding) {
    state.breedingParents.princess = state.breeding.princess;
    state.breedingParents.drone = state.breeding.drone;
  }
  setText("#breeding-slot-hint", state.breeding ? "实验进行中 · 亲本槽位已锁定" : "放入两种蜂群开始杂交");
  renderParentSlot("princess", parentIds[0]);
  renderParentSlot("drone", parentIds[1]);
  renderFlowerControl();
  const recipe = getBreedingRecipe(parentIds[0], parentIds[1]);
  const analyzedParents = parentIds.filter((id) => state.analyzed.includes(id));
  const beeTraits = combineTraits(analyzedParents, species, ["speed", "lifespan", "fertility"]);
  const parentsAnalyzed = analyzedParents.length === parentIds.length;
  const levelReady = recipe && getUpgradeLevel("apiary") >= recipe.requiresApiary;
  $("#apiary-progress").style.width = `${progress}%`;
  $("#overview-apiary-progress").style.width = `${progress}%`;
  setText("#apiary-progress-label", `${progress}%`);
  setText("#apiary-efficiency", `+${Math.round((apiaryRate / .8 - 1) * 100)}%`);
  const mutationFailures = getBreedingFailureCount("bee", parentIds[0], parentIds[1]);
  const mutationChance = getMutationChance(recipe, "bee", parentIds[0], parentIds[1]);
  setText("#mutation-chance", !recipe ? "组合未记录" : !parentsAnalyzed ? `待分析 ${parentIds.length - analyzedParents.length} 个亲本` : !levelReady ? `需要养蜂箱 LV.${recipe.requiresApiary}` : `突变概率 ${mutationChance}%`);
  setText("#breeding-path", recipe ? `${recipe.label} · 目标：${species[recipe.result].name} · ${getMutationBreakdownText(recipe, "bee", parentIds[0], parentIds[1])}` : "选择其他亲本，查看已知突变路径。");
  renderTraitBar("#bee-trait-speed", "#bee-speed-value", beeTraits.speed, ["慢", "中", "快"]);
  renderTraitBar("#bee-trait-lifespan", "#bee-lifespan-value", beeTraits.lifespan, ["短", "中", "长"]);
  renderTraitBar("#bee-trait-fertility", "#bee-fertility-value", beeTraits.fertility, ["低", "中", "高"]);
  setText("#overview-apiary-time", state.apiaryReady > 0 ? "可收取" : apiaryBlocked ? "补充花源" : `${Math.max(1, Math.ceil((100 - state.apiaryProgress) / apiaryRate))}s`);
  setText("#apiary-countdown", state.apiaryReady > 0 ? "READY" : apiaryBlocked ? "SUPPLY" : `${Math.max(1, Math.ceil((100 - state.apiaryProgress) / apiaryRate))}s`);
  setText("#apiary-status-text", state.breeding ? `杂交中 · ${species[state.breeding.result]?.name || "未知后代"} · 剩余 ${state.breeding.remaining}s` : state.apiaryReady > 0 ? `蜂箱中有 ${state.apiaryReady} 个蜂巢等待收取` : apiaryBlocked ? `缺少${activeFlower.name} · 请探索补充` : `使用${activeFlower.name} · ${habitatZone.name} · 基因速度 ${beeSpeed} · 预计 ${apiaryYield} 蜂巢`);
  const apiaryLabel = state.apiaryReady > 0 ? "可收取" : apiaryBlocked ? "缺花源" : "运行中";
  const apiaryMode = state.apiaryReady > 0 ? "ready" : apiaryBlocked ? "waiting" : "online";
  updateStatusPill("#overview-apiary-status", apiaryLabel, apiaryMode);
  updateStatusPill("#apiary-view-status", apiaryLabel, apiaryMode);
  const apiaryCard = $("#overview-apiary-card");
  if (apiaryCard) {
    apiaryCard.dataset.target = state.apiaryReady > 0 ? "#collect-button" : apiaryBlocked ? "#flower-select" : "#apiary-countdown";
    apiaryCard.setAttribute("aria-label", `打开蜂箱 A-01 · ${apiaryLabel}`);
  }
  const flowerBonus = Math.round(activeFlower.speedBonus * 100);
  const ecologyScore = getEcologyBreakdown().score;
  setText("#overview-ecology-effect", `${activeFlower.name} · ${habitatZone.name} · 生态 ${ecologyScore} · 授粉 +${Math.round(getPollinationBonus() * 100)}%`);
  updateStatusPill("#overview-ecology-status", flowerCount === 0 ? "缺花源" : ecologyScore < 40 ? "失衡" : ecologyScore < 65 ? "承压" : ecologyScore >= 85 ? "繁盛" : "稳定", flowerCount === 0 || ecologyScore < 65 ? "waiting" : "online");
  const ecologyCard = $("#overview-ecology-card");
  if (ecologyCard) {
    ecologyCard.dataset.target = flowerCount === 0 ? "#flower-select" : "#habitat-select";
    ecologyCard.setAttribute("aria-label", `打开林地生态设置 · ${flowerCount === 0 ? "补充花源" : habitatSuitability < .7 ? "调整环境" : "查看授粉状态"}`);
  }
  const ecologyProgress = $("#overview-ecology-progress");
  if (ecologyProgress) ecologyProgress.style.width = `${ecologyScore}%`;
  setText("#hero-focus-detail", state.apiaryReady > 0 ? `蜂巢已经准备好，先收取再送入离心机；本轮可收取 ${state.apiaryReady} 个。` : apiaryBlocked ? `当前${activeFlower.name}库存为 0，先补充花源才能继续生产。` : state.breeding ? "杂交实验进行中，先让蜂群完成当前生产循环。" : `${activeFlower.name}可用，${habitatZone.name}适配良好，预计每轮 ${apiaryYield} 个蜂巢。`);
  setText("#hero-apiary-status", state.apiaryReady > 0 ? "READY" : `${progress}%`);
  setText("#hero-flower-status", flowerCount > 0 ? activeFlower.name : "缺花源");
  const heroFlowerStatus = $("#hero-flower-status");
  if (heroFlowerStatus) heroFlowerStatus.classList.toggle("positive", flowerCount > 0);
  setText("#hero-ecology-score", `${ecologyScore}`);
  setText("#apiary-flower-output", flowerCount > 0 ? `${activeFlower.name} ×${flowerCount}` : "需要补充");
  const flowerOutput = $("#apiary-flower-output");
  if (flowerOutput) flowerOutput.classList.toggle("positive", flowerCount > 0);
  $("#collect-button").disabled = state.apiaryReady === 0;
  $("#collect-button").style.opacity = state.apiaryReady === 0 ? ".55" : "1";
  $("#overview-comb-count").textContent = state.rawComb;
  const breedButton = $("#breed-button");
  const canBreed = Boolean(recipe && parentsAnalyzed && levelReady && !state.breeding);
  breedButton.disabled = !canBreed;
  breedButton.style.opacity = canBreed ? "1" : ".55";
  const breedLabel = state.breeding ? `杂交中 · ${state.breeding.remaining}s` : !recipe ? "组合未记录" : !parentsAnalyzed ? "先分析亲本" : !levelReady ? `需要养蜂箱 LV.${recipe.requiresApiary}` : "开始杂交 <span>→</span>";
  breedButton.innerHTML = breedLabel;
  $$(".analyze-button").forEach((button) => {
    const done = state.analyzed.includes(button.dataset.analyze);
    button.classList.toggle("done", done);
    button.textContent = done ? "已分析" : "分析亲本";
  });
}

function renderMachine() {
  const progress = Math.round(state.machineProgress);
  const machineRate = 100 / getMachineDuration();
  const recipeLedger = getCurrentRecipeLedger();
  $("#machine-progress").style.width = `${progress}%`;
  setText("#overview-machine-progress", "");
  $("#overview-machine-progress").style.width = `${progress}%`;
  setText("#machine-progress-label", state.machineActive ? "正在分离蜂巢" : (state.machineOutput > 0 ? "产物可收取" : "等待输入"));
  setText("#machine-time", state.machineActive ? `${Math.max(1, Math.ceil((100 - state.machineProgress) / machineRate))}s` : "--");
  setText("#processed-output", `H ${state.processedHoney} · W ${state.processedWax}`);
  setText("#recipe-title", recipeLedger.title);
  setText("#recipe-input", recipeLedger.input);
  setText("#recipe-output", recipeLedger.output);
  setText("#recipe-duration", `${recipeLedger.duration.toFixed(1).replace(".0", "")} 秒`);
  setText("#recipe-energy", recipeLedger.energy);
  const machineHasInput = state.rawComb > 0;
  const machineLabel = state.machineActive ? "运行中" : state.machineOutput > 0 ? "可收取" : machineHasInput ? "待命" : "输入不足";
  const machineMode = state.machineActive ? "online" : state.machineOutput > 0 ? "ready" : machineHasInput ? "waiting" : "blocked";
  updateStatusPill("#machine-status", machineLabel, machineMode);
  updateStatusPill("#overview-machine-status", machineLabel, machineMode);
  const machineCard = $("#overview-machine-card");
  if (machineCard) machineCard.setAttribute("aria-label", `打开离心机 C-01 · ${machineLabel}`);
  $("#machine-button").textContent = state.machineActive ? "加工中 · 等待" : state.machineOutput > 0 ? "收取产物  ＋" : machineHasInput ? "启动加工  →" : "蜂巢不足";
  $("#machine-button").disabled = state.machineActive || (state.rawComb === 0 && state.machineOutput === 0);
  $("#machine-button").style.opacity = $("#machine-button").disabled ? ".55" : "1";
  renderSqueezer();
  renderFermenter();
  renderDistiller();
}

function renderSqueezer() {
  const unlocked = isSqueezerUnlocked();
  const lockedPanel = $("#squeezer-locked-panel");
  const flow = $("#squeezer-flow");
  const progressPanel = $("#squeezer-machine-progress");
  const button = $("#squeezer-button");
  if (!unlocked) {
    updateStatusPill("#squeezer-status", "锁定", "waiting");
    if (lockedPanel) lockedPanel.style.display = "grid";
    if (flow) flow.style.display = "none";
    if (progressPanel) progressPanel.style.display = "none";
    if (button) {
      button.disabled = true;
      button.textContent = "完成离心加工后解锁";
      button.style.opacity = ".55";
    }
    return;
  }
  if (lockedPanel) lockedPanel.style.display = "none";
  if (flow) flow.style.display = "grid";
  if (progressPanel) progressPanel.style.display = "block";
  const progress = state.squeezerOutput > 0 ? 100 : Math.round(state.squeezerProgress);
  const squeezerRate = 100 / getSqueezerDuration();
  const active = state.squeezerActive;
  const ready = state.squeezerOutput > 0;
  const lacksWood = state.resources.wood < 2;
  const lacksEnergy = state.resources.energy < 2;
  const canStart = !lacksWood && !lacksEnergy;
  const idleLabel = lacksWood && lacksEnergy ? "需要木材与能源" : lacksWood ? "木材不足" : lacksEnergy ? "能源不足" : "等待木材";
  setText("#squeezer-input", state.resources.wood);
  setText("#squeezer-output", state.squeezerOutput);
  setText("#squeezer-progress-label", active ? "正在榨取木材" : ready ? "产物可收取" : idleLabel);
  setText("#squeezer-time", active ? `${Math.max(1, Math.ceil((100 - state.squeezerProgress) / squeezerRate))}s` : "--");
  const status = active ? "运行中" : ready ? "可收取" : !canStart ? "输入不足" : "待命";
  const mode = active ? "online" : ready ? "ready" : !canStart ? "blocked" : "waiting";
  updateStatusPill("#squeezer-status", status, mode);
  const progressBar = $("#squeezer-progress");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (button) {
    button.disabled = active || (!canStart && !ready);
    button.textContent = active ? "榨取中 · 等待" : ready ? "收取种子油  ＋" : lacksWood ? "木材不足" : lacksEnergy ? "能源不足" : "启动榨取  →";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function renderFermenter() {
  const unlocked = isFermenterUnlocked();
  const lockedPanel = $("#fermenter-locked-panel");
  const flow = $("#fermenter-flow");
  const progressPanel = $("#fermenter-machine-progress");
  const button = $("#fermenter-button");
  if (!unlocked) {
    const missingBees = Math.max(0, 3 - knownDiscoveredBees().length);
    const lockText = missingBees > 0 && state.contractsCompleted < 1 ? `还需发现 ${missingBees} 个蜂种并完成 1 份委托` : missingBees > 0 ? `还需发现 ${missingBees} 个蜂种` : "还需完成 1 份生态委托";
    updateStatusPill("#fermenter-status", "锁定", "waiting");
    if (lockedPanel) lockedPanel.style.display = "grid";
    const lockedText = lockedPanel?.querySelector("p");
    if (lockedText) lockedText.textContent = lockText;
    if (flow) flow.style.display = "none";
    if (progressPanel) progressPanel.style.display = "none";
    if (button) {
      button.disabled = true;
      button.textContent = lockText;
      button.style.opacity = ".55";
    }
    return;
  }
  if (lockedPanel) lockedPanel.style.display = "none";
  if (flow) flow.style.display = "grid";
  if (progressPanel) progressPanel.style.display = "block";
  const progress = state.fermenterOutput > 0 ? 100 : Math.round(state.fermenterProgress);
  const fermenterRate = 100 / getFermenterDuration();
  const active = state.fermenterActive;
  const ready = state.fermenterOutput > 0;
  const lacksWood = state.resources.wood < 3;
  const lacksEnergy = state.resources.energy < 3;
  const canStart = !lacksWood && !lacksEnergy;
  const idleLabel = lacksWood && lacksEnergy ? "需要木材与能源" : lacksWood ? "木材不足" : lacksEnergy ? "能源不足" : "等待木材";
  setText("#fermenter-input", state.resources.wood);
  setText("#fermenter-output", state.fermenterOutput);
  setText("#fermenter-progress-label", active ? "正在发酵植物原料" : ready ? "产物可收取" : idleLabel);
  setText("#fermenter-time", active ? `${Math.max(1, Math.ceil((100 - state.fermenterProgress) / fermenterRate))}s` : "--");
  updateStatusPill("#fermenter-status", active ? "运行中" : ready ? "可收取" : !canStart ? "输入不足" : "待命", active ? "online" : ready ? "ready" : !canStart ? "blocked" : "waiting");
  const progressBar = $("#fermenter-progress");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (button) {
    button.disabled = active || (!canStart && !ready);
    button.textContent = active ? "发酵中 · 等待" : ready ? "收取生物质  ＋" : lacksWood ? "木材不足" : lacksEnergy ? "能源不足" : "启动发酵  →";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function renderDistiller() {
  const unlocked = isDistillerUnlocked();
  const lockedPanel = $("#distiller-locked-panel");
  const flow = $("#distiller-flow");
  const progressPanel = $("#distiller-machine-progress");
  const button = $("#distiller-button");
  if (!unlocked) {
    updateStatusPill("#distiller-status", "锁定", "waiting");
    if (lockedPanel) lockedPanel.style.display = "grid";
    if (flow) flow.style.display = "none";
    if (progressPanel) progressPanel.style.display = "none";
    if (button) {
      button.disabled = true;
      button.textContent = "完成发酵加工后解锁";
      button.style.opacity = ".55";
    }
    return;
  }
  if (lockedPanel) lockedPanel.style.display = "none";
  if (flow) flow.style.display = "grid";
  if (progressPanel) progressPanel.style.display = "block";
  const progress = state.distillerOutput > 0 ? 100 : Math.round(state.distillerProgress);
  const distillerRate = 100 / getDistillerDuration();
  const active = state.distillerActive;
  const ready = state.distillerOutput > 0;
  const lacksBiomass = state.resources.biomass < 1;
  const lacksEnergy = state.resources.energy < 4;
  const canStart = !lacksBiomass && !lacksEnergy;
  const idleLabel = lacksBiomass && lacksEnergy ? "需要生物质与能源" : lacksBiomass ? "生物质不足" : lacksEnergy ? "能源不足" : "等待生物质";
  setText("#distiller-input", state.resources.biomass);
  setText("#distiller-output", state.distillerOutput);
  setText("#distiller-progress-label", active ? "正在蒸馏生物质" : ready ? "产物可收取" : idleLabel);
  setText("#distiller-time", active ? `${Math.max(1, Math.ceil((100 - state.distillerProgress) / distillerRate))}s` : "--");
  updateStatusPill("#distiller-status", active ? "运行中" : ready ? "可收取" : !canStart ? "输入不足" : "待命", active ? "online" : ready ? "ready" : !canStart ? "blocked" : "waiting");
  const progressBar = $("#distiller-progress");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (button) {
    button.disabled = active || (!canStart && !ready);
    button.textContent = active ? "蒸馏中 · 等待" : ready ? "收取生物燃料  ＋" : lacksBiomass ? "生物质不足" : lacksEnergy ? "能源不足" : "启动蒸馏  →";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function renderAutomation() {
  const card = $("#automation-card");
  const button = $("#automation-button");
  const reserveSelect = $("#automation-reserve");
  const unlocked = isAutomationUnlocked();
  const enabled = unlocked && state.automationEnabled;
  const blockedOutput = enabled ? getBlockedReadyOutput() : null;
  const energyBlocked = enabled && !blockedOutput ? getAutomationEnergyBlocker() : null;
  const reserve = getAutomationReserveEnergy();
  if (card) {
    card.classList.toggle("active", enabled && !blockedOutput && !energyBlocked);
    card.classList.toggle("blocked", !unlocked || Boolean(blockedOutput) || Boolean(energyBlocked));
  }
  if (reserveSelect) {
    reserveSelect.value = String(reserve);
    reserveSelect.disabled = !unlocked;
  }
  if (!unlocked) {
    updateStatusPill("#automation-status", "待解锁", "waiting");
    setText("#automation-title", "建立机器队列");
    setText("#automation-detail", `完成 ${contractData.length} 份生态委托后解锁，自动收取并串联四台机器。`);
    if (button) {
      button.disabled = true;
      button.textContent = "完成委托后解锁";
    }
    return;
  }
  updateStatusPill("#automation-status", blockedOutput ? "仓库阻塞" : energyBlocked ? "能源保留" : enabled ? "运行中" : "可部署", blockedOutput || energyBlocked ? "blocked" : enabled ? "online" : "ready");
  setText("#automation-title", enabled ? "机器队列已接管" : "部署机器队列");
  setText("#automation-detail", blockedOutput ? `${blockedOutput.name}已完成，但${formatWarehouseBlocker(blockedOutput)}；队列会等待该分区释放。` : energyBlocked ? `当前能源 ${Math.floor(state.resources.energy)}，队列保留 ${reserve} 点给探索；${energyBlocked.name}需要 ${energyBlocked.cost} 点后才能启动。` : enabled ? `队列按离心机 → 榨汁机 → 发酵机 → 蒸馏机顺序收取产物并启动下一批，始终保留 ${reserve} 点探索能源。` : `开启后自动收取对应分区有空间的产物，并按固定顺序消耗超过 ${reserve} 点保留线的能源。短周期资源仍可手动调整。`);
  if (button) {
    button.disabled = false;
    button.textContent = enabled ? "暂停自动化" : "启动自动化  →";
  }
}

function renderLogs() {
  const list = $("#log-list");
  list.innerHTML = state.logs.map((item) => `<div class="log-entry"><time>${item.time}</time><i style="background:${item.kind === "green" ? "var(--green)" : item.kind === "teal" ? "var(--teal)" : "var(--amber)"}"></i><span>${item.text}</span></div>`).join("");
  setText("#log-count", `${String(state.logs.length).padStart(2, "0")} EVENTS`);
}

function renderSpecies() {
  const row = $("#species-row");
  row.innerHTML = knownDiscoveredBees().map((id) => {
    const item = species[id];
    return `<article class="species-card archive-species-card bee-species-card"><span class="species-icon archive-species-icon bee-species-icon ${item.color}">${beeSpriteMarkup(id)}</span><div class="archive-species-copy"><span>${item.type}</span><strong>${item.name}</strong><small>${item.english.toUpperCase()}</small></div></article>`;
  }).join("");
}

function beeSpriteMarkup(id) {
  const spriteClass = { forest: "bee-forest", meadows: "bee-meadow", cultivated: "bee-cultivated", common: "bee-common", noble: "bee-noble", tropical: "bee-tropical", majestic: "bee-majestic", diligent: "bee-diligent", unweary: "bee-unweary", industrious: "bee-industrious", imperial: "bee-imperial" }[id] || "bee-common";
  return `<span class="pixel-sprite pixel-bee ${spriteClass}" aria-hidden="true"><i class="bee-crown"></i><i class="bee-wing wing-left"></i><i class="bee-wing wing-right"></i><i class="bee-body"></i><i class="bee-tail"></i></span>`;
}

function butterflySpriteMarkup(id) {
  const spriteClass = { azure: "butterfly-azure", brimstone: "butterfly-brimstone", swallow: "butterfly-swallow", atlas: "butterfly-atlas", morpho: "butterfly-morpho", monarch: "butterfly-monarch" }[id] || "butterfly-azure";
  return `<span class="pixel-sprite pixel-butterfly ${spriteClass}" aria-hidden="true"><i class="butterfly-wing wing-left"></i><i class="butterfly-wing wing-right"></i><i class="butterfly-body"></i><i class="butterfly-antenna antenna-left"></i><i class="butterfly-antenna antenna-right"></i></span>`;
}

function treeSpriteMarkup(id) {
  const spriteClass = treeSpecies[id] ? `tree-${id}` : "tree-oak";
  return `<span class="pixel-sprite pixel-tree ${spriteClass}" aria-hidden="true"><i class="tree-shadow"></i><i class="tree-trunk"></i><i class="tree-crown crown-left"></i><i class="tree-crown crown-center"></i><i class="tree-crown crown-right"></i><i class="tree-accent"></i></span>`;
}

function getBeeLineage(id) {
  const recipeEntry = Object.entries(breedingRecipes).find(([, recipe]) => !recipe.stable && recipe.result === id);
  if (recipeEntry) {
    const parents = recipeEntry[0].split("|").map((parentId) => species[parentId]?.name || parentId);
    return `育种路径 · ${parents.join(" × ")}${recipeEntry[1].tier ? ` · ${recipeEntry[1].tier}级` : ""}`;
  }
  const origins = { forest: "森林边缘", meadows: "平原花地", common: "静谧沼泽", tropical: "热带林冠" };
  return `发现区域 · ${origins[id] || "生态调查"}`;
}

function getTreeLineage(id) {
  const recipeEntry = Object.entries(treeBreedingRecipes).find(([, recipe]) => !recipe.stable && recipe.result === id);
  if (recipeEntry) {
    const treeOrder = ["oak", "birch", "jungle", "larch", "teak", "cherry", "walnut", "chestnut", "pine", "sequoia"];
    const parents = recipeEntry[0].split("|").sort((a, b) => treeOrder.indexOf(a) - treeOrder.indexOf(b)).map((parentId) => treeSpecies[parentId]?.name || parentId);
    return `培育路径 · ${parents.join(" × ")}${recipeEntry[1].tier ? ` · ${recipeEntry[1].tier}级` : ""}`;
  }
  const origins = { oak: "森林边缘", birch: "森林边缘", jungle: "静谧沼泽", teak: "热带林冠" };
  return `发现区域 · ${origins[id] || "生态调查"}`;
}

function getButterflyLineage(id) {
  const recipeEntry = Object.entries(butterflyBreedingRecipes).find(([, recipe]) => recipe.result === id);
  if (recipeEntry) {
    const parents = recipeEntry[0].split("|").map((parentId) => butterflySpecies[parentId]?.name || parentId);
    return `杂交路径 · ${parents.join(" × ")}${recipeEntry[1].tier ? ` · ${recipeEntry[1].tier}级` : ""}`;
  }
  return `发现区域 · ${butterflySpecies[id]?.zone ? zones[butterflySpecies[id].zone].name : "生态调查"}`;
}

function getCodexUnlockText(id, kind) {
  if (kind === "bee") {
    return { cultivated: "完成森林蜂 × 草原蜂杂交", common: "森林蜂 × 热带蜂的二级路径", noble: "普通蜂 × 培育蜂的二级路径", majestic: "培育蜂 × 贵族蜂的二级路径", diligent: "草原蜂 × 普通蜂的二级路径", unweary: "培育蜂 × 勤劳蜂的二级路径", industrious: "完成勤劳蜂 × 不倦蜂三级路径", imperial: "完成贵族蜂 × 尊贵蜂三级路径", tropical: "调查热带林冠" }[id] || "继续探索和杂交";
  }
  if (kind === "butterfly") {
    const recipeEntry = Object.entries(butterflyBreedingRecipes).find(([, recipe]) => recipe.result === id);
    if (recipeEntry) return `观察亲本后进行${recipeEntry[1].tier || 2}级蝶种杂交`;
    return butterflySpecies[id] ? `调查${zones[butterflySpecies[id].zone].name}` : "继续探索生态区域";
  }
  return { larch: "完成橡树 × 白桦培育", jungle: "调查静谧沼泽", teak: "完成落叶松 × 丛林树二级路径", cherry: "完成橡树 × 丛林树二级路径", walnut: "完成白桦 × 丛林树二级路径", chestnut: "完成樱桃树 × 核桃树三级路径", pine: "完成落叶松 × 核桃树二级路径", sequoia: "完成松树 × 柚木三级路径" }[id] || "继续探索和培育";
}

function renderTreeParentSlot(slot, id) {
  const item = treeSpecies[id];
  if (!item) return;
  const prefix = slot === "parentA" ? "tree-parent-a" : "tree-parent-b";
  const select = $(`#${prefix}-select`);
  if (select) {
    select.innerHTML = knownDiscoveredTrees().map((treeId) => `<option value="${treeId}">${treeSpecies[treeId].name}</option>`).join("");
    select.value = id;
    select.disabled = Boolean(state.treeBreeding);
  }
  const slotElement = $(`#${prefix}-slot`);
  if (slotElement) slotElement.dataset.treeParent = id;
  const icon = $(`#${prefix}-icon`);
  if (icon) {
    icon.className = `tree-glyph tree-species-${item.color}`;
    icon.innerHTML = treeSpriteMarkup(id);
  }
  setText(`#${prefix}-name`, item.name);
  setText(`#${prefix}-detail`, `${item.type} · 库存 ${getTreeSaplingCount(id)}`);
  const analyzeButton = $(`#${prefix}-analyze`);
  if (analyzeButton) analyzeButton.dataset.treeAnalyze = id;
}

function renderTree() {
  const progress = Math.round(state.treeProgress);
  const treeRate = getTreeRate();
  const pollinationBonus = getPollinationBonus();
  const pollinationFertility = Math.round(getCurrentBeeTrait("fertility"));
  const activeFlower = flowerSources[getActiveFlowerId()];
  const treeYieldAmount = getTreeYieldAmount();
  const treeResinAmount = state.treeReady > 0 ? Math.max(0, Number(state.treeReadyResin) || 0) : 0;
  const treeYieldLocked = state.treeReady > 0;
  const treeParents = state.treeBreeding ? [state.treeBreeding.parentA, state.treeBreeding.parentB] : [getTreeParentId("parentA", "oak"), getTreeParentId("parentB", "birch")];
  state.treeBreedingParents.parentA = treeParents[0];
  state.treeBreedingParents.parentB = treeParents[1];
  if (state.treeBreeding) {
    state.treeBreedingParents.parentA = state.treeBreeding.parentA;
    state.treeBreedingParents.parentB = state.treeBreeding.parentB;
  }
  const displayTreeId = treeParents[0] || "oak";
  const displayTree = treeSpecies[displayTreeId] || treeSpecies.oak;
  const farmIcon = $("#tree-farm-icon");
  if (farmIcon) {
    farmIcon.className = `tree-farm-visual tree-species-${displayTree.color}`;
    farmIcon.innerHTML = treeSpriteMarkup(displayTreeId);
  }
  const overviewTreeIcon = $("#overview-tree-icon");
  if (overviewTreeIcon) overviewTreeIcon.innerHTML = treeSpriteMarkup(displayTreeId);
  setText("#tree-slot-hint", state.treeBreeding ? "培育进行中 · 亲本槽位已锁定" : "分析两种树苗，培育新的木材属性");
  renderTreeParentSlot("parentA", treeParents[0]);
  renderTreeParentSlot("parentB", treeParents[1]);
  const recipe = getTreeBreedingRecipe(treeParents[0], treeParents[1]);
  const saplingCost = getTreeSaplingCost(treeParents[0], treeParents[1]);
  const missingSaplings = getMissingTreeSaplings(saplingCost);
  const analyzedTrees = treeParents.filter((id) => state.treeAnalyzed.includes(id));
  const treeTraits = combineTraits(analyzedTrees, treeSpecies, ["growth", "yield", "resin"]);
  const parentsAnalyzed = analyzedTrees.length === treeParents.length;
  const levelReady = recipe && getUpgradeLevel("treeFarm") >= recipe.requiresTreeFarm;
  $("#tree-progress").style.width = `${progress}%`;
  setText("#tree-progress-label", `${progress}%`);
  setText("#tree-level", `LV.${String(getUpgradeLevel("treeFarm")).padStart(2, "0")}`);
  setText("#tree-ready-count", treeYieldAmount);
  setText("#tree-ready-resin", treeResinAmount);
  setText("#tree-sapling-total", Object.keys(state.treeSaplings).reduce((total, id) => total + getTreeSaplingCount(id), 0));
  setText("#pollination-effect", treeYieldLocked ? `本批 ${treeYieldAmount} 木材${treeResinAmount > 0 ? ` · 树脂 ${treeResinAmount}` : ""}已锁定` : pollinationBonus > 0 ? `授粉 +${Math.round(pollinationBonus * 100)}%` : "暂无授粉加成");
  setText("#pollination-detail", treeYieldLocked ? "更换花源、环境或亲本，不会改变这批待收取产物" : pollinationBonus > 0 ? `${activeFlower.name}可用 · 蜜蜂 +${Math.round(getBeePollinationPotential() * 100)}% · 蝴蝶 +${Math.round(getButterflyPollinationBonus() * 100)}% · 土壤 ${Math.round(getActiveEnvironment().soil)}` : `缺少${activeFlower.name} · 蜂群授粉暂停`);
  updateStatusPill("#pollination-status", treeYieldLocked ? "已锁定" : pollinationBonus > 0 ? "联动" : "待补花源", treeYieldLocked || pollinationBonus > 0 ? "online" : "waiting");
  const treeMutationFailures = getBreedingFailureCount("tree", treeParents[0], treeParents[1]);
  const treeMutationChance = getMutationChance(recipe, "tree", treeParents[0], treeParents[1]);
  setText("#tree-mutation-chance", !recipe ? "组合未记录" : !parentsAnalyzed ? `待分析 ${treeParents.length - analyzedTrees.length} 个亲本` : !levelReady ? `需要树场 LV.${recipe.requiresTreeFarm}` : `培育概率 ${treeMutationChance}%`);
  setText("#tree-breeding-path", recipe ? `${recipe.label} · 目标：${treeSpecies[recipe.result].name} · ${getMutationBreakdownText(recipe, "tree", treeParents[0], treeParents[1])}` : "选择其他树木亲本，查看已知培育路径。");
  renderTraitBar("#tree-trait-growth", "#tree-growth-value", treeTraits.growth, ["慢", "中", "快"]);
  renderTraitBar("#tree-trait-yield", "#tree-yield-value", treeTraits.yield, ["低", "中", "高"]);
  renderTraitBar("#tree-trait-resin", "#tree-resin-value", treeTraits.resin, ["低", "中", "高"]);
  const overviewTreeStatus = treeYieldLocked ? "可收取" : state.treeBreeding ? "培育中" : "运行中";
  const overviewTreeMode = treeYieldLocked ? "ready" : "online";
  const overviewTreeDetail = treeYieldLocked ? `木材 ${treeYieldAmount}${treeResinAmount > 0 ? ` · 树脂 ${treeResinAmount}` : ""} · READY` : `木材 / 树脂 · 还需 ${Math.max(1, Math.ceil((100 - state.treeProgress) / treeRate))}s`;
  updateStatusPill("#overview-tree-status", overviewTreeStatus, overviewTreeMode);
  setText("#overview-tree-detail", overviewTreeDetail);
  const overviewTreeProgress = $("#overview-tree-progress");
  if (overviewTreeProgress) overviewTreeProgress.style.width = `${treeYieldLocked ? 100 : progress}%`;
  const treeCard = $("#overview-tree-card");
  if (treeCard) {
    treeCard.dataset.target = treeYieldLocked ? "#tree-collect-button" : "#tree-countdown";
    treeCard.setAttribute("aria-label", `打开树场 T-01 · ${overviewTreeStatus}`);
  }
  setText("#tree-countdown", state.treeReady > 0 ? "READY" : `${Math.max(1, Math.ceil((100 - state.treeProgress) / treeRate))}s`);
  setText("#tree-status-text", state.treeBreeding ? `培育中 · ${treeSpecies[state.treeBreeding.result]?.name || "未知树种"} · 剩余 ${state.treeBreeding.remaining}s` : (state.treeReady > 0 ? `树场中有产物等待收取 · 已锁定 ${treeYieldAmount} 木材${treeResinAmount > 0 ? `、${treeResinAmount} 树脂` : ""}` : `树苗正在生长 · 预估产量 ${Math.round(getTreeYieldMultiplier() * 100)}%`));
  const collectButton = $("#tree-collect-button");
  collectButton.disabled = state.treeReady === 0;
  collectButton.style.opacity = state.treeReady === 0 ? ".55" : "1";
  const canBreed = Boolean(recipe && parentsAnalyzed && levelReady && missingSaplings.length === 0 && state.resources.wood >= 4 && !state.treeBreeding);
  const breedButton = $("#tree-breed-button");
  breedButton.disabled = !canBreed;
  breedButton.style.opacity = canBreed ? "1" : ".55";
  const breedLabel = state.treeBreeding ? `培育中 · ${state.treeBreeding.remaining}s` : !recipe ? "组合未记录" : !parentsAnalyzed ? "先分析树苗" : !levelReady ? `需要树场 LV.${recipe.requiresTreeFarm}` : missingSaplings.length ? "树苗不足" : state.resources.wood < 4 ? "木材不足" : "培育树苗 <span>→</span>";
  breedButton.innerHTML = breedLabel;
  $$(".tree-analyze-button").forEach((button) => {
    const done = state.treeAnalyzed.includes(button.dataset.treeAnalyze);
    button.classList.toggle("done", done);
    button.textContent = done ? "已分析" : "分析树苗";
  });
  const discoveredTrees = knownDiscoveredTrees();
  setText("#tree-species-count", `${String(discoveredTrees.length).padStart(2, "0")} / ${String(Object.keys(treeSpecies).length).padStart(2, "0")} SPECIES`);
  $("#tree-species-row").innerHTML = discoveredTrees.map((id) => {
    const item = treeSpecies[id];
    return `<article class="species-card archive-species-card tree-species-card"><span class="species-icon archive-species-icon tree-species-icon ${item.color}">${treeSpriteMarkup(id)}</span><div class="archive-species-copy tree-species-copy"><span>${item.type}</span><strong>${item.name}</strong><small>${item.english.toUpperCase()}</small></div></article>`;
  }).join("");
}

function renderResearch() {
  setText("#research-count", `${state.upgradesBought} 次升级 · ${Object.values(state.upgrades).filter((level) => level >= 3).length} 项满级`);
  Object.entries(upgradeData).forEach(([type, data]) => {
    const level = getUpgradeLevel(type);
    const cost = getUpgradeCost(type);
    const button = $(`#upgrade-${type}-button`);
    const card = button?.closest(".upgrade-card");
    if (card) {
      card.dataset.upgrade = type;
      card.querySelectorAll(".upgrade-track span").forEach((segment, index) => segment.classList.toggle("active", index < level));
    }
    setText(`#upgrade-${type}-level`, `LV.${String(level).padStart(2, "0")}`);
    setText(`#upgrade-${type}-effect`, getUpgradeEffectText(type));
    setText(`#upgrade-${type}-cost`, cost ? `下一等级：${formatCost(cost)}` : "已达到最高等级");
    if (button) {
      button.disabled = !cost || !canAfford(cost);
      button.textContent = !cost ? "已满级" : canAfford(cost) ? "升级设施  →" : "资源不足";
      button.style.opacity = button.disabled ? ".55" : "1";
    }
    setText(`#upgrade-${type}-name`, data.name);
  });
}

function renderCodex() {
  const grid = $("#codex-grid");
  const beeEntries = Object.entries(species).map(([id, item]) => {
    const found = state.discovered.includes(id);
    const analyzed = found && state.analyzed.includes(id);
    const traitMarkup = analyzed ? `<div class="codex-traits"><span>速度 <b>${item.traits.speed}</b></span><span>寿命 <b>${item.traits.lifespan}</b></span><span>繁殖 <b>${item.traits.fertility}</b></span></div>` : `<div class="codex-traits codex-traits-hidden">分析后读取基因参数</div>`;
    return `<article class="codex-entry ${found ? "" : "locked"} ${analyzed ? "analyzed" : ""}"><span class="species-icon ${item.color}">${found ? beeSpriteMarkup(id) : "?"}</span><div class="codex-body"><div class="codex-entry-top"><small>${found ? `蜂种 · ${item.type}` : "蜂种 · 未发现"}</small><span class="codex-status">${found ? analyzed ? "已分析" : "待分析" : "LOCKED"}</span></div><h3>${found ? item.name : "未知品种"}</h3><p>${found ? item.desc : getCodexUnlockText(id, "bee")}</p>${found ? `<small class="codex-lineage">${getBeeLineage(id)}</small>${traitMarkup}` : ""}</div></article>`;
  }).join("");
  const treeEntries = Object.entries(treeSpecies).map(([id, item]) => {
    const found = state.treeDiscovered.includes(id);
    const analyzed = found && state.treeAnalyzed.includes(id);
    const traitMarkup = analyzed ? `<div class="codex-traits"><span>生长 <b>${item.traits.growth}</b></span><span>木材 <b>${item.traits.yield}</b></span><span>树脂 <b>${item.traits.resin}</b></span></div>` : `<div class="codex-traits codex-traits-hidden">分析后读取基因参数</div>`;
    return `<article class="codex-entry ${found ? "" : "locked"} ${analyzed ? "analyzed" : ""}"><span class="species-icon tree-species-icon ${item.color}">${found ? treeSpriteMarkup(id) : "?"}</span><div class="codex-body"><div class="codex-entry-top"><small>${found ? `树木 · ${item.type}` : "树木 · 未发现"}</small><span class="codex-status">${found ? analyzed ? "已分析" : "待分析" : "LOCKED"}</span></div><h3>${found ? item.name : "未知树种"}</h3><p>${found ? item.desc : getCodexUnlockText(id, "tree")}</p>${found ? `<small class="codex-lineage">${getTreeLineage(id)}</small>${traitMarkup}` : ""}</div></article>`;
  }).join("");
  const butterflyEntries = Object.entries(butterflySpecies).map(([id, item]) => {
    const found = state.butterflyDiscovered.includes(id);
    const analyzed = found && state.butterflyAnalyzed.includes(id);
    const traitMarkup = analyzed ? `<div class="codex-traits"><span>稀有度 <b>${item.traits.rarity}</b></span><span>授粉 <b>${item.traits.pollination}</b></span></div>` : `<div class="codex-traits codex-traits-hidden">观察后记录生态参数</div>`;
    return `<article class="codex-entry butterfly-entry ${found ? "" : "locked"} ${analyzed ? "analyzed" : ""}"><span class="species-icon ${item.color}">${found ? butterflySpriteMarkup(id) : "?"}</span><div class="codex-body"><div class="codex-entry-top"><small>${found ? `蝴蝶 · ${item.type}` : "蝴蝶 · 未发现"}</small><span class="codex-status">${found ? analyzed ? "已观察" : "待观察" : "LOCKED"}</span></div><h3>${found ? item.name : "未知蝶种"}</h3><p>${found ? item.desc : getCodexUnlockText(id, "butterfly")}</p>${found ? `<small class="codex-lineage">${getButterflyLineage(id)}</small>${traitMarkup}<button class="mini-action butterfly-observe-button" data-butterfly-observe="${id}">${analyzed ? "已记录" : "观察蝶种"}</button>` : ""}</div></article>`;
  }).join("");
  grid.innerHTML = `<div class="codex-section-divider"><span>01 / BEES · 蜂种</span><small>亲本、突变与基因</small></div>${beeEntries}<div class="codex-section-divider"><span>02 / BUTTERFLIES · 蝴蝶</span><small>观察、授粉与生态指标</small></div>${butterflyEntries}<div class="codex-section-divider"><span>03 / TREES · 树种</span><small>生长、木材与树脂</small></div>${treeEntries}`;
  renderButterflyBreeding();
}

function renderButterflyBreeding() {
  const panel = $("#butterfly-breeding-panel");
  if (!panel) return;
  const known = knownDiscoveredButterflies();
  const fallbackA = known[0] || "azure";
  const fallbackB = known[1] || fallbackA;
  const parentA = state.butterflyBreeding ? state.butterflyBreeding.parentA : getButterflyParentId("parentA", fallbackA);
  const parentB = state.butterflyBreeding ? state.butterflyBreeding.parentB : getButterflyParentId("parentB", fallbackB);
  const safeParentA = known.includes(parentA) ? parentA : fallbackA;
  const safeParentB = known.includes(parentB) ? parentB : fallbackB;
  state.butterflyBreedingParents.parentA = safeParentA;
  state.butterflyBreedingParents.parentB = safeParentB;
  const recipe = getButterflyBreedingRecipe(safeParentA, safeParentB);
  const analyzedParents = [safeParentA, safeParentB].filter((id) => state.butterflyAnalyzed.includes(id));
  const observedReady = recipe && state.butterflyAnalyzed.length >= recipe.requiresObservation;
  const parentsReady = analyzedParents.length === 2;
  const flowerCount = getFlowerCount();
  const mutationFailures = getBreedingFailureCount("butterfly", safeParentA, safeParentB);
  const mutationChance = getMutationChance(recipe, "butterfly", safeParentA, safeParentB);
  ["parent-a", "parent-b"].forEach((slot, index) => {
    const select = $(`#butterfly-${slot}-select`);
    if (!select) return;
    select.innerHTML = known.length ? known.map((id) => `<option value="${id}">${butterflySpecies[id].name}</option>`).join("") : `<option value="">暂无蝶种</option>`;
    select.value = index === 0 ? safeParentA : safeParentB;
    select.disabled = Boolean(state.butterflyBreeding) || known.length < 1;
  });
  setText("#butterfly-breeding-status", state.butterflyBreeding ? `培育中 · 剩余 ${Math.max(1, Math.ceil(state.butterflyBreeding.remaining))}s` : `已观察 ${state.butterflyAnalyzed.length} / ${known.length} 个蝶种`);
  setText("#butterfly-breeding-path", recipe ? `${recipe.label} · 目标：${butterflySpecies[recipe.result].name} · ${getMutationBreakdownText(recipe, "butterfly", safeParentA, safeParentB)}` : "选择两种已观察的蝶种，查看已知杂交路径。");
  setText("#butterfly-breeding-chance", !recipe ? "组合未记录" : !parentsReady ? `待观察 ${2 - analyzedParents.length} 个亲本` : !observedReady ? `还需观察 ${Math.max(0, recipe.requiresObservation - state.butterflyAnalyzed.length)} 个蝶种` : `突变概率 ${mutationChance}%`);
  setText("#butterfly-breeding-note", flowerCount > 0 ? `当前花源：${flowerSources[getActiveFlowerId()].name} ×${flowerCount} · 每次培育消耗 1 份花源` : `当前${flowerSources[getActiveFlowerId()].name}库存为 0 · 探索对应区域补充花源`);
  const button = $("#butterfly-breed-button");
  if (!button) return;
  const canBreed = Boolean(recipe && parentsReady && observedReady && flowerCount > 0 && !state.butterflyBreeding);
  button.disabled = !canBreed;
  button.style.opacity = canBreed ? "1" : ".55";
  button.innerHTML = state.butterflyBreeding ? `培育中 · ${Math.max(1, Math.ceil(state.butterflyBreeding.remaining))}s` : !recipe ? "组合未记录" : !parentsReady ? "先观察亲本" : !observedReady ? "继续观察蝶种" : flowerCount === 0 ? "需要花源" : "开始蝶蛹培育 <span>→</span>";
}

function renderZones() {
  const grid = $("#zone-grid");
  if (!grid) return;
  const numerals = ["I", "II", "III", "IV", "V"];
  grid.innerHTML = Object.entries(zones).map(([zone, config]) => {
    const unlocked = isZoneUnlocked(zone);
    const progress = getZoneProgress(zone);
    return `<article class="zone-card panel-inset ${unlocked ? "" : "locked"}">
      <div class="zone-art ${config.art}-art" aria-hidden="true"><span class="biome-ground"></span><i class="biome-tree"></i><b class="biome-detail"></b><em class="biome-accent"></em>${unlocked ? "" : '<div class="lock-mark">LOCKED</div>'}</div>
      <div class="zone-info"><div class="zone-card-meta"><span class="tag ${unlocked ? "tag-green" : "tag-muted"}">${unlocked ? "已开放" : "需解锁"}</span><span class="zone-difficulty">难度 ${numerals[config.difficulty - 1]}</span></div><h3>${config.name}</h3><p>${unlocked ? config.desc : config.unlockText}</p>
      <div class="zone-progress-line"><span>稀有进度 <strong>${progress.rareProgress}%</strong></span><span>熟练度 ${progress.proficiency}%</span></div>
      <div class="zone-footer"><span>发现度 <strong>${Math.round(getZoneDiscoveryProgress(zone))}%</strong></span><small>${getZoneVisits(zone)} 次调查</small><button class="small-button explore-button" data-zone="${zone}" ${unlocked ? "" : "disabled"}>${unlocked ? "调查" : "锁定"}</button></div></div></article>`;
  }).join("");
  renderSurveyQueue();
}

function renderSurveyQueue() {
  const card = $("#survey-queue-card");
  if (!card) return;
  const pendingCount = (state.pendingSurvey || []).reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
  const auto = state.autoSurvey;
  const unclaimed = state.surveyResult;
  card.hidden = !auto && pendingCount === 0 && !unclaimed;
  if (card.hidden) return;
  const autoAction = auto?.pauseType === "warehouse"
    ? '<button class="small-button" data-survey-action="settle-auto">整理本轮</button>'
    : `<button class="small-button" data-survey-action="pause-auto">${auto?.userPaused ? "继续" : "暂停"}</button>`;
  const autoText = auto
    ? `<div><span class="mini-label">AUTO SURVEY</span><strong>${zones[auto.zone]?.name || "区域"} · ${auto.completedRuns}/${auto.totalRuns}</strong><small>${auto.pausedReason || `本轮剩余 ${Math.max(0, Math.ceil(auto.remaining))} 秒`}</small></div>${autoAction}`
    : "";
  const pendingText = pendingCount > 0
    ? `<div><span class="mini-label">PENDING SURVEY BOX</span><strong>暂存调查物资 ×${pendingCount}</strong><small>仓库空间不足的物资会继续保留</small></div><button class="small-button" data-survey-action="claim-pending">整理入库</button>`
    : "";
  const resultText = unclaimed
    ? `<div><span class="mini-label">UNCLAIMED RESULT</span><strong>${zones[unclaimed.zone]?.name || "区域"}调查已完成</strong><small>打开结算后可将物资整理入库</small></div><button class="small-button" data-survey-action="open-result">查看结算</button>`
    : "";
  card.innerHTML = `${autoText}${resultText}${pendingText}`;
}

function renderGuide() {
  const guidePresentation = getGuidePresentation();
  const stepIndex = guidePresentation.stepIndex;
  const completionFlags = getGuideCompletionFlags();
  const complete = guidePresentation.complete;
  const current = guidePresentation.item;
  const percent = getGuideCompletionPercent();
  setText("#guide-title", current.title);
  setText("#guide-text", current.text);
  setText("#guide-step", complete ? "COMPLETE" : `STEP ${String(stepIndex + 1).padStart(2, "0")} / ${String(guideSteps.length).padStart(2, "0")}`);
  setText("#guide-progress-label", `${percent}%`);
  $("#guide-progress").style.width = `${percent}%`;
  const action = $("#guide-action");
  action.dataset.jump = current.action;
  action.dataset.target = guidePresentation.temporary ? "#collect-button" : getGuideTarget(stepIndex, current.target);
  action.innerHTML = `${current.actionLabel} <span>→</span>`;
  $("#guide-steps").innerHTML = guideSteps.map((item, index) => {
    const done = completionFlags[index] || complete;
    const currentClass = !complete && index === stepIndex ? "current" : "";
    return `<div class="guide-step-row ${done ? "done" : ""} ${currentClass}"><span>${done ? "✓" : String(index + 1).padStart(2, "0")}</span><strong>${item.title}</strong></div>`;
  }).join("");
}

function getGuideTarget(stepIndex, fallback = "") {
  if (stepIndex === 1) return state.apiaryReady > 0 ? "#collect-button" : "#apiary-countdown";
  if (stepIndex === 7) return $(".upgrade-button:not(:disabled)") ? ".upgrade-button:not(:disabled)" : ".upgrade-grid";
  if (stepIndex === 8) return "#contract-button";
  if (stepIndex === 9) return isFermenterUnlocked() ? "#fermenter-button" : "#fermenter-locked-panel";
  if (stepIndex === 10) return isDistillerUnlocked() ? "#distiller-button" : "#distiller-locked-panel";
  return fallback;
}

function renderMilestones() {
  const milestones = getLongMilestones();
  const completed = getCompletedLongMilestones();
  const complete = completed === milestones.length;
  setText("#milestone-rank", complete ? "RESEARCHER" : `ARCHIVE ${completed} / ${milestones.length}`);
  setText("#milestone-title", complete ? "生态研究档案已建立" : "建立生态研究档案");
  setText("#milestone-detail", complete ? "三条长期记录均已完成，可以继续追求更高等级的物种与设施。" : "把一次次调查、成功培育和设施投入，沉淀为长期成长记录。");
  const grid = $("#milestone-grid");
  if (!grid) return;
  grid.innerHTML = milestones.map((milestone) => {
    const done = milestone.value >= milestone.target;
    const progress = Math.round((milestone.value / milestone.target) * 100);
    return `<div class="milestone-item ${done ? "done" : ""}"><div class="milestone-item-head"><strong>${milestone.title}</strong><span>${milestone.value} / ${milestone.target}</span></div><small>${milestone.detail}</small><div class="progress-track"><span style="width: ${progress}%"></span></div></div>`;
  }).join("");
}

function renderContracts() {
  const contract = getCurrentContract();
  setText("#contract-reputation", state.reputation);
  setText("#contract-count", `${state.contractsCompleted} / ${contractData.length}`);
  const button = $("#contract-button");
  const requirements = $("#contract-requirements");
  if (!contract) {
    updateStatusPill("#contract-status", "档案完成", "online");
    setText("#contract-label", "生态委托档案");
    setText("#contract-title", "委托网络已建立");
    setText("#contract-detail", "三份生态委托都已完成，继续积累声望并优化生产效率。");
    setText("#contract-reward", "全部委托已交付");
    if (requirements) requirements.innerHTML = "<span class=\"contract-complete-mark\">✓</span>";
    if (button) {
      button.disabled = true;
      button.textContent = "委托档案完成";
      button.style.opacity = ".55";
    }
    return;
  }
  const unlocked = isContractUnlocked(contract);
  const missing = getMissingResources(contract.requires);
  const rewardBlocker = getContractRewardBlocker(contract);
  const spaceReady = !rewardBlocker;
  const ready = unlocked && missing.length === 0 && spaceReady;
  const iconMap = {
    rawComb: '<span class="pixel-honeycomb pixel-honeycomb-contract" aria-hidden="true"></span>',
    honey: '<span class="pixel-resource resource-honey" aria-hidden="true"></span>',
    wax: '<span class="pixel-resource resource-wax" aria-hidden="true"></span>',
    wood: '<span class="pixel-resource resource-wood" aria-hidden="true"></span>',
    oil: '<span class="pixel-resource resource-oil" aria-hidden="true"></span>',
    biomass: '<span class="pixel-resource resource-biomass" aria-hidden="true"></span>'
  };
  const toneMap = { rawComb: "amber", honey: "honey", wax: "wax", wood: "wood", oil: "oil", biomass: "biomass" };
  if (requirements) {
    requirements.innerHTML = Object.entries(contract.requires).map(([resource, amount]) => {
      const have = getStoredResourceAmount(resource);
      const enough = have >= amount;
      return `<span class="contract-slot ${enough ? "" : "missing"}"><i class="contract-resource-icon ${toneMap[resource] || "storage"}">${iconMap[resource] || "?"}</i><span class="contract-slot-copy"><small>${resourceNames[resource] || resource}</small><strong>${Math.min(have, amount)} / ${amount}</strong></span></span>`;
    }).join("");
  }
  updateStatusPill("#contract-status", !unlocked ? "待解锁" : ready ? "可交付" : "筹备中", !unlocked ? "waiting" : ready ? "ready" : "waiting");
  setText("#contract-label", contract.label);
  setText("#contract-title", contract.title);
  setText("#contract-detail", !unlocked ? contract.unlockText : !spaceReady && missing.length === 0 ? `仓库分区不足：${formatWarehouseBlocker(rewardBlocker)}。` : contract.detail);
  setText("#contract-reward", `奖励：${formatResourceBundle(contract.rewards)} · 声望 +${contract.reputation}`);
  if (button) {
    button.disabled = !ready;
    button.textContent = !unlocked ? "完成前置后解锁" : ready ? "交付委托  →" : missing.length ? "资源未齐" : "物资分区已满";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function getBlockedReadyOutput() {
  const candidates = [
    state.machineOutput > 0 ? { name: "离心机产物", bundle: { honey: state.machineOutput, wax: state.machineOutput } } : null,
    state.squeezerOutput > 0 ? { name: "榨汁机产物", bundle: { oil: state.squeezerOutput } } : null,
    state.fermenterOutput > 0 ? { name: "发酵机产物", bundle: { biomass: state.fermenterOutput } } : null,
    state.distillerOutput > 0 ? { name: "蒸馏机产物", bundle: { biofuel: state.distillerOutput } } : null,
    state.apiaryReady > 0 ? { name: "蜂箱产物", bundle: { rawComb: state.apiaryReady } } : null,
    state.treeReady > 0 ? { name: "树场产物", bundle: { wood: getTreeYieldAmount(), resin: Math.max(0, Number(state.treeReadyResin) || 0) } } : null
  ].filter(Boolean);
  for (const candidate of candidates) {
    const blocker = getWarehouseBundleBlocker(candidate.bundle);
    if (blocker) return { ...blocker, resourceName: blocker.name, name: candidate.name, bundle: candidate.bundle };
  }
  return null;
}

function getAutomationEnergyBlocker() {
  const reserve = getAutomationReserveEnergy();
  const candidates = [
    !state.machineActive && state.machineOutput === 0 && state.rawComb > 0 ? { name: "离心机", cost: 2 } : null,
    isSqueezerUnlocked() && !state.squeezerActive && state.squeezerOutput === 0 && state.resources.wood >= 2 ? { name: "榨汁机", cost: 2 } : null,
    isFermenterUnlocked() && !state.fermenterActive && state.fermenterOutput === 0 && state.resources.wood >= 3 ? { name: "发酵机", cost: 3 } : null,
    isDistillerUnlocked() && !state.distillerActive && state.distillerOutput === 0 && state.resources.biomass >= 1 ? { name: "蒸馏机", cost: 4 } : null
  ].filter(Boolean);
  return candidates.find((candidate) => state.resources.energy < candidate.cost || state.resources.energy - candidate.cost < reserve) || null;
}

function getHorizonTarget(action, prefix = "") {
  if (action === "apiary") {
    if (prefix === "mid") {
      const analyzedCount = state.analyzed.filter((id) => id === "forest" || id === "meadows").length;
      if (analyzedCount < 2) return ".analyze-button:not(.done)";
      if (state.breedings === 0 || state.breeding) return "#breed-button";
    }
    if (state.apiaryReady > 0) return "#collect-button";
    if (prefix === "short" && getFlowerCount() === 0) return "#flower-select";
    if (prefix === "short") return state.breeding ? "#breed-button" : "#apiary-countdown";
    if (state.breeding) return "#breed-button";
    return ".analyze-button:not(.done)";
  }
  if (action === "machines") {
    if (prefix === "long" && isAutomationUnlocked() && !state.automationEnabled) return "#automation-button";
    if (prefix === "mid" && state.machineCycles > 0 && state.squeezerCycles === 0) return "#squeezer-button";
    if (state.machineOutput > 0 || state.machineActive) return "#machine-button";
    if (prefix === "short" && state.distillerOutput > 0) return "#distiller-button";
    if (state.squeezerOutput > 0 || state.squeezerActive) return "#squeezer-button";
    if (state.fermenterOutput > 0 || state.fermenterActive) return "#fermenter-button";
    if (state.distillerOutput > 0 || state.distillerActive) return "#distiller-button";
    if (state.rawComb > 0) return "#machine-button";
    if (prefix === "long") {
      if (isSqueezerUnlocked() && state.squeezerCycles === 0) return "#squeezer-button";
      if (isFermenterUnlocked() && state.fermenterCycles === 0) return "#fermenter-button";
      if (isDistillerUnlocked() && state.distillerCycles === 0) return "#distiller-button";
    }
    if (isSqueezerUnlocked()) return "#squeezer-button";
    if (isFermenterUnlocked()) return "#fermenter-button";
    if (isDistillerUnlocked()) return "#distiller-button";
    return "#machine-button";
  }
  if (action === "arbor") {
    if (prefix === "mid") {
      const treeAnalyzedCount = state.treeAnalyzed.filter((id) => id === "oak" || id === "birch").length;
      if (treeAnalyzedCount < 2) return ".tree-analyze-button:not(.done)";
      return "#tree-breed-button";
    }
    if (state.treeReady > 0) return "#tree-collect-button";
    if (state.treeBreeding) return "#tree-breed-button";
    return ".tree-analyze-button:not(.done)";
  }
  if (action === "research") {
    if (prefix === "short" && getBlockedReadyOutput()) return "#upgrade-warehouse-button";
    const availableUpgrade = $(".upgrade-button:not(:disabled)");
    return availableUpgrade ? `#${availableUpgrade.id}` : ".upgrade-grid";
  }
  if (action === "codex") return "#codex-grid";
  if (action === "explore") return ".explore-button:not(:disabled)";
  return "";
}

function setHorizonCard(prefix, title, detail, status, progress, action, actionLabel) {
  setText(`#${prefix}-title`, title);
  setText(`#${prefix}-detail`, detail);
  setText(`#${prefix}-status`, status);
  setText(`#${prefix}-progress-label`, `${Math.round(progress)}%`);
  $(`#${prefix}-progress`).style.width = `${clamp(progress, 0, 100)}%`;
  const button = $(`#${prefix}-action`);
  const card = button?.closest(".horizon-card");
  if (card) card.classList.toggle("blocked", status === "分区已满");
  button.dataset.action = action;
  button.dataset.target = getHorizonTarget(action, prefix);
  button.innerHTML = `${actionLabel} <span>→</span>`;
}

function renderHorizons() {
  const apiaryRate = getApiaryEffectiveRate();
  const apiaryYield = getApiaryYieldPerCycle();
  const activeFlower = flowerSources[getActiveFlowerId()];
  const flowerBlocked = state.apiaryReady === 0 && getFlowerCount() === 0;
  const blockedOutput = getBlockedReadyOutput();
  let shortTitle = blockedOutput ? `仓库阻塞 · ${blockedOutput.name}` : flowerBlocked ? "补充蜂箱花源" : "等待蜂箱产出";
  let shortDetail = blockedOutput ? `${blockedOutput.name}已经 READY，但${formatWarehouseBlocker(blockedOutput)}；先升级仓库或消耗该物资。` : flowerBlocked ? `当前${activeFlower.name}库存为 0，选择其他花源或去${zones[activeFlower.zone].name}探索补充。` : `蜂箱 A-01 正在工作，约 ${Math.max(1, Math.ceil((100 - state.apiaryProgress) / apiaryRate))} 秒后完成，预计产出 ${apiaryYield} 个蜂巢。`;
  let shortStatus = blockedOutput ? "分区已满" : flowerBlocked ? "待处理" : "进行中";
  let shortProgress = blockedOutput ? 100 : state.apiaryProgress;
  let shortAction = blockedOutput ? "research" : "apiary";
  let shortLabel = blockedOutput ? "处理仓库" : flowerBlocked ? "配置花源" : "查看蜂箱";
  if (blockedOutput) {
    shortAction = "research";
  } else if (state.machineOutput > 0) {
    shortTitle = "收取离心产物";
    shortDetail = "蜂蜜和蜂蜡已经准备好，收取后可以继续投入生产。";
    shortStatus = "可收取";
    shortProgress = 100;
    shortAction = "machines";
    shortLabel = "收取产物";
  } else if (state.distillerOutput > 0) {
    shortTitle = "收取蒸馏产物";
    shortDetail = "生物燃料已经准备好，可用于长期扩张和后续高级设施。";
    shortStatus = "可收取";
    shortProgress = 100;
    shortAction = "machines";
    shortLabel = "收取生物燃料";
  } else if (state.squeezerOutput > 0) {
    shortTitle = "收取榨汁产物";
    shortDetail = "种子油已经准备好，收取后可以投入树场、升级或下一次探索。";
    shortStatus = "可收取";
    shortProgress = 100;
    shortAction = "machines";
    shortLabel = "收取种子油";
  } else if (state.fermenterOutput > 0) {
    shortTitle = "收取发酵产物";
    shortDetail = "生物质已经准备好，收取后可以继续扩展长期加工链。";
    shortStatus = "可收取";
    shortProgress = 100;
    shortAction = "machines";
    shortLabel = "收取生物质";
  } else if (state.apiaryReady > 0) {
    shortTitle = "收取蜂箱产物";
    shortDetail = `蜂巢已经准备好，本轮可收取 ${state.apiaryReady} 个；收取后可送入离心机加工。`;
    shortStatus = "可收取";
    shortProgress = 100;
    shortLabel = "收取蜂巢";
  } else if (state.machineActive) {
    shortTitle = "观察离心进度";
    shortDetail = "机器正在分离蜂巢，短周期动作会在完成后刷新。";
    shortStatus = "加工中";
    shortProgress = state.machineProgress;
    shortAction = "machines";
    shortLabel = "查看机器";
  } else if (state.squeezerActive) {
    shortTitle = "观察榨汁进度";
    shortDetail = `榨汁机正在加工木材，约 ${Math.max(1, Math.ceil((100 - state.squeezerProgress) / (100 / getSqueezerDuration())))} 秒后完成。`;
    shortStatus = "加工中";
    shortProgress = state.squeezerProgress;
    shortAction = "machines";
    shortLabel = "查看榨汁机";
  } else if (state.fermenterActive) {
    shortTitle = "观察发酵进度";
    shortDetail = `发酵机正在处理植物原料，约 ${Math.max(1, Math.ceil((100 - state.fermenterProgress) / (100 / getFermenterDuration())))} 秒后完成。`;
    shortStatus = "加工中";
    shortProgress = state.fermenterProgress;
    shortAction = "machines";
    shortLabel = "查看发酵机";
  } else if (state.distillerActive) {
    shortTitle = "观察蒸馏进度";
    shortDetail = `蒸馏机正在处理生物质，约 ${Math.max(1, Math.ceil((100 - state.distillerProgress) / (100 / getDistillerDuration())))} 秒后完成。`;
    shortStatus = "加工中";
    shortProgress = state.distillerProgress;
    shortAction = "machines";
    shortLabel = "查看蒸馏机";
  } else if (state.treeReady > 0) {
    shortTitle = "收取树场木材";
    shortDetail = "树场已经完成生长周期，收取木材后可以继续扩建和培育。";
    shortStatus = "可收取";
    shortProgress = 100;
    shortAction = "arbor";
    shortLabel = "收取木材";
  } else if (state.treeBreeding) {
    shortTitle = "观察树苗培育";
    shortDetail = "树苗正在培育，短周期可以先收取蜂箱或整理机器。";
    shortStatus = "培育中";
    const treeRecipe = getTreeBreedingRecipe(state.treeBreeding.parentA, state.treeBreeding.parentB);
    shortProgress = getTimedProgress(state.treeBreeding, treeRecipe?.time);
    shortAction = "arbor";
    shortLabel = "查看树木";
  }
  setHorizonCard("short", shortTitle, shortDetail, shortStatus, shortProgress, shortAction, shortLabel);

  const analyzedCount = Math.min(2, state.analyzed.filter((id) => id === "forest" || id === "meadows").length);
  let midTitle = "分析亲本属性";
  let midDetail = `已分析 ${analyzedCount} / 2 种亲本，分析后才能确认杂交方向。`;
  let midStatus = "研究中";
  let midProgress = analyzedCount * 25;
  let midAction = "apiary";
  let midLabel = "打开养蜂台";
  if (analyzedCount >= 2 && state.breedings === 0) {
    midTitle = "完成第一次杂交";
    midDetail = "森林蜂 × 草原蜂已经具备实验条件，开始培育培育蜂。";
    midStatus = state.breeding ? "进行中" : "可开始";
    const beeRecipe = state.breeding ? getBreedingRecipe(state.breeding.princess, state.breeding.drone) : null;
    midProgress = state.breeding ? 50 + getTimedProgress(state.breeding, beeRecipe?.time) * .5 : 50;
    midLabel = state.breeding ? "查看杂交" : "进行杂交";
  } else if (state.breedings > 0 && state.machineCycles === 0) {
    if (state.machineOutput > 0) {
      midTitle = "收取第一批加工产物";
      midDetail = "蜂蜜和蜂蜡已经准备好，收取后完成第一条生产线。";
      midStatus = "可收取";
      midProgress = 100;
      midAction = "machines";
      midLabel = "收取产物";
    } else if (state.machineActive) {
      midTitle = "观察第一条生产线";
      midDetail = `离心机正在分离蜂巢，约 ${Math.max(1, Math.ceil((100 - state.machineProgress) / (100 / getMachineDuration())))} 秒后完成。`;
      midStatus = "加工中";
      midProgress = 75 + clamp(state.machineProgress, 0, 100) * .25;
      midAction = "machines";
      midLabel = "查看机器";
    } else if (state.rawComb > 0) {
      midTitle = "启动第一条生产线";
      midDetail = "蜂巢已经在仓库中，启动离心机获得蜂蜜和蜂蜡。";
      midStatus = "可开始";
      midProgress = 75;
      midAction = "machines";
      midLabel = "启动加工";
    } else if (state.apiaryReady > 0) {
      midTitle = "收取蜂巢再加工";
      midDetail = "蜂箱中已有蜂巢，先收取后才能送入离心机。";
      midStatus = "待收取";
      midProgress = 65;
      midAction = "apiary";
      midLabel = "收取蜂巢";
    } else {
      midTitle = "准备第一条生产线";
      midDetail = "先探索或等待蜂箱产出 1 个蜂巢，再启动离心机。";
      midStatus = "待输入";
      midProgress = 50;
      midAction = "explore";
      midLabel = "去找蜂巢";
    }
  } else if (state.machineCycles > 0) {
    if (state.squeezerCycles === 0) {
      if (state.squeezerOutput > 0) {
        midTitle = "收取第二条生产线产物";
        midDetail = "榨汁机已经产出种子油，收取后即可投入树场或设施升级。";
        midStatus = "可收取";
        midProgress = 100;
        midAction = "machines";
        midLabel = "收取种子油";
      } else if (state.squeezerActive) {
        midTitle = "观察第二条生产线";
        midDetail = `榨汁机正在榨取木材，约 ${Math.max(1, Math.ceil((100 - state.squeezerProgress) / (100 / getSqueezerDuration())))} 秒后完成。`;
        midStatus = "加工中";
        midProgress = 75 + clamp(state.squeezerProgress, 0, 100) * .25;
        midAction = "machines";
        midLabel = "查看榨汁机";
      } else if (state.resources.wood < 2 || state.resources.energy < 2) {
        midTitle = "准备第二条生产线";
        midDetail = `榨汁机已解锁，需要木材 ${Math.min(2, state.resources.wood)} / 2、能源 ${Math.min(2, Math.floor(state.resources.energy))} / 2。`;
        midStatus = "待输入";
        midProgress = 75;
        midAction = "machines";
        midLabel = "查看榨汁机";
      } else {
        midTitle = "启动第二条生产线";
        midDetail = "使用 2 木材和 2 能源启动榨汁机，获得 1 份种子油。";
        midStatus = "可开始";
        midProgress = 75;
        midAction = "machines";
        midLabel = "启动榨汁机";
      }
    } else {
      const treeAnalyzedCount = Math.min(2, state.treeAnalyzed.filter((id) => id === "oak" || id === "birch").length);
      if (treeAnalyzedCount < 2) {
      midTitle = "研究树木培育";
      midDetail = `已分析 ${treeAnalyzedCount} / 2 种树苗，完成后可以培育落叶松。`;
      midStatus = "新系统";
      midProgress = 50 + treeAnalyzedCount * 15;
      midAction = "arbor";
      midLabel = "打开树木台";
      } else if (state.treeCycles === 0) {
      const treeParentA = state.treeBreeding ? state.treeBreeding.parentA : getTreeParentId("parentA", "oak");
      const treeParentB = state.treeBreeding ? state.treeBreeding.parentB : getTreeParentId("parentB", "birch");
      const treeRecipe = getTreeBreedingRecipe(treeParentA, treeParentB);
      const treeLevelReady = Boolean(treeRecipe && getUpgradeLevel("treeFarm") >= treeRecipe.requiresTreeFarm);
      const treeMissingSaplings = getMissingTreeSaplings(getTreeSaplingCost(treeParentA, treeParentB));
      const treeInputReady = Boolean(treeRecipe && treeLevelReady && treeMissingSaplings.length === 0 && state.resources.wood >= 4);
      const treeInputDetail = !treeRecipe ? "当前亲本组合暂不可用，请更换亲本。" : !treeLevelReady ? `需要树场 LV.${treeRecipe.requiresTreeFarm} 才能启动这条培育路径。` : treeMissingSaplings.length ? `树苗不足：${treeMissingSaplings.map(([id, amount]) => `${treeSpecies[id].name} ${getTreeSaplingCount(id)} / ${amount}`).join("、")}。` : state.resources.wood < 4 ? `木材不足：${Math.min(4, state.resources.wood)} / 4。` : `${treeRecipe.label}：${treeSpecies[treeRecipe.result].name}，提升树场的木材产量。`;
      midTitle = state.treeBreeding ? "观察树苗培育" : "培育第一棵进阶树";
      midDetail = state.treeBreeding ? `树苗正在培育，目标：${treeSpecies[state.treeBreeding.result]?.name || "未知树种"}。` : treeInputDetail;
      midStatus = state.treeBreeding ? "进行中" : treeInputReady ? "可开始" : "输入不足";
      midProgress = state.treeBreeding ? 75 + getTimedProgress(state.treeBreeding, treeRecipe?.time) * .25 : 75;
      midAction = "arbor";
      midLabel = state.treeBreeding ? "查看培育" : treeInputReady ? "管理树木" : "补充材料";
      } else if (state.upgradesBought === 0) {
      midTitle = "研究设施升级";
      midDetail = "把蜂蜜、蜂蜡、木材和种子油投入研究台，换取更快的生产循环。";
      midStatus = "待升级";
      midProgress = 90;
      midAction = "research";
      midLabel = "打开研究台";
      } else {
      midTitle = "稳定生产循环";
      midDetail = "蜂群、树场、机器和研究升级已经连接起来，可以开始优化布局。";
      midStatus = "已建立";
      midProgress = 100;
      midAction = "research";
      midLabel = "管理研究";
      }
    }
  }
  setHorizonCard("mid", midTitle, midDetail, midStatus, midProgress, midAction, midLabel);

  const knownBeeCount = knownDiscoveredBees().length;
  const knownTreeCount = knownDiscoveredTrees().length;
  const longParts = [state.explorations >= 2, state.machineCycles >= 1, state.squeezerCycles >= 1, state.treeCycles >= 1, state.upgradesBought >= 1, state.fermenterCycles >= 1, state.distillerCycles >= 1, state.contractsCompleted >= 3, isAutomationUnlocked() && state.automationEnabled, knownBeeCount >= 4 && knownTreeCount >= 3, getCompletedLongMilestones() >= 3];
  let longTitle = "扩展生态区域";
  let longDetail = "完成加工并开放热带林冠，寻找稀有蜂种。";
  let longStatus = "规划中";
  let longProgress = (longParts.filter(Boolean).length / longParts.length) * 100;
  let longAction = "explore";
  let longLabel = "查看探索";
  if (!longParts[0]) {
    longDetail = `完成 ${Math.min(2, state.explorations)} / 2 次探索后开放静谧沼泽。`;
  } else if (!longParts[1]) {
    longDetail = "完成一次离心加工后，热带林冠将开放。";
    longAction = "machines";
    longLabel = "完成加工";
  } else if (!longParts[2]) {
    longDetail = "完成一次榨汁加工，建立第二条可持续的材料生产线。";
    longAction = "machines";
    longLabel = "启动榨汁机";
  } else if (!longParts[3]) {
    longDetail = `已发现 ${knownTreeCount} / 3 个树种，完成树苗培育以扩展木材生产。`;
    longAction = "arbor";
    longLabel = "培育树苗";
  } else if (!longParts[4]) {
    longDetail = "完成一次研究升级，把短周期产物转化为更快的生态设施。";
    longAction = "research";
    longLabel = "研究升级";
  } else if (!longParts[5]) {
    const fermenterReady = isFermenterUnlocked();
    const fermenterInputReady = state.resources.wood >= 3 && state.resources.energy >= 3;
    longTitle = "建立生物质生产线";
    longDetail = !fermenterReady ? `${knownBeeCount < 3 ? `再发现 ${3 - knownBeeCount} 个蜂种` : "蜂种条件已满足"} · ${state.contractsCompleted < 1 ? "再完成 1 份生态委托" : "委托条件已满足"}，即可解锁发酵机 F-01。` : state.fermenterOutput > 0 ? "生物质已经准备好，先收取产物完成这条长期生产线。" : state.fermenterActive ? `发酵机正在处理木材，约 ${Math.max(1, Math.ceil((100 - state.fermenterProgress) / (100 / getFermenterDuration())))} 秒后完成。` : fermenterInputReady ? "发酵机 F-01 已解锁，处理木材并收取生物质，继续扩展长期加工。" : `发酵机已解锁，但还需要木材 ${Math.min(3, state.resources.wood)} / 3、能源 ${Math.min(3, Math.floor(state.resources.energy))} / 3。`;
    longStatus = !fermenterReady ? "待解锁" : state.fermenterOutput > 0 ? "可收取" : state.fermenterActive ? "进行中" : fermenterInputReady ? "可开始" : "输入不足";
    longAction = "machines";
    longLabel = !fermenterReady ? "查看机器台" : state.fermenterOutput > 0 ? "收取生物质" : state.fermenterActive ? "查看发酵机" : "打开发酵机";
  } else if (!longParts[6]) {
    const distillerReady = isDistillerUnlocked();
    const distillerInputReady = state.resources.biomass >= 1 && state.resources.energy >= 4;
    longTitle = "蒸馏生物燃料";
    longDetail = !distillerReady ? "先完成 1 次发酵加工，解锁蒸馏机 ST-01。" : state.distillerOutput > 0 ? "生物燃料已经准备好，先收取产物完成这条长期生产线。" : state.distillerActive ? `蒸馏机正在处理生物质，约 ${Math.max(1, Math.ceil((100 - state.distillerProgress) / (100 / getDistillerDuration())))} 秒后完成。` : distillerInputReady ? "蒸馏机 ST-01 已解锁，消耗生物质和能源生产生物燃料，完成第四条加工环。" : `蒸馏机已解锁，但还需要生物质 ${Math.min(1, state.resources.biomass)} / 1、能源 ${Math.min(4, Math.floor(state.resources.energy))} / 4。`;
    longStatus = !distillerReady ? "待解锁" : state.distillerOutput > 0 ? "可收取" : state.distillerActive ? "进行中" : distillerInputReady ? "可开始" : "输入不足";
    longAction = "machines";
    longLabel = !distillerReady ? "查看机器台" : state.distillerOutput > 0 ? "收取生物燃料" : state.distillerActive ? "查看蒸馏机" : "启动蒸馏机";
  } else if (!longParts[7]) {
    longTitle = "完成生态委托";
    longDetail = `已完成 ${Math.min(3, state.contractsCompleted)} / 3 份生态委托，把生物质和加工产物交给研究站换取声望。`;
    longStatus = "记录中";
    longAction = "overview";
    longLabel = "查看委托";
  } else if (!longParts[8]) {
    longTitle = "开启机器队列";
    longDetail = !isAutomationUnlocked() ? `完成 ${contractData.length} 份生态委托后解锁机器队列。` : "机器队列已经开放，按离心机 → 榨汁机 → 发酵机 → 蒸馏机顺序接管生产。";
    longStatus = !isAutomationUnlocked() ? "待解锁" : "可部署";
    longAction = "machines";
    longLabel = !isAutomationUnlocked() ? "查看委托" : "配置队列";
  } else if (!longParts[9]) {
    longDetail = `蜂种 ${knownBeeCount} / 4 · 树种 ${knownTreeCount} / 3，两个图鉴分支都达标后继续。`;
    longAction = "explore";
    longLabel = "寻找物种";
  } else if (!longParts[10]) {
    const completed = getCompletedLongMilestones();
    longTitle = "建立生态研究档案";
    longDetail = `已完成 ${completed} / 3 项长期记录：区域、育种、工坊。继续积累稳定生产。`;
    longStatus = "记录中";
    longAction = "overview";
    longLabel = "查看档案";
  } else {
    longTitle = "生态图鉴持续扩展";
    longDetail = "基础区域已经打通，可以继续追求稀有蜂种和更高产的基因。";
    longStatus = "已开放";
    longAction = "codex";
    longLabel = "查看图鉴";
  }
  setHorizonCard("long", longTitle, longDetail, longStatus, longProgress, longAction, longLabel);
}

function getChapterPresentation() {
  const speciesTotal = knownDiscoveredBees().length + knownDiscoveredTrees().length + knownDiscoveredButterflies().length;
  const chapters = [
    {
      title: "建立林地工作站",
      detail: "完成调查、样本分析与第一次蜜蜂杂交，让基础循环运转起来。",
      tasks: [
        { label: "调查森林边缘", done: state.explorations >= 1 },
        { label: "收取第一份蜂巢", done: state.apiaryCombCollected >= 1 },
        { label: "分析森林蜂与草原蜂", done: state.analyzed.includes("forest") && state.analyzed.includes("meadows") },
        { label: "完成第一次蜜蜂杂交", done: state.breedings >= 1 }
      ]
    },
    {
      title: "闭合第一条生产线",
      detail: "连接蜂箱、离心机、树场与授粉网络。",
      tasks: [
        { label: "完成一次离心加工", done: state.machineCycles >= 1 },
        { label: "完成一次树场收获", done: state.treeHarvests >= 1 },
        { label: "完成橡树 × 白桦培育", done: state.treeBreedingAttempts >= 1 },
        { label: "生态评分达到 65", done: getEcologyBreakdown().score >= 65 }
      ]
    },
    {
      title: "建立基因网络",
      detail: "扩展蜂、树、蝶图鉴，并进入二级培育支系。",
      tasks: [
        { label: "发现 5 个蜂种", done: knownDiscoveredBees().length >= 5 },
        { label: "发现 4 个树种", done: knownDiscoveredTrees().length >= 4 },
        { label: "观察 2 个蝶种", done: state.butterflyAnalyzed.length >= 2 },
        { label: "完成 1 份生态委托", done: state.contractsCompleted >= 1 }
      ]
    },
    {
      title: "生态工业化",
      detail: "建立生物燃料生产线，用研究和自动化扩大产能。",
      tasks: [
        { label: "生产生物质", done: state.fermenterCycles >= 1 },
        { label: "生产生物燃料", done: state.distillerCycles >= 1 },
        { label: "完成 3 次设施升级", done: state.upgradesBought >= 3 },
        { label: "开启自动化队列", done: isAutomationUnlocked() && state.automationEnabled }
      ]
    },
    {
      title: "生态专家",
      detail: "追求三级支系、完整图鉴与长期繁盛生态。",
      tasks: [
        { label: "发现三级蜂种", done: state.discovered.some((id) => getMutationTier(species[id]) >= 3) },
        { label: "发现三级树种", done: state.treeDiscovered.some((id) => getMutationTier(treeSpecies[id]) >= 3) },
        { label: "生态评分达到 85", done: getEcologyBreakdown().score >= 85 },
        { label: "物种档案达到 80%", done: speciesTotal >= Math.ceil((Object.keys(species).length + Object.keys(treeSpecies).length + Object.keys(butterflySpecies).length) * .8) }
      ]
    }
  ];
  let index = chapters.findIndex((chapter) => chapter.tasks.some((task) => !task.done));
  if (index < 0) index = chapters.length - 1;
  const chapter = chapters[index];
  const completed = chapter.tasks.filter((task) => task.done).length;
  return { chapters, chapter, index, completed, progress: Math.round(completed / chapter.tasks.length * 100) };
}

function getFieldRank() {
  const score = state.explorations + state.breedings * 3 + state.treeCycles * 2 + state.machineCycles * 2 + state.upgradesBought * 3 + state.contractsCompleted * 4 + knownDiscoveredBees().length + knownDiscoveredTrees().length + knownDiscoveredButterflies().length;
  if (score >= 70) return { rank: "R5", name: "生态专家" };
  if (score >= 40) return { rank: "R4", name: "工坊主管" };
  if (score >= 20) return { rank: "R3", name: "基因研究员" };
  if (score >= 8) return { rank: "R2", name: "生态助手" };
  return { rank: "R1", name: "林地学徒" };
}

function getRecommendedAction() {
  const blocked = getBlockedReadyOutput();
  if (blocked) return { step: 6, view: "research", target: "#upgrade-warehouse-button", title: `仓库阻塞 · ${blocked.name}`, detail: `${formatWarehouseBlocker(blocked)}，先扩容或消耗该物资才能继续收取。`, label: "处理仓库" };
  if (state.apiaryReady > 0) return { step: 4, view: "apiary", target: "#collect-button", title: "收取蜂箱产物", detail: `${state.apiaryReady} 个蜂巢已经准备好，收取后可进入离心加工。`, label: "收取蜂巢" };
  if (state.treeReady > 0) return { step: 4, view: "arbor", target: "#tree-collect-button", title: "收取树场产物", detail: `木材 ${getTreeYieldAmount()}${state.treeReadyResin ? `、树脂 ${state.treeReadyResin}` : ""} 已准备好。`, label: "收取树场" };
  if (state.machineOutput > 0 || state.squeezerOutput > 0 || state.fermenterOutput > 0 || state.distillerOutput > 0) return { step: 5, view: "machines", target: getHorizonTarget("machines", "short"), title: "收取加工产物", detail: "生产线已有完成产物，收取后释放机器与仓库流转空间。", label: "打开机器" };
  if (getFlowerCount() <= 0) return { step: 1, view: "explore", target: `.explore-button[data-zone="${flowerSources[getActiveFlowerId()].zone}"]`, title: `补充${flowerSources[getActiveFlowerId()].name}`, detail: "当前蜂箱缺少花源，生产已经暂停。", label: "调查花源" };
  if (state.explorations < 1) return { step: 1, view: "explore", target: '.explore-button[data-zone="forest"]', title: "调查森林边缘", detail: `消耗 ${getExploreEnergyCost()} 能源，带回蜂巢、木材与野花。`, label: "前往调查" };
  if (!(state.analyzed.includes("forest") && state.analyzed.includes("meadows"))) return { step: 2, view: "apiary", target: ".analyze-button:not(.done)", title: "分析基础亲本", detail: "读取森林蜂与草原蜂属性，解锁第一条可预测的杂交路径。", label: "分析亲本" };
  if (state.breedings < 1) return { step: 3, view: "apiary", target: "#breed-button", title: state.breeding ? "等待第一次杂交" : "启动第一次杂交", detail: state.breeding ? "培育正在进行，可先检查环境和树场。" : "森林蜂 × 草原蜂可培育出第一条进阶支系。", label: "打开培育台" };
  if (state.rawComb > 0 && !state.machineActive) return { step: 5, view: "machines", target: "#machine-button", title: "启动离心加工", detail: "仓库中有蜂巢可加工，转化为蜂蜜和蜂蜡。", label: "启动机器" };
  if (state.machineCycles < 1) return { step: 4, view: "apiary", target: "#apiary-countdown", title: "准备第一批蜂巢", detail: "保持花源和环境稳定，等待蜂箱完成生产。", label: "查看蜂箱" };
  if (state.upgradesBought < 1) return { step: 6, view: "research", target: ".upgrade-grid", title: "完成第一次研究升级", detail: "把蜂蜜、蜂蜡和木材转化为长期生产效率。", label: "打开研究" };
  return { step: 4, view: "overview", target: "#overview-apiary-card", title: "维持生态生产循环", detail: "检查最弱生态因素，在生产、培育和加工之间安排本轮重点。", label: "查看总览" };
}

function renderChapterDeck() {
  const presentation = getChapterPresentation();
  const rank = getFieldRank();
  setText("#field-rank-value", `${rank.rank} · ${rank.name}`);
  setText("#chapter-number", `CHAPTER ${String(presentation.index + 1).padStart(2, "0")}`);
  setText("#chapter-title", presentation.chapter.title);
  setText("#chapter-detail", presentation.chapter.detail);
  setText("#chapter-percent", `${presentation.progress}%`);
  const progress = $("#chapter-progress");
  if (progress) progress.style.width = `${presentation.progress}%`;
  const taskList = $("#chapter-task-list");
  if (taskList) taskList.innerHTML = presentation.chapter.tasks.map((task) => `<span class="chapter-task ${task.done ? "done" : ""}"><i>${task.done ? "✓" : ""}</i><small>${task.label}</small></span>`).join("");
  const speciesFound = knownDiscoveredBees().length + knownDiscoveredTrees().length + knownDiscoveredButterflies().length;
  const speciesTotal = Object.keys(species).length + Object.keys(treeSpecies).length + Object.keys(butterflySpecies).length;
  setText("#chapter-species-metric", `${speciesFound} / ${speciesTotal}`);
  setText("#chapter-production-metric", `${[state.machineCycles, state.squeezerCycles, state.fermenterCycles, state.distillerCycles].filter((value) => value > 0).length} / 4`);
  setText("#chapter-zone-metric", `${["forest", "plains", "swamp", "tropic"].filter(isZoneUnlocked).length} / 4`);
  setText("#chapter-synergy-metric", getEcologyBreakdown().score >= 65 ? "已建立" : "待改善");
}

function renderCommandCenter() {
  const action = getRecommendedAction();
  setText("#command-step", String(action.step).padStart(2, "0"));
  setText("#command-title", action.title);
  setText("#command-detail", action.detail);
  setText("#mobile-command-title", action.title);
  const commandButton = $("#command-action");
  if (commandButton) {
    commandButton.dataset.view = action.view;
    commandButton.dataset.target = action.target || "";
    commandButton.innerHTML = `${action.label} <span>→</span>`;
  }
  const mobileButton = $("#mobile-command-action");
  if (mobileButton) {
    mobileButton.dataset.view = action.view;
    mobileButton.dataset.target = action.target || "";
  }
  $$('[data-loop-step]').forEach((button) => {
    const step = Number(button.dataset.loopStep);
    button.classList.toggle("active", step === action.step);
    button.classList.toggle("complete", step < action.step);
  });
  const strategy = getStrategyConfig();
  setText("#strategy-name", strategy.name);
  setText("#strategy-effect", strategy.effect);
  setText("#strategy-cycle", state.strategyReady ? "周期完成 · 可切换" : `本周期剩余 ${state.strategyActionsRemaining} 次行动`);
  $$(".strategy-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.strategy === state.strategyFocus);
    button.classList.toggle("locked", !state.strategyReady && button.dataset.strategy !== state.strategyFocus);
    button.disabled = !state.strategyReady && button.dataset.strategy !== state.strategyFocus;
  });
  setText("#explore-cost-label", `手动 6–18 能源 · 自动 8–24 · ${strategy.short}策略`);
}

function getEcologyRecommendation(factor) {
  if (factor.id === "flowers") return { view: "explore", target: `.explore-button[data-zone="${flowerSources[getActiveFlowerId()].zone}"]`, label: "补充花源" };
  if (factor.id === "habitat") return { view: "apiary", target: "#habitat-select", label: "调整环境" };
  if (factor.id === "trees") return { view: "arbor", target: "#tree-countdown", label: "管理树场" };
  if (factor.id === "pollination") return { view: "codex", target: "#butterfly-breeding-panel", label: "管理蝶种" };
  if (factor.id === "pressure") return { view: "machines", target: ".machines-layout", label: "调整机器" };
  return { view: "explore", target: ".zone-grid", label: "寻找物种" };
}

function renderEcologyNetwork() {
  const ecology = getEcologyBreakdown();
  const event = getCurrentEnvironmentEvent();
  const status = ecology.score >= 85 ? "繁盛" : ecology.score >= 65 ? "稳定" : ecology.score >= 40 ? "承压" : "失衡";
  setText("#ecology-score-value", ecology.score);
  setText("#ecology-score-status", status);
  setText("#ecology-event-name", `${event.icon} ${event.name}`);
  setText("#ecology-event-detail", `${event.detail} · 剩余 ${state.environmentEvent.remaining} 个工作周期`);
  setText("#ecology-event-next", `下一事件：${environmentEventData[state.environmentEvent.next].name}`);
  const factorList = $("#ecology-factor-list");
  if (factorList) factorList.innerHTML = ecology.factors.map((factor) => `<div class="ecology-factor ${factor.value < 45 ? "warning" : ""}"><div><strong>${factor.name}</strong><small>${factor.detail}</small></div><b>${factor.value}</b><span><i style="width:${factor.value}%"></i></span></div>`).join("");
  const environment = ecology.environment;
  const metrics = [
    { id: "temperature", icon: "☀", name: "温度", value: environment.temperature, detail: "温度变化受天气、机器和冠层影响" },
    { id: "humidity", icon: "≈", name: "湿度", value: environment.humidity, detail: "冠层保湿，机器热量会使环境变干" },
    { id: "light", icon: "✦", name: "光照", value: environment.light, detail: "高冠层会遮挡花源与部分蝶种" },
    { id: "flowers", icon: "✿", name: "花源", value: environment.flowerDensity, detail: "高速蜂和高繁殖蜂会加快消耗" },
    { id: "soil", icon: "▰", name: "土壤", value: environment.soil, detail: "高生长、高产树会加快消耗" },
    { id: "leaves", icon: "♧", name: "叶压", value: environment.leafPressure, detail: "活跃蝶种提高授粉，也增加幼虫取食" },
    { id: "workshop", icon: "⚙", name: "工坊", value: environment.workshopLoad, detail: "并行机器会推高热量与生态压力" }
  ];
  const metricList = $("#environment-metric-list");
  if (metricList) metricList.innerHTML = metrics.map((metric) => `<span class="environment-metric environment-${metric.id}" title="${metric.detail}"><span class="environment-metric-head"><i aria-hidden="true">${metric.icon}</i><small>${metric.name}</small><strong>${Math.round(metric.value)}</strong></span><span class="environment-meter"><b style="width:${clamp(metric.value, 0, 100)}%"></b></span></span>`).join("");
  const advice = $("#ecology-advice-list");
  if (advice) advice.innerHTML = ecology.weak.map((factor) => {
    const action = getEcologyRecommendation(factor);
    return `<button data-eco-view="${action.view}" data-eco-target="${action.target}"><span><strong>${factor.name} ${factor.value}</strong><small>${factor.detail}</small></span><b>${action.label} →</b></button>`;
  }).join("");
}

function closeMobileMore() {
  const sheet = $("#mobile-more-sheet");
  const scrim = $("#mobile-sheet-scrim");
  const button = $("#mobile-more-button");
  if (sheet) sheet.setAttribute("aria-hidden", "true");
  if (scrim) scrim.classList.remove("visible");
  if (button) button.setAttribute("aria-expanded", "false");
  document.body.classList.remove("mobile-sheet-open");
}

function openMobileMore() {
  const sheet = $("#mobile-more-sheet");
  const scrim = $("#mobile-sheet-scrim");
  const button = $("#mobile-more-button");
  if (sheet) sheet.setAttribute("aria-hidden", "false");
  if (scrim) scrim.classList.add("visible");
  if (button) button.setAttribute("aria-expanded", "true");
  document.body.classList.add("mobile-sheet-open");
}

function navigateWithFocus(view, target = "") {
  switchView(view || "overview");
  if (target) window.setTimeout(() => focusGuideTarget(target), 120);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function getSlotMeta(slotId) {
  return saveIndex.slots.find((slot) => Number(slot.id) === Number(slotId)) || null;
}

function isSaveSlotValid(slotId) {
  const record = readJsonStorage(`${SAVE_SLOT_PREFIX}${slotId}`);
  return Boolean(record?.version === SAVE_VERSION && record.state && typeof record.state === "object" && record.state.resources && typeof record.state.resources === "object");
}

function renderStartScreen() {
  const continueButton = $("#continue-game-button");
  const lastSlot = [getSlotMeta(saveIndex.lastSlotId), ...saveIndex.slots].find((slot) => slot && isSaveSlotValid(slot.id)) || null;
  if (continueButton) continueButton.disabled = !lastSlot;
  const hint = $("#start-slot-hint");
  if (hint) hint.textContent = lastSlot
    ? `上次存档：${lastSlot.name} · ${new Date(lastSlot.updatedAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`
    : "还没有本地存档，请创建新游戏。";
}

function openStartDialog(mode = "load") {
  const modal = $("#start-dialog");
  const content = $("#start-dialog-content");
  if (!modal || !content) return;
  setText("#start-dialog-label", mode === "about" ? "PROJECT INFORMATION" : mode === "new" ? "NEW WORKSHOP" : "LOCAL ARCHIVE");
  setText("#start-dialog-title", mode === "about" ? "关于 Forestry Lab" : mode === "new" ? "选择新游戏槽位" : "加载本地存档");
  if (mode === "about") {
    content.innerHTML = `<div class="about-copy"><p>Forestry Lab 是根据 Minecraft 林业模组玩法制作的非官方学习型模拟器原型，与 Mojang、Microsoft、ForestryMC 及 FTB Wiki 无隶属或授权关系。</p><p>当前版本包含养蜂、树木、蝴蝶、环境、生产加工和区域调查等简化系统。所有进度仅保存在当前设备浏览器中。</p><p>项目中的开源像素字体按其随附许可使用；Minecraft 与 Forestry 的名称、玩法概念及参考资料权利归各自权利方。本原型没有把已下载的模组纹理直接接入游戏界面。</p><label class="simplified-setting"><input type="checkbox" data-app-setting="simplifiedSurvey" ${appSettings.simplifiedSurvey ? "checked" : ""}><span><strong>简化调查</strong><small>把 5×5 地图改为连续 5 轮的三选一资源卡，能源、奖励倍率和稀有进度保持不变。</small></span></label><div class="about-links"><a href="https://www.minecraft.net/" target="_blank" rel="noopener noreferrer">Minecraft 官网 ↗</a><a href="https://www.curseforge.com/minecraft/mc-mods/forestry" target="_blank" rel="noopener noreferrer">Forestry 模组页 ↗</a><a href="https://ftbwiki.org/Forestry" target="_blank" rel="noopener noreferrer">Forestry Wiki ↗</a><a href="https://github.com/ForestryMC/ForestryMC/tree/mc-1.12" target="_blank" rel="noopener noreferrer">ForestryMC 源码 ↗</a></div></div>`;
  } else {
    content.innerHTML = `<div class="save-slot-list">${Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => {
      const id = index + 1;
      const meta = getSlotMeta(id);
      if (!meta) return `<article class="save-slot empty"><div><span>存档槽 ${String(id).padStart(2, "0")}</span><strong>空槽位</strong><small>创建一座新的生态工坊</small></div><button data-slot-action="new" data-slot-id="${id}">新建</button></article>`;
      if (!isSaveSlotValid(id)) return `<article class="save-slot damaged"><div><span>存档槽 ${String(id).padStart(2, "0")}</span><strong>${escapeHtml(meta.name || "损坏存档")}</strong><small>存档数据无法读取，可删除后新建或导入备份。</small></div><div class="save-slot-actions"><button data-slot-action="import" data-slot-id="${id}">导入备份</button><button class="danger" data-slot-action="delete" data-slot-id="${id}">删除</button></div></article>`;
      const playedMinutes = Math.floor((Number(meta.playTime) || 0) / 60);
      return `<article class="save-slot"><div><span>存档槽 ${String(id).padStart(2, "0")}</span><strong>${escapeHtml(meta.name)}</strong><small>${escapeHtml(meta.chapter || "生态工坊")} · ${playedMinutes} 分钟 · ${new Date(meta.updatedAt).toLocaleString("zh-CN")}</small></div><div class="save-slot-actions">${mode === "new" ? `<button class="danger" data-slot-action="new" data-slot-id="${id}">覆盖新建</button>` : `<button data-slot-action="load" data-slot-id="${id}">加载</button>`}<button data-slot-action="export" data-slot-id="${id}">导出</button><button data-slot-action="rename" data-slot-id="${id}">改名</button><button class="danger" data-slot-action="delete" data-slot-id="${id}">删除</button></div></article>`;
    }).join("")}</div><div class="save-dialog-footer"><button data-slot-action="import" data-slot-id="${saveIndex.slots.length < SAVE_SLOT_COUNT ? Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => i + 1).find((id) => !getSlotMeta(id)) : 1}">导入存档文件</button><small>存档只保存在当前浏览器。建议在清理缓存前先导出备份。</small></div>`;
  }
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
}

function closeStartDialog() {
  const modal = $("#start-dialog");
  if (!modal) return;
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
}

function createNewGame(slotId) {
  const existing = getSlotMeta(slotId);
  if (existing && !window.confirm(`槽位中已有“${existing.name}”。建议先导出备份；仍要覆盖并开始新游戏吗？`)) return;
  activeSlotId = Number(slotId);
  state = structuredClone(defaultState);
  gameStarted = true;
  const current = getSlotMeta(activeSlotId);
  const meta = { id: activeSlotId, name: current?.name || `林业工坊 ${activeSlotId}`, updatedAt: Date.now(), playTime: 0, chapter: "新的林地调查" };
  saveIndex.slots = [...saveIndex.slots.filter((slot) => Number(slot.id) !== activeSlotId), meta].sort((a, b) => Number(a.id) - Number(b.id));
  saveIndex.lastSlotId = activeSlotId;
  enterGame();
  addLog("新的生态工坊已经建立，第一次森林调查已加入引导。", "teal");
  saveState(true);
}

function loadGameSlot(slotId) {
  if (!getSlotMeta(slotId)) return showToast("这个存档槽还是空的。");
  if (!isSaveSlotValid(slotId)) return showToast("这个存档已损坏，请导入备份或删除后新建。");
  if (gameStarted) saveState(true);
  activeSlotId = Number(slotId);
  state = loadState(activeSlotId);
  gameStarted = true;
  saveIndex.lastSlotId = activeSlotId;
  enterGame();
  applyOfflineProgress();
}

function enterGame() {
  gameStarted = true;
  document.body.classList.add("game-active");
  $("#start-screen")?.setAttribute("aria-hidden", "true");
  closeStartDialog();
  switchView(state.expedition ? "explore" : "overview");
  renderAll();
  if (state.expedition?.mode === "manual") openManualSurveyScreen();
  else if (state.surveyResult) showSurveyResult();
}

function exportSaveSlot(slotId) {
  const record = readJsonStorage(`${SAVE_SLOT_PREFIX}${slotId}`);
  if (!record) return showToast("没有可导出的存档。");
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `forestry-lab-slot-${slotId}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 500);
}

function renameSaveSlot(slotId) {
  const meta = getSlotMeta(slotId);
  if (!meta) return;
  const name = window.prompt("输入新的存档名称（最多 20 个字符）：", meta.name)?.trim().slice(0, 20);
  if (!name) return;
  meta.name = name;
  const record = readJsonStorage(`${SAVE_SLOT_PREFIX}${slotId}`);
  if (record) { record.meta = { ...record.meta, name }; localStorage.setItem(`${SAVE_SLOT_PREFIX}${slotId}`, JSON.stringify(record)); }
  localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(saveIndex));
  openStartDialog("load");
  renderStartScreen();
}

function deleteSaveSlot(slotId) {
  const meta = getSlotMeta(slotId);
  if (!meta || !window.confirm(`确定删除“${meta.name}”吗？未导出的进度无法恢复。`)) return;
  localStorage.removeItem(`${SAVE_SLOT_PREFIX}${slotId}`);
  saveIndex.slots = saveIndex.slots.filter((slot) => Number(slot.id) !== Number(slotId));
  if (Number(saveIndex.lastSlotId) === Number(slotId)) saveIndex.lastSlotId = saveIndex.slots[0]?.id || null;
  localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(saveIndex));
  openStartDialog("load");
  renderStartScreen();
}

function importSaveFile(file, slotId) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const importedState = parsed?.version === SAVE_VERSION && parsed.state ? parsed.state : parsed;
      if (!importedState || typeof importedState !== "object" || !importedState.resources) throw new Error("invalid");
      const targetId = Number(slotId) || 1;
      if (getSlotMeta(targetId) && !window.confirm(`导入会覆盖槽位 ${targetId}，是否继续？`)) return;
      const meta = { id: targetId, name: parsed?.meta?.name ? `${String(parsed.meta.name).slice(0, 16)} · 导入` : `导入工坊 ${targetId}`, updatedAt: Date.now(), playTime: Number(parsed?.meta?.playTime) || 0, chapter: "导入存档" };
      localStorage.setItem(`${SAVE_SLOT_PREFIX}${targetId}`, JSON.stringify({ version: SAVE_VERSION, meta, state: importedState }));
      saveIndex.slots = [...saveIndex.slots.filter((slot) => Number(slot.id) !== targetId), meta].sort((a, b) => Number(a.id) - Number(b.id));
      saveIndex.lastSlotId = targetId;
      localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(saveIndex));
      openStartDialog("load");
      renderStartScreen();
      showToast("存档导入成功");
    } catch { showToast("无法识别这个存档文件。"); }
  };
  reader.readAsText(file);
}

function renderAll() {
  renderResources();
  renderApiary();
  renderMachine();
  renderAutomation();
  renderLogs();
  renderSpecies();
  renderTree();
  renderResearch();
  renderCodex();
  renderZones();
  renderGuide();
  renderMilestones();
  renderContracts();
  renderHorizons();
  renderChapterDeck();
  renderCommandCenter();
  renderEcologyNetwork();
}

function switchView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  const codexFound = knownDiscoveredBees().length + knownDiscoveredButterflies().length + knownDiscoveredTrees().length;
  const codexTotal = Object.keys(species).length + Object.keys(butterflySpecies).length + Object.keys(treeSpecies).length;
  const labels = { overview: ["ECOLOGY COMMAND · FOREST EDGE", "生态总览"], explore: ["FIELD SURVEY · REGIONS", "野外调查"], apiary: ["APICULTURE STATION · A-01", "蜜蜂育种"], arbor: ["ARBORETUM STATION · T-01", "树木育种"], machines: ["PROCESSING FLOOR · C-01", "生产加工"], research: ["WORKSHOP RESEARCH · R-01", "研究升级"], codex: [`FIELD ARCHIVE · ${String(codexFound).padStart(2, "0")} / ${String(codexTotal).padStart(2, "0")}`, "生态档案"] };
  if (!labels[view]) return switchView("overview");
  setText("#view-eyebrow", labels[view][0]);
  setText("#view-title", labels[view][1]);
  document.body.dataset.view = view;
  const moreButton = $("#mobile-more-button");
  if (moreButton) moreButton.classList.toggle("active", view === "research" || view === "codex");
  closeMobileMore();
  if (window.matchMedia?.("(max-width: 899px)").matches) window.scrollTo({ top: 0, behavior: "smooth" });
}

function focusGuideTarget(selector) {
  $$(".guide-focus").forEach((element) => element.classList.remove("guide-focus"));
  if (!selector) return;
  const target = $(selector);
  if (!target) return;
  target.classList.add("guide-focus");
  target.scrollIntoView?.({ behavior: "smooth", block: "center" });
  window.clearTimeout(focusGuideTarget.timer);
  focusGuideTarget.timer = window.setTimeout(() => target.classList.remove("guide-focus"), 3200);
}

function handleGuideAction() {
  const action = $("#guide-action");
  const view = action.dataset.jump || "overview";
  const target = action.dataset.target || "";
  switchView(view);
  window.setTimeout(() => focusGuideTarget(target), 120);
}

let surveyStartLocked = false;
let selectedSurveyZone = "forest";
let surveyMarkingMode = false;

function hashSeed(value) {
  let hash = 2166136261;
  for (const character of String(value)) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function surveyItemLabel(item) {
  if (item.kind === "flower") return flowerSources[item.id]?.name || "花源";
  if (item.kind === "sapling") return `${treeSpecies[item.id]?.name || "树木"}树苗`;
  return resourceNames[item.id] || item.id;
}

function mergeSurveyItems(items) {
  const merged = new Map();
  (items || []).forEach((item) => {
    const amount = Math.max(0, Math.floor(Number(item.amount) || 0));
    if (!amount) return;
    const key = `${item.kind}:${item.id}`;
    if (merged.has(key)) merged.get(key).amount += amount;
    else merged.set(key, { kind: item.kind, id: item.id, amount, label: item.label || surveyItemLabel(item) });
  });
  return [...merged.values()];
}

function getSurveyRewardItems(zone, mode, seed, completion = 1, rewardSnapshot = null) {
  const config = zones[zone];
  const random = seededRandom(hashSeed(`${seed}:rewards:${mode}`));
  const proficiency = getZoneProgress(zone).proficiency;
  const modeMultiplier = mode === "auto" ? .8 + Math.min(.1, proficiency / 1000) : clamp(completion, .35, 1);
  let items = (Array.isArray(rewardSnapshot) ? rewardSnapshot : config.rewards).map((reward) => {
    const base = reward.min + Math.floor(random() * (reward.max - reward.min + 1));
    return { kind: reward.kind, id: reward.id, amount: Math.floor(base * modeMultiplier) };
  });
  if (!state.tutorialSurveyCompleted && zone === "forest" && mode === "manual") {
    items = [...items, { kind: "resource", id: "wood", amount: 8 }, { kind: "flower", id: "wildflower", amount: 3 }, { kind: "resource", id: "rawComb", amount: 1 }];
  }
  return mergeSurveyItems(items);
}

function getRareCandidates(zone) {
  const candidates = {
    plains: [{ kind: "butterfly", id: "brimstone" }],
    swamp: [{ kind: "bee", id: "common" }, { kind: "butterfly", id: "swallow" }, { kind: "tree", id: "jungle" }],
    tropic: [{ kind: "bee", id: "tropical" }, { kind: "butterfly", id: "atlas" }, { kind: "tree", id: "teak" }],
    snow: [{ kind: "tree", id: "pine" }],
    cave: [{ kind: "butterfly", id: "morpho" }]
  }[zone] || [];
  return candidates.filter((candidate) => {
    if (candidate.kind === "bee") return !state.discovered.includes(candidate.id);
    if (candidate.kind === "tree") return !state.treeDiscovered.includes(candidate.id);
    return !state.butterflyDiscovered.includes(candidate.id);
  });
}

function discoverSurveyRare(zone, mode, seed, guaranteed = false) {
  const candidates = getRareCandidates(zone);
  if (!candidates.length) return [];
  const random = seededRandom(hashSeed(`${seed}:rare:${getZoneVisits(zone)}`));
  const chance = mode === "manual" ? .135 : .1;
  if (!guaranteed && random() >= chance) return [];
  const candidate = candidates[Math.floor(random() * candidates.length)];
  if (candidate.kind === "bee") state.discovered.push(candidate.id);
  if (candidate.kind === "butterfly") state.butterflyDiscovered.push(candidate.id);
  if (candidate.kind === "tree") {
    state.treeDiscovered.push(candidate.id);
    state.treeSaplings[candidate.id] = (state.treeSaplings[candidate.id] || 0) + 1;
  }
  const source = candidate.kind === "bee" ? species : candidate.kind === "tree" ? treeSpecies : butterflySpecies;
  return [source[candidate.id]?.name || candidate.id];
}

function completeSurveyProgress(zone, mode, seed, yieldCount, clues = 0) {
  const progress = getZoneProgress(zone);
  const rareDelta = mode === "manual" ? 16 + clues * 4 : 8;
  const oldRare = progress.rareProgress;
  progress[mode === "manual" ? "manualRuns" : "autoRuns"] += 1;
  progress.proficiency = clamp(progress.proficiency + (mode === "manual" ? 8 : 5), 0, 100);
  progress.rareProgress = clamp(progress.rareProgress + rareDelta, 0, 100);
  progress.bestYield = Math.max(progress.bestYield, yieldCount);
  state.explorations += 1;
  state.explorationCounts[zone] = getZoneVisits(zone) + 1;
  const guaranteed = progress.rareProgress >= 100;
  const discoveries = discoverSurveyRare(zone, mode, seed, guaranteed);
  if (guaranteed) progress.rareProgress = discoveries.length ? 0 : 100;
  const environment = state.zoneEnvironments[zone] || (state.zoneEnvironments[zone] = { ...defaultState.zoneEnvironments[zone] });
  environment.flowerDensity = clamp(environment.flowerDensity + 5, 0, 100);
  environment.soil = clamp(environment.soil + 1, 0, 100);
  return { rareDelta, discoveries, previousRare: oldRare };
}

function openSurveyConfirm(zone) {
  if (!isZoneUnlocked(zone)) return showToast(`尚未开放：${zones[zone]?.unlockText || "继续推进工坊"}`);
  if (state.expedition) return openManualSurveyScreen();
  if (state.surveyResult) return showSurveyResult();
  if (state.autoSurvey) return showToast(`自动调查队列正在${zones[state.autoSurvey.zone]?.name || "其他区域"}运行，请先完成当前队列。`);
  selectedSurveyZone = zone;
  const config = zones[zone];
  const progress = getZoneProgress(zone);
  setText("#survey-confirm-title", `${config.name} · 调查简报`);
  const content = $("#survey-confirm-content");
  content.innerHTML = `<div class="survey-brief-grid"><div><span>难度</span><strong>${["I", "II", "III", "IV", "V"][config.difficulty - 1]}</strong></div><div><span>环境</span><strong>${config.temperature} · ${config.humidity}</strong></div><div><span>调查次数</span><strong>${getZoneVisits(zone)}</strong></div><div><span>熟练 / 稀有</span><strong>${progress.proficiency}% / ${progress.rareProgress}%</strong></div></div><div class="survey-reward-preview"><span class="mini-label">POSSIBLE REWARDS</span><p>${config.rewards.map((item) => `${surveyItemLabel(item)} ${item.min}–${item.max}`).join(" · ")}</p><small>木材分区 ${getWarehouseLoad("wood")} / ${getWarehouseCapacity("wood")} · 调查暂存 ${state.pendingSurvey.length} 类</small></div><div class="survey-mode-grid"><label class="survey-mode active"><input type="radio" name="survey-mode" value="manual" checked><span><b>手动调查</b><small>能源 ${config.manualEnergy} · 5×5 回合地图 · 稀有权重 1.35</small></span></label><label class="survey-mode"><input type="radio" name="survey-mode" value="auto"><span><b>自动调查</b><small>每次能源 ${config.autoEnergy} · ${config.autoDuration}s · 常规产量约 80%</small></span></label></div><div class="auto-count-control" id="auto-count-control" hidden><span>连续调查</span><div>${[1, 3, 5].map((count) => `<label><input type="radio" name="auto-count" value="${count}" ${count === 1 ? "checked" : ""}>${count} 次</label>`).join("")}</div><small>每轮开始时扣除能源；能源达到保留线时自动暂停。</small></div><div class="survey-confirm-actions"><button id="survey-confirm-cancel">返回</button><button class="primary-button" id="survey-start-button">开始手动调查 <span>→</span></button></div>`;
  const modal = $("#survey-confirm-modal");
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
}

function closeSurveyConfirm() {
  const modal = $("#survey-confirm-modal");
  modal?.classList.remove("visible");
  modal?.setAttribute("aria-hidden", "true");
}

function generateManualExpedition(zone) {
  const config = zones[zone];
  const tutorial = !state.tutorialSurveyCompleted && zone === "forest";
  const seed = tutorial ? hashSeed(`tutorial:${activeSlotId}`) : hashSeed(`${activeSlotId}:${zone}:${getZoneVisits(zone)}:${Date.now()}`);
  const random = seededRandom(seed);
  const guaranteedPath = new Set([22, 17, 12, 13]);
  const resourcePositions = new Set([17, 12, 13]);
  const cluePositions = new Set([8, 16]);
  const blockedCount = 3 + config.difficulty;
  const blocked = new Set();
  while (blocked.size < blockedCount) {
    const index = Math.floor(random() * 25);
    if (index !== 22 && !guaranteedPath.has(index) && !cluePositions.has(index)) blocked.add(index);
  }
  const rough = new Set();
  while (rough.size < 3 + config.difficulty) {
    const index = Math.floor(random() * 25);
    if (!blocked.has(index) && !resourcePositions.has(index) && index !== 22) rough.add(index);
  }
  const tiles = Array.from({ length: 25 }, (_, index) => ({
    type: index === 22 ? "camp" : blocked.has(index) ? "blocked" : resourcePositions.has(index) ? "resource" : cluePositions.has(index) ? "clue" : rough.has(index) ? "rough" : "path",
    cost: rough.has(index) ? 2 : index === 22 ? 0 : 1,
    collected: false,
    revealed: index === 22 || [17, 21, 23].includes(index),
    marked: false
  }));
  return { id: `manual-${seed}`, zone, mode: "manual", status: "active", seed, energyPaid: config.manualEnergy, surveyPoints: config.surveyPoints, position: 22, revealed: tiles.map((tile, index) => tile.revealed ? index : null).filter((value) => value !== null), bag: [], foundNodes: 0, clues: 0, tiles, rewardSnapshot: structuredClone(config.rewards), unlockSnapshot: isZoneUnlocked(zone), simplified: appSettings.simplifiedSurvey, simpleRounds: 0, startedAt: Date.now() };
}

function startManualSurvey(zone) {
  if (surveyStartLocked) return;
  const cost = getExploreEnergyCost(zone, "manual");
  if (state.resources.energy < cost) return showToast(`能源不足，需要 ${cost} 点。`);
  surveyStartLocked = true;
  state.resources.energy -= cost;
  state.expedition = generateManualExpedition(zone);
  state.tutorialSurveyCompleted = state.tutorialSurveyCompleted === true;
  consumeStrategyAction();
  closeSurveyConfirm();
  saveState(true);
  openManualSurveyScreen();
  window.setTimeout(() => { surveyStartLocked = false; }, 350);
}

function openManualSurveyScreen() {
  const expedition = state.expedition;
  if (!expedition) return;
  const screen = $("#manual-survey-screen");
  screen.classList.add("visible");
  screen.setAttribute("aria-hidden", "false");
  document.body.classList.add("survey-open");
  renderManualSurvey();
}

function revealSurveyNeighbors(position, limit = 4) {
  const expedition = state.expedition;
  const x = position % 5;
  const y = Math.floor(position / 5);
  const neighbors = [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]].filter(([nx, ny]) => nx >= 0 && nx < 5 && ny >= 0 && ny < 5).map(([nx, ny]) => ny * 5 + nx);
  neighbors.slice(0, limit).forEach((index) => { expedition.tiles[index].revealed = true; });
  expedition.revealed = expedition.tiles.map((tile, index) => tile.revealed ? index : null).filter((value) => value !== null);
}

function renderManualSurvey() {
  const expedition = state.expedition;
  if (!expedition) return;
  const config = zones[expedition.zone];
  setText("#survey-zone-label", `FIELD SURVEY · DIFFICULTY ${["I", "II", "III", "IV", "V"][config.difficulty - 1]}`);
  setText("#survey-zone-title", `${config.name}调查`);
  setText("#survey-points-value", expedition.surveyPoints);
  const map = $("#survey-map");
  if (expedition.simplified) {
    const round = Math.max(0, Number(expedition.simpleRounds) || 0);
    const choices = [
      { id: "material", icon: "◆", title: "采集材料", detail: "稳定取得一组区域样本" },
      { id: "flower", icon: "✿", title: "记录花源", detail: "偏向生态与花源样本" },
      { id: "clue", icon: "?", title: "追踪线索", detail: "取得样本并追加稀有进度" }
    ];
    const shift = hashSeed(`${expedition.seed}:${round}`) % choices.length;
    const ordered = [...choices.slice(shift), ...choices.slice(0, shift)];
    map.classList.add("simplified-map");
    map.innerHTML = ordered.map((choice) => `<button class="simple-survey-choice" data-simple-choice="${choice.id}"><i>${choice.icon}</i><strong>${choice.title}</strong><small>${choice.detail}</small></button>`).join("");
    $(".survey-legend")?.classList.add("simplified-hidden");
    $("#survey-bag-list").innerHTML = `<span>选择轮次 <strong>${round} / 5</strong></span><span>资源样本 <strong>${expedition.foundNodes}</strong></span><span>生态线索 <strong>${expedition.clues}</strong></span><small>每轮选择一张卡；完成 5 轮后自动结算。</small>`;
    setText("#survey-status-title", `简化调查 · 第 ${Math.min(5, round + 1)} 轮`);
    setText("#survey-status-text", "三种路线都能取得常规样本；追踪线索会额外增加本次稀有进度。选择结果会立即保存。");
    $("#survey-scan-button").disabled = true;
    $("#survey-mark-button").disabled = true;
    return;
  }
  map.classList.remove("simplified-map");
  $(".survey-legend")?.classList.remove("simplified-hidden");
  $("#survey-mark-button").disabled = false;
  const icons = { camp: "⌂", path: "·", resource: "◆", clue: "?", rough: "≋", blocked: "■" };
  map.innerHTML = expedition.tiles.map((tile, index) => {
    const current = index === expedition.position;
    const hidden = !tile.revealed;
    return `<button role="gridcell" data-tile-index="${index}" class="survey-tile ${hidden ? "hidden" : tile.type} ${current ? "current" : ""} ${tile.collected ? "collected" : ""} ${tile.marked ? "marked" : ""}" aria-label="${hidden ? "未调查地块" : tile.type}">${hidden ? "" : current ? "●" : icons[tile.type]}</button>`;
  }).join("");
  $("#survey-bag-list").innerHTML = `<span>资源节点 <strong>${expedition.foundNodes} / 3</strong></span><span>生态线索 <strong>${expedition.clues}</strong></span>${expedition.foundNodes >= 3 ? "<small>主要样本已收集，可以安全结束调查。</small>" : "<small>至少找到 3 个资源节点可取得完整基础产量。</small>"}`;
  setText("#survey-status-title", surveyMarkingMode ? "选择要标记的地块" : expedition.surveyPoints > 0 ? "调查进行中" : "调查点已用尽");
  setText("#survey-status-text", `移动到相邻地块会消耗其调查点；复杂地形消耗 2 点。当前已揭示 ${expedition.revealed.length} / 25。`);
  $("#survey-scan-button").disabled = expedition.surveyPoints < 1;
}

function handleSimplifiedSurveyChoice(choice) {
  const expedition = state.expedition;
  if (!expedition?.simplified || expedition.simpleRounds >= 5) return;
  expedition.simpleRounds += 1;
  expedition.surveyPoints = Math.max(0, expedition.surveyPoints - 1);
  expedition.foundNodes += 1;
  if (choice === "clue") expedition.clues += 1;
  expedition.bag.push({ choice, round: expedition.simpleRounds });
  saveState(true);
  if (expedition.simpleRounds >= 5) return window.setTimeout(() => finishManualSurvey(false), 120);
  renderManualSurvey();
}

function handleSurveyTile(index) {
  const expedition = state.expedition;
  const tile = expedition?.tiles?.[index];
  if (!tile) return;
  if (surveyMarkingMode) {
    tile.marked = !tile.marked;
    surveyMarkingMode = false;
    saveState();
    return renderManualSurvey();
  }
  const currentX = expedition.position % 5;
  const currentY = Math.floor(expedition.position / 5);
  const nextX = index % 5;
  const nextY = Math.floor(index / 5);
  if (!tile.revealed || Math.abs(currentX - nextX) + Math.abs(currentY - nextY) !== 1) return showToast("只能移动到上下左右相邻的已揭示地块。");
  if (tile.type === "blocked") return showToast("这块地形无法通行，请寻找其他路线。");
  if (expedition.surveyPoints < tile.cost) return showToast("调查点不足，可以结束调查并带回已有样本。");
  expedition.surveyPoints -= tile.cost;
  expedition.position = index;
  if (tile.type === "resource" && !tile.collected) { tile.collected = true; expedition.foundNodes += 1; showToast("发现一个资源节点"); }
  if (tile.type === "clue" && !tile.collected) { tile.collected = true; expedition.clues += 1; showToast("记录生态线索：稀有进度额外 +4"); }
  revealSurveyNeighbors(index);
  saveState();
  renderManualSurvey();
  if (expedition.surveyPoints <= 0) window.setTimeout(() => finishManualSurvey(false), 250);
}

function scanSurveyArea() {
  const expedition = state.expedition;
  if (!expedition || expedition.surveyPoints < 1) return showToast("调查点不足。");
  expedition.surveyPoints -= 1;
  const hidden = expedition.tiles.map((tile, index) => !tile.revealed ? index : null).filter((value) => value !== null).sort((a, b) => Math.abs(a - expedition.position) - Math.abs(b - expedition.position)).slice(0, 3);
  hidden.forEach((index) => { expedition.tiles[index].revealed = true; });
  expedition.revealed = expedition.tiles.map((tile, index) => tile.revealed ? index : null).filter((value) => value !== null);
  saveState();
  renderManualSurvey();
}

function finishManualSurvey(requireConfirm = true) {
  const expedition = state.expedition;
  if (!expedition) return;
  if (requireConfirm && !window.confirm(`${expedition.foundNodes < 3 ? "主要资源节点还没有全部找到，提前撤离会降低基础产量。\n" : ""}撤离并保留当前收获？选择取消可继续调查。`)) return;
  const completion = expedition.foundNodes / 3;
  const items = getSurveyRewardItems(expedition.zone, "manual", expedition.seed, completion, expedition.rewardSnapshot);
  const yieldCount = items.reduce((sum, item) => sum + item.amount, 0);
  const progress = completeSurveyProgress(expedition.zone, "manual", expedition.seed, yieldCount, expedition.clues);
  state.tutorialSurveyCompleted = true;
  state.surveyResult = { id: `result-${expedition.id}`, zone: expedition.zone, mode: "manual", energyPaid: expedition.energyPaid, items, discoveries: progress.discoveries, rareDelta: progress.rareDelta, claimed: false, createdAt: Date.now() };
  state.expedition = null;
  $("#manual-survey-screen")?.classList.remove("visible");
  $("#manual-survey-screen")?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("survey-open");
  addLog(`完成${zones[state.surveyResult.zone].name}手动调查，带回 ${yieldCount} 份样本。`, "teal");
  saveState(true);
  renderAll();
  showSurveyResult();
}

function startAutoSurvey(zone, count) {
  if (surveyStartLocked || state.autoSurvey) return showToast("已有自动调查队列正在运行。");
  const cost = getExploreEnergyCost(zone, "auto");
  if (state.resources.energy < cost || state.resources.energy - cost < getAutomationReserveEnergy()) return showToast(`能源不足或将低于保留线；首轮需要 ${cost} 点。`);
  surveyStartLocked = true;
  state.resources.energy -= cost;
  const seed = hashSeed(`${activeSlotId}:${zone}:auto:${getZoneVisits(zone)}:${Date.now()}`);
  state.autoSurvey = { id: `auto-${seed}`, zone, mode: "auto", status: "active", seed, energyPerRun: cost, energyPaid: cost, totalRuns: count, completedRuns: 0, remaining: zones[zone].autoDuration, completedItems: [], discoveries: [], rewardSnapshot: structuredClone(zones[zone].rewards), unlockSnapshot: isZoneUnlocked(zone), paused: false, pausedReason: "", startedAt: Date.now() };
  consumeStrategyAction();
  closeSurveyConfirm();
  saveState(true);
  renderAll();
  showToast(`已安排 ${count} 次${zones[zone].name}自动调查`);
  window.setTimeout(() => { surveyStartLocked = false; }, 350);
}

function finishAutoSurveyRun() {
  const auto = state.autoSurvey;
  if (!auto) return;
  const runSeed = hashSeed(`${auto.seed}:${auto.completedRuns}`);
  const items = getSurveyRewardItems(auto.zone, "auto", runSeed, 1, auto.rewardSnapshot);
  auto.completedItems = mergeSurveyItems([...auto.completedItems, ...items]);
  const yieldCount = items.reduce((sum, item) => sum + item.amount, 0);
  const progress = completeSurveyProgress(auto.zone, "auto", runSeed, yieldCount, 0);
  auto.discoveries.push(...progress.discoveries);
  auto.completedRuns += 1;
  if (auto.completedRuns >= auto.totalRuns) {
    state.surveyResult = { id: `result-${auto.id}`, zone: auto.zone, mode: "auto", energyPaid: auto.energyPaid, items: auto.completedItems, discoveries: [...new Set(auto.discoveries)], rareDelta: auto.completedRuns * 8, claimed: false, createdAt: Date.now() };
    state.autoSurvey = null;
    addLog(`自动调查队列完成：${zones[auto.zone].name} ${auto.completedRuns} 次。`, "teal");
    saveState(true);
    if (gameStarted && document.visibilityState !== "hidden") showSurveyResult();
    return;
  }
  const warehouseBlocker = auto.completedItems.find((item) => item.kind === "resource" && item.id !== "energy" && item.amount > getWarehouseSpace(item.id));
  if (warehouseBlocker) {
    auto.paused = true;
    auto.pauseType = "warehouse";
    auto.pausedReason = `${surveyItemLabel(warehouseBlocker)}分区空间不足 · 请先整理本轮物资`;
    return;
  }
  const cost = auto.energyPerRun;
  if (state.resources.energy < cost || state.resources.energy - cost < getAutomationReserveEnergy()) {
    auto.paused = true;
    auto.pauseType = "energy";
    auto.pausedReason = `能源保留线 ${getAutomationReserveEnergy()} · 等待恢复`;
    return;
  }
  state.resources.energy -= cost;
  auto.energyPaid += cost;
  auto.remaining = zones[auto.zone].autoDuration;
}

function advanceAutoSurvey(seconds, offline = false) {
  const auto = state.autoSurvey;
  if (!auto) return;
  if (auto.userPaused) return;
  if (auto.paused) {
    if (auto.pauseType === "warehouse") return;
    if (state.resources.energy >= auto.energyPerRun && state.resources.energy - auto.energyPerRun >= getAutomationReserveEnergy()) {
      auto.paused = false;
      auto.pauseType = "";
      auto.pausedReason = "";
      state.resources.energy -= auto.energyPerRun;
      auto.energyPaid += auto.energyPerRun;
      auto.remaining = zones[auto.zone].autoDuration;
    } else return;
  }
  let remainingSeconds = Math.max(0, Number(seconds) || 0);
  let completedThisPass = 0;
  while (state.autoSurvey && !state.autoSurvey.paused && !state.autoSurvey.userPaused && remainingSeconds > 0 && completedThisPass < (offline ? 5 : 1)) {
    const step = Math.min(remainingSeconds, state.autoSurvey.remaining);
    state.autoSurvey.remaining -= step;
    remainingSeconds -= step;
    if (state.autoSurvey.remaining <= 0) { completedThisPass += 1; finishAutoSurveyRun(); }
    else break;
  }
}

function applySurveyItem(item) {
  if (item.kind === "flower") {
    state.flowerInventory[item.id] = getFlowerCount(item.id) + item.amount;
    return { accepted: item.amount, overflow: 0 };
  }
  if (item.kind === "sapling") {
    if (treeSpecies[item.id] && !state.treeDiscovered.includes(item.id)) state.treeDiscovered.push(item.id);
    state.treeSaplings[item.id] = getTreeSaplingCount(item.id) + item.amount;
    return { accepted: item.amount, overflow: 0 };
  }
  const result = addToWarehouse(item.id, item.amount);
  if (item.id === "rawComb") state.totalCombCollected += result.accepted;
  return result;
}

function claimSurveyItems(items) {
  const overflow = [];
  let accepted = 0;
  mergeSurveyItems(items).forEach((item) => {
    const result = applySurveyItem(item);
    accepted += result.accepted;
    if (result.overflow > 0) overflow.push({ ...item, amount: result.overflow });
  });
  return { accepted, overflow: mergeSurveyItems(overflow) };
}

function claimSurveyResult() {
  const result = state.surveyResult;
  if (!result) return;
  if (state.claimedResultIds.includes(result.id)) {
    state.surveyResult = null;
    closeSurveyResult();
    return;
  }
  const claim = claimSurveyItems(result.items);
  state.pendingSurvey = mergeSurveyItems([...(state.pendingSurvey || []), ...claim.overflow]);
  state.claimedResultIds = [...state.claimedResultIds, result.id].slice(-80);
  result.claimed = true;
  state.surveyResult = null;
  saveState(true);
  closeSurveyResult();
  renderAll();
  showToast(claim.overflow.length ? `已入库 ${claim.accepted} 份；溢出物资保留在调查暂存箱。` : `全部 ${claim.accepted} 份调查物资已入库。`);
}

function claimPendingSurvey() {
  if (!state.pendingSurvey?.length) return;
  const claim = claimSurveyItems(state.pendingSurvey);
  state.pendingSurvey = claim.overflow;
  saveState(true);
  renderAll();
  showToast(claim.overflow.length ? `已整理 ${claim.accepted} 份，剩余物资仍在暂存箱。` : "调查暂存物资已全部入库。");
}

function showSurveyResult() {
  const result = state.surveyResult;
  if (!result) return;
  const config = zones[result.zone];
  setText("#survey-result-title", `${config.name} · 调查完成`);
  $("#survey-result-content").innerHTML = `<div class="result-summary"><div><span>调查模式</span><strong>${result.mode === "manual" ? "手动调查" : "自动调查"}</strong></div><div><span>能源消耗</span><strong>${result.energyPaid}</strong></div><div><span>稀有进度</span><strong>+${Math.max(0, result.rareDelta)}%</strong></div></div><div class="result-items"><span class="mini-label">SURVEY BAG</span>${result.items.length ? result.items.map((item) => `<div><span>${escapeHtml(item.label || surveyItemLabel(item))}</span><strong>×${item.amount}</strong></div>`).join("") : "<p>本次没有采集到可带回的物资。</p>"}</div>${result.discoveries?.length ? `<div class="result-discovery"><span>NEW SPECIES</span><strong>${result.discoveries.map(escapeHtml).join(" · ")}</strong></div>` : ""}<p class="result-note">仓库已满的物资会自动转入调查暂存箱，不会丢失。</p><div class="result-actions"><button data-result-action="return">返回区域</button><button data-result-action="warehouse">打开仓库</button><button data-result-action="repeat">再次调查</button><button class="primary-button" data-result-action="claim">全部入库 <span>→</span></button></div>`;
  const modal = $("#survey-result-modal");
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
}

function closeSurveyResult() {
  const modal = $("#survey-result-modal");
  modal?.classList.remove("visible");
  modal?.setAttribute("aria-hidden", "true");
}

function explore(zone) { openSurveyConfirm(zone); }

function collectApiary() {
  if (state.apiaryReady === 0) return showToast("蜂箱还没有准备好产物。");
  const amount = state.apiaryReady;
  const blocker = getWarehouseBundleBlocker({ rawComb: amount });
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  addToWarehouse("rawComb", amount);
  state.totalCombCollected += amount;
  state.apiaryCombCollected += amount;
  state.apiaryReady = 0;
  consumeStrategyAction();
  addLog(`蜂箱 A-01 收取 ${amount} 个蜂巢，已送入仓库。`, "amber");
  showToast(`收取成功：${amount} 个蜂巢`);
  renderAll();
}

function analyzeSpecies(id) {
  if (!state.discovered.includes(id)) return showToast("还没有发现这个蜂种。");
  if (state.analyzed.includes(id)) return showToast(`${species[id].name} 已经分析完成。`);
  state.analyzed.push(id);
  consumeStrategyAction();
  addLog(`分析完成：${species[id].name} 的速度、寿命和花源属性已记录。`, "green");
  showToast(`已分析 ${species[id].name}`);
  renderAll();
}

function analyzeButterfly(id) {
  if (!state.butterflyDiscovered.includes(id)) return showToast("还没有发现这个蝶种。");
  if (state.butterflyAnalyzed.includes(id)) return showToast(`${butterflySpecies[id].name} 已经观察完成。`);
  state.butterflyAnalyzed.push(id);
  consumeStrategyAction();
  addLog(`观察完成：${butterflySpecies[id].name} 的稀有度和授粉属性已记录。`, "teal");
  showToast(`已记录 ${butterflySpecies[id].name}`);
  renderAll();
}

function selectButterflyBreedingParent(slot, id) {
  if (state.butterflyBreeding) return showToast("蝶蛹培育进行中，完成后再更换亲本。");
  if (!knownDiscoveredButterflies().includes(id)) return showToast("这个蝶种还没有进入图鉴。");
  state.butterflyBreedingParents[slot] = id;
  saveState();
  renderAll();
}

function selectBreedingParent(slot, id) {
  if (state.breeding) return showToast("杂交进行中，完成后再更换亲本。");
  if (!knownDiscoveredBees().includes(id)) return showToast("这个蜂种还没有进入图鉴。");
  state.breedingParents[slot] = id;
  saveState();
  renderAll();
}

function analyzeTree(id) {
  if (!state.treeDiscovered.includes(id)) return showToast("还没有发现这棵树。");
  if (state.treeAnalyzed.includes(id)) return showToast(`${treeSpecies[id].name} 已经分析完成。`);
  state.treeAnalyzed.push(id);
  consumeStrategyAction();
  addLog(`树苗分析完成：${treeSpecies[id].name} 的生长和木材属性已记录。`, "green");
  showToast(`已分析 ${treeSpecies[id].name}`);
  renderAll();
}

function selectTreeBreedingParent(slot, id) {
  if (state.treeBreeding) return showToast("树苗培育进行中，完成后再更换亲本。");
  if (!knownDiscoveredTrees().includes(id)) return showToast("这棵树还没有进入图鉴。");
  state.treeBreedingParents[slot] = id;
  saveState();
  renderAll();
}

function collectTree() {
  if (state.treeReady === 0) return showToast("树场还没有准备好木材。");
  const amount = getTreeYieldAmount();
  const resinAmount = Math.max(0, Number(state.treeReadyResin) || 0);
  const blocker = getWarehouseBundleBlocker({ wood: amount, resin: resinAmount });
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  addToWarehouse("wood", amount);
  if (resinAmount > 0) addToWarehouse("resin", resinAmount);
  state.treeReady = 0;
  state.treeReadyYield = 0;
  state.treeReadyResin = 0;
  state.treeHarvests += 1;
  consumeStrategyAction();
  addLog(`树场 T-01 收取木材 ${amount}${resinAmount > 0 ? `、树脂 ${resinAmount}` : ""}，产物已入库。`, "green");
  showToast(`收取成功：${amount} 木材${resinAmount > 0 ? `、${resinAmount} 树脂` : ""}`);
  renderAll();
}

function startTreeBreeding() {
  if (state.treeBreeding) return showToast("树苗培育正在进行中。");
  const parentA = getTreeParentId("parentA", "oak");
  const parentB = getTreeParentId("parentB", "birch");
  const recipe = getTreeBreedingRecipe(parentA, parentB);
  if (!recipe) return showToast("这组树木亲本的培育路径还没有记录，继续探索或更换亲本。");
  const missing = [parentA, parentB].filter((id) => !state.treeAnalyzed.includes(id));
  if (missing.length) return showToast(`先分析树苗：${missing.map((id) => treeSpecies[id].name).join("、")}。`);
  if (getUpgradeLevel("treeFarm") < recipe.requiresTreeFarm) return showToast(`需要将树场升级到 LV.${recipe.requiresTreeFarm}。`);
  if (state.resources.wood < 4) return showToast("木材不足，需要 4 木材准备培育槽。");
  const saplingCost = getTreeSaplingCost(parentA, parentB);
  const missingSaplings = getMissingTreeSaplings(saplingCost);
  if (missingSaplings.length) return showToast(`树苗不足：${missingSaplings.map(([id, amount]) => `${treeSpecies[id].name} ×${amount}`).join("、")}。`);
  state.resources.wood -= 4;
  Object.entries(saplingCost).forEach(([id, amount]) => { state.treeSaplings[id] = getTreeSaplingCount(id) - amount; });
  state.treeBreedingAttempts += 1;
  state.treeBreedingFailures = getBreedingFailureCount("tree", parentA, parentB);
  state.treeBreeding = { remaining: recipe.time, parentA, parentB, result: recipe.result, chance: getMutationChance(recipe, "tree", parentA, parentB) };
  consumeStrategyAction();
  addLog(`${treeSpecies[parentA].name} × ${treeSpecies[parentB].name} 培育开始，目标：${treeSpecies[recipe.result].name}。`, "amber");
  showToast(`树苗培育开始：${recipe.time} 秒后查看结果。`);
  renderAll();
}

function finishTreeBreeding() {
  const breeding = state.treeBreeding;
  const resultId = breeding?.result || "larch";
  const result = treeSpecies[resultId] || treeSpecies.larch;
  const parentA = breeding?.parentA || "oak";
  const parentB = breeding?.parentB || "birch";
  const recipe = getTreeBreedingRecipe(parentA, parentB);
  const storedChance = Number(breeding?.chance);
  const chance = Number.isFinite(storedChance) ? clamp(storedChance, 0, 95) : (getMutationChance(recipe, "tree", parentA, parentB) || (resultId === "teak" ? 16 : 28));
  state.treeBreeding = null;
  if (Math.random() < chance / 100) {
    state.treeCycles += 1;
    setBreedingFailureCount("tree", parentA, parentB, 0);
    if (!state.treeDiscovered.includes(resultId)) {
      state.treeDiscovered.push(resultId);
      state.treeSaplings[resultId] = (state.treeSaplings[resultId] || 0) + 1;
      addLog(`发现新树种：${result.name}。树木图鉴已更新。`, "green");
      showToast(`发现新树种：${result.name}`);
    } else {
      state.treeSaplings[resultId] = (state.treeSaplings[resultId] || 0) + 1;
      addLog(`树苗培育完成，获得一棵${result.name}树苗。`, "green");
      showToast(`培育完成：获得${result.name}树苗`);
    }
  } else {
    const nextFailureCount = getBreedingFailureCount("tree", parentA, parentB) + 1;
    setBreedingFailureCount("tree", parentA, parentB, nextFailureCount);
    addLog(`树苗培育未形成稳定后代，本次概率 ${chance}%，下次保底提高 10%。`, "amber");
    showToast(`培育未成功：下次概率提升至 ${getMutationChance(recipe, "tree", parentA, parentB)}%`);
  }
  renderAll();
}

function startBreeding() {
  if (state.breeding) return showToast("杂交正在进行中。");
  const princess = getParentId("princess", "forest");
  const drone = getParentId("drone", "meadows");
  const recipe = getBreedingRecipe(princess, drone);
  if (!recipe) return showToast("这组亲本的突变路径还没有记录，继续探索或更换亲本。");
  const missing = [princess, drone].filter((id) => !state.analyzed.includes(id));
  if (missing.length) return showToast(`先分析亲本：${missing.map((id) => species[id].name).join("、")}。`);
  if (getUpgradeLevel("apiary") < recipe.requiresApiary) return showToast(`需要将养蜂箱升级到 LV.${recipe.requiresApiary}。`);
  state.breedingAttempts += 1;
  state.breedingFailures = getBreedingFailureCount("bee", princess, drone);
  state.breeding = { remaining: recipe.time, princess, drone, result: recipe.result, chance: getMutationChance(recipe, "bee", princess, drone) };
  consumeStrategyAction();
  addLog(`${species[princess].name} × ${species[drone].name} 杂交开始，目标：${species[recipe.result].name}。`, "amber");
  showToast(`杂交开始：${recipe.time} 秒后查看结果。`);
  renderAll();
}

function finishBreeding() {
  const breeding = state.breeding;
  const resultId = breeding?.result || "cultivated";
  const result = species[resultId] || species.cultivated;
  const princess = breeding?.princess || "forest";
  const drone = breeding?.drone || "meadows";
  const recipe = getBreedingRecipe(princess, drone);
  const storedChance = Number(breeding?.chance);
  const chance = Number.isFinite(storedChance) ? clamp(storedChance, 0, 95) : (getMutationChance(recipe, "bee", princess, drone) || (resultId === "noble" ? 18 : 32));
  state.breeding = null;
  if (Math.random() < chance / 100) {
    state.breedings += 1;
    setBreedingFailureCount("bee", princess, drone, 0);
    if (!state.discovered.includes(resultId)) {
      state.discovered.push(resultId);
      addLog(`发现新蜂种：${result.name}。图鉴已更新。`, "green");
      showToast(`发现新蜂种：${result.name}`);
    } else {
      addLog(`杂交完成，${result.name} 的属性得到轻微提升。`, "green");
      showToast(`杂交完成：获得${result.name}`);
    }
  } else {
    const nextFailureCount = getBreedingFailureCount("bee", princess, drone) + 1;
    setBreedingFailureCount("bee", princess, drone, nextFailureCount);
    addLog(`杂交未形成稳定后代，本次概率 ${chance}%，下次保底提高 10%。`, "amber");
    showToast(`杂交未成功：下次概率提升至 ${getMutationChance(recipe, "bee", princess, drone)}%`);
  }
  renderAll();
}

function startButterflyBreeding() {
  if (state.butterflyBreeding) return showToast("蝶蛹培育正在进行中。");
  const known = knownDiscoveredButterflies();
  const parentA = getButterflyParentId("parentA", known[0] || "azure");
  const parentB = getButterflyParentId("parentB", known[1] || parentA);
  const recipe = getButterflyBreedingRecipe(parentA, parentB);
  if (!recipe) return showToast("这组蝶种的杂交路径还没有记录，继续观察或更换亲本。");
  const missing = [parentA, parentB].filter((id) => !state.butterflyAnalyzed.includes(id));
  if (missing.length) return showToast(`先观察亲本：${missing.map((id) => butterflySpecies[id].name).join("、")}。`);
  if (state.butterflyAnalyzed.length < recipe.requiresObservation) return showToast(`还需要观察 ${recipe.requiresObservation - state.butterflyAnalyzed.length} 个蝶种，才能稳定培育这条路径。`);
  const flowerId = getActiveFlowerId();
  if (getFlowerCount(flowerId) < 1) return showToast(`当前${flowerSources[flowerId].name}不足，需要探索补充花源。`);
  state.flowerInventory[flowerId] = getFlowerCount(flowerId) - 1;
  state.butterflyBreedingAttempts += 1;
  state.butterflyBreedingFailures = getBreedingFailureCount("butterfly", parentA, parentB);
  state.butterflyBreeding = { remaining: recipe.time, parentA, parentB, result: recipe.result, chance: getMutationChance(recipe, "butterfly", parentA, parentB) };
  consumeStrategyAction();
  addLog(`${butterflySpecies[parentA].name} × ${butterflySpecies[parentB].name} 蝶蛹培育开始，目标：${butterflySpecies[recipe.result].name}。`, "amber");
  showToast(`蝶蛹培育开始：${recipe.time} 秒后查看结果。`);
  renderAll();
}

function finishButterflyBreeding() {
  const breeding = state.butterflyBreeding;
  const resultId = breeding?.result || "swallow";
  const result = butterflySpecies[resultId] || butterflySpecies.swallow;
  const parentA = breeding?.parentA || "azure";
  const parentB = breeding?.parentB || "brimstone";
  const recipe = getButterflyBreedingRecipe(parentA, parentB);
  const storedChance = Number(breeding?.chance);
  const chance = Number.isFinite(storedChance) ? clamp(storedChance, 0, 95) : (getMutationChance(recipe, "butterfly", parentA, parentB) || 18);
  state.butterflyBreeding = null;
  applyEnvironmentCycle("butterfly");
  if (Math.random() < chance / 100) {
    setBreedingFailureCount("butterfly", parentA, parentB, 0);
    if (!state.butterflyDiscovered.includes(resultId)) {
      state.butterflyDiscovered.push(resultId);
      addLog(`发现新蝶种：${result.name}。蝴蝶图鉴已更新。`, "green");
      showToast(`发现新蝶种：${result.name}`);
    } else {
      addLog(`蝶蛹培育完成，获得${result.name}的稳定样本。`, "green");
      showToast(`培育完成：获得${result.name}`);
    }
  } else {
    const nextFailureCount = getBreedingFailureCount("butterfly", parentA, parentB) + 1;
    setBreedingFailureCount("butterfly", parentA, parentB, nextFailureCount);
    addLog(`蝶蛹未形成稳定后代，本次概率 ${chance}%，下次保底提高 10%。`, "amber");
    showToast(`培育未成功：下次概率提升至 ${getMutationChance(recipe, "butterfly", parentA, parentB)}%`);
  }
  renderAll();
}

function machineAction() {
  if (state.machineOutput > 0) {
    const amount = state.machineOutput;
    const blocker = getWarehouseBundleBlocker({ honey: amount, wax: amount });
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    addToWarehouse("honey", amount);
    addToWarehouse("wax", amount);
    state.machineOutput = 0;
    consumeStrategyAction();
    addLog(`离心机 C-01 收取产物：蜂蜜 ${amount}、蜂蜡 ${amount}。`, "amber");
    showToast(`获得蜂蜜 ${amount}、蜂蜡 ${amount}`);
  } else if (state.rawComb > 0 && !state.machineActive) {
    if (state.resources.energy < 2) return showToast("能源不足，至少需要 2 点能源启动离心机。");
    state.rawComb -= 1;
    state.machineActive = true;
    state.machineProgress = 0;
    state.resources.energy = clamp(state.resources.energy - 2, 0, 100);
    consumeStrategyAction();
    addLog("离心机 C-01 开始分离蜂巢。", "teal");
    showToast(`加工开始：${getMachineDuration().toFixed(1).replace(".0", "")} 秒后完成`);
  } else if (state.rawComb === 0) {
    showToast("没有蜂巢可加工，先去探索或收取蜂箱。");
  }
  renderAll();
}

function squeezerAction() {
  if (!isSqueezerUnlocked()) return showToast("完成 1 次离心加工后解锁榨汁机 S-01。");
  if (state.squeezerOutput > 0) {
    const amount = state.squeezerOutput;
    const blocker = getWarehouseBundleBlocker({ oil: amount });
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    addToWarehouse("oil", amount);
    state.squeezerOutput = 0;
    consumeStrategyAction();
    addLog(`榨汁机 S-01 收取产物：种子油 ${amount}。`, "green");
    showToast(`获得种子油 ${amount}`);
  } else if (state.squeezerActive) {
    showToast("榨汁机正在运行中，请等待本批完成。");
  } else if (state.resources.wood < 2) {
    showToast("木材不足，至少需要 2 木材启动榨汁机。");
  } else if (state.resources.energy < 2) {
    showToast("能源不足，至少需要 2 点能源启动榨汁机。");
  } else {
    state.resources.wood -= 2;
    state.resources.energy = clamp(state.resources.energy - 2, 0, 100);
    state.squeezerActive = true;
    state.squeezerProgress = 0;
    consumeStrategyAction();
    addLog("榨汁机 S-01 开始榨取木材，目标：种子油。", "teal");
    showToast(`榨取开始：${getSqueezerDuration()} 秒后完成`);
  }
  renderAll();
}

function fermenterAction() {
  if (!isFermenterUnlocked()) return showToast(`发酵机需要 3 个蜂种和 1 份已完成的生态委托。`);
  if (state.fermenterOutput > 0) {
    const amount = state.fermenterOutput;
    const blocker = getWarehouseBundleBlocker({ biomass: amount });
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    addToWarehouse("biomass", amount);
    state.fermenterOutput = 0;
    consumeStrategyAction();
    addLog(`发酵机 F-01 收取产物：生物质 ${amount}。`, "green");
    showToast(`获得生物质 ${amount}`);
  } else if (state.fermenterActive) {
    showToast("发酵机正在运行中，请等待本批完成。");
  } else if (state.resources.wood < 3) {
    showToast("木材不足，至少需要 3 木材启动发酵机。");
  } else if (state.resources.energy < 3) {
    showToast("能源不足，至少需要 3 点能源启动发酵机。");
  } else {
    state.resources.wood -= 3;
    state.resources.energy = clamp(state.resources.energy - 3, 0, 100);
    state.fermenterActive = true;
    state.fermenterProgress = 0;
    consumeStrategyAction();
    addLog("发酵机 F-01 开始处理木材，目标：生物质。", "teal");
    showToast(`发酵开始：${getFermenterDuration()} 秒后完成`);
  }
  renderAll();
}

function distillerAction() {
  if (!isDistillerUnlocked()) return showToast("完成 1 次发酵加工后解锁蒸馏机 ST-01。");
  if (state.distillerOutput > 0) {
    const amount = state.distillerOutput;
    const blocker = getWarehouseBundleBlocker({ biofuel: amount });
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    addToWarehouse("biofuel", amount);
    state.distillerOutput = 0;
    consumeStrategyAction();
    addLog(`蒸馏机 ST-01 收取产物：生物燃料 ${amount}。`, "amber");
    showToast(`获得生物燃料 ${amount}`);
  } else if (state.distillerActive) {
    showToast("蒸馏机正在运行中，请等待本批完成。");
  } else if (state.resources.biomass < 1) {
    showToast("生物质不足，至少需要 1 份生物质启动蒸馏机。");
  } else if (state.resources.energy < 4) {
    showToast("能源不足，至少需要 4 点能源启动蒸馏机。");
  } else {
    state.resources.biomass -= 1;
    state.resources.energy = clamp(state.resources.energy - 4, 0, 100);
    state.distillerActive = true;
    state.distillerProgress = 0;
    consumeStrategyAction();
    addLog("蒸馏机 ST-01 开始处理生物质，目标：生物燃料。", "teal");
    showToast(`蒸馏开始：${getDistillerDuration()} 秒后完成`);
  }
  renderAll();
}

function resetState() {
  if (!window.confirm("确定要重置原型进度吗？")) return;
  state = structuredClone(defaultState);
  saveState();
  addLog("原型数据已重置，新的林地调查开始。", "teal");
  switchView("overview");
  renderAll();
  showToast("已重置原型进度");
}

function handleHorizonAction(action, target = "") {
  switch (action) {
    case "apiary":
      switchView("apiary");
      break;
    case "machines":
      switchView("machines");
      break;
    case "arbor":
      switchView("arbor");
      break;
    case "research":
      switchView("research");
      break;
    case "explore":
      switchView("explore");
      break;
    case "codex":
      switchView("codex");
      break;
    default:
      switchView("overview");
  }
  window.setTimeout(() => focusGuideTarget(target || getHorizonTarget(action)), 120);
}

function runAutomation() {
  if (!isAutomationUnlocked() || !state.automationEnabled) return { actions: [] };
  const actions = [];
  const canSpendEnergy = (cost) => state.resources.energy >= cost && state.resources.energy - cost >= getAutomationReserveEnergy();
  const record = (text) => {
    actions.push(text);
    setText("#last-action", `自动化：${text}`);
  };
  if (state.machineOutput > 0) {
    const amount = state.machineOutput;
    if (!getWarehouseBundleBlocker({ honey: amount, wax: amount })) {
      addToWarehouse("honey", amount);
      addToWarehouse("wax", amount);
      state.machineOutput = 0;
      record(`离心机收取蜂蜜 ${amount}、蜂蜡 ${amount}`);
    }
  }
  if (state.squeezerOutput > 0) {
    const amount = state.squeezerOutput;
    if (!getWarehouseBundleBlocker({ oil: amount })) {
      addToWarehouse("oil", amount);
      state.squeezerOutput = 0;
      record(`榨汁机收取种子油 ${amount}`);
    }
  }
  if (state.fermenterOutput > 0) {
    const amount = state.fermenterOutput;
    if (!getWarehouseBundleBlocker({ biomass: amount })) {
      addToWarehouse("biomass", amount);
      state.fermenterOutput = 0;
      record(`发酵机收取生物质 ${amount}`);
    }
  }
  if (state.distillerOutput > 0) {
    const amount = state.distillerOutput;
    if (!getWarehouseBundleBlocker({ biofuel: amount })) {
      addToWarehouse("biofuel", amount);
      state.distillerOutput = 0;
      record(`蒸馏机收取生物燃料 ${amount}`);
    }
  }
  if (state.apiaryReady > 0) {
    const amount = state.apiaryReady;
    if (!getWarehouseBundleBlocker({ rawComb: amount })) {
      addToWarehouse("rawComb", amount);
      state.totalCombCollected += amount;
      state.apiaryCombCollected += amount;
      state.apiaryReady = 0;
      record(`蜂箱收取蜂巢 ${amount}`);
    }
  }
  if (state.treeReady > 0) {
    const amount = getTreeYieldAmount();
    const resinAmount = Math.max(0, Number(state.treeReadyResin) || 0);
    if (!getWarehouseBundleBlocker({ wood: amount, resin: resinAmount })) {
      addToWarehouse("wood", amount);
      if (resinAmount > 0) addToWarehouse("resin", resinAmount);
      state.treeReady = 0;
      state.treeReadyYield = 0;
      state.treeReadyResin = 0;
      record(`树场收取木材 ${amount}${resinAmount > 0 ? `、树脂 ${resinAmount}` : ""}`);
    }
  }
  if (!state.machineActive && state.machineOutput === 0 && state.rawComb > 0 && canSpendEnergy(2)) {
    state.rawComb -= 1;
    state.machineActive = true;
    state.machineProgress = 0;
    state.resources.energy = clamp(state.resources.energy - 2, 0, 100);
    record("离心机启动");
  }
  if (isSqueezerUnlocked() && !state.squeezerActive && state.squeezerOutput === 0 && state.resources.wood >= 2 && canSpendEnergy(2)) {
    state.resources.wood -= 2;
    state.resources.energy = clamp(state.resources.energy - 2, 0, 100);
    state.squeezerActive = true;
    state.squeezerProgress = 0;
    record("榨汁机启动");
  }
  if (isFermenterUnlocked() && !state.fermenterActive && state.fermenterOutput === 0 && state.resources.wood >= 3 && canSpendEnergy(3)) {
    state.resources.wood -= 3;
    state.resources.energy = clamp(state.resources.energy - 3, 0, 100);
    state.fermenterActive = true;
    state.fermenterProgress = 0;
    record("发酵机启动");
  }
  if (isDistillerUnlocked() && !state.distillerActive && state.distillerOutput === 0 && state.resources.biomass >= 1 && canSpendEnergy(4)) {
    state.resources.biomass -= 1;
    state.resources.energy = clamp(state.resources.energy - 4, 0, 100);
    state.distillerActive = true;
    state.distillerProgress = 0;
    record("蒸馏机启动");
  }
  return { actions };
}

function advanceSimulation(seconds) {
  const safeSeconds = clamp(Number(seconds) || 0, 0, 60 * 60 * 8);
  if (safeSeconds <= 0) return;
  advanceEnvironment(safeSeconds);
  const energyRate = state.strategyFocus === "industry" ? .22 : .2;
  if (state.resources.energy < 100) state.resources.energy = clamp(state.resources.energy + energyRate * safeSeconds, 0, 100);
  advanceAutoSurvey(safeSeconds, safeSeconds > 2);
  const flowerId = getActiveFlowerId();
  if (state.apiaryReady === 0 && getFlowerCount(flowerId) > 0) {
    state.apiaryProgress += getApiaryEffectiveRate() * safeSeconds;
    if (state.apiaryProgress >= 100) {
      state.apiaryProgress = 0;
      state.apiaryReady = getApiaryYieldPerCycle();
      state.flowerInventory[flowerId] = getFlowerCount(flowerId) - 1;
      state.apiaryCycles += 1;
      applyEnvironmentCycle("apiary");
      addLog(`蜂箱 A-01 消耗 1 份${flowerSources[flowerId].name}，完成一个生产周期，产出蜂巢 ${state.apiaryReady}。`, "green");
      showToast(`蜂箱产出完成：蜂巢 ${state.apiaryReady}`);
    }
  }
  if (state.machineActive) {
    state.machineProgress += (100 / getMachineDuration()) * safeSeconds;
    if (state.machineProgress >= 100) {
      state.machineProgress = 0;
      state.machineActive = false;
      state.machineOutput += 1;
      state.processedHoney += 1;
      state.processedWax += 1;
      state.machineCycles += 1;
      addLog("离心机分离完成，蜂蜜与蜂蜡已准备收取。", "green");
      showToast("离心机加工完成");
    }
  }
  if (state.squeezerActive) {
    state.squeezerProgress += (100 / getSqueezerDuration()) * safeSeconds;
    if (state.squeezerProgress >= 100) {
      state.squeezerProgress = 0;
      state.squeezerActive = false;
      state.squeezerOutput += 1;
      state.squeezerCycles += 1;
      addLog("榨汁机完成加工，种子油已准备收取。", "green");
      showToast("榨汁机加工完成");
    }
  }
  if (state.fermenterActive) {
    state.fermenterProgress += (100 / getFermenterDuration()) * safeSeconds;
    if (state.fermenterProgress >= 100) {
      state.fermenterProgress = 0;
      state.fermenterActive = false;
      state.fermenterOutput += 1;
      state.fermenterCycles += 1;
      applyEnvironmentCycle("fermenter");
      addLog("发酵机处理完成，生物质已准备收取。", "green");
      showToast("发酵机加工完成");
    }
  }
  if (state.distillerActive) {
    state.distillerProgress += (100 / getDistillerDuration()) * safeSeconds;
    if (state.distillerProgress >= 100) {
      state.distillerProgress = 0;
      state.distillerActive = false;
      state.distillerOutput += 1;
      state.distillerCycles += 1;
      addLog("蒸馏机处理完成，生物燃料已准备收取。", "green");
      showToast("蒸馏机加工完成");
    }
  }
  if (state.treeReady === 0) {
    state.treeProgress += getTreeRate() * safeSeconds;
    if (state.treeProgress >= 100) {
      state.treeProgress = 0;
      state.treeReady = 1;
      state.treeReadyYield = getTreeYieldPerCycle();
      state.treeReadyResin = getTreeResinPerCycle();
      applyEnvironmentCycle("tree");
      addLog(`树场 T-01 完成一个生长周期，木材${state.treeReadyYield}${state.treeReadyResin > 0 ? `、树脂${state.treeReadyResin}` : ""}已准备收取。`, "green");
      showToast(state.treeReadyResin > 0 ? "树场产出完成：木材与树脂已锁定" : "树场产出完成");
    }
  }
  if (state.breeding) {
    state.breeding.remaining -= safeSeconds;
    if (state.breeding.remaining <= 0) finishBreeding();
  }
  if (state.treeBreeding) {
    state.treeBreeding.remaining -= safeSeconds;
    if (state.treeBreeding.remaining <= 0) finishTreeBreeding();
  }
  if (state.butterflyBreeding) {
    state.butterflyBreeding.remaining -= safeSeconds;
    if (state.butterflyBreeding.remaining <= 0) finishButterflyBreeding();
  }
}

function getOfflineProgressSummary(before) {
  const progressed = [];
  if (state.apiaryReady > before.apiaryReady || state.apiaryProgress > before.apiaryProgress) progressed.push("蜂箱");
  if (state.treeReady > before.treeReady || state.treeProgress > before.treeProgress) progressed.push("树场");
  if (state.machineOutput > before.machineOutput || (before.machineActive && (state.machineProgress > before.machineProgress || !state.machineActive))) progressed.push("离心机");
  if (state.squeezerOutput > before.squeezerOutput || (before.squeezerActive && (state.squeezerProgress > before.squeezerProgress || !state.squeezerActive))) progressed.push("榨汁机");
  if (state.fermenterOutput > before.fermenterOutput || (before.fermenterActive && (state.fermenterProgress > before.fermenterProgress || !state.fermenterActive))) progressed.push("发酵机");
  if (state.distillerOutput > before.distillerOutput || (before.distillerActive && (state.distillerProgress > before.distillerProgress || !state.distillerActive))) progressed.push("蒸馏机");
  if (before.breedingRemaining !== null && (state.breeding?.remaining ?? 0) < before.breedingRemaining) progressed.push("蜂种杂交");
  if (before.treeBreedingRemaining !== null && (state.treeBreeding?.remaining ?? 0) < before.treeBreedingRemaining) progressed.push("树苗培育");
  if (before.butterflyBreedingRemaining !== null && (state.butterflyBreeding?.remaining ?? 0) < before.butterflyBreedingRemaining) progressed.push("蝶蛹培育");
  const paused = [];
  const automationManaged = isAutomationUnlocked() && state.automationEnabled;
  const automationOutputBlocker = automationManaged ? getBlockedReadyOutput() : null;
  const automationEnergyBlocker = automationManaged ? getAutomationEnergyBlocker() : null;
  const anyReadyOutput = state.machineOutput > 0 || state.squeezerOutput > 0 || state.fermenterOutput > 0 || state.distillerOutput > 0 || state.apiaryReady > 0 || state.treeReady > 0;
  if (state.apiaryReady === 0 && getFlowerCount() === 0) paused.push("蜂箱缺花源");
  if (anyReadyOutput) paused.push(automationOutputBlocker ? `自动化等待${automationOutputBlocker.resourceName}分区：${automationOutputBlocker.name}` : automationManaged ? "自动化队列有产物待处理" : "有产物待收取");
  if (!state.machineActive && state.machineOutput === 0 && state.rawComb === 0) paused.push("离心机待输入");
  if (!automationManaged && isSqueezerUnlocked() && state.squeezerOutput > 0) paused.push("榨汁机有产物待收取");
  if (isSqueezerUnlocked() && !state.squeezerActive && state.squeezerOutput === 0 && (state.resources.wood < 2 || state.resources.energy < 2)) {
    const missing = [state.resources.wood < 2 ? "木材" : "", state.resources.energy < 2 ? "能源" : ""].filter(Boolean).join("和");
    paused.push(`榨汁机待${missing}`);
  }
  if (!automationManaged && isFermenterUnlocked() && state.fermenterOutput > 0) paused.push("发酵机有产物待收取");
  if (isFermenterUnlocked() && !state.fermenterActive && state.fermenterOutput === 0 && (state.resources.wood < 3 || state.resources.energy < 3)) {
    const missing = [state.resources.wood < 3 ? "木材" : "", state.resources.energy < 3 ? "能源" : ""].filter(Boolean).join("和");
    paused.push(`发酵机待${missing}`);
  }
  if (!automationManaged && isDistillerUnlocked() && state.distillerOutput > 0) paused.push("蒸馏机有产物待收取");
  if (isDistillerUnlocked() && !state.distillerActive && state.distillerOutput === 0 && (state.resources.biomass < 1 || state.resources.energy < 4)) {
    const missing = [state.resources.biomass < 1 ? "生物质" : "", state.resources.energy < 4 ? "能源" : ""].filter(Boolean).join("和");
    paused.push(`蒸馏机待${missing}`);
  }
  if (automationEnergyBlocker) paused.push(`自动化保留 ${getAutomationReserveEnergy()} 点能源，${automationEnergyBlocker.name}等待`);
  return { progressed, paused };
}

function applyOfflineProgress() {
  const now = Date.now();
  const elapsed = clamp((now - (state.lastTickAt || now)) / 1000, 0, 60 * 60 * 8);
  state.lastTickAt = now;
  if (elapsed < 3) return;
  const before = {
    apiaryProgress: state.apiaryProgress,
    apiaryReady: state.apiaryReady,
    treeProgress: state.treeProgress,
    treeReady: state.treeReady,
    machineActive: state.machineActive,
    machineProgress: state.machineProgress,
    machineOutput: state.machineOutput,
    squeezerActive: state.squeezerActive,
    squeezerProgress: state.squeezerProgress,
    squeezerOutput: state.squeezerOutput,
    fermenterActive: state.fermenterActive,
    fermenterProgress: state.fermenterProgress,
    fermenterOutput: state.fermenterOutput,
    distillerActive: state.distillerActive,
    distillerProgress: state.distillerProgress,
    distillerOutput: state.distillerOutput,
    breedingRemaining: state.breeding?.remaining ?? null,
    treeBreedingRemaining: state.treeBreeding?.remaining ?? null,
    butterflyBreedingRemaining: state.butterflyBreeding?.remaining ?? null
  };
  const automationBefore = runAutomation();
  advanceSimulation(elapsed);
  const automationAfter = runAutomation();
  const summary = getOfflineProgressSummary(before);
  if (automationBefore.actions.length || automationAfter.actions.length) summary.progressed.push("自动化队列");
  const minutes = Math.max(1, Math.floor(elapsed / 60));
  const progressedText = summary.progressed.length ? `推进${summary.progressed.join("、")}` : "没有生产设备推进";
  const pausedText = summary.paused.length ? `；${summary.paused.join("、")}` : "";
  addLog(`离线恢复 ${minutes} 分钟，${progressedText}${pausedText}。`, "teal");
  showToast(summary.progressed.length ? `离线状态已同步 ${minutes} 分钟` : `离线同步 ${minutes} 分钟：${summary.paused.join("、") || "等待下一步操作"}`);
  renderAll();
  saveState();
}

function gameTick() {
  if (!gameStarted) return;
  state.playTimeSeconds = Math.max(0, Number(state.playTimeSeconds) || 0) + 1;
  runAutomation();
  advanceSimulation(1);
  runAutomation();
  renderResources();
  renderApiary();
  renderTree();
  renderMachine();
  renderAutomation();
  renderGuide();
  renderMilestones();
  renderContracts();
  renderHorizons();
  renderChapterDeck();
  renderCommandCenter();
  renderEcologyNetwork();
  renderZones();
  saveState();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='http']");
    if (!link) return;
    if (!ALLOWED_EXTERNAL_LINKS.has(link.href)) { event.preventDefault(); return showToast("这个外部链接不在允许列表中。"); }
    if (window.location.protocol !== "file:") return;
    event.preventDefault();
    window.location.href = link.href;
  });
  $$(".nav-button").forEach((button) => button.addEventListener("click", () => button.dataset.view && switchView(button.dataset.view)));
  ["#command-action", "#mobile-command-action"].forEach((selector) => {
    const button = $(selector);
    if (button) button.addEventListener("click", () => navigateWithFocus(button.dataset.view, button.dataset.target));
  });
  $$('[data-loop-view]').forEach((button) => button.addEventListener("click", () => navigateWithFocus(button.dataset.loopView)));
  $$(".strategy-button").forEach((button) => button.addEventListener("click", () => selectStrategy(button.dataset.strategy)));
  const ecologyAdvice = $("#ecology-advice-list");
  if (ecologyAdvice) ecologyAdvice.addEventListener("click", (event) => {
    const button = event.target.closest("[data-eco-view]");
    if (button) navigateWithFocus(button.dataset.ecoView, button.dataset.ecoTarget);
  });
  const mobileMoreButton = $("#mobile-more-button");
  if (mobileMoreButton) mobileMoreButton.addEventListener("click", () => mobileMoreButton.getAttribute("aria-expanded") === "true" ? closeMobileMore() : openMobileMore());
  const mobileMoreClose = $("#mobile-more-close");
  if (mobileMoreClose) mobileMoreClose.addEventListener("click", closeMobileMore);
  const mobileSheetScrim = $("#mobile-sheet-scrim");
  if (mobileSheetScrim) mobileSheetScrim.addEventListener("click", closeMobileMore);
  document.addEventListener("keydown", (event) => {
    if (state.expedition && !state.expedition.simplified && ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)) {
      event.preventDefault();
      const offsets = { ArrowUp: -5, ArrowRight: 1, ArrowDown: 5, ArrowLeft: -1 };
      const current = state.expedition.position;
      const target = current + offsets[event.key];
      const crossesRow = (event.key === "ArrowRight" || event.key === "ArrowLeft") && Math.floor(current / 5) !== Math.floor(target / 5);
      if (target >= 0 && target < 25 && !crossesRow) handleSurveyTile(target);
      return;
    }
    if (event.key !== "Escape") return;
    if (state.expedition) { finishManualSurvey(true); return; }
    if ($("#survey-result-modal")?.classList.contains("visible")) { closeSurveyResult(); switchView("explore"); return; }
    closeMobileMore();
    closeStartDialog();
    closeSurveyConfirm();
  });
  $$('[data-jump]').forEach((element) => {
    const navigate = () => {
      switchView(element.dataset.jump);
      if (element.dataset.target) window.setTimeout(() => focusGuideTarget(element.dataset.target), 120);
    };
    element.addEventListener("click", navigate);
    if (element.getAttribute("role") === "button") {
      element.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        navigate();
      });
    }
  });
  $("#zone-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".explore-button");
    if (button?.dataset.zone) explore(button.dataset.zone);
  });
  $("#survey-queue-card")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-survey-action]")?.dataset.surveyAction;
    if (action === "claim-pending") claimPendingSurvey();
    if (action === "open-result") showSurveyResult();
    if (action === "settle-auto" && state.autoSurvey) {
      const claim = claimSurveyItems(state.autoSurvey.completedItems);
      state.pendingSurvey = mergeSurveyItems([...(state.pendingSurvey || []), ...claim.overflow]);
      state.autoSurvey.completedItems = [];
      state.autoSurvey.paused = true;
      state.autoSurvey.pauseType = "energy";
      state.autoSurvey.pausedReason = claim.overflow.length ? "溢出物资已转入暂存箱 · 等待下一轮能源" : "本轮物资已入库 · 等待下一轮能源";
      saveState(true);
      renderAll();
      return;
    }
    if (action === "pause-auto" && state.autoSurvey) {
      state.autoSurvey.userPaused = !state.autoSurvey.userPaused;
      state.autoSurvey.pausedReason = state.autoSurvey.userPaused ? "已手动暂停" : "";
      saveState(true);
      renderZones();
    }
  });
  $$(".analyze-button").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    analyzeSpecies(button.dataset.analyze);
  }));
  $$(".tree-analyze-button").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    analyzeTree(button.dataset.treeAnalyze);
  }));
  $("#codex-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-butterfly-observe]");
    if (button) analyzeButterfly(button.dataset.butterflyObserve);
  });
  $("#collect-button").addEventListener("click", collectApiary);
  $("#breed-button").addEventListener("click", startBreeding);
  $("#flower-select").addEventListener("change", (event) => selectFlowerSource(event.target.value));
  $("#habitat-select").addEventListener("change", (event) => selectHabitat(event.target.value));
  $("#princess-select").addEventListener("change", (event) => selectBreedingParent("princess", event.target.value));
  $("#drone-select").addEventListener("change", (event) => selectBreedingParent("drone", event.target.value));
  $("#tree-collect-button").addEventListener("click", collectTree);
  $("#tree-breed-button").addEventListener("click", startTreeBreeding);
  $("#tree-parent-a-select").addEventListener("change", (event) => selectTreeBreedingParent("parentA", event.target.value));
  $("#tree-parent-b-select").addEventListener("change", (event) => selectTreeBreedingParent("parentB", event.target.value));
  $("#butterfly-breed-button").addEventListener("click", startButterflyBreeding);
  $("#butterfly-parent-a-select").addEventListener("change", (event) => selectButterflyBreedingParent("parentA", event.target.value));
  $("#butterfly-parent-b-select").addEventListener("change", (event) => selectButterflyBreedingParent("parentB", event.target.value));
  $("#machine-button").addEventListener("click", machineAction);
  $("#squeezer-button").addEventListener("click", squeezerAction);
  $("#fermenter-button").addEventListener("click", fermenterAction);
  $("#distiller-button").addEventListener("click", distillerAction);
  $("#contract-button").addEventListener("click", completeContract);
  $("#automation-button").addEventListener("click", toggleAutomation);
  $("#automation-reserve").addEventListener("change", (event) => selectAutomationReserve(event.target.value));
  $$(".upgrade-button").forEach((button) => button.addEventListener("click", () => upgradeFacility(button.dataset.upgrade)));
  $("#guide-action").addEventListener("click", handleGuideAction);
  $$(".horizon-action").forEach((button) => button.addEventListener("click", () => handleHorizonAction(button.dataset.action, button.dataset.target)));
  $("#reset-button").addEventListener("click", resetState);

  $("#continue-game-button")?.addEventListener("click", () => {
    const slot = [getSlotMeta(saveIndex.lastSlotId), ...saveIndex.slots].find((item) => item && isSaveSlotValid(item.id));
    if (slot) loadGameSlot(slot.id);
  });
  $("#new-game-button")?.addEventListener("click", () => openStartDialog("new"));
  $("#load-game-button")?.addEventListener("click", () => openStartDialog("load"));
  $("#about-game-button")?.addEventListener("click", () => openStartDialog("about"));
  $("#start-dialog-close")?.addEventListener("click", closeStartDialog);
  $("#start-dialog")?.addEventListener("click", (event) => { if (event.target.id === "start-dialog") closeStartDialog(); });
  $("#start-dialog-content")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slot-action]");
    if (!button) return;
    const slotId = Number(button.dataset.slotId);
    if (button.dataset.slotAction === "new") createNewGame(slotId);
    if (button.dataset.slotAction === "load") loadGameSlot(slotId);
    if (button.dataset.slotAction === "export") exportSaveSlot(slotId);
    if (button.dataset.slotAction === "rename") renameSaveSlot(slotId);
    if (button.dataset.slotAction === "delete") deleteSaveSlot(slotId);
    if (button.dataset.slotAction === "import") {
      const input = $("#save-import-input");
      input.dataset.slotId = String(slotId);
      input.click();
    }
  });
  $("#start-dialog-content")?.addEventListener("change", (event) => {
    if (event.target.dataset.appSetting !== "simplifiedSurvey") return;
    appSettings.simplifiedSurvey = event.target.checked === true;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
    showToast(appSettings.simplifiedSurvey ? "已开启简化调查" : "已使用 5×5 地图调查");
  });
  $("#save-import-input")?.addEventListener("change", (event) => {
    importSaveFile(event.target.files?.[0], Number(event.target.dataset.slotId));
    event.target.value = "";
  });

  $("#survey-confirm-close")?.addEventListener("click", closeSurveyConfirm);
  $("#survey-confirm-modal")?.addEventListener("click", (event) => { if (event.target.id === "survey-confirm-modal") closeSurveyConfirm(); });
  $("#survey-confirm-content")?.addEventListener("change", (event) => {
    if (event.target.name !== "survey-mode") return;
    const auto = event.target.value === "auto";
    $("#auto-count-control").hidden = !auto;
    $$(".survey-mode").forEach((label) => label.classList.toggle("active", label.contains(event.target)));
    const button = $("#survey-start-button");
    if (button) button.innerHTML = auto ? "安排自动调查 <span>→</span>" : "开始手动调查 <span>→</span>";
  });
  $("#survey-confirm-content")?.addEventListener("click", (event) => {
    if (event.target.closest("#survey-confirm-cancel")) return closeSurveyConfirm();
    if (!event.target.closest("#survey-start-button")) return;
    const mode = $("input[name='survey-mode']:checked")?.value || "manual";
    if (mode === "auto") startAutoSurvey(selectedSurveyZone, Number($("input[name='auto-count']:checked")?.value) || 1);
    else startManualSurvey(selectedSurveyZone);
  });

  $("#survey-map")?.addEventListener("click", (event) => {
    const simpleChoice = event.target.closest("[data-simple-choice]");
    if (simpleChoice) return handleSimplifiedSurveyChoice(simpleChoice.dataset.simpleChoice);
    const tile = event.target.closest("[data-tile-index]");
    if (tile) handleSurveyTile(Number(tile.dataset.tileIndex));
  });
  $("#survey-scan-button")?.addEventListener("click", scanSurveyArea);
  $("#survey-mark-button")?.addEventListener("click", () => { surveyMarkingMode = !surveyMarkingMode; renderManualSurvey(); });
  $("#survey-help-button")?.addEventListener("click", () => {
    setText("#survey-status-title", "调查规则");
    setText("#survey-status-text", "从营地出发，只能上下左右移动。道路、资源和线索消耗 1 点，复杂地形消耗 2 点；观察消耗 1 点并揭示最多 3 格。没有即死或额外能源惩罚。");
  });
  $("#survey-evacuate-button")?.addEventListener("click", () => finishManualSurvey(true));
  $("#survey-result-content")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-result-action]")?.dataset.resultAction;
    if (!action) return;
    const zone = state.surveyResult?.zone;
    if (action === "claim") claimSurveyResult();
    if (action === "return") { closeSurveyResult(); switchView("explore"); }
    if (action === "warehouse") { claimSurveyResult(); switchView("research"); window.setTimeout(() => focusGuideTarget("#upgrade-warehouse-button"), 100); }
    if (action === "repeat") { claimSurveyResult(); if (zone) window.setTimeout(() => openSurveyConfirm(zone), 80); }
  });
}

window.handleForestryBack = function handleForestryBack() {
  if (state.expedition) { finishManualSurvey(true); return true; }
  if ($("#survey-result-modal")?.classList.contains("visible")) { closeSurveyResult(); switchView("explore"); return true; }
  if ($("#survey-confirm-modal")?.classList.contains("visible")) { closeSurveyConfirm(); return true; }
  if ($("#start-dialog")?.classList.contains("visible")) { closeStartDialog(); return true; }
  if (document.body.classList.contains("mobile-sheet-open")) { closeMobileMore(); return true; }
  return false;
};

bindEvents();
renderAll();
renderStartScreen();
window.setInterval(gameTick, 1000);
window.addEventListener("pagehide", () => { if (gameStarted) saveState(true); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && gameStarted) saveState(true); });

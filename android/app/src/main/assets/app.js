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
  resources: { emerald: 12, honey: 24, wax: 10, wood: 32, oil: 6, juice: 0, mulch: 0, fertilizer: 0, container: 0, resin: 0, biomass: 0, biofuel: 0, drippingComb: 0, stickyComb: 0, silkyComb: 0, royalJelly: 0, pollenCluster: 0, silkPropolis: 0, energy: 60 },
  flowerInventory: { wildflower: 3, clover: 0, tropical: 0, wheat: 0, gourd: 0, cactus: 0, mushroom: 0, nether: 0, end: 0 },
  activeFlower: "wildflower",
  activeHabitat: "forest",
  activeBee: "forest",
  rawComb: 0,
  apiaryReadyBundle: {},
  frameInventory: { untreated: 0, impregnated: 0, proven: 0 },
  apiaryFrames: [null, null, null],
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
  machineRecipe: "rawComb",
  machineJob: null,
  machineOutputBundle: {},
  machineCycles: 0,
  machineStarts: 0,
  machineCollectedCycles: 0,
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
  distillerCollected: 0,
  automationEnabled: false,
  automationCompletedBatches: 0,
  automationReserveEnergy: 10,
  contractIndex: 0,
  contractsCompleted: 0,
  regionalContractsCompleted: 0,
  regionalContractOffers: [],
  regionalActionCounter: 0,
  reputation: 0,
  progressionSchema: 2,
  tutorialSurveyOpened: false,
  tutorialSurveyClaimed: false,
  guideRouteChosen: "",
  visitedViews: { overview: true, explore: false, apiary: false, arbor: false, machines: false, research: false, shop: false, codex: false },
  pageUnlocks: { overview: true, explore: true, apiary: false, arbor: false, machines: false, research: false, shop: false, codex: false, achievements: false, automation: false },
  energyCore: { level: 1 },
  achievements: {},
  achievementPending: [],
  rarePityTriggers: 0,
  beePityTriggers: 0,
  ecologyHighCycles: 0,
  titles: [],
  treeSaplings: { oak: 2, birch: 2 },
  woodInventory: { generic: 32 },
  treeDiscovered: ["oak", "birch"],
  treeAnalyzed: [],
  activeTree: "oak",
  treeReadySpecies: "",
  fruitInventory: { cherry: 0, walnut: 0, chestnut: 0, lemon: 0, plum: 0, papaya: 0, date: 0 },
  orchard: { treeId: "", progress: 0, readyFruit: 0, readyMulch: 0, cycles: 0 },
  pollenInventory: {},
  orchardPollen: { treeId: "", cycles: 0 },
  tools: { butterflyNet: 0, graftingKnife: 0 },
  butterflyHost: "wildflower",
  lateFacilities: { alveary: 0, greenhouse: 0, automaticFarm: 0 },
  greenhouseSeals: 0,
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
  squeezerRecipe: "wood",
  squeezerJob: null,
  squeezerOutputBundle: {},
  fermenterRecipe: "wood",
  fermenterJob: null,
  fermenterOutputBundle: {},
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
  productionCycles: 0,
  shopOpenedBonus: false,
  shopTab: "buy",
  shopRotation: 0,
  shopManualRefreshes: 0,
  shopPurchases: {},
  warehouseOverflow: [],
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
let activeCodexTab = "archive";
let activeNpcTopic = "greeting";

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
  oak: { name: "橡树", english: "Oak", type: "基础树种", desc: "稳定、耐寒，适合建立第一座树场。", icon: "♣", color: "green", woodId: "wood_oak", traits: { growth: 58, yield: 62, resin: 42 } },
  birch: { name: "白桦", english: "Birch", type: "基础树种", desc: "生长较快，可作为杂交亲本。", icon: "♧", color: "gold", woodId: "wood_birch", traits: { growth: 76, yield: 48, resin: 36 } },
  larch: { name: "落叶松", english: "Larch", type: "进阶树种", desc: "橡树与白桦的培育后代，木材产量更高。", icon: "♠", color: "amber", woodId: "wood_larch", traits: { growth: 68, yield: 78, resin: 55 } },
  jungle: { name: "丛林树", english: "Jungle", type: "稀有树种", desc: "适应温暖环境，能提供更多树脂。", icon: "♨", color: "teal", woodId: "wood_jungle", traits: { growth: 72, yield: 64, resin: 82 } },
  teak: { name: "柚木", english: "Teak", type: "二级培育", desc: "落叶松与丛林树的热带树脂支系。", icon: "♠", color: "teal", woodId: "wood_teak", traits: { growth: 61, yield: 88, resin: 72 } },
  cherry: { name: "樱桃树", english: "Cherry", type: "二级培育", desc: "橡树与丛林树的果木支系，木材和结果能力均衡。", icon: "♣", color: "amber", woodId: "wood_cherry", fruit: "cherry", orchardYield: 7, mulchYield: 2, climate: "temperate", traits: { growth: 70, yield: 76, resin: 48 } },
  walnut: { name: "核桃树", english: "Walnut", type: "二级培育", desc: "白桦与丛林树的坚果树支系，产量较高。", icon: "♣", color: "gold", woodId: "wood_walnut", fruit: "walnut", orchardYield: 6, mulchYield: 2, climate: "temperate", traits: { growth: 60, yield: 84, resin: 62 } },
  chestnut: { name: "栗树", english: "Chestnut", type: "三级培育", desc: "樱桃与核桃稳定结合后的三级果木。", icon: "♣", color: "purple", woodId: "wood_chestnut", fruit: "chestnut", orchardYield: 8, mulchYield: 3, climate: "temperate", traits: { growth: 64, yield: 90, resin: 70 } },
  pine: { name: "松树", english: "Pine", type: "二级培育", desc: "落叶松与核桃的耐寒高产支系。", icon: "♠", color: "green", woodId: "wood_pine", traits: { growth: 82, yield: 70, resin: 58 } },
  sequoia: { name: "红杉", english: "Sequoia", type: "三级培育", desc: "松树与柚木的高树脂三级巨木。", icon: "♠", color: "teal", woodId: "wood_sequoia", traits: { growth: 54, yield: 98, resin: 86 } },
  lemon: { name: "柠檬树", english: "Lemon", type: "二级果树", desc: "温暖环境中的高效果汁果树。", icon: "♣", color: "gold", woodId: "wood_lemon", fruit: "lemon", orchardYield: 8, mulchYield: 2, climate: "warm", traits: { growth: 72, yield: 72, resin: 40 } },
  plum: { name: "李树", english: "Plum", type: "二级果树", desc: "果汁较少，但能提供大量覆盖物。", icon: "♣", color: "purple", woodId: "wood_plum", fruit: "plum", orchardYield: 8, mulchYield: 5, climate: "temperate", traits: { growth: 68, yield: 74, resin: 38 } },
  papaya: { name: "木瓜树", english: "Papaya", type: "三级果树", desc: "热带高产果树，可提供大量果汁。", icon: "♨", color: "teal", woodId: "wood_papaya", fruit: "papaya", orchardYield: 7, mulchYield: 1, climate: "tropical", traits: { growth: 78, yield: 88, resin: 34 } },
  date: { name: "枣椰树", english: "Date Palm", type: "三级果树", desc: "适应干旱环境，稳定提供椰枣与覆盖物。", icon: "♨", color: "amber", woodId: "wood_date", fruit: "date", orchardYield: 9, mulchYield: 3, climate: "dry", traits: { growth: 62, yield: 82, resin: 30 } }
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

function isTutorialMutationBoostActive() {
  return getGuideStep() < guideSteps.length;
}

function getMutationChance(recipe, kind = "bee", first = "", second = "") {
  if (!recipe) return 0;
  if (isTutorialMutationBoostActive()) return 100;
  const failures = getBreedingFailureCount(kind, first, second);
  const strategyModifier = getStrategyConfig().mutation;
  const environmentModifier = getEnvironmentMutationModifier(kind);
  const pollenModifier = kind === "tree" && state.orchardPollen?.cycles > 0 ? 8 : 0;
  return clamp(recipe.chance + Math.max(0, Number(failures) || 0) * 10 + strategyModifier + environmentModifier + pollenModifier, 5, 95);
}

function getResolvedMutationChance(storedChance, fallbackChance) {
  return Number.isFinite(storedChance) ? clamp(storedChance, 0, 100) : fallbackChance;
}

function getMutationBreakdownText(recipe, kind, first, second) {
  if (!recipe) return "";
  if (isTutorialMutationBoostActive()) return "新手教程保障 100%";
  const parts = [`基础 ${recipe.chance}%`];
  const strategyModifier = getStrategyConfig().mutation;
  const environmentModifier = getEnvironmentMutationModifier(kind);
  const pity = getBreedingFailureCount(kind, first, second) * 10;
  const pollenModifier = kind === "tree" && state.orchardPollen?.cycles > 0 ? 8 : 0;
  if (strategyModifier) parts.push(`${getStrategyConfig().short} ${strategyModifier > 0 ? "+" : ""}${strategyModifier}%`);
  if (environmentModifier) parts.push(`生态 ${environmentModifier > 0 ? "+" : ""}${environmentModifier}%`);
  if (pity) parts.push(`保底 +${pity}%`);
  if (pollenModifier) parts.push(`花粉窗口 +${pollenModifier}%`);
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
  forest: { name: "森林边缘", difficulty: 1, manualEnergy: 8, autoEnergy: 11, autoDuration: 30, surveyPoints: 10, discoveryBase: 62, discoveryStep: 8, flowerSource: "wildflower", temperature: "温和", humidity: "均衡", art: "forest", desc: "木材、野花、基础蜂巢与树苗线索", unlockText: "初始开放", rewards: [{ kind: "resource", id: "wood", min: 8, max: 14 }, { kind: "flower", id: "wildflower", min: 3, max: 6 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "sapling", id: "oak", min: 0, max: 2 }], baseline: { temperature: 52, humidity: 58, light: 62, flowerDensity: 68, soil: 74, canopy: 46, leafPressure: 12 } },
  plains: { name: "平原花地", difficulty: 1, manualEnergy: 9, autoEnergy: 12, autoDuration: 35, surveyPoints: 10, discoveryBase: 18, discoveryStep: 10, flowerSource: "clover", temperature: "温暖", humidity: "干燥", art: "plains", desc: "三叶草、蜂巢、种子与蝴蝶线索", unlockText: "完成 1 次森林调查", rewards: [{ kind: "resource", id: "wood", min: 6, max: 10 }, { kind: "flower", id: "clover", min: 4, max: 8 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "resource", id: "oil", min: 0, max: 2 }], baseline: { temperature: 62, humidity: 42, light: 82, flowerDensity: 76, soil: 64, canopy: 22, leafPressure: 8 } },
  swamp: { name: "静谧沼泽", difficulty: 2, manualEnergy: 12, autoEnergy: 16, autoDuration: 45, surveyPoints: 9, discoveryBase: 0, discoveryStep: 14, flowerSource: "wildflower", temperature: "凉爽", humidity: "高湿", art: "swamp", desc: "湿地花源、树脂、丛林树苗与蜂种线索", unlockText: "累计 3 次调查并完成 1 次离心", rewards: [{ kind: "resource", id: "wood", min: 5, max: 9 }, { kind: "flower", id: "wildflower", min: 3, max: 6 }, { kind: "resource", id: "resin", min: 1, max: 3 }, { kind: "sapling", id: "jungle", min: 0, max: 1 }], baseline: { temperature: 48, humidity: 82, light: 42, flowerDensity: 54, soil: 70, canopy: 58, leafPressure: 18 } },
  desert: { name: "荒芜沙丘", difficulty: 2, manualEnergy: 13, autoEnergy: 18, autoDuration: 50, surveyPoints: 9, discoveryBase: 0, discoveryStep: 13, flowerSource: "wildflower", temperature: "炎热", humidity: "极干", art: "desert", desc: "旱地花源、种子油与干燥蜂巢", unlockText: "获得种子油并收获 1 次树场", rewards: [{ kind: "resource", id: "wood", min: 2, max: 5 }, { kind: "flower", id: "wildflower", min: 4, max: 8 }, { kind: "resource", id: "oil", min: 2, max: 4 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }], baseline: { temperature: 86, humidity: 18, light: 92, flowerDensity: 28, soil: 36, canopy: 8, leafPressure: 6 } },
  tropic: { name: "热带林冠", difficulty: 3, manualEnergy: 15, autoEnergy: 20, autoDuration: 55, surveyPoints: 8, discoveryBase: 0, discoveryStep: 12, flowerSource: "tropical", temperature: "炎热", humidity: "高湿", art: "tropic", desc: "热带花、树脂、稀有蜂巢与柚木线索", unlockText: "手动调查沼泽并发现丛林树", rewards: [{ kind: "resource", id: "wood", min: 6, max: 12 }, { kind: "flower", id: "tropical", min: 3, max: 6 }, { kind: "resource", id: "resin", min: 2, max: 5 }, { kind: "sapling", id: "teak", min: 0, max: 2 }], baseline: { temperature: 82, humidity: 78, light: 64, flowerDensity: 72, soil: 76, canopy: 72, leafPressure: 24 } },
  snow: { name: "寒带针叶林", difficulty: 3, manualEnergy: 16, autoEnergy: 22, autoDuration: 60, surveyPoints: 8, discoveryBase: 0, discoveryStep: 11, flowerSource: "wildflower", temperature: "寒冷", humidity: "中湿", art: "snow", desc: "高产木材、树脂与耐寒树种线索", unlockText: "发现落叶松并升级养蜂箱 LV.2", rewards: [{ kind: "resource", id: "wood", min: 8, max: 14 }, { kind: "flower", id: "wildflower", min: 2, max: 5 }, { kind: "resource", id: "resin", min: 1, max: 3 }, { kind: "sapling", id: "pine", min: 0, max: 2 }], baseline: { temperature: 18, humidity: 52, light: 48, flowerDensity: 32, soil: 54, canopy: 64, leafPressure: 10 } },
  cave: { name: "荧光菌洞", difficulty: 4, manualEnergy: 19, autoEnergy: 25, autoDuration: 70, surveyPoints: 7, discoveryBase: 0, discoveryStep: 10, flowerSource: "wildflower", temperature: "阴凉", humidity: "极湿", art: "cave", desc: "菌类花源、树脂、种子与蝶种线索", unlockText: "观察 3 个蝶种并拥有 3 类花源", rewards: [{ kind: "flower", id: "wildflower", min: 5, max: 9 }, { kind: "resource", id: "resin", min: 2, max: 4 }, { kind: "resource", id: "oil", min: 1, max: 3 }, { kind: "resource", id: "rawComb", min: 0, max: 1 }], baseline: { temperature: 38, humidity: 88, light: 18, flowerDensity: 44, soil: 66, canopy: 92, leafPressure: 20 } },
  end: { name: "末地边境", difficulty: 5, manualEnergy: 24, autoEnergy: 32, autoDuration: 90, surveyPoints: 7, discoveryBase: 0, discoveryStep: 8, flowerSource: "tropical", temperature: "异温", humidity: "干燥", art: "end", desc: "异域花源、神秘蜂巢与稀有物种线索", unlockText: "养蜂箱 LV.3、8 个蜂种并完成生物燃料链", rewards: [{ kind: "flower", id: "tropical", min: 2, max: 4 }, { kind: "resource", id: "biomass", min: 3, max: 6 }, { kind: "resource", id: "rawComb", min: 0, max: 2 }, { kind: "resource", id: "biofuel", min: 0, max: 1 }], baseline: { temperature: 42, humidity: 12, light: 58, flowerDensity: 18, soil: 24, canopy: 4, leafPressure: 28 } }
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
  "pine|teak": { result: "sequoia", time: 18, chance: 10, requiresTreeFarm: 3, label: "红杉三级路径", tier: 3 },
  "birch|cherry": { result: "lemon", time: 13, chance: 20, requiresTreeFarm: 2, label: "柠檬果树路径", tier: 2 },
  "cherry|larch": { result: "plum", time: 14, chance: 18, requiresTreeFarm: 2, label: "李树果木路径", tier: 2 },
  "jungle|walnut": { result: "papaya", time: 17, chance: 12, requiresTreeFarm: 3, label: "木瓜热带果树路径", tier: 3 },
  "teak|walnut": { result: "date", time: 17, chance: 12, requiresTreeFarm: 3, label: "枣椰干旱果树路径", tier: 3 }
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
  tropical: { name: "热带花", icon: "✿", color: "teal", speedBonus: .25, zone: "tropic", label: "稀有花粉 · 产速 +25%" },
  wheat: { name: "小麦花源", icon: "⋮", color: "gold", speedBonus: .12, zone: "plains", label: "农业蜂系花源" },
  gourd: { name: "葫芦花源", icon: "◆", color: "amber", speedBonus: .1, zone: "plains", label: "季节蜂系花源" },
  cactus: { name: "仙人掌花源", icon: "‡", color: "green", speedBonus: .08, zone: "desert", label: "干旱蜂系花源" },
  mushroom: { name: "蘑菇花源", icon: "♠", color: "purple", speedBonus: .08, zone: "cave", label: "阴湿蜂系花源" },
  nether: { name: "下界花源", icon: "✹", color: "amber", speedBonus: .28, zone: "cave", label: "炼狱蜂系稀有花源" },
  end: { name: "末地花源", icon: "◇", color: "purple", speedBonus: .32, zone: "end", label: "末地蜂系稀有花源" }
};

const fruitData = {
  cherry: { name: "樱桃", icon: "●", mode: "oil" },
  walnut: { name: "核桃", icon: "◆", mode: "oil" },
  chestnut: { name: "栗子", icon: "⬟", mode: "oil" },
  lemon: { name: "柠檬", icon: "●", mode: "juice" },
  plum: { name: "李子", icon: "●", mode: "juice" },
  papaya: { name: "木瓜", icon: "▰", mode: "juice" },
  date: { name: "椰枣", icon: "◆", mode: "juice" }
};

const centrifugeRecipes = {
  rawComb: { name: "蜂蜜脾分离", input: { rawComb: 1 }, output: { honey: 1, wax: 1 }, energy: 2 },
  drippingComb: { name: "滴落蜂巢分离", input: { drippingComb: 1 }, output: { honey: 2, wax: 1 }, energy: 2 },
  stickyComb: { name: "黏性蜂巢分离", input: { stickyComb: 1 }, output: { resin: 1, wax: 1 }, energy: 2 },
  silkyComb: { name: "丝质蜂巢分离", input: { silkyComb: 1 }, output: { silkPropolis: 1, honey: 1 }, energy: 3 }
};

const squeezerRecipes = {
  wood: { name: "木材备用榨取", mode: "legacy", input: { wood: 2 }, output: { oil: 1 }, energy: 2 },
  cherry: { name: "樱桃油料", mode: "oil", input: { cherry: 4 }, output: { oil: 1, mulch: 2 }, energy: 2 },
  walnut: { name: "核桃油料", mode: "oil", input: { walnut: 3 }, output: { oil: 2, mulch: 2 }, energy: 2 },
  chestnut: { name: "栗子油料", mode: "oil", input: { chestnut: 3 }, output: { oil: 3, mulch: 2 }, energy: 2 },
  lemon: { name: "柠檬果汁", mode: "juice", input: { lemon: 4 }, output: { juice: 3, mulch: 2 }, energy: 2 },
  plum: { name: "李子果汁", mode: "juice", input: { plum: 4 }, output: { juice: 2, mulch: 4 }, energy: 2 },
  papaya: { name: "木瓜果汁", mode: "juice", input: { papaya: 3 }, output: { juice: 4, mulch: 1 }, energy: 2 },
  date: { name: "椰枣果汁", mode: "juice", input: { date: 5 }, output: { juice: 2, mulch: 2 }, energy: 2 }
};

const fermenterRecipes = {
  wood: { name: "木材低效发酵", input: { wood: 3 }, output: { biomass: 1 }, energy: 3 },
  juice: { name: "果汁高效发酵", input: { juice: 2, mulch: 1 }, output: { biomass: 2 }, energy: 3 }
};

const frameData = {
  untreated: { name: "未处理框架", durability: 80, bonus: .1, tier: 2 },
  impregnated: { name: "浸渍框架", durability: 240, bonus: .2, tier: 3 },
  proven: { name: "可靠框架", durability: 720, bonus: .35, tier: 4 }
};

const beeProductionData = {
  forest: { comb: "rawComb", flower: "wildflower", name: "蜂蜜脾", specialties: {} },
  meadows: { comb: "rawComb", flower: "wildflower", name: "蜂蜜脾", specialties: {} },
  cultivated: { comb: "rawComb", flower: "clover", name: "蜂蜜脾", specialties: {} },
  common: { comb: "rawComb", flower: "wildflower", name: "蜂蜜脾", specialties: {} },
  noble: { comb: "drippingComb", flower: "wildflower", name: "滴落蜂巢", specialties: {} },
  majestic: { comb: "drippingComb", flower: "wildflower", name: "滴落蜂巢", specialties: {} },
  imperial: { comb: "drippingComb", flower: "wildflower", name: "滴落蜂巢", specialties: { royalJelly: .22 } },
  diligent: { comb: "stickyComb", flower: "clover", name: "黏性蜂巢", specialties: {} },
  unweary: { comb: "stickyComb", flower: "clover", name: "黏性蜂巢", specialties: {} },
  industrious: { comb: "stickyComb", flower: "clover", name: "黏性蜂巢", specialties: { pollenCluster: .24 } },
  tropical: { comb: "silkyComb", flower: "tropical", name: "丝质蜂巢", specialties: { silkPropolis: .2 } }
};

const warehouseCategoryData = {
  regular: { name: "常规物资", capacities: [999, 2999, 9999] },
  processed: { name: "加工产物", capacities: [499, 1499, 4999] },
  rare: { name: "稀有材料", capacities: [99, 299, 999] },
  biological: { name: "生物样本", capacities: [199, 599, 1999] },
  equipment: { name: "工具装备", capacities: [32, 64, 128] }
};

const warehouseResourceCategories = {
  rawComb: "regular", honey: "regular", wax: "regular", wood: "regular", mulch: "regular", fertilizer: "regular", container: "regular",
  oil: "processed", juice: "processed", biomass: "processed", biofuel: "processed",
  resin: "rare", drippingComb: "rare", stickyComb: "rare", silkyComb: "rare", royalJelly: "rare", pollenCluster: "rare", silkPropolis: "rare",
  wildflower: "biological", clover: "biological", tropical: "biological", wheat: "biological", gourd: "biological", cactus: "biological", mushroom: "biological", nether: "biological", end: "biological",
  cherry: "biological", walnut: "biological", chestnut: "biological", lemon: "biological", plum: "biological", papaya: "biological", date: "biological"
};

const shopTierData = [
  { name: "学徒货架", reputation: 0 },
  { name: "林业货架", reputation: 5 },
  { name: "专家货架", reputation: 15 },
  { name: "大师货架", reputation: 30 }
];

const shopBuyOffers = [
  { id: "wildflower", name: "野花补给", tier: 1, output: { wildflower: 8 }, price: 1, limit: 6, icon: "✦" },
  { id: "wood", name: "通用木材", tier: 1, output: { wood: 6 }, price: 1, limit: 8, icon: "L" },
  { id: "honey", name: "蜂蜜", tier: 1, output: { honey: 2 }, price: 1, limit: 6, icon: "H" },
  { id: "wax", name: "蜂蜡", tier: 1, output: { wax: 3 }, price: 1, limit: 6, icon: "W" },
  { id: "energy-box", name: "能源补给箱", tier: 1, energy: 20, price: 5, limit: 3, icon: "⚡" },
  { id: "clover", name: "三叶草", tier: 2, output: { clover: 5 }, price: 1, limit: 6, icon: "♣" },
  { id: "tropical", name: "热带花源", tier: 2, output: { tropical: 3 }, price: 1, limit: 6, icon: "✿" },
  { id: "oil", name: "种子油", tier: 2, output: { oil: 1 }, price: 2, limit: 4, icon: "O" },
  { id: "fertilizer", name: "肥料", tier: 2, output: { fertilizer: 4 }, price: 2, limit: 5, icon: "▧" },
  { id: "mulch", name: "覆盖物", tier: 2, output: { mulch: 8 }, price: 1, limit: 5, icon: "M" },
  { id: "container", name: "空容器", tier: 2, output: { container: 8 }, price: 1, limit: 5, icon: "□" },
  { id: "butterfly-net", name: "捕虫网", tier: 2, equipment: "butterflyNet", durability: 64, price: 6, limit: 2, icon: "⌗" },
  { id: "grafting-knife", name: "嫁接刀", tier: 2, equipment: "graftingKnife", durability: 64, price: 10, limit: 2, icon: "⌁" },
  { id: "frame-untreated", name: "未处理框架", tier: 2, frame: "untreated", price: 6, limit: 4, icon: "▣" },
  { id: "wheat", name: "小麦花源包", tier: 3, output: { wheat: 6 }, price: 2, limit: 4, icon: "⋮" },
  { id: "gourd", name: "葫芦花源包", tier: 3, output: { gourd: 4 }, price: 2, limit: 4, icon: "◆" },
  { id: "cactus", name: "仙人掌花源包", tier: 3, output: { cactus: 4 }, price: 2, limit: 4, icon: "‡" },
  { id: "mushroom", name: "蘑菇花源包", tier: 3, output: { mushroom: 4 }, price: 2, limit: 4, icon: "♠" },
  { id: "frame-impregnated", name: "浸渍框架", tier: 3, frame: "impregnated", price: 12, limit: 2, icon: "▣" },
  { id: "nether", name: "下界花源包", tier: 4, output: { nether: 2 }, price: 4, limit: 3, icon: "✹" },
  { id: "end", name: "末地花源包", tier: 4, output: { end: 1 }, price: 6, limit: 2, icon: "◇" },
  { id: "frame-proven", name: "可靠框架", tier: 4, frame: "proven", price: 24, limit: 1, icon: "▣" },
  { id: "greenhouse-seal", name: "温室密封件", tier: 4, seal: 1, price: 18, limit: 2, icon: "▥" }
];

const saplingShopPrices = { oak: 1, birch: 1, larch: 3, jungle: 5, teak: 8, cherry: 6, walnut: 6, chestnut: 10, pine: 6, sequoia: 12, lemon: 6, plum: 6, papaya: 8, date: 8 };

const shopSellOffers = [
  { id: "rawComb", name: "蜂蜜脾", input: { rawComb: 3 }, reward: 1, icon: "⬢" },
  { id: "drippingComb", name: "滴落蜂巢", input: { drippingComb: 2 }, reward: 1, icon: "⬢" },
  { id: "stickyComb", name: "黏性蜂巢", input: { stickyComb: 2 }, reward: 1, icon: "⬢" },
  { id: "silkyComb", name: "丝质蜂巢", input: { silkyComb: 1 }, reward: 1, icon: "⬢" },
  { id: "honey", name: "蜂蜜", input: { honey: 4 }, reward: 1, icon: "H" },
  { id: "wax", name: "蜂蜡", input: { wax: 6 }, reward: 1, icon: "W" },
  { id: "wood", name: "通用木材", input: { wood: 12 }, reward: 1, icon: "L" },
  { id: "resin", name: "树脂", input: { resin: 3 }, reward: 1, icon: "R" },
  { id: "cherry", name: "樱桃", input: { cherry: 12 }, reward: 1, icon: "●" },
  { id: "walnut", name: "核桃", input: { walnut: 8 }, reward: 1, icon: "◆" },
  { id: "chestnut", name: "栗子", input: { chestnut: 6 }, reward: 1, icon: "⬟" },
  { id: "lemon", name: "柠檬", input: { lemon: 10 }, reward: 1, icon: "●" },
  { id: "plum", name: "李子", input: { plum: 10 }, reward: 1, icon: "●" },
  { id: "papaya", name: "木瓜", input: { papaya: 6 }, reward: 1, icon: "▰" },
  { id: "date", name: "椰枣", input: { date: 12 }, reward: 1, icon: "◆" },
  { id: "oil", name: "种子油", input: { oil: 4 }, reward: 1, icon: "O" },
  { id: "juice", name: "果汁", input: { juice: 5 }, reward: 1, icon: "J" },
  { id: "mulch", name: "覆盖物", input: { mulch: 12 }, reward: 1, icon: "M" },
  { id: "biomass", name: "生物质", input: { biomass: 2 }, reward: 1, icon: "B" },
  { id: "biofuel", name: "生物燃料", input: { biofuel: 1 }, reward: 2, icon: "F" },
  { id: "royalJelly", name: "蜂王浆", input: { royalJelly: 1 }, reward: 4, icon: "♛" },
  { id: "pollenCluster", name: "花粉簇", input: { pollenCluster: 1 }, reward: 3, icon: "✣" },
  { id: "silkPropolis", name: "丝质蜂胶", input: { silkPropolis: 1 }, reward: 2, icon: "S" }
];

const shopOrderTemplates = [
  [{ name: "蜂场日常收购", input: { honey: 12 }, reward: 4 }, { name: "果园鲜果订单", input: { cherry: 20 }, reward: 3 }, { name: "生物质燃料订单", input: { biomass: 5 }, reward: 7 }],
  [{ name: "蜂蜡框架备料", input: { wax: 18 }, reward: 5 }, { name: "胡桃木工补给", input: { wood: 28 }, reward: 4 }, { name: "果汁发酵补给", input: { juice: 12 }, reward: 4 }],
  [{ name: "稀有蜂巢样本", input: { drippingComb: 6 }, reward: 5 }, { name: "热带果园补给", input: { papaya: 12 }, reward: 4 }, { name: "生态燃料收购", input: { biofuel: 4 }, reward: 10 }]
];

const lateFacilityData = {
  alveary: { name: "大型蜂房", detail: "蜂箱速度 +25%，开放第三框架槽", cost: { emerald: 30, wood: 128, wax: 32 } },
  greenhouse: { name: "生态温室", detail: "果园环境适配不低于 85%", cost: { emerald: 36, wood: 96, oil: 12, greenhouseSeal: 1 } },
  automaticFarm: { name: "自动农场", detail: "树场速度 +20%，果园土壤消耗 -2", cost: { emerald: 32, wood: 160, fertilizer: 12 } }
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
  warehouse: { name: "分类仓库 R-01", label: "STORAGE", icon: "▣", effect: "提高常规、加工、稀有、生物与装备分区容量", costs: [{ emerald: 40, wood: 128, wax: 24, oil: 8 }, { emerald: 120, wood: 512, resin: 48, biofuel: 12 }] }
};

const energyCoreLevels = [
  { level: 1, capacity: 100, recovery: 6, unlockText: "初始能源核心" },
  { level: 2, capacity: 125, recovery: 7, unlock: () => state.machineCollectedCycles >= 1, unlockText: "收取第一次离心产物后开放", cost: { wood: 18, wax: 4, oil: 2 } },
  { level: 3, capacity: 155, recovery: 8, unlock: () => state.contractsCompleted >= 3, unlockText: "完成主线委托 03 后开放", cost: { wood: 30, wax: 8, oil: 6 } },
  { level: 4, capacity: 190, recovery: 10, unlock: () => state.fermenterCycles >= 1, unlockText: "完成 1 次发酵后开放", cost: { wood: 45, resin: 5, biomass: 3 } },
  { level: 5, capacity: 230, recovery: 12, unlock: () => state.distillerCycles >= 3 && state.reputation >= 15, unlockText: "完成 3 次蒸馏且声望达到 15 后开放", cost: { wood: 64, resin: 10, biofuel: 3 } }
];

const guideSteps = [
  { title: "建立生态工坊", text: "存档已经建立。先从总览确认当前资源、自动保存和下一步行动。", action: "overview", actionLabel: "查看总览", target: ".chapter-deck" },
  { title: "准备第一次调查", text: "打开森林边缘的调查确认窗口，比较难度、能源消耗和可能收获。", action: "explore", actionLabel: "查看森林边缘", target: '.explore-button[data-zone="forest"]' },
  { title: "完成教学样方", text: "选择手动调查，到达 3 个资源点后撤离。道路、线索和调查袋会在这里逐步介绍。", action: "explore", actionLabel: "继续手动调查", target: '.explore-button[data-zone="forest"]' },
  { title: "整理调查收获", text: "在结算窗口把蜂巢、野花与木材全部入库；仓库已满的物资会进入暂存箱。", action: "explore", actionLabel: "查看调查结算", target: "#survey-queue-card" },
  { title: "检查蜂箱环境", text: "查看当前花源和森林环境。花源维持生产，温湿度与生态状态会影响效率。", action: "apiary", actionLabel: "检查蜂箱", target: "#flower-select" },
  { title: "收取第一份蜂巢", text: "等待蜂箱进入 READY，再收取第一份蜂巢；这会开放生产加工页面。", action: "apiary", actionLabel: "查看蜂箱", target: "#collect-button" },
  { title: "启动离心机", text: "投入 1 个蜂巢和 2 点能源，开始离心分离。机器启动后会开放树木育种。", action: "machines", actionLabel: "启动离心机", target: "#machine-button" },
  { title: "认识基础树种", text: "查看橡树与白桦的生长、木材、树脂属性以及树苗库存。", action: "arbor", actionLabel: "查看基础树种", target: "#tree-species-row" },
  { title: "收取蜂蜜与蜂蜡", text: "返回加工页收取第一次离心产物。蜂蜜和蜂蜡会连接研究、委托与升级。", action: "machines", actionLabel: "收取离心产物", target: "#machine-button" },
  { title: "升级能源核心", text: "在研究页把能源核心升到 LV.2，提高容量与自然恢复速度，并立即补充 20 点能源。", action: "research", actionLabel: "升级能源核心", target: "#energy-core-upgrade" },
  { title: "分析两种亲本", text: "分析森林蜂与草原蜂，读取属性并显示第一条稳定突变路径。", action: "apiary", actionLabel: "分析亲本", target: ".analyze-button:not(.done)" },
  { title: "培育第一支蜂系", text: "完成森林蜂 × 草原蜂的稳定培育，发现培育蜂并开放生态档案。", action: "apiary", actionLabel: "开始培育", target: "#breed-button" },
  { title: "交付第一份委托", text: "交付“林地调查补给”，理解资源出口、声望和奖励，并开放成就档案。", action: "overview", actionLabel: "查看主线委托", target: "#contract-button" },
  { title: "选择下一条路线", text: "从短周期调查、中周期树木或长期加工中选择下一步，工坊将转入多目标经营。", action: "overview", actionLabel: "选择发展路线", target: ".horizon-grid" }
];

const contractData = [
  { id: "main-01", label: "MAIN CONTRACT 01", title: "林地调查补给", detail: "前线调查站需要第一批基础采集物，换取新的探索补给。", unlockText: "完成教学调查后开放", unlock: () => state.tutorialSurveyCompleted, requires: { rawComb: 1, wood: 5 }, rewards: { oil: 2, energy: 10, emerald: 6 }, reputation: 1 },
  { id: "main-02", label: "MAIN CONTRACT 02", title: "初建蜂房", detail: "用野花和蜂箱产出的蜂巢支援第一座公共蜂房。", unlockText: "从蜂箱收取 1 次后开放", unlock: () => state.apiaryCombCollected >= 1, requires: { wildflower: 2, rawComb: 1 }, rewards: { wood: 8, energy: 12 }, reputation: 1 },
  { id: "main-03", label: "MAIN CONTRACT 03", title: "蜂蜡框架", detail: "提交离心产物，制作耐用的蜂房框架。", unlockText: "完成 1 次离心后开放", unlock: () => state.machineCycles >= 1, requires: { honey: 2, wax: 2 }, rewards: { wood: 8, energy: 15, emerald: 10 }, reputation: 2 },
  { id: "main-04", label: "MAIN CONTRACT 04", title: "苗圃支架", detail: "树场需要木材和种子油扩建第一批苗圃。", unlockText: "完成 1 次树场收获后开放", unlock: () => state.treeHarvests >= 1, requires: { wood: 12, oil: 2 }, rewards: { honey: 4, energy: 15 }, reputation: 2 },
  { id: "main-05", label: "MAIN CONTRACT 05", title: "平原授粉记录", detail: "整理平原花源与基础蜂种的授粉数据。", unlockText: "手动调查平原且分析 2 个蜂种后开放", unlock: () => getZoneProgress("plains").manualRuns >= 1 && state.analyzed.length >= 2, requires: { clover: 4, honey: 3 }, rewards: { wax: 4, energy: 18 }, reputation: 2 },
  { id: "main-06", label: "MAIN CONTRACT 06", title: "湿地防护物资", detail: "为沼泽调查队提交防潮树脂和蜂蜡。", unlockText: "手动调查沼泽后开放", unlock: () => getZoneProgress("swamp").manualRuns >= 1, requires: { resin: 2, wax: 4 }, rewards: { wood: 12, energy: 20 }, reputation: 3 },
  { id: "main-07", label: "MAIN CONTRACT 07", title: "培育谱系记录", detail: "提交培育蜂与树木杂交阶段需要的研究材料。", unlockText: "发现培育蜂且完成 1 次树木培育后开放", unlock: () => state.discovered.includes("cultivated") && state.treeCycles >= 1, requires: { honey: 6, oil: 3 }, rewards: { resin: 3, energy: 20 }, reputation: 3 },
  { id: "main-08", label: "MAIN CONTRACT 08", title: "多花源调查", detail: "收集三类花源并建立蝴蝶授粉记录。", unlockText: "拥有 3 类花源且观察 2 个蝶种后开放", unlock: () => Object.values(state.flowerInventory).filter((amount) => amount > 0).length >= 3 && state.butterflyAnalyzed.length >= 2, requires: { wildflower: 4, clover: 4, tropical: 2 }, rewards: { oil: 4, energy: 25 }, reputation: 3 },
  { id: "main-09", label: "MAIN CONTRACT 09", title: "生物质试产", detail: "为研究站提交首批稳定生物质和结构木材。", unlockText: "完成 1 次发酵后开放", unlock: () => state.fermenterCycles >= 1, requires: { biomass: 2, wood: 12 }, rewards: { honey: 8, energy: 25 }, reputation: 4 },
  { id: "main-10", label: "MAIN CONTRACT 10", title: "生物燃料补给", detail: "蒸馏后的燃料将支持更远区域的长期调查。", unlockText: "完成 1 次蒸馏后开放", unlock: () => state.distillerCycles >= 1, requires: { biofuel: 1, oil: 4 }, rewards: { wax: 8, energy: 40, emerald: 18 }, reputation: 4 },
  { id: "main-11", label: "MAIN CONTRACT 11", title: "寒带林业后勤", detail: "为雪林站点准备耐寒树种和大批木材。", unlockText: "手动调查雪林且发现落叶松后开放", unlock: () => getZoneProgress("snow").manualRuns >= 1 && state.treeDiscovered.includes("larch"), requires: { wood: 20, resin: 5 }, rewards: { honey: 10, energy: 35 }, reputation: 5 },
  { id: "main-12", label: "MAIN CONTRACT 12", title: "菌洞实验包", detail: "洞穴生态实验需要高浓度树脂和生物质。", unlockText: "手动调查菌洞 2 次后开放", unlock: () => getZoneProgress("cave").manualRuns >= 2, requires: { resin: 8, biomass: 4 }, rewards: { oil: 8, energy: 40 }, reputation: 5 },
  { id: "main-13", label: "MAIN CONTRACT 13", title: "高阶蜂群备案", detail: "为高阶蜂群建立完整的生产与谱系档案。", unlockText: "发现 8 个蜂种且完成三级蜂路径后开放", unlock: () => knownDiscoveredBees().length >= 8 && state.discovered.some((id) => getMutationTier(species[id]) >= 3), requires: { honey: 12, wax: 8, rawComb: 4 }, rewards: { resin: 8, energy: 45 }, reputation: 6 },
  { id: "main-14", label: "MAIN CONTRACT 14", title: "末地边境观测", detail: "为末地边境观测站提供燃料和蜂群样本。", unlockText: "完成 1 次末地手动调查后开放", unlock: () => getZoneProgress("end").manualRuns >= 1, requires: { biofuel: 3, rawComb: 6 }, rewards: { honey: 16, energy: 60 }, reputation: 7 },
  { id: "main-15", label: "MAIN CONTRACT 15", title: "生态工坊认证", detail: "提交最终认证物资，完成 P0 生态工坊长期目标。", unlockText: "开放八区、能源核心 LV.4，并完成 20 个成就后开放", unlock: () => getUnlockedZoneCount() >= 8 && getEnergyCoreLevel() >= 4 && getCompletedAchievementCount() >= 20, requires: { honey: 12, wax: 8, resin: 6, biofuel: 2 }, rewards: {}, rewardText: "能源补满", fullEnergy: true, reputation: 10, titleReward: "认证林业师" }
];

const regionalContractTemplates = [
  { id: "regional-forest", title: "林缘常备物资", requires: { rawComb: 2, wood: 8 }, rewards: { oil: 2, energy: 8, emerald: 4 }, reputation: 1, unlock: () => true },
  { id: "regional-apiary", title: "蜂房维护包", requires: { honey: 4, wax: 3 }, rewards: { wood: 10, energy: 10, emerald: 5 }, reputation: 1, unlock: () => state.machineCycles >= 1 },
  { id: "regional-arbor", title: "树场周转单", requires: { wood: 15, oil: 2 }, rewards: { honey: 5, energy: 12, emerald: 5 }, reputation: 1, unlock: () => state.treeHarvests >= 1 },
  { id: "regional-flowers", title: "平原花源交换", requires: { wildflower: 3, clover: 3 }, rewards: { oil: 3, energy: 10, emerald: 4 }, reputation: 1, unlock: () => getZoneVisits("plains") >= 1 },
  { id: "regional-swamp", title: "湿地树脂补给", requires: { resin: 3, wax: 3 }, rewards: { wood: 10, energy: 15, emerald: 6 }, reputation: 1, unlock: () => isZoneUnlocked("swamp") },
  { id: "regional-biomass", title: "生物质周转", requires: { biomass: 2, wood: 8 }, rewards: { honey: 6, energy: 15, emerald: 6 }, reputation: 2, unlock: () => state.fermenterCycles >= 1 },
  { id: "regional-biofuel", title: "远征燃料储备", requires: { biofuel: 1, oil: 3 }, rewards: { wax: 6, energy: 20, emerald: 8 }, reputation: 2, unlock: () => state.distillerCycles >= 1 }
];

const achievementTiers = { bronze: { name: "铜", points: 10 }, silver: { name: "银", points: 20 }, gold: { name: "金", points: 40 }, diamond: { name: "钻石", points: 80 } };
const achievementData = [
  { id: "survey_first", category: "调查与区域", title: "林地第一步", tier: "bronze", detail: "完成第一次手动调查", reward: { energy: 10 }, condition: () => Object.values(state.zoneProgress).some((item) => item.manualRuns >= 1) },
  { id: "survey_auto", category: "调查与区域", title: "放手调查", tier: "bronze", detail: "完成第一次自动调查", reward: { wood: 5 }, condition: () => Object.values(state.zoneProgress).some((item) => item.autoRuns >= 1) },
  { id: "survey_10", category: "调查与区域", title: "踏遍近郊", tier: "silver", detail: "累计完成 10 次调查", reward: { energy: 20 }, reputation: 1, condition: () => state.explorations >= 10 },
  { id: "survey_all_zones", category: "调查与区域", title: "八方生态", tier: "gold", detail: "开放全部 8 个区域", reward: { energy: 40 }, reputation: 3, condition: () => getUnlockedZoneCount() >= 8 },
  { id: "survey_mastery", category: "调查与区域", title: "区域专家", tier: "gold", detail: "任一区域熟练度达到 100", reward: { wood: 20 }, reputation: 2, condition: () => Object.values(state.zoneProgress).some((item) => item.proficiency >= 100) },
  { id: "survey_rare_pity", category: "调查与区域", title: "线索不会消失", tier: "silver", detail: "触发一次区域稀有保底", reward: { energy: 20 }, reputation: 1, condition: () => state.rarePityTriggers >= 1 },
  { id: "apiary_collect", category: "蜜蜂与遗传", title: "第一枚蜂巢", tier: "bronze", detail: "从养蜂箱收取 1 次", reward: { wildflower: 2 }, condition: () => state.apiaryCombCollected >= 1 },
  { id: "bee_analyze_3", category: "蜜蜂与遗传", title: "初级分析员", tier: "bronze", detail: "分析 3 个蜂种", reward: { honey: 3 }, condition: () => state.analyzed.length >= 3 },
  { id: "bee_cultivated", category: "蜜蜂与遗传", title: "稳定培育", tier: "silver", detail: "发现培育蜂", reward: { wax: 3 }, reputation: 1, condition: () => state.discovered.includes("cultivated") },
  { id: "bee_tier3", category: "蜜蜂与遗传", title: "三级谱系", tier: "gold", detail: "发现任意三级蜂种", reward: { energy: 30 }, reputation: 2, condition: () => state.discovered.some((id) => getMutationTier(species[id]) >= 3) },
  { id: "bee_all", category: "蜜蜂与遗传", title: "养蜂大师", tier: "diamond", detail: "发现并分析全部蜂种", reward: { honey: 20, wax: 12 }, reputation: 5, condition: () => Object.keys(species).every((id) => state.discovered.includes(id) && state.analyzed.includes(id)) },
  { id: "bee_pity", category: "蜜蜂与遗传", title: "坚持的价值", tier: "silver", detail: "任一蜂种组合触发保底", reward: { honey: 5, energy: 15 }, condition: () => state.beePityTriggers >= 1 },
  { id: "tree_harvest", category: "树木、蝴蝶与生态", title: "第一批木材", tier: "bronze", detail: "收取 1 次树场", reward: { wood: 6 }, condition: () => state.treeHarvests >= 1 },
  { id: "tree_larch", category: "树木、蝴蝶与生态", title: "新的年轮", tier: "silver", detail: "培育出落叶松", reward: { oil: 2 }, reputation: 1, condition: () => state.treeDiscovered.includes("larch") },
  { id: "tree_tier3", category: "树木、蝴蝶与生态", title: "巨木谱系", tier: "gold", detail: "发现任意三级树种", reward: { resin: 4 }, reputation: 2, condition: () => state.treeDiscovered.some((id) => getMutationTier(treeSpecies[id]) >= 3) },
  { id: "butterfly_3", category: "树木、蝴蝶与生态", title: "翅色档案", tier: "silver", detail: "观察 3 个蝶种", reward: { energy: 15 }, reputation: 1, condition: () => state.butterflyAnalyzed.length >= 3 },
  { id: "flowers_3", category: "树木、蝴蝶与生态", title: "三季花源", tier: "silver", detail: "同时拥有 3 类花源", reward: { oil: 3 }, condition: () => Object.values(state.flowerInventory).filter((amount) => amount > 0).length >= 3 },
  { id: "ecology_85", category: "树木、蝴蝶与生态", title: "繁盛林地", tier: "gold", detail: "生态评分连续 3 周期不低于 85", reward: { energy: 30 }, reputation: 3, condition: () => state.ecologyHighCycles >= 3 },
  { id: "machine_centrifuge", category: "工业、能源与经营", title: "分离开始", tier: "bronze", detail: "完成 1 次离心", reward: { honey: 2, wax: 2 }, condition: () => state.machineCycles >= 1 },
  { id: "machine_chain", category: "工业、能源与经营", title: "四段生产线", tier: "gold", detail: "四类机器各完成至少 1 次", reward: { energy: 30 }, reputation: 2, condition: () => [state.machineCycles, state.squeezerCycles, state.fermenterCycles, state.distillerCycles].every((value) => value >= 1) },
  { id: "biofuel_first", category: "工业、能源与经营", title: "林木燃料", tier: "silver", detail: "收取第一份生物燃料", reward: { energy: 25 }, condition: () => state.distillerCollected >= 1 },
  { id: "automation_10", category: "工业、能源与经营", title: "稳定队列", tier: "gold", detail: "自动化连续完成 10 批", reward: { energy: 35 }, reputation: 3, condition: () => state.automationCompletedBatches >= 10 },
  { id: "energy_lv3", category: "工业、能源与经营", title: "扩容电网", tier: "silver", detail: "能源核心达到 LV.3", reward: {}, fullEnergy: true, condition: () => getEnergyCoreLevel() >= 3 },
  { id: "energy_max", category: "工业、能源与经营", title: "充沛动力", tier: "gold", detail: "能源核心达到 LV.5", reward: { biofuel: 2 }, reputation: 3, condition: () => getEnergyCoreLevel() >= 5 },
  { id: "contract_1", category: "工业、能源与经营", title: "第一次交付", tier: "bronze", detail: "完成 1 份主线委托", reward: { energy: 10 }, condition: () => state.contractsCompleted >= 1 },
  { id: "contract_6", category: "工业、能源与经营", title: "区域合作", tier: "silver", detail: "完成 6 份主线委托", reward: { wood: 15 }, reputation: 2, condition: () => state.contractsCompleted >= 6 },
  { id: "contract_15", category: "工业、能源与经营", title: "认证林业师", tier: "diamond", detail: "完成全部 15 份主线委托", reward: {}, reputation: 5, titleReward: "认证林业师", condition: () => state.contractsCompleted >= 15 },
  { id: "regional_30", category: "工业、能源与经营", title: "长期供给者", tier: "gold", detail: "完成 30 份区域轮换委托", reward: { energy: 50 }, reputation: 5, condition: () => state.regionalContractsCompleted >= 30 }
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
initializeProgressionState(state);

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
      fruitInventory: { ...defaultState.fruitInventory, ...saved.fruitInventory },
      orchard: { ...defaultState.orchard, ...(saved.orchard || {}) },
      apiaryReadyBundle: { ...defaultState.apiaryReadyBundle, ...(saved.apiaryReadyBundle || {}) },
      frameInventory: { ...defaultState.frameInventory, ...(saved.frameInventory || {}) },
      apiaryFrames: Array.isArray(saved.apiaryFrames) ? saved.apiaryFrames.slice(0, 3) : structuredClone(defaultState.apiaryFrames),
      pollenInventory: saved.pollenInventory && typeof saved.pollenInventory === "object" ? { ...saved.pollenInventory } : {},
      orchardPollen: { ...defaultState.orchardPollen, ...(saved.orchardPollen || {}) },
      tools: { ...defaultState.tools, ...(saved.tools || {}) },
      lateFacilities: { ...defaultState.lateFacilities, ...(saved.lateFacilities || {}) },
      shopPurchases: saved.shopPurchases && typeof saved.shopPurchases === "object" ? { ...saved.shopPurchases } : {},
      warehouseOverflow: Array.isArray(saved.warehouseOverflow) ? saved.warehouseOverflow.slice(0, 12) : [],
      squeezerOutputBundle: { ...defaultState.squeezerOutputBundle, ...(saved.squeezerOutputBundle || {}) },
      fermenterOutputBundle: { ...defaultState.fermenterOutputBundle, ...(saved.fermenterOutputBundle || {}) },
      machineOutputBundle: { ...defaultState.machineOutputBundle, ...(saved.machineOutputBundle || {}) },
      explorationCounts: { ...defaultState.explorationCounts, ...saved.explorationCounts },
      zoneProgress: Object.fromEntries(Object.keys(defaultState.zoneProgress).map((zone) => [zone, { ...defaultState.zoneProgress[zone], ...(saved.zoneProgress?.[zone] || {}) }])),
      treeSaplings: { ...defaultState.treeSaplings, ...saved.treeSaplings },
      woodInventory: saved.woodInventory && typeof saved.woodInventory === "object" ? { ...saved.woodInventory } : { generic: Math.max(0, Math.floor(Number(saved.resources?.wood) || defaultState.resources.wood)) },
      treeBreedingParents: { ...defaultState.treeBreedingParents, ...saved.treeBreedingParents },
      breedingParents: { ...defaultState.breedingParents, ...saved.breedingParents },
      butterflyBreedingParents: { ...defaultState.butterflyBreedingParents, ...saved.butterflyBreedingParents },
      visitedViews: { ...defaultState.visitedViews, ...saved.visitedViews },
      pageUnlocks: { ...defaultState.pageUnlocks, ...saved.pageUnlocks },
      energyCore: { ...defaultState.energyCore, ...saved.energyCore },
      achievements: saved.achievements && typeof saved.achievements === "object" && !Array.isArray(saved.achievements) ? saved.achievements : {},
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
      claimedResultIds: Array.isArray(saved.claimedResultIds) ? saved.claimedResultIds.slice(-80) : [],
      achievementPending: Array.isArray(saved.achievementPending) ? saved.achievementPending.slice(0, 80) : [],
      regionalContractOffers: Array.isArray(saved.regionalContractOffers) ? saved.regionalContractOffers.slice(0, 3) : [],
      titles: Array.isArray(saved.titles) ? [...new Set(saved.titles.map(String))].slice(0, 20) : [],
      _needsAchievementBackfill: Number(saved.progressionSchema) !== defaultState.progressionSchema
    };
    merged.energyCore.level = clamp(Math.floor(Number(merged.energyCore.level) || 1), 1, energyCoreLevels.length);
    const energyCapacity = energyCoreLevels[merged.energyCore.level - 1].capacity;
    Object.keys(defaultState.resources).forEach((resource) => {
      const value = Number(merged.resources[resource]);
      merged.resources[resource] = Number.isFinite(value) ? resource === "energy" ? clamp(value, 0, energyCapacity) : resource === "emerald" ? Math.max(0, Math.floor(value)) : Math.max(0, value) : defaultState.resources[resource];
    });
    Object.keys(defaultState.flowerInventory).forEach((flower) => {
      const value = Number(merged.flowerInventory[flower]);
      merged.flowerInventory[flower] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState.flowerInventory[flower];
    });
    merged.activeFlower = flowerSources[merged.activeFlower] ? merged.activeFlower : defaultState.activeFlower;
    merged.activeHabitat = zones[merged.activeHabitat] ? merged.activeHabitat : defaultState.activeHabitat;
    merged.activeBee = species[merged.activeBee] && merged.discovered.includes(merged.activeBee) ? merged.activeBee : "forest";
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
    Object.keys(defaultState.fruitInventory).forEach((fruit) => {
      const value = Number(merged.fruitInventory[fruit]);
      merged.fruitInventory[fruit] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    });
    Object.keys(frameData).forEach((frame) => { merged.frameInventory[frame] = Math.max(0, Math.floor(Number(merged.frameInventory[frame]) || 0)); });
    merged.apiaryFrames = [...merged.apiaryFrames, null, null, null].slice(0, 3).map((frame) => frameData[frame?.id] ? { id: frame.id, durability: clamp(Math.floor(Number(frame.durability) || frameData[frame.id].durability), 1, frameData[frame.id].durability) } : null);
    Object.keys(merged.apiaryReadyBundle).forEach((key) => { merged.apiaryReadyBundle[key] = Math.max(0, Math.floor(Number(merged.apiaryReadyBundle[key]) || 0)); });
    Object.keys(merged.pollenInventory).forEach((tree) => { merged.pollenInventory[tree] = Math.max(0, Math.floor(Number(merged.pollenInventory[tree]) || 0)); });
    merged.orchardPollen.treeId = treeSpecies[merged.orchardPollen.treeId] ? merged.orchardPollen.treeId : "";
    merged.orchardPollen.cycles = Math.max(0, Math.floor(Number(merged.orchardPollen.cycles) || 0));
    Object.keys(defaultState.tools).forEach((tool) => { merged.tools[tool] = Math.max(0, Math.floor(Number(merged.tools[tool]) || 0)); });
    Object.keys(defaultState.lateFacilities).forEach((facility) => { merged.lateFacilities[facility] = merged.lateFacilities[facility] ? 1 : 0; });
    merged.greenhouseSeals = Math.max(0, Math.floor(Number(merged.greenhouseSeals) || 0));
    merged.butterflyHost = flowerSources[merged.butterflyHost] ? merged.butterflyHost : "wildflower";
    merged.shopTab = ["buy", "sell", "orders", "storage"].includes(merged.shopTab) ? merged.shopTab : "buy";
    merged.shopOpenedBonus = merged.shopOpenedBonus === true;
    merged.shopManualRefreshes = clamp(Math.floor(Number(merged.shopManualRefreshes) || 0), 0, 2);
    merged.shopRotation = Math.max(0, Math.floor(Number(merged.shopRotation) || 0));
    merged.productionCycles = Math.max(0, Math.floor(Number(merged.productionCycles) || 0));
    merged.activeTree = treeSpecies[merged.activeTree] && merged.treeDiscovered.includes(merged.activeTree) ? merged.activeTree : "oak";
    merged.treeReadySpecies = treeSpecies[merged.treeReadySpecies] ? merged.treeReadySpecies : (merged.treeReady > 0 ? merged.activeTree : "");
    merged.orchard.treeId = treeSpecies[merged.orchard.treeId]?.fruit && merged.treeDiscovered.includes(merged.orchard.treeId) ? merged.orchard.treeId : "";
    merged.orchard.progress = clamp(Number(merged.orchard.progress) || 0, 0, 100);
    ["readyFruit", "readyMulch", "cycles"].forEach((key) => { merged.orchard[key] = Math.max(0, Math.floor(Number(merged.orchard[key]) || 0)); });
    merged.squeezerRecipe = squeezerRecipes[merged.squeezerRecipe] ? merged.squeezerRecipe : "wood";
    merged.fermenterRecipe = fermenterRecipes[merged.fermenterRecipe] ? merged.fermenterRecipe : "wood";
    merged.machineRecipe = centrifugeRecipes[merged.machineRecipe] ? merged.machineRecipe : "rawComb";
    Object.keys(merged.machineOutputBundle).forEach((key) => { merged.machineOutputBundle[key] = Math.max(0, Math.floor(Number(merged.machineOutputBundle[key]) || 0)); });
    Object.keys(merged.squeezerOutputBundle).forEach((key) => { merged.squeezerOutputBundle[key] = Math.max(0, Math.floor(Number(merged.squeezerOutputBundle[key]) || 0)); });
    Object.keys(merged.fermenterOutputBundle).forEach((key) => { merged.fermenterOutputBundle[key] = Math.max(0, Math.floor(Number(merged.fermenterOutputBundle[key]) || 0)); });
    if (Number(merged.squeezerOutput) > 0 && !Object.values(merged.squeezerOutputBundle).some((amount) => amount > 0)) merged.squeezerOutputBundle = { oil: Math.floor(Number(merged.squeezerOutput)) };
    if (Number(merged.fermenterOutput) > 0 && !Object.values(merged.fermenterOutputBundle).some((amount) => amount > 0)) merged.fermenterOutputBundle = { biomass: Math.floor(Number(merged.fermenterOutput)) };
    if (Number(merged.machineOutput) > 0 && !Object.values(merged.machineOutputBundle).some((amount) => amount > 0)) merged.machineOutputBundle = { honey: Math.floor(Number(merged.machineOutput)), wax: Math.floor(Number(merged.machineOutput)) };
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
    Object.keys(merged.woodInventory).forEach((tree) => { merged.woodInventory[tree] = Math.max(0, Math.floor(Number(merged.woodInventory[tree]) || 0)); });
    merged.machineActive = merged.machineActive === true;
    merged.squeezerActive = merged.squeezerActive === true;
    merged.fermenterActive = merged.fermenterActive === true;
    merged.distillerActive = merged.distillerActive === true;
    merged.automationEnabled = merged.automationEnabled === true;
    const automationReserveEnergy = Number(merged.automationReserveEnergy);
    merged.automationReserveEnergy = Number.isFinite(automationReserveEnergy) ? clamp(Math.floor(automationReserveEnergy), 0, 30) : defaultState.automationReserveEnergy;
    ["rawComb", "processedHoney", "processedWax", "totalCombCollected", "apiaryCombCollected", "explorations", "apiaryReady", "apiaryCycles", "machineOutput", "machineCycles", "machineStarts", "machineCollectedCycles", "squeezerOutput", "squeezerCycles", "fermenterOutput", "fermenterCycles", "distillerOutput", "distillerCycles", "distillerCollected", "automationCompletedBatches", "contractIndex", "contractsCompleted", "regionalContractsCompleted", "regionalActionCounter", "reputation", "rarePityTriggers", "beePityTriggers", "ecologyHighCycles", "treeReady", "treeReadyYield", "treeReadyResin", "treeCycles", "treeHarvests", "breedings", "breedingAttempts", "breedingFailures", "treeBreedingAttempts", "treeBreedingFailures", "butterflyBreedingAttempts", "butterflyBreedingFailures", "upgradesBought", "playTimeSeconds"].forEach((key) => {
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
    merged.contractIndex = clamp(merged.contractIndex, 0, contractData.length);
    merged.contractsCompleted = clamp(Math.max(merged.contractsCompleted, merged.contractIndex), 0, contractData.length);
    if (merged.contractsCompleted < 9) merged.automationEnabled = false;
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
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 100) : null
        };
      } else if (key === "treeBreeding") {
        merged[key] = {
          remaining,
          parentA: typeof merged[key].parentA === "string" ? merged[key].parentA : defaultState.treeBreedingParents.parentA,
          parentB: typeof merged[key].parentB === "string" ? merged[key].parentB : defaultState.treeBreedingParents.parentB,
          result: Object.prototype.hasOwnProperty.call(treeSpecies, merged[key].result) ? merged[key].result : "larch",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 100) : null
        };
      } else {
        merged[key] = {
          remaining,
          parentA: typeof merged[key].parentA === "string" ? merged[key].parentA : defaultState.butterflyBreedingParents.parentA,
          parentB: typeof merged[key].parentB === "string" ? merged[key].parentB : defaultState.butterflyBreedingParents.parentB,
          result: Object.prototype.hasOwnProperty.call(butterflySpecies, merged[key].result) ? merged[key].result : "swallow",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 100) : null
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
  if (!toast) return;
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
  const fertility = getActiveBeeTrait("fertility");
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
  const season = getSeasonData();
  const hostAvailable = getFlowerCount(state.butterflyHost) > 0;
  const hostBonus = hostAvailable ? (season.hosts.includes(state.butterflyHost) ? season.bonus : .01) : -.04;
  return clamp((pollination + diversity + event.butterflies + hostBonus) * activity, 0, .28);
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
  if (getRegionalSlotCount() > 0) state.regionalActionCounter += 1;
  if (state.strategyReady) {
    state.strategyReady = false;
    state.strategyActionsRemaining = 3;
  }
  state.strategyActionsRemaining = Math.max(0, state.strategyActionsRemaining - 1);
  if (state.strategyActionsRemaining > 0) return;
  state.strategyCycles += 1;
  state.strategyReady = true;
  state.ecologyHighCycles = getEcologyBreakdown().score >= 85 ? state.ecologyHighCycles + 1 : 0;
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
    const soilCost = 1 + (getActiveTreeTrait("growth") > 75 ? 1 : 0) + (getActiveTreeTrait("yield") > 80 ? 1 : 0);
    environment.soil = clamp(environment.soil - soilCost, 0, 100);
    environment.canopy = clamp(environment.canopy + .8, 0, 100);
    environment.flowerDensity = clamp(environment.flowerDensity + (getActiveTreeTrait("resin") < 60 ? 3 : 1), 0, 100);
  } else if (kind === "butterfly") {
    environment.leafPressure = clamp(environment.leafPressure + 5, 0, 100);
  } else if (kind === "fermenter") {
    environment.soil = clamp(environment.soil + 2, 0, 100);
  } else if (kind === "explore") {
    environment.flowerDensity = clamp(environment.flowerDensity + 8, 0, 100);
    environment.soil = clamp(environment.soil + 2, 0, 100);
  }
}

function initializeProgressionState(target) {
  if (!target || typeof target !== "object") return;
  target.pageUnlocks = { ...defaultState.pageUnlocks, ...(target.pageUnlocks || {}) };
  target.visitedViews = { ...defaultState.visitedViews, ...(target.visitedViews || {}) };
  target.energyCore = { level: clamp(Math.floor(Number(target.energyCore?.level) || 1), 1, energyCoreLevels.length) };
  target.achievements = target.achievements && typeof target.achievements === "object" ? target.achievements : {};
  target.achievementPending = Array.isArray(target.achievementPending) ? target.achievementPending : [];
  target.regionalContractOffers = Array.isArray(target.regionalContractOffers) ? target.regionalContractOffers : [];
  target.titles = Array.isArray(target.titles) ? [...new Set(target.titles)] : [];
  if (target._needsAchievementBackfill) {
    target.tutorialSurveyOpened ||= target.explorations > 0;
    target.tutorialSurveyClaimed ||= target.explorations > 0;
    target.machineStarts = Math.max(target.machineStarts || 0, target.machineCycles > 0 || target.machineActive || target.machineOutput > 0 ? 1 : 0);
    target.machineCollectedCycles = Math.max(target.machineCollectedCycles || 0, target.machineCycles > 0 ? 1 : 0);
    target.visitedViews.apiary ||= target.apiaryCombCollected > 0 || target.analyzed.length > 0;
    target.visitedViews.machines ||= target.machineStarts > 0;
    target.visitedViews.arbor ||= target.treeHarvests > 0 || target.treeCycles > 0;
    target.visitedViews.research ||= target.upgradesBought > 0;
    target.visitedViews.codex ||= target.breedings > 0 || target.analyzed.length + target.treeAnalyzed.length + target.butterflyAnalyzed.length >= 3;
    target.guideRouteChosen ||= target.contractsCompleted > 0 ? "machines" : "";
  }
  target.progressionSchema = defaultState.progressionSchema;
  syncPageUnlocks(false);
  checkAchievements({ migration: target._needsAchievementBackfill === true, silent: true });
  delete target._needsAchievementBackfill;
}

function getEnergyCoreLevel() {
  return clamp(Math.floor(Number(state.energyCore?.level) || 1), 1, energyCoreLevels.length);
}

function getEnergyCoreConfig(level = getEnergyCoreLevel()) {
  return energyCoreLevels[clamp(level, 1, energyCoreLevels.length) - 1];
}

function getEnergyCapacity() {
  return getEnergyCoreConfig().capacity;
}

function getEnergyRecoveryPerMinute() {
  return getEnergyCoreConfig().recovery;
}

function upgradeEnergyCore() {
  const level = getEnergyCoreLevel();
  const next = energyCoreLevels[level];
  if (!next) return showToast("能源核心已达到最高等级。");
  if (next.unlock && !next.unlock()) return showToast(next.unlockText);
  if (!canAfford(next.cost)) return showToast(`资源不足：需要 ${formatCost(next.cost)}。`);
  consumeResourceBundle(next.cost);
  state.energyCore.level = next.level;
  state.resources.energy = clamp(state.resources.energy + 20, 0, next.capacity);
  state.upgradesBought += 1;
  consumeStrategyAction();
  addLog(`能源核心升级至 LV.${next.level}：容量 ${next.capacity}，恢复 ${next.recovery}/分钟。`, "amber");
  showToast(`能源核心 LV.${next.level} · 能源 +20`);
  renderAll();
}

function rechargeEnergyWithBiofuel() {
  if (state.distillerCycles < 1) return showToast("完成第一次蒸馏后开放生物燃料应急补能。");
  if (state.resources.biofuel < 1) return showToast("生物燃料不足，需要 1 份。");
  if (state.resources.energy >= getEnergyCapacity()) return showToast("当前能源已经充满。");
  state.resources.biofuel -= 1;
  state.resources.energy = clamp(state.resources.energy + 35, 0, getEnergyCapacity());
  consumeStrategyAction();
  addLog("使用 1 份生物燃料进行应急补能，能源 +35。", "teal");
  showToast("应急补能完成：能源 +35");
  renderAll();
}

function getUnlockedZoneCount() {
  return Object.keys(zones).filter(isZoneUnlocked).length;
}

function getPageUnlockReason(view) {
  const reasons = {
    apiary: "完成教学调查并将收获入库后开放",
    machines: "从养蜂箱收取第一份蜂巢后开放",
    arbor: "第一次启动离心机后开放",
    research: "收取第一次离心产物后开放",
    shop: "完成第一次调查后开放",
    codex: "完成一次成功培育或累计分析 3 个样本后开放",
    achievements: "完成第一份主线委托后开放",
    automation: "完成主线委托 09 后开放"
  };
  return reasons[view] || "继续推进当前教程后开放";
}

function syncPageUnlocks(announce = gameStarted) {
  if (!state?.pageUnlocks) return;
  const conditions = {
    overview: true,
    explore: true,
    apiary: state.tutorialSurveyClaimed === true,
    machines: state.apiaryCombCollected >= 1,
    arbor: state.machineStarts >= 1 || state.machineActive || state.machineCycles >= 1,
    research: state.machineCollectedCycles >= 1,
    shop: state.explorations >= 1 || state.tutorialSurveyCompleted,
    codex: state.breedings >= 1 || state.treeCycles >= 1 || state.analyzed.length + state.treeAnalyzed.length + state.butterflyAnalyzed.length >= 3,
    achievements: state.contractsCompleted >= 1,
    automation: state.contractsCompleted >= 9
  };
  const names = { apiary: "蜜蜂育种", machines: "生产加工", arbor: "树木育种", research: "研究升级", shop: "村民商店", codex: "生态档案", achievements: "成就档案", automation: "自动化队列" };
  Object.entries(conditions).forEach(([view, ready]) => {
    if (!ready || state.pageUnlocks[view]) return;
    state.pageUnlocks[view] = true;
    if (announce && names[view]) {
      addLog(`新页面开放：${names[view]}。`, "green");
      showToast(`已开放：${names[view]}`);
    }
  });
}

function isPageUnlocked(view) {
  if (view === "overview" || view === "explore") return true;
  return state.pageUnlocks?.[view] === true;
}

function renderPageUnlocks() {
  syncPageUnlocks(true);
  $$(".nav-button[data-view]").forEach((button) => {
    const unlocked = isPageUnlocked(button.dataset.view);
    button.classList.toggle("page-locked", !unlocked);
    button.setAttribute("aria-disabled", String(!unlocked));
    button.title = unlocked ? "" : getPageUnlockReason(button.dataset.view);
  });
  const achievementTab = $('[data-codex-tab="achievements"]');
  if (achievementTab) {
    const unlocked = isPageUnlocked("achievements");
    achievementTab.classList.toggle("page-locked", !unlocked);
    achievementTab.setAttribute("aria-disabled", String(!unlocked));
  }
}

function checkAchievements({ migration = false, silent = false } = {}) {
  if (!state?.achievements) return 0;
  let added = 0;
  achievementData.forEach((achievement) => {
    if (state.achievements[achievement.id] || !achievement.condition()) return;
    const now = Date.now();
    state.achievements[achievement.id] = {
      completedAt: now,
      claimedAt: migration ? now : null,
      rewardSnapshot: structuredClone(achievement.reward || {}),
      reputation: achievement.reputation || 0,
      fullEnergy: achievement.fullEnergy === true,
      titleReward: achievement.titleReward || ""
    };
    added += 1;
    if (!migration && !silent) addLog(`成就完成：${achievement.title}。前往生态档案领取奖励。`, "green");
  });
  return added;
}

function getCompletedAchievementCount() {
  return Object.keys(state.achievements || {}).filter((id) => achievementData.some((item) => item.id === id)).length;
}

function getAchievementPoints() {
  return achievementData.reduce((sum, achievement) => sum + (state.achievements?.[achievement.id] ? achievementTiers[achievement.tier].points : 0), 0);
}

function getUnclaimedAchievementCount() {
  return Object.values(state.achievements || {}).filter((record) => record?.completedAt && !record.claimedAt).length;
}

function claimAchievement(id, quiet = false) {
  const definition = achievementData.find((item) => item.id === id);
  const record = state.achievements?.[id];
  if (!definition || !record?.completedAt || record.claimedAt) return false;
  Object.entries(record.rewardSnapshot || {}).forEach(([resource, amount]) => {
    if (resource === "energy") state.resources.energy = clamp(state.resources.energy + amount, 0, getEnergyCapacity());
    else if (resource in flowerSources) state.flowerInventory[resource] = getFlowerCount(resource) + amount;
    else {
      const result = addToWarehouse(resource, amount);
      if (result.overflow > 0) state.achievementPending = mergeSurveyItems([...state.achievementPending, { kind: "resource", id: resource, amount: result.overflow, label: resourceNames[resource] }]);
    }
  });
  if (record.fullEnergy) state.resources.energy = getEnergyCapacity();
  state.reputation += Math.max(0, Number(record.reputation) || 0);
  if (record.titleReward && !state.titles.includes(record.titleReward)) state.titles.push(record.titleReward);
  record.claimedAt = Date.now();
  if (!quiet) showToast(`已领取成就：${definition.title}`);
  return true;
}

function claimAllAchievements() {
  const count = achievementData.reduce((sum, item) => sum + (claimAchievement(item.id, true) ? 1 : 0), 0);
  if (!count) return showToast("当前没有可领取的成就奖励。");
  addLog(`领取 ${count} 项成就奖励。`, "amber");
  showToast(`已领取 ${count} 项成就奖励`);
  renderAll();
}

function claimAchievementPending() {
  if (!state.achievementPending.length) return showToast("成就暂存箱为空。");
  const claim = claimSurveyItems(state.achievementPending);
  state.achievementPending = claim.overflow;
  showToast(claim.overflow.length ? `已整理 ${claim.accepted} 份，仍有物资等待空间。` : "成就暂存物资已全部入库。");
  renderAll();
}

function getRegionalSlotCount() {
  if (state.contractsCompleted >= 15) return 3;
  if (state.contractsCompleted >= 9) return 2;
  if (state.contractsCompleted >= 6) return 1;
  return 0;
}

function makeRegionalOffer(slot, serial = state.regionalContractsCompleted + state.regionalActionCounter) {
  const eligible = regionalContractTemplates.filter((template) => !template.unlock || template.unlock());
  const template = eligible[(serial + slot * 2) % Math.max(1, eligible.length)] || regionalContractTemplates[0];
  return { offerId: `${template.id}-${Date.now()}-${slot}-${serial}`, templateId: template.id, createdAt: Date.now() };
}

function syncRegionalContracts() {
  const slots = getRegionalSlotCount();
  state.regionalContractOffers = state.regionalContractOffers.slice(0, slots).filter((offer) => regionalContractTemplates.some((item) => item.id === offer.templateId && (!item.unlock || item.unlock())));
  while (state.regionalContractOffers.length < slots) state.regionalContractOffers.push(makeRegionalOffer(state.regionalContractOffers.length));
  if (slots > 0 && state.regionalActionCounter >= 5) {
    state.regionalContractOffers = Array.from({ length: slots }, (_, slot) => makeRegionalOffer(slot, state.regionalContractsCompleted + state.regionalActionCounter + 1));
    state.regionalActionCounter = 0;
  }
}

function completeRegionalContract(slot) {
  syncRegionalContracts();
  const offer = state.regionalContractOffers[slot];
  const contract = regionalContractTemplates.find((item) => item.id === offer?.templateId);
  if (!contract) return showToast("这个区域委托已经轮换，请重新查看。");
  const missing = getMissingResources(contract.requires);
  if (missing.length) return showToast(`资源不足：${formatResourceBundle(Object.fromEntries(missing))}。`);
  const blocker = getWarehouseBundleBlocker(contract.rewards, contract.requires);
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  consumeResourceBundle(contract.requires);
  grantResourceBundle(contract.rewards);
  state.reputation += contract.reputation;
  state.regionalContractsCompleted += 1;
  state.regionalContractOffers[slot] = makeRegionalOffer(slot, state.regionalContractsCompleted + 1);
  consumeStrategyAction();
  addLog(`区域委托完成：${contract.title}，声望 +${contract.reputation}。`, "green");
  showToast(`区域委托完成 · 声望 +${contract.reputation}`);
  renderAll();
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

const resourceNames = { emerald: "绿宝石", rawComb: "蜂蜜脾", drippingComb: "滴落蜂巢", stickyComb: "黏性蜂巢", silkyComb: "丝质蜂巢", royalJelly: "蜂王浆", pollenCluster: "花粉簇", silkPropolis: "丝质蜂胶", honey: "蜂蜜", wax: "蜂蜡", wood: "木材", oil: "种子油", juice: "果汁", mulch: "覆盖物", fertilizer: "肥料", container: "空容器", resin: "树脂", biomass: "生物质", biofuel: "生物燃料", energy: "能源", wildflower: "野花", clover: "三叶草", tropical: "热带花", wheat: "小麦花源", gourd: "葫芦花源", cactus: "仙人掌花源", mushroom: "蘑菇花源", nether: "下界花源", end: "末地花源", cherry: "樱桃", walnut: "核桃", chestnut: "栗子", lemon: "柠檬", plum: "李子", papaya: "木瓜", date: "椰枣", greenhouseSeal: "温室密封件" };
const warehouseBaseCapacities = Object.freeze(Object.fromEntries(Object.entries(warehouseResourceCategories).map(([resource, category]) => [resource, warehouseCategoryData[category].capacities[0]])));
const warehouseResources = Object.keys(warehouseBaseCapacities);

function getUpgradeLevel(type) {
  return clamp(Number(state.upgrades?.[type]) || 1, 1, 3);
}

function getWarehouseCapacity(resource) {
  const category = warehouseResourceCategories[resource];
  if (!category) return 0;
  return warehouseCategoryData[category].capacities[getUpgradeLevel("warehouse") - 1];
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

function consumeWoodLedger(amount) {
  let remaining = Math.max(0, Math.floor(Number(amount) || 0));
  Object.keys(state.woodInventory || {}).forEach((treeId) => {
    if (remaining <= 0) return;
    const used = Math.min(remaining, Math.max(0, Number(state.woodInventory[treeId]) || 0));
    state.woodInventory[treeId] -= used;
    remaining -= used;
  });
}

function registerSpeciesWood(treeId, amount) {
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  if (!value) return;
  state.woodInventory.generic = Math.max(0, (state.woodInventory.generic || 0) - value);
  state.woodInventory[treeId] = (state.woodInventory[treeId] || 0) + value;
}

function addToWarehouse(resource, amount) {
  const requested = Math.max(0, Math.floor(Number(amount) || 0));
  const accepted = Math.min(requested, getWarehouseSpace(resource));
  if (resource === "rawComb") state.rawComb += accepted;
  else if (resource in flowerSources) state.flowerInventory[resource] = getFlowerCount(resource) + accepted;
  else if (resource in fruitData) state.fruitInventory[resource] = (state.fruitInventory[resource] || 0) + accepted;
  else if (state.resources && resource in state.resources) {
    state.resources[resource] += accepted;
    if (resource === "wood") state.woodInventory.generic = (state.woodInventory.generic || 0) + accepted;
  }
  return { accepted, overflow: requested - accepted };
}

function getStoredResourceAmount(resource) {
  if (resource === "rawComb") return Math.max(0, Number(state.rawComb) || 0);
  if (resource === "greenhouseSeal") return Math.max(0, Number(state.greenhouseSeals) || 0);
  if (resource in flowerSources) return getFlowerCount(resource);
  if (resource in fruitData) return Math.max(0, Number(state.fruitInventory?.[resource]) || 0);
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
    else if (resource === "greenhouseSeal") state.greenhouseSeals = Math.max(0, state.greenhouseSeals - amount);
    else if (resource in flowerSources) state.flowerInventory[resource] = Math.max(0, getFlowerCount(resource) - amount);
    else if (resource in fruitData) state.fruitInventory[resource] = Math.max(0, getStoredResourceAmount(resource) - amount);
    else {
      state.resources[resource] -= amount;
      if (resource === "wood") consumeWoodLedger(amount);
    }
  });
}

function grantResourceBundle(bundle) {
  Object.entries(bundle).forEach(([resource, amount]) => {
    if (resource === "energy") state.resources.energy = clamp(state.resources.energy + amount, 0, getEnergyCapacity());
    else if (resource === "emerald") state.resources.emerald = Math.max(0, Math.floor(state.resources.emerald + amount));
    else if (resource === "greenhouseSeal") state.greenhouseSeals += Math.max(0, Math.floor(amount));
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
  return Object.entries(cost).every(([resource, amount]) => getStoredResourceAmount(resource) >= amount);
}

function getShopTier() {
  let tier = 1;
  shopTierData.forEach((entry, index) => { if (state.reputation >= entry.reputation) tier = index + 1; });
  return tier;
}

function getEquipmentCapacity() {
  return warehouseCategoryData.equipment.capacities[getUpgradeLevel("warehouse") - 1];
}

function getEquipmentLoad() {
  const frames = Object.values(state.frameInventory).reduce((sum, amount) => sum + Math.max(0, Number(amount) || 0), 0);
  const equipped = state.apiaryFrames.filter(Boolean).length;
  const tools = Object.values(state.tools).filter((durability) => Number(durability) > 0).length;
  return frames + equipped + tools + state.greenhouseSeals;
}

function getShopBuyOffers() {
  const saplings = knownDiscoveredTrees().map((treeId) => ({
    id: `sapling-${treeId}`,
    name: `${treeSpecies[treeId].name}树苗`,
    tier: treeId === "oak" || treeId === "birch" ? 1 : 3,
    sapling: treeId,
    amount: treeId === "oak" || treeId === "birch" ? 4 : 1,
    price: saplingShopPrices[treeId] || 8,
    limit: treeId === "sequoia" ? 1 : treeId === "oak" || treeId === "birch" ? 4 : 2,
    icon: treeSpecies[treeId].icon
  }));
  return [...shopBuyOffers, ...saplings];
}

function getShopPurchaseCount(id) {
  return Math.max(0, Math.floor(Number(state.shopPurchases?.[id]) || 0));
}

function isShopBuyOfferUnlocked(offer) {
  if (!offer || getShopTier() < offer.tier) return false;
  if (offer.sapling && !knownDiscoveredTrees().includes(offer.sapling)) return false;
  if (offer.sapling && offer.tier >= 3 && state.treeCycles < 1 && getTreeSaplingCount(offer.sapling) <= 0) return false;
  return true;
}

function getShopBuyMax(offer) {
  if (!isShopBuyOfferUnlocked(offer)) return 0;
  const remaining = Math.max(0, offer.limit - getShopPurchaseCount(offer.id));
  let max = Math.min(remaining, Math.floor(state.resources.emerald / offer.price));
  if (offer.output) {
    Object.entries(offer.output).forEach(([resource, amount]) => { max = Math.min(max, Math.floor(getWarehouseSpace(resource) / amount)); });
  }
  if (offer.energy) max = Math.min(max, Math.ceil(Math.max(0, getEnergyCapacity() - state.resources.energy) / offer.energy));
  if (offer.frame || offer.equipment || offer.seal) max = Math.min(max, Math.max(0, getEquipmentCapacity() - getEquipmentLoad()));
  return Math.max(0, max);
}

function getShopSellMax(offer) {
  return Math.max(0, Math.min(...Object.entries(offer.input).map(([resource, amount]) => Math.floor(getStoredResourceAmount(resource) / amount))));
}

function resolveTradeTimes(max, quantity) {
  if (quantity === "max") return max;
  return Math.min(max, Math.max(1, Math.floor(Number(quantity) || 1)));
}

function executeShopTrade(kind, id, quantity = 1) {
  if (kind === "buy") {
    const offer = getShopBuyOffers().find((item) => item.id === id);
    if (!offer || !isShopBuyOfferUnlocked(offer)) return showToast("该商品尚未解锁。");
    const max = getShopBuyMax(offer);
    const times = resolveTradeTimes(max, quantity);
    if (times <= 0) return showToast(getShopPurchaseCount(offer.id) >= offer.limit ? "本轮限购数量已用完。" : "绿宝石、仓库空间或装备槽不足。");
    const emeraldCost = offer.price * times;
    if (state.resources.emerald < emeraldCost) return showToast("绿宝石不足。");
    const output = offer.output ? Object.fromEntries(Object.entries(offer.output).map(([resource, amount]) => [resource, amount * times])) : null;
    if (output) {
      const blocker = getWarehouseBundleBlocker(output);
      if (blocker) return showToast(`交易失败：${formatWarehouseBlocker(blocker)}。`);
    }
    state.resources.emerald -= emeraldCost;
    if (output) grantResourceBundle(output);
    if (offer.energy) state.resources.energy = clamp(state.resources.energy + offer.energy * times, 0, getEnergyCapacity());
    if (offer.sapling) state.treeSaplings[offer.sapling] = getTreeSaplingCount(offer.sapling) + offer.amount * times;
    if (offer.frame) state.frameInventory[offer.frame] += times;
    if (offer.equipment) state.tools[offer.equipment] += offer.durability * times;
    if (offer.seal) state.greenhouseSeals += offer.seal * times;
    state.shopPurchases[offer.id] = getShopPurchaseCount(offer.id) + times;
    addLog(`村民交易：支付绿宝石 ${emeraldCost}，购买${offer.name} ${times} 组。`, "green");
    showToast(`购买成功：${offer.name} ×${times}`);
  } else {
    const offer = shopSellOffers.find((item) => item.id === id);
    if (!offer) return;
    const max = getShopSellMax(offer);
    const times = resolveTradeTimes(max, quantity);
    if (times <= 0) return showToast(`库存不足：每组需要 ${formatResourceBundle(offer.input)}。`);
    const input = Object.fromEntries(Object.entries(offer.input).map(([resource, amount]) => [resource, amount * times]));
    if (!canAfford(input)) return showToast("交易已取消：库存发生变化。");
    consumeResourceBundle(input);
    state.resources.emerald += offer.reward * times;
    addLog(`村民收购：交付${formatResourceBundle(input)}，获得绿宝石 ${offer.reward * times}。`, "amber");
    showToast(`出售成功：绿宝石 +${offer.reward * times}`);
  }
  consumeStrategyAction();
  saveState(true);
  renderAll();
}

function getShopOrders() {
  const source = shopOrderTemplates[state.shopRotation % shopOrderTemplates.length];
  return source.map((order) => {
    if (order.input.cherry && !state.treeDiscovered.includes("cherry")) return { name: "林场木材订单", input: { wood: 24 }, reward: 3 };
    if (order.input.papaya && !state.treeDiscovered.includes("papaya")) return { name: "果园覆盖物订单", input: { mulch: 18 }, reward: 3 };
    if (order.input.drippingComb && !state.discovered.some((id) => beeProductionData[id]?.comb === "drippingComb")) return { name: "蜂蜜脾样本订单", input: { rawComb: 9 }, reward: 4 };
    return order;
  });
}

function completeShopOrder(index) {
  const order = getShopOrders()[Number(index)];
  if (!order) return;
  if (!canAfford(order.input)) return showToast(`订单物资不足：${formatResourceBundle(order.input)}。`);
  consumeResourceBundle(order.input);
  state.resources.emerald += order.reward;
  state.shopRotation += 1;
  state.shopManualRefreshes = 0;
  state.shopPurchases = {};
  addLog(`轮换订单完成：${order.name}，绿宝石 +${order.reward}。`, "green");
  showToast(`订单完成：绿宝石 +${order.reward}`);
  saveState(true);
  renderAll();
}

function refreshShopOrders() {
  if (state.shopManualRefreshes >= 2) return showToast("本轮手动刷新次数已用完。");
  if (state.resources.emerald < 3) return showToast("刷新订单需要 3 绿宝石。");
  state.resources.emerald -= 3;
  state.shopManualRefreshes += 1;
  state.shopRotation += 1;
  state.shopPurchases = {};
  addLog("支付 3 绿宝石刷新村民订单与货架库存。", "teal");
  saveState(true);
  renderAll();
}

function recordProductionCycle() {
  state.productionCycles += 1;
  if (state.productionCycles % 5 !== 0) return;
  state.shopRotation += 1;
  state.shopManualRefreshes = 0;
  state.shopPurchases = {};
  addLog("完成 5 个生产周期，村民货架与轮换订单已刷新。", "teal");
}

function getSeasonData() {
  const seasons = [
    { id: "spring", name: "春季", hosts: ["wildflower", "clover"], bonus: .08 },
    { id: "summer", name: "夏季", hosts: ["tropical", "gourd", "cactus"], bonus: .1 },
    { id: "autumn", name: "秋季", hosts: ["wheat", "mushroom"], bonus: .06 },
    { id: "winter", name: "冬季", hosts: ["nether", "end"], bonus: -.04 }
  ];
  return seasons[Math.floor(state.productionCycles / 8) % seasons.length];
}

function upgradeLateFacility(id) {
  const facility = lateFacilityData[id];
  if (!facility || state.lateFacilities[id]) return showToast("该后期设施已经建成。");
  if (!canAfford(facility.cost)) return showToast(`建造需要：${formatResourceBundle(facility.cost)}。`);
  consumeResourceBundle(facility.cost);
  state.lateFacilities[id] = 1;
  consumeStrategyAction();
  addLog(`后期设施建成：${facility.name}。${facility.detail}。`, "amber");
  showToast(`${facility.name}建造完成`);
  saveState(true);
  renderAll();
}

function getCurrentBeeTrait(key, fallback = 50) {
  const ids = [getParentId("princess", "forest"), getParentId("drone", "meadows")];
  const values = ids.map((id) => species[id]?.traits?.[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function getActiveBeeId() {
  return knownDiscoveredBees().includes(state.activeBee) ? state.activeBee : "forest";
}

function getActiveBeeTrait(key, fallback = 50) {
  return Number(species[getActiveBeeId()]?.traits?.[key]) || fallback;
}

function getActiveBeeProduction() {
  return beeProductionData[getActiveBeeId()] || beeProductionData.forest;
}

function getFrameProductionBonus() {
  return state.apiaryFrames.reduce((sum, frame, index) => {
    if (index === 2 && !state.lateFacilities.alveary) return sum;
    return sum + (frameData[frame?.id]?.bonus || 0);
  }, 0);
}

function getApiaryReadyBundle() {
  if (hasBundleItems(state.apiaryReadyBundle)) return state.apiaryReadyBundle;
  return state.apiaryReady > 0 ? { rawComb: state.apiaryReady } : {};
}

function consumeApiaryFrameDurability() {
  state.apiaryFrames = state.apiaryFrames.map((frame, index) => {
    if (!frame || (index === 2 && !state.lateFacilities.alveary)) return frame;
    const durability = Math.max(0, frame.durability - 1);
    if (durability > 0) return { ...frame, durability };
    addLog(`${frameData[frame.id].name}耐久耗尽并损坏。`, "amber");
    return null;
  });
}

function getActiveHabitatId() {
  return zones[state.activeHabitat] && isZoneUnlocked(state.activeHabitat) ? state.activeHabitat : "forest";
}

function getHabitatSuitability() {
  const habitat = getActiveHabitatId();
  const inheritedFit = species[getActiveBeeId()]?.habitat?.[habitat] ?? .7;
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
  const alvearyBonus = state.lateFacilities.alveary ? 1.25 : 1;
  return Math.max(.4, (baseRate + (getActiveBeeTrait("speed") - 50) * .008) * getHabitatSuitability() * (1 + getFrameProductionBonus()) * alvearyBonus);
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
  const lifespan = getActiveBeeTrait("lifespan");
  const fertility = getActiveBeeTrait("fertility");
  return Math.max(1, Math.min(2, Math.floor((lifespan + fertility) / 130) + 1));
}

function getPollinationBonus() {
  return clamp(getBeePollinationPotential() + getButterflyPollinationBonus(), 0, .34);
}

function getActiveTreeId() {
  return knownDiscoveredTrees().includes(state.activeTree) ? state.activeTree : "oak";
}

function getActiveTreeTrait(key, fallback = 50) {
  return Number(treeSpecies[getActiveTreeId()]?.traits?.[key]) || fallback;
}

function getTreeRate() {
  const baseRate = .65 + (getUpgradeLevel("treeFarm") - 1) * .15;
  const environment = getActiveEnvironment();
  const soilFactor = clamp(.55 + environment.soil / 180, .55, 1.1);
  const lightFactor = clamp(.62 + environment.light / 210, .62, 1.08);
  const farmBonus = state.lateFacilities.automaticFarm ? 1.2 : 1;
  return Math.max(.25, (baseRate + (getActiveTreeTrait("growth") - 50) * .004) * (1 + getPollinationBonus()) * soilFactor * lightFactor * getStrategyConfig().treeRate * getEcologyProductionMultiplier() * farmBonus);
}

function getTreeYieldMultiplier() {
  const environment = getActiveEnvironment();
  const leafFactor = clamp(1 - Math.max(0, environment.leafPressure - 50) * .004, .72, 1);
  const soilFactor = clamp(.7 + environment.soil / 250, .7, 1.1);
  return clamp((1 + (getActiveTreeTrait("yield") - 50) / 200) * (1 + getPollinationBonus() * .5) * leafFactor * soilFactor, .55, 1.5);
}

function getTreeYieldPerCycle() {
  return Math.max(1, Math.round(8 * getTreeYieldMultiplier()));
}

function getTreeResinPerCycle() {
  const resinTrait = getActiveTreeTrait("resin");
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

function getFruitTreeIds() {
  return knownDiscoveredTrees().filter((id) => treeSpecies[id]?.fruit && fruitData[treeSpecies[id].fruit]);
}

function getOrchardStage(progress = state.orchard.progress) {
  const value = clamp(Number(progress) || 0, 0, 100);
  if (value < 25) return { id: "growth", name: "生长", index: 1 };
  if (value < 50) return { id: "flowering", name: "开花", index: 2 };
  if (value < 75) return { id: "pollination", name: "授粉", index: 3 };
  return { id: "fruiting", name: "结果", index: 4 };
}

function getOrchardClimateSuitability(treeId = state.orchard.treeId) {
  const climate = treeSpecies[treeId]?.climate || "temperate";
  const environment = getActiveEnvironment();
  const targets = {
    temperate: { temperature: 56, humidity: 56, light: 66 },
    warm: { temperature: 68, humidity: 54, light: 74 },
    tropical: { temperature: 80, humidity: 78, light: 66 },
    dry: { temperature: 78, humidity: 28, light: 86 }
  };
  const target = targets[climate] || targets.temperate;
  const penalty = Math.abs(environment.temperature - target.temperature) * .004 + Math.abs(environment.humidity - target.humidity) * .003 + Math.abs(environment.light - target.light) * .002;
  const suitability = clamp(1.08 - penalty, .42, 1.08);
  return state.lateFacilities.greenhouse ? Math.max(.85, suitability) : suitability;
}

function getOrchardPollinationMultiplier() {
  const environment = getActiveEnvironment();
  const flowerFactor = getFlowerCount() > 0 ? .22 : 0;
  const flowerDensity = clamp(environment.flowerDensity / 250, 0, .4);
  const pollenBoost = state.orchardPollen.cycles > 0 ? .18 : 0;
  return clamp(.32 + flowerFactor + flowerDensity + getPollinationBonus() + pollenBoost, .32, 1.45);
}

function getOrchardRate() {
  if (!state.orchard.treeId || state.orchard.readyFruit > 0 || state.orchard.readyMulch > 0) return 0;
  const tree = treeSpecies[state.orchard.treeId];
  if (!tree?.fruit) return 0;
  const environment = getActiveEnvironment();
  const soilFactor = clamp(.42 + environment.soil / 150, .42, 1.08);
  const growthFactor = clamp(.72 + (tree.traits.growth - 50) / 125, .55, 1.25);
  return Math.max(.16, .42 * growthFactor * soilFactor * getOrchardClimateSuitability() * getOrchardPollinationMultiplier() * getEcologyProductionMultiplier());
}

function advanceOrchard(seconds) {
  const safeSeconds = clamp(Number(seconds) || 0, 0, 60 * 60 * 8);
  if (safeSeconds <= 0 || !state.orchard.treeId || state.orchard.readyFruit > 0 || state.orchard.readyMulch > 0) return false;
  const tree = treeSpecies[state.orchard.treeId];
  if (!tree?.fruit || !knownDiscoveredTrees().includes(state.orchard.treeId)) return false;
  state.orchard.progress += getOrchardRate() * safeSeconds;
  if (state.orchard.progress < 100) return false;
  const environment = getActiveEnvironment();
  const climate = getOrchardClimateSuitability();
  const pollination = getOrchardPollinationMultiplier();
  const health = clamp((environment.soil + (100 - environment.leafPressure)) / 170, .55, 1.15);
  state.orchard.progress = 0;
  state.orchard.readyFruit = Math.max(1, Math.round(tree.orchardYield * climate * pollination * health));
  state.orchard.readyMulch = Math.max(1, Math.round(tree.mulchYield * clamp(health, .75, 1.2)));
  state.orchard.cycles += 1;
  const farmSoilSaving = state.lateFacilities.automaticFarm ? 2 : 0;
  environment.soil = clamp(environment.soil - Math.max(1, 4 + Math.max(0, Math.round(tree.orchardYield / 5)) - farmSoilSaving), 0, 100);
  environment.leafPressure = clamp(environment.leafPressure + 2, 0, 100);
  if (state.orchardPollen.cycles > 0) state.orchardPollen.cycles -= 1;
  recordProductionCycle();
  addLog(`果园完成一轮${tree.name}结果：${fruitData[tree.fruit].name} ${state.orchard.readyFruit}、覆盖物 ${state.orchard.readyMulch}。`, "green");
  showToast(`果园结果：${fruitData[tree.fruit].name} ${state.orchard.readyFruit}`);
  return true;
}

function hasBundleItems(bundle) {
  return Object.values(bundle || {}).some((amount) => Number(amount) > 0);
}

function isSqueezerUnlocked() {
  return state.machineCycles >= 1;
}

function getSqueezerDuration() {
  return 8 * getStrategyConfig().machineRate;
}

function getUnlockedSqueezerRecipeIds() {
  return Object.keys(squeezerRecipes).filter((id) => id === "wood" || getStoredResourceAmount(id) > 0 || knownDiscoveredTrees().some((treeId) => treeSpecies[treeId]?.fruit === id));
}

function getSelectedSqueezerRecipe() {
  const ids = getUnlockedSqueezerRecipeIds();
  const id = ids.includes(state.squeezerRecipe) ? state.squeezerRecipe : "wood";
  return { id, recipe: squeezerRecipes[id] };
}

function getSqueezerReadyBundle() {
  if (hasBundleItems(state.squeezerOutputBundle)) return state.squeezerOutputBundle;
  return state.squeezerOutput > 0 ? { oil: state.squeezerOutput } : {};
}

function isFermenterUnlocked() {
  return knownDiscoveredBees().length >= 3 && state.contractsCompleted >= 1;
}

function getFermenterDuration() {
  return 10 * getStrategyConfig().machineRate;
}

function getSelectedFermenterRecipe() {
  const id = fermenterRecipes[state.fermenterRecipe] ? state.fermenterRecipe : "wood";
  return { id, recipe: fermenterRecipes[id] };
}

function getFermenterReadyBundle() {
  if (hasBundleItems(state.fermenterOutputBundle)) return state.fermenterOutputBundle;
  return state.fermenterOutput > 0 ? { biomass: state.fermenterOutput } : {};
}

function isDistillerUnlocked() {
  return state.fermenterCycles >= 1;
}

function isAutomationUnlocked() {
  return state.contractsCompleted >= 9;
}

function getAutomationReserveEnergy() {
  const value = Number(state.automationReserveEnergy);
  return Number.isFinite(value) ? clamp(Math.floor(value), 0, 30) : 10;
}

function getDistillerDuration() {
  return 12 * getStrategyConfig().machineRate;
}

function getUnlockedCentrifugeRecipeIds() {
  const ids = Object.keys(centrifugeRecipes).filter((id) => id === "rawComb" || getStoredResourceAmount(id) > 0 || state.machineRecipe === id || state.machineJob?.recipeId === id);
  return ids.length ? ids : ["rawComb"];
}

function getSelectedCentrifugeRecipe() {
  const ids = getUnlockedCentrifugeRecipeIds();
  const id = ids.includes(state.machineRecipe) ? state.machineRecipe : ids[0];
  return { id, recipe: centrifugeRecipes[id] };
}

function getMachineReadyBundle() {
  if (hasBundleItems(state.machineOutputBundle)) return state.machineOutputBundle;
  return state.machineOutput > 0 ? { honey: state.machineOutput, wax: state.machineOutput } : {};
}

function getCurrentRecipeLedger() {
  if (state.machineActive || state.machineOutput > 0) {
    const recipe = state.machineJob?.recipeId ? centrifugeRecipes[state.machineJob.recipeId] : getSelectedCentrifugeRecipe().recipe;
    return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(state.machineOutput > 0 ? getMachineReadyBundle() : recipe.output), duration: getMachineDuration(), energy: recipe.energy };
  }
  if (state.squeezerActive || state.squeezerOutput > 0) {
    const recipe = state.squeezerJob?.recipeId ? squeezerRecipes[state.squeezerJob.recipeId] : getSelectedSqueezerRecipe().recipe;
    return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(state.squeezerOutput > 0 ? getSqueezerReadyBundle() : recipe.output), duration: getSqueezerDuration(), energy: recipe.energy };
  }
  if (state.fermenterActive || state.fermenterOutput > 0) {
    const recipe = state.fermenterJob?.recipeId ? fermenterRecipes[state.fermenterJob.recipeId] : getSelectedFermenterRecipe().recipe;
    return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(state.fermenterOutput > 0 ? getFermenterReadyBundle() : recipe.output), duration: getFermenterDuration(), energy: recipe.energy };
  }
  if (state.distillerActive || state.distillerOutput > 0) return { title: "生物燃料蒸馏", input: "1 生物质 + 4 能源", output: "1 生物燃料", duration: getDistillerDuration(), energy: 4 };
  if (getUnlockedCentrifugeRecipeIds().some((id) => getStoredResourceAmount(id) > 0)) {
    const recipe = getSelectedCentrifugeRecipe().recipe;
    return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(recipe.output), duration: getMachineDuration(), energy: recipe.energy };
  }
  if (isSqueezerUnlocked() && state.squeezerCycles === 0) { const recipe = getSelectedSqueezerRecipe().recipe; return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(recipe.output), duration: getSqueezerDuration(), energy: recipe.energy }; }
  if (isFermenterUnlocked() && state.fermenterCycles === 0) { const recipe = getSelectedFermenterRecipe().recipe; return { title: recipe.name, input: formatResourceBundle(recipe.input), output: formatResourceBundle(recipe.output), duration: getFermenterDuration(), energy: recipe.energy }; }
  if (isDistillerUnlocked() && state.distillerCycles === 0) return { title: "生物燃料蒸馏", input: "1 生物质 + 4 能源", output: "1 生物燃料", duration: getDistillerDuration(), energy: 4 };
  return { title: "蜂巢基础分离", input: "1 蜂巢", output: "1 蜂蜜 + 1 蜂蜡", duration: getMachineDuration(), energy: 2 };
}

function getUpgradeEffectText(type) {
  if (type === "apiary") return `${upgradeData[type].effect} · 当前 ${getApiaryEffectiveRate().toFixed(2)}%/s`;
  if (type === "treeFarm") return `${upgradeData[type].effect} · 当前 ${getTreeRate().toFixed(2)}%/s`;
  if (type === "warehouse") return `${upgradeData[type].effect} · 常规 ${warehouseCategoryData.regular.capacities[getUpgradeLevel("warehouse") - 1]} / 稀有 ${warehouseCategoryData.rare.capacities[getUpgradeLevel("warehouse") - 1]}`;
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
  consumeResourceBundle(cost);
  state.upgrades[type] = level + 1;
  state.upgradesBought += 1;
  consumeStrategyAction();
  addLog(`${data.name} 已升级至 LV.${String(level + 1).padStart(2, "0")}，${data.effect}。`, "amber");
  showToast(`${data.name} 升级完成`);
  saveState(true);
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
  if (contract.fullEnergy) state.resources.energy = getEnergyCapacity();
  if (contract.titleReward && !state.titles.includes(contract.titleReward)) state.titles.push(contract.titleReward);
  state.contractIndex += 1;
  state.contractsCompleted += 1;
  state.reputation += contract.reputation;
  consumeStrategyAction();
  addLog(`生态委托完成：${contract.title}，获得 ${formatResourceBundle(contract.rewards)}。`, "green");
  showToast(`委托完成：声望 +${contract.reputation}`);
  renderAll();
}

function toggleAutomation() {
  if (!isAutomationUnlocked()) return showToast("完成主线委托 09 后解锁机器队列。");
  state.automationEnabled = !state.automationEnabled;
  addLog(`机器队列已${state.automationEnabled ? "启动" : "暂停"}，当前顺序：离心机 → 榨汁机 → 发酵机 → 蒸馏机。`, state.automationEnabled ? "green" : "amber");
  showToast(state.automationEnabled ? "自动化协议已启动" : "自动化协议已暂停");
  renderAll();
}

function selectAutomationReserve(value) {
  if (!isAutomationUnlocked()) return showToast("完成主线委托 09 后才能配置机器队列。");
  const parsed = Number(value);
  state.automationReserveEnergy = Number.isFinite(parsed) ? clamp(Math.floor(parsed), 0, 30) : 10;
  saveState();
  showToast(`机器队列将保留 ${state.automationReserveEnergy} 点探索能源`);
  renderAll();
}

function getGuideCompletionFlags() {
  return [
    true,
    state.tutorialSurveyOpened === true,
    state.tutorialSurveyCompleted === true,
    state.tutorialSurveyClaimed === true,
    state.visitedViews.apiary === true,
    state.apiaryCombCollected >= 1,
    state.machineStarts >= 1,
    state.visitedViews.arbor === true,
    state.machineCollectedCycles >= 1,
    getEnergyCoreLevel() >= 2,
    state.analyzed.includes("forest") && state.analyzed.includes("meadows"),
    state.breedings > 0,
    state.contractsCompleted > 0,
    Boolean(state.guideRouteChosen)
  ];
}

function getGuideStep() {
  const nextStep = getGuideCompletionFlags().findIndex((done) => !done);
  return nextStep === -1 ? guideSteps.length : nextStep;
}

function getMissionPanelData() {
  const stepIndex = getGuideStep();
  if (stepIndex >= guideSteps.length) return { label: "FIELD ARCHIVE", stamp: "OPEN", title: "新手教程已完成", detail: "调查、养蜂、加工、树木、研究、培育、委托与档案已经连成闭环。", action: "overview", actionLabel: "规划长期进程", target: ".chapter-deck" };
  const item = guideSteps[stepIndex];
  const phase = stepIndex < 4 ? "FIELD" : stepIndex < 9 ? "CORE LOOP" : stepIndex < 13 ? "GROWTH" : "ROUTE";
  return { label: `${phase} · STEP ${String(stepIndex + 1).padStart(2, "0")}`, stamp: stepIndex < 4 ? "NOW" : stepIndex < 9 ? "CYCLE" : "LONG", title: item.title, detail: item.text, action: item.action, actionLabel: item.actionLabel, target: getGuideTarget(stepIndex, item.target) };
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
      item: { title: "新手教程完成", text: "你已经打通调查、养蜂、加工、树木、研究、杂交与委托，可以按章节目标继续发展。", action: "overview", actionLabel: "查看长期进程", target: ".chapter-deck" }
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
  setText("#emerald-value", state.resources.emerald);
  setText("#energy-value", Math.floor(state.resources.energy));
  setText("#energy-capacity", getEnergyCapacity());
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

function renderApiaryFrames() {
  state.apiaryFrames.forEach((frame, index) => {
    const slot = index + 1;
    const select = $(`#apiary-frame-${slot}`);
    const detail = $(`#apiary-frame-${slot}-detail`);
    if (!select) return;
    const slotUnlocked = index < 2 || Boolean(state.lateFacilities.alveary);
    const choices = Object.keys(frameData).filter((id) => state.frameInventory[id] > 0);
    select.innerHTML = `<option value="">${slotUnlocked ? "空框架槽" : "大型蜂房解锁"}</option>${choices.map((id) => `<option value="${id}">${frameData[id].name} · 库存 ${state.frameInventory[id]}</option>`).join("")}${frame ? `<option value="${frame.id}">${frameData[frame.id].name}</option>` : ""}`;
    select.value = frame?.id || "";
    select.disabled = !slotUnlocked || Boolean(frame) || state.apiaryProgress > 0 || state.apiaryReady > 0;
    if (detail) detail.textContent = !slotUnlocked ? "建造大型蜂房后开放" : frame ? `耐久 ${frame.durability}/${frameData[frame.id].durability} · 产速 +${Math.round(frameData[frame.id].bonus * 100)}%` : "从村民商店购买框架后装入";
  });
}

function selectProductionBee(id) {
  if (state.apiaryReady > 0 || state.apiaryProgress > 0) return showToast("当前生产周期结束后才能更换蜂种。");
  if (!knownDiscoveredBees().includes(id)) return showToast("这个蜂种尚未发现。");
  state.activeBee = id;
  const flower = beeProductionData[id]?.flower;
  if (flowerSources[flower] && getFlowerCount(flower) > 0) state.activeFlower = flower;
  addLog(`蜂箱 A-01 更换生产蜂种：${species[id].name}。`, "teal");
  saveState();
  renderAll();
}

function installApiaryFrame(slotIndex, frameId) {
  const index = clamp(Math.floor(Number(slotIndex) || 0), 0, 2);
  if (index === 2 && !state.lateFacilities.alveary) return showToast("第三框架槽需要大型蜂房。");
  if (state.apiaryFrames[index]) return showToast("框架装入后会持续消耗，耐久耗尽前不能替换。");
  if (state.apiaryProgress > 0 || state.apiaryReady > 0) return showToast("生产周期进行中，不能装入框架。");
  if (!frameData[frameId] || state.frameInventory[frameId] <= 0) return showToast("没有可用的该类型框架。");
  state.frameInventory[frameId] -= 1;
  state.apiaryFrames[index] = { id: frameId, durability: frameData[frameId].durability };
  addLog(`蜂箱装入${frameData[frameId].name}，产速 +${Math.round(frameData[frameId].bonus * 100)}%。`, "green");
  renderAll();
}

function renderApiary() {
  const progress = Math.round(state.apiaryProgress);
  renderHabitatControl();
  const apiaryRate = getApiaryEffectiveRate();
  const activeFlower = flowerSources[getActiveFlowerId()];
  const flowerCount = getFlowerCount();
  const activeBeeId = getActiveBeeId();
  const activeBee = species[activeBeeId];
  const production = getActiveBeeProduction();
  const flowerCompatible = getActiveFlowerId() === production.flower;
  const beeSpeed = Math.round(getActiveBeeTrait("speed"));
  const apiaryYield = getApiaryYieldPerCycle();
  const habitatZone = zones[getActiveHabitatId()];
  const habitatSuitability = getHabitatSuitability();
  const apiaryBlocked = state.apiaryReady === 0 && (flowerCount === 0 || !flowerCompatible);
  const productionSelect = $("#apiary-production-select");
  if (productionSelect) {
    productionSelect.innerHTML = knownDiscoveredBees().map((id) => `<option value="${id}">${species[id].name} · ${beeProductionData[id]?.name || "蜂蜜脾"}</option>`).join("");
    productionSelect.value = activeBeeId;
    productionSelect.disabled = state.apiaryReady > 0 || state.apiaryProgress > 0;
  }
  setText("#apiary-product-preview", `${production.name} ×${apiaryYield}${Object.keys(production.specialties).length ? ` · 专属：${Object.entries(production.specialties).map(([id, chance]) => `${resourceNames[id]} ${Math.round(chance * 100)}%`).join("/")}` : ""}`);
  renderApiaryFrames();
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
  setText("#apiary-status-text", state.breeding ? `杂交中 · ${species[state.breeding.result]?.name || "未知后代"} · 剩余 ${state.breeding.remaining}s` : state.apiaryReady > 0 ? `${activeBee.name}产物待收取：${formatResourceBundle(getApiaryReadyBundle())}` : apiaryBlocked ? !flowerCompatible ? `${activeBee.name}需要${flowerSources[production.flower].name}` : `缺少${activeFlower.name} · 请探索补充` : `${activeBee.name}使用${activeFlower.name} · 基因速度 ${beeSpeed} · 预计 ${production.name} ${apiaryYield}`);
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
  setText("#apiary-flower-output", flowerCount > 0 && flowerCompatible ? `${activeFlower.name} ×${flowerCount}` : !flowerCompatible ? `需要${flowerSources[production.flower].name}` : "需要补充");
  const flowerOutput = $("#apiary-flower-output");
  if (flowerOutput) flowerOutput.classList.toggle("positive", flowerCount > 0 && flowerCompatible);
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
  const selected = getSelectedCentrifugeRecipe();
  state.machineRecipe = selected.id;
  const readyBundle = getMachineReadyBundle();
  const ready = hasBundleItems(readyBundle);
  const progress = ready ? 100 : Math.round(state.machineProgress);
  const machineRate = 100 / getMachineDuration();
  const recipeLedger = getCurrentRecipeLedger();
  $("#machine-progress").style.width = `${progress}%`;
  setText("#overview-machine-progress", "");
  $("#overview-machine-progress").style.width = `${progress}%`;
  const recipeSelect = $("#centrifuge-recipe-select");
  if (recipeSelect) {
    recipeSelect.innerHTML = getUnlockedCentrifugeRecipeIds().map((id) => `<option value="${id}">${centrifugeRecipes[id].name}</option>`).join("");
    recipeSelect.value = selected.id;
    recipeSelect.disabled = state.machineActive || ready;
  }
  setText("#machine-input", formatResourceBundle(selected.recipe.input));
  setText("#machine-output", ready ? formatResourceBundle(readyBundle) : formatResourceBundle(selected.recipe.output));
  setText("#machine-input-label", formatResourceBundle(selected.recipe.input));
  setText("#machine-output-label", formatResourceBundle(selected.recipe.output));
  setText("#machine-progress-label", state.machineActive ? `正在执行${selected.recipe.name}` : (ready ? "产物可收取" : "等待输入"));
  setText("#machine-time", state.machineActive ? `${Math.max(1, Math.ceil((100 - state.machineProgress) / machineRate))}s` : "--");
  setText("#processed-output", `H ${state.processedHoney} · W ${state.processedWax}`);
  setText("#recipe-title", recipeLedger.title);
  setText("#recipe-input", recipeLedger.input);
  setText("#recipe-output", recipeLedger.output);
  setText("#recipe-duration", `${recipeLedger.duration.toFixed(1).replace(".0", "")} 秒`);
  setText("#recipe-energy", recipeLedger.energy);
  const machineHasInput = canAfford(selected.recipe.input) && state.resources.energy >= selected.recipe.energy;
  const machineLabel = state.machineActive ? "运行中" : ready ? "可收取" : machineHasInput ? "待命" : "输入不足";
  const machineMode = state.machineActive ? "online" : ready ? "ready" : machineHasInput ? "waiting" : "blocked";
  updateStatusPill("#machine-status", machineLabel, machineMode);
  updateStatusPill("#overview-machine-status", machineLabel, machineMode);
  const machineCard = $("#overview-machine-card");
  if (machineCard) machineCard.setAttribute("aria-label", `打开离心机 C-01 · ${machineLabel}`);
  $("#machine-button").textContent = state.machineActive ? "加工中 · 等待" : ready ? `收取${formatResourceBundle(readyBundle)}  ＋` : machineHasInput ? `启动${selected.recipe.name}  →` : "蜂巢或能源不足";
  $("#machine-button").disabled = state.machineActive || (!machineHasInput && !ready);
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
  const selected = getSelectedSqueezerRecipe();
  state.squeezerRecipe = selected.id;
  const readyBundle = getSqueezerReadyBundle();
  const ready = hasBundleItems(readyBundle);
  const progress = ready ? 100 : Math.round(state.squeezerProgress);
  const squeezerRate = 100 / getSqueezerDuration();
  const active = state.squeezerActive;
  const missing = getMissingResources(selected.recipe.input);
  const lacksEnergy = state.resources.energy < selected.recipe.energy;
  const canStart = missing.length === 0 && !lacksEnergy;
  const recipeSelect = $("#squeezer-recipe-select");
  if (recipeSelect) {
    recipeSelect.innerHTML = getUnlockedSqueezerRecipeIds().map((id) => `<option value="${id}">${squeezerRecipes[id].name}</option>`).join("");
    recipeSelect.value = selected.id;
    recipeSelect.disabled = active || ready;
  }
  setText("#squeezer-input", formatResourceBundle(selected.recipe.input));
  setText("#squeezer-output", ready ? formatResourceBundle(readyBundle) : formatResourceBundle(selected.recipe.output));
  setText("#squeezer-input-label", formatResourceBundle(selected.recipe.input));
  setText("#squeezer-output-label", formatResourceBundle(selected.recipe.output));
  setText("#squeezer-progress-label", active ? `正在处理${selected.recipe.name}` : ready ? "产物可收取" : missing.length ? `缺少${resourceNames[missing[0][0]]}` : lacksEnergy ? "能源不足" : "配方就绪");
  setText("#squeezer-time", active ? `${Math.max(1, Math.ceil((100 - state.squeezerProgress) / squeezerRate))}s` : "--");
  const status = active ? "运行中" : ready ? "可收取" : !canStart ? "输入不足" : "待命";
  const mode = active ? "online" : ready ? "ready" : !canStart ? "blocked" : "waiting";
  updateStatusPill("#squeezer-status", status, mode);
  const progressBar = $("#squeezer-progress");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (button) {
    button.disabled = active || (!canStart && !ready);
    button.textContent = active ? "榨取中 · 等待" : ready ? `收取${formatResourceBundle(readyBundle)}  ＋` : missing.length ? `${resourceNames[missing[0][0]]}不足` : lacksEnergy ? "能源不足" : `启动${selected.recipe.name}  →`;
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
  const selected = getSelectedFermenterRecipe();
  state.fermenterRecipe = selected.id;
  const readyBundle = getFermenterReadyBundle();
  const ready = hasBundleItems(readyBundle);
  const progress = ready ? 100 : Math.round(state.fermenterProgress);
  const fermenterRate = 100 / getFermenterDuration();
  const active = state.fermenterActive;
  const missing = getMissingResources(selected.recipe.input);
  const lacksEnergy = state.resources.energy < selected.recipe.energy;
  const canStart = missing.length === 0 && !lacksEnergy;
  const recipeSelect = $("#fermenter-recipe-select");
  if (recipeSelect) {
    recipeSelect.value = selected.id;
    recipeSelect.disabled = active || ready;
  }
  setText("#fermenter-input", formatResourceBundle(selected.recipe.input));
  setText("#fermenter-output", ready ? formatResourceBundle(readyBundle) : formatResourceBundle(selected.recipe.output));
  setText("#fermenter-input-label", formatResourceBundle(selected.recipe.input));
  setText("#fermenter-output-label", formatResourceBundle(selected.recipe.output));
  setText("#fermenter-progress-label", active ? `正在处理${selected.recipe.name}` : ready ? "产物可收取" : missing.length ? `缺少${resourceNames[missing[0][0]]}` : lacksEnergy ? "能源不足" : "配方就绪");
  setText("#fermenter-time", active ? `${Math.max(1, Math.ceil((100 - state.fermenterProgress) / fermenterRate))}s` : "--");
  updateStatusPill("#fermenter-status", active ? "运行中" : ready ? "可收取" : !canStart ? "输入不足" : "待命", active ? "online" : ready ? "ready" : !canStart ? "blocked" : "waiting");
  const progressBar = $("#fermenter-progress");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (button) {
    button.disabled = active || (!canStart && !ready);
    button.textContent = active ? "发酵中 · 等待" : ready ? `收取${formatResourceBundle(readyBundle)}  ＋` : missing.length ? `${resourceNames[missing[0][0]]}不足` : lacksEnergy ? "能源不足" : `启动${selected.recipe.name}  →`;
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
    setText("#automation-detail", "完成主线委托 09 后解锁，自动收取并串联四台机器。");
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
  if (!list) return;
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
  const activeTreeId = getActiveTreeId();
  const displayTreeId = state.treeReadySpecies && treeSpecies[state.treeReadySpecies] ? state.treeReadySpecies : activeTreeId;
  const displayTree = treeSpecies[displayTreeId] || treeSpecies.oak;
  const productionSelect = $("#tree-production-select");
  if (productionSelect) {
    productionSelect.innerHTML = knownDiscoveredTrees().map((id) => `<option value="${id}">${treeSpecies[id].name} · ${treeSpecies[id].english}</option>`).join("");
    productionSelect.value = activeTreeId;
    productionSelect.disabled = state.treeReady > 0;
  }
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
  setText("#tree-status-text", state.treeBreeding ? `培育中 · ${treeSpecies[state.treeBreeding.result]?.name || "未知树种"} · 剩余 ${state.treeBreeding.remaining}s` : (state.treeReady > 0 ? `${displayTree.name}产物待收取 · ${treeYieldAmount} ${displayTree.name}木材${treeResinAmount > 0 ? `、${treeResinAmount} 树脂` : ""}` : `${displayTree.name}正在生长 · 预估产量 ${Math.round(getTreeYieldMultiplier() * 100)}%`));
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
  renderOrchard();
}

function renderOrchard() {
  const fruitTrees = getFruitTreeIds();
  const select = $("#orchard-tree-select");
  const button = $("#orchard-action");
  const mulchButton = $("#orchard-mulch-button");
  const orchard = state.orchard;
  const ready = orchard.readyFruit > 0 || orchard.readyMulch > 0;
  if (select) {
    select.innerHTML = fruitTrees.length
      ? `<option value="">选择果树</option>${fruitTrees.map((id) => `<option value="${id}">${treeSpecies[id].name} · ${fruitData[treeSpecies[id].fruit].name}</option>`).join("")}`
      : `<option value="">尚未发现果树</option>`;
    select.value = fruitTrees.includes(orchard.treeId) ? orchard.treeId : "";
    select.disabled = ready;
  }
  const tree = treeSpecies[orchard.treeId];
  const fruit = tree?.fruit ? fruitData[tree.fruit] : null;
  const stage = getOrchardStage();
  const rate = getOrchardRate();
  const environment = getActiveEnvironment();
  setText("#orchard-stage", tree ? (ready ? "成熟待收" : `${stage.index}/4 · ${stage.name}`) : "未配置");
  setText("#orchard-status-text", !tree ? "从已发现的果树中选择栽培品种" : ready ? `${fruit.name} ${orchard.readyFruit} 与覆盖物 ${orchard.readyMulch} 已准备收取` : `${tree.name}正在${stage.name} · 环境适配 ${Math.round(getOrchardClimateSuitability() * 100)}%`);
  setText("#orchard-countdown", !tree ? "--" : ready ? "READY" : `${Math.max(1, Math.ceil((100 - orchard.progress) / Math.max(.01, rate)))}s`);
  setText("#orchard-progress-label", `${Math.round(ready ? 100 : orchard.progress)}%`);
  setText("#orchard-ready-fruit", orchard.readyFruit);
  setText("#orchard-ready-mulch", orchard.readyMulch);
  setText("#orchard-soil", `${Math.round(environment.soil)}%`);
  setText("#orchard-pollination", `${Math.round(getOrchardPollinationMultiplier() * 100)}%`);
  const pollenSelect = $("#orchard-pollen-select");
  if (pollenSelect) {
    const pollenIds = Object.keys(state.pollenInventory).filter((id) => treeSpecies[id] && state.pollenInventory[id] > 0);
    pollenSelect.innerHTML = pollenIds.length ? pollenIds.map((id) => `<option value="${id}">${treeSpecies[id].name}花粉 · ${state.pollenInventory[id]}</option>`).join("") : `<option value="">暂无树木花粉</option>`;
    pollenSelect.disabled = !pollenIds.length;
  }
  const pollenCollect = $("#tree-pollen-collect");
  if (pollenCollect) {
    const canCollect = state.tools.graftingKnife > 0 && state.treeAnalyzed.includes(getActiveTreeId());
    pollenCollect.disabled = !canCollect;
    pollenCollect.textContent = state.tools.graftingKnife <= 0 ? "需要嫁接刀" : !state.treeAnalyzed.includes(getActiveTreeId()) ? "先分析生产树种" : `采集${treeSpecies[getActiveTreeId()].name}花粉 · 刀 ${state.tools.graftingKnife}`;
  }
  const pollenApply = $("#orchard-pollen-apply");
  if (pollenApply) {
    pollenApply.disabled = !tree || !pollenSelect?.value;
    pollenApply.textContent = state.orchardPollen.cycles > 0 ? `补授粉剩余 ${state.orchardPollen.cycles} 轮` : "应用花粉 · 授粉与培育 +8%";
  }
  const hostSelect = $("#butterfly-host-select");
  if (hostSelect) {
    const hosts = Object.keys(flowerSources).filter((id) => getFlowerCount(id) > 0 || id === state.butterflyHost);
    hostSelect.innerHTML = hosts.map((id) => `<option value="${id}">${flowerSources[id].name} · ${getFlowerCount(id)}</option>`).join("");
    hostSelect.value = state.butterflyHost;
  }
  const season = getSeasonData();
  setText("#butterfly-season", `${season.name} · ${season.hosts.includes(state.butterflyHost) ? "寄主活跃" : "寄主低活性"} · 蝶群 +${Math.round(getButterflyPollinationBonus() * 100)}%`);
  const progress = $("#orchard-progress");
  if (progress) progress.style.width = `${Math.round(ready ? 100 : orchard.progress)}%`;
  updateStatusPill("#orchard-status", !tree ? "待选树苗" : ready ? "可收取" : stage.name, !tree ? "waiting" : ready ? "ready" : "online");
  if (button) {
    const bundle = tree ? { [tree.fruit]: orchard.readyFruit, mulch: orchard.readyMulch } : {};
    const blocker = ready ? getWarehouseBundleBlocker(bundle) : null;
    button.disabled = !ready || Boolean(blocker);
    button.textContent = !tree ? "先选择果树" : !ready ? `${stage.name}中 · 等待` : blocker ? `${blocker.name}分区不足` : `收取${fruit.name}与覆盖物  ＋`;
    button.style.opacity = button.disabled ? ".55" : "1";
  }
  if (mulchButton) {
    const canRestore = state.resources.mulch >= 4 && environment.soil < 96;
    mulchButton.disabled = !canRestore;
    mulchButton.textContent = environment.soil >= 96 ? "土壤状态良好" : state.resources.mulch < 4 ? "需要覆盖物 4" : "铺设覆盖物 · 土壤 +18";
    mulchButton.style.opacity = canRestore ? "1" : ".55";
  }
}

function renderResearch() {
  const fullFacilities = Object.values(state.upgrades).filter((level) => level >= 3).length + (getEnergyCoreLevel() >= energyCoreLevels.length ? 1 : 0);
  setText("#research-count", `${state.upgradesBought} 次升级 · ${fullFacilities} 项满级`);
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
  const level = getEnergyCoreLevel();
  const current = getEnergyCoreConfig(level);
  const next = energyCoreLevels[level];
  setText("#energy-core-level", `LV.${String(level).padStart(2, "0")}`);
  setText("#energy-core-effect", `容量 ${current.capacity} · 自然恢复 ${current.recovery}/分钟`);
  setText("#energy-core-cost", !next ? "已达到最高等级" : next.unlock && !next.unlock() ? next.unlockText : `下一等级：${formatCost(next.cost)}`);
  const track = $("#energy-core-card .upgrade-track");
  track?.querySelectorAll?.("span")?.forEach((segment, index) => segment.classList.toggle("active", index < level));
  const upgradeButton = $("#energy-core-upgrade");
  if (upgradeButton) {
    const unlocked = Boolean(next && (!next.unlock || next.unlock()));
    const affordable = Boolean(next && canAfford(next.cost));
    upgradeButton.disabled = !next || !unlocked || !affordable;
    upgradeButton.textContent = !next ? "已满级" : !unlocked ? "研究条件未满足" : affordable ? "升级能源核心  →" : "资源不足";
    upgradeButton.style.opacity = upgradeButton.disabled ? ".55" : "1";
  }
  const rechargeButton = $("#energy-recharge-button");
  if (rechargeButton) {
    rechargeButton.disabled = state.distillerCycles < 1 || state.resources.biofuel < 1 || state.resources.energy >= getEnergyCapacity();
    rechargeButton.textContent = state.distillerCycles < 1 ? "首次蒸馏后开放" : state.resources.energy >= getEnergyCapacity() ? "能源已满" : state.resources.biofuel < 1 ? "需要生物燃料 1" : "应急补能 +35";
    rechargeButton.style.opacity = rechargeButton.disabled ? ".55" : "1";
  }
}

function shopTradeButtons(kind, id, max) {
  const disabled = max <= 0 ? "disabled" : "";
  return `<div class="trade-actions"><button data-trade-kind="${kind}" data-trade-id="${id}" data-trade-qty="1" ${disabled}>×1</button><button data-trade-kind="${kind}" data-trade-id="${id}" data-trade-qty="5" ${disabled}>×5</button><button data-trade-kind="${kind}" data-trade-id="${id}" data-trade-qty="max" ${disabled}>MAX ${max}</button></div>`;
}

function renderShop() {
  const grid = $("#shop-trade-grid");
  if (!grid) return;
  const tier = getShopTier();
  const tierInfo = shopTierData[tier - 1];
  setText("#shop-emerald-value", state.resources.emerald);
  setText("#shop-tier-name", tierInfo.name);
  setText("#shop-reputation", `声望 ${state.reputation}`);
  setText("#shop-cycle", `${state.productionCycles % 5} / 5 周期`);
  const nextTier = shopTierData[tier];
  setText("#shop-next-tier", nextTier ? `下一货架：声望 ${nextTier.reputation}` : "已开放全部货架");
  $$('[data-shop-tab]').forEach((button) => button.classList.toggle("active", button.dataset.shopTab === state.shopTab));
  if (state.shopTab === "buy") {
    grid.className = "shop-trade-grid";
    grid.innerHTML = getShopBuyOffers().map((offer) => {
      const unlocked = isShopBuyOfferUnlocked(offer);
      const max = getShopBuyMax(offer);
      const bought = getShopPurchaseCount(offer.id);
      const outputText = offer.output ? formatResourceBundle(offer.output) : offer.energy ? `能源 ${offer.energy}` : offer.sapling ? `${treeSpecies[offer.sapling].name}树苗 ${offer.amount}` : offer.frame ? `${frameData[offer.frame].name} 1` : offer.equipment ? `${offer.name} · 耐久 ${offer.durability}` : `温室密封件 ${offer.seal}`;
      return `<article class="trade-card panel-inset ${unlocked ? "" : "locked"}"><div class="trade-card-head"><span class="trade-icon">${offer.icon}</span><div><small>${unlocked ? `限购 ${bought}/${offer.limit}` : `${shopTierData[offer.tier - 1].name}解锁`}</small><h4>${offer.name}</h4></div></div><div class="villager-trade-line"><span><b>◆ ${offer.price}</b><small>绿宝石</small></span><i>→</i><span><b>${outputText}</b><small>获得物品</small></span></div>${unlocked ? shopTradeButtons("buy", offer.id, max) : `<div class="trade-lock">需要${shopTierData[offer.tier - 1].name}</div>`}</article>`;
    }).join("");
  } else if (state.shopTab === "sell") {
    grid.className = "shop-trade-grid";
    grid.innerHTML = shopSellOffers.map((offer) => {
      const max = getShopSellMax(offer);
      return `<article class="trade-card panel-inset"><div class="trade-card-head"><span class="trade-icon">${offer.icon}</span><div><small>库存可交付 ${max} 组</small><h4>${offer.name}</h4></div></div><div class="villager-trade-line"><span><b>${formatResourceBundle(offer.input)}</b><small>交付物品</small></span><i>→</i><span><b>◆ ${offer.reward}</b><small>绿宝石</small></span></div>${shopTradeButtons("sell", offer.id, max)}</article>`;
    }).join("");
  } else if (state.shopTab === "orders") {
    grid.className = "shop-trade-grid order-grid";
    grid.innerHTML = getShopOrders().map((order, index) => {
      const ready = canAfford(order.input);
      return `<article class="trade-card order-card panel-inset"><div class="trade-card-head"><span class="trade-icon">${String(index + 1).padStart(2, "0")}</span><div><small>轮换高价收购</small><h4>${order.name}</h4></div></div><div class="villager-trade-line"><span><b>${formatResourceBundle(order.input)}</b><small>本轮仅交付一次</small></span><i>→</i><span><b>◆ ${order.reward}</b><small>绿宝石</small></span></div><button class="primary-button full-button" data-shop-order="${index}" ${ready ? "" : "disabled"}>${ready ? "交付订单 →" : "订单物资不足"}</button></article>`;
    }).join("");
  } else {
    grid.className = "shop-storage-grid";
    const categoryCards = Object.entries(warehouseCategoryData).map(([id, category]) => {
      const capacity = id === "equipment" ? getEquipmentCapacity() : category.capacities[getUpgradeLevel("warehouse") - 1];
      let members = id === "equipment"
        ? `已用 ${getEquipmentLoad()} / ${capacity} 槽`
        : Object.entries(warehouseResourceCategories).filter(([, categoryId]) => categoryId === id).map(([resource]) => `${resourceNames[resource]} ${getStoredResourceAmount(resource)}`).filter((text) => !text.endsWith(" 0")).slice(0, 6).join(" · ") || "暂无库存";
      if (id === "regular") {
        const timber = Object.entries(state.woodInventory).filter(([, amount]) => amount > 0).map(([treeId, amount]) => `${treeSpecies[treeId]?.name || "通用"}木 ${amount}`).join(" · ");
        if (timber) members += `<br><small>${timber}</small>`;
      }
      return `<article class="warehouse-category-card panel-inset"><span class="mini-label">${id.toUpperCase()}</span><h4>${category.name}</h4><strong>${id === "equipment" ? capacity : `每类 ${capacity}`}</strong><p>${members}</p></article>`;
    }).join("");
    const facilities = Object.entries(lateFacilityData).map(([id, facility]) => {
      const built = Boolean(state.lateFacilities[id]);
      const ready = !built && canAfford(facility.cost);
      return `<article class="facility-card panel-inset ${built ? "built" : ""}"><span class="mini-label">P1 FACILITY</span><h4>${facility.name}</h4><p>${facility.detail}</p><small>${built ? "已投入运行" : `建造：${formatResourceBundle(facility.cost)}`}</small><button class="secondary-button full-button" data-late-facility="${id}" ${ready ? "" : "disabled"}>${built ? "已建成" : ready ? "建造设施 →" : "材料不足"}</button></article>`;
    }).join("");
    grid.innerHTML = `${categoryCards}<article class="warehouse-upgrade-card panel-inset"><span class="mini-label">WAREHOUSE LV.${getUpgradeLevel("warehouse")}</span><h4>分类仓库扩建</h4><p>调查暂存 ${state.pendingSurvey.length} · 成就暂存 ${state.achievementPending.length} · 交易暂存 ${state.warehouseOverflow.length}/12</p><small>${getUpgradeCost("warehouse") ? `下一等级：${formatResourceBundle(getUpgradeCost("warehouse"))}` : "仓库已满级"}</small><button class="primary-button full-button" data-shop-warehouse-upgrade ${getUpgradeCost("warehouse") && canAfford(getUpgradeCost("warehouse")) ? "" : "disabled"}>${getUpgradeCost("warehouse") ? "扩建仓库 →" : "已满级"}</button></article>${facilities}`;
  }
  const refresh = $("#shop-refresh");
  if (refresh) {
    refresh.disabled = state.resources.emerald < 3 || state.shopManualRefreshes >= 2;
    refresh.textContent = state.shopManualRefreshes >= 2 ? "本轮刷新已用完" : `刷新订单 · ◆3 (${state.shopManualRefreshes}/2)`;
  }
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
  renderAchievements();
}

function formatAchievementReward(achievement, record = null) {
  const rewards = record?.rewardSnapshot || achievement.reward || {};
  const parts = Object.keys(rewards).length ? [formatResourceBundle(rewards)] : [];
  if (record?.fullEnergy || achievement.fullEnergy) parts.push("能源补满");
  const reputation = Number(record?.reputation ?? achievement.reputation) || 0;
  if (reputation) parts.push(`声望 ${reputation}`);
  if (record?.titleReward || achievement.titleReward) parts.push(`称号“${record?.titleReward || achievement.titleReward}”`);
  return parts.join(" · ") || "档案点数";
}

function renderAchievements() {
  const archiveContent = $("#codex-archive-content");
  const achievementContent = $("#codex-achievement-content");
  if (!archiveContent || !achievementContent) return;
  if (!isPageUnlocked("achievements") && activeCodexTab === "achievements") activeCodexTab = "archive";
  archiveContent.hidden = activeCodexTab !== "archive";
  achievementContent.hidden = activeCodexTab !== "achievements";
  $$("[data-codex-tab]").forEach((button) => button.classList.toggle("active", button.dataset.codexTab === activeCodexTab));
  const completed = getCompletedAchievementCount();
  const claimed = Object.values(state.achievements).filter((record) => record?.claimedAt).length;
  const points = getAchievementPoints();
  setText("#achievement-summary", `${completed} / ${achievementData.length} · ${points} POINTS`);
  setText("#achievement-claim-count", `${getUnclaimedAchievementCount()} 项待领取`);
  const claimAll = $("#achievement-claim-all");
  if (claimAll) claimAll.disabled = getUnclaimedAchievementCount() === 0;
  const pendingCount = state.achievementPending.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
  const pendingButton = $("#achievement-pending-button");
  if (pendingButton) {
    pendingButton.hidden = pendingCount === 0;
    pendingButton.textContent = `整理成就暂存 ×${pendingCount}`;
  }
  const grid = $("#achievement-grid");
  const categories = [...new Set(achievementData.map((item) => item.category))];
  grid.innerHTML = categories.map((category, categoryIndex) => {
    const cards = achievementData.filter((item) => item.category === category).map((achievement) => {
      const record = state.achievements[achievement.id];
      const done = Boolean(record?.completedAt);
      const isClaimed = Boolean(record?.claimedAt);
      const tier = achievementTiers[achievement.tier];
      return `<article class="achievement-card panel-inset ${done ? "completed" : "locked"} ${isClaimed ? "claimed" : ""}"><div class="achievement-card-top"><span class="achievement-tier tier-${achievement.tier}">${tier.name}</span><small>${tier.points} PT</small></div><h4>${achievement.title}</h4><p>${achievement.detail}</p><small class="achievement-reward">奖励：${formatAchievementReward(achievement, record)}</small><button class="secondary-button" data-achievement-claim="${achievement.id}" ${done && !isClaimed ? "" : "disabled"}>${isClaimed ? "已领取" : done ? "领取奖励" : "未完成"}</button></article>`;
    }).join("");
    return `<div class="achievement-category"><div class="codex-section-divider"><span>${String(categoryIndex + 1).padStart(2, "0")} / ${category}</span><small>${achievementData.filter((item) => item.category === category && state.achievements[item.id]).length} / ${achievementData.filter((item) => item.category === category).length}</small></div><div class="achievement-category-grid">${cards}</div></div>`;
  }).join("");
  setText("#achievement-claimed", `${claimed} 项奖励已领取`);
}

function switchCodexTab(tab) {
  if (tab === "achievements" && !isPageUnlocked("achievements")) return showToast(getPageUnlockReason("achievements"));
  activeCodexTab = tab === "achievements" ? "achievements" : "archive";
  renderAchievements();
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
  const routeOptions = $("#guide-route-options");
  if (routeOptions) {
    routeOptions.hidden = complete || stepIndex !== 13;
    routeOptions.innerHTML = stepIndex === 13 ? '<button data-guide-route="explore">区域调查</button><button data-guide-route="arbor">树木培育</button><button data-guide-route="machines">生产加工</button>' : "";
  }
}

function getGuideTarget(stepIndex, fallback = "") {
  if (stepIndex === 3) return state.surveyResult ? "#survey-result-content" : "#survey-queue-card";
  if (stepIndex === 5) return state.apiaryReady > 0 ? "#collect-button" : "#apiary-countdown";
  if (stepIndex === 8) return "#machine-button";
  if (stepIndex === 9) return "#energy-core-upgrade";
  if (stepIndex === 10) return ".analyze-button:not(.done)";
  if (stepIndex === 11) return "#breed-button";
  if (stepIndex === 12) return "#contract-button";
  if (stepIndex === 13) return ".horizon-grid";
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
    setText("#contract-detail", "十五份主线委托都已完成，区域轮换委托仍会持续提供资源出口。");
    setText("#contract-reward", "主线认证完成 · 区域合作继续开放");
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
    resin: '<span class="pixel-resource resource-resin" aria-hidden="true"></span>',
    biomass: '<span class="pixel-resource resource-biomass" aria-hidden="true"></span>',
    biofuel: '<span class="pixel-resource resource-biofuel" aria-hidden="true"></span>',
    wildflower: "✿",
    clover: "♣",
    tropical: "❀"
  };
  const toneMap = { rawComb: "amber", honey: "honey", wax: "wax", wood: "wood", oil: "oil", resin: "resin", biomass: "biomass", biofuel: "biofuel", wildflower: "flower-resource", clover: "flower-resource", tropical: "flower-resource" };
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
  const rewardText = contract.rewardText || formatResourceBundle(contract.rewards);
  setText("#contract-reward", `奖励：${rewardText}${rewardText ? " · " : ""}声望 +${contract.reputation}${contract.titleReward ? ` · 称号“${contract.titleReward}”` : ""}`);
  if (button) {
    button.disabled = !ready;
    button.textContent = !unlocked ? "完成前置后解锁" : ready ? "交付委托  →" : missing.length ? "资源未齐" : "物资分区已满";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function getBlockedReadyOutput() {
  const candidates = [
    state.machineOutput > 0 ? { name: "离心机产物", bundle: getMachineReadyBundle() } : null,
    hasBundleItems(getSqueezerReadyBundle()) ? { name: "榨汁机产物", bundle: getSqueezerReadyBundle() } : null,
    hasBundleItems(getFermenterReadyBundle()) ? { name: "发酵机产物", bundle: getFermenterReadyBundle() } : null,
    state.distillerOutput > 0 ? { name: "蒸馏机产物", bundle: { biofuel: state.distillerOutput } } : null,
    state.apiaryReady > 0 ? { name: "蜂箱产物", bundle: getApiaryReadyBundle() } : null,
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
  const centrifuge = getSelectedCentrifugeRecipe().recipe;
  const squeezer = getSelectedSqueezerRecipe().recipe;
  const fermenter = getSelectedFermenterRecipe().recipe;
  const candidates = [
    !state.machineActive && state.machineOutput === 0 && canAfford(centrifuge.input) ? { name: "离心机", cost: centrifuge.energy } : null,
    isSqueezerUnlocked() && !state.squeezerActive && !hasBundleItems(getSqueezerReadyBundle()) && canAfford(squeezer.input) ? { name: "榨汁机", cost: squeezer.energy } : null,
    isFermenterUnlocked() && !state.fermenterActive && !hasBundleItems(getFermenterReadyBundle()) && canAfford(fermenter.input) ? { name: "发酵机", cost: fermenter.energy } : null,
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
    longDetail = `主线委托 ${Math.min(contractData.length, state.contractsCompleted)} / ${contractData.length}，持续把调查与生产成果转化为声望和远征补给。`;
    longStatus = "记录中";
    longAction = "overview";
    longLabel = "查看委托";
  } else if (!longParts[8]) {
    longTitle = "开启机器队列";
    longDetail = !isAutomationUnlocked() ? `主线委托 ${Math.min(9, state.contractsCompleted)} / 9；完成第 09 份后解锁机器队列。` : "机器队列已经开放，按离心机 → 榨汁机 → 发酵机 → 蒸馏机顺序接管生产。";
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
  const points = getAchievementPoints();
  const completionRate = getCompletedAchievementCount() / achievementData.length;
  const tutorialComplete = getGuideStep() >= guideSteps.length;
  const basicGuideComplete = state.contractsCompleted >= 3 && state.treeHarvests >= 1 && getZoneProgress("plains").manualRuns >= 1;
  const productionChain = [state.machineCycles, state.squeezerCycles, state.fermenterCycles, state.distillerCycles].every((value) => value >= 1);
  if (state.contractsCompleted >= 15 && getUnlockedZoneCount() >= 8 && completionRate >= .8) return { rank: "R6", name: "首席林业师" };
  if (productionChain && state.contractsCompleted >= 12 && points >= 400) return { rank: "R5", name: "生态工程师" };
  if (getUnlockedZoneCount() >= 5 && knownDiscoveredBees().length >= 6 && points >= 240) return { rank: "R4", name: "遗传研究员" };
  if (basicGuideComplete && state.reputation >= 6 && points >= 120) return { rank: "R3", name: "调查员" };
  if (tutorialComplete && points >= 40) return { rank: "R2", name: "生态助手" };
  return { rank: "R1", name: "林地学徒" };
}

function getRecommendedAction() {
  const guideStep = getGuideStep();
  if (guideStep < guideSteps.length) {
    const guide = getMissionPanelData();
    const loopStep = [1, 1, 1, 1, 2, 2, 5, 4, 5, 6, 2, 3, 6, 1][guideStep] || 1;
    return { step: loopStep, view: guide.action, target: guide.target, title: guide.title, detail: guide.detail, label: guide.actionLabel };
  }
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
  setText("#npc-contact-status", action.title);
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

function getNpcConversation(topic = "greeting") {
  const next = getRecommendedAction();
  const ecology = getEcologyBreakdown();
  const bee = species[getActiveBeeId()];
  const flower = flowerSources[getActiveFlowerId()];
  const habitat = zones[getActiveHabitatId()];
  const flowerCount = getFlowerCount();
  const habitatFit = Math.round(getHabitatSuitability() * 100);
  if (topic === "apiary") {
    if (state.apiaryReady > 0) return { text: `蜂箱里有 ${state.apiaryReady} 份产物可以收取。先腾出仓库空间，再让蜂群开始下一轮。`, detail: `当前蜂种：${bee.name} · 花源：${flower.name} ×${flowerCount} · 环境适配：${habitatFit}%`, action: { label: "前往收取", view: "apiary", target: "#collect-button" } };
    if (flowerCount <= 0) return { text: `${bee.name}已经找不到${flower.name}了，蜂箱会暂停。去对应区域补充花源吧。`, detail: `当前环境：${habitat.name} · 环境适配：${habitatFit}% · 花源库存：0`, action: { label: "调查花源", view: "explore", target: `.explore-button[data-zone="${flower.zone}"]` } };
    return { text: `${bee.name}正在稳定工作。环境越匹配、花源越充足，生产与授粉就越可靠。`, detail: `花源：${flower.name} ×${flowerCount} · 环境适配：${habitatFit}% · 生态评分：${ecology.score}`, action: { label: "查看蜂箱", view: "apiary", target: "#apiary-countdown" } };
  }
  if (topic === "lore") {
    const weak = ecology.weak[0];
    const tips = [
      `每种蜂有自己的适生区域。蜂种、环境和花源同时匹配，才是稳定生产的基础。`,
      `树场不只提供木材。健康树冠会改善花源与授粉网络，也会影响蝴蝶活动。`,
      `杂交前先分析亲本。已知基因越完整，你越容易判断下一代的速度、寿命和产量。`,
      `当前生态最弱的一环是“${weak?.name || "环境适配"}”。先补这一项，通常比只升级机器更有效。`
    ];
    const tip = tips[(state.productionCycles + state.explorations + state.breedings) % tips.length];
    return { text: tip, detail: `林地记录：蜂种 ${knownDiscoveredBees().length} · 树种 ${knownDiscoveredTrees().length} · 蝶种 ${knownDiscoveredButterflies().length}` };
  }
  if (topic === "next") return { text: next.detail, detail: `建议目标：${next.title} · 当前生态评分：${ecology.score}`, action: { label: next.label, view: next.view, target: next.target } };
  if (getGuideStep() < guideSteps.length) return { text: `先跟着工作站教程走，我会保证关键培育步骤能够一次完成。现在最重要的是：${next.title}。`, detail: next.detail, action: { label: next.label, view: next.view, target: next.target } };
  if (state.apiaryReady > 0) return { text: `嗡——蜂箱已经有产物了。现在收取，能让生产循环继续运转。`, detail: `可收取产物：${state.apiaryReady} · 生态评分：${ecology.score}`, action: { label: "前往收取", view: "apiary", target: "#collect-button" } };
  return { text: `欢迎回来，林业师。工作站生态评分是 ${ecology.score}，我建议先处理“${next.title}”。`, detail: next.detail, action: { label: next.label, view: next.view, target: next.target } };
}
function renderNpcDialogue(topic = activeNpcTopic) {
  activeNpcTopic = topic;
  const conversation = getNpcConversation(topic);
  setText("#npc-dialog-text", conversation.text);
  setText("#npc-dialog-detail", conversation.detail || "");
  const actionButton = $("#npc-dialog-action");
  if (actionButton) {
    actionButton.hidden = !conversation.action;
    actionButton.dataset.view = conversation.action?.view || "";
    actionButton.dataset.target = conversation.action?.target || "";
    actionButton.textContent = conversation.action ? `${conversation.action.label} →` : "";
  }
  $$("#npc-dialog-choices [data-npc-topic]").forEach((button) => {
    const active = button.dataset.npcTopic === topic;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function openNpcDialog(topic = "greeting") {
  const modal = $("#npc-dialog-modal");
  if (!modal) return;
  closeMobileMore();
  renderNpcDialogue(topic);
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => $("#npc-dialog-close")?.focus(), 80);
}

function closeNpcDialog(restoreFocus = true) {
  const modal = $("#npc-dialog-modal");
  if (!modal) return;
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
  if (restoreFocus) window.setTimeout(() => $("#npc-contact-button")?.focus(), 40);
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

function chooseGuideRoute(route) {
  if (!["explore", "arbor", "machines"].includes(route)) return;
  state.guideRouteChosen = route;
  addLog(`新手教程完成，下一条发展路线：${route === "explore" ? "区域调查" : route === "arbor" ? "树木培育" : "生产加工"}。`, "green");
  showToast("新手教程完成 · 长期进程已开放");
  renderAll();
  switchView(route);
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
  if (!switchView(view || "overview")) return;
  if (target === "#survey-result-content" && state.surveyResult) showSurveyResult();
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
  initializeProgressionState(state);
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
  initializeProgressionState(state);
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
  syncPageUnlocks(true);
  checkAchievements();
  renderPageUnlocks();
  renderResources();
  renderShop();
  renderApiary();
  renderMachine();
  renderAutomation();
  renderLogs();
  renderSpecies();
  renderTree();
  renderResearch();
  renderShop();
  renderCodex();
  renderZones();
  renderGuide();
  renderMilestones();
  renderContracts();
  renderRegionalContracts();
  renderHorizons();
  renderChapterDeck();
  renderCommandCenter();
  renderEcologyNetwork();
}

function switchView(view) {
  const labels = { overview: ["ECOLOGY COMMAND · FOREST EDGE", "生态总览"], explore: ["FIELD SURVEY · REGIONS", "野外调查"], apiary: ["APICULTURE STATION · A-01", "蜜蜂育种"], arbor: ["ARBORETUM STATION · T-01", "树木育种"], machines: ["PROCESSING FLOOR · C-01", "生产加工"], research: ["WORKSHOP RESEARCH · R-01", "研究升级"], shop: ["VILLAGER FORESTER · MARKET", "村民商店"], codex: ["", "生态档案"] };
  if (!labels[view]) return switchView("overview");
  if (!isPageUnlocked(view)) {
    showToast(getPageUnlockReason(view));
    return false;
  }
  if (view === "shop" && !state.shopOpenedBonus) {
    state.shopOpenedBonus = true;
    state.resources.emerald += 4;
    addLog("首次拜访林业村民，获得交易教学资金：绿宝石 4。", "green");
    showToast("首次商店补助：绿宝石 +4");
    renderResources();
    renderShop();
    saveState(true);
  }
  state.visitedViews[view] = true;
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  const codexFound = knownDiscoveredBees().length + knownDiscoveredButterflies().length + knownDiscoveredTrees().length;
  const codexTotal = Object.keys(species).length + Object.keys(butterflySpecies).length + Object.keys(treeSpecies).length;
  labels.codex[0] = `FIELD ARCHIVE · ${String(codexFound).padStart(2, "0")} / ${String(codexTotal).padStart(2, "0")}`;
  setText("#view-eyebrow", labels[view][0]);
  setText("#view-title", labels[view][1]);
  document.body.dataset.view = view;
  const moreButton = $("#mobile-more-button");
  if (moreButton) moreButton.classList.toggle("active", view === "research" || view === "shop" || view === "codex");
  closeMobileMore();
  renderGuide();
  renderPageUnlocks();
  saveState();
  if (window.matchMedia?.("(max-width: 899px)").matches) window.scrollTo({ top: 0, behavior: "smooth" });
  return true;
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
  if (getGuideStep() === 3 && state.surveyResult) showSurveyResult();
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
  if (guaranteed && discoveries.length) state.rarePityTriggers += 1;
  if (guaranteed) progress.rareProgress = discoveries.length ? 0 : 100;
  const environment = state.zoneEnvironments[zone] || (state.zoneEnvironments[zone] = { ...defaultState.zoneEnvironments[zone] });
  environment.flowerDensity = clamp(environment.flowerDensity + 5, 0, 100);
  environment.soil = clamp(environment.soil + 1, 0, 100);
  return { rareDelta, discoveries, previousRare: oldRare };
}

function openSurveyConfirm(zone) {
  if (!isZoneUnlocked(zone)) return showToast(`尚未开放：${zones[zone]?.unlockText || "继续推进工坊"}`);
  if (zone === "forest" && !state.tutorialSurveyCompleted) state.tutorialSurveyOpened = true;
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

function renderRegionalContracts() {
  const section = $("#regional-contracts-section");
  if (!section) return;
  syncRegionalContracts();
  const slots = getRegionalSlotCount();
  section.hidden = slots === 0;
  if (!slots) return;
  setText("#regional-contract-count", `${state.regionalContractsCompleted} 已完成 · ${slots} 个槽位`);
  setText("#regional-contract-refresh", state.regionalActionCounter > 0 ? `再完成 ${Math.max(0, 5 - state.regionalActionCounter)} 次有效行动后轮换` : "新一轮区域需求" );
  const grid = $("#regional-contract-grid");
  grid.innerHTML = state.regionalContractOffers.map((offer, slot) => {
    const contract = regionalContractTemplates.find((item) => item.id === offer.templateId);
    if (!contract) return "";
    const missing = getMissingResources(contract.requires);
    const blocker = getWarehouseBundleBlocker(contract.rewards, contract.requires);
    const ready = missing.length === 0 && !blocker;
    return `<article class="regional-contract-card panel-inset"><span class="mini-label">REGIONAL SLOT ${String(slot + 1).padStart(2, "0")}</span><h4>${contract.title}</h4><p>交付：${formatResourceBundle(contract.requires)}</p><small>奖励：${formatResourceBundle(contract.rewards)} · 声望 +${contract.reputation}</small><button class="secondary-button" data-regional-contract="${slot}" ${ready ? "" : "disabled"}>${ready ? "交付区域委托 →" : missing.length ? "资源未齐" : "仓库空间不足"}</button></article>`;
  }).join("");
}

function applySurveyItem(item) {
  if (item.kind === "flower") {
    return addToWarehouse(item.id, item.amount);
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
  if (result.zone === "forest" && result.mode === "manual") state.tutorialSurveyClaimed = true;
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
  const bundle = getApiaryReadyBundle();
  const blocker = getWarehouseBundleBlocker(bundle);
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  grantResourceBundle(bundle);
  state.totalCombCollected += amount;
  state.apiaryCombCollected += amount;
  state.apiaryReady = 0;
  state.apiaryReadyBundle = {};
  consumeStrategyAction();
  addLog(`蜂箱 A-01 收取${formatResourceBundle(bundle)}，已送入仓库。`, "amber");
  showToast(`收取成功：${formatResourceBundle(bundle)}`);
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
  if (id !== "azure" && state.tools.butterflyNet <= 0) return showToast("记录进阶蝶种需要从村民商店购买捕虫网。");
  if (id !== "azure") state.tools.butterflyNet -= 1;
  state.butterflyAnalyzed.push(id);
  consumeStrategyAction();
  addLog(`观察完成：${butterflySpecies[id].name} 的稀有度和授粉属性已记录${id !== "azure" ? `，捕虫网耐久 ${state.tools.butterflyNet}` : ""}。`, "teal");
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

function selectProductionTree(id) {
  if (state.treeReady > 0) return showToast("先收取当前树场产物，再更换生产树种。");
  if (!knownDiscoveredTrees().includes(id)) return showToast("这棵树还没有进入图鉴。");
  state.activeTree = id;
  state.treeProgress = 0;
  addLog(`树场 T-01 更换生产树种：${treeSpecies[id].name}。`, "teal");
  saveState();
  renderAll();
}

function selectOrchardTree(id) {
  if (state.orchard.readyFruit > 0 || state.orchard.readyMulch > 0) return showToast("先收取当前果园产物，再更换果树。");
  if (!id) {
    state.orchard.treeId = "";
    state.orchard.progress = 0;
    saveState();
    return renderAll();
  }
  if (!getFruitTreeIds().includes(id)) return showToast("需要先发现这棵果树。");
  state.orchard.treeId = id;
  state.orchard.progress = 0;
  addLog(`果园开始栽培${treeSpecies[id].name}。`, "green");
  saveState();
  renderAll();
}

function collectOrchard() {
  const tree = treeSpecies[state.orchard.treeId];
  if (!tree?.fruit || (state.orchard.readyFruit <= 0 && state.orchard.readyMulch <= 0)) return showToast("果园还没有成熟产物。");
  const bundle = { [tree.fruit]: state.orchard.readyFruit, mulch: state.orchard.readyMulch };
  const blocker = getWarehouseBundleBlocker(bundle);
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  grantResourceBundle(bundle);
  state.orchard.readyFruit = 0;
  state.orchard.readyMulch = 0;
  consumeStrategyAction();
  addLog(`果园收取：${formatResourceBundle(bundle)}。`, "green");
  showToast(`果园收取成功：${formatResourceBundle(bundle)}`);
  renderAll();
}

function applyMulchToOrchard() {
  const environment = getActiveEnvironment();
  if (environment.soil >= 96) return showToast("当前土壤状态良好，无需铺设覆盖物。");
  if (state.resources.mulch < 4) return showToast("覆盖物不足，需要 4 份。");
  state.resources.mulch -= 4;
  environment.soil = clamp(environment.soil + 18, 0, 100);
  consumeStrategyAction();
  addLog(`果园铺设覆盖物 4，土壤恢复至 ${Math.round(environment.soil)}。`, "green");
  showToast("覆盖物已铺设 · 土壤 +18");
  renderAll();
}

function collectTreePollen() {
  const treeId = getActiveTreeId();
  if (state.tools.graftingKnife <= 0) return showToast("需要从村民商店购买嫁接刀。");
  if (!state.treeAnalyzed.includes(treeId)) return showToast("先分析当前生产树种，才能识别花粉。");
  state.tools.graftingKnife -= 1;
  state.pollenInventory[treeId] = (state.pollenInventory[treeId] || 0) + 1;
  consumeStrategyAction();
  addLog(`使用嫁接刀采集${treeSpecies[treeId].name}花粉 1，剩余耐久 ${state.tools.graftingKnife}。`, "green");
  showToast(`获得${treeSpecies[treeId].name}花粉 1`);
  renderAll();
}

function applyTreePollen() {
  const treeId = $("#orchard-pollen-select")?.value;
  if (!state.orchard.treeId) return showToast("先在果园选择果树。");
  if (!treeId || (state.pollenInventory[treeId] || 0) <= 0) return showToast("没有可用的树木花粉。");
  state.pollenInventory[treeId] -= 1;
  state.orchardPollen = { treeId, cycles: 2 };
  consumeStrategyAction();
  addLog(`果园应用${treeSpecies[treeId].name}花粉：未来 2 轮授粉增强，树木培育概率 +8%。`, "green");
  showToast("补授粉窗口已开启：2 轮");
  renderAll();
}

function selectButterflyHost(id) {
  if (!flowerSources[id] || getFlowerCount(id) <= 0) return showToast("该寄主植物库存不足。");
  state.butterflyHost = id;
  addLog(`蝴蝶寄主切换为${flowerSources[id].name}，当前季节为${getSeasonData().name}。`, "teal");
  saveState();
  renderAll();
}

function collectTree() {
  if (state.treeReady === 0) return showToast("树场还没有准备好木材。");
  const amount = getTreeYieldAmount();
  const resinAmount = Math.max(0, Number(state.treeReadyResin) || 0);
  const blocker = getWarehouseBundleBlocker({ wood: amount, resin: resinAmount });
  if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
  const woodSpecies = state.treeReadySpecies || getActiveTreeId();
  addToWarehouse("wood", amount);
  registerSpeciesWood(woodSpecies, amount);
  if (resinAmount > 0) addToWarehouse("resin", resinAmount);
  state.treeReady = 0;
  state.treeReadyYield = 0;
  state.treeReadyResin = 0;
  state.treeReadySpecies = "";
  state.treeHarvests += 1;
  consumeStrategyAction();
  addLog(`树场 T-01 收取${treeSpecies[woodSpecies]?.name || "通用"}木材 ${amount}${resinAmount > 0 ? `、树脂 ${resinAmount}` : ""}，产物已入库。`, "green");
  showToast(`收取成功：${amount} ${treeSpecies[woodSpecies]?.name || "通用"}木材${resinAmount > 0 ? `、${resinAmount} 树脂` : ""}`);
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
  consumeResourceBundle({ wood: 4 });
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
  const chance = getResolvedMutationChance(storedChance, getMutationChance(recipe, "tree", parentA, parentB) || (resultId === "teak" ? 16 : 28));
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
  const chance = getResolvedMutationChance(storedChance, getMutationChance(recipe, "bee", princess, drone) || (resultId === "noble" ? 18 : 32));
  const previousFailures = getBreedingFailureCount("bee", princess, drone);
  state.breeding = null;
  if (Math.random() < chance / 100) {
    state.breedings += 1;
    if (previousFailures >= 3) state.beePityTriggers += 1;
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
  const chance = getResolvedMutationChance(storedChance, getMutationChance(recipe, "butterfly", parentA, parentB) || 18);
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
  const readyBundle = getMachineReadyBundle();
  if (hasBundleItems(readyBundle)) {
    const blocker = getWarehouseBundleBlocker(readyBundle);
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    grantResourceBundle(readyBundle);
    state.machineOutput = 0;
    state.machineOutputBundle = {};
    state.machineCollectedCycles += 1;
    consumeStrategyAction();
    addLog(`离心机 C-01 收取产物：${formatResourceBundle(readyBundle)}。`, "amber");
    showToast(`获得 ${formatResourceBundle(readyBundle)}`);
  } else if (!state.machineActive) {
    const selected = getSelectedCentrifugeRecipe();
    const missing = getMissingResources(selected.recipe.input);
    if (missing.length) return showToast(`蜂巢不足：需要${formatResourceBundle(selected.recipe.input)}。`);
    if (state.resources.energy < selected.recipe.energy) return showToast(`能源不足，至少需要 ${selected.recipe.energy} 点能源。`);
    consumeResourceBundle(selected.recipe.input);
    state.machineActive = true;
    state.machineProgress = 0;
    state.machineJob = { recipeId: selected.id, output: { ...selected.recipe.output }, name: selected.recipe.name };
    state.machineStarts += 1;
    state.resources.energy = clamp(state.resources.energy - selected.recipe.energy, 0, getEnergyCapacity());
    consumeStrategyAction();
    addLog(`离心机 C-01 开始${selected.recipe.name}。`, "teal");
    showToast(`加工开始：${getMachineDuration().toFixed(1).replace(".0", "")} 秒后完成`);
  }
  renderAll();
}

function squeezerAction() {
  if (!isSqueezerUnlocked()) return showToast("完成 1 次离心加工后解锁榨汁机 S-01。");
  const readyBundle = getSqueezerReadyBundle();
  if (hasBundleItems(readyBundle)) {
    const blocker = getWarehouseBundleBlocker(readyBundle);
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    grantResourceBundle(readyBundle);
    state.squeezerOutput = 0;
    state.squeezerOutputBundle = {};
    consumeStrategyAction();
    addLog(`榨汁机 S-01 收取产物：${formatResourceBundle(readyBundle)}。`, "green");
    showToast(`获得 ${formatResourceBundle(readyBundle)}`);
  } else if (state.squeezerActive) {
    showToast("榨汁机正在运行中，请等待本批完成。");
  } else {
    const selected = getSelectedSqueezerRecipe();
    const missing = getMissingResources(selected.recipe.input);
    if (missing.length) return showToast(`原料不足：${formatResourceBundle(Object.fromEntries(missing))}。`);
    if (state.resources.energy < selected.recipe.energy) return showToast(`能源不足，至少需要 ${selected.recipe.energy} 点能源。`);
    consumeResourceBundle(selected.recipe.input);
    state.resources.energy = clamp(state.resources.energy - selected.recipe.energy, 0, getEnergyCapacity());
    state.squeezerActive = true;
    state.squeezerProgress = 0;
    state.squeezerJob = { recipeId: selected.id, name: selected.recipe.name, output: { ...selected.recipe.output } };
    consumeStrategyAction();
    addLog(`榨汁机 S-01 启动${selected.recipe.name}：${formatResourceBundle(selected.recipe.input)} → ${formatResourceBundle(selected.recipe.output)}。`, "teal");
    showToast(`榨取开始：${getSqueezerDuration()} 秒后完成`);
  }
  renderAll();
}

function fermenterAction() {
  if (!isFermenterUnlocked()) return showToast(`发酵机需要 3 个蜂种和 1 份已完成的生态委托。`);
  const readyBundle = getFermenterReadyBundle();
  if (hasBundleItems(readyBundle)) {
    const blocker = getWarehouseBundleBlocker(readyBundle);
    if (blocker) return showToast(`仓库分区不足：${formatWarehouseBlocker(blocker)}。`);
    grantResourceBundle(readyBundle);
    state.fermenterOutput = 0;
    state.fermenterOutputBundle = {};
    consumeStrategyAction();
    addLog(`发酵机 F-01 收取产物：${formatResourceBundle(readyBundle)}。`, "green");
    showToast(`获得 ${formatResourceBundle(readyBundle)}`);
  } else if (state.fermenterActive) {
    showToast("发酵机正在运行中，请等待本批完成。");
  } else {
    const selected = getSelectedFermenterRecipe();
    const missing = getMissingResources(selected.recipe.input);
    if (missing.length) return showToast(`原料不足：${formatResourceBundle(Object.fromEntries(missing))}。`);
    if (state.resources.energy < selected.recipe.energy) return showToast(`能源不足，至少需要 ${selected.recipe.energy} 点能源。`);
    consumeResourceBundle(selected.recipe.input);
    state.resources.energy = clamp(state.resources.energy - selected.recipe.energy, 0, getEnergyCapacity());
    state.fermenterActive = true;
    state.fermenterProgress = 0;
    state.fermenterJob = { recipeId: selected.id, name: selected.recipe.name, output: { ...selected.recipe.output } };
    consumeStrategyAction();
    addLog(`发酵机 F-01 启动${selected.recipe.name}：${formatResourceBundle(selected.recipe.input)} → ${formatResourceBundle(selected.recipe.output)}。`, "teal");
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
    state.distillerCollected += amount;
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
    state.resources.energy = clamp(state.resources.energy - 4, 0, getEnergyCapacity());
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
  initializeProgressionState(state);
  saveState();
  addLog("原型数据已重置，新的林地调查开始。", "teal");
  switchView("overview");
  renderAll();
  showToast("已重置原型进度");
}

function handleHorizonAction(action, target = "") {
  if (getGuideStep() === 13 && ["explore", "arbor", "machines"].includes(action)) {
    state.guideRouteChosen = action;
    addLog(`新手教程完成，下一条发展路线：${action === "explore" ? "区域调查" : action === "arbor" ? "树木培育" : "生产加工"}。`, "green");
    showToast("新手教程完成 · 长期进程已开放");
  }
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
    const bundle = getMachineReadyBundle();
    if (!getWarehouseBundleBlocker(bundle)) {
      grantResourceBundle(bundle);
      state.machineOutput = 0;
      state.machineOutputBundle = {};
      state.machineCollectedCycles += 1;
      state.automationCompletedBatches += 1;
      record(`离心机收取${formatResourceBundle(bundle)}`);
    }
  }
  const squeezerReady = getSqueezerReadyBundle();
  if (hasBundleItems(squeezerReady)) {
    if (!getWarehouseBundleBlocker(squeezerReady)) {
      grantResourceBundle(squeezerReady);
      state.squeezerOutput = 0;
      state.squeezerOutputBundle = {};
      state.automationCompletedBatches += 1;
      record(`榨汁机收取${formatResourceBundle(squeezerReady)}`);
    }
  }
  const fermenterReady = getFermenterReadyBundle();
  if (hasBundleItems(fermenterReady)) {
    if (!getWarehouseBundleBlocker(fermenterReady)) {
      grantResourceBundle(fermenterReady);
      state.fermenterOutput = 0;
      state.fermenterOutputBundle = {};
      state.automationCompletedBatches += 1;
      record(`发酵机收取${formatResourceBundle(fermenterReady)}`);
    }
  }
  if (state.distillerOutput > 0) {
    const amount = state.distillerOutput;
    if (!getWarehouseBundleBlocker({ biofuel: amount })) {
      addToWarehouse("biofuel", amount);
      state.distillerOutput = 0;
      state.distillerCollected += amount;
      state.automationCompletedBatches += amount;
      record(`蒸馏机收取生物燃料 ${amount}`);
    }
  }
  if (state.apiaryReady > 0) {
    const amount = state.apiaryReady;
    const bundle = getApiaryReadyBundle();
    if (!getWarehouseBundleBlocker(bundle)) {
      grantResourceBundle(bundle);
      state.totalCombCollected += amount;
      state.apiaryCombCollected += amount;
      state.apiaryReady = 0;
      state.apiaryReadyBundle = {};
      record(`蜂箱收取${formatResourceBundle(bundle)}`);
    }
  }
  if (state.treeReady > 0) {
    const amount = getTreeYieldAmount();
    const resinAmount = Math.max(0, Number(state.treeReadyResin) || 0);
    if (!getWarehouseBundleBlocker({ wood: amount, resin: resinAmount })) {
      const woodSpecies = state.treeReadySpecies || getActiveTreeId();
      addToWarehouse("wood", amount);
      registerSpeciesWood(woodSpecies, amount);
      if (resinAmount > 0) addToWarehouse("resin", resinAmount);
      state.treeReady = 0;
      state.treeReadyYield = 0;
      state.treeReadyResin = 0;
      state.treeReadySpecies = "";
      record(`树场收取木材 ${amount}${resinAmount > 0 ? `、树脂 ${resinAmount}` : ""}`);
    }
  }
  const selectedCentrifuge = getSelectedCentrifugeRecipe();
  if (!state.machineActive && state.machineOutput === 0 && canAfford(selectedCentrifuge.recipe.input) && canSpendEnergy(selectedCentrifuge.recipe.energy)) {
    consumeResourceBundle(selectedCentrifuge.recipe.input);
    state.machineActive = true;
    state.machineProgress = 0;
    state.machineJob = { recipeId: selectedCentrifuge.id, output: { ...selectedCentrifuge.recipe.output }, name: selectedCentrifuge.recipe.name };
    state.machineStarts += 1;
    state.resources.energy = clamp(state.resources.energy - selectedCentrifuge.recipe.energy, 0, getEnergyCapacity());
    record(`离心机启动${selectedCentrifuge.recipe.name}`);
  }
  const selectedSqueezer = getSelectedSqueezerRecipe();
  if (isSqueezerUnlocked() && !state.squeezerActive && !hasBundleItems(getSqueezerReadyBundle()) && canAfford(selectedSqueezer.recipe.input) && canSpendEnergy(selectedSqueezer.recipe.energy)) {
    consumeResourceBundle(selectedSqueezer.recipe.input);
    state.resources.energy = clamp(state.resources.energy - selectedSqueezer.recipe.energy, 0, getEnergyCapacity());
    state.squeezerActive = true;
    state.squeezerProgress = 0;
    state.squeezerJob = { recipeId: selectedSqueezer.id, name: selectedSqueezer.recipe.name, output: { ...selectedSqueezer.recipe.output } };
    record(`榨汁机启动${selectedSqueezer.recipe.name}`);
  }
  const selectedFermenter = getSelectedFermenterRecipe();
  if (isFermenterUnlocked() && !state.fermenterActive && !hasBundleItems(getFermenterReadyBundle()) && canAfford(selectedFermenter.recipe.input) && canSpendEnergy(selectedFermenter.recipe.energy)) {
    consumeResourceBundle(selectedFermenter.recipe.input);
    state.resources.energy = clamp(state.resources.energy - selectedFermenter.recipe.energy, 0, getEnergyCapacity());
    state.fermenterActive = true;
    state.fermenterProgress = 0;
    state.fermenterJob = { recipeId: selectedFermenter.id, name: selectedFermenter.recipe.name, output: { ...selectedFermenter.recipe.output } };
    record(`发酵机启动${selectedFermenter.recipe.name}`);
  }
  if (isDistillerUnlocked() && !state.distillerActive && state.distillerOutput === 0 && state.resources.biomass >= 1 && canSpendEnergy(4)) {
    state.resources.biomass -= 1;
    state.resources.energy = clamp(state.resources.energy - 4, 0, getEnergyCapacity());
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
  const energyRate = (getEnergyRecoveryPerMinute() / 60) * (state.strategyFocus === "industry" ? 1.1 : 1);
  if (state.resources.energy < getEnergyCapacity()) state.resources.energy = clamp(state.resources.energy + energyRate * safeSeconds, 0, getEnergyCapacity());
  advanceAutoSurvey(safeSeconds, safeSeconds > 2);
  const flowerId = getActiveFlowerId();
  const beeProduction = getActiveBeeProduction();
  if (state.apiaryReady === 0 && flowerId === beeProduction.flower && getFlowerCount(flowerId) > 0) {
    state.apiaryProgress += getApiaryEffectiveRate() * safeSeconds;
    if (state.apiaryProgress >= 100) {
      state.apiaryProgress = 0;
      state.apiaryReady = getApiaryYieldPerCycle();
      state.apiaryReadyBundle = { [beeProduction.comb]: state.apiaryReady };
      Object.entries(beeProduction.specialties).forEach(([resource, chance]) => {
        if (Math.random() < chance) state.apiaryReadyBundle[resource] = (state.apiaryReadyBundle[resource] || 0) + 1;
      });
      state.flowerInventory[flowerId] = getFlowerCount(flowerId) - 1;
      state.apiaryCycles += 1;
      consumeApiaryFrameDurability();
      recordProductionCycle();
      applyEnvironmentCycle("apiary");
      addLog(`蜂箱 A-01 消耗 1 份${flowerSources[flowerId].name}，${species[getActiveBeeId()].name}产出${formatResourceBundle(state.apiaryReadyBundle)}。`, "green");
      showToast(`蜂箱产出完成：${formatResourceBundle(state.apiaryReadyBundle)}`);
    }
  }
  if (state.machineActive) {
    state.machineProgress += (100 / getMachineDuration()) * safeSeconds;
    if (state.machineProgress >= 100) {
      state.machineProgress = 0;
      state.machineActive = false;
      const output = state.machineJob?.output || centrifugeRecipes.rawComb.output;
      state.machineOutputBundle = { ...output };
      state.machineOutput = 1;
      state.processedHoney += output.honey || 0;
      state.processedWax += output.wax || 0;
      state.machineJob = null;
      state.machineCycles += 1;
      recordProductionCycle();
      addLog(`离心机分离完成，${formatResourceBundle(output)}已准备收取。`, "green");
      showToast(`离心机完成：${formatResourceBundle(output)}`);
    }
  }
  if (state.squeezerActive) {
    state.squeezerProgress += (100 / getSqueezerDuration()) * safeSeconds;
    if (state.squeezerProgress >= 100) {
      state.squeezerProgress = 0;
      state.squeezerActive = false;
      const output = state.squeezerJob?.output || squeezerRecipes.wood.output;
      state.squeezerOutputBundle = { ...output };
      state.squeezerOutput = 1;
      const outputText = formatResourceBundle(output);
      state.squeezerJob = null;
      state.squeezerCycles += 1;
      recordProductionCycle();
      addLog(`榨汁机完成加工，${outputText}已准备收取。`, "green");
      showToast(`榨汁机完成：${outputText}`);
    }
  }
  if (state.fermenterActive) {
    state.fermenterProgress += (100 / getFermenterDuration()) * safeSeconds;
    if (state.fermenterProgress >= 100) {
      state.fermenterProgress = 0;
      state.fermenterActive = false;
      const output = state.fermenterJob?.output || fermenterRecipes.wood.output;
      state.fermenterOutputBundle = { ...output };
      state.fermenterOutput = 1;
      const outputText = formatResourceBundle(output);
      state.fermenterJob = null;
      state.fermenterCycles += 1;
      recordProductionCycle();
      applyEnvironmentCycle("fermenter");
      addLog(`发酵机处理完成，${outputText}已准备收取。`, "green");
      showToast(`发酵机完成：${outputText}`);
    }
  }
  if (state.distillerActive) {
    state.distillerProgress += (100 / getDistillerDuration()) * safeSeconds;
    if (state.distillerProgress >= 100) {
      state.distillerProgress = 0;
      state.distillerActive = false;
      state.distillerOutput += 1;
      state.distillerCycles += 1;
      recordProductionCycle();
      addLog("蒸馏机处理完成，生物燃料已准备收取。", "green");
      showToast("蒸馏机加工完成");
    }
  }
  if (state.treeReady === 0) {
    state.treeProgress += getTreeRate() * safeSeconds;
    if (state.treeProgress >= 100) {
      state.treeProgress = 0;
      state.treeReady = 1;
      state.treeReadySpecies = getActiveTreeId();
      state.treeReadyYield = getTreeYieldPerCycle();
      state.treeReadyResin = getTreeResinPerCycle();
      recordProductionCycle();
      applyEnvironmentCycle("tree");
      addLog(`树场 T-01 的${treeSpecies[state.treeReadySpecies].name}完成生长，木材${state.treeReadyYield}${state.treeReadyResin > 0 ? `、树脂${state.treeReadyResin}` : ""}已准备收取。`, "green");
      showToast(state.treeReadyResin > 0 ? "树场产出完成：木材与树脂已锁定" : "树场产出完成");
    }
  }
  advanceOrchard(safeSeconds);
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
  syncPageUnlocks(true);
  checkAchievements();
  renderPageUnlocks();
  renderResources();
  renderApiary();
  renderTree();
  renderMachine();
  renderAutomation();
  renderGuide();
  renderMilestones();
  renderContracts();
  renderRegionalContracts();
  renderAchievements();
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
  $$('[data-shop-tab]').forEach((button) => button.addEventListener("click", () => { state.shopTab = button.dataset.shopTab; renderShop(); saveState(); }));
  $("#shop-refresh")?.addEventListener("click", refreshShopOrders);
  $("#shop-trade-grid")?.addEventListener("click", (event) => {
    const trade = event.target.closest("[data-trade-kind]");
    if (trade) return executeShopTrade(trade.dataset.tradeKind, trade.dataset.tradeId, trade.dataset.tradeQty);
    const order = event.target.closest("[data-shop-order]");
    if (order) return completeShopOrder(order.dataset.shopOrder);
    const facility = event.target.closest("[data-late-facility]");
    if (facility) return upgradeLateFacility(facility.dataset.lateFacility);
    if (event.target.closest("[data-shop-warehouse-upgrade]")) return upgradeFacility("warehouse");
  });
  ["#command-action", "#mobile-command-action"].forEach((selector) => {
    const button = $(selector);
    if (button) button.addEventListener("click", () => navigateWithFocus(button.dataset.view, button.dataset.target));
  });
  $("#npc-contact-button")?.addEventListener("click", () => openNpcDialog("greeting"));
  $("#npc-dialog-close")?.addEventListener("click", () => closeNpcDialog());
  $("#npc-dialog-modal")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeNpcDialog();
  });
  $("#npc-dialog-choices")?.addEventListener("click", (event) => {
    const topic = event.target.closest("[data-npc-topic]")?.dataset.npcTopic;
    if (!topic) return;
    if (topic === "close") return closeNpcDialog();
    renderNpcDialogue(topic);
  });
  $("#npc-dialog-action")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const view = button.dataset.view;
    const target = button.dataset.target;
    closeNpcDialog(false);
    if (view) navigateWithFocus(view, target);
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
    if ($("#npc-dialog-modal")?.classList.contains("visible")) { closeNpcDialog(); return; }
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
  $("#apiary-production-select")?.addEventListener("change", (event) => selectProductionBee(event.target.value));
  [1, 2, 3].forEach((slot) => $(`#apiary-frame-${slot}`)?.addEventListener("change", (event) => installApiaryFrame(slot - 1, event.target.value)));
  $("#princess-select").addEventListener("change", (event) => selectBreedingParent("princess", event.target.value));
  $("#drone-select").addEventListener("change", (event) => selectBreedingParent("drone", event.target.value));
  $("#tree-collect-button").addEventListener("click", collectTree);
  $("#tree-breed-button").addEventListener("click", startTreeBreeding);
  $("#tree-production-select")?.addEventListener("change", (event) => selectProductionTree(event.target.value));
  $("#tree-parent-a-select").addEventListener("change", (event) => selectTreeBreedingParent("parentA", event.target.value));
  $("#tree-parent-b-select").addEventListener("change", (event) => selectTreeBreedingParent("parentB", event.target.value));
  $("#orchard-tree-select")?.addEventListener("change", (event) => selectOrchardTree(event.target.value));
  $("#orchard-action")?.addEventListener("click", collectOrchard);
  $("#orchard-mulch-button")?.addEventListener("click", applyMulchToOrchard);
  $("#tree-pollen-collect")?.addEventListener("click", collectTreePollen);
  $("#orchard-pollen-apply")?.addEventListener("click", applyTreePollen);
  $("#butterfly-host-select")?.addEventListener("change", (event) => selectButterflyHost(event.target.value));
  $("#butterfly-breed-button").addEventListener("click", startButterflyBreeding);
  $("#butterfly-parent-a-select").addEventListener("change", (event) => selectButterflyBreedingParent("parentA", event.target.value));
  $("#butterfly-parent-b-select").addEventListener("change", (event) => selectButterflyBreedingParent("parentB", event.target.value));
  $("#machine-button").addEventListener("click", machineAction);
  $("#centrifuge-recipe-select")?.addEventListener("change", (event) => { state.machineRecipe = event.target.value; saveState(); renderMachine(); });
  $("#squeezer-button").addEventListener("click", squeezerAction);
  $("#squeezer-recipe-select")?.addEventListener("change", (event) => { state.squeezerRecipe = event.target.value; saveState(); renderMachine(); });
  $("#fermenter-button").addEventListener("click", fermenterAction);
  $("#fermenter-recipe-select")?.addEventListener("change", (event) => { state.fermenterRecipe = event.target.value; saveState(); renderMachine(); });
  $("#distiller-button").addEventListener("click", distillerAction);
  $("#contract-button").addEventListener("click", completeContract);
  $("#regional-contract-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-regional-contract]");
    if (button) completeRegionalContract(Number(button.dataset.regionalContract));
  });
  $("#automation-button").addEventListener("click", toggleAutomation);
  $("#automation-reserve").addEventListener("change", (event) => selectAutomationReserve(event.target.value));
  $$(".upgrade-button").forEach((button) => button.addEventListener("click", () => upgradeFacility(button.dataset.upgrade)));
  $("#energy-core-upgrade")?.addEventListener("click", upgradeEnergyCore);
  $("#energy-recharge-button")?.addEventListener("click", rechargeEnergyWithBiofuel);
  $("#guide-action").addEventListener("click", handleGuideAction);
  $("#guide-route-options")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-guide-route]");
    if (button) chooseGuideRoute(button.dataset.guideRoute);
  });
  $$(".horizon-action").forEach((button) => button.addEventListener("click", () => handleHorizonAction(button.dataset.action, button.dataset.target)));
  $$("[data-codex-tab]").forEach((button) => button.addEventListener("click", () => switchCodexTab(button.dataset.codexTab)));
  $("#achievement-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-achievement-claim]");
    if (!button || !claimAchievement(button.dataset.achievementClaim)) return;
    renderAll();
  });
  $("#achievement-claim-all")?.addEventListener("click", claimAllAchievements);
  $("#achievement-pending-button")?.addEventListener("click", claimAchievementPending);
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
  if ($("#npc-dialog-modal")?.classList.contains("visible")) { closeNpcDialog(); return true; }
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

const STORAGE_KEY = "forestry-lab-prototype-v1";

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
  explorationCounts: { forest: 0, plains: 0, swamp: 0, tropic: 0 },
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
  treeBreedingParents: { parentA: "oak", parentB: "birch" },
  breedingParents: { princess: "forest", drone: "meadows" },
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
  noble: { name: "贵族蜂", english: "Noble Bee", type: "未知蜂种", desc: "需要养蜂箱升级，并完成稀有亲本杂交。", icon: "?", color: "teal", traits: { speed: 82, lifespan: 76, fertility: 68 }, habitat: { forest: .95, plains: .9, swamp: .8, tropic: .9 } },
  tropical: { name: "热带蜂", english: "Tropical Bee", type: "未知蜂种", desc: "来自热带林冠的稀有品种。", icon: "?", color: "teal", traits: { speed: 76, lifespan: 44, fertility: 78 }, habitat: { forest: .7, plains: .8, swamp: .9, tropic: 1 } }
};

const treeSpecies = {
  oak: { name: "橡树", english: "Oak", type: "基础树种", desc: "稳定、耐寒，适合建立第一座树场。", icon: "♣", color: "green", traits: { growth: 58, yield: 62, resin: 42 } },
  birch: { name: "白桦", english: "Birch", type: "基础树种", desc: "生长较快，可作为杂交亲本。", icon: "♧", color: "gold", traits: { growth: 76, yield: 48, resin: 36 } },
  larch: { name: "落叶松", english: "Larch", type: "进阶树种", desc: "橡树与白桦的培育后代，木材产量更高。", icon: "♠", color: "amber", traits: { growth: 68, yield: 78, resin: 55 } },
  jungle: { name: "丛林树", english: "Jungle", type: "稀有树种", desc: "适应温暖环境，能提供更多树脂。", icon: "♨", color: "teal", traits: { growth: 72, yield: 64, resin: 82 } },
  teak: { name: "柚木", english: "Teak", type: "未知树种", desc: "需要在热带林冠中继续研究。", icon: "?", color: "teal", traits: { growth: 61, yield: 88, resin: 72 } }
};

const butterflySpecies = {
  azure: { name: "春蓝蝶", english: "Spring Azure", type: "基础蝶种", desc: "森林边缘常见的小型蝶种，适合观察季节变化。", color: "blue", zone: "forest", traits: { rarity: 28, pollination: 52 } },
  brimstone: { name: "硫磺蛾", english: "Brimstone", type: "基础蝶种", desc: "偏好开阔花地，翅色会随花源质量变亮。", color: "gold", zone: "plains", traits: { rarity: 42, pollination: 64 } },
  swallow: { name: "燕尾蝶", english: "Swallowtail", type: "湿地蝶种", desc: "在湿地植物间活动，可作为生态恢复的指示物种。", color: "teal", zone: "swamp", traits: { rarity: 61, pollination: 76 } },
  atlas: { name: "林冠蝶", english: "Canopy Atlas", type: "稀有蝶种", desc: "热带林冠中的稀有蝶种，出现时通常意味着生态值较高。", color: "purple", zone: "tropic", traits: { rarity: 82, pollination: 88 } }
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
  return kind === "tree" ? getTreeBreedingPairKey(first, second) : getBreedingPairKey(first, second);
}

function getBreedingFailureCount(kind = "bee", first = "", second = "") {
  const key = getBreedingPityKey(kind, first, second);
  const store = kind === "tree" ? state.treeBreedingPity : state.breedingPity;
  if (key && Object.prototype.hasOwnProperty.call(store || {}, key)) return clamp(Number(store[key]) || 0, 0, 9);
  // Old saves only had one global counter. Keep it for the currently selected
  // path until that path receives its first post-migration result.
  if (!Object.keys(store || {}).length) return clamp(Number(kind === "tree" ? state.treeBreedingFailures : state.breedingFailures) || 0, 0, 9);
  return 0;
}

function setBreedingFailureCount(kind, first, second, amount) {
  const key = getBreedingPityKey(kind, first, second);
  if (!key) return 0;
  const value = clamp(Math.floor(Number(amount) || 0), 0, 9);
  const storeKey = kind === "tree" ? "treeBreedingPity" : "breedingPity";
  state[storeKey] = state[storeKey] && typeof state[storeKey] === "object" ? state[storeKey] : {};
  state[storeKey][key] = value;
  if (kind === "tree") state.treeBreedingFailures = value;
  else state.breedingFailures = value;
  return value;
}

function getMutationChance(recipe, kind = "bee", first = "", second = "") {
  if (!recipe) return 0;
  const failures = getBreedingFailureCount(kind, first, second);
  return clamp(recipe.chance + Math.max(0, Number(failures) || 0) * 10, 0, 95);
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
  forest: { name: "森林边缘", wood: 5, oil: 1, combChance: .72, discoveryBase: 62, discoveryStep: 8, flowerSource: "wildflower", temperature: "温和", humidity: "均衡" },
  plains: { name: "平原花地", wood: 3, oil: 2, combChance: .48, discoveryBase: 18, discoveryStep: 10, flowerSource: "clover", temperature: "温暖", humidity: "干燥" },
  swamp: { name: "静谧沼泽", wood: 2, oil: 2, combChance: .62, discoveryBase: 0, discoveryStep: 25, flowerSource: "wildflower", temperature: "凉爽", humidity: "高湿" },
  tropic: { name: "热带林冠", wood: 4, oil: 3, combChance: .76, discoveryBase: 0, discoveryStep: 30, flowerSource: "tropical", temperature: "炎热", humidity: "高湿" }
};

const breedingRecipes = {
  "forest|meadows": { result: "cultivated", time: 8, chance: 32, requiresApiary: 1, label: "稳定培育后代" },
  "cultivated|forest": { result: "noble", time: 12, chance: 18, requiresApiary: 2, label: "高寿命突变路径" },
  "common|cultivated": { result: "noble", time: 12, chance: 22, requiresApiary: 2, label: "稀有亲本突变路径" }
};

const treeBreedingRecipes = {
  "birch|oak": { result: "larch", time: 10, chance: 28, requiresTreeFarm: 1, label: "高产木材培育路径" },
  "jungle|larch": { result: "teak", time: 14, chance: 16, requiresTreeFarm: 2, label: "热带树脂培育路径" }
};

const flowerSources = {
  wildflower: { name: "野花", icon: "✦", color: "amber", speedBonus: 0, zone: "forest", label: "稳定基础花源" },
  clover: { name: "三叶草", icon: "♣", color: "green", speedBonus: .15, zone: "plains", label: "花粉密度高 · 产速 +15%" },
  tropical: { name: "热带花", icon: "✿", color: "teal", speedBonus: .25, zone: "tropic", label: "稀有花粉 · 产速 +25%" }
};

const upgradeData = {
  apiary: { name: "养蜂箱 A-01", label: "APIARY", icon: "⬡", effect: "提高蜂箱生产速度", costs: [{ honey: 20, wax: 8, wood: 15 }, { honey: 45, wax: 20, wood: 35 }] },
  treeFarm: { name: "树场 T-01", label: "ARBOR", icon: "♣", effect: "提高木材生长速度", costs: [{ wood: 25, oil: 4 }, { wood: 60, oil: 12, resin: 2 }] },
  centrifuge: { name: "离心机 C-01", label: "PROCESSOR", icon: "◉", effect: "缩短蜂巢加工时间", costs: [{ honey: 18, wax: 6, oil: 3 }, { honey: 45, wax: 18, oil: 8 }] },
  warehouse: { name: "仓库 R-01", label: "STORAGE", icon: "▣", effect: "提高仓库容量", costs: [{ wood: 25, oil: 4 }, { wood: 60, oil: 12, wax: 8, biofuel: 2 }] }
};

const guideSteps = [
  { title: "开始第一次调查", text: "前往森林边缘寻找蜂巢和基础材料；探索也会补充该区域的花源，消耗 5 点能源。", action: "explore", actionLabel: "前往探索", target: '.explore-button[data-zone="forest"]' },
  { title: "收取第一份蜂巢", text: "等待蜂箱完成一个生产周期，再点击收取蜂巢；同时确认花源库存，避免蜂箱因缺花暂停。", action: "apiary", actionLabel: "查看蜂箱", target: "#collect-button" },
  { title: "分析两种亲本蜂", text: "在养蜂工作台分别分析森林蜂和草原蜂，确认它们的属性。", action: "apiary", actionLabel: "打开养蜂台", target: ".analyze-button:not(.done)" },
  { title: "完成第一次杂交", text: "确认两个亲本后，开始森林蜂 × 草原蜂的杂交实验。", action: "apiary", actionLabel: "进行杂交", target: "#breed-button" },
  { title: "加工蜂巢", text: "前往机器台启动离心机，获得蜂蜜和蜂蜡，完成第一条生产链。", action: "machines", actionLabel: "打开机器台", target: "#machine-button" },
  { title: "启动第二条生产线", text: "离心机完成后，榨汁机 S-01 会解锁；消耗 2 木材和 2 能源，产出 1 份种子油。", action: "machines", actionLabel: "打开榨汁机", target: "#squeezer-button" },
  { title: "培育第一棵进阶树", text: "在树木培育台分析橡树和白桦，完成一次培育并发现落叶松。", action: "arbor", actionLabel: "打开树木台", target: ".tree-analyze-button:not(.done)" },
  { title: "完成第一次设施升级", text: "前往研究台，把资源投入生产设施或仓库扩容；仓库接近满载时优先升级 STORAGE。", action: "research", actionLabel: "打开研究台", target: ".upgrade-grid" },
  { title: "建立生物质生产线", text: "图鉴拥有 3 个蜂种后解锁发酵机 F-01；消耗 3 木材和 3 能源，产出生物质。", action: "machines", actionLabel: "打开发酵机", target: "#fermenter-button" },
  { title: "蒸馏第一桶生物燃料", text: "发酵机完成 1 批后解锁蒸馏机 ST-01；消耗 1 生物质和 4 能源，产出可用于长期扩张的生物燃料。", action: "machines", actionLabel: "打开蒸馏机", target: "#distiller-button" },
  { title: "完成第一份生态委托", text: "打开总览的生态委托板，交付指定资源换取补给和声望，让长期生产有明确出口。", action: "overview", actionLabel: "查看生态委托", target: "#contract-button" }
];

const contractData = [
  { id: "field-supply", label: "FIELD SUPPLY 01", title: "林地调查补给", detail: "前线调查站需要一批基础采集物，换取新的探索补给。", requires: { rawComb: 1, wood: 5 }, rewards: { oil: 2, energy: 10 }, reputation: 1 },
  { id: "wax-frame", label: "APIARY FRAME 02", title: "蜂蜡框架委托", detail: "把离心加工后的蜂蜜和蜂蜡交给养蜂工坊，换取建造材料。", unlockText: "完成 1 次离心加工后开放", unlock: () => state.machineCycles >= 1, requires: { honey: 2, wax: 2 }, rewards: { wood: 8, energy: 15 }, reputation: 2 },
  { id: "biofuel", label: "ECO FUEL 03", title: "生态燃料补给", detail: "研究站开始收集生物质，将其转化为能源和研究用蜂蜜。", unlockText: "拥有 3 个蜂种后开放", unlock: () => isFermenterUnlocked(), requires: { biomass: 1, oil: 1 }, rewards: { honey: 4, energy: 35 }, reputation: 3 }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaultState);
    const merged = {
      ...structuredClone(defaultState),
      ...saved,
      resources: { ...defaultState.resources, ...saved.resources },
      flowerInventory: { ...defaultState.flowerInventory, ...saved.flowerInventory },
      explorationCounts: { ...defaultState.explorationCounts, ...saved.explorationCounts },
      treeSaplings: { ...defaultState.treeSaplings, ...saved.treeSaplings },
      treeBreedingParents: { ...defaultState.treeBreedingParents, ...saved.treeBreedingParents },
      breedingParents: { ...defaultState.breedingParents, ...saved.breedingParents },
      breedingPity: normalizePityStore(saved.breedingPity),
      treeBreedingPity: normalizePityStore(saved.treeBreedingPity),
      upgrades: { ...defaultState.upgrades, ...saved.upgrades },
      upgradesBought: Number.isFinite(saved.upgradesBought) ? saved.upgradesBought : defaultState.upgradesBought,
      apiaryCombCollected: Number.isFinite(saved.apiaryCombCollected) ? saved.apiaryCombCollected : (Number(saved.apiaryCycles) > 0 && Number(saved.apiaryReady) === 0 ? Math.max(1, Math.min(Number(saved.totalCombCollected) || 1, Number(saved.apiaryCycles))) : defaultState.apiaryCombCollected),
      analyzed: Array.isArray(saved.analyzed) ? saved.analyzed : [...defaultState.analyzed],
      discovered: Array.isArray(saved.discovered) ? saved.discovered : [...defaultState.discovered],
      treeDiscovered: Array.isArray(saved.treeDiscovered) ? saved.treeDiscovered : [...defaultState.treeDiscovered],
      treeAnalyzed: Array.isArray(saved.treeAnalyzed) ? saved.treeAnalyzed : [...defaultState.treeAnalyzed],
      butterflyDiscovered: Array.isArray(saved.butterflyDiscovered) ? saved.butterflyDiscovered : [...defaultState.butterflyDiscovered],
      butterflyAnalyzed: Array.isArray(saved.butterflyAnalyzed) ? saved.butterflyAnalyzed : [...defaultState.butterflyAnalyzed],
      logs: Array.isArray(saved.logs) ? saved.logs.slice(0, 6) : structuredClone(defaultState.logs)
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
    Object.keys(defaultState.explorationCounts).forEach((zone) => {
      const value = Number(merged.explorationCounts[zone]);
      merged.explorationCounts[zone] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultState.explorationCounts[zone];
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
    });
    merged.machineActive = merged.machineActive === true;
    merged.squeezerActive = merged.squeezerActive === true;
    merged.fermenterActive = merged.fermenterActive === true;
    merged.distillerActive = merged.distillerActive === true;
    merged.automationEnabled = merged.automationEnabled === true;
    const automationReserveEnergy = Number(merged.automationReserveEnergy);
    merged.automationReserveEnergy = Number.isFinite(automationReserveEnergy) ? clamp(Math.floor(automationReserveEnergy), 0, 30) : defaultState.automationReserveEnergy;
    ["rawComb", "processedHoney", "processedWax", "totalCombCollected", "apiaryCombCollected", "explorations", "apiaryReady", "apiaryCycles", "machineOutput", "machineCycles", "squeezerOutput", "squeezerCycles", "fermenterOutput", "fermenterCycles", "distillerOutput", "distillerCycles", "contractIndex", "contractsCompleted", "reputation", "treeReady", "treeReadyYield", "treeReadyResin", "treeCycles", "breedings", "breedingAttempts", "breedingFailures", "treeBreedingAttempts", "treeBreedingFailures", "upgradesBought"].forEach((key) => {
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
    ["breeding", "treeBreeding"].forEach((key) => {
      if (!merged[key]) return;
      const remaining = Number(merged[key].remaining);
      if (!Number.isFinite(remaining) || remaining <= 0) {
        merged[key] = null;
      } else if (key === "breeding") {
        merged[key] = {
          remaining,
          princess: typeof merged[key].princess === "string" ? merged[key].princess : defaultState.breedingParents.princess,
          drone: typeof merged[key].drone === "string" ? merged[key].drone : defaultState.breedingParents.drone,
          result: ["cultivated", "noble"].includes(merged[key].result) ? merged[key].result : "cultivated",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 95) : null
        };
      } else {
        merged[key] = {
          remaining,
          parentA: typeof merged[key].parentA === "string" ? merged[key].parentA : defaultState.treeBreedingParents.parentA,
          parentB: typeof merged[key].parentB === "string" ? merged[key].parentB : defaultState.treeBreedingParents.parentB,
          result: ["larch", "teak"].includes(merged[key].result) ? merged[key].result : "larch",
          chance: merged[key].chance !== null && merged[key].chance !== undefined && Number.isFinite(Number(merged[key].chance)) ? clamp(Number(merged[key].chance), 0, 95) : null
        };
      }
    });
    return merged;
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  state.lastTickAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const status = $("#save-status");
  status.textContent = "已自动保存";
  window.clearTimeout(saveState.statusTimer);
  saveState.statusTimer = window.setTimeout(() => { status.textContent = "实时同步"; }, 1600);
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

const resourceNames = { rawComb: "蜂巢", honey: "蜂蜜", wax: "蜂蜡", wood: "木材", oil: "种子油", resin: "树脂", biomass: "生物质", biofuel: "生物燃料", energy: "能源" };

function getUpgradeLevel(type) {
  return clamp(Number(state.upgrades?.[type]) || 1, 1, 3);
}

function getWarehouseCapacity() {
  return 100 + (getUpgradeLevel("warehouse") - 1) * 40;
}

function getWarehouseLoad() {
  const resourceLoad = ["honey", "wax", "wood", "oil", "resin", "biomass", "biofuel"].reduce((total, resource) => total + Math.max(0, Number(state.resources?.[resource]) || 0), 0);
  return Math.max(0, Math.floor(resourceLoad + Math.max(0, Number(state.rawComb) || 0)));
}

function getWarehouseSpace() {
  return Math.max(0, getWarehouseCapacity() - getWarehouseLoad());
}

function addToWarehouse(resource, amount) {
  const requested = Math.max(0, Math.floor(Number(amount) || 0));
  const accepted = Math.min(requested, getWarehouseSpace());
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

function getContractRewardSpace(contract) {
  if (!contract) return 0;
  return Object.entries(contract.rewards).reduce((total, [resource, amount]) => total + (resource === "energy" ? 0 : amount), 0);
}

function getContractAvailableRewardSpace(contract) {
  if (!contract) return 0;
  const releasedByPayment = Object.entries(contract.requires).reduce((total, [resource, amount]) => total + (resource === "energy" ? 0 : amount), 0);
  return getWarehouseSpace() + releasedByPayment;
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
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : .7;
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
  return getApiaryRate() * (1 + source.speedBonus);
}

function getApiaryYieldPerCycle() {
  const lifespan = getCurrentBeeTrait("lifespan");
  const fertility = getCurrentBeeTrait("fertility");
  return Math.max(1, Math.min(2, Math.floor((lifespan + fertility) / 130) + 1));
}

function getPollinationBonus() {
  if (getFlowerCount() <= 0) return 0;
  const fertility = getCurrentBeeTrait("fertility");
  return clamp((.04 + (fertility - 50) / 250) * getHabitatSuitability(), 0, .18);
}

function getTreeRate() {
  const baseRate = .65 + (getUpgradeLevel("treeFarm") - 1) * .15;
  return Math.max(.4, (baseRate + (getCurrentTreeTrait("growth") - 50) * .004) * (1 + getPollinationBonus()));
}

function getTreeYieldMultiplier() {
  return clamp((1 + (getCurrentTreeTrait("yield") - 50) / 200) * (1 + getPollinationBonus() * .5), .75, 1.35);
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
  return Math.max(3.5, 6 - (getUpgradeLevel("centrifuge") - 1) * .8);
}

function isSqueezerUnlocked() {
  return state.machineCycles >= 1;
}

function getSqueezerDuration() {
  return 8;
}

function isFermenterUnlocked() {
  return knownDiscoveredBees().length >= 3;
}

function getFermenterDuration() {
  return 10;
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
  return 12;
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
  if (type === "warehouse") return `${upgradeData[type].effect} · 当前 ${getWarehouseCapacity()} 格`;
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
  const rewardSpace = getContractRewardSpace(contract);
  if (getContractAvailableRewardSpace(contract) < rewardSpace) return showToast(`仓库空间不足，需要支付后至少腾出 ${rewardSpace} 格空间领取奖励。`);
  consumeResourceBundle(contract.requires);
  grantResourceBundle(contract.rewards);
  state.contractIndex += 1;
  state.contractsCompleted += 1;
  state.reputation += contract.reputation;
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
    state.fermenterCycles > 0,
    state.distillerCycles > 0,
    state.contractsCompleted > 0
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
  if (stepIndex === 7) return { label: "LONG · RESEARCH", stamp: "LONG", title: "完成第一次设施升级", detail: "把短周期产物投入研究台，优先升级当前最常等待的设施或仓库。", action: "research", actionLabel: "打开研究台", target: ".upgrade-grid" };
  if (stepIndex <= 9) return { label: "LONG · ENERGY", stamp: "LONG", title: stepIndex === 8 ? "建立生物质生产线" : "蒸馏第一桶生物燃料", detail: stepIndex === 8 ? "拥有 3 个蜂种后启动发酵机，继续扩展植物能源链。" : "发酵完成后启动蒸馏机，把生物质转成长期扩张资源。", action: "machines", actionLabel: stepIndex === 8 ? "打开发酵机" : "打开蒸馏机", target: getGuideTarget(stepIndex, stepIndex === 8 ? "#fermenter-button" : "#distiller-button") };
  return { label: "LONG · CONTRACT", stamp: "LONG", title: "完成第一份生态委托", detail: "交付当前委托，换取补给和声望，让资源生产拥有明确的长期出口。", action: "overview", actionLabel: "查看生态委托", target: "#contract-button" };
}

function isZoneUnlocked(zone) {
  if (zone === "forest" || zone === "plains") return true;
  if (zone === "swamp") return state.explorations >= 2;
  if (zone === "tropic") return state.machineCycles >= 1;
  return false;
}

function getZoneVisits(zone) {
  return Number(state.explorationCounts?.[zone]) || 0;
}

function getZoneDiscoveryProgress(zone) {
  const config = zones[zone];
  if (!config) return 0;
  const rareFound = (zone === "swamp" && state.discovered.includes("common")) || (zone === "tropic" && state.discovered.includes("tropical"));
  return clamp(config.discoveryBase + getZoneVisits(zone) * config.discoveryStep + (rareFound ? 25 : 0), 0, 100);
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
  setText("#honey-value", state.resources.honey);
  setText("#wax-value", state.resources.wax);
  setText("#wood-value", state.resources.wood);
  setText("#oil-value", state.resources.oil);
  setText("#resin-value", state.resources.resin);
  setText("#biomass-value", state.resources.biomass);
  setText("#biofuel-value", state.resources.biofuel);
  setText("#energy-value", Math.floor(state.resources.energy));
  const activeFlower = flowerSources[getActiveFlowerId()];
  setText("#flower-label", `花源 · ${activeFlower.name}`);
  setText("#flower-value", getFlowerCount());
  setText("#warehouse-value", `${getWarehouseLoad()} / ${getWarehouseCapacity()}`);
  const warehouseChip = $("#warehouse-chip");
  if (warehouseChip) warehouseChip.classList.toggle("storage-warning", getWarehouseSpace() <= 10);
  setText("#comb-value", state.apiaryReady);
  setText("#machine-input", state.rawComb);
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
  setText("#habitat-effect", `${zone.temperature} · ${zone.humidity} · 适配度 ${Math.round(suitability * 100)}%`);
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
  setText("#breeding-path", recipe ? `${recipe.label} · 目标：${species[recipe.result].name}${mutationFailures ? ` · 失败保底 +${mutationFailures * 10}%` : ""}` : "选择其他亲本，查看已知突变路径。");
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
  setText("#overview-ecology-effect", `${activeFlower.name} · ${habitatZone.name} · 适配 ${Math.round(habitatSuitability * 100)}% · 花源 +${flowerBonus}%`);
  updateStatusPill("#overview-ecology-status", flowerCount === 0 ? "缺花源" : habitatSuitability < .7 ? "环境偏离" : "健康", flowerCount === 0 || habitatSuitability < .7 ? "waiting" : "online");
  const ecologyCard = $("#overview-ecology-card");
  if (ecologyCard) {
    ecologyCard.dataset.target = flowerCount === 0 ? "#flower-select" : "#habitat-select";
    ecologyCard.setAttribute("aria-label", `打开林地生态设置 · ${flowerCount === 0 ? "补充花源" : habitatSuitability < .7 ? "调整环境" : "查看授粉状态"}`);
  }
  const ecologyProgress = $("#overview-ecology-progress");
  if (ecologyProgress) ecologyProgress.style.width = `${clamp(Math.round(habitatSuitability * 100), 0, 100)}%`;
  setText("#hero-focus-detail", state.apiaryReady > 0 ? `蜂巢已经准备好，先收取再送入离心机；本轮可收取 ${state.apiaryReady} 个。` : apiaryBlocked ? `当前${activeFlower.name}库存为 0，先补充花源才能继续生产。` : state.breeding ? "杂交实验进行中，先让蜂群完成当前生产循环。" : `${activeFlower.name}可用，${habitatZone.name}适配良好，预计每轮 ${apiaryYield} 个蜂巢。`);
  setText("#hero-apiary-status", state.apiaryReady > 0 ? "READY" : `${progress}%`);
  setText("#hero-flower-status", flowerCount > 0 ? activeFlower.name : "缺花源");
  const heroFlowerStatus = $("#hero-flower-status");
  if (heroFlowerStatus) heroFlowerStatus.classList.toggle("positive", flowerCount > 0);
  setText("#hero-ecology-score", `${Math.round(habitatSuitability * 100)}`);
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
    updateStatusPill("#fermenter-status", "锁定", "waiting");
    if (lockedPanel) lockedPanel.style.display = "grid";
    if (flow) flow.style.display = "none";
    if (progressPanel) progressPanel.style.display = "none";
    if (button) {
      button.disabled = true;
      button.textContent = "拥有 3 个蜂种后解锁";
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
  setText("#automation-detail", blockedOutput ? `${blockedOutput.name}已完成，但仓库只剩 ${getWarehouseSpace()} 格空间；队列会等待空间释放。` : energyBlocked ? `当前能源 ${Math.floor(state.resources.energy)}，队列保留 ${reserve} 点给探索；${energyBlocked.name}需要 ${energyBlocked.cost} 点后才能启动。` : enabled ? `队列按离心机 → 榨汁机 → 发酵机 → 蒸馏机顺序收取产物并启动下一批，始终保留 ${reserve} 点探索能源。` : `开启后自动收取有空间的产物，并按固定顺序消耗超过 ${reserve} 点保留线的能源。短周期资源仍可手动调整。`);
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
    return `<article class="species-card"><span class="species-icon ${item.color}">${beeSpriteMarkup(id)}</span><div><strong>${item.name}</strong><small>${item.type}</small></div></article>`;
  }).join("");
}

function beeSpriteMarkup(id) {
  const spriteClass = { forest: "bee-forest", meadows: "bee-meadow", cultivated: "bee-cultivated", common: "bee-common", noble: "bee-noble", tropical: "bee-tropical" }[id] || "bee-common";
  return `<span class="pixel-sprite pixel-bee ${spriteClass}" aria-hidden="true"><i class="bee-wing wing-left"></i><i class="bee-wing wing-right"></i><i class="bee-body"></i><i class="bee-tail"></i></span>`;
}

function butterflySpriteMarkup(id) {
  const spriteClass = { azure: "butterfly-azure", brimstone: "butterfly-brimstone", swallow: "butterfly-swallow", atlas: "butterfly-atlas" }[id] || "butterfly-azure";
  return `<span class="pixel-sprite pixel-butterfly ${spriteClass}" aria-hidden="true"><i class="butterfly-wing wing-left"></i><i class="butterfly-wing wing-right"></i><i class="butterfly-body"></i><i class="butterfly-antenna antenna-left"></i><i class="butterfly-antenna antenna-right"></i></span>`;
}

function getBeeLineage(id) {
  const recipeEntry = Object.entries(breedingRecipes).find(([, recipe]) => recipe.result === id);
  if (recipeEntry) {
    const parents = recipeEntry[0].split("|").map((parentId) => species[parentId]?.name || parentId);
    return `育种路径 · ${parents.join(" × ")}`;
  }
  const origins = { forest: "森林边缘", meadows: "平原花地", common: "静谧沼泽", tropical: "热带林冠" };
  return `发现区域 · ${origins[id] || "生态调查"}`;
}

function getTreeLineage(id) {
  const recipeEntry = Object.entries(treeBreedingRecipes).find(([, recipe]) => recipe.result === id);
  if (recipeEntry) {
    const treeOrder = ["oak", "birch", "jungle", "larch", "teak"];
    const parents = recipeEntry[0].split("|").sort((a, b) => treeOrder.indexOf(a) - treeOrder.indexOf(b)).map((parentId) => treeSpecies[parentId]?.name || parentId);
    return `培育路径 · ${parents.join(" × ")}`;
  }
  const origins = { oak: "森林边缘", birch: "森林边缘", jungle: "静谧沼泽", teak: "热带林冠" };
  return `发现区域 · ${origins[id] || "生态调查"}`;
}

function getButterflyLineage(id) {
  return `发现区域 · ${butterflySpecies[id]?.zone ? zones[butterflySpecies[id].zone].name : "生态调查"}`;
}

function getCodexUnlockText(id, kind) {
  if (kind === "bee") {
    return { cultivated: "完成森林蜂 × 草原蜂杂交", common: "调查静谧沼泽", noble: "养蜂箱 LV.02 后尝试稀有培育", tropical: "调查热带林冠" }[id] || "继续探索和杂交";
  }
  if (kind === "butterfly") return butterflySpecies[id] ? `调查${zones[butterflySpecies[id].zone].name}` : "继续探索生态区域";
  return { larch: "完成橡树 × 白桦培育", jungle: "调查静谧沼泽", teak: "调查热带林冠" }[id] || "继续探索和培育";
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
    icon.textContent = item.icon;
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
  setText("#pollination-detail", treeYieldLocked ? "更换花源、环境或亲本，不会改变这批待收取产物" : pollinationBonus > 0 ? `${activeFlower.name}可用 · 蜂群繁殖力 ${pollinationFertility}` : `缺少${activeFlower.name} · 蜂群授粉暂停`);
  updateStatusPill("#pollination-status", treeYieldLocked ? "已锁定" : pollinationBonus > 0 ? "联动" : "待补花源", treeYieldLocked || pollinationBonus > 0 ? "online" : "waiting");
  const treeMutationFailures = getBreedingFailureCount("tree", treeParents[0], treeParents[1]);
  const treeMutationChance = getMutationChance(recipe, "tree", treeParents[0], treeParents[1]);
  setText("#tree-mutation-chance", !recipe ? "组合未记录" : !parentsAnalyzed ? `待分析 ${treeParents.length - analyzedTrees.length} 个亲本` : !levelReady ? `需要树场 LV.${recipe.requiresTreeFarm}` : `培育概率 ${treeMutationChance}%`);
  setText("#tree-breeding-path", recipe ? `${recipe.label} · 目标：${treeSpecies[recipe.result].name}${treeMutationFailures ? ` · 失败保底 +${treeMutationFailures * 10}%` : ""}` : "选择其他树木亲本，查看已知培育路径。");
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
    return `<article class="species-card"><span class="species-icon ${item.color}">${item.icon}</span><div><strong>${item.name}</strong><small>${item.type}</small></div></article>`;
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
    return `<article class="codex-entry ${found ? "" : "locked"} ${analyzed ? "analyzed" : ""}"><span class="species-icon ${item.color}">${found ? item.icon : "?"}</span><div class="codex-body"><div class="codex-entry-top"><small>${found ? `树木 · ${item.type}` : "树木 · 未发现"}</small><span class="codex-status">${found ? analyzed ? "已分析" : "待分析" : "LOCKED"}</span></div><h3>${found ? item.name : "未知树种"}</h3><p>${found ? item.desc : getCodexUnlockText(id, "tree")}</p>${found ? `<small class="codex-lineage">${getTreeLineage(id)}</small>${traitMarkup}` : ""}</div></article>`;
  }).join("");
  const butterflyEntries = Object.entries(butterflySpecies).map(([id, item]) => {
    const found = state.butterflyDiscovered.includes(id);
    const analyzed = found && state.butterflyAnalyzed.includes(id);
    const traitMarkup = analyzed ? `<div class="codex-traits"><span>稀有度 <b>${item.traits.rarity}</b></span><span>授粉 <b>${item.traits.pollination}</b></span></div>` : `<div class="codex-traits codex-traits-hidden">观察后记录生态参数</div>`;
    return `<article class="codex-entry butterfly-entry ${found ? "" : "locked"} ${analyzed ? "analyzed" : ""}"><span class="species-icon ${item.color}">${found ? butterflySpriteMarkup(id) : "?"}</span><div class="codex-body"><div class="codex-entry-top"><small>${found ? `蝴蝶 · ${item.type}` : "蝴蝶 · 未发现"}</small><span class="codex-status">${found ? analyzed ? "已观察" : "待观察" : "LOCKED"}</span></div><h3>${found ? item.name : "未知蝶种"}</h3><p>${found ? item.desc : getCodexUnlockText(id, "butterfly")}</p>${found ? `<small class="codex-lineage">${getButterflyLineage(id)}</small>${traitMarkup}<button class="mini-action butterfly-observe-button" data-butterfly-observe="${id}">${analyzed ? "已记录" : "观察蝶种"}</button>` : ""}</div></article>`;
  }).join("");
  grid.innerHTML = `<div class="codex-section-divider"><span>01 / BEES · 蜂种</span><small>亲本、突变与基因</small></div>${beeEntries}<div class="codex-section-divider"><span>02 / BUTTERFLIES · 蝴蝶</span><small>观察、授粉与生态指标</small></div>${butterflyEntries}<div class="codex-section-divider"><span>03 / TREES · 树种</span><small>生长、木材与树脂</small></div>${treeEntries}`;
}

function renderZones() {
  $$(".explore-button").forEach((button) => {
    const zone = button.dataset.zone;
    if (!zone) return;
    const unlocked = isZoneUnlocked(zone);
    const card = button.closest(".zone-card");
    const discovery = card.querySelector("[data-zone-discovery]");
    if (discovery) discovery.textContent = `${Math.round(getZoneDiscoveryProgress(zone))}%`;
    const visits = card.querySelector("[data-zone-visits]");
    if (visits) visits.textContent = `${getZoneVisits(zone)} 次调查`;
    card.classList.toggle("locked", !unlocked);
    button.disabled = !unlocked;
    button.textContent = unlocked ? "探索" : "锁定";
    const tag = card.querySelector(".tag");
    if (tag) {
      tag.textContent = unlocked ? "已开放" : "需解锁";
      tag.classList.toggle("tag-muted", !unlocked);
      tag.classList.toggle("tag-green", unlocked);
    }
    const lockMark = card.querySelector(".lock-mark");
    if (lockMark) lockMark.style.display = unlocked ? "none" : "block";
  });
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
  if (stepIndex === 8) return isFermenterUnlocked() ? "#fermenter-button" : "#fermenter-locked-panel";
  if (stepIndex === 9) return isDistillerUnlocked() ? "#distiller-button" : "#distiller-locked-panel";
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
  const rewardSpace = getContractRewardSpace(contract);
  const spaceReady = getContractAvailableRewardSpace(contract) >= rewardSpace;
  const ready = unlocked && missing.length === 0 && spaceReady;
  const iconMap = { rawComb: "⬡", honey: "H", wax: "W", wood: "L", oil: "O", biomass: "B" };
  const toneMap = { rawComb: "amber", honey: "honey", wax: "wax", wood: "wood", oil: "oil", biomass: "biomass" };
  if (requirements) {
    requirements.innerHTML = Object.entries(contract.requires).map(([resource, amount]) => {
      const have = getStoredResourceAmount(resource);
      const enough = have >= amount;
      return `<span class="contract-slot ${enough ? "" : "missing"}"><i class="resource-icon ${toneMap[resource] || "storage"}">${iconMap[resource] || "?"}</i><strong>${Math.min(have, amount)} / ${amount}</strong><small>${resourceNames[resource] || resource}</small></span>`;
    }).join("");
  }
  updateStatusPill("#contract-status", !unlocked ? "待解锁" : ready ? "可交付" : "筹备中", !unlocked ? "waiting" : ready ? "ready" : "waiting");
  setText("#contract-label", contract.label);
  setText("#contract-title", contract.title);
  setText("#contract-detail", !unlocked ? contract.unlockText : !spaceReady && missing.length === 0 ? `仓库空间不足，需要 ${rewardSpace} 格空间后才能交付。` : contract.detail);
  setText("#contract-reward", `奖励：${formatResourceBundle(contract.rewards)} · 声望 +${contract.reputation}`);
  if (button) {
    button.disabled = !ready;
    button.textContent = !unlocked ? "完成前置后解锁" : ready ? "交付委托  →" : missing.length ? "资源未齐" : "仓库空间不足";
    button.style.opacity = button.disabled ? ".55" : "1";
  }
}

function getBlockedReadyOutput() {
  const candidates = [
    state.machineOutput > 0 ? { name: "离心机产物", space: state.machineOutput * 2 } : null,
    state.squeezerOutput > 0 ? { name: "榨汁机产物", space: state.squeezerOutput } : null,
    state.fermenterOutput > 0 ? { name: "发酵机产物", space: state.fermenterOutput } : null,
    state.distillerOutput > 0 ? { name: "蒸馏机产物", space: state.distillerOutput } : null,
    state.apiaryReady > 0 ? { name: "蜂箱产物", space: state.apiaryReady } : null,
    state.treeReady > 0 ? { name: "树场产物", space: getTreeYieldAmount() + Math.max(0, Number(state.treeReadyResin) || 0) } : null
  ].filter(Boolean);
  const blocked = candidates.find((candidate) => getWarehouseSpace() < candidate.space);
  return blocked || null;
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
  if (card) card.classList.toggle("blocked", status === "仓库满载");
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
  let shortDetail = blockedOutput ? `${blockedOutput.name}已经 READY，但当前仓库只剩 ${getWarehouseSpace()} 格空间，至少需要 ${blockedOutput.space} 格；先升级仓库或整理库存。` : flowerBlocked ? `当前${activeFlower.name}库存为 0，选择其他花源或去${zones[activeFlower.zone].name}探索补充。` : `蜂箱 A-01 正在工作，约 ${Math.max(1, Math.ceil((100 - state.apiaryProgress) / apiaryRate))} 秒后完成，预计产出 ${apiaryYield} 个蜂巢。`;
  let shortStatus = blockedOutput ? "仓库满载" : flowerBlocked ? "待处理" : "进行中";
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
      const treeInputDetail = !treeRecipe ? "当前亲本组合未记录，先更换亲本或继续探索。" : !treeLevelReady ? `需要树场 LV.${treeRecipe.requiresTreeFarm} 才能启动这条培育路径。` : treeMissingSaplings.length ? `树苗不足：${treeMissingSaplings.map(([id, amount]) => `${treeSpecies[id].name} ${getTreeSaplingCount(id)} / ${amount}`).join("、")}。` : state.resources.wood < 4 ? `木材不足：${Math.min(4, state.resources.wood)} / 4。` : "橡树 × 白桦可以培育落叶松，提升树场的木材产量。";
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
    longDetail = !fermenterReady ? `再发现 ${Math.max(0, 3 - knownBeeCount)} 个蜂种后解锁发酵机 F-01。` : state.fermenterOutput > 0 ? "生物质已经准备好，先收取产物完成这条长期生产线。" : state.fermenterActive ? `发酵机正在处理木材，约 ${Math.max(1, Math.ceil((100 - state.fermenterProgress) / (100 / getFermenterDuration())))} 秒后完成。` : fermenterInputReady ? "发酵机 F-01 已解锁，处理木材并收取生物质，继续扩展长期加工。" : `发酵机已解锁，但还需要木材 ${Math.min(3, state.resources.wood)} / 3、能源 ${Math.min(3, Math.floor(state.resources.energy))} / 3。`;
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
}

function switchView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  const codexFound = knownDiscoveredBees().length + knownDiscoveredButterflies().length + knownDiscoveredTrees().length;
  const codexTotal = Object.keys(species).length + Object.keys(butterflySpecies).length + Object.keys(treeSpecies).length;
  const labels = { overview: ["DAY 01 · FOREST EDGE", "林地总览"], explore: ["FIELD SURVEY · 01", "探索区域"], apiary: ["APICULTURE STATION · A-01", "养蜂工作台"], arbor: ["ARBORICULTURE STATION · T-01", "树木培育台"], machines: ["PROCESSING FLOOR · C-01", "机器台"], research: ["WORKSHOP RESEARCH · R-01", "研究升级"], codex: [`FIELD ARCHIVE · ${String(codexFound).padStart(2, "0")} / ${String(codexTotal).padStart(2, "0")}`, "生态图鉴"] };
  if (!labels[view]) return switchView("overview");
  setText("#view-eyebrow", labels[view][0]);
  setText("#view-title", labels[view][1]);
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

function explore(zone) {
  if (!isZoneUnlocked(zone)) return showToast("这个区域还没有开放，继续完成当前引导。");
  if (state.resources.energy < 5) return showToast("能源不足，等待恢复后再探索。");
  if (getWarehouseSpace() < zones[zone].wood) return showToast(`仓库空间不足，至少需要 ${zones[zone].wood} 格空间后再探索。`);
  state.resources.energy -= 5;
  state.explorations += 1;
  state.explorationCounts[zone] = getZoneVisits(zone) + 1;
  const zoneVisits = state.explorationCounts[zone];
  const found = [];
  let overflowed = false;
  const config = zones[zone];
  addToWarehouse("wood", config.wood);
  if (Math.random() < config.combChance) {
    const comb = addToWarehouse("rawComb", 1);
    if (comb.accepted > 0) { state.totalCombCollected += comb.accepted; found.push("蜂巢"); }
    overflowed = overflowed || comb.overflow > 0;
  }
  if (Math.random() > .45) {
    const oil = addToWarehouse("oil", config.oil);
    if (oil.accepted > 0) found.push(`种子油 ×${oil.accepted}`);
    overflowed = overflowed || oil.overflow > 0;
  }
  if (Math.random() > .25) {
    const flowerId = config.flowerSource;
    state.flowerInventory[flowerId] = getFlowerCount(flowerId) + 1;
    found.push(`${flowerSources[flowerId].name} ×1`);
  }
  if (zone === "swamp" && !state.discovered.includes("common") && (Math.random() > .3 || zoneVisits >= 2)) { state.discovered.push("common"); found.push("普通蜂"); }
  if (zone === "tropic" && !state.discovered.includes("tropical") && (Math.random() > .35 || zoneVisits >= 2)) { state.discovered.push("tropical"); found.push("热带蜂"); }
  const butterflyByZone = { forest: "azure", plains: "brimstone", swamp: "swallow", tropic: "atlas" };
  const butterflyId = butterflyByZone[zone];
  if (butterflyId && !state.butterflyDiscovered.includes(butterflyId) && (Math.random() > .4 || zoneVisits >= 2)) {
    state.butterflyDiscovered.push(butterflyId);
    found.push(butterflySpecies[butterflyId].name);
  }
  if (zone === "swamp" && !state.treeDiscovered.includes("jungle") && (Math.random() > .45 || zoneVisits >= 2)) { state.treeDiscovered.push("jungle"); state.treeSaplings.jungle = (state.treeSaplings.jungle || 0) + 1; found.push("丛林树苗"); }
  if (zone === "tropic" && !state.treeDiscovered.includes("teak") && (Math.random() > .35 || zoneVisits >= 2)) { state.treeDiscovered.push("teak"); state.treeSaplings.teak = (state.treeSaplings.teak || 0) + 1; found.push("柚木树苗"); }
  addLog(`探索${config.name}完成，获得木材 ${config.wood}${found.length ? `，发现 ${found.join("、")}` : "。"}${overflowed ? " 仓库空间不足，部分物资未能带回。" : ""}`, "teal");
  showToast(found.length ? `探索完成：${found.join("、")}${overflowed ? "；仓库空间不足" : ""}` : overflowed ? "探索完成，但仓库空间不足" : "探索完成，带回了一些木材。");
  renderAll();
}

function collectApiary() {
  if (state.apiaryReady === 0) return showToast("蜂箱还没有准备好产物。");
  const amount = state.apiaryReady;
  if (getWarehouseSpace() < amount) return showToast("仓库空间不足，请先加工蜂巢或升级仓库。");
  addToWarehouse("rawComb", amount);
  state.totalCombCollected += amount;
  state.apiaryCombCollected += amount;
  state.apiaryReady = 0;
  addLog(`蜂箱 A-01 收取 ${amount} 个蜂巢，已送入仓库。`, "amber");
  showToast(`收取成功：${amount} 个蜂巢`);
  renderAll();
}

function analyzeSpecies(id) {
  if (!state.discovered.includes(id)) return showToast("还没有发现这个蜂种。");
  if (state.analyzed.includes(id)) return showToast(`${species[id].name} 已经分析完成。`);
  state.analyzed.push(id);
  addLog(`分析完成：${species[id].name} 的速度、寿命和花源属性已记录。`, "green");
  showToast(`已分析 ${species[id].name}`);
  renderAll();
}

function analyzeButterfly(id) {
  if (!state.butterflyDiscovered.includes(id)) return showToast("还没有发现这个蝶种。");
  if (state.butterflyAnalyzed.includes(id)) return showToast(`${butterflySpecies[id].name} 已经观察完成。`);
  state.butterflyAnalyzed.push(id);
  addLog(`观察完成：${butterflySpecies[id].name} 的稀有度和授粉属性已记录。`, "teal");
  showToast(`已记录 ${butterflySpecies[id].name}`);
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
  if (getWarehouseSpace() < amount + resinAmount) return showToast(`仓库空间不足，需要 ${amount + resinAmount} 格空间后才能收取木材和树脂。`);
  addToWarehouse("wood", amount);
  if (resinAmount > 0) addToWarehouse("resin", resinAmount);
  state.treeReady = 0;
  state.treeReadyYield = 0;
  state.treeReadyResin = 0;
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

function machineAction() {
  if (state.machineOutput > 0) {
    const amount = state.machineOutput;
    if (getWarehouseSpace() < amount * 2) return showToast(`仓库空间不足，需要 ${amount * 2} 格空间后才能收取蜂蜜和蜂蜡。`);
    addToWarehouse("honey", amount);
    addToWarehouse("wax", amount);
    state.machineOutput = 0;
    addLog(`离心机 C-01 收取产物：蜂蜜 ${amount}、蜂蜡 ${amount}。`, "amber");
    showToast(`获得蜂蜜 ${amount}、蜂蜡 ${amount}`);
  } else if (state.rawComb > 0 && !state.machineActive) {
    if (state.resources.energy < 2) return showToast("能源不足，至少需要 2 点能源启动离心机。");
    state.rawComb -= 1;
    state.machineActive = true;
    state.machineProgress = 0;
    state.resources.energy = clamp(state.resources.energy - 2, 0, 100);
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
    if (getWarehouseSpace() < amount) return showToast(`仓库空间不足，需要 ${amount} 格空间后才能收取种子油。`);
    addToWarehouse("oil", amount);
    state.squeezerOutput = 0;
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
    addLog("榨汁机 S-01 开始榨取木材，目标：种子油。", "teal");
    showToast(`榨取开始：${getSqueezerDuration()} 秒后完成`);
  }
  renderAll();
}

function fermenterAction() {
  if (!isFermenterUnlocked()) return showToast("图鉴拥有 3 个蜂种后解锁发酵机 F-01。");
  if (state.fermenterOutput > 0) {
    const amount = state.fermenterOutput;
    if (getWarehouseSpace() < amount) return showToast(`仓库空间不足，需要 ${amount} 格空间后才能收取生物质。`);
    addToWarehouse("biomass", amount);
    state.fermenterOutput = 0;
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
    addLog("发酵机 F-01 开始处理木材，目标：生物质。", "teal");
    showToast(`发酵开始：${getFermenterDuration()} 秒后完成`);
  }
  renderAll();
}

function distillerAction() {
  if (!isDistillerUnlocked()) return showToast("完成 1 次发酵加工后解锁蒸馏机 ST-01。");
  if (state.distillerOutput > 0) {
    const amount = state.distillerOutput;
    if (getWarehouseSpace() < amount) return showToast(`仓库空间不足，需要 ${amount} 格空间后才能收取生物燃料。`);
    addToWarehouse("biofuel", amount);
    state.distillerOutput = 0;
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
    if (getWarehouseSpace() >= amount * 2) {
      addToWarehouse("honey", amount);
      addToWarehouse("wax", amount);
      state.machineOutput = 0;
      record(`离心机收取蜂蜜 ${amount}、蜂蜡 ${amount}`);
    }
  }
  if (state.squeezerOutput > 0) {
    const amount = state.squeezerOutput;
    if (getWarehouseSpace() >= amount) {
      addToWarehouse("oil", amount);
      state.squeezerOutput = 0;
      record(`榨汁机收取种子油 ${amount}`);
    }
  }
  if (state.fermenterOutput > 0) {
    const amount = state.fermenterOutput;
    if (getWarehouseSpace() >= amount) {
      addToWarehouse("biomass", amount);
      state.fermenterOutput = 0;
      record(`发酵机收取生物质 ${amount}`);
    }
  }
  if (state.distillerOutput > 0) {
    const amount = state.distillerOutput;
    if (getWarehouseSpace() >= amount) {
      addToWarehouse("biofuel", amount);
      state.distillerOutput = 0;
      record(`蒸馏机收取生物燃料 ${amount}`);
    }
  }
  if (state.apiaryReady > 0) {
    const amount = state.apiaryReady;
    if (getWarehouseSpace() >= amount) {
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
    if (getWarehouseSpace() >= amount + resinAmount) {
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
  if (state.resources.energy < 100) state.resources.energy = clamp(state.resources.energy + .2 * safeSeconds, 0, 100);
  const flowerId = getActiveFlowerId();
  if (state.apiaryReady === 0 && getFlowerCount(flowerId) > 0) {
    state.apiaryProgress += getApiaryEffectiveRate() * safeSeconds;
    if (state.apiaryProgress >= 100) {
      state.apiaryProgress = 0;
      state.apiaryReady = getApiaryYieldPerCycle();
      state.flowerInventory[flowerId] = getFlowerCount(flowerId) - 1;
      state.apiaryCycles += 1;
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
  const paused = [];
  const automationManaged = isAutomationUnlocked() && state.automationEnabled;
  const automationOutputBlocker = automationManaged ? getBlockedReadyOutput() : null;
  const automationEnergyBlocker = automationManaged ? getAutomationEnergyBlocker() : null;
  const anyReadyOutput = state.machineOutput > 0 || state.squeezerOutput > 0 || state.fermenterOutput > 0 || state.distillerOutput > 0 || state.apiaryReady > 0 || state.treeReady > 0;
  if (state.apiaryReady === 0 && getFlowerCount() === 0) paused.push("蜂箱缺花源");
  if (anyReadyOutput) paused.push(automationOutputBlocker ? `自动化等待仓库空间：${automationOutputBlocker.name}` : automationManaged ? "自动化队列有产物待处理" : "有产物待收取");
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
    treeBreedingRemaining: state.treeBreeding?.remaining ?? null
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
  saveState();
}

function bindEvents() {
  $$(".nav-button").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
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
  $$(".explore-button").forEach((button) => button.addEventListener("click", () => explore(button.dataset.zone)));
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
}

bindEvents();
renderAll();
applyOfflineProgress();
window.setInterval(gameTick, 1000);

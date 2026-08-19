const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const fullSource = fs.readFileSync(appPath, "utf8");
const bootIndex = fullSource.lastIndexOf("\nbindEvents();");
assert.ok(bootIndex > 0, "app bootstrap marker must exist");
const source = `${fullSource.slice(0, bootIndex)}
globalThis.__p0 = {
  zones,
  defaultState,
  getSaveIndex: () => saveIndex,
  getState: () => state,
  setState: (next) => { state = next; },
  setActiveSlot: (id) => { activeSlotId = id; },
  setGameStarted: (value) => { gameStarted = value; },
  loadState,
  performSave,
  generateManualExpedition,
  getSurveyRewardItems,
  getExploreEnergyCost,
  isZoneUnlocked,
  advanceAutoSurvey,
  mergeSurveyItems,
  claimSurveyItems,
  initializeProgressionState,
  syncPageUnlocks,
  isPageUnlocked,
  getGuideStep,
  getGuidePresentation,
  getMutationChance,
  getResolvedMutationChance,
  getMutationBreakdownText,
  breedingRecipes,
  getEnergyCapacity,
  upgradeEnergyCore,
  isAutomationUnlocked,
  checkAchievements,
  claimAchievement,
  getCompletedAchievementCount,
  treeSpecies,
  fruitData,
  squeezerRecipes,
  fermenterRecipes,
  getOrchardStage,
  getOrchardRate,
  advanceOrchard,
  getWarehouseCapacity,
  warehouseCategoryData,
  beeProductionData,
  frameData,
  shopBuyOffers,
  shopSellOffers,
  getShopTier,
  getShopBuyOffers,
  getShopBuyMax,
  getShopOrders,
  getFrameProductionBonus,
  recordProductionCycle,
  contractData,
  achievementData,
  energyCoreLevels
};`;

function makeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    has: (key) => values.has(key),
    read: (key) => values.get(key)
  };
}

function boot(initialStorage = {}) {
  const localStorage = makeStorage(initialStorage);
  const context = vm.createContext({
    console,
    localStorage,
    structuredClone,
    setTimeout,
    clearTimeout,
    Blob,
    URL,
    document: { querySelector: () => null, querySelectorAll: () => [], visibilityState: "visible" },
    window: { setTimeout, clearTimeout, confirm: () => true, location: { protocol: "http:" }, matchMedia: () => ({ matches: false }) }
  });
  vm.runInContext(source, context, { filename: appPath });
  return { api: context.__p0, localStorage };
}

const fresh = boot();
assert.equal(Object.keys(fresh.api.zones).length, 8, "P0 must expose eight survey zones");
assert.equal(fresh.api.contractData.length, 15, "P0-C must expose the full fifteen-contract main chain");
assert.equal(fresh.api.achievementData.length, 28, "P0-C must expose all twenty-eight achievements");
assert.equal(fresh.api.isPageUnlocked("apiary"), false, "new saves must begin with apiary locked");
assert.equal(fresh.api.isPageUnlocked("explore"), true, "new saves must begin with survey unlocked");
assert.deepEqual(
  Object.values(fresh.api.zones).map((zone) => zone.surveyPoints),
  [10, 10, 9, 9, 8, 8, 7, 7],
  "difficulty survey points must match the P0 table"
);
assert.deepEqual(
  Object.values(fresh.api.zones).map((zone) => [zone.manualEnergy, zone.autoEnergy]),
  [[8, 11], [9, 12], [12, 16], [13, 18], [15, 20], [16, 22], [19, 25], [24, 32]],
  "energy costs must match the P0 table"
);

const expedition = fresh.api.generateManualExpedition("forest");
assert.equal(expedition.tiles.length, 25, "manual survey map must be 5x5");
assert.equal(expedition.position, 22, "manual survey must start at camp");
[17, 12, 13].forEach((index) => assert.equal(expedition.tiles[index].type, "resource", "tutorial route must contain three reachable resource nodes"));
assert.equal(new Set(expedition.revealed).size, expedition.revealed.length, "revealed tiles must be unique");

const rewardA = fresh.api.getSurveyRewardItems("forest", "manual", 123456, 1);
const rewardB = fresh.api.getSurveyRewardItems("forest", "manual", 123456, 1);
assert.deepEqual(rewardA, rewardB, "saved expedition seed must produce deterministic rewards");
assert.ok(rewardA.some((item) => item.id === "rawComb" && item.amount >= 1), "first forest survey must guarantee one honey comb");

const progressionState = structuredClone(fresh.api.defaultState);
progressionState.tutorialSurveyClaimed = true;
fresh.api.setState(progressionState);
fresh.api.syncPageUnlocks(false);
assert.equal(fresh.api.isPageUnlocked("apiary"), true, "claiming the tutorial survey must permanently unlock apiary");
fresh.api.getState().apiaryCombCollected = 1;
fresh.api.syncPageUnlocks(false);
assert.equal(fresh.api.isPageUnlocked("machines"), true, "collecting the first apiary comb must unlock machines");
fresh.api.getState().machineStarts = 1;
fresh.api.syncPageUnlocks(false);
assert.equal(fresh.api.isPageUnlocked("arbor"), true, "starting the centrifuge must unlock arboriculture");
fresh.api.getState().machineCollectedCycles = 1;
fresh.api.syncPageUnlocks(false);
assert.equal(fresh.api.isPageUnlocked("research"), true, "collecting centrifuge output must unlock research");

fresh.api.getState().resources = { ...fresh.api.getState().resources, wood: 100, wax: 20, oil: 20, energy: 60 };
fresh.api.getState().energyCore.level = 2;
assert.equal(fresh.api.getEnergyCapacity(), 125, "energy core level two must raise capacity to 125");
assert.equal(fresh.api.energyCoreLevels[1].recovery, 7, "energy core level two must recover 7 energy per minute");

const tutorialRecipe = fresh.api.breedingRecipes["forest|meadows"];
assert.equal(fresh.api.getMutationChance(tutorialRecipe, "bee", "forest", "meadows"), 100, "tutorial breeding must be guaranteed");
assert.equal(fresh.api.getResolvedMutationChance(100, 32), 100, "stored tutorial odds must remain 100 percent at final resolution");
assert.equal(fresh.api.getMutationBreakdownText(tutorialRecipe, "bee", "forest", "meadows"), "新手教程保障 100%", "tutorial chance copy must match the guaranteed result");
Object.assign(fresh.api.getState(), {
  tutorialSurveyOpened: true,
  tutorialSurveyCompleted: true,
  tutorialSurveyClaimed: true,
  apiaryCombCollected: 1,
  machineStarts: 1,
  machineCollectedCycles: 1,
  analyzed: ["forest", "meadows"],
  breedings: 1,
  contractsCompleted: 1,
  guideRouteChosen: "explore",
  visitedViews: { ...fresh.api.getState().visitedViews, apiary: true, arbor: true }
});
assert.equal(fresh.api.getGuidePresentation().item.target, ".chapter-deck", "completed guide action must target the long-term chapter deck");
assert.ok(fresh.api.getMutationChance(tutorialRecipe, "bee", "forest", "meadows") < 100, "normal mutation odds must return after the tutorial is complete");

assert.equal(Object.keys(fresh.api.treeSpecies).length, 14, "P0.5 must expose fourteen production and orchard tree species");
assert.equal(Object.keys(fresh.api.fruitData).length, 7, "P0.5 must expose all seven fruit types");
assert.equal(JSON.stringify(fresh.api.squeezerRecipes.walnut.output), JSON.stringify({ oil: 2, mulch: 2 }), "oil fruit recipes must produce oil and mulch");
assert.equal(JSON.stringify(fresh.api.squeezerRecipes.papaya.output), JSON.stringify({ juice: 4, mulch: 1 }), "juice fruit recipes must produce juice and mulch");
assert.equal(JSON.stringify(fresh.api.fermenterRecipes.juice.output), JSON.stringify({ biomass: 2 }), "juice fermentation must be the efficient biomass path");
const orchardState = structuredClone(fresh.api.defaultState);
orchardState.treeDiscovered.push("cherry");
orchardState.orchard.treeId = "cherry";
orchardState.zoneEnvironments.forest.soil = 100;
orchardState.zoneEnvironments.forest.light = 80;
orchardState.zoneEnvironments.forest.flowerDensity = 80;
orchardState.flowerInventory.wildflower = 10;
fresh.api.setState(orchardState);
assert.equal(fresh.api.getOrchardStage(24).name, "生长", "orchard stage one must be growth");
assert.equal(fresh.api.getOrchardStage(50).name, "授粉", "orchard stage three must begin at fifty percent");
assert.ok(fresh.api.getOrchardRate() > 0, "configured fruit orchards must progress");
fresh.api.advanceOrchard(60 * 60);
assert.ok(fresh.api.getState().orchard.readyFruit > 0, "completed orchard cycles must yield fruit");
assert.ok(fresh.api.getState().orchard.readyMulch > 0, "completed orchard cycles must yield mulch");
assert.ok(fresh.api.getState().zoneEnvironments.forest.soil < 100, "orchard harvests must consume soil fertility");
assert.ok(fresh.api.getWarehouseCapacity("papaya") > 0, "fruit must have warehouse capacity before P1 expansion");

const economyState = structuredClone(fresh.api.defaultState);
economyState.explorations = 1;
fresh.api.setState(economyState);
assert.equal(fresh.api.getState().resources.emerald, 12, "P1 wallets must start with twelve emeralds");
assert.equal(fresh.api.getShopTier(), 1, "new workshops must begin at the apprentice shelf");
assert.equal(fresh.api.getWarehouseCapacity("wood"), 999, "level one regular storage must hold 999 of each item");
assert.equal(fresh.api.getWarehouseCapacity("oil"), 499, "level one processed storage must hold 499 of each item");
assert.equal(fresh.api.getWarehouseCapacity("royalJelly"), 99, "level one rare storage must hold 99 of each item");
assert.equal(fresh.api.getWarehouseCapacity("cherry"), 199, "level one biological storage must hold 199 of each item");
fresh.api.getState().upgrades.warehouse = 2;
assert.equal(fresh.api.getWarehouseCapacity("wood"), 2999, "warehouse level two must use the P1 category table");
fresh.api.getState().upgrades.warehouse = 1;
assert.equal(fresh.api.getShopOrders().length, 3, "each shop rotation must expose exactly three high-value orders");
assert.equal(fresh.api.beeProductionData.imperial.comb, "drippingComb", "imperial bees must produce their dedicated comb type");
assert.equal(fresh.api.beeProductionData.industrious.specialties.pollenCluster, .24, "industrious bees must expose pollen specialty odds");
fresh.api.getState().apiaryFrames[0] = { id: "untreated", durability: 80 };
assert.equal(fresh.api.getFrameProductionBonus(), .1, "installed frames must affect apiary production rate");
const honeyBuy = fresh.api.shopBuyOffers.find((offer) => offer.id === "honey");
const honeySell = fresh.api.shopSellOffers.find((offer) => offer.id === "honey");
assert.ok(honeyBuy.price * (honeySell.input.honey / honeyBuy.output.honey) > honeySell.reward, "fixed buy and sell prices must not allow honey arbitrage");
assert.equal(fresh.api.getShopBuyOffers().some((offer) => offer.id === "sapling-sequoia"), false, "undiscovered saplings must never leak into the shop");
const rotationBefore = fresh.api.getState().shopRotation;
for (let index = 0; index < 5; index += 1) fresh.api.recordProductionCycle();
assert.equal(fresh.api.getState().shopRotation, rotationBefore + 1, "five production cycles must refresh the shop rotation");

fresh.api.getState().contractsCompleted = 8;
assert.equal(fresh.api.isAutomationUnlocked(), false, "automation must remain locked before main contract nine");
fresh.api.getState().contractsCompleted = 9;
assert.equal(fresh.api.isAutomationUnlocked(), true, "main contract nine must unlock automation");

const flowersBeforeAchievement = fresh.api.getState().flowerInventory.wildflower;
fresh.api.getState().apiaryCombCollected = 1;
fresh.api.checkAchievements({ silent: true });
assert.equal(fresh.api.claimAchievement("apiary_collect"), true, "completed achievements must be claimable");
assert.equal(fresh.api.claimAchievement("apiary_collect"), false, "achievement rewards must not be claimable twice");
assert.equal(fresh.api.getState().flowerInventory.wildflower, flowersBeforeAchievement + 2, "achievement rewards must use their snapshot exactly once");

const autoState = structuredClone(fresh.api.defaultState);
autoState.resources.energy = 100;
autoState.autoSurvey = { id: "auto-test", zone: "forest", seed: 99, energyPerRun: 11, energyPaid: 11, totalRuns: 3, completedRuns: 0, remaining: 1, completedItems: [], discoveries: [], paused: false, userPaused: false };
fresh.api.setState(autoState);
fresh.api.advanceAutoSurvey(1, false);
assert.equal(fresh.api.getState().autoSurvey.completedRuns, 1, "auto survey must complete exactly one live run per tick");
assert.equal(fresh.api.getState().resources.energy, 89, "next auto run must pay energy once");
fresh.api.getState().resources.energy = 10;
fresh.api.getState().autoSurvey.remaining = 1;
fresh.api.advanceAutoSurvey(100, true);
assert.equal(fresh.api.getState().autoSurvey.completedRuns, 2, "energy pause must not grant unpaid offline runs");
assert.equal(fresh.api.getState().autoSurvey.paused, true, "auto survey must pause at the energy reserve");

fresh.api.setActiveSlot(1);
fresh.api.setGameStarted(true);
assert.equal(fresh.api.performSave(), true, "v2 save record must be writable");
assert.ok(fresh.localStorage.has("forestry-lab-save-index-v2"), "save index must be created");
assert.ok(fresh.localStorage.has("forestry-lab-save-slot-v2-1"), "slot record must be created");

const legacyState = structuredClone(fresh.api.defaultState);
legacyState.resources.wood = 57;
delete legacyState.progressionSchema;
legacyState.explorations = 1;
legacyState.zoneProgress.forest.manualRuns = 1;
const migrated = boot({ "forestry-lab-prototype-v1": JSON.stringify(legacyState) });
assert.equal(migrated.api.getSaveIndex().slots[0].name, "旧版工坊", "legacy save must migrate into slot one");
assert.equal(migrated.api.loadState(1).resources.wood, 57, "legacy state data must survive migration");
assert.ok(migrated.localStorage.has("forestry-lab-prototype-v1"), "legacy key must remain recoverable after migration");
assert.ok(migrated.api.getState().achievements.survey_first?.claimedAt, "legacy progress achievements must be backfilled as already claimed");

function bootWithDom() {
  const localStorage = makeStorage();
  const elements = new Map();
  function makeElement(key = "element") {
    const classes = new Set();
    const attributes = new Map();
    return {
      key,
      style: {},
      dataset: {},
      className: "",
      innerHTML: "",
      textContent: "",
      value: "",
      disabled: false,
      hidden: false,
      options: [],
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        toggle: (name, force) => force === undefined ? (classes.has(name) ? (classes.delete(name), false) : (classes.add(name), true)) : (force ? classes.add(name) : classes.delete(name), force),
        contains: (name) => classes.has(name)
      },
      addEventListener: () => {},
      setAttribute: (name, value) => attributes.set(name, String(value)),
      getAttribute: (name) => attributes.get(name) || null,
      querySelector: () => makeElement("child"),
      closest: () => null,
      scrollIntoView: () => {},
      click: () => {}
    };
  }
  const body = makeElement("body");
  const document = {
    body,
    visibilityState: "visible",
    querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, makeElement(selector));
      return elements.get(selector);
    },
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: (tag) => makeElement(tag)
  };
  const noopTimer = () => 0;
  const window = { setTimeout: noopTimer, clearTimeout: () => {}, setInterval: noopTimer, addEventListener: () => {}, confirm: () => true, prompt: () => "测试工坊", location: { protocol: "http:", href: "" }, matchMedia: () => ({ matches: false }), scrollTo: () => {} };
  const context = vm.createContext({ console, localStorage, structuredClone, setTimeout: noopTimer, clearTimeout: () => {}, Blob, URL, document, window, FileReader: function FileReader() {} });
  vm.runInContext(`${fullSource}\nglobalThis.__dom = { createNewGame, openSurveyConfirm, startManualSurvey, handleSurveyTile, finishManualSurvey, claimSurveyResult, executeShopTrade, getShopBuyMax, getState: () => state };`, context, { filename: appPath });
  return context.__dom;
}

const dom = bootWithDom();
dom.createNewGame(1);
const energyBeforeBrief = dom.getState().resources.energy;
dom.openSurveyConfirm("forest");
assert.equal(dom.getState().resources.energy, energyBeforeBrief, "opening the second-level confirmation must not spend energy");
dom.startManualSurvey("forest");
assert.equal(dom.getState().resources.energy, energyBeforeBrief - 8, "final manual start must spend energy exactly once");
[17, 12, 13].forEach((index) => dom.handleSurveyTile(index));
dom.finishManualSurvey(false);
assert.ok(dom.getState().surveyResult, "manual survey must create a claimable result");
const resultId = dom.getState().surveyResult.id;
dom.claimSurveyResult();
assert.ok(dom.getState().claimedResultIds.includes(resultId), "claimed result ID must be recorded against duplicate settlement");
assert.ok(dom.getState().rawComb >= 1, "tutorial settlement must provide a comb for the first apiary loop");
assert.equal(dom.getState().pageUnlocks.apiary, true, "claiming the tutorial result must unlock the apiary page in the live UI state");

const walletBeforeFailedTrade = dom.getState().resources.emerald;
const flowersBeforeFailedTrade = dom.getState().flowerInventory.wildflower;
dom.getState().resources.emerald = 0;
dom.executeShopTrade("buy", "wildflower", 1);
assert.equal(dom.getState().flowerInventory.wildflower, flowersBeforeFailedTrade, "failed shop transactions must not grant partial output");
dom.getState().resources.emerald = walletBeforeFailedTrade;
dom.executeShopTrade("buy", "wildflower", 1);
assert.equal(dom.getState().resources.emerald, walletBeforeFailedTrade - 1, "successful purchases must deduct emeralds atomically");
assert.equal(dom.getState().flowerInventory.wildflower, flowersBeforeFailedTrade + 8, "successful purchases must grant the configured bundle");
const honeyBeforeSale = dom.getState().resources.honey;
const walletBeforeSale = dom.getState().resources.emerald;
dom.executeShopTrade("sell", "honey", 1);
assert.equal(dom.getState().resources.honey, honeyBeforeSale - 4, "successful sales must consume the full configured input");
assert.equal(dom.getState().resources.emerald, walletBeforeSale + 1, "successful sales must credit integer emerald rewards");

console.log("P0/P0.5/P1 smoke tests passed");

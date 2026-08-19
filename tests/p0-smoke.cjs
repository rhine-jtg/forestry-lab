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
  claimSurveyItems
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
assert.deepEqual(
  Object.values(fresh.api.zones).map((zone) => zone.surveyPoints),
  [10, 10, 9, 9, 8, 8, 7, 7],
  "difficulty survey points must match the P0 table"
);
assert.deepEqual(
  Object.values(fresh.api.zones).map((zone) => [zone.manualEnergy, zone.autoEnergy]),
  [[6, 8], [7, 9], [9, 12], [10, 13], [11, 15], [12, 16], [14, 18], [18, 24]],
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

const autoState = structuredClone(fresh.api.defaultState);
autoState.resources.energy = 100;
autoState.autoSurvey = { id: "auto-test", zone: "forest", seed: 99, energyPerRun: 8, energyPaid: 8, totalRuns: 3, completedRuns: 0, remaining: 1, completedItems: [], discoveries: [], paused: false, userPaused: false };
fresh.api.setState(autoState);
fresh.api.advanceAutoSurvey(1, false);
assert.equal(fresh.api.getState().autoSurvey.completedRuns, 1, "auto survey must complete exactly one live run per tick");
assert.equal(fresh.api.getState().resources.energy, 92, "next auto run must pay energy once");
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
const migrated = boot({ "forestry-lab-prototype-v1": JSON.stringify(legacyState) });
assert.equal(migrated.api.getSaveIndex().slots[0].name, "旧版工坊", "legacy save must migrate into slot one");
assert.equal(migrated.api.loadState(1).resources.wood, 57, "legacy state data must survive migration");
assert.ok(migrated.localStorage.has("forestry-lab-prototype-v1"), "legacy key must remain recoverable after migration");

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
  vm.runInContext(`${fullSource}\nglobalThis.__dom = { createNewGame, openSurveyConfirm, startManualSurvey, handleSurveyTile, finishManualSurvey, claimSurveyResult, getState: () => state };`, context, { filename: appPath });
  return context.__dom;
}

const dom = bootWithDom();
dom.createNewGame(1);
const energyBeforeBrief = dom.getState().resources.energy;
dom.openSurveyConfirm("forest");
assert.equal(dom.getState().resources.energy, energyBeforeBrief, "opening the second-level confirmation must not spend energy");
dom.startManualSurvey("forest");
assert.equal(dom.getState().resources.energy, energyBeforeBrief - 6, "final manual start must spend energy exactly once");
[17, 12, 13].forEach((index) => dom.handleSurveyTile(index));
dom.finishManualSurvey(false);
assert.ok(dom.getState().surveyResult, "manual survey must create a claimable result");
const resultId = dom.getState().surveyResult.id;
dom.claimSurveyResult();
assert.ok(dom.getState().claimedResultIds.includes(resultId), "claimed result ID must be recorded against duplicate settlement");
assert.ok(dom.getState().rawComb >= 1, "tutorial settlement must provide a comb for the first apiary loop");

console.log("P0 smoke tests passed");

(function () {
  "use strict";

  var MAP_WIDTH = 1667;
  var MAP_HEIGHT = 943;
  var ORIGIN_X = 833.5;
  var ORIGIN_Y = 28;
  var TILE_HALF_WIDTH = 34;
  var TILE_HALF_HEIGHT = 18;
  var STORAGE_KEY = "forestry-map-building-visibility-v3";
  var STAGE_LABELS = ["未建设", "LV1", "LV2", "LV3"];

  function generatedStages(type) {
    var root = "assets/map/test-batch/buildings/" + type + "/" + type;
    return [
      { src: root + "-site-summer-generated-v1.png", size: 0.78 },
      { src: root + "-lv1-summer-generated-v1.png", size: 1 },
      { src: root + "-lv2-summer-generated-v1.png", size: 1.06 },
      { src: root + "-lv3-summer-generated-v1.png", size: 1.12 }
    ];
  }

  var BUILDINGS = [
    {
      id: "arbor", layoutId: 1787507924972, name: "林木培育场", detail: "CELL 04 / 08 · 树木育种",
      gx: 4, gy: 8, defaultOffsetX: 0, defaultOffsetY: 0, scale: 1.11, baseWidth: 220, anchor: "-94%",
      effect: { x: 0, y: -100 }, states: generatedStages("arbor")
    },
    {
      id: "station", layoutId: 1787507858995, name: "中央工作站", detail: "CELL 08 / 07 · 核心枢纽",
      gx: 8, gy: 7, defaultOffsetX: 0, defaultOffsetY: 0, scale: 1.12, baseWidth: 245, anchor: "-93%",
      effect: { x: 0, y: -120 }, states: generatedStages("station")
    },
    {
      id: "archive", layoutId: 1787507906738, name: "生态档案馆", detail: "CELL 13 / 21 · 图鉴研究",
      gx: 13, gy: 21, defaultOffsetX: 10, defaultOffsetY: -52, scale: 0.92, baseWidth: 250, anchor: "-93%",
      effect: { x: 22, y: -132 }, states: generatedStages("archive")
    },
    {
      id: "apiary", layoutId: 1787507877316, name: "古树蜂场", detail: "CELL 22 / 15 · 蜂种培育",
      gx: 22, gy: 15, defaultOffsetX: -20, defaultOffsetY: -45, scale: 0.76, baseWidth: 300, anchor: "-93%",
      effect: { x: 0, y: -102 },
      states: [
        { src: "assets/map/test-batch/buildings/apiary/apiary-site-summer-test-v3.png", size: 0.8 },
        { src: "assets/map/test-batch/buildings/apiary/apiary-lv1-summer-test-v3.png", size: 1 },
        { src: "assets/map/test-batch/buildings/apiary/apiary-lv2-summer-test-v3.png", size: 1.08 },
        { src: "assets/map/test-batch/buildings/apiary/apiary-lv3-summer-test-v3.png", size: 1.16 }
      ]
    },
    {
      id: "processing", layoutId: 1787507821950, name: "加工工坊", detail: "CELL 15 / 30 · 生产加工",
      gx: 15, gy: 30, defaultOffsetX: -15, defaultOffsetY: -35, scale: 1.3, baseWidth: 330, anchor: "-94%",
      effect: { x: -38, y: -182 }, states: generatedStages("processing")
    },
    {
      id: "market", layoutId: 1787507889631, name: "村民商店", detail: "CELL 25 / 21 · 交易中心",
      gx: 25, gy: 21, defaultOffsetX: -40, defaultOffsetY: -35, scale: 0.9, baseWidth: 285, anchor: "-93%",
      effect: { x: -46, y: -98 }, states: generatedStages("market")
    },
    {
      id: "warehouse", layoutId: 1787507838555, name: "仓库能源站", detail: "CELL 33 / 14 · 仓储供能",
      gx: 33, gy: 14, defaultOffsetX: -40, defaultOffsetY: -25, scale: 0.79, baseWidth: 340, anchor: "-91%",
      effect: { x: 4, y: -135 }, states: generatedStages("warehouse")
    }
  ];

  var PROPS = [
    { id: "logs", x: 680, y: 755, width: 68, src: "logs.png" },
    { id: "cargo-crates", x: 1328, y: 510, width: 58, src: "cargo-crates.png" },
    { id: "tied-barrels", x: 1228, y: 630, width: 52, src: "tied-barrels.png" },
    { id: "signpost", x: 920, y: 478, width: 34, src: "signpost.png" },
    { id: "apiary-boxes", x: 1115, y: 365, width: 52, src: "apiary-boxes.png" },
    { id: "flower-cart", x: 1060, y: 650, width: 66, src: "flower-cart.png" },
    { id: "bench", x: 762, y: 528, width: 48, src: "bench.png" },
    { id: "street-lantern", x: 952, y: 536, width: 31, src: "street-lantern.png" },
    { id: "seedling-tray", x: 425, y: 392, width: 42, src: "seedling-tray.png" },
    { id: "honey-basket", x: 1168, y: 420, width: 39, src: "honey-basket.png" },
    { id: "notice-board", x: 828, y: 466, width: 48, src: "notice-board.png" },
    { id: "sapling-handcart", x: 568, y: 607, width: 67, src: "sapling-handcart.png" },
    { id: "stone-well", x: 520, y: 548, width: 61, src: "stone-well.png" },
    { id: "supply-tent", x: 1450, y: 694, width: 74, src: "supply-tent.png" },
    { id: "copper-pump", x: 1262, y: 666, width: 47, src: "copper-pump.png" },
    { id: "botanical-picnic-table", x: 455, y: 584, width: 68, src: "botanical-picnic-table.png" }
  ];

  var NPCS = [
    { id: "beekeeper", name: "养蜂人", x: 590, y: 360, width: 62, src: "beekeeper-right.png" },
    { id: "botanist", name: "植物学家", x: 860, y: 472, width: 64, src: "botanist-front.png" },
    { id: "merchant", name: "商人", x: 1110, y: 602, width: 62, src: "merchant-front.png" }
  ];

  var stage = document.getElementById("mapStage");
  var background = document.getElementById("mapBackground");
  var buildingLayer = document.getElementById("buildingLayer");
  var propLayer = document.getElementById("propLayer");
  var npcLayer = document.getElementById("npcLayer");
  var riverEffects = document.getElementById("riverEffects");
  var layerList = document.getElementById("layerList");
  var visibleCount = document.getElementById("visibleCount");
  var mapEmpty = document.getElementById("mapEmpty");
  var backgroundVisible = document.getElementById("backgroundVisible");
  var adjustmentPanel = document.getElementById("adjustmentPanel");
  var adjustmentName = document.getElementById("adjustmentName");
  var offsetReadout = document.getElementById("offsetReadout");
  var screenCoordinate = document.getElementById("screenCoordinate");
  var exportBox = document.getElementById("exportBox");
  var exportStatus = document.getElementById("exportStatus");
  var layerElements = new Map();
  var rowElements = new Map();
  var propElements = [];
  var npcElements = [];
  var visibility = loadVisibility();
  var selectedBuildingId = BUILDINGS[0].id;
  var nudgeStep = 1;

  function project(gx, gy) {
    return { x: ORIGIN_X + (gx - gy) * TILE_HALF_WIDTH, y: ORIGIN_Y + (gx + gy) * TILE_HALF_HEIGHT };
  }

  function clampOffset(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(-200, Math.min(200, Math.round(number)));
  }

  function clampState(value) {
    var number = Math.round(Number(value));
    return Number.isFinite(number) ? Math.max(0, Math.min(3, number)) : 1;
  }

  function loadVisibility() {
    var defaults = {
      background: true, buildings: {}, offsets: {}, states: {},
      layers: { water: true, props: true, npcs: true, effects: true }
    };
    BUILDINGS.forEach(function (building) {
      defaults.buildings[building.id] = true;
      defaults.offsets[building.id] = { x: building.defaultOffsetX, y: building.defaultOffsetY };
      defaults.states[building.id] = 1;
    });
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || typeof stored !== "object") return defaults;
      if (typeof stored.background === "boolean") defaults.background = stored.background;
      Object.keys(defaults.layers).forEach(function (layer) {
        if (stored.layers && typeof stored.layers[layer] === "boolean") defaults.layers[layer] = stored.layers[layer];
      });
      BUILDINGS.forEach(function (building) {
        if (stored.buildings && typeof stored.buildings[building.id] === "boolean") defaults.buildings[building.id] = stored.buildings[building.id];
        if (stored.offsets && stored.offsets[building.id]) {
          defaults.offsets[building.id] = {
            x: clampOffset(stored.offsets[building.id].x), y: clampOffset(stored.offsets[building.id].y)
          };
        }
        if (stored.states && stored.states[building.id] !== undefined) defaults.states[building.id] = clampState(stored.states[building.id]);
      });
    } catch (error) {
      return defaults;
    }
    return defaults;
  }

  function saveVisibility() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility)); } catch (error) {}
  }

  function formatOffset(value) { return value > 0 ? "+" + value : String(value); }
  function getBuilding(buildingId) { return BUILDINGS.find(function (item) { return item.id === buildingId; }); }
  function getState(building) { return building.states[clampState(visibility.states[building.id])]; }

  function createBuilding(building) {
    var point = project(building.gx, building.gy);
    var anchor = document.createElement("div");
    anchor.className = "building-anchor";
    anchor.dataset.building = building.id;
    anchor.dataset.label = building.name;
    anchor.style.zIndex = String(100 + Math.round(point.y));

    var sprite = document.createElement("img");
    sprite.className = "building-sprite";
    sprite.alt = "";
    sprite.draggable = false;
    sprite.style.setProperty("--anchor-y", building.anchor);
    anchor.appendChild(sprite);

    var effect = document.createElement("span");
    effect.className = "building-effect effect-" + building.id;
    effect.setAttribute("aria-hidden", "true");
    anchor.appendChild(effect);

    buildingLayer.appendChild(anchor);
    layerElements.set(building.id, anchor);
    updateBuildingState(building);
    updateBuildingPosition(building);
  }

  function createLayerControl(building, index) {
    var row = document.createElement("div");
    row.className = "layer-item";
    row.dataset.building = building.id;

    var thumbnail = document.createElement("img");
    thumbnail.className = "layer-thumb";
    thumbnail.src = getState(building).src;
    thumbnail.alt = "";

    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "layer-copy layer-select";
    copy.setAttribute("aria-label", "选择" + building.name + "进行位置微调");
    var name = document.createElement("strong");
    name.textContent = String(index + 1).padStart(2, "0") + " · " + building.name;
    var detail = document.createElement("small");
    detail.textContent = building.detail;
    detail.dataset.role = "layer-detail";
    copy.appendChild(name);
    copy.appendChild(detail);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "visibility-button";
    toggle.dataset.action = "toggle";
    toggle.setAttribute("aria-label", "显示或隐藏" + building.name);

    var solo = document.createElement("button");
    solo.type = "button";
    solo.className = "solo-button";
    solo.dataset.action = "solo";
    solo.textContent = "仅看";
    solo.setAttribute("aria-label", "只显示" + building.name);

    row.appendChild(thumbnail);
    row.appendChild(copy);
    row.appendChild(toggle);
    row.appendChild(solo);
    layerList.appendChild(row);
    rowElements.set(building.id, row);

    toggle.addEventListener("click", function () {
      visibility.buildings[building.id] = !visibility.buildings[building.id];
      applyVisibility();
    });
    solo.addEventListener("click", function () {
      BUILDINGS.forEach(function (item) { visibility.buildings[item.id] = item.id === building.id; });
      applyVisibility();
    });
    copy.addEventListener("click", function () { selectBuilding(building.id); });
    ["mouseenter", "focusin"].forEach(function (eventName) {
      row.addEventListener(eventName, function () { focusBuilding(building.id); });
    });
    row.addEventListener("mouseleave", clearFocus);
    row.addEventListener("focusout", function (event) { if (!row.contains(event.relatedTarget)) clearFocus(); });
  }

  function createProps() {
    var root = "assets/map/test-batch/props/individual/";
    PROPS.forEach(function (prop) {
      var image = document.createElement("img");
      image.className = "map-prop";
      image.src = root + prop.src;
      image.alt = "";
      image.dataset.prop = prop.id;
      image.style.left = (prop.x / MAP_WIDTH * 100) + "%";
      image.style.top = (prop.y / MAP_HEIGHT * 100) + "%";
      image.style.zIndex = String(100 + prop.y);
      propLayer.appendChild(image);
      propElements.push({ config: prop, element: image });
    });
  }

  function createNpcs() {
    var root = "assets/map/test-batch/characters/villager/turnarounds/";
    NPCS.forEach(function (npc) {
      var image = document.createElement("img");
      image.className = "map-npc is-idle";
      image.src = root + npc.src;
      image.alt = npc.name;
      image.title = npc.name;
      image.style.left = (npc.x / MAP_WIDTH * 100) + "%";
      image.style.top = (npc.y / MAP_HEIGHT * 100) + "%";
      image.style.zIndex = String(200 + npc.y);
      npcLayer.appendChild(image);
      npcElements.push({ config: npc, element: image });
    });
  }

  function focusBuilding(buildingId) {
    clearFocus();
    var layer = layerElements.get(buildingId);
    var row = rowElements.get(buildingId);
    if (layer && visibility.buildings[buildingId]) layer.classList.add("is-focused");
    if (row) row.classList.add("is-focused");
  }

  function clearFocus() {
    layerElements.forEach(function (layer) { layer.classList.remove("is-focused"); });
    rowElements.forEach(function (row) { row.classList.remove("is-focused"); });
  }

  function updateBuildingState(building) {
    var anchor = layerElements.get(building.id);
    if (!anchor) return;
    var stateIndex = clampState(visibility.states[building.id]);
    var state = building.states[stateIndex];
    var sprite = anchor.querySelector(".building-sprite");
    sprite.src = state.src;
    sprite.style.setProperty("--building-scale", String(building.scale * state.size));
    anchor.dataset.state = String(stateIndex);
    anchor.dataset.label = building.name + " · " + STAGE_LABELS[stateIndex];
    var row = rowElements.get(building.id);
    if (row) row.querySelector(".layer-thumb").src = state.src;
  }

  function updateBuildingPosition(building) {
    var anchor = layerElements.get(building.id);
    if (!anchor) return;
    var point = project(building.gx, building.gy);
    var offset = visibility.offsets[building.id];
    anchor.style.left = ((point.x + offset.x) / MAP_WIDTH * 100) + "%";
    anchor.style.top = ((point.y + offset.y) / MAP_HEIGHT * 100) + "%";
    anchor.style.zIndex = String(100 + Math.round(point.y + offset.y));
  }

  function updateAdjustmentReadout() {
    var building = getBuilding(selectedBuildingId) || BUILDINGS[0];
    var point = project(building.gx, building.gy);
    var offset = visibility.offsets[building.id];
    var stateIndex = clampState(visibility.states[building.id]);
    adjustmentName.textContent = building.name + " · " + STAGE_LABELS[stateIndex];
    offsetReadout.textContent = "X " + formatOffset(offset.x) + " · Y " + formatOffset(offset.y);
    screenCoordinate.textContent = Math.round(point.x + offset.x) + " / " + Math.round(point.y + offset.y);
    document.querySelectorAll(".state-button[data-state]").forEach(function (button) {
      var active = Number(button.dataset.state) === stateIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    BUILDINGS.forEach(function (item) {
      var row = rowElements.get(item.id);
      var anchor = layerElements.get(item.id);
      var itemOffset = visibility.offsets[item.id];
      var itemState = clampState(visibility.states[item.id]);
      row.classList.toggle("is-selected", item.id === building.id);
      anchor.classList.toggle("is-selected", item.id === building.id && visibility.buildings[item.id]);
      row.querySelector('[data-role="layer-detail"]').textContent = item.detail + " · " + STAGE_LABELS[itemState] + " · X " + formatOffset(itemOffset.x) + " / Y " + formatOffset(itemOffset.y);
    });
  }

  function selectBuilding(buildingId) {
    if (!layerElements.has(buildingId)) return;
    selectedBuildingId = buildingId;
    updateAdjustmentReadout();
    adjustmentPanel.focus({ preventScroll: true });
  }

  function nudgeSelected(dx, dy, multiplier) {
    var building = getBuilding(selectedBuildingId);
    if (!building) return;
    var offset = visibility.offsets[building.id];
    var factor = multiplier || 1;
    offset.x = clampOffset(offset.x + dx * nudgeStep * factor);
    offset.y = clampOffset(offset.y + dy * nudgeStep * factor);
    updateBuildingPosition(building);
    updateAdjustmentReadout();
    saveVisibility();
  }

  function resetOffset(buildingId) {
    var building = getBuilding(buildingId);
    if (!building) return;
    visibility.offsets[building.id] = { x: building.defaultOffsetX, y: building.defaultOffsetY };
    updateBuildingPosition(building);
  }

  function createLayoutExport() {
    return {
      version: 3,
      projection: {
        type: "orthographic-diamond-2.5d", gridSize: 25, origin: [ORIGIN_X, ORIGIN_Y], gridRange: [-14, 39],
        tileHalfSize: [TILE_HALF_WIDTH, TILE_HALF_HEIGHT], mapSize: [MAP_WIDTH, MAP_HEIGHT]
      },
      background: "assets/map/test-batch/base/valley-base-summer-building-guided-test-v1.png",
      sceneLayers: Object.assign({}, visibility.layers),
      buildings: BUILDINGS.map(function (building) {
        var offset = visibility.offsets[building.id];
        return {
          id: building.layoutId, building: building.id, gx: building.gx, gy: building.gy,
          state: clampState(visibility.states[building.id]), scale: building.scale, pitch: 1,
          offsetX: offset.x, offsetY: offset.y, visible: visibility.buildings[building.id]
        };
      })
    };
  }

  function refreshExportBox() {
    var json = JSON.stringify(createLayoutExport(), null, 2);
    exportBox.value = json;
    exportBox.hidden = false;
    return json;
  }

  function fallbackSelectExport() {
    exportBox.focus();
    exportBox.select();
    exportStatus.textContent = "JSON 已生成，请手动复制文本框内容";
  }

  function syncSpriteSizes() {
    var stageScale = stage.getBoundingClientRect().width / MAP_WIDTH;
    BUILDINGS.forEach(function (building) {
      var anchor = layerElements.get(building.id);
      if (!anchor) return;
      var sprite = anchor.querySelector(".building-sprite");
      var effect = anchor.querySelector(".building-effect");
      sprite.style.width = (building.baseWidth * stageScale) + "px";
      effect.style.setProperty("--effect-x", (building.effect.x * stageScale) + "px");
      effect.style.setProperty("--effect-y", (building.effect.y * stageScale) + "px");
      effect.style.setProperty("--effect-scale", String(Math.max(0.42, stageScale)));
    });
    propElements.forEach(function (item) { item.element.style.width = (item.config.width * stageScale) + "px"; });
    npcElements.forEach(function (item) { item.element.style.width = (item.config.width * stageScale) + "px"; });
  }

  function applySceneLayers() {
    riverEffects.classList.toggle("is-hidden", !visibility.layers.water);
    propLayer.classList.toggle("is-hidden", !visibility.layers.props);
    npcLayer.classList.toggle("is-hidden", !visibility.layers.npcs);
    stage.classList.toggle("effects-disabled", !visibility.layers.effects);
    document.querySelectorAll("[data-scene-layer]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(visibility.layers[button.dataset.sceneLayer]));
    });
  }

  function applyVisibility() {
    var count = 0;
    BUILDINGS.forEach(function (building) {
      var shown = visibility.buildings[building.id];
      var layer = layerElements.get(building.id);
      var row = rowElements.get(building.id);
      var toggle = row.querySelector('[data-action="toggle"]');
      layer.classList.toggle("is-hidden", !shown);
      row.classList.toggle("is-off", !shown);
      toggle.setAttribute("aria-pressed", String(shown));
      toggle.title = shown ? "隐藏" + building.name : "显示" + building.name;
      if (shown) count += 1;
    });
    background.classList.toggle("is-hidden", !visibility.background);
    backgroundVisible.checked = visibility.background;
    visibleCount.textContent = count + " / " + BUILDINGS.length;
    mapEmpty.hidden = count !== 0;
    applySceneLayers();
    updateAdjustmentReadout();
    saveVisibility();
  }

  function setAll(shown) {
    BUILDINGS.forEach(function (building) { visibility.buildings[building.id] = shown; });
    applyVisibility();
  }

  BUILDINGS.forEach(function (building, index) { createBuilding(building); createLayerControl(building, index); });
  createProps();
  createNpcs();

  document.getElementById("showAll").addEventListener("click", function () { setAll(true); });
  document.getElementById("hideAll").addEventListener("click", function () { setAll(false); });
  document.getElementById("invertAll").addEventListener("click", function () {
    BUILDINGS.forEach(function (building) { visibility.buildings[building.id] = !visibility.buildings[building.id]; });
    applyVisibility();
  });
  document.getElementById("resetLayers").addEventListener("click", function () {
    visibility.background = true;
    Object.keys(visibility.layers).forEach(function (layer) { visibility.layers[layer] = true; });
    setAll(true);
  });
  backgroundVisible.addEventListener("change", function () { visibility.background = backgroundVisible.checked; applyVisibility(); });

  document.querySelectorAll("[data-scene-layer]").forEach(function (button) {
    button.addEventListener("click", function () {
      var layer = button.dataset.sceneLayer;
      visibility.layers[layer] = !visibility.layers[layer];
      applyVisibility();
    });
  });
  document.querySelectorAll("[data-map-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-map-mode]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  document.querySelectorAll(".state-button[data-state]").forEach(function (button) {
    button.addEventListener("click", function () {
      var building = getBuilding(selectedBuildingId);
      if (!building) return;
      visibility.states[building.id] = clampState(button.dataset.state);
      updateBuildingState(building);
      syncSpriteSizes();
      updateAdjustmentReadout();
      saveVisibility();
    });
  });
  document.querySelectorAll("[data-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      nudgeStep = Number(button.dataset.step);
      document.querySelectorAll("[data-step]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  document.querySelectorAll("[data-dx][data-dy]").forEach(function (button) {
    button.addEventListener("click", function () { nudgeSelected(Number(button.dataset.dx), Number(button.dataset.dy), 1); });
  });
  document.getElementById("resetCurrentOffset").addEventListener("click", function () {
    resetOffset(selectedBuildingId); updateAdjustmentReadout(); saveVisibility();
  });
  document.getElementById("resetAllOffsets").addEventListener("click", function () {
    BUILDINGS.forEach(function (building) { resetOffset(building.id); });
    updateAdjustmentReadout(); saveVisibility();
  });
  adjustmentPanel.addEventListener("keydown", function (event) {
    var directions = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    var direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    nudgeSelected(direction[0], direction[1], event.shiftKey ? 4 : 1);
  });
  document.getElementById("exportLayout").addEventListener("click", function () {
    var json = refreshExportBox();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(function () { exportStatus.textContent = "已复制，可直接粘贴发给我"; }).catch(fallbackSelectExport);
    } else {
      fallbackSelectExport();
    }
  });
  document.getElementById("downloadLayout").addEventListener("click", function () {
    var json = refreshExportBox();
    var blobUrl = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    var link = document.createElement("a");
    link.href = blobUrl;
    link.download = "forestry-map-layout-staged-v3.json";
    link.click();
    URL.revokeObjectURL(blobUrl);
    exportStatus.textContent = "JSON 文件已下载";
  });

  applyVisibility();
  selectBuilding(selectedBuildingId);
  syncSpriteSizes();
  if (window.ResizeObserver) new ResizeObserver(syncSpriteSizes).observe(stage);
  else window.addEventListener("resize", syncSpriteSizes);
}());

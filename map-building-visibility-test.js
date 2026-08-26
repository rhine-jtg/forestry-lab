(function () {
  "use strict";

  var MAP_WIDTH = 1667;
  var MAP_HEIGHT = 943;
  var BACKGROUND_WIDTH = 1058;
  var BACKGROUND_HEIGHT = 1487;
  var WORLD_SCALE = BACKGROUND_WIDTH / MAP_WIDTH;
  var WORLD_OFFSET_X = 0;
  var WORLD_OFFSET_Y = 680;
  var ORIGIN_X = 833.5;
  var ORIGIN_Y = 28;
  var TILE_HALF_WIDTH = 34;
  var TILE_HALF_HEIGHT = 18;
  var STORAGE_KEY = "forestry-map-building-visibility-v4";
  var SYNC_LAYOUT_URL = "assets/incoming/forestry-map-layout-staged-v4.json?v=13";
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
  var adjustmentKind = document.getElementById("adjustmentKind");
  var adjustmentName = document.getElementById("adjustmentName");
  var offsetReadout = document.getElementById("offsetReadout");
  var screenCoordinate = document.getElementById("screenCoordinate");
  var stateControl = document.querySelector(".state-control");
  var scaleRange = document.getElementById("scaleRange");
  var scaleReadout = document.getElementById("scaleReadout");
  var exportBox = document.getElementById("exportBox");
  var exportStatus = document.getElementById("exportStatus");
  var layerElements = new Map();
  var rowElements = new Map();
  var componentElements = new Map();
  var componentRows = new Map();
  var propElements = [];
  var npcElements = [];
  var visibility = loadVisibility();
  var selectedBuildingId = BUILDINGS[0].id;
  var selectedTarget = { kind: "building", id: BUILDINGS[0].id };
  var componentFilter = "all";
  var nudgeStep = 1;
  var dragState = null;

  function project(gx, gy) {
    return { x: ORIGIN_X + (gx - gy) * TILE_HALF_WIDTH, y: ORIGIN_Y + (gx + gy) * TILE_HALF_HEIGHT };
  }

  function toBackgroundPoint(point, offset) {
    var delta = offset || { x: 0, y: 0 };
    return {
      x: WORLD_OFFSET_X + (point.x + delta.x) * WORLD_SCALE,
      y: WORLD_OFFSET_Y + (point.y + delta.y) * WORLD_SCALE
    };
  }

  function clampOffset(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(-200, Math.min(200, Math.round(number)));
  }

  function clampSceneOffset(kind, id, value, axis) {
    var target = getTargetConfig(kind, id);
    if (!target) return clampOffset(value);
    var point = kind === "building" ? project(target.gx, target.gy) : { x: target.x, y: target.y };
    var base = axis === "x" ? point.x : point.y;
    var minimum = axis === "x" ? -WORLD_OFFSET_X / WORLD_SCALE : -WORLD_OFFSET_Y / WORLD_SCALE;
    var maximum = axis === "x" ? (BACKGROUND_WIDTH - WORLD_OFFSET_X) / WORLD_SCALE : (BACKGROUND_HEIGHT - WORLD_OFFSET_Y) / WORLD_SCALE;
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.round(Math.max(minimum - base, Math.min(maximum - base, number)));
  }

  function clampState(value) {
    var number = Math.round(Number(value));
    return Number.isFinite(number) ? Math.max(0, Math.min(3, number)) : 1;
  }

  function clampScale(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 1;
    return Math.max(0.25, Math.min(2.5, Math.round(number * 20) / 20));
  }

  function blankTransform(kind) {
    return kind === "building"
      ? { scale: 1, mirrorX: false, mirrorY: false }
      : { offsetX: 0, offsetY: 0, scale: 1, mirrorX: false, mirrorY: false };
  }

  function blankBuildingVariant(building) {
    return {
      offsetX: building.defaultOffsetX,
      offsetY: building.defaultOffsetY,
      scale: 1,
      mirrorX: false,
      mirrorY: false
    };
  }

  function readBuildingVariant(buildingId, raw, fallback) {
    if (!raw || typeof raw !== "object") return Object.assign({}, fallback);
    return {
      offsetX: clampSceneOffset("building", buildingId, raw.offsetX !== undefined ? raw.offsetX : fallback.offsetX, "x"),
      offsetY: clampSceneOffset("building", buildingId, raw.offsetY !== undefined ? raw.offsetY : fallback.offsetY, "y"),
      scale: clampScale(raw.scale !== undefined ? raw.scale : fallback.scale),
      mirrorX: raw.mirrorX === undefined ? fallback.mirrorX : Boolean(raw.mirrorX),
      mirrorY: raw.mirrorY === undefined ? fallback.mirrorY : Boolean(raw.mirrorY)
    };
  }

  function applyLayoutDefaults(defaults, layout) {
    if (!layout || typeof layout !== "object") return defaults;

    Object.keys(defaults.layers).forEach(function (layer) {
      if (layout.sceneLayers && typeof layout.sceneLayers[layer] === "boolean") {
        defaults.layers[layer] = layout.sceneLayers[layer];
      }
    });

    BUILDINGS.forEach(function (building) {
      var entry = (layout.buildings || []).find(function (item) { return item.building === building.id; });
      if (!entry) return;
      var stateIndex = clampState(entry.state);
      defaults.states[building.id] = stateIndex;
      if (typeof entry.visible === "boolean") defaults.buildings[building.id] = entry.visible;

      var variants = Array.isArray(entry.variants) ? entry.variants : [entry];
      variants.forEach(function (variant) {
        var variantState = clampState(variant.state === undefined ? stateIndex : variant.state);
        var fallback = defaults.buildingVariants[building.id][variantState];
        defaults.buildingVariants[building.id][variantState] = readBuildingVariant(building.id, {
          offsetX: variant.offsetX,
          offsetY: variant.offsetY,
          scale: variant.transformScale === undefined ? 1 : variant.transformScale,
          mirrorX: variant.mirrorX,
          mirrorY: variant.mirrorY
        }, fallback);
      });

      var activeVariant = defaults.buildingVariants[building.id][stateIndex];
      defaults.offsets[building.id] = { x: activeVariant.offsetX, y: activeVariant.offsetY };
      defaults.transforms.building[building.id] = {
        scale: activeVariant.scale,
        mirrorX: activeVariant.mirrorX,
        mirrorY: activeVariant.mirrorY
      };
    });

    ["prop", "npc"].forEach(function (kind) {
      var source = layout.components && layout.components[kind === "prop" ? "props" : "npcs"] || [];
      source.forEach(function (entry) {
        var target = getTargetConfig(kind, entry.id);
        if (!target) return;
        defaults.transforms[kind][entry.id] = {
          offsetX: clampSceneOffset(kind, entry.id, entry.offsetX === undefined ? Number(entry.x) - target.x : entry.offsetX, "x"),
          offsetY: clampSceneOffset(kind, entry.id, entry.offsetY === undefined ? Number(entry.y) - target.y : entry.offsetY, "y"),
          scale: clampScale(entry.scale),
          mirrorX: Boolean(entry.mirrorX),
          mirrorY: Boolean(entry.mirrorY)
        };
        if (typeof entry.visible === "boolean") defaults.components[kind][entry.id] = entry.visible;
      });
    });
    return defaults;
  }

  function loadVisibility(syncedLayout) {
    var defaults = {
      background: true, buildings: {}, offsets: {}, states: {},
      buildingVariants: {},
      transforms: { building: {}, prop: {}, npc: {} },
      components: { prop: {}, npc: {} },
      layers: { water: true, props: true, npcs: true, effects: true }
    };
    BUILDINGS.forEach(function (building) {
      defaults.buildings[building.id] = true;
      defaults.offsets[building.id] = { x: building.defaultOffsetX, y: building.defaultOffsetY };
      defaults.states[building.id] = 1;
      defaults.buildingVariants[building.id] = [0, 1, 2, 3].map(function () { return blankBuildingVariant(building); });
      defaults.transforms.building[building.id] = blankTransform("building");
    });
    PROPS.forEach(function (prop) {
      defaults.transforms.prop[prop.id] = blankTransform("prop");
      defaults.components.prop[prop.id] = true;
    });
    NPCS.forEach(function (npc) {
      defaults.transforms.npc[npc.id] = blankTransform("npc");
      defaults.components.npc[npc.id] = true;
    });
    applyLayoutDefaults(defaults, syncedLayout);
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
            x: clampSceneOffset("building", building.id, stored.offsets[building.id].x, "x"),
            y: clampSceneOffset("building", building.id, stored.offsets[building.id].y, "y")
          };
        }
        if (stored.states && stored.states[building.id] !== undefined) defaults.states[building.id] = clampState(stored.states[building.id]);
        var legacyOffset = stored.offsets && stored.offsets[building.id] ? stored.offsets[building.id] : null;
        var legacyTransform = stored.transforms && stored.transforms.building && stored.transforms.building[building.id] ? stored.transforms.building[building.id] : null;
        var storedVariants = stored.buildingVariants && stored.buildingVariants[building.id];
        if (storedVariants && typeof storedVariants === "object") {
          defaults.buildingVariants[building.id] = defaults.buildingVariants[building.id].map(function (fallback, stateIndex) {
            return readBuildingVariant(building.id, storedVariants[stateIndex], fallback);
          });
        } else if (legacyOffset || legacyTransform) {
          var legacyState = clampState(defaults.states[building.id]);
          var migrated = defaults.buildingVariants[building.id][legacyState];
          var legacyRaw = {};
          if (legacyOffset) {
            legacyRaw.offsetX = legacyOffset.x;
            legacyRaw.offsetY = legacyOffset.y;
          }
          if (legacyTransform) {
            legacyRaw.scale = legacyTransform.scale;
            legacyRaw.mirrorX = legacyTransform.mirrorX;
            legacyRaw.mirrorY = legacyTransform.mirrorY;
          }
          defaults.buildingVariants[building.id][legacyState] = readBuildingVariant(building.id, legacyRaw, migrated);
        }
        if (stored.transforms && stored.transforms.building && stored.transforms.building[building.id]) {
          var buildingTransform = stored.transforms.building[building.id];
          defaults.transforms.building[building.id] = {
            scale: clampScale(buildingTransform.scale),
            mirrorX: Boolean(buildingTransform.mirrorX),
            mirrorY: Boolean(buildingTransform.mirrorY)
          };
        }
      });
      ["prop", "npc"].forEach(function (kind) {
        var items = kind === "prop" ? PROPS : NPCS;
        items.forEach(function (item) {
          if (stored.components && stored.components[kind] && typeof stored.components[kind][item.id] === "boolean") {
            defaults.components[kind][item.id] = stored.components[kind][item.id];
          }
          if (stored.transforms && stored.transforms[kind] && stored.transforms[kind][item.id]) {
            var transform = stored.transforms[kind][item.id];
            defaults.transforms[kind][item.id] = {
              offsetX: clampSceneOffset(kind, item.id, transform.offsetX, "x"),
              offsetY: clampSceneOffset(kind, item.id, transform.offsetY, "y"),
              scale: clampScale(transform.scale),
              mirrorX: Boolean(transform.mirrorX),
              mirrorY: Boolean(transform.mirrorY)
            };
          }
        });
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
  function targetKey(kind, id) { return kind + ":" + id; }

  function getBuildingVariant(buildingId, stateIndex) {
    var building = getBuilding(buildingId);
    if (!building) return blankBuildingVariant({ defaultOffsetX: 0, defaultOffsetY: 0 });
    var index = clampState(stateIndex === undefined ? visibility.states[buildingId] : stateIndex);
    if (!visibility.buildingVariants[buildingId]) visibility.buildingVariants[buildingId] = [0, 1, 2, 3].map(function () { return blankBuildingVariant(building); });
    if (!visibility.buildingVariants[buildingId][index]) visibility.buildingVariants[buildingId][index] = blankBuildingVariant(building);
    return visibility.buildingVariants[buildingId][index];
  }

  function getTargetConfig(kind, id) {
    if (kind === "building") return getBuilding(id);
    var items = kind === "prop" ? PROPS : NPCS;
    return items.find(function (item) { return item.id === id; });
  }

  function getTargetTransform(kind, id) {
    if (kind === "building") return getBuildingVariant(id);
    if (!visibility.transforms[kind][id]) visibility.transforms[kind][id] = blankTransform(kind);
    return visibility.transforms[kind][id];
  }

  function getTargetElement(kind, id) {
    if (kind === "building") {
      var layer = layerElements.get(id);
      return layer ? layer.querySelector(".building-sprite") : null;
    }
    return componentElements.get(targetKey(kind, id));
  }

  function getTargetOffset(kind, id) {
    if (kind === "building") {
      var buildingVariant = getBuildingVariant(id);
      return { x: buildingVariant.offsetX, y: buildingVariant.offsetY };
    }
    var transform = getTargetTransform(kind, id);
    return { x: transform.offsetX, y: transform.offsetY };
  }

  function applyTargetTransform(kind, id) {
    var target = getTargetConfig(kind, id);
    var element = getTargetElement(kind, id);
    var transform = getTargetTransform(kind, id);
    if (!target || !element) return;
    element.style.setProperty("--mirror-x", transform.mirrorX ? "-1" : "1");
    element.style.setProperty("--mirror-y", transform.mirrorY ? "-1" : "1");
    if (kind === "building") {
      var state = getState(target);
      var renderedScale = Math.round(target.scale * state.size * transform.scale * 100) / 100;
      element.style.setProperty("--building-scale", String(renderedScale));
      var effect = layerElements.get(id).querySelector(".building-effect");
      effect.style.setProperty("--mirror-x", transform.mirrorX ? "-1" : "1");
      effect.style.setProperty("--mirror-y", transform.mirrorY ? "-1" : "1");
      effect.style.setProperty("--effect-component-scale", String(transform.scale));
    } else {
      element.style.setProperty("--component-scale", String(transform.scale));
    }
  }

  function applyTargetPosition(kind, id) {
    var target = getTargetConfig(kind, id);
    var element = kind === "building" ? layerElements.get(id) : componentElements.get(targetKey(kind, id));
    if (!target || !element) return;
    var offset = getTargetOffset(kind, id);
    var point = kind === "building" ? project(target.gx, target.gy) : { x: target.x, y: target.y };
    var backgroundPoint = toBackgroundPoint(point, offset);
    element.style.left = (backgroundPoint.x / BACKGROUND_WIDTH * 100) + "%";
    element.style.top = (backgroundPoint.y / BACKGROUND_HEIGHT * 100) + "%";
    element.style.zIndex = String((kind === "building" ? 100 : 150) + Math.round(backgroundPoint.y));
  }

  function isTargetVisible(kind, id) {
    if (kind === "building") return visibility.buildings[id];
    return visibility.components[kind][id];
  }

  function targetName(kind, id) {
    var target = getTargetConfig(kind, id);
    if (kind === "building") return target ? target.name : id;
    return target ? target.name || target.id : id;
  }

  function selectTarget(kind, id, focusPanel) {
    if (!getTargetConfig(kind, id)) return;
    selectedTarget = { kind: kind, id: id };
    if (kind === "building") selectedBuildingId = id;
    updateAdjustmentReadout();
    if (focusPanel !== false) adjustmentPanel.focus({ preventScroll: true });
  }

  function setTargetOffset(kind, id, x, y) {
    if (kind === "building") {
      var buildingVariant = getBuildingVariant(id);
      buildingVariant.offsetX = clampSceneOffset(kind, id, x, "x");
      buildingVariant.offsetY = clampSceneOffset(kind, id, y, "y");
      return;
    }
    var transform = getTargetTransform(kind, id);
    transform.offsetX = clampSceneOffset(kind, id, x, "x");
    transform.offsetY = clampSceneOffset(kind, id, y, "y");
  }

  function finishTargetDrag(element, event) {
    if (!dragState || dragState.element !== element) return;
    element.classList.remove("is-dragging");
    if (event && element.releasePointerCapture && event.pointerId !== undefined) {
      try { element.releasePointerCapture(event.pointerId); } catch (error) {}
    }
    dragState = null;
    updateAdjustmentReadout();
    saveVisibility();
  }

  function bindTargetDrag(kind, id, element) {
    element.dataset.dragTarget = targetKey(kind, id);
    element.addEventListener("pointerdown", function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      var offset = getTargetOffset(kind, id);
      selectTarget(kind, id, false);
      dragState = {
        kind: kind,
        id: id,
        element: element,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: offset.x,
        offsetY: offset.y
      };
      element.classList.add("is-dragging");
      if (element.setPointerCapture && event.pointerId !== undefined) {
        try { element.setPointerCapture(event.pointerId); } catch (error) {}
      }
      event.preventDefault();
    });
    element.addEventListener("pointermove", function (event) {
      if (!dragState || dragState.element !== element) return;
      var rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var dx = (event.clientX - dragState.startX) * MAP_WIDTH / rect.width;
      var dy = (event.clientY - dragState.startY) * MAP_WIDTH / rect.width;
      setTargetOffset(kind, id, dragState.offsetX + dx, dragState.offsetY + dy);
      applyTargetPosition(kind, id);
      updateAdjustmentReadout();
      event.preventDefault();
    });
    element.addEventListener("pointerup", function (event) { finishTargetDrag(element, event); });
    element.addEventListener("pointercancel", function (event) { finishTargetDrag(element, event); });
  }

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
    sprite.title = "拖动定位：" + building.name;
    bindTargetDrag("building", building.id, sprite);
    updateBuildingState(building);
    applyTargetPosition("building", building.id);
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
    copy.setAttribute("aria-label", "选择" + building.name + "进行位置、缩放和镜像微调");
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
    copy.addEventListener("click", function () { selectTarget("building", building.id); });
    ["mouseenter", "focusin"].forEach(function (eventName) {
      row.addEventListener(eventName, function () { focusBuilding(building.id); });
    });
    row.addEventListener("mouseleave", clearFocus);
    row.addEventListener("focusout", function (event) { if (!row.contains(event.relatedTarget)) clearFocus(); });
  }

  function createComponentControl(kind, item, index) {
    var row = document.createElement("div");
    row.className = "component-row";
    row.dataset.componentKind = kind;
    row.dataset.component = item.id;

    var thumbnail = document.createElement("img");
    thumbnail.className = "component-thumb";
    thumbnail.src = "assets/map/test-batch/" + (kind === "prop" ? "props/individual/" : "characters/villager/turnarounds/") + item.src;
    thumbnail.alt = "";

    var select = document.createElement("button");
    select.type = "button";
    select.className = "component-select";
    select.setAttribute("aria-label", "选择" + targetName(kind, item.id) + "进行缩放和镜像微调");
    var name = document.createElement("strong");
    name.textContent = String(index + 1).padStart(2, "0") + " · " + targetName(kind, item.id);
    var detail = document.createElement("small");
    detail.dataset.role = "component-detail";
    select.appendChild(name);
    select.appendChild(detail);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "component-visibility";
    toggle.setAttribute("aria-label", "显示或隐藏" + targetName(kind, item.id));
    toggle.dataset.action = "component-toggle";

    row.appendChild(thumbnail);
    row.appendChild(select);
    row.appendChild(toggle);
    document.getElementById("componentList").appendChild(row);
    componentRows.set(targetKey(kind, item.id), row);

    select.addEventListener("click", function () { selectTarget(kind, item.id); });
    toggle.addEventListener("click", function () {
      visibility.components[kind][item.id] = !visibility.components[kind][item.id];
      applyVisibility();
    });
  }

  function createProps() {
    var root = "assets/map/test-batch/props/individual/";
    PROPS.forEach(function (prop, index) {
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
      componentElements.set(targetKey("prop", prop.id), image);
      createComponentControl("prop", prop, index);
      image.title = "拖动定位：" + targetName("prop", prop.id);
      bindTargetDrag("prop", prop.id, image);
      applyTargetTransform("prop", prop.id);
      applyTargetPosition("prop", prop.id);
    });
  }

  function createNpcs() {
    var root = "assets/map/test-batch/characters/villager/turnarounds/";
    NPCS.forEach(function (npc, index) {
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
      componentElements.set(targetKey("npc", npc.id), image);
      createComponentControl("npc", npc, index);
      bindTargetDrag("npc", npc.id, image);
      applyTargetTransform("npc", npc.id);
      applyTargetPosition("npc", npc.id);
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
    anchor.dataset.state = String(stateIndex);
    anchor.dataset.label = building.name + " · " + STAGE_LABELS[stateIndex];
    var row = rowElements.get(building.id);
    if (row) row.querySelector(".layer-thumb").src = state.src;
    applyTargetTransform("building", building.id);
  }

  function updateBuildingPosition(building) {
    applyTargetPosition("building", building.id);
  }

  function mirrorLabel(transform) {
    if (transform.mirrorX && transform.mirrorY) return "双向";
    if (transform.mirrorX) return "水平";
    if (transform.mirrorY) return "垂直";
    return "正常";
  }

  function updateAdjustmentReadout() {
    var kind = selectedTarget.kind;
    var id = selectedTarget.id;
    var target = getTargetConfig(kind, id) || BUILDINGS[0];
    var transform = getTargetTransform(kind, id);
    var offset = getTargetOffset(kind, id);
    var point = kind === "building" ? project(target.gx, target.gy) : { x: target.x, y: target.y };
    var backgroundPoint = toBackgroundPoint(point, offset);
    var stateIndex = kind === "building" ? clampState(visibility.states[id]) : null;
    var kindLabel = kind === "building" ? "建筑" : (kind === "prop" ? "静态小物" : "村民");

    adjustmentKind.textContent = "CURRENT TARGET · " + kindLabel;
    adjustmentName.textContent = kind === "building" ? target.name + " · " + STAGE_LABELS[stateIndex] : targetName(kind, id);
    offsetReadout.textContent = "X " + formatOffset(offset.x) + " · Y " + formatOffset(offset.y);
    screenCoordinate.textContent = Math.round(backgroundPoint.x) + " / " + Math.round(backgroundPoint.y);
    stateControl.hidden = kind !== "building";
    scaleRange.value = String(transform.scale);
    scaleReadout.textContent = Math.round(transform.scale * 100) + "%";
    document.querySelectorAll(".mirror-button[data-mirror]").forEach(function (button) {
      var mode = button.dataset.mirror;
      var active = mode === "none" && !transform.mirrorX && !transform.mirrorY ||
        mode === "x" && transform.mirrorX && !transform.mirrorY ||
        mode === "y" && !transform.mirrorX && transform.mirrorY ||
        mode === "both" && transform.mirrorX && transform.mirrorY;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".state-button[data-state]").forEach(function (button) {
      var active = kind === "building" && Number(button.dataset.state) === stateIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    BUILDINGS.forEach(function (item) {
      var row = rowElements.get(item.id);
      var anchor = layerElements.get(item.id);
      var itemOffset = getTargetOffset("building", item.id);
      var itemState = clampState(visibility.states[item.id]);
      var itemTransform = getTargetTransform("building", item.id);
      var selected = selectedTarget.kind === "building" && selectedTarget.id === item.id;
      row.classList.toggle("is-selected", selected);
      anchor.classList.toggle("is-selected", selected && visibility.buildings[item.id]);
      row.querySelector('[data-role="layer-detail"]').textContent = item.detail + " · " + STAGE_LABELS[itemState] + " · " + Math.round(itemTransform.scale * 100) + "% · " + mirrorLabel(itemTransform) + " · X " + formatOffset(itemOffset.x) + " / Y " + formatOffset(itemOffset.y);
    });
    componentRows.forEach(function (row, key) {
      var parts = key.split(":");
      var itemKind = parts[0];
      var itemId = parts.slice(1).join(":");
      var itemTransform = getTargetTransform(itemKind, itemId);
      var selected = selectedTarget.kind === itemKind && selectedTarget.id === itemId;
      var element = componentElements.get(key);
      row.classList.toggle("is-selected", selected);
      row.classList.toggle("is-off", !visibility.components[itemKind][itemId]);
      element.classList.toggle("is-selected", selected && visibility.components[itemKind][itemId]);
      row.querySelector('[data-action="component-toggle"]').setAttribute("aria-pressed", String(visibility.components[itemKind][itemId]));
      row.querySelector('[data-role="component-detail"]').textContent = (itemKind === "prop" ? "小物" : "村民") + " · " + Math.round(itemTransform.scale * 100) + "% · " + mirrorLabel(itemTransform);
      row.hidden = componentFilter !== "all" && componentFilter !== itemKind;
    });
  }

  function selectBuilding(buildingId) {
    selectTarget("building", buildingId);
  }

  function nudgeSelected(dx, dy, multiplier) {
    var kind = selectedTarget.kind;
    var id = selectedTarget.id;
    var factor = multiplier || 1;
    if (kind === "building") {
      var buildingVariant = getBuildingVariant(id);
      buildingVariant.offsetX = clampSceneOffset(kind, id, buildingVariant.offsetX + dx * nudgeStep * factor, "x");
      buildingVariant.offsetY = clampSceneOffset(kind, id, buildingVariant.offsetY + dy * nudgeStep * factor, "y");
    } else {
      var componentTransform = getTargetTransform(kind, id);
      componentTransform.offsetX = clampSceneOffset(kind, id, componentTransform.offsetX + dx * nudgeStep * factor, "x");
      componentTransform.offsetY = clampSceneOffset(kind, id, componentTransform.offsetY + dy * nudgeStep * factor, "y");
    }
    applyTargetPosition(kind, id);
    updateAdjustmentReadout();
    saveVisibility();
  }

  function resetOffset(buildingId) {
    var building = getBuilding(buildingId);
    if (!building) return;
    var variant = getBuildingVariant(building.id);
    variant.offsetX = building.defaultOffsetX;
    variant.offsetY = building.defaultOffsetY;
    applyTargetPosition("building", building.id);
  }

  function resetAllBuildingPositions() {
    BUILDINGS.forEach(function (building) {
      [0, 1, 2, 3].forEach(function (stateIndex) {
        var variant = getBuildingVariant(building.id, stateIndex);
        variant.offsetX = building.defaultOffsetX;
        variant.offsetY = building.defaultOffsetY;
      });
      applyTargetPosition("building", building.id);
    });
  }

  function resetSelectedPosition() {
    if (selectedTarget.kind === "building") {
      resetOffset(selectedTarget.id);
    } else {
      var transform = getTargetTransform(selectedTarget.kind, selectedTarget.id);
      transform.offsetX = 0;
      transform.offsetY = 0;
      applyTargetPosition(selectedTarget.kind, selectedTarget.id);
    }
  }

  function resetSelectedTransform() {
    var transform = getTargetTransform(selectedTarget.kind, selectedTarget.id);
    transform.scale = 1;
    transform.mirrorX = false;
    transform.mirrorY = false;
    applyTargetTransform(selectedTarget.kind, selectedTarget.id);
  }

  function resetAllTransforms() {
    BUILDINGS.forEach(function (building) {
      [0, 1, 2, 3].forEach(function (stateIndex) {
        visibility.buildingVariants[building.id][stateIndex] = blankBuildingVariant(building);
      });
      applyTargetTransform("building", building.id);
    });
    ["prop", "npc"].forEach(function (kind) {
      Object.keys(visibility.transforms[kind]).forEach(function (id) {
        visibility.transforms[kind][id] = blankTransform(kind);
        applyTargetTransform(kind, id);
      });
    });
  }

  function createLayoutExport() {
    return {
      version: 4,
      projection: {
        type: "orthographic-diamond-2.5d", gridSize: 25, origin: [ORIGIN_X, ORIGIN_Y], gridRange: [-14, 39],
        tileHalfSize: [TILE_HALF_WIDTH, TILE_HALF_HEIGHT], mapSize: [MAP_WIDTH, MAP_HEIGHT]
      },
      background: "assets/map/test-batch/base/valley-forest-background-v2.png",
      backgroundDisplay: {
        mapSize: [BACKGROUND_WIDTH, BACKGROUND_HEIGHT],
        coordinateScale: WORLD_SCALE,
        coordinateOffset: [WORLD_OFFSET_X, WORLD_OFFSET_Y],
        fit: "contain"
      },
      sceneLayers: Object.assign({}, visibility.layers),
      buildings: BUILDINGS.map(function (building) {
        var stateIndex = clampState(visibility.states[building.id]);
        var state = building.states[stateIndex];
        var offset = getTargetOffset("building", building.id);
        var transform = getTargetTransform("building", building.id);
        return {
          id: building.layoutId, building: building.id, gx: building.gx, gy: building.gy,
          state: stateIndex, baseScale: building.scale, stageSize: state.size,
          scale: Math.round(building.scale * state.size * transform.scale * 100) / 100, transformScale: transform.scale,
          mirrorX: transform.mirrorX, mirrorY: transform.mirrorY, pitch: 1,
          offsetX: offset.x, offsetY: offset.y, visible: visibility.buildings[building.id],
          variants: [0, 1, 2, 3].map(function (variantState) {
            var variant = getBuildingVariant(building.id, variantState);
            return {
              state: variantState,
              offsetX: variant.offsetX,
              offsetY: variant.offsetY,
              baseScale: building.scale,
              stageSize: building.states[variantState].size,
              scale: Math.round(building.scale * building.states[variantState].size * variant.scale * 100) / 100,
              transformScale: variant.scale,
              mirrorX: variant.mirrorX,
              mirrorY: variant.mirrorY
            };
          })
        };
      }),
      components: {
        props: PROPS.map(function (prop) {
          var transform = getTargetTransform("prop", prop.id);
          return {
            id: prop.id, type: "prop", x: prop.x + transform.offsetX, y: prop.y + transform.offsetY,
            offsetX: transform.offsetX, offsetY: transform.offsetY, scale: transform.scale,
            mirrorX: transform.mirrorX, mirrorY: transform.mirrorY, visible: visibility.components.prop[prop.id]
          };
        }),
        npcs: NPCS.map(function (npc) {
          var transform = getTargetTransform("npc", npc.id);
          return {
            id: npc.id, type: "npc", x: npc.x + transform.offsetX, y: npc.y + transform.offsetY,
            offsetX: transform.offsetX, offsetY: transform.offsetY, scale: transform.scale,
            mirrorX: transform.mirrorX, mirrorY: transform.mirrorY, visible: visibility.components.npc[npc.id]
          };
        })
      }
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
    ["prop", "npc"].forEach(function (kind) {
      var items = kind === "prop" ? PROPS : NPCS;
      items.forEach(function (item) {
        var shown = visibility.components[kind][item.id];
        var element = componentElements.get(targetKey(kind, item.id));
        var row = componentRows.get(targetKey(kind, item.id));
        var toggle = row.querySelector('[data-action="component-toggle"]');
        element.classList.toggle("is-hidden", !shown);
        row.classList.toggle("is-off", !shown);
        toggle.setAttribute("aria-pressed", String(shown));
        toggle.title = shown ? "隐藏" + targetName(kind, item.id) : "显示" + targetName(kind, item.id);
      });
    });
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

  scaleRange.addEventListener("input", function () {
    var transform = getTargetTransform(selectedTarget.kind, selectedTarget.id);
    transform.scale = clampScale(scaleRange.value);
    applyTargetTransform(selectedTarget.kind, selectedTarget.id);
    updateAdjustmentReadout();
    saveVisibility();
  });
  document.querySelectorAll(".mirror-button[data-mirror]").forEach(function (button) {
    button.addEventListener("click", function () {
      var transform = getTargetTransform(selectedTarget.kind, selectedTarget.id);
      var mode = button.dataset.mirror;
      transform.mirrorX = mode === "x" || mode === "both";
      transform.mirrorY = mode === "y" || mode === "both";
      applyTargetTransform(selectedTarget.kind, selectedTarget.id);
      updateAdjustmentReadout();
      saveVisibility();
    });
  });
  document.getElementById("resetCurrentTransform").addEventListener("click", function () {
    resetSelectedTransform();
    updateAdjustmentReadout();
    saveVisibility();
  });
  document.querySelectorAll("[data-component-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      componentFilter = button.dataset.componentFilter;
      document.querySelectorAll("[data-component-filter]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateAdjustmentReadout();
    });
  });

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
    resetSelectedPosition(); updateAdjustmentReadout(); saveVisibility();
  });
  document.getElementById("resetAllOffsets").addEventListener("click", function () {
    resetAllBuildingPositions();
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
    link.download = "forestry-map-layout-staged-v4.json";
    link.click();
    URL.revokeObjectURL(blobUrl);
    exportStatus.textContent = "JSON 文件已下载";
  });

  function initializeEditor() {
    applyVisibility();
    selectBuilding(selectedBuildingId);
    syncSpriteSizes();
    if (window.ResizeObserver) new ResizeObserver(syncSpriteSizes).observe(stage);
    else window.addEventListener("resize", syncSpriteSizes);
  }

  fetch(SYNC_LAYOUT_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("布局文件读取失败");
      return response.json();
    })
    .then(function (layout) {
      visibility = loadVisibility(layout);
      document.documentElement.dataset.layoutSync = "loaded";
    })
    .catch(function (error) {
      visibility = loadVisibility();
      document.documentElement.dataset.layoutSync = "fallback";
      document.documentElement.dataset.layoutSyncError = error && error.message || "unknown";
    })
    .then(initializeEditor);
}());

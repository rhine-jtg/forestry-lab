(function () {
  "use strict";

  var LAYOUT_URL = "assets/incoming/forestry-map-layout-staged-v4.json";
  var FALLBACK_BACKGROUND = "assets/map/test-batch/base/valley-base-summer-building-guided-test-v1.png";
  var BACKGROUND_OVERRIDE = "assets/map/test-batch/base/valley-forest-background-v2.png";
  var BACKGROUND_DIMENSIONS = { width: 1058, height: 1487 };
  var WORLD_SCALE = BACKGROUND_DIMENSIONS.width / 1667;
  var WORLD_OFFSET = { x: 0, y: 680 };
  var STAGE_LABELS = ["未建设", "LV1", "LV2", "LV3"];

  function generatedStages(type) {
    var root = "assets/map/test-batch/buildings/" + type + "/" + type;
    return [
      root + "-site-summer-generated-v1.png",
      root + "-lv1-summer-generated-v1.png",
      root + "-lv2-summer-generated-v1.png",
      root + "-lv3-summer-generated-v1.png"
    ];
  }

  var BUILDING_DEFS = [
    { id: "arbor", name: "林木培育场", baseWidth: 220, anchor: "-94%", effect: { x: 0, y: -100 }, stages: generatedStages("arbor") },
    { id: "station", name: "中央工作站", baseWidth: 245, anchor: "-93%", effect: { x: 0, y: -120 }, stages: generatedStages("station") },
    { id: "archive", name: "生态档案馆", baseWidth: 250, anchor: "-93%", effect: { x: 22, y: -132 }, stages: generatedStages("archive") },
    { id: "apiary", name: "古树蜂场", baseWidth: 300, anchor: "-93%", effect: { x: 0, y: -102 }, stages: [
      "assets/map/test-batch/buildings/apiary/apiary-site-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv1-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv2-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv3-summer-test-v3.png"
    ] },
    { id: "processing", name: "加工工坊", baseWidth: 330, anchor: "-94%", effect: { x: -38, y: -182 }, stages: generatedStages("processing") },
    { id: "market", name: "村民商店", baseWidth: 285, anchor: "-93%", effect: { x: -46, y: -98 }, stages: generatedStages("market") },
    { id: "warehouse", name: "仓库能源站", baseWidth: 340, anchor: "-91%", effect: { x: 4, y: -135 }, stages: generatedStages("warehouse") }
  ];

  var PROP_DEFS = {
    "logs": { name: "原木堆", glyph: "▰", width: 68, src: "logs.png" },
    "cargo-crates": { name: "货物箱", glyph: "▦", width: 58, src: "cargo-crates.png" },
    "tied-barrels": { name: "捆扎木桶", glyph: "◉", width: 52, src: "tied-barrels.png" },
    "signpost": { name: "指示牌", glyph: "⌖", width: 34, src: "signpost.png" },
    "apiary-boxes": { name: "蜂箱组", glyph: "▦", width: 52, src: "apiary-boxes.png" },
    "flower-cart": { name: "花源推车", glyph: "✿", width: 66, src: "flower-cart.png" },
    "bench": { name: "长椅", glyph: "▱", width: 48, src: "bench.png" },
    "street-lantern": { name: "路灯", glyph: "✦", width: 31, src: "street-lantern.png" },
    "seedling-tray": { name: "树苗托盘", glyph: "♧", width: 42, src: "seedling-tray.png" },
    "honey-basket": { name: "蜂蜜篮", glyph: "◌", width: 39, src: "honey-basket.png" },
    "notice-board": { name: "公告栏", glyph: "▤", width: 48, src: "notice-board.png" },
    "sapling-handcart": { name: "树苗手推车", glyph: "♧", width: 67, src: "sapling-handcart.png" },
    "stone-well": { name: "石井", glyph: "◫", width: 61, src: "stone-well.png" },
    "supply-tent": { name: "补给帐篷", glyph: "⌂", width: 74, src: "supply-tent.png" },
    "copper-pump": { name: "铜制水泵", glyph: "≈", width: 47, src: "copper-pump.png" },
    "botanical-picnic-table": { name: "植物学野餐桌", glyph: "▥", width: 68, src: "botanical-picnic-table.png" }
  };

  var NPC_DEFS = {
    beekeeper: { name: "养蜂人", glyph: "♟", width: 62, src: "beekeeper-right.png" },
    botanist: { name: "植物学家", glyph: "♟", width: 64, src: "botanist-front.png" },
    merchant: { name: "商人", glyph: "♟", width: 62, src: "merchant-front.png" }
  };

  var stage = document.getElementById("mapStage");
  var mapCanvas = document.getElementById("mapCanvas");
  var background = document.getElementById("mapBackground");
  var backgroundExtension = document.getElementById("mapBackgroundExtension");
  var buildingLayer = document.getElementById("buildingLayer");
  var propLayer = document.getElementById("propLayer");
  var npcLayer = document.getElementById("npcLayer");
  var riverEffects = document.getElementById("riverEffects");
  var buildingList = document.getElementById("buildingList");
  var componentSummary = document.getElementById("componentSummary");
  var loadStatus = document.getElementById("loadStatus");
  var layoutBadge = document.getElementById("layoutBadge");
  var previewError = document.getElementById("previewError");
  var previewErrorMessage = document.getElementById("previewErrorMessage");
  var buildingElements = new Map();
  var componentElements = new Map();
  var currentLayout = null;
  var currentLayoutDimensions = { width: 1667, height: 943 };

  function number(value, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function bool(value, fallback) {
    return value === undefined ? fallback : Boolean(value);
  }

  function clampState(value) {
    return Math.max(0, Math.min(3, Math.round(number(value, 1))));
  }

  function escapeText(value) {
    return String(value === undefined || value === null ? "" : value);
  }

  function formatOffset(value) {
    var parsed = Math.round(number(value, 0));
    return parsed > 0 ? "+" + parsed : String(parsed);
  }

  function project(projection, gx, gy) {
    var origin = projection.origin || [833.5, 28];
    var tile = projection.tileHalfSize || [34, 18];
    return {
      x: number(origin[0], 833.5) + (number(gx, 0) - number(gy, 0)) * number(tile[0], 34),
      y: number(origin[1], 28) + (number(gx, 0) + number(gy, 0)) * number(tile[1], 18)
    };
  }

  function toBackgroundPoint(point) {
    return {
      x: WORLD_OFFSET.x + point.x * WORLD_SCALE,
      y: WORLD_OFFSET.y + point.y * WORLD_SCALE
    };
  }

  function percent(value, total) {
    return (number(value, 0) / total * 100) + "%";
  }

  function layoutSize(layout) {
    var mapSize = layout.projection && layout.projection.mapSize || [1667, 943];
    return { width: number(mapSize[0], 1667), height: number(mapSize[1], 943) };
  }

  function buildingEntry(layout, id) {
    return (layout.buildings || []).find(function (item) { return item.building === id; }) || null;
  }

  function activeBuildingTransform(entry, stateOverride) {
    var state = clampState(stateOverride === undefined ? entry && entry.state : stateOverride);
    var variant = (entry && Array.isArray(entry.variants) ? entry.variants : []).find(function (item) {
      return clampState(item.state) === state;
    });
    var source = variant || entry || {};
    return {
      state: state,
      scale: number(source.scale, number(entry && entry.scale, 1)),
      mirrorX: bool(source.mirrorX, bool(entry && entry.mirrorX, false)),
      mirrorY: bool(source.mirrorY, bool(entry && entry.mirrorY, false)),
      offsetX: number(source.offsetX, number(entry && entry.offsetX, 0)),
      offsetY: number(source.offsetY, number(entry && entry.offsetY, 0)),
      visible: bool(entry && entry.visible, true)
    };
  }

  function finalComponentPosition(item, def) {
    return {
      x: number(item.x, number(def && def.x, 0) + number(item.offsetX, 0)),
      y: number(item.y, number(def && def.y, 0) + number(item.offsetY, 0))
    };
  }

  function setMirror(element, mirrorX, mirrorY) {
    element.style.setProperty("--mirror-x", mirrorX ? "-1" : "1");
    element.style.setProperty("--mirror-y", mirrorY ? "-1" : "1");
  }

  function createBuilding(layout, def, index, dimensions) {
    var entry = buildingEntry(layout, def.id);
    if (!entry) return;
    var transform = activeBuildingTransform(entry);
    var point = project(layout.projection || {}, entry.gx, entry.gy);
    var backgroundPoint = toBackgroundPoint({ x: point.x + transform.offsetX, y: point.y + transform.offsetY });
    var anchor = document.createElement("div");
    anchor.className = "building-anchor";
    anchor.dataset.previewTarget = "building:" + def.id;
    anchor.dataset.label = def.name + " · " + STAGE_LABELS[transform.state];
    anchor.dataset.state = String(transform.state);
    anchor.style.left = percent(backgroundPoint.x, BACKGROUND_DIMENSIONS.width);
    anchor.style.top = percent(backgroundPoint.y, BACKGROUND_DIMENSIONS.height);
    anchor.style.zIndex = String(100 + Math.round(backgroundPoint.y));
    if (!transform.visible) anchor.classList.add("is-hidden");

    var sprite = document.createElement("img");
    sprite.className = "building-sprite";
    sprite.src = def.stages[transform.state];
    sprite.alt = "";
    sprite.draggable = false;
    sprite.style.setProperty("--anchor-y", def.anchor);
    sprite.style.setProperty("--building-scale", String(transform.scale));
    setMirror(sprite, transform.mirrorX, transform.mirrorY);
    anchor.appendChild(sprite);

    var effect = document.createElement("span");
    effect.className = "building-effect effect-" + def.id;
    effect.setAttribute("aria-hidden", "true");
    effect.style.setProperty("--effect-component-scale", String(transform.scale));
    setMirror(effect, transform.mirrorX, transform.mirrorY);
    anchor.appendChild(effect);

    buildingLayer.appendChild(anchor);
    buildingElements.set(def.id, { anchor: anchor, sprite: sprite, effect: effect, def: def, entry: entry, transform: transform, activeState: transform.state, point: point });
  }

  function updateBuildingState(id, nextState) {
    var item = buildingElements.get(id);
    if (!item) return;
    var transform = activeBuildingTransform(item.entry, nextState);
    item.transform = transform;
    item.activeState = transform.state;
    item.anchor.dataset.state = String(transform.state);
    item.anchor.dataset.label = item.def.name + " · " + STAGE_LABELS[transform.state];
    var backgroundPoint = toBackgroundPoint({ x: item.point.x + transform.offsetX, y: item.point.y + transform.offsetY });
    item.anchor.style.left = percent(backgroundPoint.x, BACKGROUND_DIMENSIONS.width);
    item.anchor.style.top = percent(backgroundPoint.y, BACKGROUND_DIMENSIONS.height);
    item.anchor.style.zIndex = String(100 + Math.round(backgroundPoint.y));
    item.sprite.src = item.def.stages[transform.state];
    item.sprite.style.setProperty("--building-scale", String(transform.scale));
    item.effect.style.setProperty("--effect-component-scale", String(transform.scale));
    setMirror(item.sprite, transform.mirrorX, transform.mirrorY);
    setMirror(item.effect, transform.mirrorX, transform.mirrorY);
    updateBuildingListState(id, transform);
    focusTarget("building:" + id);
  }

  function createProp(layout, item, dimensions) {
    var def = PROP_DEFS[item.id] || { name: item.id, glyph: "·", width: 48, src: item.id + ".png" };
    var position = finalComponentPosition(item, def);
    var backgroundPoint = toBackgroundPoint(position);
    var image = document.createElement("img");
    image.className = "map-prop";
    image.src = "assets/map/test-batch/props/individual/" + def.src;
    image.alt = "";
    image.draggable = false;
    image.dataset.previewTarget = "prop:" + item.id;
    image.style.left = percent(backgroundPoint.x, BACKGROUND_DIMENSIONS.width);
    image.style.top = percent(backgroundPoint.y, BACKGROUND_DIMENSIONS.height);
    image.style.zIndex = String(150 + Math.round(backgroundPoint.y));
    image.style.setProperty("--component-scale", String(number(item.scale, 1)));
    setMirror(image, bool(item.mirrorX, false), bool(item.mirrorY, false));
    if (!bool(item.visible, true)) image.classList.add("is-hidden");
    propLayer.appendChild(image);
    componentElements.set("prop:" + item.id, image);
  }

  function createNpc(layout, item, dimensions) {
    var def = NPC_DEFS[item.id] || { name: item.id, glyph: "♟", width: 62, src: item.id + "-front.png" };
    var position = finalComponentPosition(item, def);
    var backgroundPoint = toBackgroundPoint(position);
    var image = document.createElement("img");
    image.className = "map-npc is-idle";
    image.src = "assets/map/test-batch/characters/villager/turnarounds/" + def.src;
    image.alt = def.name;
    image.title = def.name;
    image.draggable = false;
    image.dataset.previewTarget = "npc:" + item.id;
    image.style.left = percent(backgroundPoint.x, BACKGROUND_DIMENSIONS.width);
    image.style.top = percent(backgroundPoint.y, BACKGROUND_DIMENSIONS.height);
    image.style.zIndex = String(200 + Math.round(backgroundPoint.y));
    image.style.setProperty("--component-scale", String(number(item.scale, 1)));
    setMirror(image, bool(item.mirrorX, false), bool(item.mirrorY, false));
    if (!bool(item.visible, true)) image.classList.add("is-hidden");
    npcLayer.appendChild(image);
    componentElements.set("npc:" + item.id, image);
  }

  function syncSpriteSizes(layout, dimensions) {
    var stageScale = stage.getBoundingClientRect().width / dimensions.width;
    buildingElements.forEach(function (item) {
      item.sprite.style.width = (item.def.baseWidth * stageScale) + "px";
      item.effect.style.setProperty("--effect-x", (item.def.effect.x * stageScale) + "px");
      item.effect.style.setProperty("--effect-y", (item.def.effect.y * stageScale) + "px");
      item.effect.style.setProperty("--effect-scale", String(Math.max(.42, stageScale)));
    });
    (layout.components && layout.components.props || []).forEach(function (item) {
      var def = PROP_DEFS[item.id] || { width: 48 };
      var element = componentElements.get("prop:" + item.id);
      if (element) element.style.width = (def.width * stageScale) + "px";
    });
    (layout.components && layout.components.npcs || []).forEach(function (item) {
      var def = NPC_DEFS[item.id] || { width: 62 };
      var element = componentElements.get("npc:" + item.id);
      if (element) element.style.width = (def.width * stageScale) + "px";
    });
  }

  function mirrorLabel(item) {
    if (item.mirrorX && item.mirrorY) return "双向镜像";
    if (item.mirrorX) return "水平镜像";
    if (item.mirrorY) return "垂直镜像";
    return "正常朝向";
  }

  function focusTarget(key) {
    document.querySelectorAll("[data-preview-target]").forEach(function (element) {
      element.classList.toggle("is-preview-focus", element.dataset.previewTarget === key);
    });
    document.querySelectorAll("[data-focus-target]").forEach(function (element) {
      element.classList.toggle("is-focused", element.dataset.focusTarget === key);
    });
  }

  function updateBuildingListState(id, transform) {
    var row = buildingList.querySelector("[data-building-row='" + id + "']");
    if (!row) return;
    var current = row.querySelector("[data-role='current-stage']");
    var detail = row.querySelector("[data-role='building-detail']");
    var entry = buildingEntry(currentLayout, id);
    if (current) current.textContent = STAGE_LABELS[transform.state] + " · " + Math.round(transform.scale * 100) + "%";
    if (detail && entry) detail.textContent = "网格 " + entry.gx + " / " + entry.gy + " · " + mirrorLabel(transform) + " · X " + formatOffset(transform.offsetX) + " / Y " + formatOffset(transform.offsetY);
    row.querySelectorAll("[data-stage]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.stage) === transform.state));
    });
  }

  function renderBuildingList(layout) {
    var entries = BUILDING_DEFS.map(function (def) {
      return { def: def, entry: buildingEntry(layout, def.id) };
    }).filter(function (item) { return item.entry; });
    buildingList.innerHTML = "";
    entries.forEach(function (item, index) {
      var record = buildingElements.get(item.def.id);
      var transform = record ? record.transform : activeBuildingTransform(item.entry);
      var row = document.createElement("div");
      row.className = "preview-list-item";
      row.dataset.buildingRow = item.def.id;
      row.dataset.focusTarget = "building:" + item.def.id;
      row.innerHTML = "<span class=\"preview-list-index\">" + String(index + 1).padStart(2, "0") + "</span>" +
        "<div class=\"preview-list-main\"><button class=\"preview-list-select\" type=\"button\" data-role=\"select-building\"><span class=\"preview-list-copy\"><strong>" + escapeText(item.def.name) + "</strong><small data-role=\"building-detail\">网格 " + escapeText(item.entry.gx) + " / " + escapeText(item.entry.gy) + " · " + escapeText(mirrorLabel(transform)) + " · X " + formatOffset(transform.offsetX) + " / Y " + formatOffset(transform.offsetY) + "</small></span><span class=\"preview-list-stage\" data-role=\"current-stage\">" + STAGE_LABELS[transform.state] + " · " + Math.round(transform.scale * 100) + "%</span></button><div class=\"preview-stage-switch\" role=\"group\" aria-label=\"" + escapeText(item.def.name) + "等级预览\"></div></div>";
      var stageSwitch = row.querySelector(".preview-stage-switch");
      [0, 1, 2, 3].forEach(function (state) {
        var stageButton = document.createElement("button");
        stageButton.type = "button";
        stageButton.className = "preview-stage-button";
        stageButton.dataset.stage = String(state);
        stageButton.textContent = STAGE_LABELS[state];
        stageButton.setAttribute("aria-label", item.def.name + "预览" + STAGE_LABELS[state]);
        stageButton.setAttribute("aria-pressed", String(state === transform.state));
        stageButton.addEventListener("click", function () { updateBuildingState(item.def.id, state); });
        stageSwitch.appendChild(stageButton);
      });
      row.querySelector("[data-role='select-building']").addEventListener("click", function () { focusTarget("building:" + item.def.id); });
      buildingList.appendChild(row);
    });
    document.getElementById("buildingRange").textContent = entries.length + " / " + BUILDING_DEFS.length;
  }

  function renderComponentSummary(layout) {
    var props = layout.components && Array.isArray(layout.components.props) ? layout.components.props : [];
    var npcs = layout.components && Array.isArray(layout.components.npcs) ? layout.components.npcs : [];
    componentSummary.innerHTML = "";
    var rows = [
      { glyph: "▦", name: "场景小物", detail: props.length + " 件 · 使用导出绝对坐标", value: "PROP" },
      { glyph: "♟", name: "村民 NPC", detail: npcs.map(function (item) { return (NPC_DEFS[item.id] || { name: item.id }).name; }).join(" · "), value: "NPC" }
    ];
    rows.forEach(function (row) {
      var element = document.createElement("div");
      element.className = "component-summary-row";
      element.innerHTML = "<span>" + row.glyph + "</span><div><strong>" + row.name + "</strong><small>" + escapeText(row.detail) + "</small></div><output>" + row.value + "</output>";
      componentSummary.appendChild(element);
    });
    document.getElementById("componentRange").textContent = (props.length + npcs.length) + " 个";
  }

  function renderMeta(layout, dimensions) {
    var projection = layout.projection || {};
    var layers = layout.sceneLayers || {};
    var enabledLayers = ["water", "props", "npcs", "effects"].filter(function (key) { return layers[key] !== false; });
    document.getElementById("layoutBadge").textContent = "JSON v" + escapeText(layout.version || 4) + " · 已导入";
    document.getElementById("projectionType").textContent = "2.5D 菱形正交";
    document.getElementById("mapSize").textContent = BACKGROUND_DIMENSIONS.width + " × " + BACKGROUND_DIMENSIONS.height + " · 完整背景";
    document.getElementById("backgroundName").textContent = BACKGROUND_OVERRIDE.split("/").pop() + " · 不裁切";
    document.getElementById("layerSummary").textContent = enabledLayers.length + " / 4 图层启用";
    document.getElementById("projectionReadout").textContent = "背景 " + BACKGROUND_DIMENSIONS.width + " × " + BACKGROUND_DIMENSIONS.height + " · 逻辑坐标 " + dimensions.width + " × " + dimensions.height + " · Y 偏移 " + WORLD_OFFSET.y;
    document.getElementById("buildingCount").textContent = (layout.buildings || []).filter(function (item) { return item.visible !== false; }).length;
    document.getElementById("propCount").textContent = (layout.components && layout.components.props || []).filter(function (item) { return item.visible !== false; }).length;
    document.getElementById("npcCount").textContent = (layout.components && layout.components.npcs || []).filter(function (item) { return item.visible !== false; }).length;
  }

  function applySceneLayers(layout) {
    var layers = layout.sceneLayers || {};
    riverEffects.classList.toggle("is-hidden", layers.water === false);
    propLayer.classList.toggle("is-hidden", layers.props === false);
    npcLayer.classList.toggle("is-hidden", layers.npcs === false);
    stage.classList.toggle("effects-disabled", layers.effects === false);
  }

  function render(layout) {
    currentLayout = layout;
    var dimensions = layoutSize(layout);
    currentLayoutDimensions = dimensions;
    stage.style.aspectRatio = BACKGROUND_DIMENSIONS.width + " / " + BACKGROUND_DIMENSIONS.height;
    backgroundExtension.style.aspectRatio = BACKGROUND_DIMENSIONS.width + " / " + BACKGROUND_DIMENSIONS.height;
    mapCanvas.style.left = "0%";
    mapCanvas.style.top = "0%";
    mapCanvas.style.width = "100%";
    mapCanvas.style.height = "100%";
    background.style.display = "none";
    background.src = BACKGROUND_OVERRIDE;
    backgroundExtension.src = BACKGROUND_OVERRIDE;
    backgroundExtension.onerror = function () {
      if (backgroundExtension.src.indexOf(FALLBACK_BACKGROUND) === -1) backgroundExtension.src = FALLBACK_BACKGROUND;
    };

    BUILDING_DEFS.forEach(function (def, index) { createBuilding(layout, def, index, dimensions); });
    (layout.components && layout.components.props || []).forEach(function (item) { createProp(layout, item, dimensions); });
    (layout.components && layout.components.npcs || []).forEach(function (item) { createNpc(layout, item, dimensions); });
    applySceneLayers(layout);
    renderMeta(layout, dimensions);
    renderBuildingList(layout);
    renderComponentSummary(layout);
    syncSpriteSizes(layout, dimensions);
    if (window.ResizeObserver) {
      new ResizeObserver(function () { syncSpriteSizes(layout, dimensions); }).observe(stage);
    } else {
      window.addEventListener("resize", function () { syncSpriteSizes(layout, dimensions); });
    }
    loadStatus.textContent = "已读取";
    layoutBadge.classList.add("is-loaded");
  }

  function showError(error) {
    var message = error && error.message ? error.message : String(error);
    loadStatus.textContent = "读取失败";
    loadStatus.classList.add("is-error");
    layoutBadge.textContent = "加载失败";
    previewError.hidden = false;
    previewErrorMessage.textContent = message;
  }

  fetch(LAYOUT_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status + " · " + LAYOUT_URL);
      return response.json();
    })
    .then(render)
    .catch(showError);
}());

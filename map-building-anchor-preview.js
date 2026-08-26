(function () {
  "use strict";

  var LAYOUT_URL = "assets/map/layouts/forestry-building-anchors-v4.json?v=2";
  var FALLBACK_BACKGROUND = "assets/map/test-batch/base/valley-forest-background-v2.png";
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
    { id: "arbor", name: "林木培育场", baseWidth: 220, anchorY: "-94%", stages: generatedStages("arbor") },
    { id: "station", name: "中央工作站", baseWidth: 245, anchorY: "-93%", stages: generatedStages("station") },
    { id: "archive", name: "生态档案馆", baseWidth: 250, anchorY: "-93%", stages: generatedStages("archive") },
    { id: "apiary", name: "古树蜂场", baseWidth: 300, anchorY: "-93%", stages: [
      "assets/map/test-batch/buildings/apiary/apiary-site-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv1-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv2-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv3-summer-test-v3.png"
    ] },
    { id: "processing", name: "加工工坊", baseWidth: 330, anchorY: "-94%", stages: generatedStages("processing") },
    { id: "market", name: "村民商店", baseWidth: 285, anchorY: "-93%", stages: generatedStages("market") },
    { id: "warehouse", name: "仓库能源站", baseWidth: 340, anchorY: "-91%", stages: generatedStages("warehouse") }
  ];

  var stage = document.getElementById("mapStage");
  var background = document.getElementById("mapBackground");
  var grid = document.getElementById("projectionGrid");
  var buildingLayer = document.getElementById("buildingLayer");
  var buildingList = document.getElementById("buildingList");
  var buildingElements = new Map();
  var currentLayout = null;
  var display = { width: 1058, height: 1487, scale: 1058 / 1667, offsetX: 0, offsetY: 680 };
  var selectedId = BUILDING_DEFS[0].id;

  function number(value, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clampState(value) {
    return Math.max(0, Math.min(3, Math.round(number(value, 1))));
  }

  function formatNumber(value) {
    var rounded = Math.round(number(value, 0) * 10) / 10;
    return rounded > 0 ? "+" + rounded : String(rounded);
  }

  function buildingEntry(id) {
    return (currentLayout.buildings || []).find(function (item) { return item.building === id; }) || null;
  }

  function buildingDef(id) {
    return BUILDING_DEFS.find(function (item) { return item.id === id; }) || null;
  }

  function project(gx, gy) {
    var projection = currentLayout.projection || {};
    var origin = projection.origin || [833.5, 28];
    var tile = projection.tileHalfSize || [34, 18];
    return {
      x: number(origin[0], 833.5) + (number(gx, 0) - number(gy, 0)) * number(tile[0], 34),
      y: number(origin[1], 28) + (number(gx, 0) + number(gy, 0)) * number(tile[1], 18)
    };
  }

  function backgroundPoint(point) {
    return { x: display.offsetX + point.x * display.scale, y: display.offsetY + point.y * display.scale };
  }

  function variantFor(entry, state) {
    var targetState = clampState(state === undefined ? entry.state : state);
    var source = (entry.variants || []).find(function (item) { return clampState(item.state) === targetState; }) || entry;
    return {
      state: targetState,
      offsetX: number(source.offsetX, number(entry.offsetX, 0)),
      offsetY: number(source.offsetY, number(entry.offsetY, 0)),
      scale: number(source.scale, number(entry.scale, 1)),
      mirrorX: Boolean(source.mirrorX),
      mirrorY: Boolean(source.mirrorY)
    };
  }

  function setMirror(element, transform) {
    element.style.setProperty("--mirror-x", transform.mirrorX ? "-1" : "1");
    element.style.setProperty("--mirror-y", transform.mirrorY ? "-1" : "1");
  }

  function applyBuildingState(id, state) {
    var record = buildingElements.get(id);
    if (!record) return;
    var transform = variantFor(record.entry, state);
    var projected = project(record.entry.gx, record.entry.gy);
    var anchor = backgroundPoint({ x: projected.x + transform.offsetX, y: projected.y + transform.offsetY });
    record.transform = transform;
    record.projected = projected;
    record.anchorPoint = anchor;
    record.anchor.dataset.state = String(transform.state);
    record.anchor.dataset.label = record.def.name + " · " + STAGE_LABELS[transform.state];
    record.anchor.style.left = anchor.x / display.width * 100 + "%";
    record.anchor.style.top = anchor.y / display.height * 100 + "%";
    record.anchor.style.zIndex = String(100 + Math.round(anchor.y));
    record.sprite.src = record.def.stages[transform.state];
    record.sprite.style.setProperty("--building-scale", String(transform.scale));
    setMirror(record.sprite, transform);
    updateListRow(id);
    if (selectedId === id) updateSelectedReadout();
  }

  function createBuilding(def, entry) {
    var anchor = document.createElement("div");
    anchor.className = "building-anchor";
    anchor.dataset.building = def.id;
    var sprite = document.createElement("img");
    sprite.className = "building-sprite";
    sprite.alt = "";
    sprite.draggable = false;
    sprite.style.setProperty("--anchor-y", def.anchorY);
    var marker = document.createElement("span");
    marker.className = "anchor-marker";
    marker.setAttribute("aria-hidden", "true");
    anchor.appendChild(sprite);
    anchor.appendChild(marker);
    buildingLayer.appendChild(anchor);
    buildingElements.set(def.id, { def: def, entry: entry, anchor: anchor, sprite: sprite, marker: marker, transform: null, projected: null, anchorPoint: null });
    applyBuildingState(def.id, entry.state);
  }

  function mirrorLabel(transform) {
    if (transform.mirrorX && transform.mirrorY) return "双向镜像";
    if (transform.mirrorX) return "水平镜像";
    if (transform.mirrorY) return "垂直镜像";
    return "正常朝向";
  }

  function updateListRow(id) {
    var record = buildingElements.get(id);
    var row = buildingList.querySelector("[data-building-row='" + id + "']");
    if (!record || !row) return;
    row.querySelector("[data-role='building-detail']").textContent = "锚点 X " + Math.round(record.anchorPoint.x) + " / Y " + Math.round(record.anchorPoint.y) + " · 偏移 " + formatNumber(record.transform.offsetX) + " / " + formatNumber(record.transform.offsetY);
    row.querySelector("[data-role='current-stage']").textContent = STAGE_LABELS[record.transform.state] + " · " + Math.round(record.transform.scale * 100) + "%";
    row.querySelectorAll("[data-stage]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.stage) === record.transform.state));
    });
  }

  function renderList() {
    buildingList.innerHTML = "";
    BUILDING_DEFS.forEach(function (def, index) {
      var entry = buildingEntry(def.id);
      if (!entry) return;
      var row = document.createElement("div");
      row.className = "preview-list-item";
      row.dataset.buildingRow = def.id;
      row.innerHTML = "<span class=\"preview-list-index\">" + String(index + 1).padStart(2, "0") + "</span>" +
        "<div class=\"preview-list-main\"><button class=\"preview-list-select\" type=\"button\"><span class=\"preview-list-copy\"><strong>" + def.name + "</strong><small data-role=\"building-detail\">读取锚点</small></span><span class=\"preview-list-stage\" data-role=\"current-stage\">—</span></button><div class=\"preview-stage-switch\"></div></div>";
      row.querySelector(".preview-list-select").addEventListener("click", function () { selectBuilding(def.id); });
      var stageSwitch = row.querySelector(".preview-stage-switch");
      [0, 1, 2, 3].forEach(function (state) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "preview-stage-button";
        button.dataset.stage = String(state);
        button.textContent = STAGE_LABELS[state];
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", function () {
          applyBuildingState(def.id, state);
          selectBuilding(def.id);
          setGlobalSelection(null);
        });
        stageSwitch.appendChild(button);
      });
      buildingList.appendChild(row);
    });
    buildingElements.forEach(function (_, id) { updateListRow(id); });
  }

  function updateSelectedReadout() {
    var record = buildingElements.get(selectedId);
    if (!record) return;
    document.getElementById("selectedName").textContent = record.def.name;
    document.getElementById("selectedStage").textContent = STAGE_LABELS[record.transform.state];
    document.getElementById("selectedGrid").textContent = record.entry.gx + " / " + record.entry.gy;
    document.getElementById("selectedProjected").textContent = Math.round(record.projected.x) + " / " + Math.round(record.projected.y);
    document.getElementById("selectedOffset").textContent = formatNumber(record.transform.offsetX) + " / " + formatNumber(record.transform.offsetY);
    document.getElementById("selectedAnchor").textContent = Math.round(record.anchorPoint.x) + " / " + Math.round(record.anchorPoint.y);
    document.getElementById("selectedTransform").textContent = Math.round(record.transform.scale * 100) + "% · " + mirrorLabel(record.transform);
  }

  function selectBuilding(id) {
    selectedId = id;
    buildingElements.forEach(function (record, buildingId) { record.anchor.classList.toggle("is-focused", buildingId === id); });
    buildingList.querySelectorAll("[data-building-row]").forEach(function (row) { row.classList.toggle("is-focused", row.dataset.buildingRow === id); });
    updateSelectedReadout();
  }

  function setGlobalSelection(value) {
    document.querySelectorAll("[data-global-stage]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(value !== null && button.dataset.globalStage === String(value)));
    });
  }

  function applyGlobalState(value) {
    BUILDING_DEFS.forEach(function (def) {
      var entry = buildingEntry(def.id);
      if (entry) applyBuildingState(def.id, value === "layout" ? entry.state : Number(value));
    });
    setGlobalSelection(value);
  }

  function renderGrid() {
    var projection = currentLayout.projection || {};
    var range = projection.gridRange || [-14, 39];
    grid.setAttribute("viewBox", "0 0 " + display.width + " " + display.height);
    grid.innerHTML = "";
    function addLine(a, b, major) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
      if (major) line.classList.add("is-major");
      grid.appendChild(line);
    }
    for (var g = range[0]; g <= range[1]; g += 1) {
      addLine(backgroundPoint(project(g, range[0])), backgroundPoint(project(g, range[1])), g % 5 === 0);
      addLine(backgroundPoint(project(range[0], g)), backgroundPoint(project(range[1], g)), g % 5 === 0);
    }
  }

  function syncSpriteSizes() {
    var logicalWidth = number(currentLayout.projection && currentLayout.projection.mapSize && currentLayout.projection.mapSize[0], 1667);
    var scale = stage.getBoundingClientRect().width / logicalWidth;
    buildingElements.forEach(function (record) { record.sprite.style.width = record.def.baseWidth * scale + "px"; });
  }

  function configureDisplay(layout) {
    var backgroundDisplay = layout.backgroundDisplay || {};
    var size = backgroundDisplay.mapSize || [1058, 1487];
    var offset = backgroundDisplay.coordinateOffset || [0, 680];
    display.width = number(size[0], 1058);
    display.height = number(size[1], 1487);
    display.scale = number(backgroundDisplay.coordinateScale, display.width / 1667);
    display.offsetX = number(offset[0], 0);
    display.offsetY = number(offset[1], 680);
    stage.style.aspectRatio = display.width + " / " + display.height;
  }

  function render(layout) {
    currentLayout = layout;
    configureDisplay(layout);
    background.src = layout.background || FALLBACK_BACKGROUND;
    background.onerror = function () { if (background.src.indexOf(FALLBACK_BACKGROUND) === -1) background.src = FALLBACK_BACKGROUND; };
    renderGrid();
    BUILDING_DEFS.forEach(function (def) {
      var entry = buildingEntry(def.id);
      if (entry) createBuilding(def, entry);
    });
    renderList();
    selectBuilding(selectedId);
    setGlobalSelection("layout");
    syncSpriteSizes();
    if (window.ResizeObserver) new ResizeObserver(syncSpriteSizes).observe(stage);
    else window.addEventListener("resize", syncSpriteSizes);

    var variantCount = (layout.buildings || []).reduce(function (total, item) { return total + (item.variants || []).length; }, 0);
    document.getElementById("buildingCount").textContent = (layout.buildings || []).length + " 栋";
    document.getElementById("variantCount").textContent = variantCount + " 组";
    document.getElementById("backgroundSize").textContent = display.width + " × " + display.height;
    document.getElementById("coordinateOffset").textContent = display.offsetX + " / " + display.offsetY;
    document.getElementById("buildingRange").textContent = (layout.buildings || []).length + " / " + BUILDING_DEFS.length;
    document.getElementById("projectionReadout").textContent = "逻辑 1667 × 943 · 背景 " + display.width + " × " + display.height + " · 缩放 " + display.scale.toFixed(6);
    document.getElementById("loadStatus").textContent = "已提取";
    document.getElementById("layoutBadge").textContent = "7 栋 · " + variantCount + " 锚点";
  }

  function showError(error) {
    document.getElementById("loadStatus").textContent = "读取失败";
    document.getElementById("loadStatus").classList.add("is-error");
    document.getElementById("layoutBadge").textContent = "加载失败";
    document.getElementById("previewError").hidden = false;
    document.getElementById("previewErrorMessage").textContent = error && error.message || String(error);
  }

  document.querySelectorAll("[data-global-stage]").forEach(function (button) {
    button.addEventListener("click", function () { applyGlobalState(button.dataset.globalStage); });
  });
  document.getElementById("toggleAnchors").addEventListener("click", function () {
    var hidden = stage.classList.toggle("anchors-hidden");
    this.classList.toggle("is-active", !hidden);
    this.setAttribute("aria-pressed", String(!hidden));
  });
  document.getElementById("toggleGrid").addEventListener("click", function () {
    var visible = grid.classList.toggle("is-visible");
    this.classList.toggle("is-active", visible);
    this.setAttribute("aria-pressed", String(visible));
  });

  fetch(LAYOUT_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status + " · " + LAYOUT_URL);
      return response.json();
    })
    .then(render)
    .catch(showError);
}());

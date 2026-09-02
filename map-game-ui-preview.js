(function () {
  "use strict";

  var LAYOUT_URL = "assets/map/layouts/forestry-building-anchors-v4.json";
  var BACKGROUND_WIDTH = 1058;
  var BACKGROUND_HEIGHT = 1487;
  var STAGE_LABELS = ["未建设", "LV1", "LV2", "LV3"];
  var cameraScale = 1;
  var cameraPan = { x: 0, y: 0 };
  var dragState = { active: false, moved: false, pointerId: null, startX: 0, startY: 0, originX: 0, originY: 0 };
  var suppressBuildingClickUntil = 0;
  var toastTimer = null;

  function generatedStages(type) {
    var root = "assets/map/test-batch/buildings/" + type + "/" + type;
    return [
      root + "-site-summer-generated-v1.png",
      root + "-lv1-summer-generated-v1.png",
      root + "-lv2-summer-generated-v1.png",
      root + "-lv3-summer-generated-v1.png"
    ];
  }

  // Static labels / zone catalog for the map shell. Live resources and loops come
  // from window.ForestryGame (app.js map-preview runtime).
  var ACTUAL_CONTENT = {
    rank: "R1 · 林地学徒",
    brand: "林业谷地 · R1",
    title: "FORESTRY LAB",
    resources: {
      emerald: 12,
      energy: 60,
      energyMax: 100,
      honey: 24,
      wax: 10,
      wood: 32,
      oil: 6,
      wildflower: 3,
      regularTotal: 66,
      regularCapacity: 999
    },
    species: { bees: 2, beeTotal: 11, trees: 2, treeTotal: 14, butterflies: 1, butterflyTotal: 6 },
    guide: { completed: 0, total: 14 },
    zones: [
      { id: "forest", name: "森林边缘", difficulty: 1, manual: 8, auto: 11, duration: 30, discovery: 62, icon: "♣", unlocked: true, desc: "木材、野花、基础蜂巢与树苗线索" },
      { id: "plains", name: "平原花地", difficulty: 1, manual: 9, auto: 12, duration: 35, discovery: 18, icon: "✿", unlocked: false, desc: "三叶草、蜂巢、种子与蝴蝶线索" },
      { id: "swamp", name: "静谧沼泽", difficulty: 2, manual: 12, auto: 16, duration: 45, discovery: 0, icon: "≈", unlocked: false, desc: "湿地花源、树脂、丛林树苗与蜂种线索" },
      { id: "desert", name: "荒芜沙丘", difficulty: 2, manual: 13, auto: 18, duration: 50, discovery: 0, icon: "♨", unlocked: false, desc: "旱地花源、种子油与干燥蜂巢" },
      { id: "tropic", name: "热带林冠", difficulty: 3, manual: 15, auto: 20, duration: 55, discovery: 0, icon: "♨", unlocked: false, desc: "热带花、树脂、稀有蜂巢与柚木线索" },
      { id: "snow", name: "寒带针叶林", difficulty: 3, manual: 16, auto: 22, duration: 60, discovery: 0, icon: "❄", unlocked: false, desc: "高产木材、树脂与耐寒树种线索" },
      { id: "cave", name: "荧光菌洞", difficulty: 4, manual: 19, auto: 25, duration: 70, discovery: 0, icon: "◈", unlocked: false, desc: "菌类花源、树脂、种子与蝶种线索" },
      { id: "end", name: "末地边境", difficulty: 5, manual: 24, auto: 32, duration: 90, discovery: 0, icon: "✦", unlocked: false, desc: "异域花源、神秘蜂巢与稀有物种线索" }
    ],
    shop: [
      { name: "野花补给 ×8", note: "稳定基础花源", price: 1, icon: "✿" },
      { name: "通用木材 ×6", note: "基础建设材料", price: 1, icon: "▰" },
      { name: "蜂蜜 ×2", note: "离心分离产物", price: 1, icon: "⬢" },
      { name: "蜂蜡 ×3", note: "框架与加工耗材", price: 1, icon: "▣" },
      { name: "能源补给箱 +20", note: "立即恢复能源", price: 5, icon: "ϟ" },
      { name: "三叶草 ×5", note: "产速 +15%", price: 1, icon: "✤" },
      { name: "热带花源 ×3", note: "产速 +25%", price: 1, icon: "✿" },
      { name: "种子油 ×1", note: "榨汁机产物", price: 2, icon: "≈" }
    ],
    contracts: [
      { id: "01", name: "林地调查补给", need: "蜂蜜脾 1 · 木材 5", reward: "种子油 2 · 能源 10 · 绿宝石 6", status: "教程后开放" },
      { id: "02", name: "初建蜂房", need: "野花 2 · 蜂蜜脾 1", reward: "木材 8 · 能源 12", status: "等待前置" },
      { id: "03", name: "蜂蜡框架", need: "蜂蜜 2 · 蜂蜡 2", reward: "木材 8 · 能源 15 · 绿宝石 10", status: "等待前置" }
    ],
    energyCore: { level: 1, capacity: 100, recovery: 6, nextCapacity: 125, cost: "木材 18 · 蜂蜡 4 · 种子油 2" },
    upgrades: {
      apiary: { level: 1, next: "LV2", cost: "蜂蜜 20 · 蜂蜡 8 · 木材 15" },
      arbor: { level: 1, next: "LV2", cost: "木材 25 · 种子油 4" },
      processing: { level: 1, next: "LV2", cost: "蜂蜜 18 · 蜂蜡 6 · 种子油 3" },
      warehouse: { level: 1, next: "LV2", cost: "绿宝石 40 · 木材 128 · 蜂蜡 24 · 种子油 8" }
    }
  };

  var MAP_UPGRADE_TARGET = {
    apiary: "apiary",
    arbor: "treeFarm",
    processing: "centrifuge",
    warehouse: "warehouse",
    energyCore: "energyCore"
  };

  var pendingConfirmAction = null;
  var pendingConfirmAutoAction = null;
  var gameApi = null;
  var mapState = null;

  function ensureGameApi() {
    gameApi = window.ForestryGame || null;
    if (!gameApi) throw new Error("ForestryGame API missing — load app.js in map preview mode first.");
    return gameApi;
  }

  function syncMapStateFromGame() {
    var api = ensureGameApi();
    var snap = api.getSnapshot();
    mapState = snap;
    // Keep ACTUAL_CONTENT energy/upgrade labels in sync for workspace templates.
    ACTUAL_CONTENT.resources.emerald = snap.resources.emerald;
    ACTUAL_CONTENT.resources.energy = snap.energy;
    ACTUAL_CONTENT.resources.energyMax = snap.energyCapacity;
    ACTUAL_CONTENT.resources.honey = snap.resources.honey;
    ACTUAL_CONTENT.resources.wax = snap.resources.wax;
    ACTUAL_CONTENT.resources.wood = snap.resources.wood;
    ACTUAL_CONTENT.resources.oil = snap.resources.oil;
    ACTUAL_CONTENT.resources.wildflower = snap.flowers.wildflower || 0;
    ACTUAL_CONTENT.resources.regularTotal = snap.regularTotal;
    ACTUAL_CONTENT.resources.regularCapacity = snap.regularCapacity;
    ACTUAL_CONTENT.species.bees = snap.species.bees.length;
    ACTUAL_CONTENT.species.trees = snap.species.trees.length;
    ACTUAL_CONTENT.species.butterflies = snap.species.butterflies.length;
    ACTUAL_CONTENT.guide.completed = snap.guideStep;
    ACTUAL_CONTENT.guide.total = snap.guideTotal;
    ACTUAL_CONTENT.energyCore.level = snap.levels.energyCore;
    ACTUAL_CONTENT.energyCore.capacity = snap.energyCapacity;
    ACTUAL_CONTENT.energyCore.recovery = snap.energyRecovery;
    var nextCore = (api.energyCoreLevels || [])[snap.levels.energyCore];
    if (nextCore) {
      ACTUAL_CONTENT.energyCore.nextCapacity = nextCore.capacity;
      ACTUAL_CONTENT.energyCore.cost = api.formatCost(nextCore.cost || {});
    }
    ["apiary", "arbor", "processing", "warehouse"].forEach(function (key) {
      var level = snap.levels[key] || 1;
      var upgradeKey = MAP_UPGRADE_TARGET[key];
      var data = api.upgradeData[upgradeKey];
      var cost = api.getUpgradeCost(upgradeKey);
      ACTUAL_CONTENT.upgrades[key] = {
        level: level,
        next: cost ? ("LV" + (level + 1)) : "MAX",
        cost: cost ? api.formatCost(cost) : "已满级"
      };
    });
    ACTUAL_CONTENT.zones.forEach(function (zone) {
      zone.unlocked = Boolean(snap.zoneUnlocked[zone.id]);
      var real = api.zones[zone.id];
      if (real) {
        zone.manual = real.manualEnergy;
        zone.auto = real.autoEnergy;
        zone.duration = real.autoDuration;
        zone.discovery = real.discoveryBase;
        zone.desc = real.desc;
      }
    });
    ACTUAL_CONTENT.shop = (api.shopBuyOffers || []).slice(0, 8).map(function (offer) {
      return {
        id: offer.id,
        name: offer.name + (offer.output ? (" ×" + Object.values(offer.output)[0]) : ""),
        note: "绿宝石 " + offer.price,
        price: offer.price,
        icon: offer.icon || "◆"
      };
    });
    return mapState;
  }

  function saveMapState() {
    try { ensureGameApi().actions.saveNow(); } catch (error) {}
  }


  var BUILDINGS = [
    { id: "arbor", name: "树场 T-01", category: "ecology", categoryLabel: "ARBORETUM", baseWidth: 220, anchorY: "-94%", icon: "♣", state: "生长中", badge: "", badgeClass: "is-running", summary: "橡树苗正在树场中生长，基础木材链已准备。", output: "木材 8 · 树苗 0", progress: 64, primary: "进入树场 →", secondary: "查看环境", stages: generatedStages("arbor") },
    { id: "station", name: "中央工作站", category: "task", categoryLabel: "WORKSTATION", baseWidth: 245, anchorY: "-93%", icon: "⌂", state: "待命", badge: "", badgeClass: "", summary: "完成第一次调查后，将从这里接取生态委托。", output: "主线委托 0 / 15", progress: 0, primary: "查看委托 →", secondary: "查看目标", stages: generatedStages("station") },
    { id: "archive", name: "生态档案", category: "task", categoryLabel: "ECOLOGY ARCHIVE", baseWidth: 250, anchorY: "-93%", icon: "▤", state: "初始记录", badge: "", badgeClass: "", summary: "基础蜂、树与蝶种已建立记录，后续可通过调查和杂交扩展。", output: "蜂 2 / 11 · 树 2 / 14 · 蝶 1 / 6", progress: 16, primary: "打开档案 →", secondary: "查看谱系", stages: generatedStages("archive") },
    { id: "apiary", name: "养蜂箱 A-01", category: "ecology", categoryLabel: "APICULTURE", baseWidth: 300, anchorY: "-93%", icon: "⬢", state: "生产中", badge: "", badgeClass: "is-running", summary: "森林蜂 × 草原蜂正在使用野花花源生产蜂蜜脾。", output: "蜂蜜脾 1 · 进度 72%", progress: 72, primary: "进入蜂箱 →", secondary: "查看环境", stages: [
      "assets/map/test-batch/buildings/apiary/apiary-site-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv1-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv2-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv3-summer-test-v3.png"
    ] },
    { id: "processing", name: "加工工坊", category: "production", categoryLabel: "PROCESSING", baseWidth: 330, anchorY: "-94%", icon: "⚙", state: "离心机待命", badge: "", badgeClass: "", summary: "离心机 C-01 已建成，其余加工设备将随教程和委托逐步解锁。", output: "离心机 1 / 4 · 待命", progress: 0, primary: "查看加工 →", secondary: "查看配方", stages: generatedStages("processing") },
    { id: "market", name: "村民商店", category: "production", categoryLabel: "VILLAGER MARKET", baseWidth: 285, anchorY: "-93%", icon: "◆", state: "新人货架", badge: "", badgeClass: "", summary: "村民提供基础花源、木材、蜂蜜和蜂蜡，绿宝石余额为 12。", output: "野花 ×8 · 售价 1 ◆", progress: 100, primary: "进入商店 →", secondary: "今日价格", stages: generatedStages("market") },
    { id: "warehouse", name: "分类仓库 R-01", category: "production", categoryLabel: "STORAGE & POWER", baseWidth: 340, anchorY: "-91%", icon: "ϟ", state: "能源恢复", badge: "", badgeClass: "is-running", summary: "能源核心 LV1 正在恢复，仓库容量按物资类别分别计算。", output: "常规 66 / 999 · 能源 60%", progress: 60, primary: "管理仓库 →", secondary: "能源升级", stages: generatedStages("warehouse") }
  ];

  var mapViewport = document.getElementById("mapViewport");
  var mapCamera = document.getElementById("mapCamera");
  var buildingLayer = document.getElementById("buildingLayer");
  var quickCard = document.getElementById("buildingQuickCard");
  var buildingElements = new Map();
  var selectedBuildingId = "apiary";
  var layout = null;
  var workspaceState = { type: null, id: null, tab: null };
  var pendingConfirmMessage = "";

  function number(value, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function project(projection, gx, gy) {
    var origin = projection.origin || [833.5, 28];
    var tile = projection.tileHalfSize || [34, 18];
    return {
      x: number(origin[0], 833.5) + (number(gx, 0) - number(gy, 0)) * number(tile[0], 34),
      y: number(origin[1], 28) + (number(gx, 0) + number(gy, 0)) * number(tile[1], 18)
    };
  }

  function activeVariant(entry) {
    var state = Math.max(0, Math.min(3, Math.round(number(entry.state, 1))));
    var variant = (entry.variants || []).find(function (item) { return Number(item.state) === state; }) || entry;
    return {
      state: state,
      offsetX: number(variant.offsetX, 0),
      offsetY: number(variant.offsetY, 0),
      scale: number(variant.scale, 1),
      mirrorX: Boolean(variant.mirrorX),
      mirrorY: Boolean(variant.mirrorY)
    };
  }

  function buildAlphaMask(image) {
    if (!image.naturalWidth || !image.naturalHeight) return null;
    try {
      var canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      var context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      return { width: canvas.width, height: canvas.height, pixels: context.getImageData(0, 0, canvas.width, canvas.height).data };
    } catch (error) {
      return null;
    }
  }

  function hitUsesOpaquePixel(record, event) {
    var mask = record.alphaMask;
    if (!mask) return true;
    var rect = record.hit.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    var x = Math.max(0, Math.min(0.9999, (event.clientX - rect.left) / rect.width));
    var y = Math.max(0, Math.min(0.9999, (event.clientY - rect.top) / rect.height));
    if (record.mirrorX) x = 1 - x;
    if (record.mirrorY) y = 1 - y;
    var pixelX = Math.floor(x * mask.width);
    var pixelY = Math.floor(y * mask.height);
    return mask.pixels[(pixelY * mask.width + pixelX) * 4 + 3] >= 24;
  }

  function createBuilding(def, entry) {
    var transform = activeVariant(entry);
    var display = layout.backgroundDisplay || {};
    var coordinateScale = number(display.coordinateScale, BACKGROUND_WIDTH / 1667);
    var coordinateOffset = display.coordinateOffset || [0, 680];
    var point = project(layout.projection || {}, entry.gx, entry.gy);
    var x = number(coordinateOffset[0], 0) + (point.x + transform.offsetX) * coordinateScale;
    var y = number(coordinateOffset[1], 680) + (point.y + transform.offsetY) * coordinateScale;

    var anchor = document.createElement("div");
    anchor.className = "building-anchor";
    anchor.dataset.building = def.id;
    anchor.dataset.category = def.category;
    anchor.style.left = x / BACKGROUND_WIDTH * 100 + "%";
    anchor.style.top = y / BACKGROUND_HEIGHT * 100 + "%";
    anchor.style.zIndex = String(100 + Math.round(y));

    var sprite = document.createElement("img");
    sprite.className = "building-sprite";
    sprite.src = def.stages[transform.state];
    sprite.alt = "";
    sprite.draggable = false;
    sprite.style.setProperty("--anchor-y", def.anchorY);
    sprite.style.setProperty("--building-scale", String(transform.scale));
    sprite.style.setProperty("--mirror-x", transform.mirrorX ? "-1" : "1");
    sprite.style.setProperty("--mirror-y", transform.mirrorY ? "-1" : "1");

    var hit = document.createElement("button");
    hit.type = "button";
    hit.className = "building-hit";
    hit.textContent = def.name;
    hit.style.setProperty("--anchor-y", def.anchorY);
    hit.style.setProperty("--mirror-x", transform.mirrorX ? "-1" : "1");
    hit.style.setProperty("--mirror-y", transform.mirrorY ? "-1" : "1");
    hit.style.setProperty("--building-scale", String(transform.scale));
    hit.setAttribute("aria-label", "选择" + def.name + "，" + STAGE_LABELS[transform.state] + "，" + def.state);
    hit.addEventListener("click", function (event) {
      if (Date.now() < suppressBuildingClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      var record = buildingElements.get(def.id);
      if (record && !hitUsesOpaquePixel(record, event)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      selectBuilding(def.id, true);
    });

    var label = document.createElement("span");
    label.className = "building-label";
    label.textContent = def.name + " · " + def.state;

    var badge = document.createElement("span");
    badge.className = "building-badge " + def.badgeClass;
    badge.textContent = def.badge;

    anchor.appendChild(sprite);
    anchor.appendChild(hit);
    anchor.appendChild(label);
    anchor.appendChild(badge);
    buildingLayer.appendChild(anchor);
    var record = { anchor: anchor, sprite: sprite, hit: hit, def: def, alphaMask: null, mirrorX: transform.mirrorX, mirrorY: transform.mirrorY };
    buildingElements.set(def.id, record);
    sprite.addEventListener("load", function () {
      record.alphaMask = buildAlphaMask(sprite);
      syncSpriteSizes();
    });
    if (sprite.complete && sprite.naturalWidth) {
      record.alphaMask = buildAlphaMask(sprite);
    }
  }

  function syncSpriteSizes() {
    var width = mapCamera.getBoundingClientRect().width;
    var logicalScale = width / 1667;
    buildingElements.forEach(function (record) {
      var spriteWidth = record.def.baseWidth * logicalScale;
      var ratio = record.sprite.naturalWidth && record.sprite.naturalHeight ? record.sprite.naturalHeight / record.sprite.naturalWidth : .6;
      record.sprite.style.width = spriteWidth + "px";
      record.hit.style.width = spriteWidth + "px";
      record.hit.style.height = spriteWidth * ratio + "px";
    });
  }

  function selectBuilding(id, announce) {
    var record = buildingElements.get(id);
    if (!record) return;
    selectedBuildingId = id;
    buildingElements.forEach(function (item, itemId) { item.anchor.classList.toggle("is-selected", itemId === id); });
    var def = record.def;
    document.getElementById("quickIcon").textContent = def.icon;
    document.getElementById("quickCategory").textContent = def.categoryLabel;
    document.getElementById("quickName").textContent = def.name;
    document.getElementById("quickState").textContent = def.state;
    document.getElementById("quickSummary").textContent = def.summary;
    document.getElementById("quickOutput").textContent = def.output;
    document.getElementById("quickProgress").textContent = def.progress + "%";
    document.getElementById("quickProgressBar").style.width = def.progress + "%";
    document.getElementById("quickPrimary").textContent = def.primary;
    document.getElementById("quickSecondary").textContent = def.secondary;
    quickCard.classList.remove("is-hidden");
    if (announce) showToast("已定位：" + def.name);
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  function setActiveNav(name) {
    document.querySelectorAll("[data-nav]").forEach(function (item) {
      item.classList.toggle("is-active", item.dataset.nav === name);
    });
  }

  function updateScrim() {
    var drawerOpen = document.getElementById("systemDrawer").classList.contains("is-open");
    var workspaceOpen = document.getElementById("deepWorkspace").classList.contains("is-open");
    var confirmOpen = document.getElementById("confirmModal").classList.contains("is-open");
    document.getElementById("uiScrim").hidden = !(drawerOpen || workspaceOpen || confirmOpen);
  }

  function openSystemDrawer() {
    closeWorkspace(false);
    setActiveNav("more");
    document.getElementById("systemDrawer").classList.add("is-open");
    document.getElementById("systemDrawer").setAttribute("aria-hidden", "false");
    updateScrim();
  }

  function closeSystemDrawer() {
    document.getElementById("systemDrawer").classList.remove("is-open");
    document.getElementById("systemDrawer").setAttribute("aria-hidden", "true");
    setActiveNav("map");
    updateScrim();
  }

  function applyFilter(filter) {
    buildingElements.forEach(function (record) {
      var show = filter === "all" || record.def.category === filter;
      record.anchor.classList.toggle("is-dimmed", !show);
    });
    document.querySelectorAll("[data-filter]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
  }

  function cameraBounds() {
    var viewportRect = mapViewport.getBoundingClientRect();
    var baseWidth = mapCamera.offsetWidth * cameraScale;
    var baseHeight = mapCamera.offsetHeight * cameraScale;
    return {
      x: 0,
      y: Math.max(100, Math.min(viewportRect.height * .46, Math.abs(baseHeight - viewportRect.height) * .5 + viewportRect.height * .12))
    };
  }

  function clampCameraPan() {
    var bounds = cameraBounds();
    cameraPan.x = Math.max(-bounds.x, Math.min(bounds.x, cameraPan.x));
    cameraPan.y = Math.max(-bounds.y, Math.min(bounds.y, cameraPan.y));
  }

  function updateCamera() {
    clampCameraPan();
    mapCamera.style.setProperty("--camera-scale", String(cameraScale));
    mapCamera.style.setProperty("--camera-pan-x", cameraPan.x.toFixed(1) + "px");
    mapCamera.style.setProperty("--camera-pan-y", cameraPan.y.toFixed(1) + "px");
  }

  function resetCamera() {
    cameraScale = 1;
    cameraPan.x = 0;
    cameraPan.y = 0;
    updateCamera();
  }

  function focusBuilding(id) {
    var record = buildingElements.get(id);
    if (!record) return;
    var viewportRect = mapViewport.getBoundingClientRect();
    var anchorRect = record.anchor.getBoundingClientRect();
    cameraPan.y += viewportRect.top + viewportRect.height * .52 - anchorRect.top;
    updateCamera();
  }

  function applyZoom(action) {
    if (action === "in") cameraScale = Math.min(1.22, cameraScale + .08);
    if (action === "out") cameraScale = Math.max(.82, cameraScale - .08);
    if (action === "reset") {
      resetCamera();
      showToast("镜头已恢复");
      return;
    }
    updateCamera();
  }

  function isMapOverlay(target) {
    return Boolean(target.closest(".map-toolbar, .camera-tools, .event-chip, .building-quick-card, .deep-workspace, .confirm-modal, .system-drawer, .ui-scrim"));
  }

  function beginMapDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (isMapOverlay(event.target)) return;
    if (document.getElementById("deepWorkspace").classList.contains("is-open") || document.getElementById("systemDrawer").classList.contains("is-open")) return;
    dragState.active = true;
    dragState.moved = false;
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.originX = cameraPan.x;
    dragState.originY = cameraPan.y;
  }

  function moveMapDrag(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;
    var deltaX = event.clientX - dragState.startX;
    var deltaY = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(deltaX, deltaY) < 6) return;
    if (!dragState.moved) mapViewport.setPointerCapture(event.pointerId);
    dragState.moved = true;
    mapViewport.classList.add("is-dragging");
    cameraPan.x = 0;
    cameraPan.y = dragState.originY + deltaY;
    updateCamera();
    event.preventDefault();
  }

  function endMapDrag(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;
    if (dragState.moved) {
      suppressBuildingClickUntil = Date.now() + 350;
      showToast("地图位置已调整");
    }
    dragState.active = false;
    dragState.pointerId = null;
    mapViewport.classList.remove("is-dragging");
    if (mapViewport.hasPointerCapture(event.pointerId)) mapViewport.releasePointerCapture(event.pointerId);
  }

  function buildingById(id) {
    return BUILDINGS.find(function (item) { return item.id === id; }) || BUILDINGS[0];
  }

  function zoneById(id) {
    return ACTUAL_CONTENT.zones.find(function (item) { return item.id === id; }) || ACTUAL_CONTENT.zones[0];
  }

  function mapClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mapFormatResource(key, amount) {
    var api = window.ForestryGame;
    var names = (api && api.resourceNames) || {};
    var fallback = { emerald: "绿宝石", honey: "蜂蜜", wax: "蜂蜡", wood: "木材", oil: "种子油", rawComb: "蜂蜜脾", resin: "树脂", biomass: "生物质", biofuel: "生物燃料", wildflower: "野花", clover: "三叶草", oakSapling: "橡树苗", birchSapling: "白桦苗", jungleSapling: "丛林树苗", teakSapling: "柚木苗", pineSapling: "松树苗" };
    return (names[key] || fallback[key] || key) + " " + amount;
  }

  function mapGetResource(key) {
    if (!mapState) syncMapStateFromGame();
    if (Object.prototype.hasOwnProperty.call(mapState.flowers, key)) return Number(mapState.flowers[key]) || 0;
    if (key.endsWith("Sapling")) return Number(mapState.saplings[key.replace("Sapling", "")]) || 0;
    return Number(mapState.resources[key]) || 0;
  }

  function updateMapZoneUnlocks() {
    if (!mapState) syncMapStateFromGame();
    ACTUAL_CONTENT.zones.forEach(function (zone) {
      zone.unlocked = Boolean(mapState.zoneUnlocked[zone.id]);
    });
  }

  function updateMapHud() {
    if (!mapState) syncMapStateFromGame();
    var r = mapState.resources;
    var money = document.querySelector(".resource-cell.is-money strong");
    var energy = document.querySelector(".resource-cell.is-energy strong");
    var storage = document.querySelector(".resource-cell.is-storage strong");
    var honey = document.querySelector(".resource-cell.is-honey strong");
    var timber = document.querySelector(".resource-cell.is-timber strong");
    var queueBadge = document.querySelector('[data-nav="queue"] i');
    var contractBadge = document.querySelector('[data-nav="contracts"] i');
    var saveStateEl = document.querySelector(".save-state");
    var objectiveTitle = document.querySelector(".objective-copy strong");
    var objectiveProgress = document.querySelector(".objective-progress b");
    var objectiveBar = document.querySelector(".objective-progress i em");
    var guideButton = document.querySelector('[data-action="guide"] span');
    var brandSmall = document.querySelector(".brand-copy small");
    if (money) money.textContent = String(r.emerald);
    if (energy) energy.textContent = mapState.energy + " / " + mapState.energyCapacity;
    if (storage) storage.textContent = mapState.regularTotal + " / " + mapState.regularCapacity;
    if (honey) honey.textContent = String(r.honey);
    if (timber) timber.textContent = String(r.wood);
    if (queueBadge) queueBadge.textContent = String((mapState.breeding ? 1 : 0) + (mapState.treeBreeding ? 1 : 0) + (mapState.autoSurvey ? 1 : 0) + (mapState.machineActive ? 1 : 0));
    if (contractBadge) contractBadge.textContent = String(mapState.contractsCompleted);
    if (saveStateEl) saveStateEl.innerHTML = "<i></i>" + (mapState.saveLabel || "主游戏存档");
    if (objectiveTitle) objectiveTitle.textContent = mapState.guideTitle || "建立生态工坊";
    if (objectiveProgress) objectiveProgress.textContent = mapState.guideStep + " / " + mapState.guideTotal;
    if (objectiveBar) objectiveBar.style.width = Math.round((mapState.guideStep / Math.max(1, mapState.guideTotal)) * 100) + "%";
    if (guideButton) guideButton.textContent = mapState.guideStep + " / " + mapState.guideTotal + " 步";
    if (brandSmall) brandSmall.textContent = (mapState.rank && mapState.rank.rank) ? ("林业谷地 · " + mapState.rank.rank) : ACTUAL_CONTENT.brand;
  }

  function updateMapBuildingCards() {
    if (!mapState) syncMapStateFromGame();
    var r = mapState.resources;
    var apiary = BUILDINGS.find(function (item) { return item.id === "apiary"; });
    var arbor = BUILDINGS.find(function (item) { return item.id === "arbor"; });
    var processing = BUILDINGS.find(function (item) { return item.id === "processing"; });
    var market = BUILDINGS.find(function (item) { return item.id === "market"; });
    var archive = BUILDINGS.find(function (item) { return item.id === "archive"; });
    var warehouse = BUILDINGS.find(function (item) { return item.id === "warehouse"; });
    var station = BUILDINGS.find(function (item) { return item.id === "station"; });
    if (apiary) {
      apiary.state = mapState.breeding ? "杂交中" : mapState.apiaryReady > 0 ? "可收取" : "生产中";
      apiary.output = mapState.breeding ? "培育中 · 剩余 " + mapState.breeding.remaining + " 秒" : mapState.apiaryReady > 0 ? "蜂蜜脾 " + mapState.apiaryReady : "蜂蜜脾 · 进度 " + Math.round(mapState.apiaryProgress) + "%";
      apiary.progress = mapState.breeding ? Math.max(0, Math.round((1 - mapState.breeding.remaining / Math.max(1, mapState.breeding.remaining + 1)) * 100)) : mapState.apiaryReady > 0 ? 100 : Math.round(mapState.apiaryProgress);
      if (mapState.breeding && mapState.breeding.remaining) {
        var breedTotal = Math.max(mapState.breeding.remaining, 8);
        apiary.progress = Math.round((1 - mapState.breeding.remaining / breedTotal) * 100);
      }
      apiary.summary = mapState.breeding ? "蜂群杂交进行中，结果将写入真实存档。" : mapState.apiaryReady > 0 ? "蜂蜜脾已准备完成，可以收入仓库。" : "真实蜂箱生产循环：消耗花源并推进 apiaryProgress。";
      apiary.badge = mapState.apiaryReady > 0 ? "可收取" : mapState.breeding ? "杂交" : "";
      apiary.badgeClass = mapState.apiaryReady > 0 ? "is-ready" : "is-running";
    }
    if (arbor) {
      arbor.state = mapState.treeBreeding ? "培育中" : mapState.treeReady > 0 ? "可收取" : "生长中";
      arbor.output = mapState.treeBreeding ? "培育中 · 剩余 " + mapState.treeBreeding.remaining + " 秒" : mapState.treeReady > 0 ? "木材可收取" : "木材 · 进度 " + Math.round(mapState.treeProgress) + "%";
      arbor.progress = mapState.treeReady > 0 ? 100 : Math.round(mapState.treeProgress);
      arbor.summary = mapState.treeBreeding ? "树苗培育进行中，结果将写入真实存档。" : mapState.treeReady > 0 ? "树场木材已经成熟，可以收取并继续培育。" : "真实树场生长循环已接入 app.js。";
      arbor.badge = mapState.treeReady > 0 ? "可收取" : mapState.treeBreeding ? "培育" : "";
      arbor.badgeClass = mapState.treeReady > 0 ? "is-ready" : "is-running";
    }
    if (processing) {
      processing.state = mapState.machineReady ? "可收取" : mapState.machineActive ? "离心中" : "离心机待命";
      processing.output = mapState.machineReady ? (mapState.machineOutputLabel || "产物可收取") : mapState.machineActive ? ("进度 " + Math.round(mapState.machineProgress) + "%") : ("已完成 " + mapState.machineCycles + " 次");
      processing.progress = mapState.machineReady ? 100 : Math.round(mapState.machineProgress || 0);
      processing.summary = "离心机 C-01 使用真实配方、能源与仓库分区规则。";
      processing.badge = mapState.machineReady ? "可收取" : mapState.machineActive ? "运行" : "";
      processing.badgeClass = mapState.machineReady ? "is-ready" : mapState.machineActive ? "is-running" : "";
    }
    if (market) {
      market.state = mapState.shopTierName || "村民货架";
      market.output = "野花 ×8 · 售价 1 ◆ · 余额 " + r.emerald;
      market.summary = "商店交易写入 forestry-lab-save-slot 存档，与主游戏共用。";
    }
    if (archive) {
      var found = mapState.species.bees.length + mapState.species.trees.length + mapState.species.butterflies.length;
      archive.output = "蜂 " + mapState.species.bees.length + " / 11 · 树 " + mapState.species.trees.length + " / 14 · 蝶 " + mapState.species.butterflies.length + " / 6";
      archive.progress = Math.round(found / 31 * 100);
      archive.summary = "图鉴数据来自主游戏 discovered / analyzed 状态。";
    }
    if (warehouse) {
      warehouse.output = "常规 " + mapState.regularTotal + " / " + mapState.regularCapacity + " · 能源 " + Math.round(mapState.energy / mapState.energyCapacity * 100) + "%";
      warehouse.progress = Math.round(mapState.energy / mapState.energyCapacity * 100);
      warehouse.summary = "仓库容量与能源核心等级读取真实升级状态。";
    }
    if (station) {
      station.output = "主线委托 " + mapState.contractsCompleted + " / 15";
      station.progress = Math.round(mapState.contractsCompleted / 15 * 100);
      station.summary = mapState.guideComplete ? "教程完成，可继续主线委托与区域扩展。" : ("当前目标：" + mapState.guideTitle);
    }
  }

  function refreshMapGameplay(renderDeep) {
    syncMapStateFromGame();
    updateMapZoneUnlocks();
    updateMapBuildingCards();
    updateMapHud();
    if (buildingElements.size) selectBuilding(selectedBuildingId, false);
    if (renderDeep !== false && document.getElementById("deepWorkspace").classList.contains("is-open")) renderWorkspace();
  }

  function startMapBreeding(kind) {
    var api = ensureGameApi();
    if (kind === "tree") api.actions.startTreeBreeding();
    else api.actions.startBreeding();
    refreshMapGameplay();
  }

  function startMapSurvey(zone, mode) {
    var api = ensureGameApi();
    if (!zone.unlocked && !api.isZoneUnlocked(zone.id)) return showToast(zone.name + "尚未解锁。");
    if (mode === "auto") api.actions.startAutoSurvey(zone.id, 1);
    else api.actions.completeInstantSurvey(zone.id);
    refreshMapGameplay();
  }

  function completeMapUpgrade(target) {
    var api = ensureGameApi();
    if (target === "energyCore") api.actions.upgradeEnergyCore();
    else {
      var upgradeKey = MAP_UPGRADE_TARGET[target] || target;
      api.actions.upgradeFacility(upgradeKey);
    }
    refreshMapGameplay();
  }

  function collectMapProduct() {
    var api = ensureGameApi();
    if (workspaceState.id === "apiary") api.actions.collectApiary();
    else if (workspaceState.id === "arbor") api.actions.collectTree();
    else if (workspaceState.id === "processing") api.actions.machineAction();
    else showToast("当前没有可收取的产物。");
    refreshMapGameplay();
  }

  function analyzeMapCurrent() {
    var api = ensureGameApi();
    if (workspaceState.id === "apiary") {
      api.actions.analyzeSpecies("forest");
      api.actions.analyzeSpecies("meadows");
    } else if (workspaceState.id === "arbor") {
      api.actions.analyzeTree("oak");
      api.actions.analyzeTree("birch");
    } else {
      showToast("当前页面没有待分析样本。");
    }
    refreshMapGameplay();
  }

  function claimPendingSurveyIfAny() {
    var api = ensureGameApi();
    if (api.getState().surveyResult) {
      api.actions.claimSurveyResult();
      refreshMapGameplay();
    }
  }

  function metric(label, value, note) {
    return "<div class=\"metric\"><small>" + label + "</small><strong>" + value + "</strong><em>" + note + "</em></div>";
  }

  function condition(label, value, width, tone) {
    return "<div class=\"condition-row\"><span>" + label + "</span><span class=\"condition-track " + (tone || "") + "\"><i style=\"width:" + width + "%\"></i></span><b>" + value + "</b></div>";
  }

  function facilityOverview(def) {
    if (def.id === "apiary") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>ACTIVE HIVE</small><strong>森林蜂 × 草原蜂</strong></span><output>${mapState.breeding ? "杂交中" : mapState.apiaryReady > 0 ? "可收取" : "生产中 · " + Math.round(mapState.apiaryProgress) + "%"}</output></div>
            <div class="slot-row">
              <div class="item-slot"><span>♛</span><div><strong>森林公主蜂</strong><small>基础蜂种 · 花源：野花</small></div></div>
              <span class="slot-arrow">×</span>
              <div class="item-slot"><span>♟</span><div><strong>草原雄蜂</strong><small>基础蜂种 · 温度：普通</small></div></div>
              <span class="slot-arrow">→</span>
              <div class="item-slot"><span>⬢</span><div><strong>蜂蜜脾</strong><small>${mapState.breeding ? "杂交完成后恢复生产" : mapState.apiaryReady > 0 ? "已完成 · 可收取" : "本轮进度 " + Math.round(mapState.apiaryProgress) + "%"}</small></div></div>
            </div>
            <div class="deep-action-row"><button class="deep-button" data-deep-action="analyze">分析蜂群</button><button class="deep-button" data-deep-action="breed">${mapState.breeding ? "杂交进行中" : "开始杂交 →"}</button><button class="deep-button is-primary" data-deep-action="collect">${mapState.apiaryReady > 0 ? "收取蜂蜜脾 →" : "检查生产状态 →"}</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>HABITAT</small><strong>蜂场环境</strong></span><output>森林边缘</output></div>
            <div class="condition-list">
              ${condition("温度", "52", 52, "is-honey")}
              ${condition("湿度", "58", 58, "is-cyan")}
              ${condition("光照", "62", 62, "")}
              ${condition("花源", "野花 " + mapGetResource("wildflower"), Math.min(100, mapGetResource("wildflower") * 8), "")}
            </div>
          </section>
          <section class="deep-section is-span">
            <div class="section-heading"><span><small>PRODUCTION FORECAST</small><strong>本轮生产预测</strong></span><output>基础蜂种</output></div>
            <div class="metric-grid">${metric("预计产出", "蜂蜜脾 1", "森林蜂基础产物")}${metric("花源加成", "+0%", "当前为野花")}${metric("杂交结果", "培育蜂", "森林蜂 × 草原蜂 · 教程保障")}</div>
          </section>
        </div>`;
    }

    if (def.id === "arbor") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>ARBORETUM PLOT</small><strong>橡树培育区</strong></span><output>${mapState.treeBreeding ? "培育中" : mapState.treeReady > 0 ? "可收取" : "生长期 " + Math.round(mapState.treeProgress) + "%"}</output></div>
            <div class="slot-row">
              <div class="item-slot"><span>♣</span><div><strong>橡树树苗</strong><small>基础树种 · 库存 ${mapState.saplings.oak || 0}</small></div></div>
              <span class="slot-arrow">+</span>
              <div class="item-slot"><span>✿</span><div><strong>森林环境</strong><small>森林边缘 · 野花 ${mapGetResource("wildflower")}</small></div></div>
              <span class="slot-arrow">→</span>
              <div class="item-slot"><span>▰</span><div><strong>预计收获</strong><small>${mapState.treeBreeding ? "落叶松 · 剩余 " + mapState.treeBreeding.remaining + " 秒" : "木材 " + (8 + (mapState.levels.arbor - 1) * 2) + " · 橡树树苗"}</small></div></div>
            </div>
            <div class="deep-action-row"><button class="deep-button" data-deep-action="analyze">分析树苗</button><button class="deep-button" data-deep-action="tree-breed">${mapState.treeBreeding ? "培育进行中" : "培育落叶松 →"}</button><button class="deep-button is-primary" data-deep-action="collect">${mapState.treeReady > 0 ? "收取木材 →" : "检查生长状态 →"}</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>GROWTH CONDITIONS</small><strong>生长条件</strong></span><output>森林边缘</output></div>
            <div class="condition-list">${condition("温度", "52", 52, "")}${condition("湿度", "58", 58, "is-cyan")}${condition("光照", "62", 62, "is-honey")}${condition("树苗库存", "2", 40, "")}</div>
          </section>
          <section class="deep-section is-span"><div class="section-heading"><span><small>ORCHARD LINK</small><strong>果树与授粉联动</strong></span><output>果树未选择</output></div><div class="metric-grid">${metric("邻近蜂群", "森林蜂", "授粉范围覆盖")}${metric("果树状态", "未启用", "选择樱桃、核桃等果树后开放")}${metric("木材库存", String(mapState.resources.wood), "常规仓库物资")}</div></section>
        </div>`;
    }

    if (def.id === "processing") {
      return `
        <div class="deep-grid is-even">
          <section class="deep-section">
            <div class="section-heading"><span><small>MACHINE FLOOR</small><strong>机器台</strong></span><output>1 / 4 已建成 · ${mapState.machineCycles} 次完成</output></div>
            <div class="machine-grid">
              <div class="machine-card"><span class="machine-glyph">◎</span><span><strong>离心机 C-01</strong><small>蜂蜜脾 1 → 蜂蜜 1 · 蜂蜡 1</small></span><output>${mapState.machineReady ? "可收取" : mapState.machineActive ? ("运行 " + Math.round(mapState.machineProgress) + "%") : "待命"}</output></div>
              <div class="machine-card"><span class="machine-glyph">♧</span><span><strong>榨汁机 S-01</strong><small>完成第一次离心后解锁</small></span><output>锁定</output></div>
              <div class="machine-card"><span class="machine-glyph">≈</span><span><strong>发酵机 F-01</strong><small>完成 3 种蜂与委托后解锁</small></span><output>锁定</output></div>
              <div class="machine-card"><span class="machine-glyph">⌁</span><span><strong>蒸馏机 ST-01</strong><small>完成一次发酵后解锁</small></span><output>锁定</output></div>
            </div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="collect">${mapState.machineReady ? "收取离心产物 →" : mapState.machineActive ? "离心进行中" : "启动离心机 →"}</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>POWER & PRESSURE</small><strong>工坊负载</strong></span><output>能源 ${mapState.energy} / ${mapState.energyCapacity}</output></div>
            <div class="condition-list">${condition("总负载", "0%", 0, "is-cyan")}${condition("离心能耗", "2 / 次", 20, "")}${condition("发酵温度", "未启动", 0, "is-honey")}${condition("设备解锁", "1 / 4", 25, "")}</div>
          </section>
          <section class="deep-section is-span"><div class="section-heading"><span><small>CURRENT RECIPE</small><strong>蜂蜜脾分离</strong></span><output>加工时间 6.6 秒</output></div><div class="metric-grid">${metric("输入", "蜂蜜脾 1", "当前库存 " + mapState.resources.rawComb)}${metric("主要产物", "蜂蜜 1", "固定产出")}${metric("副产物", "蜂蜡 1", "固定产出")}</div></section>
        </div>`;
    }

    if (def.id === "market") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>DAILY TRADES</small><strong>村民今日交易</strong></span><output>${mapState.shopTierName || "学徒货架"}</output></div>
            <div class="trade-list">${(ACTUAL_CONTENT.shop || []).slice(0, 4).map(function (offer) { return "<div class=\"trade-row\"><span>" + (offer.icon || "◆") + "</span><div><strong>" + offer.name + "</strong><small>" + offer.note + "</small></div><output>" + offer.price + " ◆</output></div>"; }).join("")}</div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="trade">购买野花补给 →</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>MARKET STATUS</small><strong>交易概览</strong></span><output>${(mapState.rank && mapState.rank.name) || "林地学徒"}</output></div>
            <div class="metric-grid">${metric("绿宝石", String(mapState.resources.emerald), "可用余额")}${metric("货架等级", mapState.shopTierName || "学徒货架", "T" + (mapState.shopTier || 1))}${metric("野花库存", String(mapGetResource("wildflower")), "蜂箱花源")}</div>
          </section>
        </div>`;
    }

    if (def.id === "archive") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>SPECIES ARCHIVE</small><strong>已发现物种</strong></span><output>${mapState.species.bees.length + mapState.species.trees.length + mapState.species.butterflies.length} / 31</output></div>
            <div class="inventory-grid">
              <div class="inventory-item"><span>♛</span><strong>森林蜂</strong><small>基础蜂种</small></div><div class="inventory-item"><span>♛</span><strong>草原蜂</strong><small>基础蜂种</small></div><div class="inventory-item"><span>♣</span><strong>橡树</strong><small>基础树种</small></div><div class="inventory-item"><span>♣</span><strong>白桦</strong><small>基础树种</small></div><div class="inventory-item"><span>✧</span><strong>春蓝蝶</strong><small>基础蝶种</small></div><div class="inventory-item"><span>?</span><strong>未发现蜂种</strong><small>${11 - mapState.species.bees.length} 种</small></div><div class="inventory-item"><span>?</span><strong>未发现树种</strong><small>${14 - mapState.species.trees.length} 种</small></div><div class="inventory-item"><span>?</span><strong>未发现蝶种</strong><small>${6 - mapState.species.butterflies.length} 种</small></div>
            </div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="archive">归档新谱系 →</button></div>
          </section>
          <section class="deep-section"><div class="section-heading"><span><small>RESEARCH NOTES</small><strong>研究摘要</strong></span><output>待分析 5</output></div><div class="condition-list">${condition("蜂类记录", mapState.species.bees.length + " / 11", Math.round(mapState.species.bees.length / 11 * 100), "is-honey")}${condition("树木记录", mapState.species.trees.length + " / 14", Math.round(mapState.species.trees.length / 14 * 100), "")}${condition("蝴蝶记录", mapState.species.butterflies.length + " / 6", Math.round(mapState.species.butterflies.length / 6 * 100), "is-cyan")}</div></section>
        </div>`;
    }

    if (def.id === "warehouse") {
      return storageContent();
    }

    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>CURRENT CONTRACT</small><strong>林地调查补给</strong></span><output>教程后开放</output></div><div class="contract-list"><div class="contract-row"><span>01</span><div><strong>林地调查补给</strong><small>需要：蜂蜜脾 1 · 木材 5</small></div><output>未开放</output></div><div class="contract-row"><span>02</span><div><strong>初建蜂房</strong><small>需要：野花 2 · 蜂蜜脾 1</small></div><output>等待前置</output></div></div><div class="deep-action-row"><button class="deep-button" data-deep-action="contract">查看委托条件 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>WORKSHOP STATUS</small><strong>谷地运行摘要</strong></span><output>${(mapState.rank && (mapState.rank.rank + " · " + mapState.rank.name)) || "R1"}</output></div><div class="metric-grid">${metric("建筑", "7", "蜂箱、树场与基础工作站")}${metric("教程", mapState.guideStep + " / " + mapState.guideTotal, mapState.guideTitle || "当前目标")}${metric("区域", ACTUAL_CONTENT.zones.filter(function (z) { return z.unlocked; }).length + " / 8", "真实解锁状态")}</div></section>
      </div>`;
  }

  function facilityConfig(def) {
    var subject = def.id === "apiary" ? "蜂群与花源" : def.id === "arbor" ? "树苗与覆土" : def.id === "processing" ? "配方与队列" : "工作策略";
    var activeConfig = def.id === "apiary" ? "森林蜂 × 草原蜂" : def.id === "arbor" ? "橡树树苗 · 库存 " + (mapState.saplings.oak || 0) : def.id === "processing" ? "蜂蜜脾分离 · 能源 2" : def.id === "market" ? "野花补给 ×8 · 1 ◆" : def.output;
    var supportConfig = def.id === "apiary" ? "野花 " + mapGetResource("wildflower") + " · 森林边缘" : def.id === "arbor" ? "森林边缘 · 湿度 58" : def.id === "processing" ? "离心机 C-01" : "默认解锁状态";
    return `
      <div class="deep-grid is-even">
        <section class="deep-section">
          <div class="section-heading"><span><small>ACTIVE CONFIGURATION</small><strong>${subject}</strong></span><output>默认方案</output></div>
          <div class="slot-row"><div class="item-slot"><span>${def.icon}</span><div><strong>当前主配置</strong><small>${activeConfig}</small></div></div><span class="slot-arrow">+</span><div class="item-slot"><span>✿</span><div><strong>环境辅助</strong><small>${supportConfig}</small></div></div><span class="slot-arrow">→</span><div class="item-slot"><span>✓</span><div><strong>状态结果</strong><small>按主游戏规则计算</small></div></div></div>
        </section>
        <section class="deep-section">
          <div class="section-heading"><span><small>WORK STRATEGY</small><strong>工作策略</strong></span><output>生态平衡</output></div>
          <div class="condition-list">${condition("生产条件", "基础", 52, "is-honey")}${condition("生态维护", "启用", 64, "")}${condition("研究记录", "跟踪", 44, "is-cyan")}</div>
          <div class="deep-action-row"><button class="deep-button" data-deep-action="preset">载入生态方案</button><button class="deep-button is-primary" data-deep-action="save-config">保存配置 →</button></div>
        </section>
        <section class="deep-section is-span"><div class="section-heading"><span><small>INTERFERENCE MODEL</small><strong>系统相互影响</strong></span><output>实时计算</output></div><div class="metric-grid">${metric("蜂群 / 花源", "野花 " + mapGetResource("wildflower"), "影响蜂箱产速")}${metric("树场 / 环境", "森林边缘", "温度 52 · 湿度 58")}${metric("工业 / 能源", mapState.energy + " / " + (mapState.energyCapacity), "设备启动时消耗能源")}</div></section>
      </div>`;
  }

  function facilityUpgrade(def) {
    var upgrade = ACTUAL_CONTENT.upgrades[def.id];
    if (!upgrade) {
      return `
        <div class="deep-grid">
          <section class="deep-section is-span"><div class="section-heading"><span><small>FACILITY LEVEL</small><strong>${def.name}进程</strong></span><output>功能入口</output></div><div class="metric-grid">${metric("当前状态", "已建成", "随教程与委托开放")}${metric("可升级项", "暂无", "该建筑不使用设施等级")}${metric("长期进程", "R1", "继续完成主线委托")}</div></section>
          <section class="deep-section is-span"><div class="section-heading"><span><small>UNLOCK PATH</small><strong>下一步目标</strong></span><output>继续探索</output></div><div class="condition-list">${condition("新手教程", mapState.guideStep + " / " + mapState.guideTotal, Math.round(mapState.guideStep / Math.max(1, mapState.guideTotal) * 100), "")}${condition("区域解锁", ACTUAL_CONTENT.zones.filter(function (z) { return z.unlocked; }).length + " / 8", Math.round(ACTUAL_CONTENT.zones.filter(function (z) { return z.unlocked; }).length / 8 * 100), "is-cyan")}${condition("物种档案", (mapState.species.bees.length + mapState.species.trees.length + mapState.species.butterflies.length) + " / 31", Math.round((mapState.species.bees.length + mapState.species.trees.length + mapState.species.butterflies.length) / 31 * 100), "is-honey")}</div></section>
        </div>`;
    }
    var level = mapState.levels[def.id] || upgrade.level;
    return `
      <div class="deep-grid">
        <section class="deep-section is-span">
          <div class="section-heading"><span><small>FACILITY LEVEL</small><strong>${def.name}升级路线</strong></span><output>当前 LV${level}</output></div>
          <div class="upgrade-path"><div class="upgrade-step is-complete"><small>阶段 0</small><strong>建设地点</strong><span>已完成</span></div><div class="upgrade-step is-current"><small>LV${level}</small><strong>基础设施</strong><span>当前等级</span></div><div class="upgrade-step"><small>${upgrade.next}</small><strong>专业扩建</strong><span>待升级</span></div><div class="upgrade-step"><small>LV3</small><strong>自动化核心</strong><span>后续解锁</span></div></div>
        </section>
        <section class="deep-section"><div class="section-heading"><span><small>NEXT UPGRADE</small><strong>${upgrade.next} · 设施升级</strong></span><output>永久升级</output></div><div class="metric-grid">${metric("当前库存", "蜂蜜 " + mapState.resources.honey + " · 木材 " + mapState.resources.wood, "不足时可从商店补充")}${metric("升级需求", upgrade.cost, "主游戏实际价格")}${metric("升级结果", upgrade.next, "提升生产或容量")}</div><div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="upgrade-confirm">确认升级 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>BENEFITS</small><strong>升级收益</strong></span><output>以设施为准</output></div><div class="condition-list">${condition("生产效率", "提升", 60, "is-honey")}${condition("生态适配", "保留", 72, "is-cyan")}${condition("后续解锁", "推进", 42, "")}</div></section>
      </div>`;
  }

  function surveyContent() {
    var regionMarkup = ACTUAL_CONTENT.zones.map(function (zone) {
      var stars = "★".repeat(zone.difficulty) + "☆".repeat(5 - zone.difficulty);
      var stateClass = zone.unlocked ? "" : " is-locked";
      var action = zone.unlocked
        ? "<button class=\"deep-button is-primary\" data-deep-action=\"survey-confirm\" data-zone-id=\"" + zone.id + "\">选择区域 →</button>"
        : "<button class=\"deep-button\" type=\"button\" disabled>查看条件</button>";
      return "<div class=\"region-card" + stateClass + "\"><span class=\"region-visual\">" + zone.icon + "</span><span class=\"region-copy\"><strong>" + zone.name + "</strong><small>难度 " + zone.difficulty + " · " + stars + "</small><span class=\"region-cost\">手动 " + zone.manual + " 能源 · 自动 " + zone.auto + " · " + zone.duration + " 秒</span><em>" + zone.desc + "</em></span>" + action + "</div>";
    }).join("");
    return `
      <div class="deep-grid">
        <section class="deep-section">
          <div class="section-heading"><span><small>WORLD SURVEY</small><strong>选择调查区域</strong></span><output>能源 ${mapState.energy} / ${mapState.energyCapacity}</output></div>
          <div class="region-grid">${regionMarkup}</div>
        </section>
        <section class="deep-section"><div class="section-heading"><span><small>SURVEY TEAM</small><strong>调查准备</strong></span><output>1 / 3 槽位</output></div><div class="queue-list"><div class="queue-row"><span>♟</span><div><strong>林地调查员</strong><small>初始调查队已准备</small></div><output>已准备</output></div><div class="queue-row"><span>▣</span><div><strong>样本箱</strong><small>捕获与样本容量由装备决定</small></div><output>基础</output></div><div class="queue-row"><span>＋</span><div><strong>装备槽位</strong><small>捕虫网、嫁接刀可在商店购买</small></div><output>未配置</output></div></div></section>
      </div>`;
  }

  function queueContent() {
    var activeCount = (mapState.breeding ? 1 : 0) + (mapState.treeBreeding ? 1 : 0) + (mapState.autoSurvey ? 1 : 0);
    var autoRow = mapState.autoSurvey ? '<div class="queue-row"><span>⌖</span><div><strong>' + zoneById(mapState.autoSurvey.zoneId).name + ' · 自动调查</strong><small>完成倒计时</small></div><output>' + mapState.autoSurvey.remaining + ' 秒</output></div>' : '';
    return `
      <div class="deep-grid is-even">
        <section class="deep-section"><div class="section-heading"><span><small>ACTIVE QUEUES</small><strong>运行中的工作</strong></span><output>${activeCount} 项</output></div><div class="queue-list"><div class="queue-row"><span>⬢</span><div><strong>养蜂箱 A-01 · 森林蜂</strong><small>${mapState.breeding ? "培育蜂杂交倒计时" : "蜂蜜脾生产进度"}</small></div><output>${mapState.breeding ? mapState.breeding.remaining + " 秒" : mapState.apiaryReady > 0 ? "可收取" : Math.round(mapState.apiaryProgress) + "%"}</output></div><div class="queue-row"><span>♣</span><div><strong>树场 T-01 · 橡树</strong><small>${mapState.treeBreeding ? "落叶松培育倒计时" : "木材生产进度"}</small></div><output>${mapState.treeBreeding ? mapState.treeBreeding.remaining + " 秒" : mapState.treeReady > 0 ? "可收取" : Math.round(mapState.treeProgress) + "%"}</output></div><div class="queue-row"><span>◎</span><div><strong>离心机 C-01</strong><small>${mapState.machineReady ? "产物可收取" : mapState.machineActive ? "离心运行中" : "等待蜂蜜脾输入"} · 已完成 ${mapState.machineCycles} 次</small></div><output>${mapState.machineReady ? "可收取" : mapState.machineActive ? (Math.round(mapState.machineProgress) + "%") : (mapState.resources.rawComb > 0 ? "可加工" : "待命")}</output></div>${autoRow}</div><div class="deep-action-row"><button class="deep-button" data-deep-action="collect-all">收取可用产物 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>BLOCKED WORK</small><strong>等待解锁</strong></span><output>3 项</output></div><div class="queue-list"><div class="queue-row"><span>!</span><div><strong>榨汁机 S-01</strong><small>完成第一次离心后解锁</small></div><output>锁定</output></div><div class="queue-row"><span>!</span><div><strong>发酵机 F-01</strong><small>完成 3 种蜂与委托后解锁</small></div><output>锁定</output></div><div class="queue-row"><span>!</span><div><strong>蒸馏机 ST-01</strong><small>完成一次发酵后解锁</small></div><output>锁定</output></div></div></section>
      </div>`;
  }

  function contractsContent() {
    var foundSpecies = mapState.species.bees.length + mapState.species.trees.length + mapState.species.butterflies.length;
    var unlockedZones = ACTUAL_CONTENT.zones.filter(function (zone) { return zone.unlocked; }).length;
    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>MAIN CONTRACTS</small><strong>生态委托</strong></span><output>${mapState.contractsCompleted} / 15</output></div><div class="contract-list">${ACTUAL_CONTENT.contracts.map(function (contract) { return "<div class=\"contract-row\"><span>" + contract.id + "</span><div><strong>" + contract.name + "</strong><small>需要：" + contract.need + " · 奖励：" + contract.reward + "</small></div><output>" + contract.status + "</output></div>"; }).join("")}</div><div class="deep-action-row"><button class="deep-button" data-deep-action="contract">查看当前委托 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>LONG-TERM GOALS</small><strong>长期进程</strong></span><output>${mapState.levels.energyCore > 1 ? "核心 LV" + mapState.levels.energyCore : "R1"}</output></div><div class="condition-list">${condition("生态网络", Math.min(100, mapState.zoneVisits.forest * 10 + mapState.zoneVisits.plains * 10) + "%", Math.min(100, mapState.zoneVisits.forest * 10 + mapState.zoneVisits.plains * 10), "")}${condition("物种档案", foundSpecies + " / 31", Math.round(foundSpecies / 31 * 100), "is-cyan")}${condition("生产链", mapState.machineCycles + " / 4", Math.min(100, mapState.machineCycles / 4 * 100), "is-honey")}${condition("区域解锁", unlockedZones + " / 8", Math.round(unlockedZones / 8 * 100), "")}</div></section>
      </div>`;
  }

  function storageContent() {
    var r = mapState.resources;
    var energyCapacity = mapState.energyCapacity;
    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>STORAGE INVENTORY</small><strong>仓库物资</strong></span><output>常规 ${mapState.regularTotal} / ${mapState.regularCapacity}</output></div><div class="inventory-grid"><div class="inventory-item"><span>⬢</span><strong>蜂蜜</strong><small>${r.honey}</small></div><div class="inventory-item"><span>▣</span><strong>蜂蜡</strong><small>${r.wax}</small></div><div class="inventory-item"><span>▰</span><strong>木材</strong><small>${r.wood}</small></div><div class="inventory-item"><span>♣</span><strong>橡树苗</strong><small>${mapState.saplings.oak || 0}</small></div><div class="inventory-item"><span>♣</span><strong>白桦苗</strong><small>${mapState.saplings.birch || 0}</small></div><div class="inventory-item"><span>✿</span><strong>野花</strong><small>${mapState.flowers.wildflower || 0}</small></div><div class="inventory-item"><span>≈</span><strong>种子油</strong><small>${r.oil}</small></div><div class="inventory-item"><span>◈</span><strong>生物质</strong><small>${r.biomass}</small></div><div class="inventory-item"><span>♛</span><strong>蜂种记录</strong><small>${mapState.species.bees.length} / 11</small></div><div class="inventory-item"><span>✧</span><strong>蝶种记录</strong><small>${mapState.species.butterflies.length} / 6</small></div></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>POWER CORE</small><strong>能源核心</strong></span><output>${mapState.energy} / ${energyCapacity}</output></div><div class="condition-list">${condition("当前能源", Math.round(mapState.energy / energyCapacity * 100) + "%", Math.round(mapState.energy / energyCapacity * 100), "is-cyan")}${condition("恢复速度", "+" + mapState.energyRecovery + " / min", 36, "")}${condition("工业负载", "0%", 0, "is-honey")}</div><div class="metric-grid" style="margin-top:10px">${metric("核心等级", "LV" + mapState.levels.energyCore, "上限 " + energyCapacity)}${metric("下级上限", String(ACTUAL_CONTENT.energyCore.nextCapacity || energyCapacity), "升级后容量")}${metric("升级材料", ACTUAL_CONTENT.energyCore.cost, "首次离心后可升级")}</div><div class="deep-action-row"><button class="deep-button" data-deep-action="fuel">投入生物燃料</button><button class="deep-button is-primary" data-deep-action="upgrade-confirm">升级能源核心 →</button></div></section>
      </div>`;
  }

  function workspaceDefinition(type, id) {
    if (type === "facility") {
      var def = buildingById(id);
      return { icon: def.icon, eyebrow: def.categoryLabel, title: def.name, subtitle: "真实存档驱动 · 生产、生态、配置与升级", status: def.state, tabs: [{ id: "overview", label: "运行概览" }, { id: "config", label: "配置与影响" }, { id: "upgrade", label: "设施升级" }] };
    }
    var definitions = {
      survey: { icon: "⌖", eyebrow: "WORLD SURVEY", title: "野外调查", subtitle: "8 个区域 · 消耗、收益与调查队", status: "能源 " + mapState.energy, tabs: [{ id: "regions", label: "调查区域" }, { id: "team", label: "调查准备" }, { id: "records", label: "区域记录" }] },
      queue: { icon: "▤", eyebrow: "PRODUCTION QUEUE", title: "生产队列", subtitle: "蜂箱、树场与设备解锁状态", status: mapState.autoSurvey ? "1 自动" : "0 运行", tabs: [{ id: "active", label: "运行中" }, { id: "blocked", label: "待处理" }, { id: "history", label: "完成记录" }] },
      contracts: { icon: "☷", eyebrow: "CONTRACTS & GOALS", title: "委托与长期进程", subtitle: "15 条主线 · 教程、区域与成就", status: mapState.contractsCompleted + " 已完成", tabs: [{ id: "main", label: "主线委托" }, { id: "ecology", label: "生态委托" }, { id: "achievements", label: "成就" }] },
      storage: { icon: "▣", eyebrow: "STORAGE & POWER", title: "仓库与能源", subtitle: "分类容量、能源核心与耗材", status: mapState.regularTotal + " / " + mapState.regularCapacity, tabs: [{ id: "all", label: "全部物资" }, { id: "materials", label: "材料" }, { id: "samples", label: "样本" }] }
    };
    return definitions[type] || definitions.queue;
  }

  function workspaceContent(type, id, tab) {
    if (type === "facility") {
      var def = buildingById(id);
      if (tab === "config") return facilityConfig(def);
      if (tab === "upgrade") return facilityUpgrade(def);
      return facilityOverview(def);
    }
    if (type === "survey") return surveyContent();
    if (type === "contracts") return contractsContent();
    if (type === "storage") return storageContent();
    return queueContent();
  }

  function bindWorkspaceActions() {
    document.querySelectorAll("[data-deep-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.dataset.deepAction;
        if (action === "survey-confirm") {
          var zone = zoneById(button.dataset.zoneId);
          openConfirm("前往" + zone.name, "选择调查方式后将立即扣除能源；手动调查即时结算，自动调查需要等待 " + zone.duration + " 秒。", [["手动调查", "能源 -" + zone.manual + " · 即时结算"], ["自动调查", "能源 -" + zone.auto + " · " + zone.duration + " 秒"]], "开始手动调查 →", "", function () { startMapSurvey(zone, "manual"); }, function () { startMapSurvey(zone, "auto"); });
        } else if (action === "upgrade-confirm") {
          var upgradeTarget = workspaceState.type === "facility" ? buildingById(workspaceState.id) : null;
          var upgrade = upgradeTarget && ACTUAL_CONTENT.upgrades[upgradeTarget.id];
          if (upgrade) {
            openConfirm("升级" + upgradeTarget.name, "升级会按主游戏规则消耗材料，并解锁下一阶段能力。", [["目标等级", upgrade.next], ["升级材料", upgrade.cost]], "确认升级 →", "", function () { completeMapUpgrade(upgradeTarget.id); });
          } else {
            openConfirm("升级能源核心", "能源核心升级会提高上限，并需要先完成第一次离心。", [["目标等级", "LV2"], ["升级材料", ACTUAL_CONTENT.energyCore.cost]], "确认升级 →", "", function () { completeMapUpgrade("energyCore"); });
          }
        } else if (action === "trade") {
          openConfirm("购买野花补给", "野花补给会写入主游戏仓库，可用于养蜂箱花源。", [["野花", "+8"], ["绿宝石", "-1"]], "确认购买 →", "", function () {
            ensureGameApi().actions.executeShopTrade("buy", "wildflower", 1);
            refreshMapGameplay();
          });
        } else if (action === "contract") {
          ensureGameApi().actions.completeContract();
          refreshMapGameplay();
        } else if (action === "collect" || action === "collect-all") {
          if (action === "collect-all") {
            var api = ensureGameApi();
            var snap = api.getSnapshot();
            if (snap.apiaryReady > 0) { workspaceState.id = "apiary"; collectMapProduct(); }
            else if (snap.treeReady > 0) { workspaceState.id = "arbor"; collectMapProduct(); }
            else if (snap.machineReady || snap.machineActive || snap.resources.rawComb > 0) { workspaceState.id = "processing"; collectMapProduct(); }
            else showToast("当前没有可收取的产物。");
          } else {
            collectMapProduct();
          }
        } else if (action === "analyze") {
          analyzeMapCurrent();
        } else if (action === "breed") {
          startMapBreeding("bee");
        } else if (action === "tree-breed") {
          startMapBreeding("tree");
        } else if (action === "fuel") {
          ensureGameApi().actions.rechargeEnergyWithBiofuel();
          refreshMapGameplay();
        } else if (action === "archive") {
          var snapArchive = ensureGameApi().getSnapshot();
          showToast("当前已记录 " + (snapArchive.species.bees.length + snapArchive.species.trees.length + snapArchive.species.butterflies.length) + " / 31 个物种");
        } else if (action === "claim-survey") {
          claimPendingSurveyIfAny();
        } else {
          showToast("设置已在预览中更新");
        }
      });
    });
  }

  function renderWorkspace() {
    var definition = workspaceDefinition(workspaceState.type, workspaceState.id);
    document.getElementById("workspaceIcon").textContent = definition.icon;
    document.getElementById("workspaceEyebrow").textContent = definition.eyebrow;
    document.getElementById("workspaceTitle").textContent = definition.title;
    document.getElementById("workspaceSubtitle").textContent = definition.subtitle;
    document.getElementById("workspaceStatus").textContent = definition.status;
    var tabs = document.getElementById("workspaceTabs");
    tabs.innerHTML = "";
    definition.tabs.forEach(function (tab) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = tab.label;
      button.dataset.workspaceTab = tab.id;
      button.setAttribute("aria-selected", String(workspaceState.tab === tab.id));
      button.addEventListener("click", function () { workspaceState.tab = tab.id; renderWorkspace(); });
      tabs.appendChild(button);
    });
    document.getElementById("workspaceContent").innerHTML = workspaceContent(workspaceState.type, workspaceState.id, workspaceState.tab);
    bindWorkspaceActions();
  }

  function openWorkspace(type, id, tab) {
    closeSystemDrawer();
    closeConfirm(false);
    var definition = workspaceDefinition(type, id);
    workspaceState.type = type;
    workspaceState.id = id || null;
    workspaceState.tab = tab || definition.tabs[0].id;
    renderWorkspace();
    document.getElementById("deepWorkspace").classList.add("is-open");
    document.getElementById("deepWorkspace").setAttribute("aria-hidden", "false");
    setActiveNav(type === "survey" ? "survey" : type === "queue" ? "queue" : type === "contracts" ? "contracts" : type === "storage" ? "storage" : "map");
    updateScrim();
  }

  function closeWorkspace(update) {
    document.getElementById("deepWorkspace").classList.remove("is-open");
    document.getElementById("deepWorkspace").setAttribute("aria-hidden", "true");
    setActiveNav("map");
    if (update !== false) updateScrim();
  }

  function openConfirm(title, message, costs, acceptLabel, successMessage, acceptAction, autoAction) {
    pendingConfirmMessage = successMessage;
    pendingConfirmAction = acceptAction || null;
    pendingConfirmAutoAction = autoAction || null;
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    document.getElementById("confirmAccept").textContent = acceptLabel;
    document.getElementById("confirmAuto").hidden = !pendingConfirmAutoAction;
    document.querySelector(".confirm-actions").classList.toggle("has-auto", Boolean(pendingConfirmAutoAction));
    document.getElementById("confirmCosts").innerHTML = costs.map(function (row) { return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>"; }).join("");
    document.getElementById("confirmModal").classList.add("is-open");
    document.getElementById("confirmModal").setAttribute("aria-hidden", "false");
    updateScrim();
  }

  function closeConfirm(update) {
    document.getElementById("confirmModal").classList.remove("is-open");
    document.getElementById("confirmModal").setAttribute("aria-hidden", "true");
    pendingConfirmAction = null;
    pendingConfirmAutoAction = null;
    document.querySelector(".confirm-actions").classList.remove("has-auto");
    if (update !== false) updateScrim();
  }

  function closeTopLayer() {
    if (document.getElementById("confirmModal").classList.contains("is-open")) closeConfirm();
    else if (document.getElementById("deepWorkspace").classList.contains("is-open")) closeWorkspace();
    else if (document.getElementById("systemDrawer").classList.contains("is-open")) closeSystemDrawer();
  }

  function render(data) {
    layout = data;
    var background = document.getElementById("mapBackground");
    background.src = data.background || "assets/map/test-batch/base/valley-forest-background-v2.png";
    BUILDINGS.forEach(function (def) {
      var entry = (data.buildings || []).find(function (item) { return item.building === def.id; });
      if (entry) createBuilding(def, entry);
    });
    syncSpriteSizes();
    updateCamera();
    refreshMapGameplay(true);
    selectBuilding(selectedBuildingId, false);
    if (!window.__forestryMapPreviewBound) {
      window.__forestryMapPreviewBound = true;
      ensureGameApi().subscribe(function () { refreshMapGameplay(true); });
      window.addEventListener("forestry-game-toast", function (event) {
        if (event.detail && event.detail.message) showToast(event.detail.message);
      });
      window.addEventListener("forestry-game-update", function (event) {
        if (event.detail && event.detail.reason === "survey-result") claimPendingSurveyIfAny();
      });
    }
    if (window.ResizeObserver) new ResizeObserver(function () { syncSpriteSizes(); updateCamera(); }).observe(mapCamera);
  }

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () { applyFilter(button.dataset.filter); });
  });
  document.querySelectorAll("[data-zoom]").forEach(function (button) {
    button.addEventListener("click", function () { applyZoom(button.dataset.zoom); });
  });
  document.querySelectorAll("[data-building-jump]").forEach(function (button) {
    button.addEventListener("click", function () {
      closeWorkspace(false);
      closeSystemDrawer();
      selectBuilding(button.dataset.buildingJump, true);
      focusBuilding(button.dataset.buildingJump);
      setActiveNav("map");
    });
  });
  document.querySelectorAll("[data-nav]").forEach(function (button) {
    button.addEventListener("click", function () {
      setActiveNav(button.dataset.nav);
      if (button.dataset.nav === "more") openSystemDrawer();
      else if (button.dataset.nav === "survey") openWorkspace("survey", null, "regions");
      else if (button.dataset.nav === "queue") openWorkspace("queue", null, "active");
      else if (button.dataset.nav === "contracts") openWorkspace("contracts", null, "main");
      else if (button.dataset.nav === "storage") openWorkspace("storage", null, "all");
      else {
        closeConfirm(false);
        closeWorkspace(false);
        closeSystemDrawer();
        showToast("已返回林业谷地");
      }
    });
  });
  document.querySelectorAll("[data-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.action === "shop") {
        selectBuilding("market", false);
        openWorkspace("facility", "market", "overview");
      } else if (button.dataset.action === "ecology") {
        selectBuilding("archive", false);
        openWorkspace("facility", "archive", "overview");
      } else if (button.dataset.action === "workshop") {
        selectBuilding("station", false);
        openWorkspace("facility", "station", "overview");
      } else if (button.dataset.action === "event") {
        openWorkspace("survey", null, "regions");
      } else {
        if (button.dataset.action === "save") {
          ensureGameApi().actions.saveNow();
          showToast("已写入主游戏存档槽");
          refreshMapGameplay();
        } else {
          showToast("预览操作：" + button.textContent.trim().replace(/\s+/g, " "));
        }
      }
    });
  });
  document.getElementById("systemButton").addEventListener("click", openSystemDrawer);
  document.getElementById("systemClose").addEventListener("click", closeSystemDrawer);
  document.getElementById("uiScrim").addEventListener("click", closeTopLayer);
  document.getElementById("quickClose").addEventListener("click", function () { quickCard.classList.add("is-hidden"); });
  document.getElementById("quickPrimary").addEventListener("click", function () {
    if (selectedBuildingId === "processing") openWorkspace("queue", null, "active");
    else if (selectedBuildingId === "station") openWorkspace("contracts", null, "main");
    else if (selectedBuildingId === "warehouse") openWorkspace("storage", null, "all");
    else openWorkspace("facility", selectedBuildingId, "overview");
  });
  document.getElementById("quickSecondary").addEventListener("click", function () { openWorkspace("facility", selectedBuildingId, "config"); });
  document.getElementById("workspaceBack").addEventListener("click", closeWorkspace);
  document.getElementById("workspaceClose").addEventListener("click", closeWorkspace);
  document.getElementById("workspaceMapReturn").addEventListener("click", closeWorkspace);
  document.getElementById("confirmCancel").addEventListener("click", closeConfirm);
  document.getElementById("confirmAuto").addEventListener("click", function () {
    var action = pendingConfirmAutoAction;
    closeConfirm();
    if (action) action();
  });
  document.getElementById("confirmAccept").addEventListener("click", function () {
    var action = pendingConfirmAction;
    closeConfirm();
    if (action) action();
    else showToast(pendingConfirmMessage || "操作已确认");
  });
  mapViewport.addEventListener("pointerdown", beginMapDrag);
  mapViewport.addEventListener("pointermove", moveMapDrag);
  mapViewport.addEventListener("pointerup", endMapDrag);
  mapViewport.addEventListener("pointercancel", endMapDrag);
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeTopLayer(); });

  try {
    ensureGameApi().actions.ensureStarted();
    syncMapStateFromGame();
    refreshMapGameplay(false);
  } catch (error) {
    showToast("无法连接主游戏运行时：" + error.message);
  }

  fetch(LAYOUT_URL, { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(render)
    .catch(function () { showToast("地图布局加载失败"); });
}());

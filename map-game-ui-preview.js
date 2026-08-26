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

  var BUILDINGS = [
    { id: "arbor", name: "林木培育场", category: "ecology", categoryLabel: "ARBORETUM", baseWidth: 220, anchorY: "-94%", icon: "♣", state: "稳定", badge: "1", badgeClass: "is-running", summary: "白桦苗圃处于稳定生长期，湿度适配良好。", output: "木材 6 · 树苗 1", progress: 78, primary: "进入树场 →", secondary: "查看环境", stages: generatedStages("arbor") },
    { id: "station", name: "中央工作站", category: "task", categoryLabel: "WORKSTATION", baseWidth: 245, anchorY: "-93%", icon: "⌂", state: "可交付", badge: "!", badgeClass: "is-task", summary: "平原授粉记录已经完成，可以提交生态委托。", output: "主线委托 6 / 15", progress: 40, primary: "提交委托 →", secondary: "查看目标", stages: generatedStages("station") },
    { id: "archive", name: "生态档案馆", category: "task", categoryLabel: "ECOLOGY ARCHIVE", baseWidth: 250, anchorY: "-93%", icon: "▤", state: "新记录", badge: "3", badgeClass: "is-task", summary: "三条新谱系等待归档，研究点数可领取。", output: "蜂 11 · 树 8 · 蝶 5", progress: 66, primary: "打开档案 →", secondary: "查看谱系", stages: generatedStages("archive") },
    { id: "apiary", name: "古树蜂场", category: "ecology", categoryLabel: "APICULTURE", baseWidth: 300, anchorY: "-93%", icon: "⬢", state: "可收取", badge: "4", badgeClass: "", summary: "草原蜂群完成本轮生产，野花花源稳定。", output: "蜂蜜 4 · 蜂蜡 1", progress: 100, primary: "收取并查看 →", secondary: "查看影响", stages: [
      "assets/map/test-batch/buildings/apiary/apiary-site-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv1-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv2-summer-test-v3.png",
      "assets/map/test-batch/buildings/apiary/apiary-lv3-summer-test-v3.png"
    ] },
    { id: "processing", name: "加工工坊", category: "production", categoryLabel: "PROCESSING", baseWidth: 330, anchorY: "-94%", icon: "⚙", state: "运行中", badge: "2", badgeClass: "is-running", summary: "蒸馏机正在处理种子油，能源供应稳定。", output: "队列 2 / 4 · 剩余 32 秒", progress: 64, primary: "查看队列 →", secondary: "调整策略", stages: generatedStages("processing") },
    { id: "market", name: "村民商店", category: "production", categoryLabel: "VILLAGER MARKET", baseWidth: 285, anchorY: "-93%", icon: "◆", state: "已刷新", badge: "!", badgeClass: "", summary: "每日交易已经刷新，野花种子正在折扣。", output: "绿宝石 1,248 · 折扣 12%", progress: 100, primary: "进入商店 →", secondary: "今日价格", stages: generatedStages("market") },
    { id: "warehouse", name: "仓库能源站", category: "production", categoryLabel: "STORAGE & POWER", baseWidth: 340, anchorY: "-91%", icon: "ϟ", state: "恢复中", badge: "86", badgeClass: "is-running", summary: "能源核心正在缓慢恢复，仓库容量充足。", output: "仓库 63 / 120 · 能源 86%", progress: 72, primary: "管理仓库 →", secondary: "能源升级", stages: generatedStages("warehouse") }
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
    hit.setAttribute("aria-label", "选择" + def.name + "，" + STAGE_LABELS[transform.state] + "，" + def.state);
    hit.addEventListener("click", function (event) {
      if (Date.now() < suppressBuildingClickUntil) {
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
    buildingElements.set(def.id, { anchor: anchor, sprite: sprite, def: def });
  }

  function syncSpriteSizes() {
    var width = mapCamera.getBoundingClientRect().width;
    var logicalScale = width / 1667;
    buildingElements.forEach(function (record) {
      record.sprite.style.width = record.def.baseWidth * logicalScale + "px";
      var hit = record.anchor.querySelector(".building-hit");
      hit.style.width = Math.max(52, record.def.baseWidth * logicalScale * .52) + "px";
      hit.style.height = Math.max(46, record.def.baseWidth * logicalScale * .38) + "px";
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
      x: Math.max(100, Math.min(viewportRect.width * .42, Math.abs(baseWidth - viewportRect.width) * .5 + viewportRect.width * .18)),
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
    cameraPan.x += viewportRect.left + viewportRect.width * .5 - anchorRect.left;
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
    cameraPan.x = dragState.originX + deltaX;
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
            <div class="section-heading"><span><small>ACTIVE HIVE</small><strong>草原蜂群 · 第 6 代</strong></span><output>可收取</output></div>
            <div class="slot-row">
              <div class="item-slot"><span>♛</span><div><strong>草原公主蜂</strong><small>速度：快 · 寿命：中</small></div></div>
              <span class="slot-arrow">×</span>
              <div class="item-slot"><span>♟</span><div><strong>森林雄蜂</strong><small>授粉：高 · 温度：普通</small></div></div>
              <span class="slot-arrow">→</span>
              <div class="item-slot"><span>⬢</span><div><strong>蜂巢产物</strong><small>蜂蜜 4 · 蜂蜡 1</small></div></div>
            </div>
            <div class="deep-action-row"><button class="deep-button" data-deep-action="analyze">分析蜂群</button><button class="deep-button is-primary" data-deep-action="collect">收取产物 →</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>HABITAT</small><strong>蜂场环境</strong></span><output>适配 92%</output></div>
            <div class="condition-list">
              ${condition("温度", "适宜", 82, "is-honey")}
              ${condition("湿度", "64", 64, "is-cyan")}
              ${condition("花源", "4 / 4", 100, "")}
              ${condition("生态压力", "低", 24, "")}
            </div>
          </section>
          <section class="deep-section is-span">
            <div class="section-heading"><span><small>PRODUCTION FORECAST</small><strong>本轮生产预测</strong></span><output>效率 +22%</output></div>
            <div class="metric-grid">${metric("预计产出", "蜂蜜 4", "基础 3 + 环境 1")}${metric("稀有副产物", "蜂蜡 1", "概率 68%")}${metric("下一轮", "32 秒", "能源消耗 2")}</div>
          </section>
        </div>`;
    }

    if (def.id === "arbor") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>ARBORETUM PLOT</small><strong>白桦培育区</strong></span><output>生长期 78%</output></div>
            <div class="slot-row">
              <div class="item-slot"><span>♣</span><div><strong>白桦树苗</strong><small>基础树种 · 库存 2</small></div></div>
              <span class="slot-arrow">+</span>
              <div class="item-slot"><span>✿</span><div><strong>森林覆土</strong><small>生长速度 +12%</small></div></div>
              <span class="slot-arrow">→</span>
              <div class="item-slot"><span>▰</span><div><strong>预计收获</strong><small>木材 6 · 树苗 1</small></div></div>
            </div>
            <div class="deep-action-row"><button class="deep-button" data-deep-action="analyze">分析树苗</button><button class="deep-button is-primary" data-deep-action="collect">提前收获 →</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>GROWTH CONDITIONS</small><strong>生长条件</strong></span><output>稳定</output></div>
            <div class="condition-list">${condition("土壤", "肥沃", 86, "")}${condition("湿度", "72", 72, "is-cyan")}${condition("授粉", "+10%", 68, "is-honey")}${condition("树冠空间", "充足", 90, "")}</div>
          </section>
          <section class="deep-section is-span"><div class="section-heading"><span><small>ORCHARD LINK</small><strong>果树与授粉联动</strong></span><output>核桃未解锁</output></div><div class="metric-grid">${metric("邻近蜂群", "草原蜂", "授粉范围覆盖")}${metric("蝴蝶访问", "3 次", "突变概率 +4%")}${metric("木材库存", "83", "仓库容量充足")}</div></section>
        </div>`;
    }

    if (def.id === "processing") {
      return `
        <div class="deep-grid is-even">
          <section class="deep-section">
            <div class="section-heading"><span><small>MACHINE FLOOR</small><strong>机器台</strong></span><output>2 / 4 运行</output></div>
            <div class="machine-grid">
              <div class="machine-card"><span class="machine-glyph">◎</span><span><strong>离心机 C-01</strong><small>蜂蜜 1 · 蜂蜡 1</small></span><output>可收取</output></div>
              <div class="machine-card"><span class="machine-glyph">♧</span><span><strong>榨汁机 S-01</strong><small>等待木材输入</small></span><output>待命</output></div>
              <div class="machine-card"><span class="machine-glyph">≈</span><span><strong>发酵机 F-01</strong><small>种子油发酵 64%</small></span><output>32s</output></div>
              <div class="machine-card"><span class="machine-glyph">⌁</span><span><strong>蒸馏机 ST-01</strong><small>等待发酵解锁</small></span><output>锁定</output></div>
            </div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="collect">收取离心产物 →</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>POWER & PRESSURE</small><strong>工坊负载</strong></span><output>能源 86%</output></div>
            <div class="condition-list">${condition("总负载", "42%", 42, "is-cyan")}${condition("管路压力", "稳定", 76, "")}${condition("发酵温度", "适宜", 82, "is-honey")}${condition("排放压力", "低", 23, "")}</div>
          </section>
          <section class="deep-section is-span"><div class="section-heading"><span><small>CURRENT RECIPE</small><strong>蜂蜜离心分离</strong></span><output>加工时间 6.6 秒</output></div><div class="metric-grid">${metric("输入", "蜂蜜脾 1", "仓库库存 4")}${metric("主要产物", "蜂蜜 1", "100% 获得")}${metric("副产物", "蜂蜡 1", "68% 获得")}</div></section>
        </div>`;
    }

    if (def.id === "market") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>DAILY TRADES</small><strong>村民今日交易</strong></span><output>刷新 08:42</output></div>
            <div class="trade-list">
              <div class="trade-row"><span>✿</span><div><strong>野花种子 ×4</strong><small>蜂场花源耗材 · 今日折扣</small></div><output>12 ◆</output></div>
              <div class="trade-row"><span>▣</span><div><strong>坚固蜂箱框架</strong><small>耐久 80 · 生产效率 +8%</small></div><output>38 ◆</output></div>
              <div class="trade-row"><span>◈</span><div><strong>分析耗材 ×3</strong><small>用于蜂、树与蝶样本分析</small></div><output>24 ◆</output></div>
              <div class="trade-row"><span>♣</span><div><strong>湿地覆土</strong><small>湿度适配 +12</small></div><output>18 ◆</output></div>
            </div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="trade">购买野花种子 →</button></div>
          </section>
          <section class="deep-section">
            <div class="section-heading"><span><small>MARKET STATUS</small><strong>交易概览</strong></span><output>声望 R3</output></div>
            <div class="metric-grid">${metric("绿宝石", "1,248", "可用余额")}${metric("今日折扣", "12%", "野花种子")}${metric("出售额度", "6 / 10", "每日刷新")}</div>
          </section>
        </div>`;
    }

    if (def.id === "archive") {
      return `
        <div class="deep-grid">
          <section class="deep-section">
            <div class="section-heading"><span><small>SPECIES ARCHIVE</small><strong>已发现物种</strong></span><output>24 / 96</output></div>
            <div class="inventory-grid">
              <div class="inventory-item"><span>♛</span><strong>草原蜂</strong><small>基础</small></div><div class="inventory-item"><span>♛</span><strong>森林蜂</strong><small>基础</small></div><div class="inventory-item"><span>♛</span><strong>勤劳蜂</strong><small>二级</small></div><div class="inventory-item"><span>♣</span><strong>橡树</strong><small>基础</small></div><div class="inventory-item"><span>♣</span><strong>白桦</strong><small>基础</small></div><div class="inventory-item"><span>♣</span><strong>丛林树</strong><small>稀有</small></div><div class="inventory-item"><span>✧</span><strong>春日蔚蓝蝶</strong><small>已记录</small></div><div class="inventory-item"><span>?</span><strong>未知谱系</strong><small>3 条</small></div>
            </div>
            <div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="archive">归档新谱系 →</button></div>
          </section>
          <section class="deep-section"><div class="section-heading"><span><small>RESEARCH NOTES</small><strong>研究摘要</strong></span><output>研究点 18</output></div><div class="condition-list">${condition("蜂类记录", "11 / 48", 23, "is-honey")}${condition("树木记录", "8 / 24", 33, "")}${condition("蝴蝶记录", "5 / 24", 21, "is-cyan")}</div></section>
        </div>`;
    }

    if (def.id === "warehouse") {
      return storageContent();
    }

    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>CURRENT CONTRACT</small><strong>平原授粉记录</strong></span><output>可交付</output></div><div class="contract-list"><div class="contract-row"><span>06</span><div><strong>整理平原花源与基础蜂种记录</strong><small>交付：蜂蜜 4 · 蜂蜡 3</small></div><output>3 / 3</output></div><div class="contract-row"><span>07</span><div><strong>建立第一条稳定木材链</strong><small>需要：木材 20 · 树苗 2</small></div><output>14 / 20</output></div></div><div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="contract">提交当前委托 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>WORKSHOP STATUS</small><strong>谷地运行摘要</strong></span><output>稳定</output></div><div class="metric-grid">${metric("建筑", "7", "6 运行 · 1 待命")}${metric("委托", "6 / 15", "主线阶段")}${metric("现场等级", "R3", "林地研究员")}</div></section>
      </div>`;
  }

  function facilityConfig(def) {
    var subject = def.id === "apiary" ? "蜂群与花源" : def.id === "arbor" ? "树苗与覆土" : def.id === "processing" ? "配方与队列" : "工作策略";
    return `
      <div class="deep-grid is-even">
        <section class="deep-section">
          <div class="section-heading"><span><small>ACTIVE CONFIGURATION</small><strong>${subject}</strong></span><output>方案 A</output></div>
          <div class="slot-row"><div class="item-slot"><span>${def.icon}</span><div><strong>当前主配置</strong><small>${def.output}</small></div></div><span class="slot-arrow">+</span><div class="item-slot"><span>✿</span><div><strong>生态辅助</strong><small>野花 · 森林边缘</small></div></div><span class="slot-arrow">→</span><div class="item-slot"><span>✓</span><div><strong>预计结果</strong><small>稳定运行 · 风险低</small></div></div></div>
        </section>
        <section class="deep-section">
          <div class="section-heading"><span><small>WORK STRATEGY</small><strong>工作策略</strong></span><output>工业生产</output></div>
          <div class="condition-list">${condition("生产权重", "70%", 70, "is-honey")}${condition("生态维护", "20%", 20, "")}${condition("研究记录", "10%", 10, "is-cyan")}</div>
          <div class="deep-action-row"><button class="deep-button" data-deep-action="preset">载入生态方案</button><button class="deep-button is-primary" data-deep-action="save-config">保存配置 →</button></div>
        </section>
        <section class="deep-section is-span"><div class="section-heading"><span><small>INTERFERENCE MODEL</small><strong>系统相互影响</strong></span><output>净增益 +14%</output></div><div class="metric-grid">${metric("蜂群 / 树场", "+10% 授粉", "当前为正向关系")}${metric("工业 / 生态", "-4% 压力", "可由升级抵消")}${metric("蝴蝶 / 突变", "+8%", "需要花园覆盖")}</div></section>
      </div>`;
  }

  function facilityUpgrade(def) {
    return `
      <div class="deep-grid">
        <section class="deep-section is-span">
          <div class="section-heading"><span><small>FACILITY LEVEL</small><strong>${def.name}升级路线</strong></span><output>当前 LV${def.id === "market" ? 1 : 3}</output></div>
          <div class="upgrade-path"><div class="upgrade-step is-complete"><small>阶段 0</small><strong>建设地点</strong><span>已完成</span></div><div class="upgrade-step is-complete"><small>LV1</small><strong>基础设施</strong><span>已完成</span></div><div class="upgrade-step is-current"><small>LV2</small><strong>专业扩建</strong><span>当前等级</span></div><div class="upgrade-step"><small>LV3</small><strong>自动化核心</strong><span>待升级</span></div></div>
        </section>
        <section class="deep-section"><div class="section-heading"><span><small>NEXT UPGRADE</small><strong>自动化核心</strong></span><output>永久升级</output></div><div class="metric-grid">${metric("木材", "18 / 24", "还缺 6")}${metric("蜂蜡", "11 / 8", "已满足")}${metric("绿宝石", "1,248 / 320", "已满足")}</div><div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="upgrade-confirm">确认升级 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>BENEFITS</small><strong>升级收益</strong></span><output>预览</output></div><div class="condition-list">${condition("生产槽位", "+1", 75, "is-honey")}${condition("能源效率", "+12%", 62, "is-cyan")}${condition("生态压力", "-6%", 48, "")}</div></section>
      </div>`;
  }

  function surveyContent() {
    return `
      <div class="deep-grid">
        <section class="deep-section">
          <div class="section-heading"><span><small>WORLD SURVEY</small><strong>选择调查区域</strong></span><output>能源 86 / 100</output></div>
          <div class="region-grid">
            <div class="region-card"><span class="region-visual">♣</span><span class="region-copy"><strong>森林边缘</strong><small>难度 1 · 熟练度 62%</small><span class="region-cost">能源 12 · 8～12 分钟</span></span><button class="deep-button is-primary" data-deep-action="survey-confirm" data-region="森林边缘">选择区域 →</button></div>
            <div class="region-card"><span class="region-visual">✿</span><span class="region-copy"><strong>平原花地</strong><small>难度 2 · 熟练度 38%</small><span class="region-cost">能源 18 · 12～16 分钟</span></span><button class="deep-button is-primary" data-deep-action="survey-confirm" data-region="平原花地">选择区域 →</button></div>
            <div class="region-card"><span class="region-visual">≈</span><span class="region-copy"><strong>静谧沼泽</strong><small>难度 3 · 熟练度 12%</small><span class="region-cost">能源 26 · 16～22 分钟</span></span><button class="deep-button" data-deep-action="survey-confirm" data-region="静谧沼泽">选择区域 →</button></div>
            <div class="region-card is-locked"><span class="region-visual">♨</span><span class="region-copy"><strong>热带林冠</strong><small>完成温室升级后开放</small><span class="region-cost">能源 34 · 未解锁</span></span><button class="deep-button" type="button" disabled>查看条件</button></div>
          </div>
        </section>
        <section class="deep-section"><div class="section-heading"><span><small>SURVEY TEAM</small><strong>调查准备</strong></span><output>2 / 3 槽位</output></div><div class="queue-list"><div class="queue-row"><span>♟</span><div><strong>林地调查员</strong><small>基础发现率 +12%</small></div><output>已准备</output></div><div class="queue-row"><span>▣</span><div><strong>样本箱</strong><small>携带上限 8</small></div><output>6 / 8</output></div><div class="queue-row"><span>＋</span><div><strong>空余装备槽</strong><small>可从商店购买装备</small></div><output>未配置</output></div></div></section>
      </div>`;
  }

  function queueContent() {
    return `
      <div class="deep-grid is-even">
        <section class="deep-section"><div class="section-heading"><span><small>ACTIVE QUEUES</small><strong>运行中的工作</strong></span><output>3 项</output></div><div class="queue-list"><div class="queue-row"><span>⬢</span><div><strong>古树蜂场 · 草原蜂</strong><small>蜂蜜 4 · 蜂蜡 1</small></div><output>可收取</output></div><div class="queue-row"><span>≈</span><div><strong>发酵机 F-01</strong><small>种子油发酵</small></div><output>32 秒</output></div><div class="queue-row"><span>♣</span><div><strong>白桦培育区</strong><small>木材 6 · 树苗 1</small></div><output>78%</output></div></div><div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="collect-all">收取可用产物 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>BLOCKED WORK</small><strong>等待处理</strong></span><output>2 项</output></div><div class="queue-list"><div class="queue-row"><span>!</span><div><strong>榨汁机 S-01</strong><small>缺少木材输入</small></div><output>前往仓库</output></div><div class="queue-row"><span>!</span><div><strong>蒸馏机 ST-01</strong><small>等待发酵加工解锁</small></div><output>查看条件</output></div></div></section>
      </div>`;
  }

  function contractsContent() {
    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>MAIN CONTRACTS</small><strong>生态委托</strong></span><output>6 / 15</output></div><div class="contract-list"><div class="contract-row"><span>06</span><div><strong>平原授粉记录</strong><small>交付蜂蜜 4、蜂蜡 3 · 奖励声望 +2</small></div><output>可交付</output></div><div class="contract-row"><span>07</span><div><strong>第一条稳定木材链</strong><small>收集木材 20、树苗 2</small></div><output>14 / 20</output></div><div class="contract-row"><span>08</span><div><strong>初级生态加工</strong><small>完成一次发酵与蒸馏</small></div><output>1 / 2</output></div></div><div class="deep-action-row"><button class="deep-button is-primary" data-deep-action="contract">交付当前委托 →</button></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>LONG-TERM GOALS</small><strong>长期进程</strong></span><output>R3</output></div><div class="condition-list">${condition("生态网络", "42%", 42, "")}${condition("物种档案", "24 / 96", 25, "is-cyan")}${condition("工业体系", "3 / 7", 43, "is-honey")}${condition("区域精通", "2 / 8", 25, "")}</div></section>
      </div>`;
  }

  function storageContent() {
    return `
      <div class="deep-grid">
        <section class="deep-section"><div class="section-heading"><span><small>STORAGE INVENTORY</small><strong>仓库物资</strong></span><output>63 / 120</output></div><div class="inventory-grid"><div class="inventory-item"><span>⬢</span><strong>蜂蜜</strong><small>25</small></div><div class="inventory-item"><span>▣</span><strong>蜂蜡</strong><small>11</small></div><div class="inventory-item"><span>▰</span><strong>木材</strong><small>83</small></div><div class="inventory-item"><span>♣</span><strong>树苗</strong><small>20</small></div><div class="inventory-item"><span>◈</span><strong>生物质</strong><small>8</small></div><div class="inventory-item"><span>✿</span><strong>花源</strong><small>4</small></div><div class="inventory-item"><span>≈</span><strong>种子油</strong><small>6</small></div><div class="inventory-item"><span>♛</span><strong>蜂样本</strong><small>9</small></div><div class="inventory-item"><span>✧</span><strong>蝶样本</strong><small>3</small></div><div class="inventory-item"><span>＋</span><strong>空余容量</strong><small>57</small></div></div></section>
        <section class="deep-section"><div class="section-heading"><span><small>POWER CORE</small><strong>能源核心</strong></span><output>86 / 100</output></div><div class="condition-list">${condition("当前能源", "86%", 86, "is-cyan")}${condition("恢复速度", "+1 / 90s", 36, "")}${condition("工业负载", "42%", 42, "is-honey")}</div><div class="metric-grid" style="margin-top:10px">${metric("核心等级", "LV2", "上限 100")}${metric("下级上限", "140", "需要研究 R4")}${metric("应急燃料", "8", "生物质库存")}</div><div class="deep-action-row"><button class="deep-button" data-deep-action="fuel">投入生物燃料</button><button class="deep-button is-primary" data-deep-action="upgrade-confirm">升级能源核心 →</button></div></section>
      </div>`;
  }

  function workspaceDefinition(type, id) {
    if (type === "facility") {
      var def = buildingById(id);
      return { icon: def.icon, eyebrow: def.categoryLabel, title: def.name, subtitle: "生产、生态、配置与升级", status: def.state, tabs: [{ id: "overview", label: "运行概览" }, { id: "config", label: "配置与影响" }, { id: "upgrade", label: "设施升级" }] };
    }
    var definitions = {
      survey: { icon: "⌖", eyebrow: "WORLD SURVEY", title: "野外调查", subtitle: "区域、消耗、收益与调查队", status: "能源 86", tabs: [{ id: "regions", label: "调查区域" }, { id: "team", label: "调查准备" }, { id: "records", label: "区域记录" }] },
      queue: { icon: "▤", eyebrow: "PRODUCTION QUEUE", title: "生产队列", subtitle: "运行、阻塞与可收取项目", status: "3 运行", tabs: [{ id: "active", label: "运行中" }, { id: "blocked", label: "待处理" }, { id: "history", label: "完成记录" }] },
      contracts: { icon: "☷", eyebrow: "CONTRACTS & GOALS", title: "委托与长期进程", subtitle: "当前目标、主线委托与成就", status: "1 可交付", tabs: [{ id: "main", label: "主线委托" }, { id: "ecology", label: "生态委托" }, { id: "achievements", label: "成就" }] },
      storage: { icon: "▣", eyebrow: "STORAGE & POWER", title: "仓库与能源", subtitle: "库存、容量、能源核心与耗材", status: "63 / 120", tabs: [{ id: "all", label: "全部物资" }, { id: "materials", label: "材料" }, { id: "samples", label: "样本" }] }
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
          openConfirm("前往" + button.dataset.region, "选择调查方式后将立即扣除能源；手动调查可获得更多样本。", [["手动调查", "能源 -18 · 奖励 +25%"], ["自动调查", "能源 -14 · 8 分钟"]], "开始手动调查 →", "调查队已经出发");
        } else if (action === "upgrade-confirm") {
          openConfirm("确认设施升级", "升级会立即消耗材料，但不会中断已经完成的产物领取。", [["木材", "-24"], ["蜂蜡", "-8"], ["绿宝石", "-320"]], "确认升级 →", "升级任务已加入施工队列");
        } else if (action === "trade") {
          openConfirm("购买野花种子", "野花种子会直接进入仓库，并可用于蜂场花源补充。", [["野花种子", "+4"], ["绿宝石", "-12"]], "确认购买 →", "已购买野花种子 ×4");
        } else if (action === "contract") {
          openConfirm("交付平原授粉记录", "交付物将从仓库扣除，奖励会立即结算。", [["蜂蜜", "-4"], ["蜂蜡", "-3"], ["奖励", "绿宝石 +60 · 声望 +2"]], "交付委托 →", "委托已完成，奖励已领取");
        } else if (action === "collect" || action === "collect-all") {
          showToast(action === "collect-all" ? "已收取全部可用产物" : "产物已收入仓库");
        } else if (action === "fuel") {
          showToast("投入生物质 2，能源恢复速度暂时提高");
        } else if (action === "archive") {
          showToast("3 条新谱系已加入生态档案");
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

  function openConfirm(title, message, costs, acceptLabel, successMessage) {
    pendingConfirmMessage = successMessage;
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    document.getElementById("confirmAccept").textContent = acceptLabel;
    document.getElementById("confirmCosts").innerHTML = costs.map(function (row) { return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>"; }).join("");
    document.getElementById("confirmModal").classList.add("is-open");
    document.getElementById("confirmModal").setAttribute("aria-hidden", "false");
    updateScrim();
  }

  function closeConfirm(update) {
    document.getElementById("confirmModal").classList.remove("is-open");
    document.getElementById("confirmModal").setAttribute("aria-hidden", "true");
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
    selectBuilding(selectedBuildingId, false);
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
        showToast("预览操作：" + button.textContent.trim().replace(/\s+/g, " "));
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
  document.getElementById("confirmAccept").addEventListener("click", function () {
    closeConfirm();
    showToast(pendingConfirmMessage || "操作已确认");
  });
  mapViewport.addEventListener("pointerdown", beginMapDrag);
  mapViewport.addEventListener("pointermove", moveMapDrag);
  mapViewport.addEventListener("pointerup", endMapDrag);
  mapViewport.addEventListener("pointercancel", endMapDrag);
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeTopLayer(); });

  fetch(LAYOUT_URL, { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(render)
    .catch(function () { showToast("地图布局加载失败"); });
}());

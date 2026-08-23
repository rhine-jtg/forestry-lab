const apiaryLayer = document.querySelector("#apiaryLayer");
const walker = document.querySelector("#walker");
const buildingStatus = document.querySelector("#buildingStatus");
const villagerStatus = document.querySelector("#villagerStatus");
const APIARY_SOURCE = "assets/map/test-batch/buildings/apiary/apiary-state-strip-summer-test-v3-chroma.png";
const WALKER_SOURCE = "assets/map/test-batch/characters/villager/villager-walk-4dir-test-v2.png";
let apiaryStates = [];

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("无法加载 " + source));
    image.src = source;
  });
}

function clearMatchingPixels(imageData, matchesBackground) {
  const pixels = imageData.data;

  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (!matchesBackground(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
      continue;
    }

    pixels[offset] = 0;
    pixels[offset + 1] = 0;
    pixels[offset + 2] = 0;
    pixels[offset + 3] = 0;
  }

  return imageData;
}

function clearConnectedBackground(imageData, width, height, matchesBackground) {
  const data = imageData.data;
  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  const enqueue = (index) => {
    if (index < 0 || index >= pixelCount || visited[index]) return;

    const offset = index * 4;
    if (!matchesBackground(data[offset], data[offset + 1], data[offset + 2])) return;

    visited[index] = 1;
    queue[tail] = index;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head];
    const offset = index * 4;
    const x = index % width;
    head += 1;

    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;

    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (index >= width) enqueue(index - width);
    if (index + width < pixelCount) enqueue(index + width);
  }

  return imageData;
}

function applyApiaryState(state) {
  if (!apiaryStates[state]) return;
  apiaryLayer.style.backgroundImage = 'url("' + apiaryStates[state] + '")';
}

async function prepareApiaryStates() {
  const image = await loadImage(APIARY_SOURCE);
  const states = [];

  for (let state = 0; state < 3; state += 1) {
    const left = Math.round(state * image.width / 3);
    const right = Math.round((state + 1) * image.width / 3);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = right - left;
    canvas.height = image.height;
    context.imageSmoothingEnabled = false;
    context.drawImage(
      image,
      left,
      0,
      canvas.width,
      image.height,
      0,
      0,
      canvas.width,
      image.height
    );

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    clearMatchingPixels(pixels, (red, green, blue) => (
      red > 170
      && blue > 170
      && green < 150
      && red - green > 55
      && blue - green > 55
    ));
    context.putImageData(pixels, 0, 0);
    states.push(canvas.toDataURL("image/png"));
  }

  apiaryStates = states;
  applyApiaryState(Number(apiaryLayer.dataset.state));
  apiaryLayer.classList.add("is-ready");
  buildingStatus.textContent = "v3 · 键控底已转为透明；蜂场位于左上林区空地，使用更高俯视角。";
}

async function prepareWalker() {
  const image = await loadImage(WALKER_SOURCE);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = image.width;
  canvas.height = image.height;
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  clearConnectedBackground(pixels, canvas.width, canvas.height, (red, green, blue) => {
    const darkest = Math.min(red, green, blue);
    const lightest = Math.max(red, green, blue);
    return darkest > 222 && lightest - darkest < 24;
  });
  context.putImageData(pixels, 0, 0);

  walker.style.backgroundImage = 'url("' + canvas.toDataURL("image/png") + '")';
  walker.classList.add("is-ready");
  villagerStatus.textContent = "v2 体型 · 白底已转为透明；地图显示约 24–28px，比例已缩小。";
}

document.querySelectorAll(".state-button").forEach((button) => {
  button.addEventListener("click", () => {
    const state = Number(button.dataset.state);
    apiaryLayer.dataset.state = String(state);
    applyApiaryState(state);

    document.querySelectorAll(".state-button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});

document.querySelectorAll(".direction-button").forEach((button) => {
  button.addEventListener("click", () => {
    walker.dataset.direction = button.dataset.direction;

    document.querySelectorAll(".direction-button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});

prepareApiaryStates().catch((error) => {
  buildingStatus.textContent = "透明化失败：" + error.message;
  buildingStatus.classList.add("fail");
});

prepareWalker().catch((error) => {
  villagerStatus.textContent = "透明化失败：" + error.message;
  villagerStatus.classList.add("fail");
});

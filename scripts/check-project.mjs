import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];
const passes = [];
const relativePath = (file) => relative(root, file).replaceAll("\\", "/");
const pass = (message) => passes.push(message);
const fail = (message) => failures.push(message);

function walk(directory, predicate, output = []) {
  if (!existsSync(directory)) return output;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", "build"].includes(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, predicate, output);
    else if (predicate(fullPath)) output.push(fullPath);
  }
  return output;
}

function checkJavaScript() {
  const candidates = [
    "app.js",
    "map-building-visibility-test.js",
    "map-building-anchor-preview.js",
    "map-layer-test.js",
    "desktop/main.cjs",
    "android/app/src/main/assets/app.js",
  ];
  for (const candidate of candidates) {
    const file = join(root, candidate);
    if (!existsSync(file)) continue;
    try {
      Function(readFileSync(file, "utf8"));
      pass(`JavaScript syntax: ${candidate}`);
    } catch (error) {
      fail(`JavaScript syntax: ${candidate}\n${error.message}`);
    }
  }
}

function checkJson() {
  const files = [
    join(root, "package.json"),
    ...walk(join(root, "assets", "map", "layouts"), (file) => extname(file) === ".json"),
  ];
  for (const file of files) {
    try {
      const value = JSON.parse(readFileSync(file, "utf8"));
      if (relativePath(file).startsWith("assets/map/layouts/") && !Array.isArray(value.buildings)) {
        throw new Error("missing buildings array");
      }
      pass(`JSON: ${relativePath(file)}`);
    } catch (error) {
      fail(`JSON: ${relativePath(file)} (${error.message})`);
    }
  }
}

function extractReferences(file, text) {
  const references = [];
  if ([".html", ".htm"].includes(extname(file))) {
    for (const match of text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) references.push(match[1]);
  }
  if (extname(file) === ".css") {
    for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1]);
  }
  return references;
}

function checkReferencesAndText() {
  const sourceFiles = [
    ...walk(root, (file) => [".html", ".css"].includes(extname(file))),
    join(root, "app.js"),
    join(root, "map-layer-test.js"),
  ].filter((file, index, files) => existsSync(file) && files.indexOf(file) === index);

  for (const file of sourceFiles) {
    const text = readFileSync(file, "utf8");
    if (text.includes("\uFFFD")) fail(`Encoding replacement character: ${relativePath(file)}`);
    if (/^(<{7}|={7}|>{7})/m.test(text)) fail(`Unresolved merge marker: ${relativePath(file)}`);
    for (const reference of extractReferences(file, text)) {
      if (/^(?:[a-z]+:|\/\/|#|data:|javascript:)/i.test(reference) || reference.includes("${")) continue;
      let decoded = reference.split(/[?#]/, 1)[0];
      try {
        decoded = decodeURIComponent(decoded);
      } catch {}
      const target = normalize(resolve(file, "..", decoded));
      if (!existsSync(target)) fail(`Missing reference: ${relativePath(file)} -> ${reference}`);
    }
  }
  pass(`Source text/reference scan: ${sourceFiles.length} files`);
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

async function checkHttp() {
  const server = createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const candidate = resolve(root, `.${requestPath === "/" ? "/index.html" : requestPath}`);
    if (!candidate.startsWith(`${root}${sep}`) || !existsSync(candidate) || !statSync(candidate).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[extname(candidate)] ?? "application/octet-stream" });
    createReadStream(candidate).pipe(response);
  });

  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  try {
    const address = server.address();
    const pages = ["/", "/ui-lab.html", "/ui-frameworks.html", "/map-grid-layout-test.html", "/map-layer-test.html", "/map-building-visibility-test.html", "/map-building-anchor-preview.html"];
    for (const page of pages) {
      if (page !== "/" && !existsSync(join(root, page.slice(1)))) continue;
      const response = await fetch(`http://127.0.0.1:${address.port}${page}`);
      if (response.ok) pass(`HTTP ${response.status}: ${page}`);
      else fail(`HTTP ${response.status}: ${page}`);
      await response.arrayBuffer();
    }
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

checkJavaScript();
checkJson();
checkReferencesAndText();
await checkHttp();

for (const message of passes) console.log(`PASS  ${message}`);
if (failures.length) {
  for (const message of failures) console.error(`FAIL  ${message}`);
  console.error(`\n${failures.length} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${passes.length} checks passed.`);
}


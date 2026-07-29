import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the SpendX mobile demo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SpendX — Mobile Experience Concept<\/title>/i);
  assert.match(html, /data-testid="welcome-screen"/);
  assert.match(html, /One card\./);
  assert.match(html, /\/brand\/card-plus-clean\.png/);
  assert.match(html, /\/brand\/card-supreme-clean\.png/);
  assert.match(html, /data-testid="support-button"/);
  assert.match(html, /aria-label="Contact SpendX support"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the supplied card artwork for every card product", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const names = ["essential", "plus", "prime", "supreme", "business"];

  for (const name of names) {
    assert.match(page, new RegExp(`image: "/brand/card-${name}-clean\\.png"`));
    await access(new URL(`../public/brand/card-${name}-clean.png`, import.meta.url));
  }

  assert.match(page, /className="spendx-card__image"/);
  assert.match(page, /src=\{plan\.image\}/);
});

test("support control opens on tap and moves after a long press", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /data-draggable="long-press"/);
  assert.match(page, /support-fab--above-nav/);
  assert.match(page, /hasBottomNavigation=\{\[/);
  assert.match(page, /onPointerDown=\{startDragIntent\}/);
  assert.match(page, /onPointerMove=\{moveSupport\}/);
  assert.match(page, /setPointerCapture\(event\.pointerId\)/);
  assert.match(page, /}, 320\);/);
  assert.match(css, /\.support-fab\s*\{[^}]*touch-action:\s*none;/s);
  assert.match(css, /\.support-fab\.is-dragging/);
});

test("language picker supports and persists the available languages", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const i18n = await readFile(
    new URL("../lib/demo-i18n.ts", import.meta.url),
    "utf8",
  );
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /data-testid="language-trigger"/);
  assert.match(page, /data-testid="language-picker"/);
  assert.match(page, /spendx-demo-language/);
  assert.match(page, /window\.localStorage\.setItem/);
  assert.match(page, /document\.documentElement\.lang/);

  for (const code of [
    "en",
    "ru",
    "uk",
    "es",
    "pt-BR",
    "fr",
    "de",
    "tr",
    "lv",
  ]) {
    assert.match(i18n, new RegExp(`code: "${code}"`));
  }

  assert.match(i18n, /Português \(Brasil\)/);
  assert.match(i18n, /Türkçe/);
  assert.match(i18n, /normalized\.startsWith\("pt-br"\)/);
  assert.match(css, /\.language-picker\s*\{/);
  assert.match(css, /\.language-list > button\.is-selected/);
});

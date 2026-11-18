import assert from "node:assert/strict";
import test from "node:test";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { pageHead, sectionPages } from "./route-catalog.ts";

const Component = () => {
  throw new Error("catalog rendered a component");
};

function fixture(addPage = false) {
  const root = createRootRoute({ component: Component });
  const page = (path, metadata) =>
    createRoute({
      getParentRoute: () => root,
      path,
      component: Component,
      ...(metadata ? { staticData: { page: metadata } } : {}),
      // Discovery must never run loaders, head callbacks, or components.
      loader: () => {
        throw new Error("catalog loaded a page");
      },
      head: () => {
        throw new Error("catalog evaluated a head callback");
      },
    });
  const nested = page("/play/nested");
  nested.addChildren([
    createRoute({
      getParentRoute: () => nested,
      path: "/",
      component: Component,
    }),
    createRoute({
      getParentRoute: () => nested,
      path: "child-page",
      component: Component,
    }),
  ]);
  const shell = createRoute({
    getParentRoute: () => root,
    id: "_shell",
    component: Component,
  });
  shell.addChildren([
    createRoute({
      getParentRoute: () => shell,
      path: "/play/under-shell",
      component: Component,
    }),
  ]);
  const writing = page("/writing");
  writing.addChildren([
    createRoute({
      getParentRoute: () => writing,
      path: "/",
      component: Component,
    }),
    createRoute({
      getParentRoute: () => writing,
      path: "flat-article",
      component: Component,
    }),
  ]);
  const metadata = {
    name: "Authored name",
    description: "Original copy",
    date: "09/01/2024",
  };
  root.addChildren([
    page("/play/"),
    page("/play/flat-page", metadata),
    nested,
    shell,
    writing,
    page("/play/$slug"),
    page("/play/$"),
    page("/play/optional/{-$id}"),
    page("/api/og"),
    page("/playground/not-in-play"),
    createRoute({
      getParentRoute: () => root,
      path: "/play/redirect",
      beforeLoad: () => {},
    }),
    ...(addPage ? [page("/play/brand-new-page")] : []),
  ]);
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory(),
  });
  return { routes: Object.values(router.routesById), metadata };
}

test("initialized native routes discover flat, nested index, nested child, and pathless-layout pages", () => {
  const { routes } = fixture();
  const pages = sectionPages(routes, "/play");
  assert.deepEqual(
    pages.map((page) => page.href),
    [
      "/play/flat-page",
      "/play/nested/child-page",
      "/play/nested",
      "/play/under-shell",
    ],
  );
  assert.equal(
    pages.find((page) => page.href === "/play/nested").name,
    "Nested",
  );
  assert.deepEqual(
    sectionPages(routes, "/writing").map((page) => page.href),
    ["/writing/flat-article"],
  );
});

test("adding a route with no authored metadata automatically adds its humanized listing", () => {
  const before = sectionPages(fixture().routes, "/play");
  const after = sectionPages(fixture(true).routes, "/play/");
  assert.equal(after.length, before.length + 1);
  assert.deepEqual(
    after.find((page) => page.href === "/play/brand-new-page"),
    {
      href: "/play/brand-new-page",
      name: "Brand new page",
      description: "",
      date: undefined,
      order: undefined,
    },
  );
});

test("native split-component references are discoverable without loading their implementation", () => {
  const root = createRootRoute();
  const component = lazyRouteComponent(async () => {
    throw new Error("catalog imported a split component");
  });
  const split = createRoute({
    getParentRoute: () => root,
    path: "/play/split-demo",
    component,
  });
  const router = createRouter({
    routeTree: root.addChildren([split]),
    history: createMemoryHistory(),
  });
  assert.equal(
    sectionPages(Object.values(router.routesById), "/play")[0].href,
    "/play/split-demo",
  );
});

test("explicit lazy routes are listed before their options or components load", () => {
  const root = createRootRoute();
  const lazy = createRoute({
    getParentRoute: () => root,
    path: "/play/explicit-lazy",
  }).lazy(async () => {
    throw new Error("catalog loaded lazy route options");
  });
  const router = createRouter({
    routeTree: root.addChildren([lazy]),
    history: createMemoryHistory(),
  });
  assert.deepEqual(
    sectionPages(Object.values(router.routesById), "/play").map(
      (page) => page.name,
    ),
    ["Explicit lazy"],
  );
});

test("metadata edits drive listing and document head from the same source", () => {
  const { routes, metadata } = fixture();
  metadata.name = "Updated title";
  metadata.description = "Updated description";
  metadata.date = "10/01/2024";
  const page = sectionPages(routes, "/play").find(
    (entry) => entry.href === "/play/flat-page",
  );
  assert.equal(page.name, metadata.name);
  assert.equal(page.description, metadata.description);
  assert.equal(page.date, metadata.date);
  assert.deepEqual(pageHead(metadata), {
    meta: [
      { title: "Updated title — Igor Bedesqui" },
      { name: "description", content: "Updated description" },
    ],
  });
  assert.deepEqual(pageHead({ name: "Button" }, "Library"), {
    meta: [{ title: "Button — Library — Igor Bedesqui" }],
  });
});

test("excludes API, params, catch-all, layouts, section index, redirects, and other sections", () => {
  const { routes } = fixture();
  const hrefs = sectionPages(routes, "/play").map((page) => page.href);
  for (const excluded of [
    "/play",
    "/play/$slug",
    "/play/$",
    "/play/optional/{-$id}",
    "/api/og",
    "/playground/not-in-play",
    "/play/redirect",
  ]) {
    assert.ok(!hrefs.includes(excluded), excluded);
  }
  assert.deepEqual(sectionPages(routes, "/api"), []);
  assert.deepEqual(sectionPages(routes, "/missing"), []);
  // A parent shell is omitted; its child index supplies the one public page.
  assert.equal(hrefs.filter((href) => href === "/play/nested").length, 1);
});

test("ordering and deduplication are stable across traversal order; legacy draft is public", () => {
  const route = (id, fullPath, page) => ({
    id,
    fullPath,
    options: { component: Component, staticData: { page } },
  });
  const routes = [
    route("/work/z", "/work/z", { name: "Zed", order: 1 }),
    route("/work/a", "/work/a", { name: "Same", order: 2 }),
    route("/work/b", "/work/b/", { name: "Same", order: 2 }),
    route("/work/axiom", "/work/axiom", { name: "Axiom", draft: true }),
    route("/work/c", "/work/c", { name: "Unranked" }),
  ];
  routes.push(
    routes[0],
    route("/work/b-alias", "/work/b", { name: "Alias must not win" }),
  );
  const pages = sectionPages(routes, "/work");
  assert.deepEqual(
    pages.map((page) => page.href),
    ["/work/z", "/work/a", "/work/b", "/work/axiom", "/work/c"],
  );
  assert.deepEqual(sectionPages([...routes].reverse(), "/work"), pages);
  assert.equal(pages.find((page) => page.href === "/work/axiom").name, "Axiom");
});

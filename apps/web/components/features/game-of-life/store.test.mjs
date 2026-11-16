import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createGameOfLifeStore,
  getNeighbourIndices,
  nextCells,
} from "./store.ts";

test("copies seeds, typed-array views, replacements, and prior snapshots", () => {
  const backing = new Uint8Array([9, 1, 0, 0, 1, 9]);
  const input = backing.subarray(1, 5);
  const store = createGameOfLifeStore(input);
  input[0] = 0;
  assert.deepEqual([...store.getState().cells], [1, 0, 0, 1]);
  const previous = store.getState().cells;
  store.getState().actions.updateCell(1, 1);
  assert.deepEqual([...previous], [1, 0, 0, 1]);
  assert.equal(backing[2], 0);
  const next = new Uint8Array(9);
  store.getState().actions.updateCells(next);
  next[0] = 1;
  assert.equal(store.getState().cells[0], 0);
  assert.equal(store.getState().gridSize, 3);
  store.getState().actions.reset();
  assert.deepEqual([...store.getState().cells], [1, 0, 0, 1]);
  assert.equal(store.getState().gridSize, 2);
});

test("empty and zero boards are supplied data; invalid boards and updates fail explicitly", () => {
  assert.equal(createGameOfLifeStore().getState().gridSize, 50);
  const empty = createGameOfLifeStore(new Uint8Array());
  assert.equal(empty.getState().gridSize, 0);
  empty.getState().actions.calculateNextState();
  empty.getState().actions.clear();
  assert.equal(empty.getState().actions.copyText(), "");
  assert.equal(
    createGameOfLifeStore(new Uint8Array(4)).getState().cells.length,
    4,
  );
  assert.throws(() => createGameOfLifeStore(new Uint8Array(3)), /square/);
  assert.throws(() => createGameOfLifeStore(new Uint8Array([2])), /0 or 1/);
  const store = createGameOfLifeStore(new Uint8Array(4));
  assert.throws(() => store.getState().actions.updateCell(-1, 1), /index/);
  assert.throws(() => store.getState().actions.updateCell(0, 2), /0 or 1/);
  assert.throws(
    () => store.getState().actions.updateCells(new Uint8Array(2)),
    /square/,
  );
  assert.equal(store.getState().cells.length, 4);
});

test("interior Conway oscillator and original corner exclusions stay unchanged", () => {
  const seed = new Uint8Array(25);
  seed[11] = seed[12] = seed[13] = 1;
  const expected = new Uint8Array(25);
  expected[7] = expected[12] = expected[17] = 1;
  assert.deepEqual(nextCells(seed), expected);
  assert.deepEqual(nextCells(expected), seed);
  assert.deepEqual(getNeighbourIndices(0, 3), [1, 3]);
  assert.deepEqual(getNeighbourIndices(8, 3), [5, 7]);
});

test("clear follows resized board; lazy copy reads the latest snapshot; stores isolate", () => {
  const a = createGameOfLifeStore(new Uint8Array(4));
  const b = createGameOfLifeStore(new Uint8Array(4));
  const copy = () => a.getState().actions.copyText();
  a.getState().actions.updateCell(0, 1);
  assert.equal(copy(), "1000");
  assert.equal(b.getState().actions.copyText(), "0000");
  a.getState().actions.updateCells(new Uint8Array(9).fill(1));
  a.getState().actions.clear();
  assert.equal(copy(), "000000000");
});

test("playback is a store capability and disposal stops only that store", (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const a = createGameOfLifeStore(new Uint8Array(9).fill(1));
  const b = createGameOfLifeStore(new Uint8Array(9).fill(1));
  a.getState().actions.setPlaying(true);
  b.getState().actions.setPlaying(true);
  const before = a.getState().cells;
  t.mock.timers.tick(100);
  assert.notStrictEqual(a.getState().cells, before);
  a.dispose();
  const stopped = a.getState().cells;
  const running = b.getState().cells;
  t.mock.timers.tick(100);
  assert.strictEqual(a.getState().cells, stopped);
  assert.notStrictEqual(b.getState().cells, running);
  assert.equal(a.getState().playing, false);
  b.dispose();
});

test("shared copy capability writes current store text and exposes clipboard failure", async () => {
  const { copyText } = await import("../../../lib/clipboard.ts");
  const store = createGameOfLifeStore(new Uint8Array(4));
  const lazyContent = store.getState().actions.copyText;
  store.getState().actions.updateCell(2, 1);
  let copied;
  await copyText(lazyContent(), {
    writeText: async (text) => {
      copied = text;
    },
  });
  assert.equal(copied, "0010");
  await assert.rejects(
    copyText(lazyContent(), {
      writeText: async () => {
        throw new Error("denied");
      },
    }),
    /denied/,
  );
});

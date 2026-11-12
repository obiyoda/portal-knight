import test from 'node:test';
import assert from 'node:assert/strict';
import { MOVE, spawnPlayer, stepPlayer } from '../src/movement.js';
import { LEVELS } from '../src/levels.js';

test('both gaps have generous jump room and can be crossed from before the edge', () => {
  for (let i = 0; i < 2; i++) {
    const origin = LEVELS[0].platforms[i];
    const landing = LEVELS[0].platforms[i + 1];
    const p = { ...spawnPlayer(), x: origin.right - 30, y: origin.top - MOVE.height / 2 };
    stepPlayer(p, { direction: 1, jump: true }, 1 / 120);
    for (let i = 0; i < 100 && !p.grounded; i++) stepPlayer(p, { direction: 1, jump: false }, 1 / 120);
    assert.equal(p.grounded, true);
    assert.ok(p.x > landing.left);
    assert.equal(p.y + MOVE.height / 2, landing.top);
  }
});

test('raised platforms block movement through their sides in either direction', () => {
  const raised = LEVELS[0].platforms[1];
  for (const direction of [-1, 1]) {
    const x = direction > 0 ? raised.left - MOVE.width / 2 - 1 : raised.right + MOVE.width / 2 + 1;
    const p = { ...spawnPlayer(), x, grounded: false, coyote: 0 };
    for (let frame = 0; frame < 10; frame++) stepPlayer(p, { direction, jump: false }, 1 / 120);
    assert.equal(p.x, direction > 0 ? raised.left - MOVE.width / 2 : raised.right + MOVE.width / 2);
  }
});

test('walking into a gap falls; jumping again in midair does not create a second jump', () => {
  const p = { ...spawnPlayer(), x: 335, grounded: false, coyote: 0 };
  stepPlayer(p, { direction: 0, jump: true }, 1 / 120);
  assert.ok(p.vy > 0);
  let fell = false;
  for (let i = 0; i < 180; i++) fell ||= stepPlayer(p, { direction: 0, jump: false }, 1 / 120);
  assert.equal(fell, true);
});

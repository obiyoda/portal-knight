import test from 'node:test';
import assert from 'node:assert/strict';
import { createRound, stepRound, startSwing } from '../src/round.js';

const idle = { direction: 0, jump: false, attack: false };
const dt = 1 / 120;
const playing = () => ({ ...createRound(), phase: 'playing' });

test('sword defeats an enemy in front before contact damage, but not one behind', () => {
  const r = playing();
  r.player.x = 500;
  r.enemies[0].x = 520;
  stepRound(r, { ...idle, attack: true }, dt);
  assert.equal(r.enemies[0].alive, false);
  assert.equal(r.hearts, 3);

  const behind = playing();
  behind.player.x = 540;
  behind.enemies[0].x = 520;
  stepRound(behind, { ...idle, attack: true }, dt);
  assert.equal(behind.enemies[0].alive, true);
  assert.equal(behind.hearts, 2);
  assert.equal(behind.player.x, 90);
});

test('sword respects its cooldown and its vertical reach', () => {
  const r = playing();
  r.player.x = 500;
  r.player.y = 270;
  startSwing(r);
  assert.equal(startSwing(r), false);
  stepRound(r, idle, dt);
  assert.equal(r.enemies[0].alive, true);
});

test('three falls cost three hearts, return to start, and end the round', () => {
  const r = playing();
  for (let hearts = 2; hearts >= 0; hearts--) {
    r.player.y = 600;
    stepRound(r, idle, dt);
    assert.equal(r.hearts, hearts);
    assert.equal(r.player.x, 90);
  }
  assert.equal(r.phase, 'lost');
  stepRound(r, { ...idle, direction: 1 }, dt);
  assert.equal(r.player.x, 90);
  const fresh = createRound();
  assert.equal(fresh.hearts, 3);
  assert.ok(fresh.enemies.every(e => e.alive));
});

test('portal wins, and idle title screens do not run enemies', () => {
  const ready = createRound();
  const startingX = ready.enemies[0].x;
  stepRound(ready, idle, 1);
  assert.equal(ready.enemies[0].x, startingX);
  const r = playing();
  r.player.x = r.level.width - 100;
  r.player.y = r.level.platforms.at(-1).top - 19;
  stepRound(r, idle, dt);
  assert.equal(r.phase, 'won');
});

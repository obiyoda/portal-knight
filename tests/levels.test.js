import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from '../src/levels.js';
import { MOVE, spawnPlayer, stepPlayer } from '../src/movement.js';
import { createRound, stepRound } from '../src/round.js';

test('later levels are longer and add enemies and gaps', () => {
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(LEVELS[i].width > LEVELS[i - 1].width);
    assert.ok(LEVELS[i].platforms.length > LEVELS[i - 1].platforms.length);
    assert.ok(LEVELS[i].enemies.length > LEVELS[i - 1].enemies.length);
  }
});

test('every uphill and downhill gap allows several takeoff points and a clear landing', () => {
  for (const level of LEVELS) {
    for (let i = 0; i < level.platforms.length - 1; i++) {
      const edge = level.platforms[i].right;
      const landing = level.platforms[i + 1];
      assert.ok(landing.left - edge <= 110);
      assert.ok(Math.abs(level.platforms[i].top - landing.top) <= 40);
      for (const takeoff of [20, 30, 40]) {
        const player = { ...spawnPlayer(level), x: edge - takeoff, y: level.platforms[i].top - MOVE.height / 2 };
        stepPlayer(player, { direction: 1, jump: true }, 1 / 120, level);
        for (let frame = 0; frame < 110 && !player.grounded; frame++) {
          stepPlayer(player, { direction: 1, jump: false }, 1 / 120, level);
        }
        assert.equal(player.grounded, true);
        assert.ok(player.x > landing.left && player.x < landing.right, `${level.name}, gap ${i + 1}, takeoff ${takeoff}`);
        assert.equal(player.y + MOVE.height / 2, landing.top);
        for (const enemy of level.enemies) {
          if (enemy.left >= landing.left && enemy.right <= landing.right) {
            assert.ok(enemy.left - 15 > player.x + 13, 'Patrol leaves room to land');
          }
        }
      }
    }
  }
});

test('each portal can be reached beyond the first screen and retry creates a fresh level', () => {
  for (let index = 0; index < LEVELS.length; index++) {
    const round = createRound(index);
    round.phase = 'playing';
    round.player.x = round.level.width - 100;
    round.player.y = round.level.platforms.at(-1).top - MOVE.height / 2;
    stepRound(round, { direction: 0, jump: false, attack: false }, 1 / 120);
    assert.equal(round.phase, 'won');
    round.enemies[0].alive = false;
    const retry = createRound(index);
    assert.equal(retry.levelIndex, index);
    assert.equal(retry.hearts, 3);
    assert.equal(retry.enemies[0].alive, true);
    assert.equal(retry.player.x, 90);
  }
});

test('enemies stand on their platforms and patrol away from landing and portal space', () => {
  assert.equal(LEVELS.length, 6);
  for (const level of LEVELS) {
    assert.ok(new Set(level.platforms.map(p => p.top)).size > 1);
    assert.ok(new Set(level.platforms.map(p => p.right - p.left)).size > 1);
    for (const enemy of level.enemies) {
      const ground = level.platforms.find(p => enemy.left >= p.left && enemy.right <= p.right);
      assert.ok(ground);
      assert.equal(enemy.y + 16, ground.top);
      assert.ok(enemy.left < enemy.right);
      assert.ok(enemy.x >= enemy.left && enemy.x <= enemy.right);
    }
  }
});

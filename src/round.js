import { spawnPlayer, stepPlayer } from './movement.js';
import { LEVELS } from './levels.js';

export function createRound(levelIndex = 0) {
  const level = LEVELS[levelIndex];
  return {
    levelIndex, level,
    player: spawnPlayer(level), hearts: 3, phase: 'ready', facing: 1,
    attackFacing: 1, swing: 0, cooldown: 0, invulnerable: 0,
    notice: 'Reach the portal. Space swings your sword!',
    enemies: level.enemies.map(enemy => ({ ...enemy }))
  };
}

export function startSwing(round) {
  if (round.phase !== 'playing' || round.cooldown > 0) return false;
  round.swing = 0.18;
  round.cooldown = 0.34;
  round.attackFacing = round.facing;
  return true;
}

function loseHeart(round, reason) {
  round.hearts -= 1;
  round.player = spawnPlayer(round.level);
  round.swing = 0;
  round.invulnerable = 1.4;
  round.facing = 1;
  if (round.hearts === 0) {
    round.phase = 'lost';
    round.notice = 'Out of hearts! Press Enter or choose Retry.';
  } else {
    round.notice = `${reason} Back to the start — ${round.hearts} hearts left.`;
  }
}

export function stepRound(round, input, dt) {
  if (round.phase !== 'playing') return;
  round.cooldown = Math.max(0, round.cooldown - dt);
  round.invulnerable = Math.max(0, round.invulnerable - dt);
  if (input.direction) round.facing = input.direction;
  if (input.attack) startSwing(round);
  if (stepPlayer(round.player, input, dt, round.level)) {
    // Falling always costs a heart, even during the contact grace period.
    loseHeart(round, 'You fell!');
    return;
  }

  for (const enemy of round.enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.direction * 48 * dt;
    if (enemy.x <= enemy.left || enemy.x >= enemy.right) {
      enemy.x = Math.max(enemy.left, Math.min(enemy.right, enemy.x));
      enemy.direction *= -1;
    }
    const dx = enemy.x - round.player.x;
    const dy = Math.abs(enemy.y - round.player.y);
    // Resolve the sword first, so a successful hit protects the player.
    const inFront = dx * round.attackFacing >= -4;
    if (round.swing > 0 && inFront && Math.abs(dx) < 74 && dy < 39) {
      enemy.alive = false;
      round.notice = 'Enemy defeated! Keep going toward the portal.';
    } else if (Math.abs(dx) < 27 && dy < 33 && round.invulnerable === 0) {
      loseHeart(round, 'An enemy hit you!');
      return;
    }
  }
  round.swing = Math.max(0, round.swing - dt);
  if (round.player.x >= round.level.width - 110 && round.player.grounded) {
    round.phase = 'won';
    round.notice = round.levelIndex === LEVELS.length - 1
      ? `All ${LEVELS.length} portals reached! Press Enter to play again.`
      : 'Portal reached! Press Enter for the next level.';
  }
}

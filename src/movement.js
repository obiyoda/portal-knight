import { LEVELS } from './levels.js';

// Distances are pixels and speeds are pixels per second.
export const MOVE = { speed: 250, jump: 520, gravity: 1400, width: 26, height: 38 };
export function spawnPlayer(level = LEVELS[0]) {
  return { x: 90, y: level.platforms[0].top - MOVE.height / 2, vy: 0, grounded: true, coyote: 0.1, buffer: 0 };
}

export function stepPlayer(player, input, dt, level = LEVELS[0]) {
  player.buffer = input.jump ? 0.12 : Math.max(0, player.buffer - dt);
  player.coyote = player.grounded ? 0.1 : Math.max(0, player.coyote - dt);
  if (player.buffer > 0 && player.coyote > 0) {
    player.vy = -MOVE.jump;
    player.buffer = 0;
    player.coyote = 0;
    player.grounded = false;
  }
  const previousFeet = player.y + MOVE.height / 2;
  const previousX = player.x;
  player.x = Math.max(MOVE.width / 2, Math.min(level.width - MOVE.width / 2, player.x + input.direction * MOVE.speed * dt));
  // Raised terrain has solid sides: a late jump cannot pass through a cliff.
  for (const platform of level.platforms) {
    if (previousFeet <= platform.top || player.y - MOVE.height / 2 >= 540) continue;
    if (previousX + MOVE.width / 2 <= platform.left && player.x + MOVE.width / 2 > platform.left) {
      player.x = platform.left - MOVE.width / 2;
    } else if (previousX - MOVE.width / 2 >= platform.right && player.x - MOVE.width / 2 < platform.right) {
      player.x = platform.right + MOVE.width / 2;
    }
  }
  player.vy += MOVE.gravity * dt;
  player.y += player.vy * dt;
  player.grounded = false;
  // Land only when crossing a platform's top from above.
  for (const platform of level.platforms) {
    const overlaps = player.x + MOVE.width / 2 > platform.left && player.x - MOVE.width / 2 < platform.right;
    if (overlaps && player.vy >= 0 && previousFeet <= platform.top && player.y + MOVE.height / 2 >= platform.top) {
      player.y = platform.top - MOVE.height / 2;
      player.vy = 0;
      player.grounded = true;
    }
  }
  return player.y > 590;
}

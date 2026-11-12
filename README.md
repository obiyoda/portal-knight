# Portal Knight

[Play the game](https://obiyoda.github.io/portal-knight/) · [Source code](https://github.com/obiyoda/portal-knight)

A learning project built one playable milestone at a time with Phaser 4.2.1 and Vite.

```sh
git clone https://github.com/obiyoda/portal-knight.git
cd portal-knight
npm ci
npm run dev
```

Open http://127.0.0.1:5175/. Choose Start or press Enter. Use left/right arrows to walk, up to jump, Space to swing your sword, and R to restart.
Six levels grow into a scrolling journey, with 2, 3, 5, 6, 7, then 8 gaps and enemies. Platforms vary in height and length. Upward steps are at most 40 pixels, and gaps stay between 90 and 110 pixels.

Swing toward enemies before touching them. Jump before the edge to reach raised platforms. Enemy contact or falling costs one heart and returns you to the current level's start. Defeated enemies stay defeated until restarting. Reach the portal and press Enter or choose Next level. Each new level gives you three hearts. Retry after losing all three hearts, or press R to restart the current level. Complete level six to win the adventure.

## Learn from the code

- `src/movement.js`: walking, gravity, jumping and landing. Change `MOVE.speed` or `MOVE.jump` to experiment, then reload and predict how a jump will change.
- `src/main.js`: the Phaser scene draws the world and reads the keyboard each frame.
- `src/round.js`: sword reach, enemy patrols, heart loss and win/lose rules.
- `src/levels.js`: each terrain pair gives a platform's length and top height. A smaller top number means a higher platform. Enemy patrols follow these heights automatically. Add challenge by adding platforms and enemies while keeping gaps short enough to jump.
- `JAM.md`: approved design and the next milestones.

Run `npm test` for the movement and combat checks and `npm run build` to create `dist/`. `npm run preview` serves the production build at http://127.0.0.1:4175/.

All visuals are original code-drawn shapes; no external assets are used.

Use Node.js 24 LTS. Pushing to `main` runs tests and the production build, then publishes `dist/` to GitHub Pages through `.github/workflows/pages.yml`. Enable GitHub Actions as the Pages source in the repository settings when setting up a fork.

MIT licensed; see `LICENSE`. Phaser and Vite are also MIT licensed.

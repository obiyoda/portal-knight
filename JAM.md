# Portal Knight

Learning project; no jam or deadline. Design approved by the player.

Concept: You swing a sword and jump gaps to reach a portal while enemies guard the way.

Controls: left/right arrows move, up arrow jumps, Space swings the sword. R retries.

Opening: starting platform on the left; two gaps and two enemies along the path; portal on the right.

Rules: three hearts. Enemy contact or falling costs one heart and returns the player to the starting platform. Zero hearts offers a level retry. A portal advances the level. Later levels get longer and add enemies and gaps, with comfortable jump distances and landing space.

## Milestones
1. Movement practice: walk, jump two gaps, return to start after a fall, reach a finish marker. Player check: cross both gaps and report how jumping feels.
2. Full round: sword, enemies, hearts, portal, loss and retry. Player check: fight, take damage, reach a portal and retry after losing all hearts.
3. Progression and polish: longer levels with more gaps and enemies; readable instructions and feedback; test a production build. Player check: complete consecutive levels and judge jump fairness.

Stretch (cut first): music, enemy varieties, collectibles, checkpoints, extra animations.

## Milestone 1
Completed. Player reports movement worked well; approved jump feel retained for milestone 2.
Verification: movement checks, JavaScript syntax checks and production build pass. Interactive browser testing unavailable because the browser access host is unavailable. Development server: http://127.0.0.1:5175/.
Jump speed 520, gravity 1400, walking speed 250: about 186 pixels of same-height travel. Gaps are 100 and 110 pixels. Includes a short grace period after leaving an edge and a short jump input buffer.

Original shapes only; no external artwork, fonts or audio. Existing projects preserved.

## Milestone 2
Completed. Player reports combat worked. Includes title/start, Space sword swing with a short cooldown, two patrolling enemies, three hearts, return to start on damage, brief contact protection after damage, portal victory, loss and retry. Defeated enemies stay defeated until restarting the level.

Player check: defeat an enemy with Space, take an enemy hit and check heart loss and return to start, reach the portal, then retry and lose all three hearts. Report whether sword reach and enemy speed feel fair before adding progression.

Verification: movement and combat checks, JavaScript syntax checks and production build pass. Interactive browser verification remains pending; browser access was unavailable in this session.

## Milestone 3
Completed the initial three-level playtest. Player reports it worked well and requests varied platform heights and lengths, plus more levels.

Expanded to six levels with 2 / 3 / 5 / 6 / 7 / 8 gaps and enemies. Platforms vary in length and top height, with uphill and downhill sections, 90–110 pixel gaps and height changes up to 40 pixels. Enemy positions, portal heights and terrain rendering follow their platform heights. Raised terrain has solid sides. Movement settings remain unchanged.

The camera follows the player and keeps instructions and hearts visible. Enemy patrols leave clear landing room. At each portal, Enter or Next level advances; the final portal offers Play again. Each level starts with three hearts. R and Retry level restart the current level.

Checks: simulate every uphill and downhill gap from 20, 30 and 40 pixels before the edge, including correct landing heights and clear enemy patrol space. Verify increasing level size and enemy counts, terrain side collisions, enemies standing on their platforms, portal victory at every final platform height, fresh retry state, combat and heart rules. Browser playtest pending: try the varied heights and the three added levels.

Movement, combat and level checks pass, along with JavaScript syntax checks and the production build. Browser access was checked again and remains unavailable. Production output is ready in `dist/`.

## Sharing
Public GitHub repository and GitHub Pages publication requested by the player. Source: https://github.com/obiyoda/portal-knight · Play: https://obiyoda.github.io/portal-knight/. The Pages workflow runs tests and builds before deployment.

// Each pair is [platform length, top height]. Smaller top values are higher.
// Upward steps stay within 40 pixels; gaps stay between 90 and 110 pixels.
function makeLevel(name, terrain, gaps) {
  let left = 0;
  const platforms = terrain.map(([length, top], index) => {
    const platform = { left, right: left + length, top };
    left = platform.right + (gaps[index] ?? 0);
    return platform;
  });
  const enemies = platforms.slice(1).map((platform, index) => {
    const patrolLeft = platform.left + 145;
    const patrolRight = platform.right - (index === platforms.length - 2 ? 130 : 45);
    return {
      x: (patrolLeft + patrolRight) / 2, y: platform.top - 16,
      left: patrolLeft, right: patrolRight, direction: -1, alive: true
    };
  });
  return { name, width: platforms.at(-1).right, platforms, enemies };
}

export const LEVELS = [
  makeLevel('The First Crossing',
    [[290, 400], [260, 370], [340, 400]], [100, 100]),
  makeLevel('Moonlit Steps',
    [[290, 400], [280, 360], [300, 390], [360, 350]], [100, 100, 100]),
  makeLevel('The Rolling Hills',
    [[290, 400], [260, 370], [270, 330], [270, 370], [280, 410], [360, 380]],
    [100, 100, 90, 100, 100]),
  makeLevel('Starlit Ridge',
    [[290, 400], [280, 360], [320, 390], [270, 350], [300, 320], [280, 360], [380, 390]],
    [100, 90, 100, 100, 110, 100]),
  makeLevel('The Silver Stair',
    [[290, 400], [300, 370], [280, 330], [320, 360], [270, 400], [300, 360], [280, 330], [380, 370]],
    [100, 100, 90, 110, 100, 100, 90]),
  makeLevel('The Last Ascent',
    [[290, 400], [280, 360], [300, 390], [270, 350], [320, 310], [280, 350], [300, 390], [280, 350], [400, 320]],
    [100, 100, 100, 90, 110, 100, 100, 100])
];

import Phaser from 'phaser';
import './style.css';
import { LEVELS } from './levels.js';
import { createRound, stepRound } from './round.js';

class Adventure extends Phaser.Scene {
  constructor() { super('Adventure'); }

  create(data = {}) {
    this.round = createRound(data.levelIndex ?? 0);
    if (data.autoStart) this.round.phase = 'playing';
    const level = this.round.level;
    this.accumulator = 0;
    this.pendingJump = false;
    this.pendingAttack = false;
    this.keys = this.input.keyboard.createCursorKeys();
    this.retry = this.input.keyboard.addKey('R');
    this.enter = this.input.keyboard.addKey('ENTER');
    this.input.keyboard.addCapture('UP,LEFT,RIGHT,SPACE');
    this.game.events.on('blur', this.clearInput, this);
    this.events.once('shutdown', () => this.game.events.off('blur', this.clearInput, this));
    this.action = document.querySelector('#action');
    const onAction = () => {
      this.handleAction();
      document.querySelector('#game').focus();
    };
    this.action.addEventListener('click', onAction);
    this.events.once('shutdown', () => this.action.removeEventListener('click', onAction));

    this.add.circle(780, 120, 48, 0xc3eee3, 0.12).setScrollFactor(0);
    this.add.circle(780, 120, 30, 0xc3eee3, 0.8).setScrollFactor(0);
    for (let i = 0; i < 28; i++) {
      this.add.circle(30 + (i * 137) % 900, 75 + (i * 43) % 225, i % 3 === 0 ? 2 : 1, 0xb3d1db, 0.55).setScrollFactor(0);
    }
    for (let i = 0; i < 7; i++) {
      this.add.triangle(i * 180, 360, 0, 190, 120, 0, 240, 190, 0x203953).setOrigin(0.5, 0.5).setScrollFactor(0);
    }
    for (const platform of level.platforms) {
      const width = platform.right - platform.left;
      this.add.rectangle(platform.left, platform.top, width, 540 - platform.top, 0x344451).setOrigin(0);
      this.add.rectangle(platform.left, platform.top, width, 12, 0x81c6a3).setOrigin(0);
      this.add.rectangle(platform.left, platform.top + 12, width, 12, 0x4f8174).setOrigin(0);
      for (let x = platform.left + 20; x < platform.right; x += 45) {
        this.add.rectangle(x, platform.top + 45 + (x % 3) * 15, 15, 5, 0x465966);
      }
    }
    this.add.text(36, 30, level.name.toUpperCase(), { fontFamily: 'monospace', fontSize: '18px', color: '#d7e9ee' }).setScrollFactor(0);
    this.add.text(36, 58, `Level ${this.round.levelIndex + 1} / ${LEVELS.length} · Reach the portal →`, { fontFamily: 'monospace', fontSize: '13px', color: '#9bb6c5' }).setScrollFactor(0);
    this.hearts = this.add.text(920, 32, '', { fontFamily: 'monospace', fontSize: '22px', color: '#ffa79b' }).setOrigin(1, 0).setScrollFactor(0);
    this.add.text(70, level.platforms[0].top + 35, 'START', { fontFamily: 'monospace', fontSize: '12px', color: '#a2c9bf' });
    for (let i = 0; i < level.platforms.length - 1; i++) {
      const gapX = (level.platforms[i].right + level.platforms[i + 1].left) / 2;
      this.add.text(gapX, 470, `GAP ${i + 1}`, { fontFamily: 'monospace', fontSize: '12px', color: '#8cabbc' }).setOrigin(0.5);
    }
    const portalX = level.width - 90;
    const portalTop = level.platforms.at(-1).top;
    this.add.ellipse(portalX, portalTop - 42, 60, 84, 0x88efd1, 0.1).setStrokeStyle(3, 0x88efd1);
    this.add.ellipse(portalX, portalTop - 42, 36, 60, 0x88efd1, 0.12);
    this.add.text(portalX, portalTop + 35, 'PORTAL', { fontFamily: 'monospace', fontSize: '12px', color: '#a2c9bf' }).setOrigin(0.5, 0);
    this.message = this.add.text(480, 140, '', {
      fontFamily: 'monospace', fontSize: '18px', color: '#e4f3ed', align: 'center', wordWrap: { width: 800 }
    }).setOrigin(0.5).setScrollFactor(0);
    this.enemyArt = this.add.graphics();
    this.knight = this.add.graphics();
    this.syncUI();
    this.drawEnemies();
    this.drawKnight();
    this.cameras.main.setBounds(0, 0, level.width, 540);
    this.cameras.main.setScroll(0, 0);
  }

  handleAction() {
    const { phase, levelIndex } = this.round;
    if (phase === 'ready') {
      this.round.phase = 'playing';
      this.syncUI();
    } else {
      const next = phase === 'won' ? (levelIndex + 1) % LEVELS.length : levelIndex;
      this.scene.restart({ levelIndex: next, autoStart: true });
    }
  }

  clearInput() {
    this.input.keyboard.resetKeys();
    this.pendingJump = false;
    this.pendingAttack = false;
    this.accumulator = 0;
  }

  drawKnight() {
    const { player, facing, swing, attackFacing, invulnerable } = this.round;
    const g = this.knight;
    g.clear();
    g.fillStyle(0x122138);
    g.fillRect(-14, -18, 28, 38);
    g.fillStyle(0xe4bc79);
    g.fillRect(-10, -17, 20, 15);
    g.fillStyle(0x91b9c9);
    g.fillRect(-12, -19, 24, 8);
    g.fillRect(-10, 0, 20, 13);
    g.fillStyle(0x24324b);
    g.fillRect(facing > 0 ? 2 : -9, -10, 7, 4);
    g.fillRect(-10, 13, 8, 6);
    g.fillRect(2, 13, 8, 6);
    g.fillStyle(0xe98476);
    g.fillRect(-11, -2, 22, 5);
    if (swing > 0) {
      const side = attackFacing;
      g.lineStyle(7, 0x9de9e1, 0.55);
      g.beginPath();
      g.arc(0, 0, 60, side > 0 ? -0.9 : Math.PI - 0.9, side > 0 ? 0.9 : Math.PI + 0.9);
      g.strokePath();
      g.fillStyle(0xf2f6e8);
      g.fillRect(side > 0 ? 17 : -65, -4, 48, 7);
      g.fillStyle(0xe4bc79);
      g.fillRect(side > 0 ? 15 : -22, -10, 7, 20);
    } else {
      g.fillStyle(0xe4bc79);
      g.fillRect(facing > 0 ? 13 : -18, 3, 5, 13);
    }
    g.setAlpha(invulnerable > 0 && Math.floor(invulnerable * 12) % 2 ? 0.4 : 1);
    g.setPosition(Math.round(player.x), Math.round(player.y));
  }

  drawEnemies() {
    const g = this.enemyArt;
    g.clear();
    for (const enemy of this.round.enemies) {
      if (!enemy.alive) continue;
      g.fillStyle(0x152135);
      g.fillEllipse(enemy.x, enemy.y + 16, 38, 9);
      g.fillStyle(0xb979aa);
      g.fillRoundedRect(enemy.x - 15, enemy.y - 14, 30, 28, 8);
      g.fillStyle(0xeec5d9);
      g.fillRect(enemy.x - 9, enemy.y - 8, 6, 6);
      g.fillRect(enemy.x + 3, enemy.y - 8, 6, 6);
      g.fillStyle(0x253248);
      g.fillRect(enemy.x - 6, enemy.y - 6, 3, 4);
      g.fillRect(enemy.x + 6, enemy.y - 6, 3, 4);
    }
  }

  syncUI() {
    const { phase, hearts, notice, levelIndex } = this.round;
    this.hearts.setText('♥ '.repeat(hearts) + '♡ '.repeat(3 - hearts));
    this.message.setText(phase === 'ready' ? 'PORTAL KNIGHT\nPress Enter or choose Start to play.' : notice);
    this.action.textContent = phase === 'ready' ? 'Start' : phase === 'lost' ? 'Retry level' : phase === 'won' ? (levelIndex < LEVELS.length - 1 ? 'Next level' : 'Play again') : 'Restart level';
    const status = document.querySelector('#status');
    const text = `Level ${levelIndex + 1} of ${LEVELS.length}. ${hearts} hearts. ${phase === 'ready' ? 'Ready to play.' : notice}`;
    if (status.textContent !== text) status.textContent = text;
  }

  update(_time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.retry)) { this.scene.restart({ levelIndex: this.round.levelIndex, autoStart: true }); return; }
    if (Phaser.Input.Keyboard.JustDown(this.enter)) {
      if (this.round.phase !== 'playing') { this.handleAction(); return; }
    }
    if (this.round.phase !== 'playing') return;
    this.pendingJump ||= Phaser.Input.Keyboard.JustDown(this.keys.up);
    this.pendingAttack ||= Phaser.Input.Keyboard.JustDown(this.keys.space);
    const direction = Number(this.keys.right.isDown) - Number(this.keys.left.isDown);
    // Small fixed steps keep jumps consistent on fast and slow displays.
    this.accumulator += Math.min(delta / 1000, 0.05);
    while (this.accumulator >= 1 / 120) {
      stepRound(this.round, { direction, jump: this.pendingJump, attack: this.pendingAttack }, 1 / 120);
      this.pendingJump = false;
      this.pendingAttack = false;
      this.accumulator -= 1 / 120;
    }
    this.drawKnight();
    this.drawEnemies();
    this.syncUI();
    // Keep the player left of centre, leaving room to see the next landing.
    this.cameras.main.scrollX = Phaser.Math.Clamp(this.round.player.x - 360, 0, this.round.level.width - 960);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#172942',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  audio: { noAudio: true },
  scene: Adventure
});

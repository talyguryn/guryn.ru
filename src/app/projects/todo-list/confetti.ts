'use strict';

const PI_2 = Math.PI * 2;
const CONFETTI_NUMBER = 600;
const CONFETTI_COLORS: [number, number, number][] = [
  [100, 50, 250],
  [255, 60, 120],
  [255, 140, 0],
  [255, 205, 0],
  [0, 200, 70],
  [0, 125, 255],
  [255, 0, 40],
];

const range = (a: number, b: number): number => (b - a) * Math.random() + a;

class ConfettiItem {
  context: CanvasRenderingContext2D;
  w: number;
  h: number;
  style: [number, number, number];
  rgb: string;
  r: number;
  r2: number;
  opacity!: number;
  dop!: number;
  x!: number;
  y!: number;
  ystart!: number;
  xmax!: number;
  ymax!: number;
  vx!: number;
  vy!: number;
  vxdir!: number;
  vxmin!: number;
  vymin!: number;
  vxspeed!: number;
  vyspeed!: number;
  time!: number;

  constructor(context: CanvasRenderingContext2D, w: number, h: number) {
    this.context = context;
    this.w = w;
    this.h = h;
    this.style = CONFETTI_COLORS[Math.floor(range(0, CONFETTI_COLORS.length))];
    this.rgb = `rgba(${this.style[0]}, ${this.style[1]}, ${this.style[2]}`;
    this.r = Math.floor(range(3, 10));
    this.r2 = 2 * this.r;
    this.replace();
  }

  replace(): void {
    this.opacity = 1;
    this.dop = 0.03 * range(1, 4);
    this.x = this.w / 2;
    this.y = range(-this.h * 1.5, -this.h / 2);
    this.ystart = this.y;
    this.xmax = this.w - this.r;
    this.ymax = this.h - this.r;
    this.vx = range(-30, 30);
    this.vy = Math.floor(range(25, 45));
    this.vxdir = this.vx > 0 ? 1 : -1;
    this.vxmin = this.vx / 15;
    this.vymin = Math.floor(range(6, 10));
    this.vxspeed = -Math.abs(this.vx / 40);
    this.vyspeed = -Math.abs(this.vy / 40);
    this.time = 0;
  }

  draw(): void {
    this.time++;
    this.x += this.vx;
    this.y += this.vy;
    this.vx += this.vxspeed * this.vxdir;
    this.vxspeed /= 1.03;
    this.vy += this.vyspeed;
    this.vyspeed = this.time < 60 ? this.vyspeed / 1.03 : 0.1;
    if (this.x < 0 || this.x > this.xmax) this.opacity = 0;
    this.drawCircle(
      Math.floor(this.x),
      Math.floor(this.y),
      this.r,
      `${this.rgb},${this.opacity})`
    );
  }

  drawCircle(x: number, y: number, r: number, style: string): void {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, PI_2, false);
    this.context.fillStyle = style;
    this.context.fill();
  }
}

class Confetti {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  confetti: ConfettiItem[];
  w!: number;
  h!: number;

  constructor() {
    const confettiElement = document.createElement('canvas');
    confettiElement.id = 'confetti';
    confettiElement.style.position = 'fixed';
    confettiElement.style.top = '0';
    confettiElement.style.left = '0';
    confettiElement.style.pointerEvents = 'none';
    confettiElement.style.zIndex = '999999';
    confettiElement.style.width = '100%';
    confettiElement.style.height = '100%';
    document.body.appendChild(confettiElement);

    this.canvas = document.getElementById('confetti') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.confetti = [];

    window.addEventListener('resize', this.init.bind(this));

    this.init();
    this.start();

    setTimeout(() => {
      document.body.removeChild(confettiElement);
    }, 10000);
  }

  init(): void {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  start(): void {
    for (let i = 0; i < CONFETTI_NUMBER; i++) {
      this.confetti.push(new ConfettiItem(this.context, this.w, this.h));
    }
    this.draw();
  }

  draw(): void {
    window.requestAnimationFrame(this.draw.bind(this));
    this.context.clearRect(0, 0, this.w, this.h);
    this.confetti.forEach((confettiItem) => confettiItem.draw());
  }
}

export default Confetti;

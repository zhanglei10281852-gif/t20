import * as THREE from "three";

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  return [canvas, ctx];
}

function noise2D(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number = 0): number {
  const corners =
    (noise2D(x - 1, y - 1, seed) +
      noise2D(x + 1, y - 1, seed) +
      noise2D(x - 1, y + 1, seed) +
      noise2D(x + 1, y + 1, seed)) /
    16;
  const sides =
    (noise2D(x - 1, y, seed) +
      noise2D(x + 1, y, seed) +
      noise2D(x, y - 1, seed) +
      noise2D(x, y + 1, seed)) /
    8;
  const center = noise2D(x, y, seed) / 4;
  return corners + sides + center;
}

function interpolatedNoise(
  x: number,
  y: number,
  seed: number = 0,
): number {
  const intX = Math.floor(x);
  const fracX = x - intX;
  const intY = Math.floor(y);
  const fracY = y - intY;

  const v1 = smoothNoise(intX, intY, seed);
  const v2 = smoothNoise(intX + 1, intY, seed);
  const v3 = smoothNoise(intX, intY + 1, seed);
  const v4 = smoothNoise(intX + 1, intY + 1, seed);

  const i1 = v1 * (1 - fracX) + v2 * fracX;
  const i2 = v3 * (1 - fracX) + v4 * fracX;

  return i1 * (1 - fracY) + i2 * fracY;
}

function perlinNoise(
  x: number,
  y: number,
  octaves: number = 4,
  seed: number = 0,
): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += interpolatedNoise(x * frequency, y * frequency, seed + i * 100) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / maxValue;
}

function lerpColor(
  color1: string,
  color2: string,
  t: number,
): string {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  const r = Math.round(c1.r * (1 - t) + c2.r * t);
  const g = Math.round(c1.g * (1 - t) + c2.g * t);
  const b = Math.round(c1.b * (1 - t) + c2.b * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function generateEarthTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#1a4f7a");
  gradient.addColorStop(0.5, "#2563eb");
  gradient.addColorStop(1, "#1e40af");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 15; i++) {
    const cx = (i / 15) * w + Math.random() * 30;
    const cy = h * 0.3 + Math.random() * h * 0.5;
    const radius = 20 + Math.random() * 60;

    ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#16a34a";
    ctx.beginPath();

    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const r = radius * (0.7 + Math.random() * 0.6);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r * 0.6;
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * w;
    const cy = h * 0.2 + Math.random() * h * 0.6;
    const rx = 15 + Math.random() * 35;
    const ry = 8 + Math.random() * 15;

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const polarGradient1 = ctx.createLinearGradient(0, 0, 0, h * 0.15);
  polarGradient1.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  polarGradient1.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = polarGradient1;
  ctx.fillRect(0, 0, w, h * 0.15);

  const polarGradient2 = ctx.createLinearGradient(0, h * 0.85, 0, h);
  polarGradient2.addColorStop(0, "rgba(255, 255, 255, 0)");
  polarGradient2.addColorStop(1, "rgba(255, 255, 255, 0.9)");
  ctx.fillStyle = polarGradient2;
  ctx.fillRect(0, h * 0.85, w, h * 0.15);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateJupiterTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const bands = [
    { y: 0, color: "#c9a86c", height: 0.08 },
    { y: 0.08, color: "#e8d5b7", height: 0.12 },
    { y: 0.2, color: "#d4a574", height: 0.1 },
    { y: 0.3, color: "#f0e0c0", height: 0.15 },
    { y: 0.45, color: "#c9a86c", height: 0.1 },
    { y: 0.55, color: "#e8d5b7", height: 0.15 },
    { y: 0.7, color: "#d4a574", height: 0.12 },
    { y: 0.82, color: "#f0e0c0", height: 0.1 },
    { y: 0.92, color: "#c9a86c", height: 0.08 },
  ];

  bands.forEach((band) => {
    const gradient = ctx.createLinearGradient(0, band.y * h, 0, (band.y + band.height) * h);
    gradient.addColorStop(0, band.color);
    gradient.addColorStop(0.5, lerpColor(band.color, "#ffffff", 0.1));
    gradient.addColorStop(1, band.color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, band.y * h, w, band.height * h);
  });

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const noise = perlinNoise(x * 0.02, y * 0.02, 3, 42);
      ctx.fillStyle = `rgba(139, 90, 43, ${noise * 0.15})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const spotX = w * 0.65;
  const spotY = h * 0.55;
  const spotRX = 35;
  const spotRY = 20;

  const spotGradient = ctx.createRadialGradient(
    spotX,
    spotY,
    0,
    spotX,
    spotY,
    spotRX,
  );
  spotGradient.addColorStop(0, "#dc2626");
  spotGradient.addColorStop(0.5, "#ea580c");
  spotGradient.addColorStop(1, "rgba(220, 38, 38, 0)");

  ctx.fillStyle = spotGradient;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, spotRX, spotRY, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateMarsTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#c1440e");
  gradient.addColorStop(0.5, "#d97706");
  gradient.addColorStop(1, "#9a3412");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const radius = 3 + Math.random() * 15;

    const craterGradient = ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      radius,
    );
    craterGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
    craterGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.15)");
    craterGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const noise = perlinNoise(x * 0.03, y * 0.03, 2, 37);
      const alpha = noise * 0.2;
      ctx.fillStyle = `rgba(120, 53, 15, ${alpha})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const polarGradient1 = ctx.createLinearGradient(0, 0, 0, h * 0.1);
  polarGradient1.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  polarGradient1.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = polarGradient1;
  ctx.fillRect(0, 0, w, h * 0.1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateMercuryTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#6b7280");
  gradient.addColorStop(0.5, "#8c8c8c");
  gradient.addColorStop(1, "#525252");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const radius = 2 + Math.random() * 12;

    const craterGradient = ctx.createRadialGradient(
      cx - radius * 0.2,
      cy - radius * 0.2,
      0,
      cx,
      cy,
      radius,
    );
    craterGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    craterGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
    craterGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateVenusTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#fef3c7");
  gradient.addColorStop(0.5, "#e8c987");
  gradient.addColorStop(1, "#d97706");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 20; i++) {
    const y = Math.random() * h;
    const gradient = ctx.createLinearGradient(0, y - 10, 0, y + 10);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, y - 10, w, 20);
  }

  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const noise = perlinNoise(x * 0.015, y * 0.015, 5, 123);
      const alpha = noise * 0.15;
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateSaturnTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const bands = [
    { y: 0, color: "#e8d5a0", height: 0.1 },
    { y: 0.1, color: "#f4d59e", height: 0.15 },
    { y: 0.25, color: "#d4b896", height: 0.1 },
    { y: 0.35, color: "#f5e6c8", height: 0.2 },
    { y: 0.55, color: "#e8d5a0", height: 0.15 },
    { y: 0.7, color: "#d4b896", height: 0.1 },
    { y: 0.8, color: "#f5e6c8", height: 0.12 },
    { y: 0.92, color: "#e8d5a0", height: 0.08 },
  ];

  bands.forEach((band) => {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, band.y * h, w, band.height * h);
  });

  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const noise = perlinNoise(x * 0.02, y * 0.02, 4, 77);
      const alpha = noise * 0.1;
      ctx.fillStyle = `rgba(180, 130, 70, ${alpha})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateUranusTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#a5f3fc");
  gradient.addColorStop(0.5, "#7de3ed");
  gradient.addColorStop(1, "#22d3ee");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const noise = perlinNoise(x * 0.01, y * 0.03, 2, 88);
      const alpha = noise * 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateNeptuneTexture(size: number = 512): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#3b82f6");
  gradient.addColorStop(0.5, "#4166f5");
  gradient.addColorStop(1, "#1e3a8a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    const y = h * (0.2 + i * 0.15);
    const gradient = ctx.createLinearGradient(0, y - 8, 0, y + 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y - 8, w, 16);
  }

  const spotX = w * 0.7;
  const spotY = h * 0.4;
  const spotGradient = ctx.createRadialGradient(
    spotX,
    spotY,
    0,
    spotX,
    spotY,
    20,
  );
  spotGradient.addColorStop(0, "rgba(30, 58, 138, 0.6)");
  spotGradient.addColorStop(1, "rgba(30, 58, 138, 0)");
  ctx.fillStyle = spotGradient;
  ctx.beginPath();
  ctx.arc(spotX, spotY, 20, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateMoonTexture(size: number = 256): THREE.Texture {
  const [canvas, ctx] = createCanvas(size);
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#9ca3af");
  gradient.addColorStop(0.5, "#cccccc");
  gradient.addColorStop(1, "#6b7280");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 50; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const radius = 2 + Math.random() * 10;

    const craterGradient = ctx.createRadialGradient(
      cx - radius * 0.15,
      cy - radius * 0.15,
      0,
      cx,
      cy,
      radius,
    );
    craterGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    craterGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.4)");
    craterGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const rx = 15 + Math.random() * 30;
    const ry = 8 + Math.random() * 15;

    ctx.fillStyle = "rgba(100, 100, 100, 0.2)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

const textureCache: Record<string, THREE.Texture> = {};

export function getPlanetTexture(planetId: string, size: number = 512): THREE.Texture | null {
  const cacheKey = `${planetId}-${size}`;

  if (textureCache[cacheKey]) {
    return textureCache[cacheKey];
  }

  let texture: THREE.Texture | null = null;

  switch (planetId) {
    case "mercury":
      texture = generateMercuryTexture(size);
      break;
    case "venus":
      texture = generateVenusTexture(size);
      break;
    case "earth":
      texture = generateEarthTexture(size);
      break;
    case "mars":
      texture = generateMarsTexture(size);
      break;
    case "jupiter":
      texture = generateJupiterTexture(size);
      break;
    case "saturn":
      texture = generateSaturnTexture(size);
      break;
    case "uranus":
      texture = generateUranusTexture(size);
      break;
    case "neptune":
      texture = generateNeptuneTexture(size);
      break;
    case "moon":
      texture = generateMoonTexture(size);
      break;
    default:
      texture = null;
  }

  if (texture) {
    textureCache[cacheKey] = texture;
  }

  return texture;
}

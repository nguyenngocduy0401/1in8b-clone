import React, { useRef, useEffect } from 'react';
import { buildPersonSprite, PxR } from '../engine/pixelScene';

export default function AnimatedPortrait({ sex, age, theme = 'light' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    let startTime = performance.now();

    const loop = (now) => {
      const elapsed = now - startTime;
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext('2d');
        const W = 32;
        const H = 40;
        const r = new PxR(W, H);

        const isDark = theme === 'dark';

        // 1. Sky Gradient
        const skyTop = isDark ? [23, 40, 58] : [143, 207, 227];
        const skyBot = isDark ? [44, 63, 73] : [232, 242, 236];
        for (let y = 0; y < 28; y++) {
          const t = y / 28;
          const c = [
            Math.round(skyTop[0] + (skyBot[0] - skyTop[0]) * t),
            Math.round(skyTop[1] + (skyBot[1] - skyTop[1]) * t),
            Math.round(skyTop[2] + (skyBot[2] - skyTop[2]) * t)
          ];
          r.rect(0, y, W, 1, c);
        }

        // 2. Distant gentle hill silhouette
        const hillCol = isDark ? [37, 56, 47] : [179, 211, 194];
        for (let x = 0; x < W; x++) {
          const hy = Math.round(24 + Math.sin(x * 0.12) * 2);
          for (let y = hy; y < 30; y++) {
            r.px(x, y, hillCol);
          }
        }

        // 3. Ground base
        const groundCol = isDark ? [47, 75, 54] : [140, 192, 122];
        r.rect(0, 30, W, H - 30, groundCol);

        // 4. Animation parameters: eye blinking & breathing bob
        const isBlinking = (elapsed % 3200) < 150;
        const breathCycle = Math.sin((elapsed / 800) * Math.PI);
        const breathBob = breathCycle > 0.35 ? -1 : 0;

        // Palette
        const pal = {
          hair: isDark ? [31, 26, 23] : [63, 53, 48],
          hairOld: isDark ? [169, 166, 160] : [221, 218, 211],
          skin: isDark ? [169, 135, 109] : [207, 159, 124],
          eye: isDark ? [10, 15, 18] : [19, 33, 42],
          blush: isDark ? [180, 90, 80] : [235, 140, 130],
          mouth: isDark ? [140, 40, 30] : [176, 54, 43],
          shirtMe: isDark ? [76, 192, 175] : [31, 138, 128],
          pants: isDark ? [43, 48, 54] : [79, 86, 97],
          shoes: isDark ? [15, 18, 20] : [19, 33, 42]
        };

        const sprite = buildPersonSprite({
          sex,
          age,
          role: 'me',
          isBlinking,
          pal
        });

        // 5. Draw character with crisp dark ink outline
        const sx = Math.floor((W - sprite.w) / 2);
        const sy = H - 2 - sprite.h + breathBob;

        // Draw outline pixels around the sprite
        const ol = pal.eye;
        for (let j = 0; j < sprite.h; j++) {
          for (let i = 0; i < sprite.w; i++) {
            if (sprite.get(i, j)) {
              // check 4 neighbors
              for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const nx = i + dx;
                const ny = j + dy;
                if (nx < 0 || ny < 0 || nx >= sprite.w || ny >= sprite.h || !sprite.get(nx, ny)) {
                  r.px(sx + nx, sy + ny, ol);
                }
              }
            }
          }
        }
        // Blit sprite itself
        r.blit(sprite, sx, sy);

        // Put image to canvas
        const img = ctx.createImageData(W, H);
        for (let i = 0; i < r.d.length; i++) {
          const col = r.d[i] || [255, 255, 255];
          const idx = i * 4;
          img.data[idx] = col[0];
          img.data[idx + 1] = col[1];
          img.data[idx + 2] = col[2];
          img.data[idx + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [sex, age, theme]);

  return (
    <div className="w-16 h-20 rounded border border-rule bg-card2 overflow-hidden shadow-inner shrink-0 relative">
      <canvas
        ref={canvasRef}
        width={32}
        height={40}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
        title={`Chân dung nhân vật ${age} tuổi`}
      />
    </div>
  );
}

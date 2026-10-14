import React, { useRef, useEffect } from 'react';
import worldData from '../data/world.json';
import { Globe2 } from 'lucide-react';

let decodedLandCache = null;

function getLandPixels() {
  if (decodedLandCache) return decodedLandCache;
  try {
    const raw = atob(worldData.land);
    const out = [];
    const total = worldData.w * worldData.h;
    for (let i = 0; i < total; i++) {
      if (raw.charCodeAt(i >> 3) & (128 >> (i & 7))) {
        out.push([i % worldData.w, Math.floor(i / worldData.w)]);
      }
    }
    decodedLandCache = out;
    return out;
  } catch {
    return [];
  }
}

export default function LifeMap({ lifeState, lang = 'vi' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !lifeState) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const kX = width / worldData.w;
    const kY = height / worldData.h;

    // Is dark theme?
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const landColor = isDark ? '#2A383D' : '#C7D2CE';
    const highlightColor = isDark ? '#4CC0AF' : '#0F6E68';
    const peerColor = isDark ? '#E2678A' : '#8C1D3C';

    // 1. Draw Land Pixels
    const pixels = getLandPixels();
    ctx.fillStyle = landColor;
    for (const [x, y] of pixels) {
      ctx.fillRect(Math.round(x * kX), Math.round(y * kY), Math.max(1, Math.round(kX * 0.9)), Math.max(1, Math.round(kY * 0.9)));
    }

    // Coordinates helper
    const getPoint = (iso) => {
      const coord = worldData.at && worldData.at[iso];
      if (!coord) return null;
      return [coord[0] * kX, coord[1] * kY];
    };

    // 2. Draw 4 Peer Babies
    if (lifeState.peers && lifeState.peers.length) {
      for (const peer of lifeState.peers) {
        const pt = getPoint(peer.countryId);
        if (pt) {
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], peer.alive ? 3 : 2, 0, Math.PI * 2);
          ctx.fillStyle = peer.alive ? peerColor : '#7A888B';
          ctx.fill();
        }
      }
    }

    // 3. Draw Player Birthplace Marker (pulsing ring)
    const bornPt = getPoint(lifeState.bornCountryId || lifeState.country?.id);
    if (bornPt) {
      // Glow circle
      ctx.beginPath();
      ctx.arc(bornPt[0], bornPt[1], 5.5, 0, Math.PI * 2);
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      // Center dot
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(bornPt[0], bornPt[1], 2.8, 0, Math.PI * 2);
      ctx.fillStyle = highlightColor;
      ctx.fill();

      // Optional text label
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.fillStyle = highlightColor;
      const label = lifeState.country?.ko || lifeState.bornCountryId;
      ctx.fillText(label, bornPt[0] + 6, bornPt[1] + 3);
    }
  }, [lifeState, lang]);

  return (
    <div className="bg-card border border-rule rounded-lg p-3.5 shadow-sm space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="font-bold uppercase tracking-wider text-ink3 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-stamp" />
          <span>{lang === 'vi' ? 'Bản đồ địa lý nhân loại' : lang === 'ko' ? '세계 지도 및 동시 출생' : 'World Birthplace Map'}</span>
        </span>
        <span className="text-[11px] text-ink3">156×66 px</span>
      </div>

      <div className="w-full bg-paper/60 border border-rule2 rounded p-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={312}
          height={132}
          className="w-full h-auto max-w-[340px] block rounded"
        />
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-ink3 px-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-stamp" />
          <span>{lang === 'vi' ? 'Nơi bạn sinh ra' : 'Your birth'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          <span>{lang === 'vi' ? '4 bạn sinh cùng giây' : '4 peers'}</span>
        </span>
      </div>
    </div>
  );
}

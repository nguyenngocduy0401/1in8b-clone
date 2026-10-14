import React from 'react';

export default function SurvivalCurve({ age, country, lang = 'vi' }) {
  const le = country.le || 73;
  const im = (country.im || 15) / 1000;
  const u5 = (country.u5 || 25) / 1000;

  // Gompertz curve approximation for national cohort survival l(a)
  const getSurvivalAtAge = (a) => {
    if (a <= 0) return 1.0;
    if (a === 1) return 1.0 - im;
    if (a <= 5) return 1.0 - u5;
    // Beyond age 5: Gompertz decline calibrated to le
    const z = (a - le) / 13;
    const s = 1.0 / (1.0 + Math.exp(1.7 * z));
    return Math.max(0, Math.min(1.0 - u5, s));
  };

  // World average curve
  const getWorldSurvivalAtAge = (a) => {
    if (a <= 0) return 1.0;
    const z = (a - 73) / 14;
    return 1.0 / (1.0 + Math.exp(1.7 * z));
  };

  const W = 320;
  const H = 160;
  const x0 = 34;
  const x1 = 300;
  const y0 = 16;
  const y1 = 130;

  const X = (a) => x0 + ((x1 - x0) * a) / 100;
  const Y = (p) => y1 - (y1 - y0) * p;

  // Build country path
  let countryPath = '';
  for (let a = 0; a <= 100; a++) {
    const p = getSurvivalAtAge(a);
    countryPath += `${a === 0 ? 'M' : 'L'} ${X(a).toFixed(1)} ${Y(p).toFixed(1)} `;
  }

  // Build world path
  let worldPath = '';
  for (let a = 0; a <= 100; a++) {
    const p = getWorldSurvivalAtAge(a);
    worldPath += `${a === 0 ? 'M' : 'L'} ${X(a).toFixed(1)} ${Y(p).toFixed(1)} `;
  }

  const curAgeClamped = Math.min(Math.max(age, 0), 100);
  const curSurvival = getSurvivalAtAge(curAgeClamped);
  const curX = X(curAgeClamped);
  const curY = Y(curSurvival);

  return (
    <div className="bg-card border border-rule rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-mono text-xs uppercase tracking-wider text-ink3 font-bold">
          {lang === 'vi' ? 'Đường cong sinh tồn' : lang === 'ko' ? '생존 곡선' : 'Survival curve'}
        </h4>
        <span className="text-[11px] font-mono text-ink3">
          {lang === 'vi' ? 'Cùng năm sinh' : lang === 'ko' ? '동년생' : 'Same cohort'}
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block select-none" role="img">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((p) => (
            <g key={p}>
              <line
                x1={x0}
                x2={x1}
                y1={Y(p)}
                y2={Y(p)}
                stroke="var(--rule2)"
                strokeWidth="1"
              />
              <text
                x={x0 - 5}
                y={Y(p) + 3}
                textAnchor="end"
                fontSize="9"
                fill="var(--ink3)"
                fontFamily="IBM Plex Mono, monospace"
              >
                {Math.round(p * 100)}%
              </text>
            </g>
          ))}

          {/* Age axis labels */}
          {[0, 20, 40, 60, 80, 100].map((a) => (
            <text
              key={a}
              x={X(a)}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fill="var(--ink3)"
              fontFamily="IBM Plex Mono, monospace"
            >
              {a}
            </text>
          ))}
          <text x={x1} y={H - 8} textAnchor="end" fontSize="9" fill="var(--ink3)" fontFamily="sans-serif">
            {lang === 'vi' ? 'tuổi' : lang === 'ko' ? '세' : 'yrs'}
          </text>

          {/* World avg dashed line */}
          <path
            d={worldPath}
            fill="none"
            stroke="var(--ink3)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Country shaded area & curve */}
          <path
            d={`${countryPath} L ${X(100)} ${y1} L ${X(0)} ${y1} Z`}
            fill="var(--stamp)"
            opacity="0.12"
          />
          <path
            d={countryPath}
            fill="none"
            stroke="var(--stamp)"
            strokeWidth="2.2"
          />

          {/* Current age vertical marker and dot */}
          <line
            x1={curX}
            x2={curX}
            y1={y0}
            y2={y1}
            stroke="var(--ink)"
            strokeWidth="1"
            opacity="0.35"
          />
          <circle
            cx={curX}
            cy={curY}
            r="4"
            fill="var(--stamp)"
            stroke="var(--card)"
            strokeWidth="1.5"
          />
          <text
            x={Math.min(curX + 6, x1 - 55)}
            y={Math.max(curY - 6, y0 + 10)}
            fontSize="10"
            fill="var(--ink)"
            fontWeight="bold"
            fontFamily="IBM Plex Mono, monospace"
          >
            {Math.round(curSurvival * 100)}% {lang === 'vi' ? 'sống' : lang === 'ko' ? '생존' : 'alive'}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2 pt-2 border-t border-dashed border-rule2 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] font-mono text-ink3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-1 bg-stamp rounded-xs inline-block" />
          <span>{country.ko || country.id}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 border-t border-dashed border-ink3 inline-block" />
          <span>{lang === 'vi' ? 'TB Thế giới' : lang === 'ko' ? '세계 평균' : 'World avg'}</span>
        </span>
      </div>
    </div>
  );
}

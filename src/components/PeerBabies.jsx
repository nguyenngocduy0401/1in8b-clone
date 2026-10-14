import React from 'react';
import { getCountryName } from '../i18n';

export default function PeerBabies({ peers, age, lang = 'vi' }) {
  if (!peers || peers.length === 0) return null;

  return (
    <div className="bg-card border border-rule rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-baseline mb-3">
        <h4 className="font-mono text-xs uppercase tracking-wider text-ink3 font-bold">
          {lang === 'vi' ? 'Sinh cùng giây' : lang === 'ko' ? '동초생 (같은 초 출생)' : 'Born same second'}
        </h4>
        <span className="text-[11px] font-mono text-ink3">
          {lang === 'vi' ? 'Cùng lứa tuổi' : lang === 'ko' ? '같은 나이' : 'Same age'}
        </span>
      </div>

      <ul className="space-y-2.5 font-mono text-xs">
        {peers.map((peer) => {
          const isDead = !peer.alive;
          const countryName = getCountryName(peer.countryId, lang, peer.country.ko);
          const sexText = peer.sex === 'M' ? (lang === 'vi' ? 'Nam' : 'M') : (lang === 'vi' ? 'Nữ' : 'F');

          return (
            <li
              key={peer.id}
              className={`p-2 rounded border flex justify-between items-center gap-2 transition ${
                isDead
                  ? 'bg-bad/5 border-bad/20 opacity-70'
                  : 'bg-paper/70 border-rule2 hover:border-rule'
              }`}
            >
              <div className="min-w-0">
                <b className={`block truncate ${isDead ? 'line-through text-ink3' : 'text-ink'}`}>
                  {peer.name.full || peer.name.first}
                </b>
                <span className="text-[11px] text-ink3 block truncate">
                  {countryName} · {sexText}
                </span>
              </div>

              <div className="text-right shrink-0 text-[11.5px]">
                {isDead ? (
                  <span className="text-bad font-semibold">
                    † {peer.deathAge} {lang === 'vi' ? 'tuổi' : 'yr'}
                  </span>
                ) : (
                  <span className="text-stamp font-medium">
                    {peer.status[lang] || peer.status.vi}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React from 'react';
import { getCountryName, getReligionName } from '../i18n';

export default function BirthCard({ identity, lang = 'en', onStartLife, theme }) {
  const country = identity.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const religionName = getReligionName(identity.religion, lang);
  const cityName = lang === 'en' ? (identity.cityNameEn || identity.cityName) : (identity.cityName || identity.cityNameEn);
  const placeOfBirth = identity.urban
    ? cityName
    : (cityName && !cityName.toLowerCase().includes('rural') && !cityName.includes('nông thôn') ? `rural ${cityName}` : 'a rural area');
  const placeOfBirthGrid = identity.urban
    ? cityName
    : (cityName && !cityName.toLowerCase().includes('rural') && !cityName.includes('nông thôn') ? `Rural ${cityName}` : 'Rural area');

  const worldBirths = 131900000;
  const countryBirths = country.b || 23200000;
  const birthShare = ((countryBirths / worldBirths) * 100).toFixed(1);

  // No. format: IND-2026-1262827
  const regNo = `No. ${country.id}-${identity.birthYear || 2026}-${Math.floor(1000000 + Math.random() * 9000000)}`;

  // SVG Guilloche security lines pattern
  const renderGuilloche = () => {
    let paths = [];
    const w = 560;
    const h = 420;
    for (let i = 0; i < 12; i++) {
      let d = '';
      const ph = i * 0.45;
      const amp = h * (0.15 + 0.01 * i);
      const lam = w / (2.4 + i * 0.08);
      for (let x = 0; x <= w; x += 10) {
        const y = h / 2 + amp * Math.sin((2 * Math.PI * x) / lam + ph) * Math.cos((Math.PI * x) / w * 1.3 + i * 0.2);
        d += (x ? 'L' : 'M') + ` ${x} ${y.toFixed(1)} `;
      }
      paths.push(
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          opacity="0.10"
        />
      );
    }
    return (
      <svg className="absolute inset-0 w-full h-full text-stamp pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
        {paths}
      </svg>
    );
  };

  const siblingDesc = identity.family?.siblingList && identity.family.siblingList.length > 0
    ? (lang === 'vi'
        ? ` Bạn có ${identity.family.siblingList.map(s => `${s.relationVi} ${s.age} tuổi`).join(' và ')}.`
        : ` You have ${identity.family.siblingList.map(s => `an ${s.relation} aged ${s.age}`).join(' and ')}.`)
    : '';

  return (
    <div className="py-6 sm:py-10 max-w-2xl mx-auto px-3 sm:px-4 animate-fade-in font-body text-ink">
      <div className="bg-card border border-rule rounded-xl shadow-vintage overflow-hidden relative">
        {renderGuilloche()}

        {/* Certificate Top Maroon Header Ribbon */}
        <div className="bg-accent text-accent-ink px-6 py-3 flex justify-between items-center text-xs font-mono font-semibold relative z-10">
          <span className="font-bold tracking-wider uppercase">Birth registration</span>
          <span className="opacity-90">{regNo}</span>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink3 block mb-1">
              Name
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
              {typeof identity.name === 'object' ? (identity.name.full || identity.name.first) : identity.name}
            </h1>
            <p className="text-ink2 text-sm sm:text-base mt-3 leading-relaxed font-body">
              In February {identity.birthYear || 2026}, you were born a {identity.sex === 'M' ? 'boy' : 'girl'} in {placeOfBirth}, {countryName}, into a family in the bottom {identity.q === 1 ? '0–20%' : identity.q === 2 ? '20–40%' : identity.q === 3 ? '40–60%' : identity.q === 4 ? '60–80%' : '80–100%'}.{siblingDesc} Your family's religion is {religionName}. Your family's roots: {identity.culture?.ethnicity?.en || identity.culture?.ethnicity?.vi || countryName}.
            </p>
            <p className="text-xs text-ink3 font-mono mt-3 leading-relaxed border-b border-dashed border-rule pb-4">
              Living to life expectancy takes about an hour (1 year ≈ 51 s). If you close the page, the life is saved in this browser and goes on when you come back in the same browser.
            </p>
          </div>

          {/* Exact 3x4 Grid Fields matching 1in8b.life */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs font-mono">
            <div>
              <span className="text-ink3 block uppercase text-[10px]">Sex</span>
              <b className="text-ink text-sm block mt-0.5">{identity.sex === 'M' ? 'Male' : 'Female'}</b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Country of birth</span>
              <b className="text-ink text-sm block mt-0.5">{countryName}</b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Place of birth</span>
              <b className="text-ink text-sm block mt-0.5 truncate">
                {placeOfBirthGrid}
              </b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Family roots</span>
              <b className="text-ink text-sm block mt-0.5 truncate">
                {identity.culture?.ethnicity?.en || identity.culture?.ethnicity?.vi || countryName}
              </b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Family income</span>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((k) => (
                  <span
                    key={k}
                    className={`w-2 h-2 rounded-full inline-block ${
                      k <= identity.q ? 'bg-ink' : 'border border-ink3 bg-transparent'
                    }`}
                  />
                ))}
                <span className="text-xs text-ink font-semibold ml-1">quintile {identity.q}</span>
              </div>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Parents' ages</span>
              <b className="text-ink text-sm block mt-0.5">
                Mother, {identity.family?.mom?.age || 26} · Father, {identity.family?.dad?.age || 29}
              </b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Parents' work</span>
              <span className="text-ink text-xs block mt-0.5 leading-snug">
                Mother: {identity.family?.mom?.job || 'homemaker'} ·<br />
                Father: {identity.family?.dad?.job || 'farmer/worker'}
              </span>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Parents' home</span>
              <b className="text-ink text-sm block mt-0.5">Owned</b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Religion</span>
              <b className="text-ink text-sm block mt-0.5">{religionName}</b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Life expectancy</span>
              <b className="text-ink text-sm block mt-0.5">{country.le || 70.5} years</b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">Chance of dying before age 5</span>
              <b className="text-ink text-sm block mt-0.5">
                {((country.u5 || 28) / 10).toFixed(1)}%
              </b>
            </div>

            <div>
              <span className="text-ink3 block uppercase text-[10px]">GDP per person (PPP)</span>
              <b className="text-good text-sm block mt-0.5">${(country.ppp || 8871).toLocaleString()}</b>
            </div>
          </div>

          {/* Demographic Probability Callout */}
          <div className="p-4 rounded-lg bg-paper border border-rule text-xs font-mono text-ink2 leading-relaxed">
            {birthShare}% of the babies born today are born in {countryName}. That's about 1 in {Math.round(100 / birthShare)}. And one in two of the world's babies is born in the countryside, like you.
          </div>

          {/* Born Somewhere on Earth in the same second */}
          <div className="border-t border-rule pt-4 space-y-2">
            <h4 className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Born somewhere on Earth in the same second
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {(identity.peers || []).slice(0, 4).map((p, idx) => {
                const peerName = typeof p.name === 'object' ? (p.name.full || p.name.first) : p.name;
                const peerCountry = getCountryName(p.country?.id, lang, p.country?.ko);
                const peerGender = p.sex === 'M' ? 'boy' : 'girl';
                return (
                  <div key={idx} className="p-2.5 rounded border border-rule bg-paper">
                    <b className="text-ink block">{peerName}</b>
                    <span className="text-ink3 block text-[11px] truncate">
                      {peerCountry} ({p.country?.id}) · {peerGender} · modest means
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-ink3 font-mono">
              Their lives, too, will run to the end by the same statistics. We'll show them alongside yours.
            </p>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-rule flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => alert('Link copied to clipboard!')}
              className="w-full sm:w-auto px-5 py-2.5 rounded border border-rule hover:bg-paper font-display text-sm font-semibold text-ink transition cursor-pointer"
            >
              Share birth card
            </button>

            <button
              onClick={onStartLife}
              className="w-full sm:w-auto px-8 py-3 rounded bg-accent hover:bg-accent/90 text-accent-ink font-display text-base font-bold shadow-vintage transition cursor-pointer"
            >
              Begin this life
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

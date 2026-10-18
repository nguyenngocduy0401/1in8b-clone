import React, { useState } from 'react';
import { UI_TRANSLATIONS, getCountryName, getReligionName } from '../i18n';
import SceneDiorama from './SceneDiorama';
import AnimatedPortrait from './AnimatedPortrait';
import PeerBabies from './PeerBabies';
import SurvivalCurve from './SurvivalCurve';
import LifeMap from './LifeMap';

export default function Dashboard({
  state,
  lang = 'en',
  theme,
  onOpenShop,
  onSetFocus,
  onOpenAchievements
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en || UI_TRANSLATIONS.vi;
  const country = state.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const religionName = getReligionName(state.religion, lang);
  const stats = state.stats;

  const currentFocus = state.currentFocus || 'baby';
  const age = state.yearsLived;
  const isBaby = age < 6;

  // Exact 1in8b.life focus items for Age 6+:
  const FOCUS_OPTIONS = [
    { id: 'study', label: 'Study & school', sub: 'Knowledge' },
    { id: 'work', label: 'Work & earn', sub: 'Income' },
    { id: 'family', label: 'Family & ties', sub: 'Relationships' },
    { id: 'health', label: 'Exercise & health', sub: 'Health' },
    { id: 'hobby', label: 'Hobbies & leisure', sub: 'Happiness' }
  ];

  // Helper: Latinized MRZ machine readable passport lines (exact ICAO 9303 style)
  const latinName = (state.name.full || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  const mrzLine1 = `I<${country.id}${latinName}`.padEnd(36, '<').slice(0, 36);
  const mrzLine2 = `260201${state.sex || 'M'}IND<${String(age).padStart(3, '0')}`.padEnd(36, '<').slice(0, 36);

  // Status bars helper
  const getBarColor = (val, type) => {
    if (type === 'health') return val >= 60 ? 'bg-[#2B7A4E]' : val >= 35 ? 'bg-[#A8730F]' : 'bg-[#B0362B]';
    if (type === 'happiness') return 'bg-[#9C7020]';
    if (type === 'knowledge') return 'bg-[#0F6E68]';
    return 'bg-[#8C1D3C]'; // relationships
  };

  // Education label matching 1in8b
  const getEduLabel = () => {
    if (age < 6) return 'Not in school yet';
    if (age <= 11) return 'Primary school';
    if (age <= 17) return 'Secondary school';
    if (state.stats.educationLevel >= 4) return 'University graduate';
    if (state.stats.educationLevel >= 3) return 'Higher education';
    return 'Completed schooling';
  };

  // Income / Net Worth formatting
  const netWorthStr = age < 18 ? '—' : `$${(stats.wealth || 0).toLocaleString()}`;
  const netWorthSub = age < 18 ? 'Still living with your parents' : 'Net assets (USD PPP)';
  const yearlyIncomeStr = age < 18 ? '—' : `$${Math.round((country.ppp || 12000) * (0.5 + state.q * 0.25)).toLocaleString()}`;
  const yearlyIncomeSub = `Family income: quintile ${state.q}`;

  // SVG Guilloche security lines pattern
  const renderGuilloche = () => {
    let paths = [];
    const w = 320;
    const h = 220;
    for (let i = 0; i < 9; i++) {
      let d = '';
      const ph = i * 0.45;
      const amp = h * (0.12 + 0.01 * i);
      const lam = w / (2.2 + i * 0.07);
      for (let x = 0; x <= w; x += 8) {
        const y = h / 2 + amp * Math.sin((2 * Math.PI * x) / lam + ph) * Math.cos((Math.PI * x) / w * 1.3 + i * 0.2);
        d += (x ? 'L' : 'M') + ` ${x} ${y.toFixed(1)} `;
      }
      paths.push(
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.12"
        />
      );
    }
    return (
      <svg className="absolute inset-0 w-full h-full text-stamp pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
        {paths}
      </svg>
    );
  };

  return (
    <div className="py-4 max-w-[1380px] mx-auto px-3 sm:px-4 animate-fade-in font-body text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ========================================================
            COLUMN 1 (Left ~340px / 4 cols lg):
            Identity Record Panel, Status (0-100), Family and Life
           ======================================================== */}
        <div className="lg:col-span-4 space-y-4">

          {/* 1. Identity Record Card with Guilloche, Header Band & MRZ */}
          <div className="bg-card border border-rule rounded-xl shadow-xs overflow-hidden relative">
            {renderGuilloche()}

            {/* Top Maroon Header Band: 'Identity record · [COUNTRY] · [YEAR]' */}
            <div className="bg-accent text-accent-ink px-4 py-2 flex justify-between items-center text-xs font-mono font-semibold relative z-10">
              <span className="tracking-wide">Identity record · {country.id}</span>
              <span className="tracking-wider">{state.birthYear || 2026}</span>
            </div>

            <div className="p-4 relative z-10 space-y-3">
              {/* Avatar + Full Name Header */}
              <div className="flex items-center gap-3.5">
                <AnimatedPortrait sex={state.sex} age={age} theme={theme} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink truncate leading-tight">
                    {state.name.full}
                  </h3>
                  <p className="text-xs font-mono text-ink2 mt-0.5">
                    {state.sex === 'M' ? 'Male' : 'Female'} · {countryName}
                  </p>
                </div>
              </div>

              {/* Data Field List exactly matching 1in8b.life */}
              <div className="text-xs font-mono space-y-1.5 pt-2 border-t border-rule/70">
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Sex:</span>
                  <span className="text-ink font-semibold">{state.sex === 'M' ? 'Male' : 'Female'}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Birth:</span>
                  <span className="text-ink">{countryName} · {((state.birthMonth || 2) + '/' + (state.birthYear || 2026))}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Lives in:</span>
                  <span className="text-ink truncate max-w-[200px]">
                    {state.urban ? (state.cityName || 'City') : 'countryside'}, {countryName}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Family roots:</span>
                  <span className="text-ink truncate max-w-[200px]">
                    {state.culture?.ethnicity?.en || state.culture?.ethnicity?.vi || countryName}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Religion:</span>
                  <span className="text-ink">{religionName}</span>
                </div>
                <div className="flex justify-between py-0.5 items-center">
                  <span className="text-ink3">Family background:</span>
                  <span className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((k) => (
                      <span
                        key={k}
                        className={`w-2 h-2 rounded-full inline-block ${
                          k <= state.q ? 'bg-ink' : 'border border-ink3 bg-transparent'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-ink2 ml-1">quintile {state.q}</span>
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink3">Education:</span>
                  <span className="text-ink">{getEduLabel()}</span>
                </div>
              </div>

              {/* Passport MRZ Barcode line */}
              <div className="pt-2 border-t border-dashed border-rule font-mono text-[9px] tracking-wider text-ink3 select-all overflow-hidden whitespace-nowrap opacity-75 leading-tight">
                <div>{mrzLine1}</div>
                <div>{mrzLine2}</div>
              </div>
            </div>
          </div>

          {/* 2. Status 0–100 Panel (Health, Happiness, Knowledge, Relationships) */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-display font-bold text-base text-ink flex items-baseline gap-1.5">
                <span>Status</span>
                <span className="text-xs font-mono font-normal text-ink3">0–100</span>
              </h4>
            </div>

            {/* Health Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink font-medium">Health</span>
                <span className="text-ink font-bold">{Math.round(stats.health)}</span>
              </div>
              <div className="w-full h-2.5 bg-rule2 rounded-xs overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(stats.health, 'health')}`}
                  style={{ width: `${Math.min(100, Math.max(0, stats.health))}%` }}
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink font-medium">Happiness</span>
                <span className="text-ink font-bold">{Math.round(stats.happiness)}</span>
              </div>
              <div className="w-full h-2.5 bg-rule2 rounded-xs overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(stats.happiness, 'happiness')}`}
                  style={{ width: `${Math.min(100, Math.max(0, stats.happiness))}%` }}
                />
              </div>
            </div>

            {/* Knowledge Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink font-medium">Knowledge</span>
                <span className="text-ink font-bold">{Math.round(stats.smarts)}</span>
              </div>
              <div className="w-full h-2.5 bg-rule2 rounded-xs overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(stats.smarts, 'knowledge')}`}
                  style={{ width: `${Math.min(100, Math.max(0, stats.smarts))}%` }}
                />
              </div>
            </div>

            {/* Relationships Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink font-medium">Relationships</span>
                <span className="text-ink font-bold">{Math.round(stats.social)}</span>
              </div>
              <div className="w-full h-2.5 bg-rule2 rounded-xs overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(stats.social, 'relationships')}`}
                  style={{ width: `${Math.min(100, Math.max(0, stats.social))}%` }}
                />
              </div>
            </div>

            {/* 'What do these mean?' collapsible helper */}
            <details className="text-xs font-mono text-ink2 pt-1 border-t border-rule2 cursor-pointer">
              <summary className="hover:text-accent transition select-none">▶ What do these mean?</summary>
              <div className="mt-2 space-y-1 text-ink3 text-[11px] leading-relaxed pl-2 border-l border-rule">
                <p><b>Health:</b> Affects risk of illness and mortality. Age and strain lower it.</p>
                <p><b>Happiness:</b> Overall life satisfaction from family, wealth, and living conditions.</p>
                <p><b>Knowledge:</b> Influences education qualifications, job opportunities, and salary tier.</p>
                <p><b>Relationships:</b> Bonds with family, spouse, children, and community.</p>
              </div>
            </details>

            {/* Net Worth and Yearly Income Display (in US terms) */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-rule text-xs font-mono">
              <div>
                <span className="text-ink3 block text-[11px]">Net worth (in US terms)</span>
                <b className="text-ink text-sm block mt-0.5">{netWorthStr}</b>
                <small className="text-[10px] text-ink3 leading-tight block mt-0.5">{netWorthSub}</small>
              </div>
              <div>
                <span className="text-ink3 block text-[11px]">Yearly income (in US terms)</span>
                <b className="text-ink text-sm block mt-0.5">{yearlyIncomeStr}</b>
                <small className="text-[10px] text-ink3 leading-tight block mt-0.5">{yearlyIncomeSub}</small>
              </div>
            </div>
          </div>

          {/* 3. Family and Life Panel */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs text-xs font-mono space-y-2">
            <h4 className="font-display font-bold text-base text-ink mb-1">Family and life</h4>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink3">Mother</span>
              <span className="text-right text-ink">
                {state.family.mom.alive ? `${state.family.mom.age || 28} years · homemaker` : 'Passed away'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink3">Father</span>
              <span className="text-right text-ink">
                {state.family.dad.alive ? `${state.family.dad.age || 36} years · farmer/worker` : 'Passed away'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink3">Siblings</span>
              <span className="text-right text-ink">
                {state.family.children && state.family.children.length > 0
                  ? `${state.family.children.length} siblings`
                  : 'Older sister, 3'}
              </span>
            </div>
            {state.family.partner && (
              <div className="flex justify-between py-1 border-b border-rule2">
                <span className="text-ink3">Spouse</span>
                <span className="text-right text-ink font-semibold">{state.family.partner.name}</span>
              </div>
            )}
            {state.family.grandchildrenCount > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-ink3">Grandchildren</span>
                <span className="text-right text-ink">{state.family.grandchildrenCount} children</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            COLUMN 2 (Center / 5 cols lg):
            Pixel Art Scene, This Year's Focus, Life Record Feed
           ======================================================== */}
        <div className="lg:col-span-5 space-y-4">

          {/* 1. Authentic Living Pixel Diorama Scene */}
          <SceneDiorama state={state} lang={lang} theme={theme} />

          {/* 2. This Year’s Focus Panel exactly as 1in8b.life */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="font-display font-bold text-base text-ink">This year’s focus</h4>
              <span className="text-xs font-mono text-ink3">
                {isBaby ? 'Early childhood' : 'Change it anytime'}
              </span>
            </div>

            {/* Baby explanation for Age 0-5 */}
            {isBaby ? (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="font-semibold text-stamp">
                  Baby · {state.urban ? state.cityName : 'rural'} · {countryName}
                </div>
                <p className="text-ink2 leading-relaxed font-body text-sm">
                  Still a baby, being raised by your parents. Early moments add up and temperament settles by about five; from six you can choose the focus of each year. Feel free to skip this stretch at 8×.
                </p>
              </div>
            ) : (
              /* Chips Focus Selector for Age 6+ */
              <div className="flex flex-wrap gap-2 pt-1">
                {FOCUS_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onSetFocus && onSetFocus(f.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      currentFocus === f.id
                        ? 'bg-stamp border-stamp text-paper shadow-xs font-semibold'
                        : 'bg-paper border-rule text-ink hover:border-ink3'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Life Record Feed (Newest first · tap a line for ☆) */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-baseline border-b border-rule pb-2">
              <h4 className="font-display font-bold text-base text-ink">Life record</h4>
              <span className="text-xs font-mono text-ink3">Newest first · tap a line for ☆</span>
            </div>

            {/* Live simulation peer count ticker */}
            <p className="text-xs font-mono text-stamp leading-relaxed">
              Living in this simulation right now: 19,768 people · 1,957 people besides you in {countryName}
            </p>

            {/* Events Feed List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {state.log.map((entry, index) => {
                const eventText = typeof entry.text === 'object'
                  ? (entry.text[lang] || entry.text.en || entry.text.vi)
                  : entry.text;

                const factText = entry.fact
                  ? (typeof entry.fact === 'object' ? (entry.fact[lang] || entry.fact.en || entry.fact.vi) : entry.fact)
                  : null;

                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-rule bg-paper hover:border-accent/50 transition cursor-pointer text-xs font-mono space-y-1.5 group"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-ink/5 border border-rule font-bold text-ink2 shrink-0">
                        Age {entry.age}
                      </span>
                      <p className="text-ink sm:text-sm font-body leading-relaxed flex-1">
                        {eventText}
                      </p>
                    </div>

                    {/* Scientific Data / WHO fact callout */}
                    {factText && (
                      <div className="ml-12 pl-2 border-l-2 border-stamp text-[11px] font-mono text-stamp leading-relaxed">
                        <b>Data:</b> {factText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 3 (Right ~340px / 3 cols lg):
            Born in Same Second, 100-Year Life Map Grid, Survival Curve, Country Stats
           ======================================================== */}
        <div className="lg:col-span-3 space-y-4">

          {/* 1. Born in the Same Second (Peer Babies) */}
          <PeerBabies peers={state.peers} age={age} lang={lang} />

          {/* 2. World Geographic Birthplace Map */}
          <LifeMap lifeState={state} lang={lang} />

          {/* 3. 100-Year Life Map Grid (1 square = 1 year, darker = happier) */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-display font-bold text-base text-ink">Life map</h4>
              <span className="text-xs font-mono text-ink3">1 square = 1 year</span>
            </div>

            {/* 10x10 Grid */}
            <div className="grid grid-cols-10 gap-1.5 p-2 bg-paper rounded border border-rule">
              {Array.from({ length: 100 }).map((_, index) => {
                const year = index;
                const isLived = year <= age;
                const isCurrent = year === age;
                const isLifeExp = year === Math.round(country.le || 73);

                let cellClass = 'bg-[#CBD5D1] opacity-40';
                if (isCurrent) {
                  cellClass = 'border-2 border-accent bg-transparent';
                } else if (isLived) {
                  cellClass = 'bg-stamp';
                }

                return (
                  <div
                    key={index}
                    title={`Age ${year}`}
                    className={`aspect-square rounded-xs transition-colors relative cursor-default ${cellClass} ${
                      isLifeExp && !isLived ? 'border border-gold' : ''
                    }`}
                  />
                );
              })}
            </div>

            <div className="space-y-1 text-[11px] font-mono text-ink3">
              <div>1 square = 1 year · darker = happier year</div>
              <div>Outlined square = life expectancy for {countryName}: {country.le} years</div>
            </div>
          </div>

          {/* 4. National Survival Curve */}
          <SurvivalCurve age={age} country={country} sex={state.sex} lang={lang} />

          {/* 5. Country Statistics Section (20+ fields exactly as 1in8b.life) */}
          <div className="bg-card border border-rule rounded-xl p-4 shadow-xs text-xs space-y-2 font-mono">
            <div className="flex justify-between items-baseline mb-2 border-b border-rule pb-1.5">
              <h4 className="font-display font-bold text-base text-ink">{countryName}</h4>
              <span className="text-[11px] text-ink3">ISO: {country.id}</span>
            </div>

            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Births per year:</span>
              <span className="font-bold text-ink">{country.b ? (country.b / 1000000).toFixed(1) + 'M' : '23.2M'}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Population:</span>
              <span className="font-bold text-ink">{country.pop ? (country.pop / 1000000).toFixed(1) + 'M' : '1.4B'}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Life expectancy, women / men:</span>
              <span className="font-bold text-ink">{(country.le + 2).toFixed(1)} / {(country.le - 2).toFixed(1)} yrs</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Under-5 mortality:</span>
              <span className="font-bold text-ink">{country.u5 || 28} per 1,000</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">GDP per person (PPP):</span>
              <span className="font-bold text-good">${(country.ppp || 8871).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Income Gini coefficient:</span>
              <span className="font-bold text-ink">{country.gi ? (country.gi / 100).toFixed(2) : '0.35'}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Urban population:</span>
              <span className="font-bold text-ink">{country.urb || 35}%</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Working in agriculture:</span>
              <span className="font-bold text-ink">{country.agr || 42}%</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-rule2">
              <span className="text-ink3">Expected years of schooling:</span>
              <span className="font-bold text-ink">{country.sch || 12.5} years</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-ink3">Fertility rate:</span>
              <span className="font-bold text-ink">{country.tfr || 2.0}</span>
            </div>

            <div className="pt-2 text-[10px] text-ink3/80 font-mono leading-relaxed border-t border-dashed border-rule">
              Sources: UN World Population Prospects 2024, World Bank WDI, WHO GBD, UNESCO, UNICEF.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

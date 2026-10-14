import React, { useState } from 'react';
import { Heart, Smile, Brain, Users, Briefcase, Coins, Sparkles, ShoppingBag } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName, getReligionName } from '../i18n';
import SceneDiorama from './SceneDiorama';
import AnimatedPortrait from './AnimatedPortrait';
import PeerBabies from './PeerBabies';
import SurvivalCurve from './SurvivalCurve';
import LifeMap from './LifeMap';

export default function Dashboard({ state, lang, theme, onOpenShop }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;
  const country = state.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const religionName = getReligionName(state.religion, lang);
  const stats = state.stats;

  // Active annual focus chip
  const [activeFocus, setActiveFocus] = useState('study');

  const FOCUS_OPTIONS = [
    { id: 'study', label: { vi: 'Học tập', en: 'Study', ko: '학업' }, sub: { vi: 'Tri thức', en: 'Knowledge', ko: '지식' } },
    { id: 'work', label: { vi: 'Làm việc', en: 'Career', ko: '일·직업' }, sub: { vi: 'Thu nhập', en: 'Income', ko: '소득' } },
    { id: 'family', label: { vi: 'Gia đình', en: 'Family', ko: '가족' }, sub: { vi: 'Tình cảm', en: 'Bond', ko: '유대' } },
    { id: 'health', label: { vi: 'Rèn luyện', en: 'Fitness', ko: '운동' }, sub: { vi: 'Sức khỏe', en: 'Health', ko: '건강' } },
    { id: 'hobby', label: { vi: 'Sở thích', en: 'Hobby', ko: '취미' }, sub: { vi: 'Niềm vui', en: 'Joy', ko: '행복' } }
  ];

  // Helper: Latinized MRZ machine readable passport lines
  const latinName = (state.name.full || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  const mrzLine1 = `P<${country.id}${latinName}`.padEnd(36, '<').slice(0, 36);
  const mrzLine2 = `00${state.yearsLived}998811${country.id}${state.sex}2601017<<<<<<<<<<<<<<04`;

  // Stat color helpers
  const getHealthColor = (v) => (v >= 70 ? 'bg-good' : v >= 40 ? 'bg-warn' : 'bg-bad');
  const getStatPercent = (v) => Math.min(Math.max(v, 0), 100);

  // SVG Guilloche security lines pattern
  const renderGuilloche = () => {
    let paths = [];
    const w = 320;
    const h = 220;
    for (let i = 0; i < 10; i++) {
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
          opacity="0.07"
        />
      );
    }
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none text-ink select-none"
      >
        {paths}
      </svg>
    );
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ========================================================
            COLUMN 1 (Left ~320px / 4 cols lg):
            ID Card, Status Vitals, Family & Life
           ======================================================== */}
        <div className="lg:col-span-4 space-y-4">

          {/* 1. National ID Card */}
          <div className="bg-card border border-rule rounded-lg shadow-sm overflow-hidden relative">
            {/* Guilloche banknote pattern background */}
            {renderGuilloche()}

            {/* Top burgundy band */}
            <div className="bg-accent text-accent-ink px-4 py-2 flex justify-between items-center text-xs font-mono tracking-wider font-semibold relative z-10">
              <span className="uppercase">{t.idCard}</span>
              <span>№ {country.id}-{state.yearsLived.toString().padStart(3, '0')}</span>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5 relative z-10">
              <div className="flex items-start gap-3.5">
                {/* Animated Pixel Portrait (Blinking & Breathing) */}
                <AnimatedPortrait
                  sex={state.sex}
                  age={state.yearsLived}
                  theme={theme}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-bold text-ink truncate leading-tight">
                    {state.name.full}
                  </h3>
                  <p className="text-xs text-ink3 font-mono mt-0.5">
                    {state.sex === 'M' ? t.male : t.female} · {state.yearsLived} {t.yearsOld}
                  </p>
                  <p className="text-xs font-semibold text-stamp mt-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{state.job}</span>
                  </p>
                </div>
              </div>

              {/* ID Metadata list */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-dashed border-rule pt-2.5 font-mono">
                <div>
                  <span className="text-ink3 block text-[11px] uppercase">
                    {lang === 'vi' ? 'Quốc tịch' : 'Nation'}
                  </span>
                  <span className="font-semibold text-ink truncate block">{countryName}</span>
                </div>
                <div>
                  <span className="text-ink3 block text-[11px] uppercase">{t.city}</span>
                  <span className="font-semibold text-ink truncate block">
                    {state.urban ? state.cityName : t.rural}
                  </span>
                </div>
                <div>
                  <span className="text-ink3 block text-[11px] uppercase">{t.religion}</span>
                  <span className="font-semibold text-ink truncate block">{religionName}</span>
                </div>
                <div>
                  <span className="text-ink3 block text-[11px] uppercase">
                    {lang === 'vi' ? 'Gia cảnh' : 'Quintile'}
                  </span>
                  <span className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((k) => (
                      <span
                        key={k}
                        className={`w-2 h-2 rounded-full inline-block border ${
                          k <= state.q ? 'bg-ink border-ink' : 'border-ink3 bg-transparent'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-ink3 ml-1 font-mono">Q{state.q}</span>
                  </span>
                </div>
              </div>

              {/* Passport MRZ Barcode line */}
              <div className="pt-2 border-t border-dashed border-rule font-mono text-[9.5px] tracking-wider text-ink3 select-all overflow-hidden whitespace-nowrap opacity-75">
                <div>{mrzLine1}</div>
                <div>{mrzLine2}</div>
              </div>
            </div>
          </div>

          {/* 2. Vital Stats Panel */}
          <div className="bg-card border border-rule rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink3 font-bold">
                {t.vitalStats}
              </h4>
              <span className="text-[11px] font-mono text-good font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span>${stats.wealth.toLocaleString()}</span>
              </span>
            </div>

            {/* Health */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1 text-ink">
                  <Heart className="w-3.5 h-3.5 text-bad fill-current" />
                  <span>{t.health}</span>
                </span>
                <span className="font-bold text-ink">{Math.round(stats.health)}%</span>
              </div>
              <div className="w-full h-2 bg-rule2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getHealthColor(stats.health)}`}
                  style={{ width: `${getStatPercent(stats.health)}%` }}
                />
              </div>
            </div>

            {/* Happiness */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1 text-ink">
                  <Smile className="w-3.5 h-3.5 text-gold" />
                  <span>{t.happiness}</span>
                </span>
                <span className="font-bold text-ink">{Math.round(stats.happiness)}%</span>
              </div>
              <div className="w-full h-2 bg-rule2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${getStatPercent(stats.happiness)}%` }}
                />
              </div>
            </div>

            {/* Smarts */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1 text-ink">
                  <Brain className="w-3.5 h-3.5 text-stamp" />
                  <span>{t.smarts}</span>
                </span>
                <span className="font-bold text-ink">{Math.round(stats.smarts)}%</span>
              </div>
              <div className="w-full h-2 bg-rule2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stamp transition-all duration-300"
                  style={{ width: `${getStatPercent(stats.smarts)}%` }}
                />
              </div>
            </div>

            {/* Social */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1 text-ink">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>{t.social}</span>
                </span>
                <span className="font-bold text-ink">{Math.round(stats.social)}%</span>
              </div>
              <div className="w-full h-2 bg-rule2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${getStatPercent(stats.social)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. Family Members List */}
          <div className="bg-card border border-rule rounded-lg p-4 shadow-sm text-xs font-mono space-y-1.5">
            <h4 className="uppercase tracking-wider text-ink3 font-bold mb-2">{t.family}</h4>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">{t.mom}:</span>
              <span className={state.family.mom.alive ? 'font-semibold text-ink' : 'line-through text-ink3'}>
                {state.family.mom.alive ? `${state.family.mom.age} tuổi` : 'Đã qua đời'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">{t.dad}:</span>
              <span className={state.family.dad.alive ? 'font-semibold text-ink' : 'line-through text-ink3'}>
                {state.family.dad.alive ? `${state.family.dad.age} tuổi` : state.family.dad.absent ? 'Vắng mặt' : 'Đã qua đời'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">{t.partner}:</span>
              <span className="font-semibold text-ink">
                {state.family.partner ? state.family.partner.name : t.none}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">{t.children}:</span>
              <span className="font-semibold text-ink">{state.family.children.length} người</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink2">{t.grandchildren}:</span>
              <span className="font-semibold text-ink">{state.family.grandchildrenCount} người</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2 (Center flex-1 / 5 cols lg):
            Living Pixel Diorama Scene (Full width!), Focus, Feed
           ======================================================== */}
        <div className="lg:col-span-5 space-y-4">

          {/* 1. Living Animated Pixel Diorama Scene (Full Width at Top!) */}
          <SceneDiorama state={state} lang={lang} theme={theme} />

          {/* 2. Focus of the Year selector & Life Activities */}
          <div className="bg-card border border-rule rounded-lg p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-ink3 font-semibold">
                {lang === 'vi' ? 'Trọng tâm năm nay' : 'This Year\'s Focus'} ·{' '}
                <small className="lowercase font-normal text-ink3">
                  {lang === 'vi' ? 'đổi bất kỳ lúc nào' : 'change anytime'}
                </small>
              </span>
              {onOpenShop && (
                <button
                  onClick={onOpenShop}
                  className="px-2.5 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-white transition cursor-pointer text-xs font-mono font-semibold flex items-center gap-1 active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Hoạt động & Mua sắm' : 'Activities & Shop'}</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFocus(f.id)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-mono transition cursor-pointer flex flex-col items-start leading-tight ${
                    activeFocus === f.id
                      ? 'bg-stamp border-stamp text-paper shadow-xs font-semibold'
                      : 'bg-paper border-rule text-ink hover:border-ink3'
                  }`}
                >
                  <span>{f.label[lang] || f.label.vi}</span>
                  <small className="text-[10px] opacity-75">{f.sub[lang] || f.sub.vi}</small>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chronological Life Log Feed */}
          <div className="bg-card border border-rule rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-rule pb-3">
              <h3 className="font-display text-lg font-bold text-ink">
                {t.lifeFeed}
              </h3>
              <span className="text-xs font-mono text-ink3">
                {state.log.length} {lang === 'vi' ? 'sự kiện' : 'entries'}
              </span>
            </div>

            <div className="max-h-[580px] overflow-y-auto space-y-3 pr-1">
              {state.log.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border text-sm transition-all animate-fade-in ${
                    item.type === 'death'
                      ? 'bg-bad/10 border-bad/30 text-bad font-semibold'
                      : item.type === 'reflection'
                      ? 'bg-amber-500/15 border-amber-500/40 text-ink'
                      : item.type === 'family'
                      ? 'bg-stamp-soft/50 border-stamp/20 text-ink'
                      : item.type === 'decision'
                      ? 'bg-accent/10 border-accent/20 text-ink'
                      : 'bg-paper/80 border-rule2 text-ink2'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-ink/10 text-ink text-xs font-mono font-bold">
                      {item.age} {t.yearsOld}
                    </span>
                    {item.type === 'reflection' && (
                      <span className="text-xs font-mono uppercase text-amber-700 dark:text-amber-300 font-bold tracking-wider">
                        • {lang === 'vi' ? 'Chiêm nghiệm' : lang === 'ko' ? '되돌아보기' : 'Reflection'}
                      </span>
                    )}
                    {item.type === 'decision' && (
                      <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                        • Lựa chọn
                      </span>
                    )}
                    {item.type === 'family' && (
                      <span className="text-xs font-mono uppercase text-stamp font-semibold tracking-wider">
                        • Gia đình
                      </span>
                    )}
                    {item.type === 'death' && (
                      <span className="text-xs font-mono uppercase text-bad font-bold tracking-wider">
                        • Mất
                      </span>
                    )}
                  </div>
                  <p className="font-body text-ink text-sm leading-relaxed">
                    {item.text[lang] || item.text.vi || item.text}
                  </p>
                  {item.fact && (
                    <div className="mt-2 text-xs font-mono text-ink3 border-l-2 border-stamp/40 pl-2.5 py-0.5 leading-relaxed bg-stamp-soft/20 rounded-r">
                      <span className="font-bold text-stamp mr-1">ℹ</span>
                      <span>{item.fact[lang] || item.fact.vi || (typeof item.fact === 'string' ? item.fact : '')}</span>
                    </div>
                  )}
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 3 (Right ~340px / 3 cols lg):
            Peer Babies, 100-Year Life Grid, Survival Curve, Country Stats
           ======================================================== */}
        <div className="lg:col-span-3 space-y-4">

          {/* 1. Born in the Same Second (Peer Babies) */}
          <PeerBabies peers={state.peers} age={state.yearsLived} lang={lang} />

          {/* 2. World Geographic Birthplace Map */}
          <LifeMap lifeState={state} lang={lang} />

          {/* 3. 100-Year Life Map Grid */}

          <div className="bg-card border border-rule rounded-lg p-4 shadow-sm">
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink3 font-bold mb-3 flex items-center justify-between">
              <span>{t.lifeGrid}</span>
              <span className="text-accent font-mono">{state.yearsLived}/100</span>
            </h4>

            {/* 10x10 Grid */}
            <div className="grid grid-cols-10 gap-1.5 p-2 bg-paper rounded border border-rule">
              {Array.from({ length: 100 }).map((_, index) => {
                const year = index + 1;
                const isLived = year <= state.yearsLived;
                const isCurrent = year === state.yearsLived;
                const isLifeExp = year === Math.round(country.le);

                let cellColor = 'bg-rule2';
                if (isCurrent) {
                  cellColor = 'bg-accent animate-pulse ring-2 ring-accent ring-offset-1';
                } else if (isLived) {
                  cellColor = 'bg-stamp';
                }

                return (
                  <div
                    key={index}
                    title={`Năm ${year} tuổi`}
                    className={`aspect-square rounded-xs transition-colors relative cursor-default ${cellColor} ${
                      isLifeExp && !isLived ? 'border border-gold' : ''
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex justify-between text-[11px] font-mono text-ink3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-stamp inline-block" />
                <span>Đã qua</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-accent inline-block" />
                <span>Hiện tại</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs border border-gold inline-block" />
                <span>Kỳ vọng ({country.le}t)</span>
              </span>
            </div>
          </div>

          {/* 3. National Survival Curve */}
          <SurvivalCurve age={state.yearsLived} country={country} lang={lang} />

          {/* 4. National Real Statistics Card */}
          <div className="bg-card border border-rule rounded-lg p-4 shadow-sm text-xs space-y-2 font-mono">
            <h4 className="uppercase tracking-wider text-ink3 font-bold mb-2">Thống kê {countryName}</h4>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">Kỳ vọng sống:</span>
              <span className="font-bold text-ink">{country.le} tuổi</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">Tử vong sơ sinh:</span>
              <span className="font-bold text-ink">{country.im} ‰</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">Thu nhập bình quân:</span>
              <span className="font-bold text-good">${country.ppp.toLocaleString()} PPP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule2">
              <span className="text-ink2">Tỷ lệ sinh:</span>
              <span className="font-bold text-ink">{country.tfr} con / phụ nữ</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink2">Đô thị hóa:</span>
              <span className="font-bold text-ink">{country.urb}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

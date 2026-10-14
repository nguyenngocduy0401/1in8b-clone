import React, { useState, useEffect } from 'react';
import { Sparkles, Dices, Globe2, BookOpen, HeartPulse, GraduationCap, ShieldAlert, Calendar, MapPin } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n';

export default function Hero({ lang, onRoll, isRolling }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  const [selectedEra, setSelectedEra] = useState('2024');
  const [homeCountry, setHomeCountry] = useState('VNM');

  // Live ticker: ~4.3 babies born per second
  const [ticker, setTicker] = useState(0);


  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - start) / 1000;
      setTicker(Math.floor(elapsedSec * 4.3));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const REGIONS = [
    { name: { vi: 'Châu Phi hạ Sahara', en: 'Sub-Saharan Africa', ko: '사하라 이남 아프리카' }, pct: 29.8, color: '#0F6E68' },
    { name: { vi: 'Nam Á (Ấn Độ, Pakistan...)', en: 'South Asia (India, Pakistan...)', ko: '남아시아 (인도·파키스탄 등)' }, pct: 26.2, color: '#8C1D3C' },
    { name: { vi: 'Đông Á & Đông Nam Á', en: 'East & Southeast Asia', ko: '동아시아 및 동남아시아' }, pct: 18.5, color: '#9C7020' },
    { name: { vi: 'Mỹ Latinh & Caribe', en: 'Latin America & Caribbean', ko: '중남미 및 카리브해' }, pct: 8.4, color: '#2B7A4E' },
    { name: { vi: 'Trung Đông & Bắc Phi', en: 'Middle East & North Africa', ko: '중동 및 북아프리카' }, pct: 8.8, color: '#A8730F' },
    { name: { vi: 'Châu Âu, Bắc Mỹ, Úc', en: 'Europe, North America, Oceania', ko: '유럽, 북미, 오세아니아' }, pct: 8.3, color: '#4A5A61' },
  ];

  return (
    <section className="py-10 sm:py-16 max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Heading & Roll CTA */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-stamp">
            <span className="w-2 h-2 rounded-full bg-stamp animate-ping" />
            <span>{t.birthRateBanner}</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-ink tracking-tight leading-none">
            {t.heroTitle}
            <span className="block text-2xl sm:text-3xl font-serif text-accent font-semibold mt-2">
              Who will you be born as?
            </span>
          </h1>

          <p className="text-ink2 text-base sm:text-lg leading-relaxed font-body">
            {t.heroLede}
          </p>

          {/* Live Birth Ticker */}
          <div className="p-4 rounded-lg bg-card border border-rule shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-ink3 block">
                {lang === 'vi' ? 'Số trẻ vừa chào đời từ khi bạn vào trang:' : lang === 'ko' ? '페이지 접속 후 방금 태어난 아기:' : 'Babies born since you arrived:'}
              </span>
              <strong className="font-display text-3xl font-bold text-accent font-mono">
                +{ticker.toLocaleString()}
              </strong>
            </div>
            <div className="text-right text-xs font-mono text-ink3">
              <div>~4.3 babies / sec</div>
              <div className="text-good font-semibold">140M babies / year</div>
            </div>
          </div>

          {/* Options: Era & Home Country (Authentic to 1in8b.life) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-card border border-rule rounded-lg text-xs font-mono">
            <div>
              <label className="block text-ink3 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stamp" />
                <span>{lang === 'vi' ? 'Thời đại / Năm sinh:' : lang === 'ko' ? '출생 시대 (연도):' : 'Birth Era:'}</span>
              </label>
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="w-full bg-paper border border-rule text-ink rounded px-2.5 py-1.5 font-mono cursor-pointer focus:outline-stamp"
              >
                <option value="2024">{lang === 'vi' ? 'Hiện tại (2024)' : lang === 'ko' ? '현재 (2024년)' : 'Modern Day (2024)'}</option>
                <option value="2010">{lang === 'vi' ? 'Năm 2010 (Thời kỳ Internet)' : lang === 'ko' ? '2010년대' : 'Year 2010 (Internet Era)'}</option>
                <option value="1990">{lang === 'vi' ? 'Năm 1990 (Hậu Chiến tranh Lạnh)' : lang === 'ko' ? '1990년대' : 'Year 1990 (Post-Cold War)'}</option>
                <option value="1970">{lang === 'vi' ? 'Năm 1970 (Kỷ nguyên công nghiệp)' : lang === 'ko' ? '1970년대' : 'Year 1970 (Industrial Expansion)'}</option>
                <option value="1950">{lang === 'vi' ? 'Năm 1950 (Thời hậu chiến)' : lang === 'ko' ? '1950년대' : 'Year 1950 (Post-WWII)'}</option>
                <option value="random">{lang === 'vi' ? 'Ngẫu nhiên (1950 - 2024)' : lang === 'ko' ? '무작위 연도 (1950~2024)' : 'Random Year (1950-2024)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-ink3 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>{lang === 'vi' ? 'Quốc gia đối chiếu:' : lang === 'ko' ? '비교 기준 국가:' : 'Home Country:'}</span>
              </label>
              <select
                value={homeCountry}
                onChange={(e) => setHomeCountry(e.target.value)}
                className="w-full bg-paper border border-rule text-ink rounded px-2.5 py-1.5 font-mono cursor-pointer focus:outline-accent"
              >
                <option value="VNM">Việt Nam (Vietnam)</option>
                <option value="KOR">대한민국 (South Korea)</option>
                <option value="USA">United States (Mỹ)</option>
                <option value="JPN">日本 (Japan)</option>
                <option value="CHN">中国 (China)</option>
                <option value="FRA">France (Pháp)</option>
                <option value="DEU">Germany (Đức)</option>
                <option value="GBR">United Kingdom (Anh)</option>
                <option value="AUS">Australia (Úc)</option>
                <option value="IND">India (Ấn Độ)</option>
              </select>
            </div>
          </div>

          {/* Roll Button */}
          <div className="pt-1">
            <button
              onClick={() => onRoll(selectedEra, homeCountry)}
              disabled={isRolling}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-accent-ink rounded font-display text-xl font-bold tracking-wide shadow-vintage transition duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? t.rolling : t.rollButton}</span>
            </button>
            <p className="text-xs font-mono text-ink3 mt-2">
              {lang === 'vi' ? 'Gieo xác suất ngẫu nhiên dựa trên số liệu Liên Hợp Quốc & WHO' : 'Randomized authentic simulation according to UN & WHO demographic tables'}
            </p>
          </div>
        </div>


        {/* Right Column: Global Odds Card */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-card border border-rule rounded-lg p-5 shadow-vintage">
            <h2 className="font-display text-lg font-bold text-ink mb-1 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-stamp" />
              <span>{t.globalOddsTitle}</span>
            </h2>
            <p className="text-xs text-ink3 mb-4 font-mono">{t.oddsHint}</p>

            <div className="space-y-3.5">
              {REGIONS.map((r, i) => (
                <div key={i} className="text-sm">
                  <div className="flex justify-between items-center mb-1 font-mono text-xs text-ink2">
                    <span className="truncate pr-2 font-body text-ink">{r.name[lang] || r.name.vi}</span>
                    <span className="font-bold">{r.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-rule2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${r.pct * 2.8}%`, backgroundColor: r.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-rule text-xs text-ink3 space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-accent" />
                <span>Tuổi thọ & Rủi ro: WHO Global Burden of Disease</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-stamp" />
                <span>Giáo dục & Thu nhập: World Bank & UNESCO</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-warn" />
                <span>Xung đột & Rủi ro tự nhiên: Our World in Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

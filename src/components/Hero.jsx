import React, { useState, useEffect } from 'react';
import { UI_TRANSLATIONS } from '../i18n';

export default function Hero({ lang = 'en', onRoll, isRolling }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en || UI_TRANSLATIONS.vi;

  const [birthCount, setBirthCount] = useState(14);
  const [deathCount, setDeathCount] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setBirthCount((prev) => prev + 4);
      setDeathCount((prev) => prev + 2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const COUNTRY_STATS = [
    { name: 'India', pct: 17.6 },
    { name: 'China', pct: 6.7 },
    { name: 'Nigeria', pct: 5.7 },
    { name: 'Pakistan', pct: 5.2 },
    { name: 'Indonesia', pct: 3.4 },
    { name: 'DR Congo', pct: 3.3 },
    { name: 'Ethiopia', pct: 3.1 },
    { name: 'United States', pct: 2.8 },
    { name: 'Bangladesh', pct: 2.6 },
    { name: '163 other countries', pct: 49.5 }
  ];

  const MEMORIAL_PREVIEWS = [
    { name: 'John Miller', years: '2026 – 2118', place: 'United States', bg: '#F5ECE3' },
    { name: 'David Schulz', years: '2026 – 2120', place: 'Austria', bg: '#EBF0ED' },
    { name: 'Shazia Khan', years: '2026 – 2093', place: 'Pakistan', bg: '#F2E8DC' }
  ];

  return (
    <section className="py-8 sm:py-14 max-w-5xl mx-auto px-4 font-body text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Heading, Counters, and Intro text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-mono text-ink3 space-x-1">
            <span>v0.7.68 beta ·</span>
            <span>Free life simulation ·</span>
            <span>Real statistics from 172 countries</span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl font-extrabold text-ink tracking-tight leading-none">
            <span className="italic font-serif text-accent">1</span> in 8 Billion
          </h1>

          <p className="text-ink2 text-base sm:text-lg leading-relaxed font-body">
            Right now, about four babies are born every second. You become one of them and live that one life all the way to its end. Where you are born, and to whom, you don’t get to choose. Just as you didn’t.
          </p>

          {/* Live Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-card border border-rule shadow-xs">
              <strong className="font-display text-4xl sm:text-5xl font-extrabold text-ink block font-mono">
                {birthCount}
              </strong>
              <span className="text-xs font-mono text-ink2 mt-1 block">
                Babies born since you opened this page
              </span>
            </div>

            <div className="p-4 rounded-xl bg-card border border-rule shadow-xs">
              <strong className="font-display text-4xl sm:text-5xl font-extrabold text-ink block font-mono">
                {deathCount}
              </strong>
              <span className="text-xs font-mono text-ink2 mt-1 block">
                People who passed away in that time
              </span>
            </div>
          </div>

          {/* Today's Theme Badge */}
          <div className="p-3.5 rounded-lg bg-card border border-rule text-xs font-mono flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-stamp text-paper font-bold">
              Today's theme
            </span>
            <span className="text-ink font-semibold">A place to live</span>
            <span className="text-ink3 hidden sm:inline">· Every life born today passes through this theme together.</span>
          </div>

          {/* Real-time simulation ticker */}
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-2 text-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span>Right now, 19,677 people are each living their own life in this simulation.</span>
            </div>
            <div className="text-stamp pl-4">
              just now · Someone was born in Bangladesh
            </div>
          </div>

          {/* Lives kept in the memorial mini previews */}
          <div className="pt-2 border-t border-rule space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-ink font-semibold">Lives kept in the memorial</span>
              <span className="text-accent cursor-pointer hover:underline">See all</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MEMORIAL_PREVIEWS.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-rule bg-card text-xs font-mono">
                  <div className="h-10 rounded-xs bg-[#E3E8E6] mb-2 flex items-center justify-center text-sm">
                    🏠
                  </div>
                  <b className="text-ink block truncate">{m.name}</b>
                  <span className="text-[10px] text-ink3 block mt-0.5 truncate">{m.years}</span>
                  <span className="text-[10px] text-ink3 block truncate">{m.place}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prominent Center Be Born CTA Button */}
          <div className="pt-2 text-center sm:text-left">
            <button
              onClick={() => onRoll && onRoll('2026', 'VNM')}
              disabled={isRolling}
              className="px-10 py-4 bg-accent hover:bg-accent/90 text-accent-ink rounded-lg font-display text-xl font-bold tracking-wide shadow-vintage transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isRolling ? 'Choosing your birthplace...' : 'Be born'}
            </button>
          </div>
        </div>

        {/* Right Column: 'If you were a baby born right now' UN table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-rule rounded-xl p-6 shadow-vintage space-y-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
                If you were a baby born right now
              </h2>
              <p className="text-xs font-mono text-ink3 mt-1">
                UN World Population Prospects 2024 · based on 131.9 million people born in 2023
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {COUNTRY_STATS.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono gap-3">
                  <span className="text-ink truncate w-32">{c.name}</span>
                  <div className="flex-1 h-2 bg-rule2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stamp rounded-full"
                      style={{ width: `${Math.min(100, c.pct * 4.5)}%` }}
                    />
                  </div>
                  <span className="text-ink font-semibold w-10 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('172 countries statistics available in game!')}
                className="w-full py-2.5 rounded border border-rule bg-paper hover:bg-card text-xs font-mono text-ink transition cursor-pointer"
              >
                See the statistics for all 172 countries
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

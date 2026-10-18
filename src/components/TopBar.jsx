import React, { useState } from 'react';
import { UI_TRANSLATIONS } from '../i18n';

export default function TopBar({
  age,
  speed,
  setSpeed,
  isPaused,
  togglePause,
  stepForward,
  onFastForward,
  lang,
  setLang,
  theme,
  setTheme,
  onReset,
  onOpenPastLives,
  hasActiveLife,
  isSoundOn,
  onToggleSound,
  onOpenShop,
  onOpenAchievements,
  unlockedAchievementsCount = 0,
  lifeState,
  isAutoMode = false,
  onToggleAutoMode,
  isPausesOn = true,
  onTogglePauses
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  const currentYear = lifeState ? (lifeState.birthYear || 2026) + age : 2026;
  const characterName = lifeState?.name?.full || '';

  // Speed options exactly as 1in8b.life: 1x, 2x, 4x, 8x, 12x, 16x
  const SPEED_LEVELS = [1, 2, 4, 8, 12, 16];

  // Seconds per year indication (approximate calculation matching original)
  const secPerYear = Math.max(3, Math.round(51 / (speed || 1)));

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-rule shadow-xs px-4 py-2 transition-colors select-none">
      <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Age & Year Progress Header */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onReset}
            className="flex items-baseline gap-1 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink hover:opacity-85 transition cursor-pointer"
          >
            <span className="italic font-serif text-accent font-bold">1</span>
            <span className="text-sm font-semibold text-ink2 lowercase font-serif px-0.5">in</span>
            <span className="tracking-tight">8 Billion</span>
          </button>

          {hasActiveLife && (
            <div className="flex items-baseline gap-2 pl-3 border-l border-rule">
              <span className="font-display text-2xl font-bold text-ink leading-none flex items-baseline gap-1">
                <span className="text-sm font-normal text-ink2">Age</span>
                <span className="text-accent text-3xl font-mono">{age}</span>
              </span>

              <div className="flex flex-col ml-1">
                <span className="text-xs font-mono text-ink2 leading-tight">
                  {currentYear} · {characterName} · 1 year ≈ {secPerYear} sec
                </span>
                {/* Thin Maroon Progress Line under year */}
                <div className="w-28 sm:w-44 h-1 bg-rule2 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((age / 80) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speed Controls (Only during active life) */}
        {hasActiveLife && (
          <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Time controls">
            {/* Pause Button: ❚❚ Pause */}
            <button
              onClick={togglePause}
              title={isPaused ? 'Resume' : 'Pause'}
              className={`px-3 py-1.5 text-xs font-mono rounded border border-rule transition cursor-pointer flex items-center gap-1.5 ${
                isPaused ? 'bg-accent text-accent-ink border-accent font-bold shadow-xs' : 'bg-paper hover:bg-card text-ink'
              }`}
            >
              <span className="font-bold tracking-tighter">❚❚</span>
              <span>Pause</span>
            </button>

            {/* Speeds: 1x, 2x, 4x, 8x, 12x, 16x */}
            <span className="inline-flex rounded border border-rule bg-paper overflow-hidden text-xs font-mono">
              {SPEED_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    if (isPaused) togglePause();
                  }}
                  className={`px-2 py-1.5 transition cursor-pointer border-r border-rule last:border-r-0 ${
                    speed === s && !isPaused ? 'bg-ink text-paper font-bold' : 'hover:bg-card text-ink2 hover:text-ink'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </span>

            {/* Next Decision Button */}
            {onFastForward && (
              <button
                onClick={onFastForward}
                title="Fast forward to next milestone or decision"
                className="px-3 py-1.5 text-xs font-mono rounded border border-rule bg-paper hover:bg-card text-ink transition cursor-pointer font-medium"
              >
                Next decision »
              </button>
            )}

            {/* Auto Mode Button */}
            {onToggleAutoMode && (
              <button
                onClick={onToggleAutoMode}
                title="Let decisions be made automatically"
                className={`hidden md:inline-flex px-2.5 py-1.5 text-xs font-mono rounded border transition cursor-pointer ${
                  isAutoMode ? 'bg-stamp text-paper border-stamp font-bold' : 'bg-paper border-rule text-ink hover:bg-card'
                }`}
              >
                Auto mode
              </button>
            )}

            {/* Music Button: ♪ Music */}
            <button
              onClick={onToggleSound}
              title="Calm background music"
              className={`hidden sm:inline-flex px-2.5 py-1.5 text-xs font-mono rounded border transition cursor-pointer items-center gap-1 ${
                isSoundOn ? 'bg-accent/15 text-accent border-accent/40 font-bold' : 'bg-paper border-rule text-ink hover:bg-card'
              }`}
            >
              <span>♪ Music</span>
            </button>

            {/* Pauses Button: ✎ Pauses */}
            {onTogglePauses && (
              <button
                onClick={onTogglePauses}
                title="Pause at 5, 15, 30, 50, 70 to reflect"
                className={`hidden lg:inline-flex px-2.5 py-1.5 text-xs font-mono rounded border transition cursor-pointer ${
                  isPausesOn ? 'bg-paper border-rule text-ink font-semibold' : 'bg-card border-rule/50 text-ink3 line-through'
                }`}
              >
                ✎ Pauses
              </button>
            )}

            {/* Light / Dark Mode Toggle: ◐ */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Light or dark: follows your device"
              className="px-2 py-1.5 text-sm font-mono rounded border border-rule bg-paper hover:bg-card text-ink transition cursor-pointer"
            >
              ◐
            </button>

            {/* More / Mobile Dropdown Toggle (⋯) */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-2.5 py-1.5 text-xs font-mono rounded border border-rule bg-paper hover:bg-card text-ink transition cursor-pointer"
                title="More options"
              >
                ⋯
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-card border border-rule rounded-lg shadow-vintage p-2 z-50 text-xs font-mono space-y-1 animate-pop">
                  {onToggleAutoMode && (
                    <button
                      onClick={() => {
                        onToggleAutoMode();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper text-ink transition"
                    >
                      {isAutoMode ? '✓ Auto mode (Bật)' : 'Auto mode'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onToggleSound();
                      setIsMoreOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper text-ink transition"
                  >
                    {isSoundOn ? '✓ ♪ Music (Đang bật)' : '♪ Music (Tắt)'}
                  </button>
                  {onTogglePauses && (
                    <button
                      onClick={() => {
                        onTogglePauses();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper text-ink transition"
                    >
                      {isPausesOn ? '✓ ✎ Pauses (Bật)' : '✎ Pauses (Tắt)'}
                    </button>
                  )}
                  {onOpenAchievements && (
                    <button
                      onClick={() => {
                        onOpenAchievements();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper text-ink transition"
                    >
                      🏆 Huân chương ({unlockedAchievementsCount})
                    </button>
                  )}
                  {onOpenShop && (
                    <button
                      onClick={() => {
                        onOpenShop();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper text-ink transition"
                    >
                      🛍️ Spend & invest
                    </button>
                  )}
                  <div className="border-t border-rule my-1" />
                  <button
                    onClick={() => {
                      onReset();
                      setIsMoreOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-bad hover:bg-paper transition"
                  >
                    Exit (Thoát)
                  </button>
                </div>
              )}
            </div>

            {/* Exit Button */}
            <button
              onClick={onReset}
              title="Exit to home screen"
              className="px-2.5 py-1.5 text-xs font-mono rounded border border-rule bg-paper hover:bg-card text-ink transition cursor-pointer"
            >
              Exit
            </button>
          </div>
        )}

        {/* Global Utilities (Language, Past Lives, Theme) */}
        {!hasActiveLife && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onOpenPastLives}
              className="px-3 py-1.5 rounded border border-rule bg-paper hover:bg-card text-ink text-xs font-mono transition cursor-pointer"
            >
              Past lives (Tiền kiếp)
            </button>

            {/* Language Switcher */}
            <div className="flex border border-rule rounded overflow-hidden bg-paper text-xs font-mono">
              {['en', 'vi', 'ko'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 uppercase transition cursor-pointer ${
                    lang === l ? 'bg-ink text-paper font-bold' : 'text-ink2 hover:text-ink hover:bg-card'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2 py-1 text-sm font-mono rounded border border-rule bg-paper hover:bg-card text-ink transition cursor-pointer"
              title="Light or dark: follows your device"
            >
              ◐
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

import React from 'react';
import { Play, Pause, FastForward, Sun, Moon, BookOpen, SkipForward, Volume2, VolumeX, ShoppingBag, Award } from 'lucide-react';
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
  unlockedAchievementsCount = 0
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-rule shadow-sm px-4 py-2 transition-colors">
      <div className="max-w-[1340px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-baseline gap-1.5 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink hover:opacity-85 transition cursor-pointer"
          >
            <span className="italic font-serif text-accent">1</span>
            <span className="text-sm font-semibold text-ink2 lowercase font-serif">in</span>
            <span className="tracking-tight">8 Billion</span>
          </button>

          {hasActiveLife && (
            <div className="flex items-center gap-2 pl-3 border-l border-rule">
              <span className="font-display text-2xl font-bold text-accent leading-none">
                {age}
                <small className="text-xs font-normal text-ink2 ml-1">
                  {lang === 'vi' ? 'tuổi' : lang === 'ko' ? '세' : 'yrs'}
                </small>
              </span>
            </div>
          )}
        </div>

        {/* Speed Controls (Only during active life) */}
        {hasActiveLife && (
          <div className="flex items-center gap-1.5 bg-paper p-1 rounded border border-rule">
            {/* Pause / Resume */}
            <button
              onClick={togglePause}
              title={isPaused ? t.play : t.pause}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1 transition cursor-pointer ${
                isPaused ? 'bg-accent text-accent-ink font-semibold' : 'hover:bg-card text-ink'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPaused ? t.play : t.pause}</span>
            </button>

            {/* Step 1 year */}
            <button
              onClick={stepForward}
              title={t.step}
              className="px-2 py-1 text-xs font-mono hover:bg-card text-ink rounded flex items-center gap-1 transition cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.step}</span>
            </button>

            {/* Speed buttons */}
            {[1, 2, 4, 8].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  if (isPaused) togglePause();
                }}
                className={`px-2 py-1 text-xs font-mono rounded transition cursor-pointer ${
                  speed === s && !isPaused ? 'bg-ink text-paper font-semibold' : 'hover:bg-card text-ink2'
                }`}
              >
                {s}×
              </button>
            ))}

            {/* Fast-forward to Next Decision button */}
            {onFastForward && (
              <button
                onClick={onFastForward}
                title={lang === 'vi' ? 'Tiến tới bước ngoặt tiếp theo' : 'Fast forward to next decision'}
                className="px-2.5 py-1 text-xs font-mono rounded bg-stamp-soft text-stamp hover:bg-stamp hover:text-paper font-medium flex items-center gap-1 transition cursor-pointer border border-stamp/30 ml-1"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {lang === 'vi' ? 'Quyết định »' : lang === 'ko' ? '다음 선택 »' : 'Next »'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Utilities: Past Lives, Language & Theme */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onOpenPastLives}
            title={t.pastLives}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded border border-rule bg-card hover:bg-paper text-ink2 hover:text-ink text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.pastLives}</span>
          </button>

          {/* Achievements Button */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              title={lang === 'vi' ? 'Huân chương cuộc đời' : 'Lifetime Achievements'}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded border border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-paper text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {lang === 'vi' ? 'Huân chương' : lang === 'ko' ? '업적' : 'Badges'}
              </span>
              {unlockedAchievementsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-gold text-paper text-[10px] font-bold">
                  {unlockedAchievementsCount}
                </span>
              )}
            </button>
          )}

          {/* Lang Selector */}
          <div className="flex border border-rule rounded overflow-hidden bg-card text-xs font-mono">
            {['vi', 'en', 'ko'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 uppercase transition cursor-pointer ${
                  lang === l ? 'bg-ink text-paper font-bold' : 'text-ink3 hover:text-ink hover:bg-paper'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Shop / Activities (during living phase) */}
          {hasActiveLife && onOpenShop && (
            <button
              onClick={onOpenShop}
              title={lang === 'vi' ? 'Hoạt động & Trải nghiệm' : 'Life Activities & Shop'}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded border border-rule bg-card hover:bg-paper text-accent hover:text-accent-ink text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{lang === 'vi' ? 'Hoạt động' : lang === 'ko' ? '상점' : 'Shop'}</span>
            </button>
          )}

          {/* Ambient Procedural Music Toggle */}
          <button
            onClick={onToggleSound}
            title={isSoundOn ? (lang === 'vi' ? 'Tắt nhạc nền' : 'Mute ambient sound') : (lang === 'vi' ? 'Bật nhạc nền thư giãn' : 'Play ambient sound')}
            className={`p-1.5 rounded border border-rule transition cursor-pointer ${
              isSoundOn ? 'bg-accent/15 text-accent border-accent/40' : 'bg-card text-ink2 hover:text-ink'
            }`}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            className="p-1.5 rounded border border-rule bg-card hover:bg-paper text-ink transition cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-ink2" />}
          </button>
        </div>
      </div>
    </header>
  );
}

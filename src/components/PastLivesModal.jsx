import React, { useState } from 'react';
import { X, History, Trash2, Award, Flame, Film, Sparkles, Filter } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName } from '../i18n';
import { sound } from '../engine/soundSynth';
import { getLifeArchetype } from './DeathSummary';
import LifeFilmModal from './LifeFilmModal';

export default function PastLivesModal({ isOpen, onClose, pastLives, onClearHistory, lang = 'vi' }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'elder' | 'prime' | 'infant'
  const [activeFilmLife, setActiveFilmLife] = useState(null);
  const [candleCounts, setCandleCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('1in8b_memorial_candles');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  if (!isOpen) return null;
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  const totalYears = pastLives.reduce((acc, l) => acc + (l.yearsLived || 0), 0);
  const totalCandles = Object.values(candleCounts).reduce((acc, c) => acc + c, 0);

  // Handle lighting a memorial candle
  const handleLightCandle = (lifeKey) => {
    sound.playCandleChime();
    setCandleCounts((prev) => {
      const updated = {
        ...prev,
        [lifeKey]: (prev[lifeKey] || 0) + 1
      };
      try {
        localStorage.setItem('1in8b_memorial_candles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Filtered lives
  const filteredLives = pastLives.filter((life) => {
    const age = life.yearsLived || 0;
    if (filter === 'elder') return age >= 70;
    if (filter === 'infant') return age <= 5;
    if (filter === 'prime') return age > 5 && age < 70;
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
        <div className="bg-card border border-rule rounded-xl shadow-vintage max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden my-auto animate-pop">
          {/* Header */}
          <div className="px-5 py-4 border-b border-rule flex justify-between items-center bg-paper">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-lg text-ink">
                  {lang === 'vi' ? 'Đền Thờ & Nhà Lưu Niệm Tiền Kiếp' : lang === 'ko' ? '전생의 집 & 추모관' : 'House of Past Lives & Memorial Hall'}
                </h3>
              </div>
              <p className="text-xs text-ink3 font-mono mt-0.5">
                {lang === 'vi'
                  ? 'Mỗi cuộc đời đã trải qua đều được lưu giữ tôn kính tại đây.'
                  : lang === 'ko'
                  ? '살아 본 삶마다 방이 하나씩 있는 집입니다.'
                  : 'A sanctuary preserving every life you have lived across the world.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-card text-ink2 hover:text-ink transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hall Statistics Bar */}
          <div className="bg-stamp-soft/30 px-5 py-2.5 border-b border-rule flex flex-wrap justify-between items-center text-xs font-mono gap-2">
            <div className="flex items-center gap-4 text-ink">
              <span>
                🏛️ {pastLives.length} {lang === 'vi' ? 'kiếp sống' : 'lives'}
              </span>
              <span>
                ⏳ {totalYears.toLocaleString()} {lang === 'vi' ? 'năm trải nghiệm' : 'years lived'}
              </span>
              <span className="text-accent font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-accent fill-accent" />
                {totalCandles} {lang === 'vi' ? 'ngọn nến tri ân' : 'candles lit'}
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  filter === 'all' ? 'bg-stamp text-white font-bold' : 'hover:bg-paper text-ink2'
                }`}
              >
                {lang === 'vi' ? 'Tất cả' : 'All'}
              </button>
              <button
                onClick={() => setFilter('elder')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  filter === 'elder' ? 'bg-stamp text-white font-bold' : 'hover:bg-paper text-ink2'
                }`}
              >
                {lang === 'vi' ? 'Trường thọ (70+)' : 'Elders (70+)'}
              </button>
              <button
                onClick={() => setFilter('prime')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  filter === 'prime' ? 'bg-stamp text-white font-bold' : 'hover:bg-paper text-ink2'
                }`}
              >
                {lang === 'vi' ? 'Trưởng thành' : 'Adults'}
              </button>
              <button
                onClick={() => setFilter('infant')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  filter === 'infant' ? 'bg-stamp text-white font-bold' : 'hover:bg-paper text-ink2'
                }`}
              >
                {lang === 'vi' ? 'Thiên thần (≤5)' : 'Angels (≤5)'}
              </button>
            </div>
          </div>

          {/* Past Lives List */}
          <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
            {filteredLives.length === 0 ? (
              <div className="text-center py-14 text-ink3 font-mono text-sm space-y-2">
                <div className="text-3xl">🕯️</div>
                <p>
                  {pastLives.length === 0
                    ? (lang === 'vi' ? 'Chưa có kiếp sống nào được ghi nhận. Hãy bắt đầu cuộc đời đầu tiên!' : 'No past lives recorded yet. Begin your first journey!')
                    : (lang === 'vi' ? 'Không có kiếp sống nào phù hợp với bộ lọc.' : 'No lives match this filter.')}
                </p>
              </div>
            ) : (
              filteredLives.map((life, index) => {
                const lifeKey = life.id || `${life.name}_${life.timestamp || index}`;
                const countryName = getCountryName(life.countryId, lang, life.countryKo);
                const archetype = getLifeArchetype(life);
                const candles = candleCounts[lifeKey] || 0;

                return (
                  <div
                    key={lifeKey}
                    className="p-4 rounded-lg border border-rule bg-paper hover:border-accent/60 transition shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5"
                  >
                    {/* Left Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl" title={archetype.title[lang] || archetype.title.vi}>
                          {archetype.icon}
                        </span>
                        <b className="font-display text-base font-bold text-ink">{life.name}</b>
                        <span className="px-2 py-0.2 rounded-full bg-ink/10 text-ink text-xs font-mono font-semibold">
                          {life.yearsLived} {t.yearsOld}
                        </span>
                        <span className="text-[11px] font-mono text-stamp font-medium">
                          {archetype.title[lang] || archetype.title.vi}
                        </span>
                      </div>

                      <p className="text-xs text-ink2 font-mono">
                        {countryName} ({life.countryId}) · {life.job || 'Lao động'} · ${Number(life.wealth || 0).toLocaleString()}
                        {life.family?.childrenCount ? ` · ${life.family.childrenCount} người con` : ''}
                      </p>

                      <p className="text-xs text-bad/90 font-mono">
                        Mất do: {life.causeOfDeath ? (life.causeOfDeath[lang] || life.causeOfDeath.vi) : 'Tuổi già thanh thản'}
                      </p>
                    </div>

                    {/* Right Interactive Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Play Life Film Button */}
                      <button
                        onClick={() => setActiveFilmLife(life)}
                        className="px-3 py-1.5 rounded border border-rule hover:bg-card text-ink text-xs font-mono flex items-center gap-1.5 transition cursor-pointer hover:border-gold"
                        title={lang === 'vi' ? 'Chiếu phim ký ức 35mm' : 'Play 35mm Life Film'}
                      >
                        <Film className="w-3.5 h-3.5 text-gold" />
                        <span>{lang === 'vi' ? 'Xem phim' : 'Film'}</span>
                      </button>

                      {/* Light Candle Button */}
                      <button
                        onClick={() => handleLightCandle(lifeKey)}
                        className={`px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                          candles > 0
                            ? 'bg-accent/15 border-accent text-accent font-semibold shadow-xs'
                            : 'border-rule hover:border-accent text-ink2 hover:text-ink'
                        }`}
                        title={lang === 'vi' ? 'Thắp một ngọn nến tưởng niệm' : 'Light a memorial candle'}
                      >
                        <Flame className={`w-3.5 h-3.5 ${candles > 0 ? 'text-accent fill-accent animate-pulse' : 'text-ink3'}`} />
                        <span>{candles > 0 ? `${candles} 🕯️` : (lang === 'vi' ? 'Thắp nến' : 'Light')}</span>
                      </button>

                      <span className="text-xs font-mono text-ink3 w-6 text-right">
                        #{pastLives.length - pastLives.indexOf(life)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {pastLives.length > 0 && (
            <div className="px-5 py-3 border-t border-rule bg-paper flex justify-between items-center text-xs">
              <span className="text-ink3 font-mono">
                {lang === 'vi' ? 'Lưu trữ tự động trong trình duyệt' : 'Locally stored in browser'}
              </span>
              <button
                onClick={onClearHistory}
                className="text-bad hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Xóa toàn bộ lịch sử' : 'Clear all history'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Life Film Modal if active */}
      {activeFilmLife && (
        <LifeFilmModal
          isOpen={Boolean(activeFilmLife)}
          onClose={() => setActiveFilmLife(null)}
          life={activeFilmLife}
          lang={lang}
        />
      )}
    </>
  );
}

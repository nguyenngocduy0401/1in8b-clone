import React, { useState } from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../engine/achievements';

export default function AchievementsModal({ isOpen, onClose, currentLifeAchievements = [], lang = 'en' }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'

  if (!isOpen) return null;

  const globalUnlocked = getUnlockedAchievements();
  // Merge current life unlocked and global persistent unlocked
  const allUnlockedIds = Array.from(new Set([...globalUnlocked, ...currentLifeAchievements]));

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = allUnlockedIds.includes(ach.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = allUnlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const labels = {
    title: { vi: 'Bộ Sưu Tập Huân Chương Cuộc Đời', en: 'Lifetime Achievements Collection', ko: '인생 업적 컬렉션' },
    subtitle: {
      vi: 'Những dấu ấn và kỳ tích ghi nhận qua các kiếp sống nhân loại',
      en: 'Milestones and triumphs attained across your lifetimes',
      ko: '수많은 삶을 거치며 달성한 인류의 위대한 발자취'
    },
    all: { vi: 'Tất cả', en: 'All', ko: '전체' },
    unlocked: { vi: 'Đã mở khóa', en: 'Unlocked', ko: '달성 완료' },
    locked: { vi: 'Chưa đạt', en: 'Locked', ko: '미달성' },
    unlockedStatus: { vi: 'ĐÃ ĐẠT ĐƯỢC', en: 'UNLOCKED', ko: '달성 완료' },
    lockedStatus: { vi: 'CHƯA MỞ KHÓA', en: 'LOCKED', ko: '미달성' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card border border-rule rounded-xl shadow-vintage max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header Ribbon */}
        <div className="bg-loss text-paper px-6 py-4 flex justify-between items-center border-b border-rule">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-gold animate-bounce" />
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg tracking-wide uppercase">
                {labels.title[lang] || labels.title.en}
              </h3>
              <p className="text-xs font-mono opacity-80">
                {labels.subtitle[lang] || labels.subtitle.en}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer text-paper/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar banner */}
        <div className="bg-paper border-b border-rule p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs font-mono font-semibold mb-1.5 text-ink">
              <span>{lang === 'vi' ? 'Tiến độ hoàn thành:' : 'Completion Progress:'}</span>
              <span className="text-accent font-bold">{unlockedCount} / {totalCount} ({percentage}%)</span>
            </div>
            <div className="w-full h-2.5 bg-rule2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 self-start sm:self-auto">
            {['all', 'unlocked', 'locked'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                  filter === f
                    ? 'bg-ink text-paper font-bold'
                    : 'bg-card border border-rule text-ink3 hover:text-ink'
                }`}
              >
                {labels[f][lang] || labels[f].en}
              </button>
            ))}
          </div>
        </div>

        {/* List of achievements */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {filteredAchievements.map((ach) => {
            const isUnlocked = allUnlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-lg border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-paper border-gold/40 shadow-xs'
                    : 'bg-card/50 border-rule opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-gold/15 border-gold/40 text-gold shadow-inner'
                      : 'bg-rule2 border-rule text-ink3'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-ink3" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`font-display text-base font-bold truncate ${
                        isUnlocked ? 'text-ink' : 'text-ink3'
                      }`}
                    >
                      {ach.title[lang] || ach.title.en}
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                        isUnlocked
                          ? 'bg-good/15 text-good border border-good/30'
                          : 'bg-rule2 text-ink3 border border-rule'
                      }`}
                    >
                      {isUnlocked
                        ? labels.unlockedStatus[lang] || labels.unlockedStatus.en
                        : labels.lockedStatus[lang] || labels.lockedStatus.en}
                    </span>
                  </div>

                  <p className="text-xs text-ink2 mt-1 leading-relaxed">
                    {ach.desc[lang] || ach.desc.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-paper border-t border-rule flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-ink text-paper rounded font-mono text-xs font-semibold hover:bg-ink/90 transition cursor-pointer"
          >
            {lang === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

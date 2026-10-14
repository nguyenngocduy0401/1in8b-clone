import React from 'react';
import { X, History, Trash2, Award } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName } from '../i18n';

export default function PastLivesModal({ isOpen, onClose, pastLives, onClearHistory, lang }) {
  if (!isOpen) return null;
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-card border border-rule rounded-lg shadow-vintage max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden my-auto animate-pop">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-rule flex justify-between items-center bg-paper">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold text-lg text-ink">
              {t.pastLives} ({pastLives.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-card text-ink2 hover:text-ink transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {pastLives.length === 0 ? (
            <div className="text-center py-12 text-ink3 font-mono text-sm">
              Chưa có kiếp sống nào được ghi nhận. Hãy bắt đầu cuộc đời đầu tiên!
            </div>
          ) : (
            pastLives.map((life, index) => {
              const countryName = getCountryName(life.countryId, lang, life.countryKo);
              return (
                <div
                  key={index}
                  className="p-3.5 rounded border border-rule bg-paper hover:border-accent transition flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <b className="font-display text-base font-bold text-ink">{life.name}</b>
                      <span className="px-1.5 py-0.2 rounded bg-ink/10 text-ink text-xs font-mono font-semibold">
                        {life.yearsLived} {t.yearsOld}
                      </span>
                    </div>
                    <p className="text-xs text-ink2 font-mono">
                      {countryName} · {life.job} · ${life.wealth ? life.wealth.toLocaleString() : 0}
                    </p>
                    <p className="text-xs text-bad mt-1 font-mono">
                      Mất do: {life.causeOfDeath ? (life.causeOfDeath[lang] || life.causeOfDeath.vi) : 'Tuổi già'}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-ink3 shrink-0">#{pastLives.length - index}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {pastLives.length > 0 && (
          <div className="px-5 py-3 border-t border-rule bg-paper flex justify-between items-center text-xs">
            <span className="text-ink3 font-mono">Dữ liệu lưu trữ trong trình duyệt</span>
            <button
              onClick={onClearHistory}
              className="text-bad hover:underline font-mono flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

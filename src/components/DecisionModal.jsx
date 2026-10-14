import React from 'react';
import { HelpCircle, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n';

export default function DecisionModal({ decision, lang, onChoose }) {
  if (!decision) return null;
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;

  const title = decision.title[lang] || decision.title.vi;
  const body = decision.body[lang] || decision.body.vi;
  const fact = decision.fact ? (decision.fact[lang] || decision.fact.vi) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-card border border-rule rounded-lg shadow-vintage max-w-lg w-full overflow-hidden my-auto animate-pop">
        {/* Modal Header */}
        <div className="bg-accent text-accent-ink px-6 py-3.5 flex justify-between items-center border-b border-rule">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold" />
            <span className="font-display font-bold tracking-wider text-xs sm:text-sm uppercase">
              {t.dilemma} · {decision.age} {t.yearsOld}
            </span>
          </div>
          <span className="font-mono text-xs opacity-80">Bước ngoặt</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="font-display text-2xl font-bold text-ink leading-snug">
              {title}
            </h3>
            <p className="text-ink2 text-sm sm:text-base mt-2 leading-relaxed font-body">
              {body}
            </p>
          </div>

          {/* Demographic Real-World Fact Callout */}
          {fact && (
            <div className="p-3.5 rounded bg-stamp-soft/50 border-l-4 border-stamp text-xs text-ink leading-relaxed font-mono">
              <strong className="block text-stamp mb-0.5">Dữ liệu thống kê thực tế:</strong>
              {fact}
            </div>
          )}

          {/* Choices List */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs uppercase font-mono tracking-wider text-ink3 block">
              {t.chooseWisely}
            </span>
            {decision.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onChoose(choice)}
                className="w-full text-left p-3.5 rounded border border-rule bg-paper hover:bg-card hover:border-accent hover:shadow-sm transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div>
                  <b className="block text-sm font-semibold text-ink group-hover:text-accent transition">
                    {choice.label[lang] || choice.label.vi}
                  </b>
                  {choice.sub && (
                    <small className="text-xs text-ink3 font-mono block mt-0.5">
                      {choice.sub[lang] || choice.sub.vi}
                    </small>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-ink3 group-hover:text-accent group-hover:translate-x-1 transition shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

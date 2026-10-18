import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

export default function DecisionModal({ decision, lang = 'en', onChoose, onAutoDecisions, onSetAside }) {
  const [reflectionText, setReflectionText] = useState('');

  if (!decision) return null;

  const isPause = decision.isPause || decision.type === 'reflection';
  const title = decision.title?.[lang] || decision.title?.en || decision.title?.vi || '';
  const body = decision.body?.[lang] || decision.body?.en || decision.body?.vi || '';
  const fact = decision.fact ? (decision.fact[lang] || decision.fact.en || decision.fact.vi) : null;
  const quote = decision.quote ? (decision.quote[lang] || decision.quote.en || decision.quote.vi) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in select-none">
      <div className="bg-card border border-rule rounded-xl shadow-vintage max-w-xl w-full overflow-hidden my-auto animate-pop relative text-ink">
        
        {/* Top Kicker Header exactly as original: 'A big decision' or 'A pause' · Age X · Year */}
        <div className="px-6 pt-5 pb-2 flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={isPause ? 'text-stamp font-medium' : 'text-accent font-medium'}>
              {isPause ? 'A pause' : 'A big decision'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-ink3 font-medium">
              Age {decision.age} · {decision.year || (2026 + decision.age)}
            </span>

            {/* Set aside button ▾ */}
            {onSetAside && (
              <button
                onClick={onSetAside}
                className="px-2.5 py-1 rounded border border-rule bg-paper hover:bg-card text-ink2 hover:text-ink text-xs font-mono flex items-center gap-1 transition cursor-pointer"
              >
                <span>Set aside</span>
                <span className="text-[10px]">▾</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight tracking-tight">
              {title}
            </h2>
            <p className="text-ink2 text-sm sm:text-base mt-2.5 leading-relaxed font-body">
              {body}
            </p>
          </div>

          {/* Demographic Real-World Citation / Quote Callout (Green/Slate background exactly as 1in8b) */}
          {(fact || quote) && (
            <div className="p-4 rounded-lg bg-[#E2EBE8] dark:bg-[#1C272B] border-l-4 border-stamp text-xs text-ink leading-relaxed font-mono">
              <span className="block text-ink2 font-medium">
                {quote || fact}
              </span>
            </div>
          )}

          {/* Optional Reflection Input Area for Pause milestone (Age 5, 15, 30, 50, 70) */}
          {isPause && (
            <div className="pt-2">
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="e.g. A way to go to school (writing is optional)"
                rows={3}
                className="w-full bg-paper border border-accent/40 rounded-lg p-3 text-sm font-mono text-ink placeholder:text-ink3/60 focus:outline-accent focus:border-accent resize-none transition"
              />
            </div>
          )}

          {/* Numbered Choices List 1, 2, 3, 4 */}
          <div className="space-y-2.5 pt-2">
            {(decision.choices || []).map((choice, idx) => (
              <button
                key={choice.id || idx}
                onClick={() => onChoose({ ...choice, userNote: reflectionText })}
                className="w-full text-left p-4 rounded-lg border border-rule bg-paper hover:bg-card2 hover:border-accent hover:shadow-xs transition flex items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-ink/5 border border-rule flex items-center justify-center text-xs font-mono text-ink2 group-hover:border-accent group-hover:text-accent shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <b className="block text-sm sm:text-base font-semibold text-ink group-hover:text-accent transition">
                      {choice.label?.[lang] || choice.label?.en || choice.label?.vi || choice.label}
                    </b>
                    {choice.sub && (
                      <small className="text-xs text-ink3 font-mono block mt-1">
                        {choice.sub?.[lang] || choice.sub?.en || choice.sub?.vi || choice.sub}
                      </small>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink3 group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {/* Bottom helper buttons matching 1in8b.life exactly */}
          <div className="pt-3 border-t border-rule/60 flex flex-col sm:flex-row justify-center items-center gap-2">
            {onAutoDecisions && (
              <button
                onClick={onAutoDecisions}
                className="px-4 py-1.5 rounded border border-rule bg-paper hover:bg-card text-ink2 hover:text-ink text-xs font-mono transition cursor-pointer"
              >
                Leave decisions to auto from now on
              </button>
            )}

            {isPause && (
              <button
                onClick={() => onChoose(decision.choices[0])}
                className="px-4 py-1.5 rounded border border-rule bg-paper hover:bg-card text-ink3 hover:text-ink text-xs font-mono transition cursor-pointer"
              >
                Don't show these pauses again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

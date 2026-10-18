import React, { useState } from 'react';

export default function ReflectionModal({ reflection, onChoose, lang = 'en' }) {
  const [reflectionText, setReflectionText] = useState('');

  if (!reflection) return null;

  const title = reflection.title?.[lang] || reflection.title?.en || reflection.title?.vi || '';
  const fact = reflection.fact?.[lang] || reflection.fact?.en || reflection.fact?.vi || '';
  const qObj = reflection.questions?.[0] || {};
  const question = qObj.question?.[lang] || qObj.question?.en || qObj.question?.vi || '';
  const options = qObj.options || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in select-none">
      <div className="bg-card border border-rule rounded-xl shadow-vintage max-w-xl w-full overflow-hidden my-auto animate-pop relative text-ink">
        
        {/* Top Kicker exactly as original: 'A pause' · Age X · Year */}
        <div className="px-6 pt-5 pb-2 flex justify-between items-center text-xs font-mono">
          <span className="text-stamp font-medium">A pause</span>
          <div className="flex items-center gap-3">
            <span className="text-ink3 font-medium">
              Age {reflection.age} · {2026 + reflection.age}
            </span>
            <button
              onClick={() => onChoose(options[0])}
              className="px-2.5 py-1 rounded border border-rule bg-paper hover:bg-card text-ink2 hover:text-ink text-xs font-mono flex items-center gap-1 transition cursor-pointer"
            >
              <span>Set aside</span>
              <span className="text-[10px]">▾</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight tracking-tight">
              {title}
            </h2>
            <p className="text-ink2 text-sm sm:text-base mt-2 leading-relaxed font-body">
              {reflection.age === 5
                ? 'In this country, some children never reach their fifth birthday. You made it through those crucial early years.'
                : 'Looking back on the stretch of road behind you, what stands out most clearly in your memory?'}
            </p>
          </div>

          {/* Demographic Real-World Citation Callout (Green/Slate background exactly as 1in8b) */}
          {fact && (
            <div className="p-4 rounded-lg bg-[#E2EBE8] dark:bg-[#1C272B] border-l-4 border-stamp text-xs text-ink leading-relaxed font-mono">
              <span className="block text-ink2 font-medium">
                {fact}
              </span>
            </div>
          )}

          {/* Prompt heading */}
          <h3 className="font-display text-lg font-bold text-ink pt-1">
            {question || 'What do you remember or need most right now?'}
          </h3>

          {/* Optional Reflection Input Area */}
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="e.g. A way to go to school (writing is optional)"
            rows={3}
            className="w-full bg-paper border border-accent/40 rounded-lg p-3 text-sm font-mono text-ink placeholder:text-ink3/60 focus:outline-accent focus:border-accent resize-none transition"
          />

          {/* Numbered Choices List 1, 2 */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => onChoose({ ...options[0], userNote: reflectionText })}
              className="w-full text-left p-4 rounded-lg border border-rule bg-paper hover:bg-card2 hover:border-accent hover:shadow-xs transition flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-5 h-5 rounded-full bg-ink/5 border border-rule flex items-center justify-center text-xs font-mono text-ink2 group-hover:border-accent group-hover:text-accent shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <b className="block text-sm sm:text-base font-semibold text-ink group-hover:text-accent transition">
                    Write it down and carry on
                  </b>
                  <small className="text-xs text-ink3 font-mono block mt-1">
                    What you write stays in this life's record
                  </small>
                </div>
              </div>
            </button>

            <button
              onClick={() => onChoose(options[0])}
              className="w-full text-left p-4 rounded-lg border border-rule bg-paper hover:bg-card2 hover:border-accent hover:shadow-xs transition flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-5 h-5 rounded-full bg-ink/5 border border-rule flex items-center justify-center text-xs font-mono text-ink2 group-hover:border-accent group-hover:text-accent shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <b className="block text-sm sm:text-base font-semibold text-ink group-hover:text-accent transition">
                    Keep it to yourself and carry on
                  </b>
                </div>
              </div>
            </button>
          </div>

          {/* Bottom helper buttons */}
          <div className="pt-3 border-t border-rule/60 flex flex-col sm:flex-row justify-center items-center gap-2">
            <button
              onClick={() => onChoose(options[0])}
              className="px-4 py-1.5 rounded border border-rule bg-paper hover:bg-card text-ink2 hover:text-ink text-xs font-mono transition cursor-pointer"
            >
              Leave decisions to auto from now on
            </button>

            <button
              onClick={() => onChoose(options[0])}
              className="px-4 py-1.5 rounded border border-rule bg-paper hover:bg-card text-ink3 hover:text-ink text-xs font-mono transition cursor-pointer"
            >
              Don't show these pauses again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

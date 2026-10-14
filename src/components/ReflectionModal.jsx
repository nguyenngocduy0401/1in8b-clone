import React from 'react';

export default function ReflectionModal({ reflection, onChoose, lang }) {
  if (!reflection) return null;

  const title = reflection.title[lang] || reflection.title.vi;
  const fact = reflection.fact[lang] || reflection.fact.vi;
  const qObj = reflection.questions[0];
  const question = qObj.question[lang] || qObj.question.vi;

  return (
    <div className="fixed inset-0 z-50 bg-ink/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border-2 border-rule max-w-lg w-full rounded-xl shadow-2xl p-6 relative overflow-hidden font-serif">
        {/* Decorative corner stamp */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
          <div className="absolute transform rotate-45 bg-accent/15 text-accent text-[10px] py-1 right-[-35px] top-[18px] w-[120px] text-center font-bold tracking-widest uppercase">
            {lang === 'vi' ? 'Chiêm nghiệm' : lang === 'ko' ? '되돌아보기' : 'Reflection'}
          </div>
        </div>

        {/* Milestone Age Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/30 tracking-wider">
            {lang === 'vi' ? `Cột mốc ${reflection.age} tuổi` : lang === 'ko' ? `${reflection.age}세 인생 분기점` : `Age ${reflection.age} Milestone`}
          </span>
          <span className="text-xs text-ink/40 tracking-widest uppercase font-mono">1 in 8 Billion</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-ink mb-3 leading-snug">
          {title}
        </h2>

        {/* Question Prompt */}
        <p className="text-sm text-ink/80 mb-5 leading-relaxed italic bg-paper p-3.5 rounded-lg border border-rule/60">
          "{question}"
        </p>

        {/* Choice Options */}
        <div className="space-y-2.5 mb-5">
          {qObj.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChoose(opt)}
              className="w-full text-left p-3.5 rounded-lg border border-rule hover:border-accent hover:bg-accent/5 transition-all group flex items-start justify-between cursor-pointer active:scale-[0.99]"
            >
              <div className="flex-1 pr-3">
                <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors block">
                  {opt.label[lang] || opt.label.vi}
                </span>
              </div>
              <span className="text-xs font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          ))}
        </div>

        {/* Real Demographic Statistics Box */}
        <div className="p-3 bg-stamp/5 border border-stamp/20 rounded-lg text-xs text-ink/70 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-stamp mb-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{lang === 'vi' ? 'Thực tế thống kê toàn cầu' : lang === 'ko' ? '글로벌 통계의 현실' : 'Global Demographic Context'}</span>
          </div>
          <p>{fact}</p>
        </div>
      </div>
    </div>
  );
}

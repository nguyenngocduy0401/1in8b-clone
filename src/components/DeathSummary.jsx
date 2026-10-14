import React from 'react';
import { Skull, RotateCcw, Award, Download } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName } from '../i18n';
import AnimatedPortrait from './AnimatedPortrait';

export default function DeathSummary({ state, lang, onReincarnate, theme }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;
  const country = state.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const cause = state.causeOfDeath;

  // Calculate peer percentile
  const le = country.le || 73;
  let percentile = 50;
  if (state.yearsLived <= 1) {
    percentile = 3;
  } else if (state.yearsLived <= 5) {
    percentile = 8;
  } else {
    const z = (state.yearsLived - le) / 14;
    percentile = Math.round((1 / (1 + Math.exp(-1.6 * z))) * 100);
    percentile = Math.min(Math.max(percentile, 1), 99);
  }

  // Download share card canvas
  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#EBF0ED';
    ctx.fillRect(0, 0, 1200, 630);

    // Frame border
    ctx.strokeStyle = '#C7D2CE';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1152, 582);

    ctx.strokeStyle = '#8C1D3C';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 1136, 566);

    // Top Header band
    ctx.fillStyle = '#2C2F3A';
    ctx.fillRect(34, 34, 1132, 80);

    ctx.fillStyle = '#EBF0ED';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText('1 IN 8 BILLION · MEMORIAL CERTIFICATE', 60, 84);

    ctx.fillStyle = '#A3B2AF';
    ctx.font = '18px monospace';
    ctx.fillText(`ISO: ${country.id} · 1in8b.life`, 920, 84);

    // Main text
    ctx.fillStyle = '#13212A';
    ctx.font = 'bold 52px Georgia, serif';
    ctx.fillText(state.name.full, 60, 190);

    ctx.fillStyle = '#4A5A61';
    ctx.font = '24px sans-serif';
    ctx.fillText(`${countryName} · ${state.sex === 'M' ? 'Nam' : 'Nữ'} · ${state.urban ? state.cityName : 'Nông thôn'}`, 60, 230);

    // Lifespan & Cause
    ctx.fillStyle = '#8C1D3C';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText(`Hưởng thọ: ${state.yearsLived} tuổi (Kỳ vọng: ${country.le} tuổi)`, 60, 300);

    ctx.fillStyle = '#4A5A61';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Nguyên nhân mất: ${cause ? cause.vi : 'Tuổi già'}`, 60, 345);

    // Stats box
    ctx.fillStyle = '#F7FAF8';
    ctx.fillRect(60, 390, 1080, 150);
    ctx.strokeStyle = '#DCE4E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 390, 1080, 150);

    ctx.fillStyle = '#0F6E68';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Thống kê cuộc đời:`, 90, 435);

    ctx.fillStyle = '#13212A';
    ctx.font = '20px monospace';
    ctx.fillText(`• Sống thọ hơn ${percentile}% số người sinh cùng năm tại ${countryName}`, 90, 475);
    ctx.fillText(`• Nghề nghiệp: ${state.job} | Con cái: ${state.family.children.length} | Tài sản: $${state.stats.wealth.toLocaleString()}`, 90, 510);

    // Download trigger
    const link = document.createElement('a');
    link.download = `1in8b_${state.name.full.replace(/\s+/g, '_')}_${state.yearsLived}yo.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="bg-card border border-rule rounded-lg shadow-vintage overflow-hidden">
        {/* Memorial Header Banner */}
        <div className="bg-loss text-paper px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-rule">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-accent" />
            <span className="font-display font-bold tracking-wider text-base uppercase">
              {t.deathCert}
            </span>
          </div>
          <span className="font-mono text-xs opacity-80">
            {state.name.full} (0 - {state.yearsLived} {t.yearsOld})
          </span>
        </div>

        {/* Certificate Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="grayscale opacity-90">
              <AnimatedPortrait
                sex={state.sex}
                age={state.yearsLived}
                theme={theme}
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <span className="text-xs font-mono tracking-widest text-ink3 uppercase block mb-1">
                {countryName}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                {state.name.full}
              </h2>
              <p className="text-xl font-serif text-accent font-semibold mt-2">
                {t.yearsLivedTotal} {state.yearsLived} {t.yearsOld}
              </p>
            </div>
          </div>

          {/* Cause of death box */}
          <div className="p-4 rounded-lg bg-paper border border-rule space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-bad font-bold block">
              {t.cause}
            </span>
            <p className="font-display text-lg font-bold text-ink">
              {cause ? (cause[lang] || cause.vi) : 'Tuổi già qua đời'}
            </p>
            <p className="text-xs text-ink3 font-mono">
              {t.countryLifeExp} {countryName}: <b>{country.le} {t.yearsOld}</b>
            </p>
          </div>

          {/* Peer percentile benchmark */}
          <div className="p-5 rounded-lg bg-stamp-soft/50 border border-stamp/20 space-y-2">
            <div className="flex items-center gap-2 font-display font-bold text-stamp text-base">
              <Award className="w-5 h-5 text-gold" />
              <span>{t.peerComparison}</span>
            </div>
            <p className="text-sm text-ink leading-relaxed">
              {t.livedLongerThan} <b className="text-accent text-lg font-mono">{percentile}%</b> {t.ofPeers}
            </p>
            <div className="w-full h-3 bg-rule2 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-stamp rounded-full transition-all duration-1000"
                style={{ width: `${percentile}%` }}
              />
            </div>
          </div>

          {/* Life Achievements Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono border-t border-dashed border-rule pt-4">
            <div>
              <span className="text-ink3 block">Nghề nghiệp:</span>
              <b className="text-ink text-sm block mt-0.5 truncate">{state.job}</b>
            </div>
            <div>
              <span className="text-ink3 block">Con cái:</span>
              <b className="text-ink text-sm block mt-0.5">{state.family.children.length} người</b>
            </div>
            <div>
              <span className="text-ink3 block">Cháu chắt:</span>
              <b className="text-ink text-sm block mt-0.5">{state.family.grandchildrenCount} người</b>
            </div>
            <div>
              <span className="text-ink3 block">Tài sản để lại:</span>
              <b className="text-good text-sm block mt-0.5 font-mono">${state.stats.wealth.toLocaleString()}</b>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t border-rule">
            <button
              onClick={handleDownloadCard}
              className="px-5 py-3 rounded border border-rule hover:bg-paper font-display text-sm font-semibold text-ink flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-stamp" />
              <span>{t.saveShareCard}</span>
            </button>

            <button
              onClick={onReincarnate}
              className="px-7 py-3 rounded bg-accent hover:bg-accent/90 text-accent-ink font-display text-base font-bold shadow-vintage flex items-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.reincarnate}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

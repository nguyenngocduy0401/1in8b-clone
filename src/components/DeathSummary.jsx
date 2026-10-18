import React, { useState } from 'react';
import { Skull, RotateCcw, Award, Download, Share2, Check, Sparkles, Film } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName } from '../i18n';
import AnimatedPortrait from './AnimatedPortrait';
import { ACHIEVEMENTS } from '../engine/achievements';
import LifeFilmModal from './LifeFilmModal';

export function getLifeArchetype(state) {
  if (state.yearsLived >= 85) {
    return {
      title: { vi: 'Cây Cao Bóng Cả', en: 'Venerable Elder', ko: '덕망 높은 원로' },
      desc: {
        vi: 'Một đời trường thọ, tích lũy vô vàn trải nghiệm và chứng kiến sự đổi thay của thời đại.',
        en: 'A long life of wisdom, witnessing eras of transformation.',
        ko: '긴 세월 동안 시대의 변화를 지켜보며 깊은 덕을 쌓은 삶.'
      },
      icon: '🌳'
    };
  }
  if (state.stats.wealth >= 50000 || state.jobId === 'owner') {
    return {
      title: { vi: 'Doanh Nhân Tự Thân', en: 'Self-Made Pioneer', ko: '자수성가 개척자' },
      desc: {
        vi: 'Năng động, nhạy bén và làm chủ vận mệnh tài chính giữa dòng đời biến chuyển.',
        en: 'Energetic and financially astute, seizing opportunities with determination.',
        ko: '근면과 통찰로 자산을 일구고 자신의 운명을 스스로 개척한 삶.'
      },
      icon: '💼'
    };
  }
  if (state.stats.smarts >= 80 || state.stats.educationLevel >= 4) {
    return {
      title: { vi: 'Học Giả Uyên Bác', en: 'Enlightened Scholar', ko: '지혜로운 학자' },
      desc: {
        vi: 'Không ngừng học hỏi, rèn luyện trí tuệ và mở rộng chân trời tri thức.',
        en: 'Endlessly curious, pursuing knowledge and illuminating minds.',
        ko: '끊임없이 배움을 갈구하고 지혜의 지평을 넓힌 지성인의 삶.'
      },
      icon: '📜'
    };
  }
  if ((state.family.children && state.family.children.length >= 2) && (state.family.grandchildrenCount >= 1 || state.stats.social >= 75)) {
    return {
      title: { vi: 'Trụ Cột Gia Đình Ấm Áp', en: 'Loving Family Anchor', ko: '따뜻한 가문의 기둥' },
      desc: {
        vi: 'Dành trọn yêu thương cho mái ấm, con đàn cháu đống hòa thuận sum vầy.',
        en: 'Anchored in profound love, cherishing generations of family bonds.',
        ko: '가족을 위해 헌신하며 자손들의 따뜻한 울타리가 되어준 삶.'
      },
      icon: '🏡'
    };
  }
  if (state.stats.happiness >= 80) {
    return {
      title: { vi: 'Lãng Tử Tiêu Dao', en: 'Free-Spirited Soul', ko: '자유로운 방랑자' },
      desc: {
        vi: 'Biết tìm thấy niềm vui trong những điều bình dị, tâm hồn thanh thản không vướng bận.',
        en: 'Finding joy in simplicity, living with a serene and unbound spirit.',
        ko: '소박한 일상에서 기쁨을 찾으며 유유자적 평온을 누린 삶.'
      },
      icon: '🌿'
    };
  }
  if (state.yearsLived <= 5) {
    return {
      title: { vi: 'Búp Sen Đầu Đời', en: 'Fleeting Innocence', ko: '짧고 눈부신 생' },
      desc: {
        vi: 'Một thiên thần bé nhỏ ghé thăm trần thế trong thoáng chốc, để lại bao niềm thương nhớ.',
        en: 'A precious tender soul who briefly visited our world, leaving enduring love.',
        ko: '세상에 잠시 머물며 깊은 사랑과 여운을 남긴 순수한 영혼.'
      },
      icon: '✨'
    };
  }
  return {
    title: { vi: 'Chiến Binh Kiên Cường', en: 'Resilient Wanderer', ko: '의연한 순례자' },
    desc: {
      vi: 'Vững vàng vượt qua thăng trầm thời đại, sống trọn vẹn từng ngày được trao tặng.',
      en: 'Weathering the tides of time with dignity, embracing every gifted day.',
      ko: '시대의 풍파를 묵묵히 견뎌내며 주어진 삶을 온전히 살아낸 순례자.'
    },
    icon: '🧭'
  };
}

export default function DeathSummary({ state, lang = 'en', onReincarnate, theme, onOpenAchievements }) {
  const [copied, setCopied] = useState(false);
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const country = state.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const cause = state.causeOfDeath;
  const archetype = getLifeArchetype(state);

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

  // Unlocked achievements for this character
  const unlockedThisLife = ACHIEVEMENTS.filter((ach) =>
    (state.unlockedAchievements || []).includes(ach.id)
  );

  // Copy Epitaph to clipboard
  const handleCopySummary = () => {
    const charName = typeof state.name === 'object' ? (state.name.full || state.name.first) : state.name;
    const text = lang === 'vi'
      ? `📜 [1 in 8 Billion · Cuộc Đời]
Họ tên: ${charName}
Quê hương: ${countryName} (${country.id})
Hưởng thọ: ${state.yearsLived} tuổi (Kỳ vọng: ${country.le} tuổi)
Danh hiệu: ${archetype.icon} ${archetype.title[lang] || archetype.title.vi || archetype.title.en}
Nguyên nhân mất: ${cause ? (cause[lang] || cause.vi) : 'Tuổi già qua đời'}
Tài sản: $${state.stats.wealth.toLocaleString()} | Con cái: ${state.family.children.length}
Sống thọ hơn ${percentile}% số người sinh cùng thời!
🌍 Trải nghiệm: https://nguyenngocduy0401.github.io/1in8b-clone/`
      : `📜 [1 in 8 Billion · Life Record]
Name: ${charName}
Country: ${countryName} (${country.id})
Age: ${state.yearsLived} years old (Life expectancy: ${country.le} yrs)
Archetype: ${archetype.icon} ${archetype.title[lang] || archetype.title.en}
Cause of death: ${cause ? (cause[lang] || cause.en || cause.vi) : 'Old age'}
Net worth: $${state.stats.wealth.toLocaleString()} | Children: ${state.family.children.length}
Lived longer than ${percentile}% of peers born in the same country!
🌍 Experience life simulation: https://nguyenngocduy0401.github.io/1in8b-clone/`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

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
    ctx.font = 'bold 50px Georgia, serif';
    ctx.fillText(state.name.full, 60, 185);

    ctx.fillStyle = '#4A5A61';
    ctx.font = '22px sans-serif';
    ctx.fillText(
      `${countryName} · ${state.sex === 'M' ? 'Nam' : 'Nữ'} · ${state.urban ? state.cityName : 'Nông thôn'}`,
      60,
      225
    );

    // Archetype Title
    ctx.fillStyle = '#0F6E68';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText(`Danh hiệu: ${archetype.icon} ${archetype.title.vi}`, 60, 265);

    // Lifespan & Cause
    ctx.fillStyle = '#8C1D3C';
    ctx.font = 'bold 34px Georgia, serif';
    ctx.fillText(`Hưởng thọ: ${state.yearsLived} tuổi (Kỳ vọng: ${country.le} tuổi)`, 60, 325);

    ctx.fillStyle = '#4A5A61';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Nguyên nhân mất: ${cause ? cause.vi : 'Tuổi già thanh thản'}`, 60, 365);

    // Stats box
    ctx.fillStyle = '#F7FAF8';
    ctx.fillRect(60, 400, 1080, 145);
    ctx.strokeStyle = '#DCE4E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 400, 1080, 145);

    ctx.fillStyle = '#0F6E68';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Thống kê cuộc đời & Huân chương (${unlockedThisLife.length} huân chương):`, 90, 440);

    ctx.fillStyle = '#13212A';
    ctx.font = '19px monospace';
    ctx.fillText(`• Sống thọ hơn ${percentile}% số người sinh cùng năm tại ${countryName}`, 90, 480);
    ctx.fillText(
      `• Nghề nghiệp: ${state.job} | Con cái: ${state.family.children.length} | Tài sản: $${state.stats.wealth.toLocaleString()}`,
      90,
      515
    );

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

          {/* Life Archetype Banner */}
          <div className="p-4 rounded-lg bg-stamp-soft/30 border border-stamp/20 flex items-start gap-3.5">
            <span className="text-3xl shrink-0">{archetype.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stamp font-bold">
                  {lang === 'vi' ? 'Danh hiệu cuộc đời' : 'Life Archetype'}
                </span>
              </div>
              <h4 className="font-display text-lg font-bold text-ink">
                {archetype.title[lang] || archetype.title.vi}
              </h4>
              <p className="text-xs text-ink2 mt-0.5 leading-relaxed">
                {archetype.desc[lang] || archetype.desc.vi}
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

          {/* Unlocked Achievements in this Life */}
          {unlockedThisLife.length > 0 && (
            <div className="p-4 rounded-lg bg-paper border border-gold/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>{lang === 'vi' ? 'Huân chương đạt được trong kiếp này' : 'Achievements Earned'}</span>
                </span>
                <span className="text-xs font-mono text-gold font-bold">
                  {unlockedThisLife.length} huân chương
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {unlockedThisLife.map((ach) => (
                  <span
                    key={ach.id}
                    title={ach.desc[lang] || ach.desc.vi}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gold/15 border border-gold/30 text-ink text-xs font-mono font-semibold"
                  >
                    <span>{ach.icon}</span>
                    <span>{ach.title[lang] || ach.title.vi}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Heritage Roots */}
          {state.culture && (
            <div className="p-4 rounded-lg bg-paper border border-rule text-xs font-mono space-y-2">
              <span className="uppercase tracking-wider text-ink3 font-bold block">
                {lang === 'vi' ? 'Cội nguồn văn hóa' : 'Cultural Roots'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-ink2">
                <div>🍲 {state.culture.dish[lang] || state.culture.dish.vi}</div>
                <div>🏮 {state.culture.festival[lang] || state.culture.festival.vi}</div>
                <div>⚽ {state.culture.sport[lang] || state.culture.sport.vi}</div>
                <div>👥 {state.culture.ethnicity[lang] || state.culture.ethnicity.vi}</div>
              </div>
            </div>
          )}

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
              <b className="text-good text-sm block mt-0.5 font-mono">
                ${state.stats.wealth.toLocaleString()}
              </b>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t border-rule">
            <div className="flex flex-wrap gap-2">
              {/* Cinematic Life Film Button */}
              <button
                onClick={() => setIsFilmOpen(true)}
                className="px-4 py-2.5 rounded bg-stamp hover:bg-stamp/90 text-white font-display text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Film className="w-4 h-4 text-gold" />
                <span>{lang === 'vi' ? '🎞️ Xem Phim Ký Ức' : lang === 'ko' ? '🎞️ 주마등 필름' : '🎞️ Life Film'}</span>
              </button>

              <button
                onClick={handleDownloadCard}
                className="px-4 py-2.5 rounded border border-rule hover:bg-paper font-display text-sm font-semibold text-ink flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-stamp" />
                <span>{t.saveShareCard}</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded border border-rule hover:bg-paper font-display text-sm font-semibold text-ink flex items-center gap-2 transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-good" /> : <Share2 className="w-4 h-4 text-accent" />}
                <span>{copied ? (lang === 'vi' ? 'Đã sao chép!' : 'Copied!') : (lang === 'vi' ? 'Chia sẻ' : 'Share')}</span>
              </button>
            </div>

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

      {/* Cinematic Life Film Modal */}
      {isFilmOpen && (
        <LifeFilmModal
          isOpen={isFilmOpen}
          onClose={() => setIsFilmOpen(false)}
          life={state}
          lang={lang}
        />
      )}
    </div>
  );
}

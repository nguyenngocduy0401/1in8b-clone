import React from 'react';
import { Award, MapPin, Users, Coins, Sparkles, HeartHandshake } from 'lucide-react';
import { UI_TRANSLATIONS, getCountryName, getReligionName } from '../i18n';
import AnimatedPortrait from './AnimatedPortrait';

export default function BirthCard({ identity, lang, onStartLife, theme }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.vi;
  const country = identity.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const religionName = getReligionName(identity.religion, lang);

  // Annual birth share calculation
  const worldBirths = 135000000;
  const birthShare = ((country.b / worldBirths) * 100).toFixed(2);
  const oneInX = Math.round(worldBirths / country.b);

  const quintileLabels = {
    1: t.q1,
    2: t.q2,
    3: t.q3,
    4: t.q4,
    5: t.q5
  };

  return (
    <div className="py-8 sm:py-12 max-w-2xl mx-auto px-4 animate-fade-in">
      <div className="bg-card border border-rule rounded-lg shadow-vintage overflow-hidden relative">
        {/* Certificate Top Header Ribbon */}
        <div className="bg-accent text-accent-ink px-6 py-4 flex flex-wrap justify-between items-center gap-2 border-b border-rule">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            <span className="font-display font-bold tracking-wider text-sm sm:text-base uppercase">
              {t.birthCertificate}
            </span>
          </div>
          <span className="font-mono text-xs opacity-90">ISO: {country.id} · № {identity.name.first}</span>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Identity & Animated Avatar Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Animated Avatar Box (Blinking & Breathing) */}
            <AnimatedPortrait
              sex={identity.sex}
              age={0}
              theme={theme}
            />

            <div className="text-center sm:text-left flex-1">
              <span className="inline-block text-xs font-mono tracking-widest text-stamp uppercase mb-1 font-bold">
                {countryName}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {identity.name.full}
              </h2>
              <p className="text-sm text-ink2 mt-1 font-mono">
                {identity.sex === 'M' ? t.male : t.female} · {identity.urban ? identity.cityName : t.rural}
              </p>
            </div>
          </div>

          {/* Detailed Certificate Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed border-rule text-sm">
            <div>
              <span className="block text-xs uppercase font-mono text-ink3">{t.bornIn}</span>
              <strong className="text-ink font-semibold">{countryName}</strong>
            </div>

            <div>
              <span className="block text-xs uppercase font-mono text-ink3">{t.city}</span>
              <strong className="text-ink font-semibold">{identity.urban ? identity.cityName : t.rural}</strong>
            </div>

            <div>
              <span className="block text-xs uppercase font-mono text-ink3">{t.religion}</span>
              <strong className="text-ink font-semibold">{religionName}</strong>
            </div>

            <div>
              <span className="block text-xs uppercase font-mono text-ink3">{t.parents}</span>
              <span className="text-ink">
                {identity.family.mom.alive ? `Mẹ ${identity.family.mom.age}` : 'Mẹ mất'},{' '}
                {identity.family.dad.alive ? `Cha ${identity.family.dad.age}` : 'Vắng cha'}
              </span>
            </div>

            <div>
              <span className="block text-xs uppercase font-mono text-ink3">
                {lang === 'vi' ? 'Anh chị em' : 'Siblings'}
              </span>
              <span className="text-ink">
                {identity.family.olderSiblings} anh/chị, {identity.family.youngerSiblings} em
              </span>
            </div>

            <div>
              <span className="block text-xs uppercase font-mono text-ink3">{t.quintile}</span>
              <strong className="text-accent font-semibold">{quintileLabels[identity.q]}</strong>
            </div>
          </div>

          {/* National Statistical Reality Callout */}
          <div className="p-4 rounded bg-stamp-soft/50 border border-stamp/20 text-xs sm:text-sm text-ink leading-relaxed">
            <p className="font-mono text-stamp font-bold mb-1">
              {lang === 'vi' ? 'Xác suất sinh ra tại quốc gia này:' : 'Global Demographic Probability:'}
            </p>
            <p>
              {lang === 'vi'
                ? `Cứ 100 đứa trẻ sinh ra ngay lúc này trên Trái Đất, có khoảng ${birthShare}% (tương đương 1 trong mỗi ${oneInX} trẻ em) cất tiếng khóc chào đời tại ${countryName}.`
                : `Out of every 100 babies born right now globally, about ${birthShare}% (1 in every ${oneInX} newborns) are born in ${countryName}.`}
            </p>
            <div className="mt-2 text-xs font-mono text-ink2 flex flex-wrap gap-x-4 gap-y-1">
              <span>Tuổi thọ TB: <b>{country.le} tuổi</b></span>
              <span>Tử vong trẻ sơ sinh: <b>{country.im} ‰</b></span>
              <span>GDP PPP: <b>${country.ppp.toLocaleString()}</b></span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onStartLife}
              className="w-full sm:w-auto px-8 py-3.5 bg-stamp hover:bg-stamp/90 text-paper font-display text-lg font-bold rounded shadow-vintage transition duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.startLifeButton}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

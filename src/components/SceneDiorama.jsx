import React, { useRef, useEffect, useState } from 'react';
import {
  PX,
  pxScene,
  pxFuneral,
  pxPalette,
  pxDrawToCanvas,
  skinForCountry,
  SC_PROP
} from '../engine/pixelArtOriginal';
import { getCountryName } from '../i18n';
import DISHES from '../data/dishes.json';

export default function SceneDiorama({ state, lang, theme }) {
  const canvasRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);

  const prevAgeRef = useRef(state.yearsLived);
  const [stepHopTime, setStepHopTime] = useState(null);

  const country = state.country;
  const countryName = getCountryName(country.id, lang, country.ko);
  const dishObj = DISHES[country.id];
  const dishName = dishObj ? (dishObj[lang] || dishObj.vi) : null;

  // Trigger bounce hop when age advances
  useEffect(() => {
    if (prevAgeRef.current !== state.yearsLived) {
      prevAgeRef.current = state.yearsLived;
      setStepHopTime(performance.now());
    }
  }, [state.yearsLived]);

  // Click on scene to react
  const handleSceneClick = () => {
    setReactionTime(performance.now());
  };

  // Build authentic people array
  const people = [];

  // Parents (if character < 18)
  if (state.yearsLived < 18) {
    if (state.family.dad.alive && !state.family.dad.absent) {
      people.push({
        role: 'par',
        sex: 'M',
        age: state.family.dad.age || (state.yearsLived + 28),
        sk: skinForCountry(country.id)
      });
    }
    if (state.family.mom.alive) {
      people.push({
        role: 'par',
        sex: 'F',
        age: state.family.mom.age || (state.yearsLived + 26),
        sk: skinForCountry(country.id)
      });
    }
  }

  // Protagonist
  people.push({
    role: 'me',
    sex: state.sex,
    age: state.yearsLived,
    sk: skinForCountry(country.id)
  });

  // Spouse / Partner
  if (state.family.partner && state.family.partner.alive) {
    people.push({
      role: 'pt',
      sex: state.sex === 'M' ? 'F' : 'M',
      age: state.yearsLived,
      sk: skinForCountry(country.id)
    });
  }

  // Children
  state.family.children.slice(0, 3).forEach((kid) => {
    const kidAge = state.yearsLived - kid.bornAtAge;
    people.push({
      role: 'kid',
      sex: kid.gender,
      age: kidAge,
      sk: skinForCountry(country.id)
    });
  });

  // Scene Model
  const sceneModel = {
    stage: state.yearsLived < 13 ? 'm' : state.yearsLived < 60 ? 'd' : 'e',
    mood: state.stats.happiness < 35 ? 'low' : state.stats.happiness > 70 ? 'high' : 'mid',
    urban: state.urban,
    region: country.p || 'eap',
    home: state.flags.ownsHome
      ? 'house'
      : state.stats.wealth > 20000
      ? 'mansion'
      : state.urban
      ? 'flat'
      : state.q <= 2
      ? 'hut'
      : 'house',
    prop: SC_PROP[state.jobId] || (state.yearsLived < 6 ? 'toys' : 'office'),
    wealth: state.stats.wealth,
    sex: state.sex,
    sk: skinForCountry(country.id),
    old: state.yearsLived >= 65,
    seed: country.id + (state.cityName || ''),
    people,
    pet: state.flags.pet || (state.stats.wealth > 5000 && state.yearsLived > 10 ? 'd' : null)
  };

  // Animated RAF Loop
  useEffect(() => {
    let animId;
    const startTime = performance.now();

    const loop = (now) => {
      const elapsed = now - startTime;
      const cv = canvasRef.current;
      if (cv) {
        const isDark = theme === 'dark';
        const pal = pxPalette(isDark);

        // Blinking and breathing cycles
        const blink = (elapsed % 3200) < 140;
        const breathe = Math.sin((elapsed / 800) * Math.PI) > 0.35;
        const cloudOffset = (elapsed / 40) % (PX.W + 40);

        let jump = false;
        let heart = false;

        if (reactionTime && now - reactionTime < 900) {
          jump = true;
          heart = true;
        } else if (stepHopTime && now - stepHopTime < 500) {
          jump = true;
        }

        if (state.alive) {
          const r = pxScene(sceneModel, pal, {
            blink,
            breathe,
            cloudOffset,
            jump,
            heart
          });
          pxDrawToCanvas(r, cv);
        } else {
          // Deceased -> Solemn Memorial Funeral Ceremony
          const mourners = people.filter(p => p.role !== 'me');
          const r = pxFuneral(sceneModel, pal, mourners);
          pxDrawToCanvas(r, cv);
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [state, theme, reactionTime, stepHopTime]);

  // Label text
  const locationText = state.urban
    ? `${state.cityName}, ${countryName}`
    : `${countryName} (${lang === 'vi' ? 'Nông thôn' : lang === 'ko' ? '농촌' : 'Rural'})`;

  return (
    <div className="bg-card border border-rule rounded-xl overflow-hidden shadow-sm font-serif">
      {/* 192:60 Aspect Ratio Pixel Scene Canvas */}
      <div
        onClick={handleSceneClick}
        className="w-full aspect-[192/60] bg-stamp-soft/30 overflow-hidden cursor-pointer relative group select-none"
        title={lang === 'vi' ? 'Bấm vào cảnh để tương tác với nhân vật!' : 'Click scene to interact with character!'}
      >
        <canvas
          ref={canvasRef}
          width={PX.W}
          height={PX.H}
          className="w-full h-full block"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Floating tooltip */}
        <div className="absolute top-2 right-2 bg-ink/75 text-paper text-[10px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {lang === 'vi' ? '✨ Bấm để nhân vật nhảy & thả tim' : '✨ Click to jump & heart'}
        </div>

        {/* State badge (Alive vs Resting) */}
        {!state.alive && (
          <div className="absolute top-2 left-2 bg-ink/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
            🕯️ {lang === 'vi' ? 'Lễ tưởng niệm tiễn biệt' : lang === 'ko' ? '영결식과 추모' : 'Memorial Ceremony'}
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="px-3.5 py-2 text-xs font-mono text-ink/80 border-t border-rule flex flex-wrap justify-between items-center bg-card/60 gap-1">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">
            📍 <b>{locationText}</b>
          </span>
          {dishName && (
            <span className="hidden sm:inline-block bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full text-[11px]">
              🍲 {dishName}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-ink/50 hover:text-ink cursor-pointer shrink-0 transition"
        >
          {showDetails ? (lang === 'vi' ? '▲ Thu gọn' : '▲ Less') : (lang === 'vi' ? '▼ Chi tiết' : '▼ Details')}
        </button>
      </div>

      {/* Expandable Context Details */}
      {showDetails && (
        <div className="px-3.5 py-2.5 text-xs font-mono bg-paper border-t border-dashed border-rule text-ink/70 space-y-1 animate-fade-in">
          <div>
            {lang === 'vi' ? 'Nơi ở: ' : lang === 'ko' ? '주거: ' : 'Home: '}
            <b className="text-ink">
              {sceneModel.home === 'mansion'
                ? (lang === 'vi' ? 'Dinh thự sang trọng' : 'Mansion')
                : sceneModel.home === 'house'
                ? (lang === 'vi' ? 'Nhà riêng khang trang' : 'Private house')
                : sceneModel.home === 'flat'
                ? (lang === 'vi' ? 'Chung cư đô thị' : 'Apartment')
                : (lang === 'vi' ? 'Nhà tranh mộc mạc' : 'Mud/Thatch hut')}
            </b>
          </div>
          <div>
            {lang === 'vi' ? 'Nơi làm việc / Hoạt động: ' : lang === 'ko' ? '일터: ' : 'Workplace: '}
            <b className="text-ink">{state.job || (lang === 'vi' ? 'Học sinh / Trẻ nhỏ' : 'Child / Student')}</b>
          </div>
          {dishName && (
            <div>
              {lang === 'vi' ? 'Ẩm thực tiêu biểu: ' : lang === 'ko' ? '대표 음식: ' : 'Iconic Dish: '}
              <b className="text-accent">{dishName}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import countriesData from './data/countries.json';
import namesData from './data/names.json';
import citiesData from './data/cities.json';
import citiesEnData from './data/cities_en.json';

import { chooseCountry, generateBirthIdentity, generatePeerBabies } from './engine/demographics';
import { advanceOneYear } from './engine/simulation';
import { sound } from './engine/soundSynth';

import TopBar from './components/TopBar';
import Hero from './components/Hero';
import BirthCard from './components/BirthCard';
import Dashboard from './components/Dashboard';
import DecisionModal from './components/DecisionModal';
import ReflectionModal from './components/ReflectionModal';
import ShopModal from './components/ShopModal';
import DeathSummary from './components/DeathSummary';
import PastLivesModal from './components/PastLivesModal';
import AchievementsModal from './components/AchievementsModal';

const PAST_LIVES_KEY = '1in8b_past_lives_v1';

export default function App() {
  const [lang, setLang] = useState('vi');
  const [theme, setTheme] = useState('light');
  const [phase, setPhase] = useState('hero'); // 'hero' | 'birth' | 'living' | 'dead'
  const [isRolling, setIsRolling] = useState(false);
  const [lifeState, setLifeState] = useState(null);

  // Speed & Pause controls
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isPausesOn, setIsPausesOn] = useState(true);

  // Sound and Shop modal
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Past lives archive
  const [pastLives, setPastLives] = useState(() => {
    try {
      const saved = localStorage.getItem(PAST_LIVES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPastLivesOpen, setIsPastLivesOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  // Roll a new baby
  const handleRoll = (selectedEra = '2024', homeCountry = 'VNM') => {
    setIsRolling(true);
    setTimeout(() => {
      const country = chooseCountry(countriesData);
      const identity = generateBirthIdentity({
        country,
        countries: countriesData,
        namesPool: namesData,
        citiesPool: citiesData,
        citiesEnPool: citiesEnData,
        era: selectedEra,
        homeCountryId: homeCountry
      });

      const peers = generatePeerBabies(countriesData, namesData);

      const birthYear = identity.birthYear || 2024;
      const initialLife = {
        ...identity,
        peers,
        alive: true,
        yearsLived: 0,
        pendingDecision: null,
        pendingReflection: null,
        log: [
          {
            age: 0,
            type: 'birth',
            text: {
              vi: `Năm ${birthYear}, bạn cất tiếng khóc chào đời tại ${identity.urban ? identity.cityName : 'vùng nông thôn'}, ${identity.country.ko}. Một sinh linh nhỏ bé giữa hơn ${birthYear < 1980 ? '4' : '8'} tỷ người.`,
              en: `In the year ${birthYear}, you were born into ${identity.urban ? identity.cityName : 'a rural area'} in ${identity.country.ko}. One new infant among over ${birthYear < 1980 ? '4' : '8'} billion people.`,
              ko: `${birthYear}년, ${identity.country.ko}의 ${identity.urban ? identity.cityName : '농촌'}에서 건강하게 태어났습니다. 인류의 한 사람으로 삶이 시작되었습니다.`
            }
          }
        ]
      };

      setLifeState(initialLife);
      setIsRolling(false);
      setPhase('birth');
    }, 600);
  };


  // Start living
  const handleStartLife = () => {
    setPhase('living');
    setIsPaused(false);
  };

  // Step one year manually
  const handleStepForward = () => {
    if (!lifeState || !lifeState.alive || lifeState.pendingDecision || lifeState.pendingReflection) return;
    processNextYear();
  };

  // Fast forward until next decision or reflection or death
  const handleFastForwardToDecision = () => {
    if (!lifeState || !lifeState.alive || lifeState.pendingDecision || lifeState.pendingReflection) return;
    setLifeState((prev) => {
      if (!prev || !prev.alive) return prev;
      let current = JSON.parse(JSON.stringify(prev));
      while (current.alive && !current.pendingDecision && !current.pendingReflection && current.yearsLived < 110) {
        current = advanceOneYear(current);
      }
      sound.setAge(current.yearsLived);
      if (!current.alive) {
        setPhase('dead');
        sound.stop();
        setIsSoundOn(false);
        if (current.yearsLived >= 70) {
          try {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
        savePastLife(current);
      }
      return current;
    });
  };

  // Simulation step logic
  const processNextYear = () => {
    setLifeState((prev) => {
      if (!prev || !prev.alive) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      const updated = advanceOneYear(clone);
      sound.setAge(updated.yearsLived);

      if (isSoundOn) {
        sound.playYearTick();
        if (updated.pendingDecision) {
          sound.playDecision();
        }
        if (updated.newlyUnlocked) {
          sound.playAchievement();
        }
      }

      if (updated.newlyUnlocked) {
        try {
          confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
        } catch {}
      }

      // Check if dead
      if (!updated.alive) {
        setPhase('dead');
        if (isSoundOn) sound.playDeath();
        sound.stop();
        setIsSoundOn(false);
        if (updated.yearsLived >= 70) {
          try {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
        savePastLife(updated);
      }

      return updated;
    });
  };

  // Year progression loop timer
  useEffect(() => {
    if (
      phase !== 'living' ||
      !lifeState ||
      !lifeState.alive ||
      isPaused ||
      lifeState.pendingDecision ||
      lifeState.pendingReflection
    ) {
      return;
    }

    const intervalMs = Math.max(200, Math.round(1400 / speed));
    const timer = setTimeout(() => {
      processNextYear();
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [phase, lifeState, isPaused, speed]);

  // Handle user decision
  const handleChooseDecision = (choice) => {
    if (!lifeState || !lifeState.pendingDecision) return;

    setLifeState((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const resultText = choice.apply(clone);
      if (isSoundOn) {
        sound.playTone(659.25, 0.15, 'triangle', 0.2);
      }
      clone.pendingDecision = null;

      clone.log.unshift({
        age: clone.yearsLived,
        type: 'decision',
        text: resultText
      });

      return clone;
    });
  };

  // Handle demographic reflection choice at milestone ages
  const handleChooseReflection = (opt) => {
    if (!lifeState || !lifeState.pendingReflection) return;

    setLifeState((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.pendingReflection = null;
      if (isSoundOn) {
        sound.playTone(523.25, 0.2, 'sine', 0.2);
      }
      if (opt.stat) {
        for (const [k, v] of Object.entries(opt.stat)) {
          clone.stats[k] = Math.max(0, (clone.stats[k] || 0) + v);
        }
      }
      clone.log.unshift({
        age: clone.yearsLived,
        type: 'reflection',
        text: {
          vi: `Chiêm nghiệm tuổi ${clone.yearsLived}: ${opt.label.vi}`,
          en: `Age ${clone.yearsLived} reflection: ${opt.label.en}`,
          ko: `${clone.yearsLived}세의 기억: ${opt.label.ko}`
        }
      });
      return clone;
    });
  };

  // Handle life experience / shop purchase
  const handleBuyShopItem = (item) => {
    if (!lifeState || !lifeState.alive) return;
    const cost = Math.abs(item.effects.wealth || 200);
    if (lifeState.stats.wealth < cost) return;

    setLifeState((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.stats.wealth = Math.max(0, clone.stats.wealth - cost);
      if (item.effects.happiness) clone.stats.happiness += item.effects.happiness;
      if (item.effects.health) clone.stats.health += item.effects.health;
      if (item.effects.smarts) clone.stats.smarts += item.effects.smarts;
      if (item.effects.social) clone.stats.social += item.effects.social;

      if (isSoundOn) {
        sound.playCoin();
      }

      if (item.id === 'pet') {
        clone.flags.pet = 'd';
      }

      clone.log.unshift({
        age: clone.yearsLived,
        type: 'joy',
        text: {
          vi: `Đã thực hiện: ${item.name.vi}.`,
          en: `Experienced: ${item.name.en}.`,
          ko: `활동 진행: ${item.name.ko}.`
        }
      });
      return clone;
    });
    setIsShopOpen(false);
  };

  // Audio Toggle
  const handleToggleSound = () => {
    const age = lifeState ? lifeState.yearsLived : 0;
    const next = sound.toggle(age);
    setIsSoundOn(next);
  };

  // Save life to archive
  const savePastLife = (life) => {
    const record = {
      id: 'life_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: life.name?.full || life.name,
      countryId: life.country?.id,
      countryKo: life.country?.ko,
      country: life.country,
      sex: life.sex,
      urban: life.urban,
      cityName: life.cityName,
      birthYear: life.birthYear,
      yearsLived: life.yearsLived,
      job: life.job,
      jobId: life.jobId,
      wealth: life.stats?.wealth || 0,
      stats: {
        happiness: life.stats?.happiness || 70,
        smarts: life.stats?.smarts || 70,
        health: life.stats?.health || 70,
        wealth: life.stats?.wealth || 0,
        educationLevel: life.stats?.educationLevel || 2
      },
      family: {
        mom: life.family?.mom ? { name: life.family.mom.name } : null,
        dad: life.family?.dad ? { name: life.family.dad.name } : null,
        children: life.family?.children || [],
        childrenCount: life.family?.children?.length || 0,
        grandchildrenCount: life.family?.grandchildrenCount || 0,
        partner: life.family?.partner ? true : false
      },
      culture: life.culture,
      causeOfDeath: life.causeOfDeath,
      unlockedAchievements: life.unlockedAchievements || [],
      timestamp: Date.now()
    };

    setPastLives((prev) => {
      const next = [record, ...prev];
      try {
        localStorage.setItem(PAST_LIVES_KEY, JSON.stringify(next.slice(0, 50)));
      } catch {}
      return next;
    });
  };

  const handleClearHistory = () => {
    setPastLives([]);
    try {
      localStorage.removeItem(PAST_LIVES_KEY);
    } catch {}
  };

  const handleResetToHero = () => {
    sound.stop();
    setIsSoundOn(false);
    setPhase('hero');
    setLifeState(null);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-accent/20">
      {/* Top Navbar */}
      <TopBar
        age={lifeState ? lifeState.yearsLived : 0}
        speed={speed}
        setSpeed={setSpeed}
        isPaused={isPaused}
        togglePause={() => setIsPaused((p) => !p)}
        stepForward={handleStepForward}
        onFastForward={handleFastForwardToDecision}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onReset={handleResetToHero}
        onOpenPastLives={() => setIsPastLivesOpen(true)}
        hasActiveLife={phase === 'living' && lifeState && lifeState.alive}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        unlockedAchievementsCount={lifeState?.unlockedAchievements?.length || 0}
        lifeState={lifeState}
        isAutoMode={isAutoMode}
        onToggleAutoMode={() => setIsAutoMode(!isAutoMode)}
        isPausesOn={isPausesOn}
        onTogglePauses={() => setIsPausesOn(!isPausesOn)}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center">
        {phase === 'hero' && (
          <Hero lang={lang} onRoll={handleRoll} isRolling={isRolling} />
        )}

        {phase === 'birth' && lifeState && (
          <BirthCard identity={lifeState} lang={lang} onStartLife={handleStartLife} theme={theme} />
        )}

        {phase === 'living' && lifeState && (
          <Dashboard
            state={lifeState}
            lang={lang}
            theme={theme}
            onOpenShop={() => setIsShopOpen(true)}
            onSetFocus={(focusId) => {
              setLifeState((prev) => (prev ? { ...prev, currentFocus: focusId } : prev));
            }}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
          />
        )}

        {phase === 'dead' && lifeState && (
          <DeathSummary
            state={lifeState}
            lang={lang}
            onReincarnate={handleRoll}
            theme={theme}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
          />
        )}
      </main>

      {/* Interactive Decision Popup */}
      {lifeState && lifeState.pendingDecision && !isAutoMode && (
        <DecisionModal
          decision={lifeState.pendingDecision}
          lang={lang}
          onChoose={handleChooseDecision}
          onAutoDecisions={() => {
            setIsAutoMode(true);
            const choices = lifeState.pendingDecision.choices || [];
            handleChooseDecision(choices[Math.floor(Math.random() * choices.length)] || choices[0]);
          }}
          onSetAside={() => {
            // Set aside decision: temporarily proceed
            const choices = lifeState.pendingDecision.choices || [];
            handleChooseDecision(choices[0]);
          }}
        />
      )}

      {/* Philosophical Reflection Popup (ages 5, 15, 30, 50, 70) */}
      {lifeState && lifeState.pendingReflection && (
        <ReflectionModal
          reflection={lifeState.pendingReflection}
          lang={lang}
          onChoose={handleChooseReflection}
        />
      )}

      {/* Life Activities Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        state={lifeState || { stats: { wealth: 0 }, yearsLived: 0 }}
        onBuyItem={handleBuyShopItem}
        lang={lang}
      />

      {/* Past Lives Archive Modal */}
      <PastLivesModal
        isOpen={isPastLivesOpen}
        onClose={() => setIsPastLivesOpen(false)}
        pastLives={pastLives}
        onClearHistory={handleClearHistory}
        lang={lang}
      />

      {/* Lifetime Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        currentLifeAchievements={lifeState?.unlockedAchievements || []}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-rule py-4 px-4 text-center text-xs text-ink3 font-mono">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span>1 in 8 Billion Clone · Inspired by 1n8b.life</span>
          <span>Dữ liệu thống kê: United Nations, WHO, World Bank, UNESCO</span>
        </div>
      </footer>
    </div>
  );
}

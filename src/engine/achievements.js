// Lifetime Achievements Engine for 1 in 8 Billion
// Tracks milestones across individual lives and persists unlocked badges globally

export const ACHIEVEMENTS = [
  {
    id: 'survivor',
    icon: '🛡️',
    title: {
      vi: 'Vượt Cửa Tử Sơ Sinh',
      en: 'Against All Odds',
      ko: '생존의 기적'
    },
    desc: {
      vi: 'Sống sót qua tuổi lên 5 tại quốc gia có tỷ lệ tử vong trẻ em cao (U5 ≥ 35‰)',
      en: 'Survive past age 5 in a country with high child mortality (U5 ≥ 35‰)',
      ko: '영유아 사망률이 높은 국가(U5 ≥ 35‰)에서 5세를 무사히 넘겼습니다'
    },
    check: (state) => {
      const u5 = state.country.u5 || 0;
      return state.yearsLived >= 5 && u5 >= 35;
    }
  },
  {
    id: 'scholar',
    icon: '🎓',
    title: {
      vi: 'Khắc Phục Nghịch Cảnh',
      en: 'Scholarly Triumph',
      ko: '개천에서 난 용'
    },
    desc: {
      vi: 'Đạt trình độ Đại học dù sinh ra trong gia cảnh khó khăn (Q1 hoặc Q2)',
      en: 'Earn a university degree despite being born into quintile Q1 or Q2',
      ko: '어려운 가정 환경(소득 1~2분위)을 극복하고 대학교육을 마쳤습니다'
    },
    check: (state) => {
      return state.q <= 2 && state.stats.educationLevel >= 4;
    }
  },
  {
    id: 'tycoon',
    icon: '💰',
    title: {
      vi: 'Tự Lập Làm Giàu',
      en: 'Self-Made Wealth',
      ko: '자수성가'
    },
    desc: {
      vi: 'Tích lũy tài sản cá nhân vượt mức $50,000 PPP',
      en: 'Accumulate personal wealth exceeding $50,000 PPP',
      ko: '개인 자산 $50,000 PPP 이상을 축적했습니다'
    },
    check: (state) => {
      return state.stats.wealth >= 50000;
    }
  },
  {
    id: 'centenarian',
    icon: '👵',
    title: {
      vi: 'Bách Niên Trường Thọ',
      en: 'Centenarian Legacy',
      ko: '백세 인생'
    },
    desc: {
      vi: 'Sống thọ đạt mốc từ 85 tuổi trở lên',
      en: 'Live to a grand age of 85 or older',
      ko: '85세 이상의 장수를 누렸습니다'
    },
    check: (state) => {
      return state.yearsLived >= 85;
    }
  },
  {
    id: 'patriarch',
    icon: '👨‍👩‍👦‍👦',
    title: {
      vi: 'Tổ Ấm Sum Vầy',
      en: 'Golden Family Bond',
      ko: '다복한 가정'
    },
    desc: {
      vi: 'Nuôi dạy ít nhất 2 người con và chào đón cháu ruột',
      en: 'Raise at least 2 children and welcome grandchildren into the world',
      ko: '2명 이상의 자녀를 기르고 손주를 품에 안았습니다'
    },
    check: (state) => {
      return state.family.children.length >= 2 && state.family.grandchildrenCount >= 1;
    }
  },
  {
    id: 'globetrotter',
    icon: '🌍',
    title: {
      vi: 'Công Dân Toàn Cầu',
      en: 'Global Citizen',
      ko: '세계인'
    },
    desc: {
      vi: 'Du lịch quốc tế hoặc xuất ngoại làm việc',
      en: 'Travel abroad or work internationally',
      ko: '해외여행을 떠나거나 국경을 넘어 커리어를 개척했습니다'
    },
    check: (state) => {
      return !!state.flags.abroad || !!state.flags.dec_migx;
    }
  },
  {
    id: 'leader',
    icon: '👑',
    title: {
      vi: 'Thủ Lĩnh Bản Lĩnh',
      en: 'Inspiring Leader',
      ko: '존경받는 리더'
    },
    desc: {
      vi: 'Trở thành quản lý cấp cao, giám đốc hoặc sáng lập doanh nghiệp riêng',
      en: 'Rise to senior executive leadership or start your own successful business',
      ko: '조직의 최고 리더로 승진하거나 자신만의 사업을 일구었습니다'
    },
    check: (state) => {
      return state.jobId === 'owner' || state.jobId === 'specialist' || (state.job && state.job.includes('Quản lý'));
    }
  },
  {
    id: 'zen',
    icon: '🧘',
    title: {
      vi: 'Tâm Hồn An Lạc',
      en: 'Serene Soul',
      ko: '평온한 황혼'
    },
    desc: {
      vi: 'Duy trì chỉ số Hạnh phúc từ 85% trở lên sau tuổi 50',
      en: 'Maintain happiness at or above 85% after age 50',
      ko: '50세 이후에도 85% 이상의 높은 행복도를 유지했습니다'
    },
    check: (state) => {
      return state.yearsLived >= 50 && state.stats.happiness >= 85;
    }
  },
  {
    id: 'philanthropist',
    icon: '🕊️',
    title: {
      vi: 'Trái Tim Nhân Ái',
      en: 'Community Pillar',
      ko: '따뜻한 온기'
    },
    desc: {
      vi: 'Để lại di chúc từ thiện hoặc dành cống hiến cho xã hội',
      en: 'Dedicate legacy to charity, community foundation, or humanitarian causes',
      ko: '유산 기부나 헌신적인 봉사로 공동체에 큰 발자취를 남겼습니다'
    },
    check: (state) => {
      return !!state.flags.will_charity || !!state.flags.dec_legacy || !!state.flags.dec_service;
    }
  },
  {
    id: 'polymath',
    icon: '💡',
    title: {
      vi: 'Nhà Thông Thái',
      en: 'Living Polymath',
      ko: '지혜로운 현자'
    },
    desc: {
      vi: 'Đạt chỉ số Trí tuệ xuất chúng (Smarts ≥ 90%)',
      en: 'Attain extraordinary intellectual insight (Smarts ≥ 90%)',
      ko: '탁월한 학식과 지혜(지식 90% 이상)에 도달했습니다'
    },
    check: (state) => {
      return state.stats.smarts >= 90;
    }
  },
  {
    id: 'athlete',
    icon: '⚡',
    title: {
      vi: 'Cơ Thể Thép',
      en: 'Peak Vitality',
      ko: '강철 체력'
    },
    desc: {
      vi: 'Duy trì Sức khỏe trên 85% đến sau tuổi 65',
      en: 'Keep health at 85% or higher past the age of 65',
      ko: '65세가 넘어서도 85% 이상의 강인한 체력을 유지했습니다'
    },
    check: (state) => {
      return state.yearsLived >= 65 && state.stats.health >= 85;
    }
  },
  {
    id: 'outliver',
    icon: '🌟',
    title: {
      vi: 'Kỳ Tích Sinh Tồn',
      en: 'Peer Outliver',
      ko: '생의 승리자'
    },
    desc: {
      vi: 'Sống lâu hơn 90% số người sinh cùng thời tại quê nhà',
      en: 'Outlive 90% of peers born in the same country and era',
      ko: '동시대 동향인의 90%보다 더 오래 살아남았습니다'
    },
    check: (state) => {
      const le = state.country.le || 73;
      return state.yearsLived >= le + 12;
    }
  }
];

const GLOBAL_ACHIEVEMENTS_KEY = '1in8b_achievements_v1';

export function getUnlockedAchievements() {
  try {
    const raw = localStorage.getItem(GLOBAL_ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievement(achievementId) {
  try {
    const current = getUnlockedAchievements();
    if (!current.includes(achievementId)) {
      current.push(achievementId);
      localStorage.setItem(GLOBAL_ACHIEVEMENTS_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save achievement', e);
  }
}

/**
 * Scan state and return newly unlocked achievements in this turn
 */
export function checkNewAchievements(state, alreadyUnlockedThisLife = []) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (!alreadyUnlockedThisLife.includes(ach.id)) {
      if (ach.check(state)) {
        newlyUnlocked.push(ach);
        saveUnlockedAchievement(ach.id);
      }
    }
  }
  return newlyUnlocked;
}

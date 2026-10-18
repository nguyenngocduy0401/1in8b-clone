import { rnd, chance, pick, weightedPick, weightedPickObj, randomInt, clamp } from './random.js';
import erasData from '../data/eras.json' with { type: 'json' };
import dishesData from '../data/dishes.json' with { type: 'json' };
import festivalsData from '../data/festivals.json' with { type: 'json' };
import metaData from '../data/meta.json' with { type: 'json' };
import hobbiesData from '../data/hobbies.json' with { type: 'json' };
import ethnicitiesData from '../data/ethnicities.json' with { type: 'json' };

const SPORT_NAMES = {
  football: { vi: 'Bóng đá', en: 'Football (Soccer)', ko: '축구' },
  cricket: { vi: 'Bóng gậy (Cricket)', en: 'Cricket', ko: '크리켓' },
  badminton: { vi: 'Cầu lông', en: 'Badminton', ko: '배드민턴' },
  tabletennis: { vi: 'Bóng bàn', en: 'Table Tennis', ko: '탁구' },
  baseball: { vi: 'Bóng chày', en: 'Baseball', ko: '야구' },
  basketball: { vi: 'Bóng rổ', en: 'Basketball', ko: '농구' },
  icehockey: { vi: 'Khúc côn cầu trên băng', en: 'Ice Hockey', ko: '아이스하키' },
  rugby: { vi: 'Bóng bầu dục (Rugby)', en: 'Rugby', ko: '럭비' },
  muaythai: { vi: 'Muay Thái võ cổ truyền', en: 'Muay Thai', ko: '무에타이' },
  running: { vi: 'Chạy việt dã / Điền kinh', en: 'Track & Field / Running', ko: '달리기·육상' },
  volleyball: { vi: 'Bóng chuyền', en: 'Volleyball', ko: '배구' }
};

export function resolveCulturalIdentity(country, religion, randomFn = rnd) {
  const countryDish = dishesData[country.id] || {
    vi: 'Món ăn truyền thống gia đình',
    en: 'Traditional homecooked specialty',
    ko: '전통 가정식'
  };

  let sportKey = 'football';
  if (['IND', 'PAK', 'BGD', 'LKA', 'AFG'].includes(country.id)) {
    sportKey = 'cricket';
  } else if (['USA', 'DOM', 'JPN', 'CUB', 'NIC', 'PAN', 'TWN'].includes(country.id)) {
    sportKey = chance(0.6, randomFn) ? 'baseball' : 'basketball';
  } else if (['CAN', 'RUS', 'FIN', 'SWE', 'CZE', 'SVK', 'NOR'].includes(country.id)) {
    sportKey = 'icehockey';
  } else if (['CHN'].includes(country.id)) {
    sportKey = chance(0.5, randomFn) ? 'tabletennis' : 'badminton';
  } else if (['THA'].includes(country.id)) {
    sportKey = chance(0.4, randomFn) ? 'muaythai' : 'football';
  } else if (['VNM', 'IDN', 'MYS'].includes(country.id)) {
    sportKey = chance(0.45, randomFn) ? 'badminton' : 'football';
  } else if (['NZL', 'ZAF', 'FJI', 'SAM', 'TON'].includes(country.id)) {
    sportKey = 'rugby';
  }
  const sport = SPORT_NAMES[sportKey] || SPORT_NAMES.football;

  let festival = festivalsData[country.id];
  if (!festival) {
    const festMap = {
      C: { vi: 'Đại lễ Giáng Sinh & Năm Mới', en: 'Christmas & New Year Celebration', ko: '크리스마스' },
      M: { vi: 'Đại lễ Eid al-Fitr (Kết thúc Ramadan)', en: 'Eid al-Fitr Celebration', ko: '이드 알피트르' },
      H: { vi: 'Lễ hội Ánh sáng Diwali', en: 'Diwali Festival of Lights', ko: '디왈리' },
      B: { vi: 'Đại lễ Phật đản Vesak', en: 'Vesak (Buddha\'s Birthday)', ko: '석가탄신일' },
      J: { vi: 'Lễ Vượt Qua Passover', en: 'Passover Festival', ko: '유월절' },
      N: { vi: 'Tết Dương Lịch mừng năm mới', en: 'New Year Festival', ko: '새해 명절' },
      F: { vi: 'Lễ hội truyền thống cội nguồn', en: 'Ancestral Folk Festival', ko: '전통 민속 축제' },
      S: { vi: 'Lễ hội Vaisakhi', en: 'Vaisakhi Festival', ko: '바이사키' }
    };
    festival = festMap[religion] || festMap.N;
  }

  let ethnicity = { vi: 'Dân tộc bản địa', en: 'Indigenous / Majority', ko: '주요 민족' };
  if (country.id === 'VNM') ethnicity = { vi: 'Kinh (Việt)', en: 'Kinh (Viet)', ko: '킨족(베트남)' };
  else if (country.id === 'CHN') ethnicity = { vi: 'Hán (Han)', en: 'Han Chinese', ko: '한족' };
  else if (country.id === 'JPN') ethnicity = { vi: 'Yamato', en: 'Yamato', ko: '야마토' };
  else if (country.id === 'KOR') ethnicity = { vi: 'Hàn', en: 'Korean', ko: '한민족' };

  if (ethnicitiesData && ethnicitiesData.ETH_C && ethnicitiesData.ETH_C[country.id]) {
    const candidateGroupKeys = ethnicitiesData.ETH_C[country.id];
    for (const gk of candidateGroupKeys) {
      const g = ethnicitiesData.ETH_G && ethnicitiesData.ETH_G[gk];
      if (g && chance((g.s || 5) / 100, randomFn)) {
        ethnicity = {
          vi: g.n || gk,
          en: g.n || gk,
          ko: g.n || gk
        };
        break;
      }
    }
  }

  const hobbyKeys = Object.keys(hobbiesData);
  const pickedHobbyKeys = [];
  while (pickedHobbyKeys.length < 2 && hobbyKeys.length > 0) {
    const k = pick(hobbyKeys, randomFn);
    if (!pickedHobbyKeys.includes(k)) pickedHobbyKeys.push(k);
  }
  const hobbies = pickedHobbyKeys.map((k) => ({
    id: k,
    name: hobbiesData[k] || { vi: k, en: k, ko: k }
  }));

  return {
    dish: countryDish,
    sport,
    festival,
    ethnicity,
    hobbies
  };
}

// Pre-defined fallback name pools for common regions/clusters
const VIETNAM_NAMES = {
  m: ['Minh', 'Anh', 'Huy', 'Dũng', 'Hoàng', 'Phúc', 'Tuấn', 'Đức', 'Nam', 'Hải', 'Trung', 'Long', 'Hiếu', 'Thắng', 'Khoa', 'Quân', 'Tùng', 'Khang', 'Lâm', 'Bảo', 'Khánh', 'Duy', 'Kiên', 'Việt', 'Đạt', 'Cường', 'Sơn', 'Tài'],
  f: ['Linh', 'Hương', 'Mai', 'Lan', 'Trang', 'Ngọc', 'Phương', 'Thảo', 'Hà', 'Quỳnh', 'Giang', 'My', 'Châu', 'Nhi', 'Vy', 'Hạnh', 'Yến', 'Diệp', 'Trâm', 'Ngân', 'Thu', 'Ánh', 'Dung', 'Tâm', 'Hồng', 'Tuyết', 'Nhung', 'Bích'],
  s: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đào', 'Đinh']
};

export function chooseCountry(countries, randomFn = rnd) {
  const items = [];
  const weights = [];
  for (const c of countries) {
    items.push(c);
    weights.push(c.b || 1000);
  }
  return weightedPick(items, weights, randomFn);
}

export function pickReligion(countryRelStr, randomFn = rnd) {
  if (!countryRelStr) return 'N';
  // Example format: "C89,N8,O3" or "M99,N1"
  const parts = countryRelStr.split(',');
  const obj = {};
  for (const p of parts) {
    const code = p[0];
    const val = parseInt(p.slice(1), 10) || 1;
    obj[code] = val;
  }
  return weightedPickObj(obj, randomFn);
}

export function getClusterForCountry(countryId, relCode) {
  if (countryId === 'VNM') return 'vi';
  if (countryId === 'CHN' || countryId === 'TWN' || countryId === 'HKG' || countryId === 'MAC') return 'zh';
  if (countryId === 'JPN') return 'ja';
  if (countryId === 'KOR' || countryId === 'PRK') return 'ko';
  if (countryId === 'USA' || countryId === 'GBR' || countryId === 'CAN' || countryId === 'AUS' || countryId === 'NZL' || countryId === 'IRL') return 'en';
  if (countryId === 'FRA' || countryId === 'BEL' || countryId === 'CHE') return 'fr';
  if (countryId === 'DEU' || countryId === 'AUT') return 'de';
  if (countryId === 'ESP' || countryId === 'MEX' || countryId === 'COL' || countryId === 'ARG' || countryId === 'PER' || countryId === 'CHL') return 'es';
  if (countryId === 'BRA' || countryId === 'PRT') return 'pt';
  if (countryId === 'RUS' || countryId === 'UKR' || countryId === 'BLR' || countryId === 'KAZ') return 'ru';
  if (countryId === 'IND') return 'hi';
  if (countryId === 'IDN') return 'id';
  if (countryId === 'THA') return 'th';
  if (countryId === 'NGA') return 'ng';
  if (countryId === 'EGY' || countryId === 'SAU' || countryId === 'IRQ' || countryId === 'MAR' || countryId === 'DZA') return 'ar';
  return 'en';
}

export function generateName(countryId, sex, namesPool, randomFn = rnd) {
  if (countryId === 'VNM') {
    const s = pick(VIETNAM_NAMES.s, randomFn);
    const g = sex === 'M' ? pick(VIETNAM_NAMES.m, randomFn) : pick(VIETNAM_NAMES.f, randomFn);
    return { first: g, last: s, full: `${s} ${g}` };
  }

  const cl = getClusterForCountry(countryId);
  const pool = (namesPool && namesPool[cl]) || (namesPool && namesPool.en) || null;

  if (pool && pool[sex === 'M' ? 'm' : 'f'] && pool.s) {
    const g = pick(pool[sex === 'M' ? 'm' : 'f'], randomFn);
    const s = pick(pool.s, randomFn);
    const isEastAsian = ['ko', 'zh', 'ja', 'vi'].includes(cl);
    const full = isEastAsian ? `${s} ${g}` : `${g} ${s}`;
    return { first: g, last: s, full };
  }

  // Fallback western name
  const fallbackFirst = sex === 'M' ? pick(['James', 'Alex', 'Liam', 'Lucas', 'Noah'], randomFn) : pick(['Emma', 'Sophia', 'Mia', 'Olivia', 'Chloe'], randomFn);
  const fallbackLast = pick(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'], randomFn);
  return { first: fallbackFirst, last: fallbackLast, full: `${fallbackFirst} ${fallbackLast}` };
}

export function generateBirthIdentity({ country, countries, namesPool, citiesPool, citiesEnPool, era = 2024, homeCountryId = 'VNM', randomFn = rnd }) {
  const birthYear = era === 'random' ? randomInt(1950, 2024, randomFn) : (parseInt(era, 10) || 2024);
  const yearDelta = 2024 - birthYear;
  const calFactor = (erasData && erasData.CAL && erasData.CAL[country.id]) || 1.0;

  // Calibrate country stats for past eras
  const calibratedCountry = yearDelta > 0 ? {
    ...country,
    yr: birthYear,
    le: Math.max(35, Math.round(country.le - (yearDelta * 0.22 * calFactor))),
    u5: Math.round(country.u5 * (1 + (yearDelta / 55) * calFactor)),
    im: Math.round(country.im * (1 + (yearDelta / 55) * calFactor)),
    ppp: Math.round(country.ppp * Math.pow(0.97, yearDelta / 2))
  } : { ...country, yr: birthYear };

  // Sex ratio at birth (SRB: male ratio)
  const srb = country.id === 'CHN' ? 0.528 : country.id === 'IND' ? 0.519 : country.id === 'VNM' ? 0.515 : 0.512;
  const sex = chance(srb, randomFn) ? 'M' : 'F';

  // Socioeconomic quintile (1: poorest 20%, 5: wealthiest 20%)
  const q = randomInt(1, 5, randomFn);

  // Urban or rural
  const urbanProb = clamp(country.urb / 100 + (q - 3) * 0.05, 0.05, 0.95);
  const urban = chance(urbanProb, randomFn);

  // City or rural area
  let cityName = null;

  let cityNameEn = null;
  if (urban) {
    const cityList = citiesPool && citiesPool[country.id] ? citiesPool[country.id].split(',') : null;
    const cityListEn = citiesEnPool && citiesEnPool[country.id] ? citiesEnPool[country.id].split(',') : cityList;
    if (cityList && cityList.length) {
      const idx = randomInt(0, cityList.length - 1, randomFn);
      cityName = cityList[idx].trim();
      cityNameEn = (cityListEn && cityListEn[idx]) ? cityListEn[idx].trim() : cityName;
    } else {
      cityName = 'Thành phố trung tâm';
      cityNameEn = 'Capital City';
    }
  } else {
    cityName = 'Vùng nông thôn';
    cityNameEn = 'Rural Area';
  }

  // Religion
  const religion = pickReligion(country.rel, randomFn);

  // Name
  const name = generateName(country.id, sex, namesPool, randomFn);

  // Parents' ages & marriage
  const momAge = Math.round(clamp(20 + randomInt(0, 15, randomFn) + (country.tfr - 2) * 1.5, 17, 45));
  const dadAge = Math.round(clamp(momAge + randomInt(1, 5, randomFn), 18, 55));
  const absentFather = chance(country.p === 'lac' ? 0.25 : country.p === 'ssa' ? 0.2 : 0.08, randomFn);

  // Siblings calculation from Total Fertility Rate (TFR)
  const expectedSiblings = Math.max(0, Math.round(country.tfr - 1 + (randomInt(-1, 2, randomFn) * 0.8)));
  const olderSiblings = Math.min(expectedSiblings, Math.max(0, Math.floor((momAge - 19) / 2.5)));
  const youngerSiblings = Math.max(0, expectedSiblings - olderSiblings);

  // Base Health
  // Influenced by Under-5 mortality (lower u5 = higher initial health) and quintile
  const baseHealth = clamp(85 + (q - 3) * 3 - (country.u5 / 10) + randomInt(-5, 5, randomFn), 40, 99);
  const baseHappiness = clamp(65 + (q - 3) * 2 + randomInt(-6, 6, randomFn), 45, 95);
  const baseSmarts = clamp(50 + (q - 3) * 2 + randomInt(-8, 8, randomFn), 35, 95);
  const baseSocial = clamp(55 + randomInt(-8, 8, randomFn), 35, 95);

  const culture = resolveCulturalIdentity(calibratedCountry, religion, randomFn);

  return {
    bornCountryId: country.id,
    currentCountryId: country.id,
    country: calibratedCountry,
    birthYear,
    homeCountryId,
    sex,
    name,
    q,
    urban,
    cityName,
    cityNameEn,
    religion,
    culture,
    currentFocus: 'study',
    unlockedAchievements: [],
    stats: {
      health: baseHealth,
      happiness: baseHappiness,
      smarts: baseSmarts,
      social: baseSocial,
      wealth: 0,
      educationLevel: 0, // 0: None, 1: Primary, 2: Middle, 3: High, 4: University, 5: Postgrad
    },
    family: {
      mom: { age: momAge, alive: true },
      dad: { age: dadAge, alive: !absentFather, absent: absentFather },
      olderSiblings,
      youngerSiblings,
      partner: null,
      children: [],
      grandchildrenCount: 0
    },
    job: 'Bé thơ',
    jobId: 'infant',
    hobbies: culture.hobbies,
    flags: {},
    yearsLived: 0,
    causeOfDeath: null
  };
}

/**
 * Generate 4 peer babies born at the exact same second across 4 different continents
 */
export function generatePeerBabies(countries, namesPool, randomFn = rnd) {
  const regions = ['ssa', 'eap', 'lac', 'eca'];
  const peers = [];

  for (const reg of regions) {
    const regCountries = countries.filter((c) => c.p === reg);
    const c = regCountries.length ? chooseCountry(regCountries, randomFn) : chooseCountry(countries, randomFn);
    const sex = chance(0.5, randomFn) ? 'M' : 'F';
    const name = generateName(c.id, sex, namesPool, randomFn);

    peers.push({
      id: `peer_${c.id}_${Math.floor(randomFn() * 10000)}`,
      countryId: c.id,
      country: c,
      sex,
      name,
      alive: true,
      deathAge: null,
      deathCause: null,
      status: {
        vi: 'Mới chào đời',
        en: 'Newborn',
        ko: '신생아'
      }
    });
  }

  return peers;
}

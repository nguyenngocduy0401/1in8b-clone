import countryVi from '../data/country_vi.json';
import countryEn from '../data/country_en.json';

export const UI_TRANSLATIONS = {
  vi: {
    // Header & Meta
    title: '1 in 8 Billion · Một trong 8 tỷ người',
    subtitle: 'Mô phỏng cuộc đời thực tế trong dữ liệu của 172 quốc gia',
    birthRateBanner: 'Khoảng 4.3 đứa trẻ chào đời mỗi giây trên Trái Đất. Bạn sẽ sinh ra ở đâu và là ai?',
    
    // Top Bar
    age: 'Tuổi',
    yearsOld: 'tuổi',
    speed: 'Tốc độ:',
    pause: 'Tạm dừng',
    play: 'Tiếp tục',
    step: 'Từng năm',
    newLife: 'Đầu thai kiếp mới',
    pastLives: 'Lịch sử tiền kiếp',
    themeLight: 'Sáng',
    themeDark: 'Tối',

    // Hero / Intro
    heroTitle: '1 trong 8 Tỷ',
    heroLede: 'Mỗi sinh linh chào đời đều bắt đầu bằng một tiếng khóc ngẫu nhiên trên địa cầu. Bạn không thể chọn nơi mình sinh ra, gia cảnh hay cơ hội bước vào đời. Hãy gieo xúc xắc và trải nghiệm một kiếp người.',
    rollButton: '🎲 Đầu thai làm một đứa trẻ',
    rolling: 'Đang gieo xúc xắc số phận...',
    globalOddsTitle: 'Xác suất sinh ra tại các khu vực trên Trái Đất',
    oddsHint: 'Dựa trên thống kê tỷ lệ sinh của Liên Hợp Quốc',

    // Birth Card
    birthCertificate: 'GIẤY KHAI SINH & THẺ CĂN CƯỚC',
    bornIn: 'Nơi sinh',
    sex: 'Giới tính',
    male: 'Nam',
    female: 'Nữ',
    city: 'Địa phương',
    rural: 'Vùng nông thôn',
    religion: 'Tôn giáo',
    quintile: 'Tầng lớp kinh tế gia đình',
    q1: 'Hộ nghèo (20% thấp nhất)',
    q2: 'Thu nhập dưới trung bình',
    q3: 'Tầng lớp trung lưu',
    q4: 'Khá giả',
    q5: 'Giàu có (20% cao nhất)',
    parents: 'Cha mẹ',
    parentsDesc: 'Tuổi cha mẹ khi sinh bạn',
    startLifeButton: 'Bắt đầu cuộc đời này →',

    // Dashboard
    idCard: 'THẺ CĂN CƯỚC',
    vitalStats: 'CHỈ SỐ SINH TỒN',
    health: 'Sức khỏe',
    happiness: 'Hạnh phúc',
    smarts: 'Trí tuệ',
    social: 'Xã hội',
    wealth: 'Tài sản',
    family: 'GIA ĐÌNH & NGƯỜI THÂN',
    mom: 'Mẹ',
    dad: 'Cha',
    partner: 'Bạn đời',
    children: 'Con cái',
    grandchildren: 'Cháu chắt',
    none: 'Chưa có',
    alive: 'còn sống',
    deceased: 'đã mất',
    lifeGrid: 'LƯỚI 100 NĂM CUỘC ĐỜI',
    lifeFeed: 'NHẬT KÝ SỰ KIỆN',
    currentMilestone: 'Dấu mốc hiện tại',

    // Decision Modal
    dilemma: 'LỰA CHỌN CUỘC ĐỜI',
    chooseWisely: 'Hãy chọn một hướng đi cho năm nay:',

    // Death / Summary
    deathCert: 'CHỨNG THƯ KẾT THÚC CUỘC ĐỜI',
    lifeSummary: 'Tổng kết kiếp người',
    yearsLivedTotal: 'Thọ',
    countryLifeExp: 'Tuổi thọ trung bình tại',
    cause: 'Nguyên nhân tử vong',
    peerComparison: 'So sánh với 100 đứa trẻ sinh cùng năm:',
    livedLongerThan: 'Bạn sống thọ hơn',
    ofPeers: 'số người cùng sinh ra tại quốc gia này.',
    finalNetWorth: 'Tài sản tích lũy cuối đời:',
    reincarnate: '🎲 Đầu thai một kiếp sống khác',
    saveShareCard: '📸 Tải thẻ ảnh kỷ niệm',
    cardSavedSuccess: 'Đã tạo thẻ ảnh cuộc đời thành công!'
  },

  en: {
    title: '1 in 8 Billion · Who will you be born as?',
    subtitle: 'Real life simulation across demographic data of 172 countries',
    birthRateBanner: 'Roughly 4.3 babies are born every second on Earth. Where and who will you be born as?',
    
    age: 'Age',
    yearsOld: 'years old',
    speed: 'Speed:',
    pause: 'Pause',
    play: 'Play',
    step: 'Step',
    newLife: 'Reborn / New Life',
    pastLives: 'Past Lives',
    themeLight: 'Light',
    themeDark: 'Dark',

    heroTitle: '1 in 8 Billion',
    heroLede: 'Become one of the infants being born right now and live their whole life inside the authentic statistics of 172 countries. No one chooses where they are born. Roll the dice of life.',
    rollButton: '🎲 Be born as a new baby',
    rolling: 'Rolling the global demographic dice...',
    globalOddsTitle: 'Birth Odds by Global Region',
    oddsHint: 'Based on annual birth statistics from the United Nations',

    birthCertificate: 'CERTIFICATE OF BIRTH',
    bornIn: 'Place of Birth',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    city: 'City / Region',
    rural: 'Rural Village',
    religion: 'Religion',
    quintile: 'Family Socioeconomic Quintile',
    q1: 'Poorest 20%',
    q2: 'Lower Middle',
    q3: 'Middle 20%',
    q4: 'Upper Middle',
    q5: 'Wealthiest 20%',
    parents: 'Parents',
    parentsDesc: 'Parents\' age at birth',
    startLifeButton: 'Begin Living This Life →',

    idCard: 'NATIONAL ID',
    vitalStats: 'VITAL STATS',
    health: 'Health',
    happiness: 'Happiness',
    smarts: 'Smarts',
    social: 'Social',
    wealth: 'Wealth',
    family: 'FAMILY & RELATIVES',
    mom: 'Mother',
    dad: 'Father',
    partner: 'Spouse',
    children: 'Children',
    grandchildren: 'Grandchildren',
    none: 'None',
    alive: 'alive',
    deceased: 'deceased',
    lifeGrid: '100-YEAR LIFE GRID',
    lifeFeed: 'LIFE LOG',
    currentMilestone: 'Current Age',

    dilemma: 'LIFE DECISION',
    chooseWisely: 'Choose how you will direct this year:',

    deathCert: 'CERTIFICATE OF DEATH',
    lifeSummary: 'Life Summary & Memorial',
    yearsLivedTotal: 'Lived to',
    countryLifeExp: 'Average life expectancy in',
    cause: 'Cause of Death',
    peerComparison: 'Out of 100 children born the same year:',
    livedLongerThan: 'You lived longer than',
    ofPeers: 'of peers born in this country.',
    finalNetWorth: 'Final accumulated estate:',
    reincarnate: '🎲 Reincarnate into another life',
    saveShareCard: '📸 Save Life Story Card',
    cardSavedSuccess: 'Life memorial image created!'
  },

  ko: {
    title: '80억 분의 1 · 당신은 누구로 태어날까?',
    subtitle: '172개국의 실제 통계 데이터 속에서 살아보는 인생 시뮬레이션',
    birthRateBanner: '지구상에서는 매초 약 4.3명의 아기가 태어납니다. 당신은 어디서 태어날까요?',
    
    age: '나이',
    yearsOld: '세',
    speed: '속도:',
    pause: '일시정지',
    play: '재생',
    step: '1년 진행',
    newLife: '새로운 삶',
    pastLives: '이전 삶 기록',
    themeLight: '라이트',
    themeDark: '다크',

    heroTitle: '80억 분의 1',
    heroLede: '지금 이 순간 지구 어딘가에서 태어나는 아기가 되어, 172개국의 실제 통계 속에서 한 번뿐인 인생을 살아보세요. 어디서 태어날지는 아무도 고를 수 없습니다.',
    rollButton: '🎲 새로운 삶으로 태어나기',
    rolling: '세계의 아기들 중 한 명으로 태어나는 중...',
    globalOddsTitle: '대륙별 출생 확률',
    oddsHint: '유엔 인구 통계 데이터 기준',

    birthCertificate: '출 생 증 명 서',
    bornIn: '출생 국가',
    sex: '성별',
    male: '남성',
    female: '여성',
    city: '출생지',
    rural: '농촌 지역',
    religion: '종교',
    quintile: '가정 경제 소득 분위',
    q1: '하위 20% (빈곤층)',
    q2: '중하위층',
    q3: '중간층 (중산층)',
    q4: '중상위층',
    q5: '상위 20% (고소득층)',
    parents: '부모님',
    parentsDesc: '출생 당시 부모님 나이',
    startLifeButton: '이 삶을 살아가기 →',

    idCard: '신 분 증',
    vitalStats: '생 체 지 표',
    health: '건강',
    happiness: '행복',
    smarts: '지식',
    social: '관계',
    wealth: '자산',
    family: '가족 및 친족',
    mom: '어머니',
    dad: '아버지',
    partner: '배우자',
    children: '자녀',
    grandchildren: '손주',
    none: '없음',
    alive: '생존',
    deceased: '작고',
    lifeGrid: '인생 100년 그리드',
    lifeFeed: '인생 일지',
    currentMilestone: '현재 나이',

    dilemma: '인 생 의 선 택',
    chooseWisely: '올 한 해를 어디에 쓸지 결정하세요:',

    deathCert: '사 망 증 명 서',
    lifeSummary: '인생 요약 및 회고',
    yearsLivedTotal: '향년',
    countryLifeExp: '평균 기대 수명:',
    cause: '사망 원인',
    peerComparison: '같은 해 태어난 100명의 동시대인 중:',
    livedLongerThan: '당신은',
    ofPeers: '보다 오래 살았습니다.',
    finalNetWorth: '최종 유산:',
    reincarnate: '🎲 또 다른 삶으로 환생하기',
    saveShareCard: '📸 기념 카드 저장',
    cardSavedSuccess: '추모 카드가 생성되었습니다!'
  }
};

export function getCountryName(countryId, lang = 'en', fallbackKo = '') {
  if (lang === 'vi') {
    return countryVi[countryId] || fallbackKo || countryId;
  }
  if (lang === 'en') {
    return countryEn[countryId] || countryId;
  }
  return fallbackKo || countryEn[countryId] || countryId;
}

export function getReligionName(relCode, lang = 'en') {
  const map = {
    C: { vi: 'Kitô giáo (Công giáo / Tin lành)', en: 'Christianity', ko: '기독교' },
    M: { vi: 'Hồi giáo (Islam)', en: 'Islam', ko: '이슬람' },
    H: { vi: 'Ấn Độ giáo (Hindu)', en: 'Hinduism', ko: '힌두교' },
    B: { vi: 'Phật giáo (Buddhism)', en: 'Buddhism', ko: '불교' },
    J: { vi: 'Do Thái giáo (Judaism)', en: 'Judaism', ko: '유대교' },
    N: { vi: 'Không theo tôn giáo (Vô thần)', en: 'No Religion', ko: '무교' },
    F: { vi: 'Tín ngưỡng dân gian truyền thống', en: 'Folk / Traditional faith', ko: '민간·전통 신앙' },
    S: { vi: 'Đạo Sikh', en: 'Sikhism', ko: '시크교' },
    O: { vi: 'Tôn giáo khác', en: 'Other religion', ko: '기타 종교' }
  };
  return map[relCode] ? map[relCode][lang] || map[relCode].en : (lang === 'vi' ? 'Không tôn giáo' : 'None');
}

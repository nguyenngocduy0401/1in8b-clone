import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/a456d222-211c-47bc-a623-1348ba3b5a29/.system_generated/steps/241/content.md', 'utf8');

// 1. EXTRACT DISH
const dishMatch = content.match(/const DISH = \{([^}]+)\};/);
const dishes = {};
if (dishMatch) {
  const pairs = dishMatch[1].split(',');
  for (const p of pairs) {
    const m = p.match(/([A-Z]{3})\s*:\s*L`([^`]+)`/);
    if (m) {
      const [_, code, ko] = m;
      dishes[code] = {
        ko: ko.trim(),
        vi: ko.trim(), // Will be enriched
        en: ko.trim()
      };
    }
  }
}

// Notable translations for dishes
const DISH_TRANSLATIONS = {
  VNM: { vi: 'Phở bò / Phở gà', en: 'Pho noodle soup', ko: '쌀국수' },
  KOR: { vi: 'Canh tương Doenjang jjigae', en: 'Soybean paste stew (Doenjang-jjigae)', ko: '된장찌개' },
  PRK: { vi: 'Mì lạnh Naengmyeon', en: 'Cold noodles (Naengmyeon)', ko: '냉면' },
  JPN: { vi: 'Sushi & Cơm phần Teishoku', en: 'Sushi and Teishoku meal', ko: '초밥' },
  CHN: { vi: 'Sủi cảo & Mì sợi', en: 'Dumplings (Jiaozi)', ko: '만두' },
  TWN: { vi: 'Mì bò hầm Đài Loan', en: 'Taiwanese beef noodle soup', ko: '우육면' },
  THA: { vi: 'Pad Thai & Tom Yum', en: 'Pad Thai & Tom Yum', ko: '팟타이' },
  IDN: { vi: 'Cơm chiên Nasi Goreng', en: 'Nasi Goreng', ko: '나시 고렝' },
  MYS: { vi: 'Cơm nước cốt dừa Nasi Lemak', en: 'Nasi Lemak', ko: '나시 르막' },
  IND: { vi: 'Bánh mì Roti & Cà ri đậu Dal', en: 'Dal and Roti', ko: '달과 로티' },
  PAK: { vi: 'Cơm Biryani hương thảo mộc', en: 'Biryani', ko: '비리야니' },
  BGD: { vi: 'Cà ri cá sông Macher Jhol', en: 'Fish curry', ko: '생선 커리' },
  NPL: { vi: 'Cơm Dal Bhat truyền thống', en: 'Dal Bhat', ko: '달밧' },
  LKA: { vi: 'Cơm và cà ri cay Tích Lan', en: 'Rice and curry', ko: '라이스 앤 커리' },
  NGA: { vi: 'Cơm Jollof Tây Phi', en: 'Jollof rice', ko: '졸로프 라이스' },
  GHA: { vi: 'Cơm Jollof vàng ươm', en: 'Jollof rice', ko: '졸로프 라이스' },
  ETH: { vi: 'Bánh Injera và sốt Wat cay', en: 'Injera and Wat', ko: '인제라와 와트' },
  EGY: { vi: 'Cơm mì Koshari', en: 'Koshari', ko: '코샤리' },
  USA: { vi: 'Bánh Burger & Khoai tây chiên', en: 'Cheeseburger and fries', ko: '햄버거와 감자튀김' },
  GBR: { vi: 'Cá chiên kèm khoai tây Fish & Chips', en: 'Fish and chips', ko: '피시 앤 칩스' },
  FRA: { vi: 'Bánh mì Baguette và phô mai', en: 'Baguette and regional cheese', ko: '바게트와 치즈' },
  ITA: { vi: 'Mì Ý Pasta sốt cà chua húng quế', en: 'Pasta al pomodoro', ko: '파스타' },
  DEU: { vi: 'Xúc xích nướng Bratwurst & Bánh mì', en: 'Bratwurst and crusty bread', ko: '소시지와 빵' },
  ESP: { vi: 'Cơm chiên hải sản Paella', en: 'Paella', ko: '파에야' },
  MEX: { vi: 'Bánh Tacos thịt nướng ngò rí', en: 'Street Tacos', ko: '타코' },
  BRA: { vi: 'Thịt hầm đậu đen Feijoada', en: 'Feijoada black bean stew', ko: '페이조아다' },
  ARG: { vi: 'Thịt bò nướng Asado', en: 'Asado barbecue', ko: '아사도' },
  RUS: { vi: 'Súp củ dền Borsch & Bánh mì đen', en: 'Borscht and rye bread', ko: '보르시' }
};

for (const [code, trans] of Object.entries(DISH_TRANSLATIONS)) {
  if (dishes[code]) {
    dishes[code] = trans;
  } else {
    dishes[code] = trans;
  }
}

// 2. EXTRACT REFLECTIONS (Ages 5, 15, 30, 50, 70)
const REFLECTIONS = {
  5: {
    age: 5,
    title: {
      vi: 'Tròn năm tuổi: Nhìn lại thuở ấu thơ',
      en: 'Age 5: Early Childhood Checkpoint',
      ko: '다섯 살, 당연했던 것들을 돌아보며'
    },
    fact: {
      vi: 'Trên toàn thế giới, cứ mỗi năm có khoảng 5 triệu trẻ em không sống qua sinh nhật 5 tuổi do nghèo đói và dịch bệnh (UNICEF/WHO). Bạn nằm trong số những người may mắn sống sót.',
      en: 'Globally, about 5 million children die before reaching their fifth birthday due to preventable causes (UNICEF/WHO). Reaching age 5 is humanity\'s first major milestone.',
      ko: '전 세계에서 해마다 약 500만 명의 어린이가 다섯 번째 생일을 맞지 못하고 세상을 떠납니다. 당신은 첫 고비를 무사히 넘겼습니다.'
    },
    questions: [
      {
        question: {
          vi: 'Thời năm tuổi của bạn như thế nào? Hãy nhớ về một điều tưởng chừng đương nhiên nhất khi ấy:',
          en: 'How was your life at age five? What was something you took for granted back then?',
          ko: '당신의 다섯 살은 어땠나요? 그때 당연하게 누렸던 것 하나를 떠올려 보세요.'
        },
        options: [
          {
            id: 'dinner',
            label: { vi: 'Mâm cơm nóng hổi mẹ dọn mỗi tối', en: 'A warm dinner served every evening', ko: '매일 저녁 차려지던 밥상' },
            stat: { happiness: 4, social: 3 }
          },
          {
            id: 'clinic',
            label: { vi: 'Phòng khám đưa tới mỗi lần ốm sốt', en: 'A doctor or clinic whenever you fell sick', ko: '아플 때 데려가 주던 병원' },
            stat: { health: 5, smarts: 2 }
          },
          {
            id: 'swing',
            label: { vi: 'Chiếc xích đu ngoài góc sân chơi ngõ xóm', en: 'The swings and playground in the neighborhood', ko: '동네 놀이터의 그네' },
            stat: { happiness: 6, health: 2 }
          }
        ]
      }
    ]
  },
  15: {
    age: 15,
    title: {
      vi: 'Mười lăm tuổi: Ngưỡng cửa thanh xuân',
      en: 'Age 15: The Dawn of Youth',
      ko: '열다섯 살, 학교와 세상의 문턱'
    },
    fact: {
      vi: 'Khoảng 250 triệu trẻ vị thành niên trên thế giới không được đến trường trung học, mà phải sớm lao động mưu sinh kiếm sống cho gia đình (UNESCO).',
      en: 'Over 250 million children and youth worldwide are out of school, many pushed into early labor or marriage (UNESCO).',
      ko: '세계 2억 5천만 명의 청소년이 학교에 다니지 못하고 생계 현장으로 내몰립니다.'
    },
    questions: [
      {
        question: {
          vi: 'Ở tuổi mười lăm, mái trường có ý nghĩa gì đối với bạn?',
          en: 'At age fifteen, what did school and daily life mean to you?',
          ko: '열다섯 살의 당신에게 학교는 어떤 곳이었나요?'
        },
        options: [
          {
            id: 'friends',
            label: { vi: 'Nơi tụ tập bạn bè chia sẻ mọi buồn vui', en: 'A vibrant place to meet friends and laugh', ko: '친구들을 만나러 가던 곳' },
            stat: { social: 6, happiness: 4 }
          },
          {
            id: 'study',
            label: { vi: 'Nơi miệt mài học tập để tìm kiếm cơ hội đổi đời', en: 'A crucible of hard study to forge a brighter future', ko: '미래를 위해 치열하게 공부하던 곳' },
            stat: { smarts: 8, health: -2 }
          },
          {
            id: 'dream',
            label: { vi: 'Nơi ấp ủ những ước mơ vượt ngoài giới hạn hiện tại', en: 'A window gazing out onto a wider world', ko: '더 넓은 세상을 꿈꾸던 창문' },
            stat: { smarts: 4, happiness: 5 }
          }
        ]
      }
    ]
  },
  30: {
    age: 30,
    title: {
      vi: 'Ba mươi tuổi: Đứng giữa dòng đời',
      en: 'Age 30: Midst the Human Tide',
      ko: '서른 살, 일과 삶의 무게'
    },
    fact: {
      vi: 'Một người 30 tuổi trung bình trên thế giới làm việc 44 giờ mỗi tuần, đối mặt với áp lực nuôi sống gia đình giữa những chênh lệch thu nhập cực lớn giữa các quốc gia.',
      en: 'The average 30-year-old works 44 hours a week, facing housing, family, and career pressures in an interconnected world.',
      ko: '서른 살의 세계 시민은 평균 주 44시간 일하며, 각자의 자리에서 가족과 생계를 지탱해 나갑니다.'
    },
    questions: [
      {
        question: {
          vi: 'Nhìn lại chặng đường vừa qua, điều gì khiến bạn cảm thấy biết ơn nhất mỗi ngày?',
          en: 'Looking at your journey so far, what are you most grateful for today?',
          ko: '서른 살, 오늘 당신이 가장 고마워하는 일은 무엇인가요?'
        },
        options: [
          {
            id: 'health',
            label: { vi: 'Gia đình và người thân vẫn bình an khỏe mạnh', en: 'That family and loved ones are safe and sound', ko: '가족이 건강하다는 것' },
            stat: { happiness: 6, social: 4 }
          },
          {
            id: 'work',
            label: { vi: 'Bản thân vẫn có công việc và đôi tay cần lao tạo ra giá trị', en: 'Having honest work and self-reliance', ko: '오늘도 일할 수 있다는 것' },
            stat: { wealth: 200, smarts: 3 }
          },
          {
            id: 'peace',
            label: { vi: 'Một góc nhỏ bình yên giữa những biến động của xã hội', en: 'A peaceful corner of home amidst turbulent times', ko: '작지만 소중한 내 보금자리' },
            stat: { happiness: 8 }
          }
        ]
      }
    ]
  },
  50: {
    age: 50,
    title: {
      vi: 'Năm mươi tuổi: Nửa đời người',
      en: 'Age 50: Half a Century Lived',
      ko: '쉰 살, 삶을 지탱해 준 인연들'
    },
    fact: {
      vi: 'Tuổi thọ trung bình của nhân loại đã tăng từ 46 tuổi (năm 1950) lên hơn 73 tuổi hiện nay nhờ sự phát triển của y tế và vệ sinh dịch tễ (UN Population).',
      en: 'Global life expectancy increased from 46 in 1950 to over 73 today, representing humanity\'s greatest triumph over disease.',
      ko: '인류의 기대수명은 1950년 46세에서 오늘날 73세로 비약적으로 늘어났습니다.'
    },
    questions: [
      {
        question: {
          vi: 'Suốt nửa thế kỷ thăng trầm, điều gì đã giữ bạn đứng vững trước giông bão cuộc đời?',
          en: 'Throughout half a century of trials, who or what kept you anchored?',
          ko: '살면서 당신을 붙잡아 준 가장 든든한 힘은 무엇이었나요?'
        },
        options: [
          {
            id: 'friends',
            label: { vi: 'Những người bạn chân thành gọi điện sẻ chia lúc cùng cực', en: 'True friends who called and listened in darkest hours', ko: '힘들 때 손 내밀어 준 친구' },
            stat: { social: 8, happiness: 5 }
          },
          {
            id: 'family',
            label: { vi: 'Ánh mắt và nụ cười của con cái mỗi khi về đến nhà', en: 'The laughter of children welcoming you home', ko: '집에서 나를 반겨 주던 가족' },
            stat: { happiness: 10, social: 5 }
          },
          {
            id: 'faith',
            label: { vi: 'Niềm tin nội tâm và sự kiên cường không chịu khuất phục', en: 'Inner fortitude and faith in tomorrow', ko: '스스로를 지켜낸 단단한 마음' },
            stat: { smarts: 6, health: 4 }
          }
        ]
      }
    ]
  },
  70: {
    age: 70,
    title: {
      vi: 'Bảy mươi tuổi: Xế bóng hoàng hôn',
      en: 'Age 70: The Golden Sunset',
      ko: '일흔 살, 한 번뿐인 인생의 기억'
    },
    fact: {
      vi: 'Trong 4 em bé sinh cùng giây với bạn 70 năm trước, phần lớn đã hoàn thành cuộc hành trình đời mình. Bạn là nhân chứng sống động cho một thế hệ đầy biến cố.',
      en: 'Of the babies born in the exact same second as you 70 years ago, most have now concluded their life story.',
      ko: '70년 전 같은 초에 태어난 동갑내기들 중 상당수가 먼저 떠났습니다. 당신은 소중한 생존자입니다.'
    },
    questions: [
      {
        question: {
          vi: 'Khi nhìn lại một kiếp nhân sinh, bạn mong muốn được nhớ đến như thế nào?',
          en: 'Looking back upon a unique human life, how do you wish to be remembered?',
          ko: '한 번뿐인 삶의 끝자락, 당신은 어떤 사람으로 기억되고 싶나요?'
        },
        options: [
          {
            id: 'warm',
            label: { vi: 'Một người mang lại sự ấm áp, bình yên cho những ai từng kề cận', en: 'Someone who brought warmth and comfort to those nearby', ko: '곁에 있으면 편안하고 따뜻했던 사람' },
            stat: { happiness: 12, social: 8 }
          },
          {
            id: 'honest',
            label: { vi: 'Một người lao động lương thiện, tận tụy và không hổ thẹn với lương tâm', en: 'An honest soul who worked hard and lived with integrity', ko: '정직하고 성실하게 삶을 일군 사람' },
            stat: { smarts: 8, happiness: 10 }
          },
          {
            id: 'dinner',
            label: { vi: 'Những bữa tối đầm ấm cùng gia đình sum vầy bên ánh lửa', en: 'The quiet memory of shared family dinners', ko: '가족과 둘러앉아 웃던 저녁 식탁' },
            stat: { happiness: 15 }
          }
        ]
      }
    ]
  }
};

// 3. EXTRACT SHOP
const SHOP_ITEMS = [
  {
    id: 'dinner',
    name: { vi: 'Mời bữa cơm thân mật cho gia đình & bạn bè', en: 'Family & Friends Gathering Dinner', ko: '가족·친구와 외식·선물' },
    desc: { vi: 'Gắn kết tình thân, chia sẻ niềm vui ấm cúng', en: 'Bonds +4, Happiness +2', ko: '관계 +4 · 행복 +2' },
    minAge: 16,
    costPercentile: 0.03,
    effects: { social: 4, happiness: 2, wealth: -200 }
  },
  {
    id: 'checkup',
    name: { vi: 'Khám sức khỏe tổng quát & Rèn luyện thể lực', en: 'Comprehensive Health Checkup & PT', ko: '종합검진·운동 PT' },
    desc: { vi: 'Sức khỏe +6, phát hiện sớm nguy cơ bệnh tật', en: 'Health +6, reduced chronic risk', ko: '건강 +6 · 만성질환 위험 ↓' },
    minAge: 25,
    costPercentile: 0.08,
    effects: { health: 8, happiness: 2, wealth: -400 }
  },
  {
    id: 'trip',
    name: { vi: 'Chuyến du lịch khám phá danh lam trong nước', en: 'Domestic Sightseeing Trip', ko: '국내 여행' },
    desc: { vi: 'Hạnh phúc +6, Trí tuệ +2', en: 'Happiness +6, Smarts +2', ko: '행복 +5 · 지식 +1' },
    minAge: 16,
    costPercentile: 0.06,
    effects: { happiness: 6, smarts: 2, wealth: -300 }
  },
  {
    id: 'abroad',
    name: { vi: 'Chuyến du lịch nước ngoài mở rộng tầm mắt', en: 'International Journey Abroad', ko: '해외여행' },
    desc: { vi: 'Hạnh phúc +10, Trí tuệ +5, mở mang thế giới quan', en: 'Happiness +10, Smarts +5', ko: '행복 +8 · 지식 +3' },
    minAge: 20,
    costPercentile: 0.25,
    effects: { happiness: 10, smarts: 5, wealth: -1200 }
  },
  {
    id: 'course',
    name: { vi: 'Học chứng chỉ nghề nghiệp / Nâng cao kỹ năng', en: 'Professional Certification & Training', ko: '자격증·직무 강좌' },
    desc: { vi: 'Trí tuệ +8, tăng cơ hội thăng tiến nghề nghiệp', en: 'Smarts +8, career promotion chances', ko: '지식 +6 · 소득 ↑' },
    minAge: 18,
    costPercentile: 0.12,
    effects: { smarts: 8, happiness: -2, wealth: -500 }
  },
  {
    id: 'donate',
    name: { vi: 'Quyên góp từ thiện giúp đỡ hoàn cảnh khó khăn', en: 'Charitable Donation to Community', ko: '기부하기' },
    desc: { vi: 'Hạnh phúc +6, Quan hệ xã hội +4', en: 'Happiness +6, Social +4', ko: '기부 · 행복 ↑' },
    minAge: 20,
    costPercentile: 0.05,
    effects: { happiness: 6, social: 4, wealth: -250 }
  },
  {
    id: 'pet',
    name: { vi: 'Nhận nuôi một chú thú cưng bầu bạn (Chó/Mèo)', en: 'Adopt a Companion Pet (Dog/Cat)', ko: '반려동물 입양' },
    desc: { vi: 'Hạnh phúc +8, Quan hệ +5, bớt cô đơn', en: 'Happiness +8, Social +5', ko: '반려동물 · 행복 +8' },
    minAge: 10,
    costPercentile: 0.04,
    effects: { happiness: 8, social: 5, wealth: -150 }
  }
];

// Write output files
fs.writeFileSync('src/data/dishes.json', JSON.stringify(dishes, null, 2), 'utf8');
fs.writeFileSync('src/data/reflections.json', JSON.stringify(REFLECTIONS, null, 2), 'utf8');
fs.writeFileSync('src/data/shop.json', JSON.stringify(SHOP_ITEMS, null, 2), 'utf8');

console.log('Successfully generated src/data/dishes.json, reflections.json, and shop.json');

import fs from 'fs';
import path from 'path';

// Vietnamese translations for all original 1in8b.life jobs
const JOB_TRANSLATIONS = {
  farm: { vi: 'Nông dân tự cung tự cấp', en: 'Smallholder farmer', ko: '소농 (자급 농사)' },
  farmhand: { vi: 'Lao động làm thuê trang trại', en: 'Farmhand / Agricultural laborer', ko: '농장 일꾼' },
  herder: { vi: 'Người chăn nuôi gia súc du mục', en: 'Pastoralist / Herder', ko: '목축업' },
  fisher: { vi: 'Ngư dân đánh bắt thủy hải sản', en: 'Fisher / Fisherwoman', ko: '어부' },
  agbiz: { vi: 'Chủ trang trại / Quản lý nông nghiệp', en: 'Agribusiness manager / Farm owner', ko: '농장 경영' },
  construct: { vi: 'Công nhân xây dựng', en: 'Construction worker', ko: '건설 노동자' },
  factory: { vi: 'Công nhân nhà máy sản xuất', en: 'Factory worker / Assembler', ko: '공장 노동자' },
  garment: { vi: 'Thợ may / Công nhân may mặc', en: 'Garment / Textile worker', ko: '봉제 공장 노동자' },
  miner: { vi: 'Công nhân khai thác mỏ', en: 'Miner', ko: '광부' },
  artisan: { vi: 'Thợ thủ công truyền thống (mộc, gốm)', en: 'Artisan / Craftsman (carpenter, tailor)', ko: '수공업 장인 (목수·재봉)' },
  mechanic: { vi: 'Thợ sửa chữa ô tô - xe máy', en: 'Auto mechanic', ko: '자동차 정비공' },
  electric: { vi: 'Thợ điện / Kỹ thuật viên điện', en: 'Electrician', ko: '전기 기술자' },
  engineer: { vi: 'Kỹ sư kỹ thuật', en: 'Engineer', ko: '엔지니어' },
  vendor: { vi: 'Tiểu thương / Bán hàng rong', en: 'Street vendor / Small trader', ko: '노점상·소상인' },
  domestic: { vi: 'Nhân viên giúp việc gia đình', en: 'Domestic worker / Housekeeper', ko: '가사도우미' },
  driver: { vi: 'Tài xế lái xe (taxi, xe tải, buýt)', en: 'Driver (cab, truck, bus)', ko: '운전기사 (오토바이·트럭)' },
  delivery: { vi: 'Nhân viên giao hàng công nghệ', en: 'Delivery rider / Courier', ko: '배달 기사' },
  shop: { vi: 'Nhân viên bán hàng / Thu ngân', en: 'Shop assistant / Cashier', ko: '판매원' },
  cook: { vi: 'Đầu bếp / Phụ bếp nhà hàng', en: 'Cook / Kitchen worker', ko: '식당 요리사·종업원' },
  guard: { vi: 'Nhân viên bảo vệ / An ninh', en: 'Security guard', ko: '경비원' },
  hair: { vi: 'Thợ làm tóc / Chăm sóc sắc đẹp', en: 'Hairdresser / Barber', ko: '미용사' },
  care: { vi: 'Điều dưỡng viên chăm sóc người cao tuổi', en: 'Care worker / Caregiver', ko: '요양보호사' },
  clerk: { vi: 'Nhân viên văn phòng hành chính', en: 'Office clerk / Administrator', ko: '사무직' },
  callc: { vi: 'Chuyên viên tổng đài chăm sóc khách hàng', en: 'Call center representative', ko: '콜센터 상담원' },
  teacher: { vi: 'Giáo viên trường học', en: 'School teacher', ko: '교사' },
  nurse: { vi: 'Y tá / Điều dưỡng bệnh viện', en: 'Registered nurse', ko: '간호사' },
  police: { vi: 'Sĩ quan cảnh sát', en: 'Police officer', ko: '경찰' },
  soldier: { vi: 'Quân nhân chuyên nghiệp', en: 'Professional soldier', ko: '직업 군인' },
  civil: { vi: 'Công chức nhà nước', en: 'Civil servant / Government official', ko: '공무원' },
  finance: { vi: 'Chuyên gia kế toán - tài chính', en: 'Accountant / Financial analyst', ko: '회계·금융 전문가' },
  dev: { vi: 'Lập trình viên / Kỹ sư phần mềm', en: 'Software developer', ko: '소프트웨어 개발자' },
  doctor: { vi: 'Bác sĩ điều trị', en: 'Medical doctor / Physician', ko: '의사' },
  lawyer: { vi: 'Luật sư', en: 'Lawyer / Attorney', ko: '변호사' },
  prof: { vi: 'Giáo sư / Nhà nghiên cứu khoa học', en: 'Professor / Research scientist', ko: '연구원·교수' },
  creator: { vi: 'Nhà sáng tạo nội dung / Nghệ sĩ tự do', en: 'Content creator / Independent artist', ko: '크리에이터·예술가' },
  owner: { vi: 'Chủ doanh nghiệp nhỏ / Chủ tiệm kinh doanh', en: 'Small business owner / Entrepreneur', ko: '자영업 사장' },
  cleaner: { vi: 'Công nhân vệ sinh môi trường', en: 'Cleaner / Sanitation worker', ko: '청소원·환경미화원' },
  warehouse: { vi: 'Nhân viên kho vận & hậu cần', en: 'Warehouse / Logistics worker', ko: '물류센터 직원' },
  childcare: { vi: 'Giáo viên mầm non', en: 'Early childhood educator / Nursery teacher', ko: '보육교사' },
  healthtech: { vi: 'Kỹ thuật viên xét nghiệm / Vật lý trị liệu', en: 'Medical / Physical therapy technician', ko: '물리치료사·임상병리사' },
  social: { vi: 'Nhân viên công tác xã hội', en: 'Social worker', ko: '사회복지사' },
  salesagent: { vi: 'Môi giới bảo hiểm / Bất động sản', en: 'Real estate / Insurance agent', ko: '보험설계사·부동산 중개인' },
  welder: { vi: 'Thợ hàn / Thợ sửa ống nước', en: 'Welder / Plumber', ko: '용접공·배관공' },
  clergy: { vi: 'Tu sĩ / Giáo sĩ tôn giáo', en: 'Clergy member / Priest / Imam / Monk', ko: '성직자' },
  pilot: { vi: 'Phi công hàng không', en: 'Airline pilot', ko: '항공기 조종사' },
  cabin: { vi: 'Tiếp viên hàng không', en: 'Flight attendant', ko: '항공 승무원' },
  mp: { vi: 'Đại biểu quốc hội / Nghị sĩ', en: 'Member of Parliament / Congressman', ko: '국회의원' },
  leader: { vi: 'Lãnh đạo quốc gia (Thủ tướng / Tổng thống)', en: 'President / Prime Minister', ko: '대통령·총리' },
  astro: { vi: 'Phi hành gia vũ trụ', en: 'Astronaut', ko: '우주비행사' },
  athlete: { vi: 'Vận động viên thể thao chuyên nghiệp', en: 'Professional athlete', ko: '프로 운동선수' },
  coach: { vi: 'Huấn luyện viên thể thao', en: 'Sports coach', ko: '운동 코치' },
  trainer: { vi: 'Huấn luyện viên thể hình cá nhân', en: 'Fitness trainer', ko: '트레이너·생활체육 지도자' },
  musician: { vi: 'Nhạc sĩ / Ca sĩ / Nghệ sĩ biểu diễn', en: 'Musician / Vocalist', ko: '음악가 (가수·연주자)' },
  idol: { vi: 'Thần tượng âm nhạc', en: 'Pop idol', ko: '아이돌 가수' },
  artist: { vi: 'Họa sĩ / Họa sĩ minh họa', en: 'Painter / Illustrator', ko: '화가·일러스트레이터' },
  actor: { vi: 'Diễn viên điện ảnh / Sân khấu', en: 'Actor / Actress', ko: '배우' },
  dancer: { vi: 'Vũ công / Biên đạo múa', en: 'Dancer / Choreographer', ko: '무용수·안무가' },
  boardpro: { vi: 'Kỳ thủ cờ vua / cờ vây chuyên nghiệp', en: 'Professional board gamer (Chess / Go)', ko: '프로 기사 (바둑·체스)' },
  designer: { vi: 'Nhà thiết kế đồ họa / thời trang', en: 'Designer (Graphic / Fashion)', ko: '디자이너' },
  homemaker: { vi: 'Nội trợ chăm sóc gia đình', en: 'Homemaker / Stay-at-home parent', ko: '가사·육아 전담' },
  retired: { vi: 'Nghỉ hưu an hưởng tuổi già', en: 'Retired', ko: '은퇴' },
  student: { vi: 'Học sinh / Sinh viên', en: 'Student', ko: '학생' },
  service: { vi: 'Nghĩa vụ quân sự', en: 'Military conscript / Service', ko: '군 복무' },
  seeking: { vi: 'Đang tìm kiếm việc làm', en: 'Job seeker / Unemployed', ko: '구직 중' },
  prison: { vi: 'Đang chấp hành án phạt tù', en: 'Incarcerated', ko: '수감 중' },
  childwork: { vi: 'Trẻ em phụ giúp gia đình kiếm sống', en: 'Working child (family chores/farm)', ko: '일하는 아이 (가사·농사)' },
  shelter: { vi: 'Lao động tại xưởng bảo trợ xã hội', en: 'Sheltered workshop worker', ko: '보호작업장 근로자' },
  dayc: { vi: 'Người tham gia sinh hoạt ban ngày', en: 'Daycare / Community activity', ko: '주간 활동' }
};

// Full causes of death from 1in8b.life
const CAUSE_TRANSLATIONS = {
  neo: { vi: 'Bệnh lý sơ sinh (sinh non, ngạt thở, biến chứng)', en: 'Neonatal conditions (preterm birth, birth asphyxia)', ko: '신생아 질환 (조산·출생 합병증)' },
  lri: { vi: 'Viêm phổi và nhiễm trùng đường hô hấp dưới', en: 'Pneumonia and lower respiratory infection', ko: '폐렴 (하기도 감염)' },
  diar: { vi: 'Bệnh tiêu chảy cấp tính gây mất nước nghiêm trọng', en: 'Acute diarrheal disease and dehydration', ko: '설사병' },
  mal: { vi: 'Sốt rét ác tính', en: 'Severe malaria', ko: '말라리아' },
  tb: { vi: 'Bệnh lao phổi biến chứng', en: 'Tuberculosis', ko: '결핵' },
  hiv: { vi: 'Biến chứng suy giảm miễn dịch HIV/AIDS', en: 'HIV/AIDS related complications', ko: 'HIV/AIDS' },
  oinf: { vi: 'Bệnh truyền nhiễm cấp tính (sởi, sốt xuất huyết, viêm màng não)', en: 'Infectious diseases (measles, dengue, meningitis)', ko: '감염병' },
  nut: { vi: 'Suy dinh dưỡng nặng và suy kiệt cơ thể', en: 'Severe malnutrition and wasting', ko: '영양실조' },
  cong: { vi: 'Dị tật bẩm sinh tim mạch hoặc cơ quan', en: 'Congenital heart and organ anomalies', ko: '선천성 기형' },
  ihd: { vi: 'Bệnh tim thiếu máu cục bộ (nhồi máu cơ tim)', en: 'Ischemic heart disease (heart attack)', ko: '허혈성 심장질환 (심근경색)' },
  str: { vi: 'Đột quỵ não (tai biến mạch máu não cấp)', en: 'Stroke (cerebrovascular accident)', ko: '뇌졸중' },
  can: { vi: 'Bệnh ung thư ác tính', en: 'Cancer', ko: '암' },
  copd: { vi: 'Bệnh phổi tắc nghẽn mạn tính (COPD)', en: 'Chronic obstructive pulmonary disease (COPD)', ko: '만성폐쇄성폐질환 (COPD)' },
  dia: { vi: 'Biến chứng nặng của bệnh tiểu đường', en: 'Severe diabetes complications', ko: '당뇨병 합병증' },
  kid: { vi: 'Suy thận mạn tính giai đoạn cuối', en: 'End-stage chronic kidney disease', ko: '만성 신장질환' },
  dem: { vi: 'Hội chứng sa sút trí tuệ / Alzheimer', en: 'Alzheimer\'s disease and dementia', ko: '알츠하이머·치매' },
  cir: { vi: 'Xơ gan và suy giảm chức năng gan', en: 'Cirrhosis and chronic liver failure', ko: '간경변 (간 질환)' },
  ocd: { vi: 'Các bệnh lý nội khoa mạn tính khác', en: 'Other chronic diseases', ko: '기타 질병' },
  road: { vi: 'Tai nạn giao thông đường bộ', en: 'Road traffic collision', ko: '교통사고' },
  hom: { vi: 'Nạn nhân của tội phạm giết người / bạo lực', en: 'Homicide / victim of violent crime', ko: '타살' },
  war: { vi: 'Nạn nhân của xung đột vũ trang và chiến tranh', en: 'Armed conflict and war casualty', ko: '무력 분쟁' },
  drown: { vi: 'Tai nạn đuối nước', en: 'Accidental drowning', ko: '익사' },
  fall: { vi: 'Tai nạn té ngã nghiêm trọng', en: 'Fatal accidental fall', ko: '낙상 사고' },
  fire: { vi: 'Hỏa hoạn và bỏng nhiệt nặng', en: 'Fire, heat, and hot substances', ko: '화재·화상' },
  inj: { vi: 'Tai nạn lao động / chấn thương rủi ro', en: 'Occupational injury / unintentional injury', ko: '사고 (산업재해 등)' },
  od: { vi: 'Ngộ độc thuốc / sốc thuốc quá liều', en: 'Accidental drug overdose / poison', ko: '약물 과다복용' },
  mat: { vi: 'Biến chứng sản khoa khi sinh con (tử vong mẹ)', en: 'Maternal childbirth complications', ko: '출산 합병증 (모성 사망)' },
  disa: { vi: 'Nạn nhân thiên tai / thảm họa tự nhiên', en: 'Natural disaster casualty', ko: '자연재해' },
  covid: { vi: 'Bệnh truyền nhiễm đại dịch COVID-19', en: 'COVID-19 pandemic', ko: '코로나19' },
  suic: { vi: 'Tự sát do khủng hoảng tâm lý kéo dài', en: 'Suicide (intentional self-harm)', ko: '자살' }
};

// Hobbies from 1in8b.life
const HOBBY_TRANSLATIONS = {
  sport: { vi: 'Chơi thể thao rèn luyện sức khỏe', en: 'Playing sports', ko: '운동·스포츠', stats: { h: 3, hl: 4, so: 2, sm: 0 } },
  music: { vi: 'Chơi nhạc cụ & ca hát', en: 'Singing & musical instruments', ko: '노래·악기 연주', stats: { h: 4, hl: 0, so: 2, sm: 1 } },
  dance: { vi: 'Học khiêu vũ & nhảy múa', en: 'Dancing', ko: '춤', stats: { h: 4, hl: 2, so: 2, sm: 0 } },
  screen: { vi: 'Xem phim và chương trình truyền hình', en: 'Watching movies & TV series', ko: '영화·드라마 보기', stats: { h: 3, hl: -1, so: 0, sm: 0 } },
  sns: { vi: 'Lướt mạng xã hội trên điện thoại thông minh', en: 'Browsing social media', ko: '스마트폰·SNS', stats: { h: 2, hl: -1, so: 2, sm: 0 } },
  games: { vi: 'Chơi trò chơi điện tử (video games)', en: 'Video gaming', ko: '비디오 게임', stats: { h: 4, hl: -1, so: 1, sm: 1 } },
  reading: { vi: 'Đọc sách bồi dưỡng tri thức', en: 'Reading books', ko: '독서', stats: { h: 2, hl: 0, so: 0, sm: 4 } },
  faith: { vi: 'Tham gia sinh hoạt tôn giáo & tín ngưỡng', en: 'Religious community gatherings', ko: '종교 모임', stats: { h: 3, hl: 0, so: 4, sm: 0 } },
  fishing: { vi: 'Câu cá thư giãn', en: 'Recreational fishing', ko: '낚시', stats: { h: 3, hl: 1, so: 1, sm: 0 } },
  cooking: { vi: 'Nấu ăn & khám phá ẩm thực', en: 'Cooking & culinary arts', ko: '요리', stats: { h: 3, hl: 1, so: 2, sm: 1 } },
  garden: { vi: 'Trồng cây & chăm sóc hoa vườn nhà', en: 'Gardening & plant care', ko: '텃밭 가꾸기', stats: { h: 3, hl: 2, so: 0, sm: 0 } },
  hiking: { vi: 'Đi bộ đường dài & leo núi ngắm cảnh', en: 'Hiking & scenic walks', ko: '등산·산책', stats: { h: 3, hl: 3, so: 1, sm: 0 } },
  travel: { vi: 'Du lịch khám phá thế giới', en: 'Traveling & backpacking', ko: '여행', stats: { h: 5, hl: 0, so: 1, sm: 2 } },
  board: { vi: 'Chơi cờ tướng, cờ vua, board game', en: 'Board games (Chess, Go, Carrom)', ko: '보드게임·체스·바둑', stats: { h: 3, hl: 0, so: 3, sm: 1 } },
  crafts: { vi: 'Đan len & làm đồ thủ công mỹ nghệ', en: 'Handicrafts & knitting', ko: '수공예·뜨개질', stats: { h: 3, hl: 0, so: 1, sm: 1 } },
  art: { vi: 'Vẽ tranh & hội họa', en: 'Drawing & painting', ko: '그림 그리기', stats: { h: 3, hl: 0, so: 1, sm: 2 } },
  drama: { vi: 'Tham gia kịch nghệ & diễn xuất', en: 'Theater acting & drama', ko: '연극·연기', stats: { h: 4, hl: 0, so: 3, sm: 1 } },
  photo: { vi: 'Chụp ảnh nghệ thuật', en: 'Photography', ko: '사진', stats: { h: 3, hl: 1, so: 1, sm: 1 } },
  gym: { vi: 'Tập gym & thể hình', en: 'Gym & fitness training', ko: '헬스·피트니스', stats: { h: 2, hl: 5, so: 0, sm: 0 } },
  karaoke: { vi: 'Hát karaoke cùng bạn bè', en: 'Karaoke singing with friends', ko: '노래방', stats: { h: 4, hl: 0, so: 3, sm: 0 } }
};

// National holidays and festivals from 1in8b.life
const FESTIVALS_BY_COUNTRY = {
  VNM: { vi: 'Tết Nguyên Đán', en: 'Tet (Lunar New Year)', ko: '뗏(설)' },
  CHN: { vi: 'Tết Xuân Tiết', en: 'Chunjie (Spring Festival)', ko: '춘절' },
  KOR: { vi: 'Tết Seollal', en: 'Seollal (Korean Lunar New Year)', ko: '설날' },
  JPN: { vi: 'Tết Oshogatsu', en: 'Oshogatsu (New Year Festival)', ko: '오쇼가쓰(정월)' },
  THA: { vi: 'Lễ hội té nước Songkran', en: 'Songkran Water Festival', ko: '송끄란' },
  LAO: { vi: 'Lễ hội năm mới Pi Mai', en: 'Boun Pi Mai (Lao New Year)', ko: '삐마이(새해)' },
  KHM: { vi: 'Lễ hội Chaul Chnam Thmey', en: 'Chaul Chnam Thmey', ko: '쫄츠남(새해)' },
  MMR: { vi: 'Lễ hội té nước Thingyan', en: 'Thingyan Water Festival', ko: '띤잔(물 축제)' },
  IND: { vi: 'Lễ hội ánh sáng Diwali', en: 'Diwali (Festival of Lights)', ko: '디왈리' },
  NPL: { vi: 'Đại lễ Dashain', en: 'Dashain Festival', ko: '다사인' },
  IRN: { vi: 'Tết năm mới Nowruz', en: 'Nowruz (Persian New Year)', ko: '노루즈' },
  AFG: { vi: 'Tết Nowruz', en: 'Nowruz', ko: '노루즈' },
  MNG: { vi: 'Lễ hội Tsagaan Sar', en: 'Tsagaan Sar (White Moon Festival)', ko: '차강사르' },
  ETH: { vi: 'Đại lễ Timkat', en: 'Timkat Epiphany Festival', ko: '팀캇' }
};

// Read source content.md to get WORLD data if available
const contentFile = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\a456d222-211c-47bc-a623-1348ba3b5a29\\.system_generated\\steps\\241\\content.md';
let worldData = null;

try {
  const content = fs.readFileSync(contentFile, 'utf8');
  const worldMatch = content.match(/const WORLD = (\{[\s\S]*?\});/);
  if (worldMatch) {
    worldData = JSON.parse(worldMatch[1]);
    console.log('Successfully extracted WORLD coordinates for', Object.keys(worldData.at || {}).length, 'countries.');
  }
} catch (e) {
  console.error('Failed reading world data:', e);
}

const outDir = path.resolve('src/data');

fs.writeFileSync(path.join(outDir, 'jobs.json'), JSON.stringify(JOB_TRANSLATIONS, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'causes.json'), JSON.stringify(CAUSE_TRANSLATIONS, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'hobbies.json'), JSON.stringify(HOBBY_TRANSLATIONS, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'festivals.json'), JSON.stringify(FESTIVALS_BY_COUNTRY, null, 2), 'utf8');

if (worldData) {
  fs.writeFileSync(path.join(outDir, 'world.json'), JSON.stringify(worldData, null, 2), 'utf8');
}

console.log('All additional datasets scraped and written successfully to src/data!');

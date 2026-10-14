import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));
const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const evStart = js.indexOf('const EVENTS = [');
const evEnd = js.indexOf('const EVMAP =', evStart);
const eventsCode = js.slice(evStart, evEnd);

function matchTranslation(str) {
  if (!str) return '';
  if (i18n[str]) return i18n[str];
  const keyWith1 = str.replace(/\$\{[^}]+\}/g, '\u0001');
  if (i18n[keyWith1]) return i18n[keyWith1];
  const trimmed = keyWith1.trim();
  if (i18n[trimmed]) return i18n[trimmed];
  return '';
}

// Clean string of template variables for cleaner display
function cleanTemplate(str) {
  return str
    .replace(/\$\{iga\([^)]+\)\}/g, '')
    .replace(/\$\{eun\([^)]+\)\}/g, '')
    .replace(/\$\{ul\([^)]+\)\}/g, '')
    .replace(/\$\{ro\([^)]+\)\}/g, '')
    .replace(/\$\{[^}]+\}/g, '...')
    .replace(/\{0\}/g, '...')
    .replace(/\{1\}/g, '...')
    .replace(/\{2\}/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

// Map of manual Vietnamese translations for high quality
const VI_TRANSLATIONS = {
  vax: {
    vi: 'Bạn đã được tiêm phòng đầy đủ các mũi vắc-xin cơ bản (DTP và sởi).',
    fact: 'Năm 2023, 84% trẻ sơ sinh trên toàn cầu đã hoàn thành đủ 3 liều vắc-xin DTP (WHO/UNICEF).'
  },
  steps: {
    vi: 'Bạn chập chững bước những bước đi đầu tiên. Cả nhà reo hò vỗ tay mừng rỡ.'
  },
  word: {
    vi: 'Bạn cất tiếng bập bẹ gọi tiếng đầu đời: "Mẹ ơi".'
  },
  kidsick: {
    vi: 'Bạn bị ốm sốt tiêu chảy vài ngày, nhưng sau khi được đưa đi khám đã nhanh chóng khỏi bệnh.',
    fact: 'Năm 2023, khoảng 76% ca tử vong do sốt rét trên thế giới là trẻ em dưới 5 tuổi (WHO).'
  },
  kid_dream: {
    vi: 'Mỗi khi người lớn hỏi sau này lớn lên thích làm gì, bạn luôn hào hứng kể về ước mơ của mình.'
  },
  fam_books: {
    vi: 'Buổi tối, gia đình quây quần đọc cho bạn nghe những mẩu truyện cổ tích ấm áp.'
  },
  fam_room: {
    vi: 'Khi bước vào tiểu học, bạn được bố mẹ dọn cho một góc phòng riêng.'
  },
  fam_trip: {
    vi: 'Kỳ nghỉ hè, cả gia đình bạn cùng nhau đi du lịch, lưu lại những kỷ niệm tuổi thơ tuyệt đẹp.'
  },
  kid_water: {
    vi: 'Trước lúc bình minh, bạn xách can đi lấy nước ở giếng xa. Con đường gánh nước về nhà lúc nào cũng dài hơn.',
    fact: 'Tại 7/10 hộ gia đình thiếu nước sạch sinh hoạt tại nhà, phụ nữ và trẻ em gái là người phải đi gánh nước (UNICEF).'
  },
  kid_bike: {
    vi: 'Bạn tập đi xe đạp ở khoảng sân trước nhà. Ngã trầy xước vài lần rồi cũng tự mình phóng đi vun vút.'
  },
  kid_rain: {
    vi: 'Mùa mưa đến, con ngõ nhỏ ngập nước như dòng sông nhỏ. Bạn cùng lũ trẻ trong xóm gấp thuyền giấy thả trôi trên dòng nước bùn.'
  },
  kid_snow: {
    vi: 'Ngày tuyết đầu mùa rơi dày đặc, lũ trẻ rủ nhau ra đường ném tuyết và đắp người tuyết cười toe toét.'
  },
  kid_academy: {
    vi: 'Sau giờ tan trường, bạn vội vã đến hai lớp học thêm và chỉ về đến nhà khi trời đã tối mịt.',
    fact: 'Tại các nước Đông Á, hơn 78% học sinh tham gia các lớp học thêm ngoài giờ.'
  },
  kid_lamp: {
    vi: 'Nhà chưa có điện lưới, bạn cặm cụi làm bài tập dưới ánh đèn dầu leo lét.',
    fact: 'Năm 2022, khoảng 685 triệu người trên thế giới vẫn sống trong cảnh không có điện lưới sinh hoạt (World Bank).'
  },
  kid_ball: {
    vi: 'Với quả bóng cuộn bằng túi ni-lông và chân trần, bạn cùng đám bạn đá bóng say mê cho tới khi mặt trời lặn.'
  },
  kid_library: {
    vi: 'Bạn tìm thấy niềm say mê bất tận trong thư viện, ngồi đọc say sưa từng trang sách mở ra chân trời mới.'
  },
  hungry: {
    vi: 'Mất mùa đói kém, gia đình phải chia nhau từng bát cháo loãng cầm hơi qua ngày.',
    fact: 'Khoảng 733 triệu người trên thế giới đối mặt với nạn đói và mất an ninh lương thực nghiêm trọng (FAO 2024).'
  },
  stunt: {
    vi: 'Do thiếu thốn dinh dưỡng từ nhỏ, vóc dáng bạn thấp bé hơn hẳn so với bạn bè đồng trang lứa.',
    fact: 'Gần 150 triệu trẻ em dưới 5 tuổi trên toàn cầu bị suy dinh dưỡng thể thấp còi (UNICEF/WHO).'
  },
  play: {
    vi: 'Sau giờ học, bạn cùng đám bạn bè trong xóm chơi trốn tìm, đuổi bắt rộn rã tiếng cười.'
  },
  kinder: {
    vi: 'Bạn đến lớp mầm non, làm quen với những người bạn đầu tiên và học cách chia sẻ đồ chơi.'
  },
  fest: {
    vi: 'Cả nhà sum vầy đón ngày lễ hội truyền thống lớn nhất trong năm trong không khí ấm áp, linh thiêng.'
  },
  water: {
    vi: 'Nguồn nước sạch được dẫn về tận thôn xóm, gia đình bạn không còn phải đi gánh nước từ xa.'
  },
  nopower: {
    vi: 'Khu vực mất điện diện rộng giữa mùa hè oi ả, cả nhà ra hiên ngồi hóng gió phe phẩy quạt nan.'
  },
  grades: {
    vi: 'Bảng điểm tổng kết cuối năm đạt thành tích xuất sắc, bạn hãnh diện mang về khoe với gia đình.'
  },
  teacher: {
    vi: 'Một người thầy tận tụy đã nhận ra năng khiếu của bạn và hết lòng chỉ bảo, động viên bạn phấn đấu.'
  },
  bully: {
    vi: 'Bạn từng bị một nhóm bạn trêu chọc bắt nạt ở trường, nhưng đã dũng cảm vượt qua nhờ sự ủng hộ của người thân.'
  },
  bff: {
    vi: 'Bạn kết thân với một người bạn tri kỷ, cùng nhau chia sẻ mọi bí mật tuổi học trò.'
  },
  chores: {
    vi: 'Mỗi ngày sau giờ học, bạn chăm chỉ phụ giúp cha mẹ làm việc nhà và chăm sóc các em nhỏ.'
  },
  childwork: {
    vi: 'Hoàn cảnh gia đình khó khăn, bạn phải sớm đi làm thuê phụ giúp trang trải bữa ăn hàng ngày.',
    fact: 'Khoảng 160 triệu trẻ em trên thế giới tham gia lao động trẻ em, nhiều em phải làm việc trong điều kiện độc hại (ILO).'
  },
  net: {
    vi: 'Gia đình bạn lần đầu tiên kết nối Internet tại nhà, mở ra cả thế giới thông tin trước màn hình.'
  },
  crush: {
    vi: 'Trái tim bạn xao xuyến trước một ánh mắt nụ cười thời áo trắng, mối tình đầu ngập ngừng chưa dám ngỏ.'
  },
  exam: {
    vi: 'Bạn trải qua kỳ thi tuyển sinh căng thẳng tột độ sau những tháng ngày miệt mài đèn sách thâu đêm.'
  },
  teenjob: {
    vi: 'Bạn nhận công việc làm thêm đầu tiên thời học sinh, cầm trên tay những đồng tiền mồ hôi nước mắt do chính mình làm ra.'
  },
  hithome: {
    vi: 'Cha mẹ có những lúc nóng giận nghiêm khắc, nhưng bạn hiểu đó là nỗi lo toan vất vả mưu sinh đời thường.'
  },
  sibling: {
    vi: 'Anh chị em trong nhà đôi lúc có cãi vã tị nạnh, nhưng khi gặp khó khăn luôn bảo bọc yêu thương nhau.'
  },
  scam: {
    vi: 'Bạn từng suýt bị lừa đảo trên mạng, nhưng may mắn tỉnh táo nhận ra và không mất mát tài sản.'
  },
  volunteer: {
    vi: 'Bạn tham gia một chuyến đi tình nguyện giúp đỡ bà con vùng khó khăn, cảm thấy cuộc đời thêm phần ý nghĩa.'
  },
  graying: {
    vi: 'Nhìn vào gương, bạn nhận ra những sợi tóc hoa râm đầu tiên trên mái đầu, dấu ấn của thời gian và trải nghiệm.'
  },
  anniv: {
    vi: 'Kỷ niệm ngày cưới đầm ấm bên người bạn đời tri kỷ, cùng nhìn lại quãng đường dài đã đồng cam cộng khổ.'
  },
  redevelop: {
    vi: 'Khu phố gắn bó từ thuở ấu thơ nay được quy hoạch nâng cấp khang trang, gợi nhiều hoài niệm sâu lắng.'
  },
  kidcall: {
    vi: 'Con cái gọi điện về hỏi thăm sức khỏe, nghe tiếng cười nói của các cháu làm lòng bạn ấm áp vô ngần.'
  },
  kindhelp: {
    vi: 'Một người qua đường xa lạ đã nhiệt tình giúp đỡ bạn lúc gặp sự cố bất ngờ giữa phố đông.'
  }
};

const idMatches = [...eventsCode.matchAll(/(?:^|\n)\s*\{\s*id:\s*['"]([a-zA-Z0-9_]+)['"]/g)];
const allEvents = [];

for (let i = 0; i < idMatches.length; i++) {
  const m = idMatches[i];
  const nextIdx = i + 1 < idMatches.length ? idMatches[i + 1].index : eventsCode.length;
  const chunk = eventsCode.slice(m.index, nextIdx);
  const id = m[1];

  const ageMatch = chunk.match(/a:\s*\[(\d+),\s*(\d+)\]/);
  const minAge = ageMatch ? parseInt(ageMatch[1], 10) : 0;
  const maxAge = ageMatch ? parseInt(ageMatch[2], 10) : 100;

  const wMatch = chunk.match(/w:\s*([0-9.]+)/);
  const weight = wMatch ? parseFloat(wMatch[1]) : 1;

  const rawTemplates = [...chunk.matchAll(/L`([\s\S]*?)`/g)].map(t => t[1]);
  const mainTemplate = rawTemplates[0] || '';
  const factTemplate = rawTemplates.find(t => t.match(/(?:WHO|UNICEF|World Bank|ILO|UNESCO|OECD|Lancet|Gallup|Pew|통계청|연구|조사|20\d\d년|\d+%)/i) && t.length > 30) || '';

  const ko = mainTemplate;
  const en = matchTranslation(mainTemplate) || cleanTemplate(mainTemplate);
  const factKo = factTemplate;
  const factEn = matchTranslation(factTemplate) || cleanTemplate(factTemplate);

  const viCustom = VI_TRANSLATIONS[id];
  const vi = viCustom?.vi || (en ? en : ko);
  const factVi = viCustom?.fact || (factEn ? factEn : factKo);

  // Assign category based on age
  let cat = 'general';
  if (maxAge <= 4) cat = 'infant';
  else if (maxAge <= 12) cat = 'childhood';
  else if (maxAge <= 19) cat = 'youth';
  else if (minAge >= 60) cat = 'elder';
  else if (minAge >= 20) cat = 'adulthood';

  // Extract stat effects if any
  const statEffects = {};
  const effMatch = chunk.match(/eff\(\s*\{([^}]+)\}\s*\)/);
  if (effMatch) {
    const pairs = effMatch[1].split(',');
    for (const p of pairs) {
      const kv = p.split(':').map(s => s.trim());
      if (kv.length === 2) {
        const k = kv[0];
        const v = parseInt(kv[1], 10);
        if (k === 'hl') statEffects.health = v;
        if (k === 'h') statEffects.happiness = v;
        if (k === 'sm') statEffects.smarts = v;
        if (k === 'so') statEffects.social = v;
      }
    }
  }

  allEvents.push({
    id,
    minAge,
    maxAge,
    weight,
    cat,
    statEffects,
    text: {
      vi,
      en: cleanTemplate(en),
      ko: cleanTemplate(ko)
    },
    fact: factKo ? {
      vi: factVi,
      en: cleanTemplate(factEn),
      ko: cleanTemplate(factKo)
    } : null
  });
}

fs.writeFileSync('src/data/events.json', JSON.stringify(allEvents, null, 2), 'utf8');
console.log(`Successfully extracted and saved all ${allEvents.length} events to src/data/events.json!`);

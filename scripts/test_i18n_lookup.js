import fs from 'fs';

const i18nSource = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));

const testStrings = [
  '기본 예방접종(DTP·홍역)을 받았습니다.',
  '첫 걸음마를 뗐습니다. 온 가족이 박수를 쳤습니다.',
  '초등학생이 되자 내 방이 생겼습니다.',
  '방학에 가족과 함께 여행을 다녀왔습니다.',
  '해 뜨기 전, 물통을 들고 먼 우물까지 물을 길으러 다녀왔습니다. 돌아오는 길은 늘 더 멀게 느껴졌습니다.',
  '아파트 앞 공터에서 처음 자전거를 배웠습니다. 몇 번 넘어진 끝에 혼자 달렸습니다.'
];

for (const s of testStrings) {
  const en = i18nSource[s];
  console.log('KO:', s);
  console.log('EN:', en || '[NOT FOUND]');
  console.log('---');
}

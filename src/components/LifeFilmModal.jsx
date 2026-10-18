import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight, Film, Heart } from 'lucide-react';
import { getCountryName } from '../i18n';
import { sound } from '../engine/soundSynth';
import { getLifeArchetype } from './DeathSummary';

export default function LifeFilmModal({ isOpen, onClose, life, lang = 'vi' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen || !life) return null;

  const country = life.country || { id: life.countryId, ko: life.countryKo, le: 73 };
  const countryName = getCountryName(country.id, lang, country.ko);
  const archetype = getLifeArchetype(life);
  const birthYear = life.birthYear || 2024;
  const deathAge = life.yearsLived || 0;
  const deathYear = birthYear + deathAge;

  // Build 5-6 thematic slides from the character's life story
  const slides = [
    // Slide 1: Inception & Heritage
    {
      title: { vi: '1. Cất Tiếng Khóc Chào Đời', en: '1. The Beginning of a Life', ko: '1. 생의 첫 울음' },
      era: `${birthYear}`,
      icon: '👶',
      tag: { vi: 'Khởi đầu', en: 'Birth', ko: '탄생' },
      headline: `${life.name?.full || life.name}`,
      subline: `${countryName} (${country.id}) · ${life.urban ? 'Đô thị' : 'Làng quê'}`,
      description: {
        vi: `Năm ${birthYear}, giữa hơn 8 tỷ sinh linh trên Trái Đất, bạn cất tiếng khóc chào đời tại ${countryName}. Mẹ bạn (${life.family?.mom?.name || 'Mẹ'}) và cha bạn (${life.family?.dad?.name || 'Cha'}) đã ôm bạn vào lòng với niềm hy vọng bao la.`,
        en: `In the year ${birthYear}, among over 8 billion souls on Earth, you were born in ${countryName}. Your mother and father held you close with boundless hope.`,
        ko: `${birthYear}년, 80억 인류의 한 사람으로 ${countryName}에서 태어났습니다. 부모님은 벅찬 감동으로 새 생명을 품에 안았습니다.`
      },
      detail: life.culture ? `🍲 Món ăn truyền thống: ${life.culture.dish?.[lang] || life.culture.dish?.vi || ''} · 🏮 Lễ hội: ${life.culture.festival?.[lang] || life.culture.festival?.vi || ''}` : null
    },

    // Slide 2: Childhood & Roots
    {
      title: { vi: '2. Năm Tháng Tuổi Thơ', en: '2. Childhood & Roots', ko: '2. 어린 시절의 기억' },
      era: `${birthYear + Math.min(6, Math.floor(deathAge * 0.2))}`,
      icon: '🎒',
      tag: { vi: 'Tuổi thơ', en: 'Childhood', ko: '유년기' },
      headline: deathAge <= 5 ? 'Những ngày tháng ngắn ngủi nhưng đong đầy yêu thương' : 'Tiếng cười trên những con đường làng & trang sách đầu tiên',
      subline: `Sức khỏe: ${life.stats?.health || 80}% · Hạnh phúc: ${life.stats?.happiness || 75}%`,
      description: {
        vi: deathAge <= 5
          ? `Mặc dù sinh linh bé nhỏ chỉ ở lại trần thế trong thoáng chốc (${deathAge} tuổi), từng nụ cười và ánh mắt thơ ngây đã khắc sâu vĩnh viễn trong trái tim người thân.`
          : `Những bước chân lon ton đến trường, những trò chơi dân gian dưới bóng cây đầu làng và hơi ấm của gia đình đã nuôi dưỡng tâm hồn bạn lớn khôn.`,
        en: deathAge <= 5
          ? `Though your time in this world was brief (${deathAge} years), your sweet smile left an everlasting impression of love.`
          : `Walking to school, playing beneath the trees, and feeling the warmth of home shaped your earliest memories.`,
        ko: deathAge <= 5
          ? `세상에 머문 시간은 ${deathAge}년으로 짧았지만, 순수한 미소는 가족의 마음속에 영원한 빛으로 남았습니다.`
          : `마을 어귀를 뛰놀고 배움을 시작하며, 따뜻한 가족의 품에서 세상의 온기를 배웠습니다.`
      },
      detail: life.culture?.sport ? `⚽ Thể thao quê hương: ${life.culture.sport?.[lang] || life.culture.sport?.vi}` : null
    },

    // Slide 3: Prime & Passion
    {
      title: { vi: '3. Tuổi Trẻ & Dấu Ấn Đời Người', en: '3. Youth & Meaningful Footsteps', ko: '3. 청춘과 생의 궤적' },
      era: `${birthYear + Math.min(25, Math.floor(deathAge * 0.5))}`,
      icon: '💼',
      tag: { vi: 'Thăng trầm', en: 'Journey', ko: '여정' },
      headline: `Nghề nghiệp: ${life.job || 'Lao động tự do'}`,
      subline: `Học vấn: Cấp ${life.stats?.educationLevel || 2} · Tài sản tích lũy: $${(life.stats?.wealth || life.wealth || 0).toLocaleString()}`,
      description: {
        vi: `Bước vào tuổi trưởng thành, bạn tự mình chọn lối đi giữa dòng đời. Mỗi giọt mồ hôi cống hiến cho công việc và những quyết định sinh tử đã tôi luyện nên một con người kiên định.`,
        en: `Stepping into adulthood, you forged your own path. Honest work and hard decisions shaped you into a resilient spirit.`,
        ko: `성인이 되어 세상의 파도 속에서 자신만의 길을 걸었습니다. 성실한 땀방울로 삶의 터전을 닦았습니다.`
      },
      detail: life.family?.partner ? `💍 Đã tìm thấy một nửa yêu thương cùng chia sẻ ngọt bùi.` : `🧭 Độc hành tự tại qua những thăng trầm cuộc đời.`
    },

    // Slide 4: Family & Bonds
    {
      title: { vi: '4. Mái Ấm & Tình Thân', en: '4. Family & Cherished Bonds', ko: '4. 사랑과 가문의 울타리' },
      era: `${birthYear + Math.min(45, Math.floor(deathAge * 0.75))}`,
      icon: '🏡',
      tag: { vi: 'Gia đình', en: 'Family', ko: '가족' },
      headline: `${(life.family?.children?.length || life.family?.childrenCount || 0)} người con · ${(life.family?.grandchildrenCount || 0)} người cháu`,
      subline: `Chỉ số xã hội: ${life.stats?.social || 70}% · Điểm hạnh phúc: ${life.stats?.happiness || 75}%`,
      description: {
        vi: (life.family?.children?.length || life.family?.childrenCount || 0) > 0
          ? `Tiếng cười của con trẻ và đàn cháu ríu rít sum vầy là gia tài quý giá nhất mà không vàng bạc nào sánh bằng. Bạn đã hoàn thành sứ mệnh truyền lửa cho thế hệ kế tiếp.`
          : `Dù mái ấm riêng vắng bóng con trẻ, tấm lòng nhân hậu và những mối thâm tình với bạn bè, lối xóm đã biến cuộc đời bạn thành một bến đỗ bình yên.`,
        en: (life.family?.children?.length || life.family?.childrenCount || 0) > 0
          ? `The laughter of children and grandchildren filled your home with warmth — the richest legacy one could leave behind.`
          : `Surrounded by faithful friends and community, your life was rich in kindness and shared memories.`,
        ko: (life.family?.children?.length || life.family?.childrenCount || 0) > 0
          ? `자녀와 손주들의 웃음소리가 집안 가득 울려 퍼졌습니다. 다음 세대에 사랑을 전한 가장 값진 유산이었습니다.`
          : `이웃과 벗들에게 베푼 따뜻한 온기로 삶의 모든 순간을 충만하게 채웠습니다.`
      },
      detail: `🏮 Cội nguồn: ${life.culture?.ethnicity?.[lang] || life.culture?.ethnicity?.vi || countryName}`
    },

    // Slide 5: The Sunset & Passing
    {
      title: { vi: '5. Hoàng Hôn & Lời Tạm Biệt', en: '5. The Sunset & Departure', ko: '5. 석양과 영원한 안식' },
      era: `${deathYear}`,
      icon: '🕊️',
      tag: { vi: 'Tạ thế', en: 'Departure', ko: '영면' },
      headline: `Hưởng thọ: ${deathAge} tuổi (${birthYear} - ${deathYear})`,
      subline: `Kỳ vọng sống quốc gia: ${country.le} tuổi · Nguyên nhân: ${life.causeOfDeath ? (life.causeOfDeath[lang] || life.causeOfDeath.vi) : 'Tuổi già thanh thản'}`,
      description: {
        vi: `Mọi cuộc hành trình dẫu dài hay ngắn rồi cũng đến lúc khép lại. Năm ${deathYear}, bạn nhẹ nhàng trút hơi thở cuối cùng, để lại trần gian những kỷ niệm đẹp đẽ và sự tiếc thương của muôn người.`,
        en: `Every human journey, long or short, comes to its resting place. In ${deathYear}, you took your final breath, returning to the vast universe.`,
        ko: `${deathYear}년, 길고도 짧았던 지상에서의 여정을 마치고 평온하게 영면에 들었습니다.`
      },
      detail: `Nguyên nhân mất: ${life.causeOfDeath ? (life.causeOfDeath[lang] || life.causeOfDeath.vi) : 'Tuổi già'}`
    },

    // Slide 6: Eternal Archetype & Epitaph
    {
      title: { vi: '6. Tượng Đài Ký Ức Vĩnh Cửu', en: '6. Eternal Remembrance', ko: '6. 영원한 기억의 방' },
      era: `Vĩnh Hằng`,
      icon: archetype.icon,
      tag: { vi: 'Bất tử', en: 'Legacy', ko: '유산' },
      headline: `${archetype.icon} ${archetype.title[lang] || archetype.title.vi}`,
      subline: archetype.desc[lang] || archetype.desc.vi,
      description: {
        vi: `Bạn là 1 trong 8 tỷ sinh mệnh độc nhất vô nhị. Cuộc đời bạn là một khúc ca bình dị nhưng hào hùng của nhân loại. Tên tuổi và dấu ấn của bạn sẽ luôn được tôn kính tại Ngôi Nhà Tiền Kiếp.`,
        en: `You were 1 in 8 billion — unique and irreplaceable. Your story is woven forever into the tapestry of humankind.`,
        ko: `당신은 80억 인류 가운데 단 하나뿐인 고귀한 존재였습니다. 이 삶의 모든 순간은 우주의 아름다운 기억이 되었습니다.`
      },
      detail: `🕯️ Thắp nến tri ân người đã đi qua cuộc đời này.`
    }
  ];

  const totalSlides = slides.length;
  const slide = slides[currentSlide];

  // Auto-play timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSlides]);

  // Audio soundtrack management
  useEffect(() => {
    if (!isMuted) {
      sound.startFilmBgm();
    } else {
      sound.stopFilmBgm();
    }
    return () => {
      sound.stopFilmBgm();
    };
  }, [isMuted]);

  const handleToggleAudio = () => {
    setIsMuted(!isMuted);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleReplay = () => {
    setCurrentSlide(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#1C1F26] text-[#E6E8EE] border border-[#3B4252] rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col relative animate-pop">
        
        {/* Vintage Film Sprocket Strip (Top) */}
        <div className="bg-[#121418] px-4 py-2 border-b border-[#2E3440] flex justify-between items-center select-none">
          <div className="flex gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3.5 h-2.5 bg-[#2E3440] rounded-xs border border-white/10" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D8DEE9]/70 tracking-widest uppercase">
            <Film className="w-3.5 h-3.5 text-[#EBCB8B]" />
            <span>35mm Life Film · {currentSlide + 1}/{totalSlides}</span>
          </div>
          <button
            onClick={() => {
              sound.stopFilmBgm();
              onClose();
            }}
            className="p-1 rounded text-[#D8DEE9]/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Film Projection Frame */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[360px] bg-gradient-to-b from-[#242933] to-[#1C1F26] relative overflow-hidden">
          {/* Subtle Vintage Sepia/Glow Overlay */}
          <div className="absolute inset-0 bg-radial from-[#D08770]/5 via-transparent to-black/40 pointer-events-none" />

          {/* Top Tag & Era */}
          <div className="flex justify-between items-center relative z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBCB8B]/20 text-[#EBCB8B] font-mono text-xs font-semibold uppercase tracking-wider border border-[#EBCB8B]/30">
              {slide.tag[lang] || slide.tag.vi}
            </span>
            <span className="font-mono text-sm font-bold text-[#88C0D0] tracking-wider">
              {slide.era}
            </span>
          </div>

          {/* Main Slide Content */}
          <div className="my-auto py-4 relative z-10 text-center space-y-3">
            <div className="text-5xl animate-bounce-short select-none">
              {slide.icon}
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
              {slide.headline}
            </h3>

            <p className="font-mono text-xs text-[#81A1C1] font-semibold">
              {slide.subline}
            </p>

            <p className="text-sm sm:text-base text-[#D8DEE9] leading-relaxed max-w-lg mx-auto font-sans font-light">
              {slide.description[lang] || slide.description.vi}
            </p>

            {slide.detail && (
              <div className="pt-2 text-xs font-mono text-[#A3BE8C] bg-white/5 py-1.5 px-3 rounded-md inline-block max-w-md mx-auto">
                {slide.detail}
              </div>
            )}
          </div>

          {/* Slide Progress Dots */}
          <div className="flex justify-center items-center gap-2 pt-2 relative z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-[#EBCB8B]'
                    : 'w-2 bg-[#4C566A] hover:bg-[#D8DEE9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Vintage Film Sprocket Strip (Bottom Controls) */}
        <div className="bg-[#121418] px-5 py-3 border-t border-[#2E3440] flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title={isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#A3BE8C]" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-2 rounded bg-white/10 hover:bg-white/20 text-[#D8DEE9] transition cursor-pointer"
              title="Xem lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleAudio}
              className="p-2 rounded bg-white/10 hover:bg-white/20 text-[#D8DEE9] transition cursor-pointer"
              title={isMuted ? 'Bật âm thanh hoài niệm' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#BF616A]" /> : <Volume2 className="w-4 h-4 text-[#EBCB8B]" />}
            </button>
          </div>

          {/* Step Back & Forward */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded bg-white/5 hover:bg-white/15 text-[#D8DEE9] transition cursor-pointer"
              title="Phim trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-[#4C566A] px-1">|</span>
            <button
              onClick={handleNext}
              className="p-2 rounded bg-white/5 hover:bg-white/15 text-[#D8DEE9] transition cursor-pointer"
              title="Phim kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

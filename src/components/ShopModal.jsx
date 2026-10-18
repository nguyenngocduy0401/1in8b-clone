import React from 'react';
import SHOP_ITEMS from '../data/shop.json';

export default function ShopModal({ isOpen, onClose, state, onBuyItem, lang = 'en' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border-2 border-rule max-w-lg w-full rounded-xl shadow-2xl p-6 relative overflow-hidden font-serif">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-rule">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {lang === 'vi' ? 'Hoạt động & Trải nghiệm cuộc sống' : lang === 'ko' ? '인생 활동 & 상점' : 'Life Experiences & Shop'}
            </h2>
            <p className="text-xs text-ink/60">
              {lang === 'vi' ? 'Dành dụm tích lũy cho những kỷ niệm và sức khỏe' : lang === 'ko' ? '소중한 추억과 건강을 위한 선택' : 'Invest in meaningful memories and well-being'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink/50 hover:text-ink text-xl font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Wealth Balance */}
        <div className="bg-paper p-3 rounded-lg border border-rule/70 mb-4 flex items-center justify-between">
          <span className="text-xs text-ink/70">
            {lang === 'vi' ? 'Tài sản tích lũy hiện tại:' : lang === 'ko' ? '현재 보유 자산:' : 'Current Savings:'}
          </span>
          <span className="text-sm font-bold text-accent font-mono">
            ${state.stats.wealth.toLocaleString()}
          </span>
        </div>

        {/* Item List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => {
            const cost = Math.abs(item.effects.wealth || 200);
            const canAfford = state.stats.wealth >= cost;
            const ageEligible = state.yearsLived >= item.minAge;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  canAfford && ageEligible
                    ? 'border-rule hover:border-accent bg-card'
                    : 'border-rule/40 opacity-60 bg-paper/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink truncate">
                      {item.name[lang] || item.name.en || item.name.vi}
                    </span>
                    {!ageEligible && (
                      <span className="text-[10px] bg-ink/10 text-ink/60 px-1.5 py-0.5 rounded">
                        {lang === 'vi' ? `Từ ${item.minAge} tuổi` : `${item.minAge}+`}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink/70 mt-0.5">
                    {item.desc[lang] || item.desc.en || item.desc.vi}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent whitespace-nowrap">
                    -${cost}
                  </span>
                  <button
                    disabled={!canAfford || !ageEligible}
                    onClick={() => onBuyItem(item)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      canAfford && ageEligible
                        ? 'bg-accent text-white hover:bg-accent/90 active:scale-95'
                        : 'bg-ink/10 text-ink/40 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'vi' ? 'Chọn' : lang === 'ko' ? '선택' : 'Pick'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

export const Hero = () => {
  return (
    <header className="py-22 border-b border-line relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <div>
          <div className="text-[12.5px] tracking-[0.12em] uppercase color-hush font-semibold mb-4.5 flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-hush text-hush">
            มาร์เก็ตเพลสเสียง ASMR
          </div>
          <h1 className="font-display font-medium text-4xl lg:text-6xl leading-[1.04] tracking-tight">
            เสียงที่สร้างมา<br />ให้<em className="italic text-tingle">ใกล้ชิด</em>
          </h1>
          <p className="mt-5.5 text-base text-ink-muted leading-relaxed max-w-[440px]">
            ฟังก่อนซื้อทุกชิ้น จากครีเอเตอร์ VTuber นักพากย์ และนักแสดงเสียงที่คุณเลือกเองได้ ดาวน์โหลดเก็บไว้ฟังได้ตลอดไป
          </p>
          <div className="flex gap-3.5 mt-8.5 items-center">
            <a href="#explore" className="px-6 py-3.5 text-sm font-semibold rounded-full bg-tingle text-[#1A1418] hover:bg-[#f0967c] transition">
              เริ่มฟังเลย
            </a>
            <a href="/seller/apply" className="text-xs text-ink-dim border-b border-ink-dim pb-0.5 hover:text-ink-muted hover:border-ink-muted transition">
              เปิดร้านขายเสียงของคุณ →
            </a>
          </div>

          {/* Signature Whisperline Visualizer */}
          <div className="flex items-end gap-[3px] h-[28px] mt-9.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-[2px] animate-wave ${i % 3 === 0 ? 'bg-tingle' : 'bg-ink-dim'}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>

        {/* Hero Preview Panel */}
        <div className="bg-gradient-to-br from-panel to-panel-2 border border-line rounded-[20px] p-7 relative">
          <span className="absolute top-11 left-11 text-[11px] uppercase tracking-wider bg-void/70 px-2.5 py-1 rounded-full text-ink-muted z-10">
            กำลังเล่น
          </span>
          <div className="aspect-square rounded-e-xl mb-4.5 bg-void border border-line relative overflow-hidden flex items-center justify-center">
            <div className="absolute w-[60px] h-[60px] border border-tingle rounded-full opacity-35 animate-pulse-ring" />
            <button className="w-13 h-13 rounded-full bg-tingle flex items-center justify-center z-10 hover:scale-105 transition">
              <span className="text-void text-xl pl-0.5">▶</span>
            </button>
          </div>
          <div className="font-display italic text-lg">ห้องสมุดยามฝนตก · Rain Study Room</div>
          <div className="text-xs text-ink-muted mt-1">โดย mizu_asmr — 42 นาที · Study / Rain</div>
        </div>
      </div>
    </header>
  );
};
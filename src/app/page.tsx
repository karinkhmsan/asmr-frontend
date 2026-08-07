'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { api } from '../lib/api';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImageUrl: string;
  previewAudioUrl: string;
  language?: string;
  seller?: {
    storeName: string;
  };
  category?: {
    name: string;
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* CSS Styles สกัดจาก wisp-home.html เป๊ะๆ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --bg-void: #17151B;
          --bg-panel: #201D26;
          --bg-panel-2: #2A2632;
          --ink: #F1ECE6;
          --ink-muted: #9C96A8;
          --ink-dim: #645E70;
          --line: #322E3B;
          --accent-tingle: #E98368;
          --accent-tingle-soft: rgba(233, 131, 104, 0.14);
          --accent-hush: #8C93E8;
          --accent-hush-soft: rgba(140, 147, 232, 0.14);
          --radius: 14px;
        }

        .display { font-family: 'Fraunces', serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }

        /* Animation คลื่นเสียง whisperline */
        .whisperline { display: flex; align-items: flex-end; gap: 3px; height: 28px; margin-top: 38px; }
        .whisperline span { width: 3px; background: var(--ink-dim); border-radius: 2px; animation: wave 2.4s ease-in-out infinite; }
        .whisperline span:nth-child(3n) { background: var(--accent-tingle); }
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }

        /* Animation วงแหวนกระจาย rings */
        .cover .rings span { 
          position: absolute; 
          top: 50%;
          left: 50%;
          border: 1px solid var(--accent-tingle); 
          border-radius: 50%; 
          opacity: 0.35; 
          animation: pulse 3s ease-out infinite; 
        }
        .cover .rings span:nth-child(1) { width: 60px; height: 60px; margin-top: -30px; margin-left: -30px; animation-delay: 0s; }
        .cover .rings span:nth-child(2) { width: 60px; height: 60px; margin-top: -30px; margin-left: -30px; animation-delay: 1s; }
        .cover .rings span:nth-child(3) { width: 60px; height: 60px; margin-top: -30px; margin-left: -30px; animation-delay: 2s; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(4.2); opacity: 0; }
        }
      `}</style>

      <main className="min-h-screen bg-[var(--bg-void)] text-[var(--ink)] font-['Inter',sans-serif] pb-20 selection:bg-[var(--accent-tingle)] selection:text-[#17151B]">
        <Navbar />

        {/* Hero Section */}
        <header className="py-[88px] border-b border-[var(--line)] relative overflow-hidden">
          <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-[56px] items-center">
            
            {/* ข้อความฝั่งซ้าย */}
            <div className="lg:col-span-7">
              <div className="text-[12.5px] tracking-[0.12em] uppercase text-[var(--accent-hush)] font-semibold mb-[18px] flex items-center gap-2">
                <span className="w-[16px] h-[1px] bg-[var(--accent-hush)]"></span>
                มาร์เก็ตเพลสเสียง ASMR
              </div>

              <h1 className="display font-normal text-[clamp(38px,5.4vw,62px)] leading-[1.04] tracking-[-0.02em]">
                เสียงที่สร้างมา<br />ให้<em className="italic text-[var(--accent-tingle)]">ใกล้ชิด</em>
              </h1>

              <p className="mt-[22px] text-[16.5px] leading-[1.65] text-[var(--ink-muted)] max-w-[440px]">
                ฟังก่อนซื้อทุกชิ้น จากครีเอเตอร์ VTuber นักพากย์ และนักแสดงเสียงที่คุณเลือกเองได้ ดาวน์โหลดเก็บไว้ฟังได้ตลอดไป
              </p>

              <div className="flex gap-[14px] mt-[34px] items-center">
                <a href="#explore" className="px-[26px] py-[14px] text-[14.5px] font-semibold rounded-[100px] bg-[var(--accent-tingle)] text-[#1A1418] hover:bg-[#f0967c] transition">
                  เริ่มฟังเลย
                </a>
                <Link href="/creator/upload" className="text-[13.5px] text-[var(--ink-dim)] border-b border-[var(--ink-dim)] hover:text-[var(--ink-muted)] hover:border-[var(--ink-muted)] pb-[2px] transition">
                  เปิดร้านขายเสียงของคุณ →
                </Link>
              </div>

              {/* คลื่นขยับได้ 40 เส้น (Whisper Line) */}
              <div className="whisperline">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.06}s` }}></span>
                ))}
              </div>
            </div>

            {/* กล่องเครื่องเล่นเสียงฝั่งขวา (Hero Panel) */}
            <div className="lg:col-span-5 relative p-[28px] rounded-[20px] overflow-hidden border border-[var(--line)] bg-[linear-gradient(160deg,var(--bg-panel),var(--bg-panel-2))]">
              <span className="absolute top-[28px] left-[28px] text-[11px] uppercase tracking-[0.08em] bg-[#17151B]/70 px-[10px] py-[5px] rounded-[100px] text-[var(--ink-muted)] z-20">
                กำลังเล่น
              </span>

              <div 
                className="cover relative w-full aspect-square rounded-[14px] mb-[18px] flex items-center justify-center overflow-hidden border border-[var(--line)]"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, var(--accent-hush-soft), transparent 60%), radial-gradient(circle at 75% 80%, var(--accent-tingle-soft), transparent 55%), var(--bg-void)'
                }}
              >
                <div className="rings absolute inset-0 pointer-events-none">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                
                <div className="w-[52px] h-[52px] rounded-full bg-[var(--accent-tingle)] flex items-center justify-center z-10 cursor-pointer shadow-lg hover:scale-105 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#17151B">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="display italic text-[18px]">ห้องสมุดยามฝนตก · Rain Study Room</div>
              <div className="text-[12.5px] text-[var(--ink-muted)] mt-[4px]">โดย mizu_asmr — 42 นาที · Study / Rain</div>
            </div>

          </div>
        </header>

        {/* Category Strip */}
        <div className="py-[28px] border-b border-[var(--line)] overflow-x-auto whitespace-nowrap">
          <div className="max-w-[1180px] mx-auto px-8 flex gap-[10px]">
            {['ทั้งหมด', 'Ear Cleaning', 'Whisper', 'Roleplay', 'Sleep', 'Relax', 'Rain', 'Fantasy', 'Horror', 'Healing', 'Study', 'Gaming'].map((cat, index) => (
              <div
                key={cat}
                className={`text-[13px] px-[16px] py-[8px] rounded-[100px] border cursor-pointer transition ${
                  index === 0
                    ? 'bg-[var(--ink)] text-[var(--bg-void)] border-[var(--ink)] font-semibold'
                    : 'border-[var(--line)] text-[var(--ink-muted)] hover:border-[#4a4556] hover:text-[var(--ink)]'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid เชื่อม Backend */}
        <section id="explore" className="py-[56px]">
          <div className="max-w-[1180px] mx-auto px-8">
            <div className="flex justify-between items-baseline mb-[28px]">
              <h2 className="display text-[26px] font-medium tracking-[-0.01em]">ผลงานในระบบ</h2>
              <Link href="/cart" className="text-[13px] text-[var(--ink-muted)] border-b border-[var(--line)] hover:text-[var(--accent-tingle)] hover:border-[var(--accent-tingle)]">
                ไปที่ตะกร้าสินค้า
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-[var(--ink-muted)] text-xs">กำลังโหลดผลงาน...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-[var(--ink-muted)] text-xs">ยังไม่มีผลงานในระบบ</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden hover:border-[#4a4556] hover:-translate-y-[3px] transition duration-200 block"
                  >
                    <div className="aspect-[4/3] relative flex items-end p-[14px] bg-[linear-gradient(150deg,#3a2b3a,#241f2c)]">
                      <img
                        src={p.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      <span className="relative z-10 text-[10.5px] uppercase tracking-[0.06em] bg-[#17151B]/55 backdrop-blur-[4px] px-[9px] py-[4px] rounded-[100px] text-[var(--ink-muted)]">
                        {p.category?.name || 'ASMR'}
                      </span>
                    </div>

                    <div className="p-[16px]">
                      <div className="text-[14.5px] font-semibold leading-[1.3] mb-[5px] line-clamp-1">{p.title}</div>
                      <div className="text-[12.5px] text-[var(--ink-muted)] mb-[10px]">{p.seller?.storeName || 'Creator'}</div>
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="mono text-[var(--accent-tingle)] font-medium">฿{Number(p.price).toLocaleString()}</span>
                        <span className="text-[var(--ink-dim)]">★ 5.0</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
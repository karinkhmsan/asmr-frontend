'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  // ซิงค์จำนวนสินค้าในตะกร้าจาก localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* โลโก้ Wisp ตามสไตล์เดิม */}
        <Link href="/" className="text-2xl font-black italic tracking-wider text-ink flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-tingle animate-pulse"></span>
          wisp
        </Link>

        {/* เมนูนำทางตรงกลาง ซิงค์ Class สีตาม HTML เดิม */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <Link href="/" className="text-ink-muted hover:text-ink transition">
            สำรวจ
          </Link>
          <Link href="/library" className="text-ink-muted hover:text-ink transition">
            คลังของฉัน
          </Link>
          <Link href="/creator/dashboard" className="text-ink-muted hover:text-tingle transition">
            🎨 Creator Center
          </Link>
        </nav>

        {/* ฝั่งขวา: ตะกร้าสินค้า + ปุ่มสร้างผลงาน */}
        <div className="flex items-center gap-4">
          
          {/* ปุ่มตะกร้าพร้อม Badge แจ้งเตือนสี Tingle */}
          <Link
            href="/cart"
            className="relative p-2 bg-panel border border-line rounded-xl hover:border-tingle/50 transition text-ink"
            title="ตะกร้าสินค้า"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-tingle text-[#1A1418] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ปุ่มอัปโหลดผลงานใหม่ */}
          <Link
            href="/creator/upload"
            className="text-xs font-bold bg-tingle text-[#1A1418] px-3.5 py-2 rounded-xl hover:bg-[#f0967c] transition shadow-md"
          >
            + วางขายเสียง
          </Link>

          {/* ปุ่มออกจากระบบ */}
          <Link
            href="/login"
            className="text-xs border border-line bg-panel hover:bg-void text-ink-muted hover:text-ink px-3 py-2 rounded-xl transition"
          >
            ออกจากระบบ
          </Link>
        </div>

      </div>
    </header>
  );
}
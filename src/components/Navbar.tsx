'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserData {
  displayName?: string;
  role?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    setIsClient(true);
    checkUser();

    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    router.push('/login');
    router.refresh();
  };

  // เช็กว่าเป็น ครีเอเตอร์/ผู้ขาย หรือไม่
  const isSeller = userData?.role === 'SELLER';

  return (
    <nav className="border-b border-line bg-panel/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif italic font-medium text-2xl flex items-center gap-2 text-ink">
          <span className="w-2 h-2 rounded-full bg-tingle" />
          wisp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <Link href="/" className="text-ink-muted hover:text-ink transition">
            หน้าแรก
          </Link>

          {isClient && userData && (
            <>
              <Link href="/library" className="text-ink-muted hover:text-tingle transition">
                🎧 คลังของฉัน
              </Link>
              <Link href="/cart" className="text-ink-muted hover:text-tingle transition">
                🛒 ตะกร้าสินค้า
              </Link>
              
              {/* 🔴 โชว์ปุ่มนี้เฉพาะเมื่อ role === 'SELLER' เท่านั้น */}
              {isSeller && (
                <Link href="/creator/dashboard" className="text-tingle hover:underline flex items-center gap-1">
                  📊 แดชบอร์ดร้านค้า
                </Link>
              )}
            </>
          )}

          {/* User Profile */}
          {isClient && userData ? (
            <div className="flex items-center gap-3 pl-4 border-l border-line">
              <span className="text-ink">
                🎧 {userData.displayName || 'ผู้ใช้งาน'}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-line">
              <Link href="/login" className="text-ink-muted hover:text-ink transition">
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="bg-tingle text-[#1A1418] px-3.5 py-1.5 rounded-full font-bold hover:bg-[#f0967c] transition"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
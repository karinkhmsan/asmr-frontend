'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

interface Product {
  id: string;
  title: string;
  coverImageUrl: string;
  audioFileUrl: string;
  previewAudioUrl: string;
  seller?: {
    storeName: string;
  };
}

export default function LibraryPage() {
  const router = useRouter();
  const [purchasedItems, setPurchasedItems] = useState<Product[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. เช็กการเข้าสู่ระบบ
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    // 2. ดึงคลังเสียงที่สั่งซื้อแล้วจาก API (Fallback ด้วย LocalStorage เผื่อกรณีทดสอบ Offline)
    const fetchLibrary = async () => {
      try {
        const res = await api.get('/orders/my-library');
        setPurchasedItems(res.data);
      } catch (err) {
        console.error('Failed to load library from API, fallback to local storage:', err);
        const localItems = JSON.parse(localStorage.getItem('purchased_items') || '[]');
        setPurchasedItems(localItems);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [router]);

  const handleDownload = (url: string, title: string) => {
    if (!url) {
      alert('ไม่พบไฟล์เสียงสำหรับดาวน์โหลด');
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.mp3`;
    a.target = '_blank';
    a.click();
  };

  return (
    <main className="min-h-screen bg-[#17151B] text-[#F1ECE6] font-sans pb-32">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-8 pt-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-wider text-[#8C93E8] font-semibold mb-1">
            My Audio Collection
          </div>
          <h1 className="font-serif text-3xl font-medium">คลังผลงานของฉัน</h1>
          <p className="text-xs text-[#9C96A8] mt-1">ผลงาน ASMR ทั้งหมดที่คุณเป็นเจ้าของ ดาวน์โหลดและฟังได้ตลอดเวลา</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-[#9C96A8]">กำลังโหลดคลังผลงานของคุณ...</div>
        ) : purchasedItems.length === 0 ? (
          <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-12 text-center">
            <p className="text-xs text-[#9C96A8] mb-4">คุณยังไม่มีผลงานเสียงในคลังส่วนตัว</p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#E98368] text-[#1A1418] font-semibold text-xs hover:bg-[#f0967c] transition inline-block"
            >
              เลือกชมผลงานในมาร์เก็ตเพลส
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-5 flex flex-col justify-between hover:border-[#4a4556] transition"
              >
                <div>
                  <div className="aspect-[16/9] relative rounded-lg overflow-hidden border border-[#322E3B] mb-4 bg-[#17151B]">
                    <img
                      src={item.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-xs text-[#8C93E8] font-semibold mb-1 uppercase tracking-wider">
                    {item.seller?.storeName || 'ASMR Creator'}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#F1ECE6] mb-3 line-clamp-1">{item.title}</h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#322E3B]">
                  <button
                    onClick={() => setCurrentlyPlaying(item)}
                    className="w-full py-2.5 rounded-xl bg-[#2A2632] hover:bg-[#322E3B] text-[#F1ECE6] font-semibold text-xs flex items-center justify-center gap-2 border border-[#322E3B] transition"
                  >
                    ▶ เล่นเสียงในเว็บ
                  </button>

                  <button
                    onClick={() => handleDownload(item.audioFileUrl || item.previewAudioUrl, item.title)}
                    className="w-full py-2.5 rounded-xl bg-[#E98368] text-[#1A1418] font-semibold text-xs hover:bg-[#f0967c] transition flex items-center justify-center gap-2"
                  >
                    ⬇ ดาวน์โหลดไฟล์เสียงเต็ม (MP3)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Audio Player Bar */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#201D26]/95 backdrop-blur-md border-t border-[#322E3B] p-4 z-50">
          <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentlyPlaying.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
                alt={currentlyPlaying.title}
                className="w-12 h-12 object-cover rounded-lg border border-[#322E3B]"
              />
              <div>
                <div className="text-sm font-medium text-[#F1ECE6] line-clamp-1">{currentlyPlaying.title}</div>
                <div className="text-xs text-[#9C96A8]">{currentlyPlaying.seller?.storeName || 'Creator'}</div>
              </div>
            </div>

            <audio controls autoPlay className="w-full sm:w-96 h-9">
              <source src={currentlyPlaying.audioFileUrl || currentlyPlaying.previewAudioUrl} type="audio/mpeg" />
            </audio>

            <button
              onClick={() => setCurrentlyPlaying(null)}
              className="text-xs text-[#9C96A8] hover:text-[#F1ECE6] px-2 py-1"
            >
              ✕ ปิด
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
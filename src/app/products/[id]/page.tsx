'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '../../../components/Navbar';
import { api } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImageUrl: string;
  previewAudioUrl: string;
  sellerId?: string;
  seller?: {
    id?: string;
    storeName: string;
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. ดึงข้อมูล User จาก LocalStorage เพื่อเช็กสิทธิ์เจ้าของ
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }

    // 2. ดึงข้อมูลผลงาน
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${resolvedParams.id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  // เช็กว่าผู้ใช้งานปัจจุบันเป็นเจ้าของผลงานชิ้นนี้หรือไม่
  const isOwner =
    currentUser &&
    product &&
    (currentUser.sellerProfile?.id === product.sellerId ||
      currentUser.sellerId === product.sellerId ||
      currentUser.id === product.seller?.id);

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isExist = existingCart.some((item: Product) => item.id === product.id);

    if (!isExist) {
      existingCart.push(product);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('storage'));
      alert('เพิ่มลงตะกร้าเรียบร้อยแล้ว!');
    } else {
      alert('สินค้านี้อยู่ในตะกร้าแล้วครับ');
    }

    router.push('/cart');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-void text-ink">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-20 text-center text-ink-muted text-xs">
          กำลังโหลดข้อมูล...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-void text-ink">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-20 text-center text-ink-muted text-xs">
          ไม่พบข้อมูลผลงานชิ้นนี้
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void text-ink pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* บันเนอร์แจ้งเตือนถ้าเป็นเจ้าของผลงาน */}
        {isOwner && (
          <div className="mb-6 p-4 bg-panel border border-tingle/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="text-xs font-semibold text-ink">คุณเป็นเจ้าของผลงานชิ้นนี้</div>
                <div className="text-[11px] text-ink-muted">
                  สามารถดูสถิติและรายได้ของผลงานนี้ได้ที่หน้าแดชบอร์ด
                </div>
              </div>
            </div>
            <Link
              href="/creator/dashboard"
              className="px-4 py-2 bg-tingle text-[#1A1418] text-xs font-bold rounded-xl hover:bg-[#f0967c] transition text-center whitespace-nowrap"
            >
              📊 ไปยังแดชบอร์ดร้านค้า
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-panel border border-line p-6 rounded-2xl shadow-xl">
          {/* รูปปก */}
          <div>
            <img
              src={
                product.coverImageUrl ||
                'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'
              }
              alt={product.title}
              className="w-full h-80 object-cover rounded-xl border border-line"
            />
          </div>

          {/* รายละเอียด */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs text-tingle font-semibold uppercase tracking-wider mb-1">
                {product.seller?.storeName || 'ASMR Creator'}
              </p>
              <h1 className="text-2xl font-bold text-ink mb-3">{product.title}</h1>
              <p className="text-xs text-ink-muted mb-6 whitespace-pre-line leading-relaxed">
                {product.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
              </p>

              {/* ตัวเล่นตัวอย่างเสียง */}
              <div className="mb-6 bg-void p-3 rounded-xl border border-line">
                <p className="text-[10px] text-ink-muted mb-1.5 font-semibold">
                  🔊 ตัวอย่างเสียง (Audio Preview)
                </p>
                {product.previewAudioUrl ? (
                  <audio controls className="w-full h-8">
                    <source src={product.previewAudioUrl} type="audio/mpeg" />
                    บราวเซอร์ของคุณไม่รองรับการเล่นไฟล์เสียงนี้
                  </audio>
                ) : (
                  <p className="text-[11px] text-ink-muted italic">
                    ไม่มีไฟล์เสียงตัวอย่างสำหรับผลงานนี้
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-tingle mb-4 font-mono">
                ฿{Number(product.price).toLocaleString()}
              </div>

              {!isOwner ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-tingle text-[#1A1418] font-bold py-3 rounded-xl hover:bg-[#f0967c] transition text-sm shadow-md"
                >
                  🛒 เพิ่มลงตะกร้าสินค้า
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-void text-ink-muted border border-line font-semibold py-3 rounded-xl text-xs cursor-not-allowed"
                >
                  (คุณเป็นเจ้าของผลงานนี้)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
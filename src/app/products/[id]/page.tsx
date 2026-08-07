'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '../../../components/Navbar';
import { api } from '../../../lib/api';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImageUrl: string;
  previewAudioUrl: string;
  seller?: {
    storeName: string;
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleAddToCart = () => {
    if (!product) return;

    // ดึงตะกร้าเดิมจาก localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // เช็กว่ามีสินค้านี้ในตะกร้าหรือยัง
    const isExist = existingCart.some((item: Product) => item.id === product.id);
    
    if (!isExist) {
      existingCart.push(product);
      localStorage.setItem('cart', JSON.stringify(existingCart));
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
        <div className="max-w-4xl mx-auto px-6 pt-20 text-center text-ink-muted">กำลังโหลดข้อมูล...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-void text-ink">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-20 text-center text-ink-muted">ไม่พบข้อมูลผลงานชิ้นนี้</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void text-ink pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-panel border border-line p-6 rounded-2xl">
          {/* รูปปก */}
          <div>
            <img
              src={product.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
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
              <p className="text-xs text-ink-muted mb-6 whitespace-pre-line">{product.description}</p>

              {/* ตัวเล่นตัวอย่างเสียง */}
              {product.previewAudioUrl && (
                <div className="mb-6 bg-void p-3 rounded-xl border border-line">
                  <p className="text-[10px] text-ink-muted mb-1 font-semibold">🔊 ตัวอย่างเสียง (Audio Preview)</p>
                  <audio controls className="w-full h-8">
                    <source src={product.previewAudioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>

            <div>
              <div className="text-2xl font-bold text-tingle mb-4">฿{Number(product.price).toLocaleString()}</div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-tingle text-[#1A1418] font-bold py-3 rounded-xl hover:bg-[#f0967c] transition"
              >
                🛒 เพิ่มลงตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
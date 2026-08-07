'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  price: number;
  coverImageUrl: string;
  seller?: {
    storeName: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูลตะกร้าจาก localStorage
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert('ชำระเงินสำเร็จ! เพิ่มผลงานเข้าคลังเรียบร้อยแล้ว');
    // เคลียร์ตะกร้า
    localStorage.removeItem('cart');
    setCartItems([]);
    // ย้ายไปหน้าคลังผลงาน
    router.push('/library');
  };

  const total = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <main className="min-h-screen bg-void text-ink pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <h1 className="text-2xl font-bold text-tingle mb-6">ตะกร้าสินค้า / ชำระเงิน</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-panel border border-line rounded-2xl">
            <p className="text-ink-muted text-sm mb-4">ยังไม่มีรายการสินค้าในตะกร้า</p>
            <Link href="/" className="text-xs bg-tingle text-[#1A1418] font-bold px-4 py-2.5 rounded-xl inline-block">
              เลือกชมผลงาน
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* รายการสินค้า */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-panel border border-line p-4 rounded-2xl flex items-center gap-4">
                  <img
                    src={item.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl border border-line"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-tingle font-semibold uppercase">
                      {item.seller?.storeName || 'ASMR Creator'}
                    </p>
                    <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                    <p className="text-sm font-semibold text-tingle mt-1">฿{Number(item.price).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>

            {/* สรุปยอดเงิน */}
            <div className="bg-panel border border-line p-6 rounded-2xl h-fit">
              <h2 className="text-lg font-bold mb-4 border-b border-line pb-3">สรุปคำสั่งซื้อ</h2>
              <div className="flex justify-between text-sm text-ink-muted mb-2">
                <span>ราคารวม</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted mb-6">
                <span>ค่าธรรมเนียม</span>
                <span>฿0</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink border-t border-line pt-3 mb-6">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-tingle">฿{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-tingle text-[#1A1418] font-bold py-3.5 rounded-xl hover:bg-[#f0967c] transition"
              >
                ยืนยันสั่งซื้อและชำระเงิน
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  coverImageUrl: string;
  previewAudioUrl?: string;
  audioFileUrl?: string;
  seller?: { storeName: string };
}

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <main className="min-h-screen bg-[#17151B] text-[#F1ECE6] font-sans pb-20">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-8 pt-10">
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-wider text-[#8C93E8] font-semibold mb-1">
            Shopping Cart
          </div>
          <h1 className="font-serif text-3xl font-medium">ตะกร้าสินค้า</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-12 text-center">
            <p className="text-xs text-[#9C96A8] mb-4">ไม่มีสินค้าในตะกร้าของคุณ</p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#E98368] text-[#1A1418] font-semibold text-xs hover:bg-[#f0967c] transition inline-block"
            >
              เลือกซื้อเสียง ASMR
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* รายการสินค้า */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.coverImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border border-[#322E3B]"
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-[#F1ECE6]">{item.title}</h3>
                      <p className="text-xs text-[#9C96A8]">{item.seller?.storeName || 'ASMR Creator'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[#E98368] font-semibold text-sm">
                      ฿{Number(item.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* สรุปยอดเงิน */}
            <div className="lg:col-span-4">
              <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-6 sticky top-24">
                <h2 className="font-serif text-xl font-medium mb-4">สรุปคำสั่งซื้อ</h2>
                
                <div className="space-y-3 text-xs border-b border-[#322E3B] pb-4 mb-4">
                  <div className="flex justify-between text-[#9C96A8]">
                    <span>จำนวนสินค้า</span>
                    <span>{cart.length} ชิ้น</span>
                  </div>
                  <div className="flex justify-between text-[#F1ECE6] text-sm font-semibold pt-2">
                    <span>ราคารวมสุทธิ</span>
                    <span className="font-mono text-[#E98368]">฿{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3 rounded-full bg-[#E98368] text-[#1A1418] font-semibold text-xs hover:bg-[#f0967c] transition block text-center shadow-lg"
                >
                  ไปที่หน้าชำระเงิน →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
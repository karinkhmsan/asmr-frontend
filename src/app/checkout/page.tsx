'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  price: number;
  coverImageUrl: string;
  previewAudioUrl?: string;
  audioFileUrl?: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePay = () => {
    setProcessing(true);

    setTimeout(() => {
      // 1. ดึงของที่มีใน library เดิม
      const existingLibrary = JSON.parse(localStorage.getItem('purchased_items') || '[]');
      
      // 2. รวมสินค้าใหม่เข้าไป
      const updatedLibrary = [...existingLibrary, ...cart];
      localStorage.setItem('purchased_items', JSON.stringify(updatedLibrary));

      // 3. เคลียร์ตะกร้าสินค้า
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('storage'));

      setProcessing(false);
      alert('ชำระเงินสำเร็จ! เพิ่มผลงานเข้าคลังของคุณเรียบร้อยแล้ว');
      router.push('/library');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#17151B] text-[#F1ECE6] font-sans pb-20">
      <Navbar />

      <div className="max-w-[600px] mx-auto px-6 pt-10">
        <div className="bg-[#201D26] border border-[#322E3B] rounded-[20px] p-8 text-center shadow-xl">
          <div className="text-xs uppercase tracking-wider text-[#8C93E8] font-semibold mb-1">
            PromptPay QR Payment
          </div>
          <h1 className="font-serif text-2xl font-medium mb-6">สแกนชำระเงิน</h1>

          {/* PromptPay QR Code Mock */}
          <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-md">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PromptPay-Wisp-${total}`}
              alt="PromptPay QR Code"
              className="w-44 h-44"
            />
          </div>

          <div className="bg-[#17151B] border border-[#322E3B] rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-xs text-[#9C96A8] mb-2">
              <span>จำนวนสินค้า:</span>
              <span className="text-[#F1ECE6]">{cart.length} รายการ</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>ยอดชำระสุทธิ:</span>
              <span className="font-mono text-[#E98368]">฿{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing || cart.length === 0}
            className="w-full py-3.5 rounded-full bg-[#E98368] text-[#1A1418] font-semibold text-sm hover:bg-[#f0967c] disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-[#1A1418] border-t-transparent rounded-full animate-spin"></span>
                กำลังยืนยันการชำระเงิน...
              </>
            ) : (
              'จำลองการชำระเงินสำเร็จ (Pay Now)'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
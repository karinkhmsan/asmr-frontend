'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface Product {
  id: string;
  title: string;
  price: number;
  salesCount?: number;
  feePerSale?: number;
  netPerSale?: number;
  status: string;
  coverImageUrl: string;
  category?: { name: string };
}

interface DashboardData {
  stats: {
    grossRevenue?: number;
    totalPlatformFee?: number;
    netRevenue?: number;
    totalRevenue?: number;
    totalSalesCount?: number;
    totalProducts?: number;
    commissionRate?: number;
  };
  products: Product[];
}

export default function CreatorDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. เช็กสิทธิ์การเข้าใช้งาน
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
  }, [router]);

  // 2. ดึงข้อมูล Dashboard จาก API
  const fetchDashboard = async () => {
    try {
      // 🔴 ปรับ Endpoint ให้ตรงกับ Backend (/products/dashboard)
      const res = await api.get('/products/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load creator dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`คุณต้องการลบผลงาน "${title}" ใช่หรือไม่?`)) return;

    try {
      await api.delete(`/products/${id}`);
      alert('ลบผลงานเรียบร้อยแล้ว');
      fetchDashboard();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('เกิดข้อผิดพลาดในการลบผลงาน');
    }
  };

  return (
    <main className="min-h-screen bg-[#17151B] text-[#F1ECE6] font-sans pb-20">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-8 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-wider text-[#8C93E8] font-semibold mb-1">
              Creator Center
            </div>
            <h1 className="font-serif text-3xl font-medium">แผงควบคุมร้านค้า</h1>
          </div>
          <Link
            href="/creator/upload"
            className="px-5 py-2.5 rounded-full bg-[#E98368] text-[#1A1418] font-semibold text-xs hover:bg-[#f0967c] transition self-start md:self-auto"
          >
            + วางขายเสียงใหม่
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#9C96A8] text-xs">กำลังโหลดข้อมูล...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-5">
                <div className="text-xs text-[#9C96A8] mb-1 font-medium">ยอดขายรวมก่อนหัก</div>
                <div className="font-mono text-2xl text-[#F1ECE6] font-semibold">
                  ฿{(data?.stats?.grossRevenue ?? data?.stats?.totalRevenue ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-5">
                <div className="text-xs text-[#9C96A8] mb-1 font-medium">
                  ค่าบริการระบบ ({data?.stats?.commissionRate ?? 5}%)
                </div>
                <div className="font-mono text-2xl text-red-400 font-semibold">
                  -฿{(data?.stats?.totalPlatformFee ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-5">
                <div className="text-xs text-[#9C96A8] mb-1 font-medium">รายได้สุทธิที่ได้รับจริง</div>
                <div className="font-mono text-2xl text-[#E98368] font-semibold">
                  ฿{(data?.stats?.netRevenue ?? data?.stats?.totalRevenue ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] p-5">
                <div className="text-xs text-[#9C96A8] mb-1 font-medium">ผลงานทั้งหมด</div>
                <div className="font-mono text-2xl text-[#8C93E8] font-semibold">
                  {(data?.stats?.totalProducts ?? data?.products?.length ?? 0).toLocaleString()}{' '}
                  <span className="text-xs text-[#645E70] font-sans">ชิ้น</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#201D26] border border-[#322E3B] rounded-[14px] overflow-hidden">
              <div className="p-6 border-b border-[#322E3B] flex justify-between items-center">
                <h2 className="font-serif text-xl font-medium">รายการผลงานและส่วนแบ่งรายได้</h2>
                <span className="text-xs text-[#9C96A8]">
                  หักค่าบริการแพลตฟอร์ม {data?.stats?.commissionRate ?? 5}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2A2632] text-[#9C96A8] border-b border-[#322E3B] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">ผลงาน</th>
                      <th className="py-3.5 px-6">ราคาตั้งขาย</th>
                      <th className="py-3.5 px-6 text-red-400">
                        หักค่าบริการ ({data?.stats?.commissionRate ?? 5}%)
                      </th>
                      <th className="py-3.5 px-6 text-[#E98368]">รายได้สุทธิต่อชิ้น</th>
                      <th className="py-3.5 px-6 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#322E3B]">
                    {(data?.products ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#9C96A8]">
                          ยังไม่มีผลงานที่วางขาย
                        </td>
                      </tr>
                    ) : (
                      (data?.products ?? []).map((p) => {
                        const price = Number(p.price || 0);
                        const fee = p.feePerSale ?? price * 0.05;
                        const net = p.netPerSale ?? price - fee;

                        return (
                          <tr key={p.id} className="hover:bg-[#2A2632]/50 transition">
                            <td className="py-4 px-6 flex items-center gap-3">
                              <img
                                src={
                                  p.coverImageUrl ||
                                  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600'
                                }
                                alt={p.title}
                                className="w-10 h-10 object-cover rounded-lg border border-[#322E3B]"
                              />
                              <span className="font-medium text-[#F1ECE6] text-sm line-clamp-1">
                                {p.title}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-[#F1ECE6] font-medium">
                              ฿{price.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 font-mono text-red-400 font-medium">
                              -฿{fee.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 font-mono text-[#E98368] font-bold text-sm">
                              ฿{net.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleDelete(p.id, p.title)}
                                className="text-red-400 hover:text-red-300 font-medium transition"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'BUYER',
    storeName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation ความยาวรหัสผ่านเบื้องต้น
    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel border border-line rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link href="/" className="font-display italic font-medium text-3xl inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tingle" />
            wisp
          </Link>
          <h1 className="text-xl font-semibold mt-4">สร้างบัญชีผู้ใช้ใหม่</h1>
          <p className="text-xs text-ink-muted mt-1">เริ่มต้นฟังและสนับสนุนครีเอเตอร์ ASMR</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">ชื่อที่ใช้แสดง (Display Name)</label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">อีเมล</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          {/* เลือกบทบาทผู้ใช้งาน */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">ประเภทบัญชี</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                className={`py-2 rounded-xl border text-xs font-medium transition ${
                  formData.role === 'BUYER'
                    ? 'bg-tingle/10 border-tingle text-tingle'
                    : 'bg-void border-line text-ink-muted'
                }`}
              >
                🎧 ผู้ฟัง (Buyer)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'SELLER' })}
                className={`py-2 rounded-xl border text-xs font-medium transition ${
                  formData.role === 'SELLER'
                    ? 'bg-tingle/10 border-tingle text-tingle'
                    : 'bg-void border-line text-ink-muted'
                }`}
              >
                🎙️ ครีเอเตอร์ (Seller)
              </button>
            </div>
          </div>

          {/* กรอกชื่อร้านหากเลือกเป็น SELLER */}
          {formData.role === 'SELLER' && (
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">ชื่อร้านค้า / แชนเนล</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
                placeholder="เช่น Wisp Sound Studio"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tingle text-[#1A1418] font-semibold py-3 rounded-xl hover:bg-[#f0967c] transition disabled:opacity-50 mt-2"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-muted mt-6">
          มีบัญชีอยู่แล้วใช่ไหม?{' '}
          <Link href="/login" className="text-tingle hover:underline font-medium">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
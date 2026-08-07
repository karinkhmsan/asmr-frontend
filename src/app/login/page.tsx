'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      
      // บันทึก token และ user ให้ตรงกับที่ Backend ส่งมา
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
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
          <h1 className="text-xl font-semibold mt-4">ยินดีต้อนรับกลับมา</h1>
          <p className="text-xs text-ink-muted mt-1">เข้าสู่ระบบเพื่อฟังเสียง ASMR ที่คุณชื่นชอบ</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tingle text-[#1A1418] font-semibold py-3 rounded-xl hover:bg-[#f0967c] transition disabled:opacity-50 mt-2"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-muted mt-6">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <Link href="/register" className="text-tingle hover:underline font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
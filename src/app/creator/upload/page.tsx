'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { api } from '../../../lib/api';

interface Category {
  id: string;
  name: string;
}

export default function UploadProductPage() {
  const router = useRouter();

  // 1. ตรวจสอบสิทธิ์ผู้ใช้งาน (เฉพาะ SELLER)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== 'SELLER') {
      alert('หน้านี้เฉพาะครีเอเตอร์เท่านั้นครับ');
      router.push('/');
    }
  }, [router]);

  // State สำหรับเก็บข้อมูลหมวดหมู่
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    coverImageUrl: '',
    previewAudioUrl: '',
    audioFileUrl: '',
    language: 'TH',
    categoryId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. ดึงข้อมูลหมวดหมู่จาก Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, categoryId: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('กรุณาเลือกหมวดหมู่สินค้า');
      return;
    }

    setLoading(true);

    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
      });
      alert('สร้างผลงาน ASMR สำเร็จ!');
      router.push('/creator/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างผลงาน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-void text-ink pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-10">
        <h1 className="text-2xl font-bold text-tingle mb-2">อัปโหลดผลงาน ASMR ใหม่</h1>
        <p className="text-xs text-ink-muted mb-8">ลงทะเบียนและวาง URL ไฟล์เสียงผลงานของคุณเพื่อวางจำหน่าย</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-panel border border-line p-6 rounded-2xl shadow-xl">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">ชื่อผลงาน</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="เช่น Midnight Rain & Whispering"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">คำอธิบายรายละเอียด</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="ระบุรายละเอียดของเสียง ASMR อุปกรณ์ที่ใช้ หรือบรรยากาศ..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">ราคา (บาท)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">หมวดหมู่</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              >
                {categories.length === 0 ? (
                  <option value="">กำลังโหลดหมวดหมู่...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">ภาษาของเสียง</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              >
                <option value="TH">ภาษาไทย (TH)</option>
                <option value="EN">English (EN)</option>
                <option value="JP">Japanese (JP)</option>
                <option value="NO_VOICE">ไม่มีเสียงพูด (No Voice)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">URL รูปภาพปก (Cover Image URL)</label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">URL ไฟล์เสียงตัวอย่าง (Preview Audio URL)</label>
            <input
              type="url"
              required
              value={formData.previewAudioUrl}
              onChange={(e) => setFormData({ ...formData, previewAudioUrl: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="https://example.com/preview.mp3"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">URL ไฟล์เสียงฉบับเต็ม (Full Audio File URL)</label>
            <input
              type="url"
              required
              value={formData.audioFileUrl}
              onChange={(e) => setFormData({ ...formData, audioFileUrl: e.target.value })}
              className="w-full bg-void border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-tingle transition"
              placeholder="https://example.com/full-audio.mp3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tingle text-[#1A1418] font-semibold py-3.5 rounded-xl hover:bg-[#f0967c] transition disabled:opacity-50 mt-4 shadow-lg"
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : 'เผยแพร่ผลงาน'}
          </button>
        </form>
      </div>
    </main>
  );
}
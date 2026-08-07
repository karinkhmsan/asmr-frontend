'use client';

import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  coverImageUrl?: string;
  seller?: {
    storeName: string;
  };
  [key: string]: any; // รองรับ Prop อื่นๆ จาก mockProducts
}

export function ProductCard(props: ProductCardProps) {
  // รองรับทั้งแบบส่งผ่าน prop 'product' หรือกระจาย props แบบ {...p}
  const id = props.id || props.product?.id;
  const title = props.title || props.product?.title;
  const price = props.price || props.product?.price;
  const coverImageUrl = props.coverImageUrl || props.product?.coverImageUrl;
  const sellerName = props.seller?.storeName || props.product?.seller?.storeName || 'Unknown Creator';

  return (
    <Link
      href={`/products/${id}`}
      className="group bg-panel border border-line rounded-2xl overflow-hidden hover:border-tingle/50 transition duration-300 flex flex-col"
    >
      <div className="aspect-square w-full overflow-hidden bg-void relative">
        <img
          src={coverImageUrl || '/placeholder.png'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[10px] text-tingle font-semibold uppercase tracking-wider mb-1">
            {sellerName}
          </p>
          <h3 className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-tingle transition">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
          <span className="text-xs text-ink-muted">ราคา</span>
          <span className="text-sm font-bold text-tingle">
            ฿{Number(price || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
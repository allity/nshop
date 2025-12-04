import Link from 'next/link';
import type { Product } from '../../types/product';

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <Link href={`/shop/products/${product.pid}`} className="group block h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
                {/* 이미지 영역 - 비율 고정 */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {product.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-1 flex-col px-4 py-3">
                    {/* 상품명: 2줄까지만 보이게 */}
                    <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
                        {product.name}
                    </h3>

                    {/* 가격을 항상 카드 맨 아래쪽에 고정 */}
                    <div className="mt-auto pt-3 text-base font-semibold text-slate-900">
                        {product.price.toLocaleString()}원
                    </div>
                </div>
            </article>
        </Link>
    );
}
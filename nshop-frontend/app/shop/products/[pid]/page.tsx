import { notFound } from 'next/navigation';
import { fetchJson } from '@/app/lib/api';
import type { Product } from '@/app/types/product';

async function getProduct(pid: string): Promise<Product | null> {
    try {
        return await fetchJson<Product>(`/products/${pid}`);
    } catch {
        return null;
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ pid: string }>;
}) {
    const { pid } = await params;

    const product = await getProduct(pid);
    if (!product) notFound();

    return (
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr]">
            {/* 좌측: 상품 이미지 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    {product.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            {/* 우측: 상품 정보 + 액션 */}
            <div className="space-y-6">
                {/* 이름 + 가격 */}
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        {product.name}
                    </h1>
                    <p className="mt-3 text-2xl font-bold text-indigo-600">
                        {product.price.toLocaleString()}원
                    </p>
                </div>

                {/* 추후 옵션/재고 들어갈 자리 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    <p>
                        재고:{' '}
                        <span className="font-semibold">
                            {product.stock > 0 ? `${product.stock}개` : '품절'}
                        </span>
                    </p>
                </div>

                {/* 장바구니 / 구매 버튼 (동작은 나중에 구현) */}
                <div className="flex gap-3">
                    <button className="flex-1 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        장바구니
                    </button>
                    <button className="flex-1 rounded-lg bg-slate-900 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                        바로 구매
                    </button>
                </div>

                {/* 상세 설명 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">
                    <h2 className="mb-2 text-xs font-semibold text-slate-500">
                        상품 설명
                    </h2>
                    <div className="whitespace-pre-wrap">
                        {product.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
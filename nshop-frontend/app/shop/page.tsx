import { fetchJson } from '../lib/api';
import type { Product } from '../types/product';
import ProductCard from './components/ProductCard';

type ProductListResponse = {
    items: Product[],
    total: number,
    page: number,
    limit: number,
}

async function getRecentProducts(): Promise<ProductListResponse> {
    return fetchJson<ProductListResponse>('/products?page=1&limit=8&sort=createdAt');
}

export default async function HomePage() {
    const { items: recentProducts } = await getRecentProducts();

    return (
        <div className="space-y-10">
            {/* 히어로 섹션 */}
            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-10 text-white shadow-sm">
                <h1 className="text-2xl font-semibold md:text-3xl">
                    NShop에 오신 것을 환영합니다 👋
                </h1>
                <p className="mt-2 text-sm text-indigo-100 md:text-base">
                    최신 상품과 인기 상품을 한 곳에서 쉽고 빠르게 만나보세요.
                </p>
            </section>

            {/* 신상품 */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">신상품</h2>
                </div>
                {recentProducts.length === 0 ? (
                    <p className="text-sm text-slate-500">등록된 상품이 없습니다.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                        {recentProducts.map((p) => (
                            <ProductCard key={p.pid} product={p} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
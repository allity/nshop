import { notFound } from 'next/navigation';
import { fetchJson } from '@/app/lib/api';
import ProductCard from '@/app/shop/components/ProductCard';
import type { Product } from '@/app/types/product';
import type { Category } from '@/app/types/category';

type ProductListResponse = {
    items: Product[],
    total: number,
    page: number,
    limit: number,
};

async function getCategory(cid: string): Promise<Category | null> {
    try {
        return await fetchJson<Category>(`/categories/${cid}`);
    } catch {
        return null;
    }
}

async function getProducts(cid: string): Promise<ProductListResponse> {
    return fetchJson<ProductListResponse>(`/products?page=1&limit=20&sort=createdAt&cid=${cid}`);
}

export default async function CategoryPage({ params }: { params: Promise<{ cid: string }> }) {
    const { cid } = await params;

    const category = await getCategory(cid);
    if (!category) notFound();

    const { items } = await getProducts(cid);

    return (
        <div className="space-y-6">
            {/* 제목 */}
            <h1 className="text-xl font-semibold text-slate-900">
                {category.name}
            </h1>

            {/* 상품 리스트 */}
            {items.length === 0 ? (
                <p className="text-sm text-slate-500">
                    이 카테고리에 등록된 상품이 없습니다.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                    {items.map((product) => (
                        <ProductCard key={product.pid} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
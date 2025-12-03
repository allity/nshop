// app/admin/products/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { ProductFormValues } from '../ProductForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function AdminProductCreatePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: ProductFormValues) => {
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    description: values.description,
                    price: values.price,
                    stock: values.stock,
                    thumbnailUrl: values.thumbnailUrl || null,
                    cid: values.cid || null,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Create product failed:', text);
                throw new Error('상품 등록에 실패했습니다.');
            }

            const created = await res.json();
            router.push(`/admin/products/${created.pid}`);
        } catch (e: any) {
            setError(e.message ?? '상품 등록 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품 등록</h2>
                    <p className="text-xs text-slate-500">
                        새 상품을 등록합니다. 필수 정보(상품명, 가격, 재고, 설명)를 입력하세요.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                    목록으로
                </button>
            </div>

            <ProductForm
                mode="create"
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/admin/products')}
            />
        </div>
    );
}

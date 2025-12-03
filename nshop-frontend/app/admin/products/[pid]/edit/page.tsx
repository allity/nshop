'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm, { ProductFormValues } from '../../ProductForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Product = {
    pid: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnailUrl?: string | null;
    createdAt: string;
    cid?: number | null;
};

export default function AdminProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const pid = Number(params?.pid);

    const [loading, setLoading] = useState(true);
    const [initialProduct, setInitialProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pid || Number.isNaN(pid)) {
            setError('잘못된 상품 번호입니다.');
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/${pid}`);
                if (res.status === 404) {
                    setError('해당 상품을 찾을 수 없습니다.');
                    setInitialProduct(null);
                    return;
                }
                if (!res.ok) throw new Error('상품 조회에 실패했습니다.');

                const data: Product = await res.json();
                setInitialProduct(data);
            } catch (e: any) {
                setError(e.message ?? '상품 조회 중 오류 발생');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [pid]);

    const handleSubmit = async (values: ProductFormValues) => {
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/products/${pid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Update failed:', text);
                throw new Error('상품 수정에 실패했습니다.');
            }

            router.push(`/admin/products/${pid}`);
        } catch (e: any) {
            setError(e.message ?? '상품 수정 중 오류 발생');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-slate-500">
                상품 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (!initialProduct) {
        return (
            <div className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">상품 수정</h2>
                <p className="text-sm text-rose-600">
                    {error ?? '상품 정보를 찾을 수 없습니다.'}
                </p>
                <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="rounded-md border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                    목록으로
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품 수정</h2>
                    <p className="text-xs text-slate-500">
                        상품 정보를 수정합니다.
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
                mode="edit"
                submitting={submitting}
                error={error}
                initialValues={{
                    name: initialProduct.name,
                    description: initialProduct.description,
                    price: initialProduct.price,
                    stock: initialProduct.stock,
                    thumbnailUrl: initialProduct.thumbnailUrl ?? '',
                    cid: initialProduct.cid ?? null,
                }}
                onSubmit={handleSubmit}
                onCancel={() => router.push(`/admin/products/${pid}`)}
            />
        </div>
    );
}
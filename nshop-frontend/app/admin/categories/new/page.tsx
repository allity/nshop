'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm, { CategoryFormValues } from '../CategoryForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function AdminCategoryCreatePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: CategoryFormValues) => {
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Create category failed:', text);
                throw new Error('카테고리 등록에 실패했습니다.');
            }
            router.push('/admin/categories');
        } catch (e: any) {
            setError(e.message ?? '카테고리 등록 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품분류 등록</h2>
                    <p className="text-xs text-slate-500">새로운 상품 분류를 등록합니다.</p>
                </div>
                <button
                    type="button"
                    onClick={() => router.push('/admin/categories')}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                    목록으로
                </button>
            </div>

            <CategoryForm
                mode="create"
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/admin/categories')}
            />
        </div>
    );
}
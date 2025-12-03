'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryForm, { CategoryFormValues } from '../../CategoryForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Category = {
    cid: number;
    name: string;
    sortOrder: number;
    createdAt: string;
};

export default function AdminCategoryEditPage() {
    const params = useParams();
    const router = useRouter();
    const cid = Number(params?.cid);

    const [initialCategory, setInitialCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!cid || Number.isNaN(cid)) {
            setError('잘못된 분류 번호입니다.');
            setLoading(false);
            return;
        }

        const fetchCategory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                if (!res.ok) throw new Error('카테고리 조회에 실패했습니다.');
                const data: Category[] = await res.json();
                const found = data.find((c) => c.cid === cid) ?? null;
                if (!found) setError('해당 분류를 찾을 수 없습니다.');
                setInitialCategory(found);
            } catch (e: any) {
                setError(e.message ?? '카테고리 조회 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [cid]);

    const handleSubmit = async (values: CategoryFormValues) => {
        if (!cid || Number.isNaN(cid)) {
            setError('잘못된 분류 번호입니다.');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/categories/${cid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Update category failed:', text);
                throw new Error('카테고리 수정에 실패했습니다.');
            }
            router.push('/admin/categories');
        } catch (e: any) {
            setError(e.message ?? '카테고리 수정 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-slate-500">
                분류 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (!initialCategory) {
        return (
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">상품분류 수정</h2>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/categories')}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                        목록으로
                    </button>
                </div>
                <p className="text-sm text-rose-600">
                    {error ?? '분류 정보를 찾을 수 없습니다.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품분류 수정</h2>
                    <p className="text-xs text-slate-500">상품 분류 정보를 수정합니다.</p>
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
                mode="edit"
                submitting={submitting}
                error={error}
                initialValues={{
                    name: initialCategory.name,
                    sortOrder: initialCategory.sortOrder,
                }}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/admin/categories')}
            />
        </div>
    );
}

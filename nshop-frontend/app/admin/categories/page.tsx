'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Category = {
    cid: number;
    name: string;
    sortOrder: number;
    createdAt: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            console.log(res);
            if (!res.ok) throw new Error('카테고리 목록 조회에 실패했습니다.');
            const data: Category[] = await res.json();
            setCategories(data);
        } catch(e: any) {
            setError(e.message ?? '카테고리 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handleDelete = async (cid: number, name: string) => {
        const ok = window.confirm(`${name} 분류를 정말 삭제할까요?`);
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE_URL}/categories/${cid}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const text = await res.text();
                console.log('Delete category failed:', text);
                alert('카테고리 삭제에 실패했습니다.');
                return;
            }
            await fetchCategories();
        } catch (e) {
            console.error(e);
            alert('카테고리 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품분류 관리</h2>
                    <p className="text-xs text-slate-500">
                        쇼핑몰 상단/좌측에 노출될 상품 분류를 관리합니다.
                    </p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                    + 분류 등록
                </Link>
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                {loading ? (
                    <div className="py-10 text-center text-sm text-slate-500">
                        불러오는 중입니다...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-500">
                        등록된 상품분류가 없습니다.
                    </div>
                ) : (
                    <>
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-3 py-2 text-left font-medium text-slate-600">분류번호</th>
                                    <th className="px-3 py-2 text-left font-medium text-slate-600">분류명</th>
                                    <th className="px-3 py-2 text-right font-medium text-slate-600">노출순서</th>
                                    <th className="px-3 py-2 text-left font-medium text-slate-600">등록일</th>
                                    <th className="px-3 py-2 text-center font-medium text-slate-600">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((c) => (
                                    <tr key={c.cid} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-3 py-2 font-mono text-[11px] text-slate-700">
                                            {c.cid}
                                        </td>
                                        <td className="px-3 py-2 text-slate-800">
                                            {c.name}
                                        </td>
                                        <td className="px-3 py-2 text-right text-slate-800">
                                            {c.sortOrder}
                                        </td>
                                        <td className="px-3 py-2 text-left text-slate-600">
                                            {formatDate(c.createdAt)}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="inline-flex gap-1">
                                                <Link
                                                    href={`/admin/categories/${c.cid}/edit`}
                                                    className="rounded-full border border-indigo-500 px-3 py-1 text-[11px] text-indigo-600 hover:bg-indigo-50"
                                                >
                                                    수정
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(c.cid, c.name)}
                                                    className="rounded-full border border-rose-400 px-3 py-1 text-[11px] text-rose-600 hover:bg-rose-50"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {error && (
                    <p className="mt-2 text-xs text-rose-600">
                        {error}
                    </p>
                )}
            </section>
        </div>
    );
}
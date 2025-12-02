'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Product = {
    pid: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnailUrl?: string | null;
    createdAt: string;
};

export default function AdminProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const pid = Number(params?.pid);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
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
                    setProduct(null);
                    return;
                }
                if (!res.ok) throw new Error('상품 조회에 실패했습니다.');

                const data: Product = await res.json();
                setProduct(data);
            } catch (e: any) {
                setError(e.message ?? '상품 조회 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [pid]);

    const formatDateTime = (iso: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = async () => {
        if (!product) return;

        const ok = window.confirm(`${product.name} 상품을 정말 삭제할까요?`);
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE_URL}/products/${product.pid}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Delete failed:', text);
                alert('상품 삭제에 실패했습니다.');
                return;
            }

            alert('상품이 삭제되었습니다.');
            router.push('/admin/products');
        } catch (e) {
            console.error(e);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-slate-500">
                상품 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">상품 상세</h2>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                        목록으로
                    </button>
                </div>
                <p className="text-sm text-rose-600">
                    {error ?? '상품 정보를 찾을 수 없습니다.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 상단 타이틀 + 액션 버튼 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품 상세</h2>
                    <p className="text-xs text-slate-500">
                        상품 정보를 확인합니다.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                        목록으로
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push(`/admin/products/${product.pid}/edit`)}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                        수정하기
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-full bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* 상세 카드 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6">
                {/* 이미지 영역 */}
                <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                        {product.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={product.thumbnailUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-slate-400">
                                이미지 없음
                            </span>
                        )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                        상품번호: <span className="font-mono">{product.pid}</span>
                    </div>
                </div>

                {/* 정보 영역 */}
                <div className="flex-1 space-y-4">
                    {/* 상단: 이름 / 가격 / 재고 */}
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                        <h3 className="text-base font-semibold text-slate-900">
                            {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-baseline gap-1">
                                <span className="text-slate-500 text-xs">가격</span>
                                <span className="font-semibold text-slate-900">
                                    {product.price.toLocaleString()}원
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-slate-500 text-xs">재고</span>
                                <span
                                    className={
                                        product.stock <= 5
                                            ? 'text-rose-600 font-semibold'
                                            : 'text-slate-900 font-semibold'
                                    }
                                >
                                    {product.stock}개
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1 text-xs text-slate-500">
                                <span>등록일</span>
                                <span>{formatDateTime(product.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 상세 필드들 */}
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 mb-1">
                                썸네일 URL
                            </div>
                            <div className="text-xs text-slate-800 break-all">
                                {product.thumbnailUrl || (
                                    <span className="text-slate-400">설정되지 않음</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-[11px] font-medium text-slate-500 mb-1">
                                상품 설명
                            </div>
                            <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
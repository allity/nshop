'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
    pid: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnailUrl?: string | null;
    createdAt: string;
};

type ProductListResponse = {
    items: Product[];
    total: number;
    page: number;
    limit: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);

    const [searchName, setSearchName] = useState('');
    const [searchPid, setSearchPid] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [sort, setSort] = useState<'pid' | 'name' | 'createdAt'>('pid');
    const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const fetchProducts = async () => {
        setError(null);
        setLoading(true);

        try {
            if (searchPid.trim() !== '') {
                const pidNum = Number(searchPid.trim());
                if (Number.isNaN(pidNum)) {
                    setError('상품번호는 숫자만 입력하세요.');
                    setLoading(false);
                    return;
                }
                const res = await fetch(`${API_BASE_URL}/products/${pidNum}`);
                if (res.status === 404) {
                    setProducts([]);
                    setTotal(0);
                    setError('해당 상품번호의 상품이 없습니다.');
                    setLoading(false);
                    return;
                }
                if (!res.ok) throw new Error('상품 조회 실패');

                const data: Product = await res.json();
                setProducts(data ? [data] : []);
                setTotal(data ? 1 : 0);
                setLoading(false);
                return;
            }

            const params = new URLSearchParams();
            if (searchName.trim() !== '') {
                params.set('name', searchName.trim());
            }
            if (startDate) {
                params.set('startDate', startDate);
            }
            if (endDate) {
                params.set('endDate', endDate);
            }

            params.set('sort', sort);
            params.set('order', order);
            params.set('page', String(page));
            params.set('limit', String(limit));

            const url = `${API_BASE_URL}/products?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('상품 목록 조회 실패');

            const data: ProductListResponse = await res.json();
            setProducts(data.items);
            setTotal(data.total);
        } catch (e: any) {
            setError(e.message ?? '오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, sort, order]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        await fetchProducts();
    };

    const handleReset = async () => {
        setSearchName('');
        setSearchPid('');
        setStartDate('');
        setEndDate('');
        setSort('pid');
        setOrder('DESC');
        setPage(1);
        setError(null);
        await fetchProducts();
    };

    const toggleOrder = () => {
        setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    }

    const formatDate = (iso: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const handleDelete = async (pid: number, name: string) => {
        const ok = window.confirm(`${name} 상품을 정말 삭제할까요?`);
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE_URL}/products/${pid}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const text = await res.text();
                alert('상품 삭제에 실패했습니다.');
                return;
            }

            await fetchProducts();
            alert('상품이 삭제되었습니다.');
        } catch (e) {
            console.error(e);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-6">
            {/* 상단 타이틀 + 등록 버튼 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">상품 관리</h2>
                    <p className="text-xs text-slate-500">
                        상품번호 / 상품명 / 등록일 기준으로 검색하고, 정렬 및 페이징을 지원합니다.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    + 상품 등록
                </Link>
            </div>

            {/* 검색 + 정렬 폼 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                >
                    {/* 상품번호 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                            상품번호 (pid)
                            <span className="relative group">
                                <span className="inline-flex items-center justify-center rounded-full border border-slate-300 w-4 h-4 text-[10px] text-slate-500 cursor-help">
                                    ?
                                </span>
                                <span
                                    className="
                    pointer-events-none
                    absolute left-1/2 top-full mt-1 -translate-x-1/2
                    whitespace-nowrap rounded-md bg-slate-900 px-2 py-1
                    text-[10px] text-white shadow-md
                    opacity-0 translate-y-1
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-opacity transition-transform duration-150
                    z-10
                  "
                                >
                                    상품번호를 입력하면 번호 검색이 우선 적용됩니다.
                                </span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={searchPid}
                            onChange={(e) => setSearchPid(e.target.value)}
                            placeholder="예: 1001"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 상품명 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">상품명</label>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="예: 키보드, 마우스"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 등록일(시작) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            등록일(시작)
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 등록일(종료) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            등록일(종료)
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 검색/초기화 버튼 */}
                    <div className="flex items-center gap-2 pt-5 md:pt-6">
                        <button
                            type="submit"
                            className="h-11 flex-1 rounded-lg bg-slate-900 text-white text-sm px-4 hover:bg-slate-800"
                        >
                            검색
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="h-11 rounded-lg border border-slate-300 text-sm px-4 text-slate-700 hover:bg-slate-50"
                        >
                            초기화
                        </button>
                    </div>
                </form>

                {/* 정렬 옵션 */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">정렬:</span>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value as 'pid' | 'name' | 'createdAt');
                                setPage(1);
                            }}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="pid">상품번호</option>
                            <option value="name">상품명</option>
                            <option value="createdAt">등록일</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                toggleOrder();
                                setPage(1);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                            {order === 'ASC' ? '오름차순 ↑' : '내림차순 ↓'}
                        </button>
                    </div>
                    <div className="text-[11px] text-slate-400">
                        페이지당 {limit}개 표시
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-rose-600">
                        {error}
                    </p>
                )}
            </section>

            {/* 리스트 테이블 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">상품 리스트</h3>
                    <span className="text-[11px] text-slate-400">
                        총 {total}건 / {page} / {totalPages}페이지
                    </span>
                </div>

                {loading ? (
                    <div className="py-10 text-center text-sm text-slate-500">
                        불러오는 중입니다...
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-500">
                        표시할 상품이 없습니다.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">
                                            상품번호
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">
                                            이미지
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">
                                            상품명
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium text-slate-600">
                                            가격
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium text-slate-600">
                                            재고
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">
                                            등록일
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-slate-600">
                                            액션
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr
                                            key={p.pid}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-3 py-2 font-mono text-[11px] text-slate-700">
                                                {p.pid}
                                            </td>
                                            <td className="px-3 py-2">
                                                {p.thumbnailUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={p.thumbnailUrl}
                                                        alt={p.name}
                                                        className="w-10 h-10 rounded-md object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                                        없음
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-slate-800">
                                                <div className="text-xs font-medium">{p.name}</div>
                                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                                    {p.description}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-right text-slate-800">
                                                {p.price.toLocaleString()}원
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <span
                                                    className={
                                                        p.stock <= 5
                                                            ? 'text-rose-600 font-semibold'
                                                            : 'text-slate-800'
                                                    }
                                                >
                                                    {p.stock}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-left text-slate-600">
                                                {formatDate(p.createdAt)}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <div className="inline-flex gap-1">
                                                    <Link
                                                        href={`/admin/products/${p.pid}`}
                                                        className="rounded-full border border-slate-300 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                                                    >
                                                        보기
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${p.pid}/edit`}
                                                        className="rounded-full border border-indigo-500 px-3 py-1 text-[11px] text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        수정
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.pid, p.name)}
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
                        </div>

                        {/* 페이징 바 */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                이전
                            </button>

                            <span className="text-slate-600">
                                {page} / {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
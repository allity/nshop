// app/admin/products/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export type ProductFormValues = {
    name: string;
    price: number;
    stock: number;
    thumbnailUrl: string;
    description: string;
    cid: number | null;
};

type ProductFormProps = {
    mode: 'create' | 'edit';
    initialValues?: Partial<ProductFormValues>;
    submitting: boolean;
    error: string | null;
    onSubmit: (values: ProductFormValues) => void;
    onCancel: () => void;
};

type CategoryOption = {
    cid: number;
    name: string;
};

export default function ProductForm({
    mode,
    initialValues,
    submitting,
    error,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [description, setDescription] = useState('');

    const [cid, setCid] = useState('');
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [catLoading, setCatLoading] = useState(true);

    // 초기값 세팅 (수정 모드일 때 기존 데이터 들어오면 폼에 세팅)
    useEffect(() => {
        if (initialValues) {
            if (initialValues.name) setName(initialValues.name);
            if (typeof initialValues.price === 'number') setPrice(String(initialValues.price));
            if (typeof initialValues.stock === 'number') setStock(String(initialValues.stock));
            if (typeof initialValues.thumbnailUrl === 'string') setThumbnailUrl(initialValues.thumbnailUrl);
            if (initialValues.description) setDescription(initialValues.description);
            if (typeof initialValues.cid === 'number') setCid(String(initialValues.cid));
        }
    }, [initialValues]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                if (!res.ok) throw new Error('카테고리 조회 실패');
                const data: CategoryOption[] = await res.json();
                setCategories(data);
            } catch (e) {
                console.error('카테고리 목록 조회 실패', e);
            } finally {
                setCatLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 프론트 단 검증
        if (!name.trim()) {
            alert('상품명을 입력하세요.');
            return;
        }
        if (price.trim() === '') {
            alert('가격을 입력하세요.');
            return;
        }
        if (stock.trim() === '') {
            alert('재고를 입력하세요.');
            return;
        }
        if (!description.trim()) {
            alert('상품 설명을 입력하세요.');
            return;
        }

        const priceNum = Number(price);
        const stockNum = Number(stock);

        if (!Number.isFinite(priceNum) || priceNum < 0) {
            alert('가격은 0 이상의 숫자로 입력하세요.');
            return;
        }
        if (!Number.isFinite(stockNum) || stockNum < 0) {
            alert('재고는 0 이상의 숫자로 입력하세요.');
            return;
        }

        let cidNum: number | null = null;
        if (cid) {
            const parsed = Number(cid);
            if (!Number.isNaN(parsed)) {
                cidNum = parsed;
            }
        }

        onSubmit({
            name: name.trim(),
            price: priceNum,
            stock: stockNum,
            thumbnailUrl: thumbnailUrl.trim(),
            description: description.trim(),
            cid: cidNum,
        });
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* 기본 정보 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 상품명 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            상품명 <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예: 무접점 키보드 87키"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 가격 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            가격(원) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="예: 19900"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 재고 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            재고 수량 <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="예: 10"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 썸네일 URL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            썸네일 이미지 URL
                        </label>
                        <input
                            type="text"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <p className="text-[11px] text-slate-400">
                            이미지 업로드 대신 URL만 사용합니다.
                        </p>
                    </div>

                    {/* 🔹 카테고리 선택 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">
                            카테고리
                        </label>
                        <select
                            value={cid}
                            onChange={(e) => setCid(e.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">선택 안 함</option>
                            {categories.map((c) => (
                                <option key={c.cid} value={c.cid}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {catLoading && (
                            <p className="text-[11px] text-slate-400">
                                카테고리를 불러오는 중입니다...
                            </p>
                        )}
                    </div>
                </div>

                {/* 설명 */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                        상품 설명 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        placeholder="상품 상세 설명을 입력하세요."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-xs text-rose-600">
                        {error}
                    </p>
                )}

                {/* 버튼 영역 */}
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        disabled={submitting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? mode === 'create'
                                ? '등록 중...'
                                : '수정 중...'
                            : mode === 'create'
                                ? '상품 등록'
                                : '상품 수정'}
                    </button>
                </div>
            </form>
        </section>
    );
}

'use client';

import { useEffect, useState } from 'react';

export type CategoryFormValues = {
    name: string;
    sortOrder: number;
}

type CategoryFormProps = {
    mode: 'create' | 'edit';
    initialValues?: Partial<CategoryFormValues>;
    submitting: boolean;
    error: string | null;
    onSubmit: (values: CategoryFormValues) => void;
    onCancel: () => void;
};

export default function CategoryForm({
    mode,
    initialValues,
    submitting,
    error,
    onSubmit,
    onCancel,
}: CategoryFormProps) {
    const [name, setName] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        if (initialValues) {
            if (initialValues.name) setName(initialValues.name);
            if (typeof initialValues.sortOrder === 'number') {
                setSortOrder(String(initialValues.sortOrder));
            }
        }
    }, [initialValues]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('분류명을 입력하세요.');
            return;
        }
        if (!sortOrder.trim()) {
            alert('노출순서를 입력하세요. (0 이상 숫자)');
            return;
        }

        const orderNum = Number(sortOrder);
        if (!Number.isFinite(orderNum) || orderNum < 0) {
            alert('노출순서는 0 이상의 숫자로 입력하세요.');
            return;
        }

        onSubmit({
            name: name.trim(),
            sortOrder: orderNum,
        });
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                        분류명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 키보드, 마우스, 데스크 매트"
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                        노출순서 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        placeholder="예: 0 (숫자가 작을수록 먼저 노출)"
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400">
                        숫자가 작을수록 상단에 먼저 노출됩니다.
                    </p>
                </div>

                {error && (
                    <p className="text-xs text-rose-600">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
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
                                ? '분류 등록'
                                : '분류 수정'}
                    </button>
                </div>
            </form>
        </section>
    );
}
// app/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminSidebar() {
    const [productOpen, setProductOpen] = useState(true);

    return (
        <nav className="flex-1 px-4 py-4 space-y-4 text-sm">
            {/* 대시보드 */}
            <Link
                href="/admin"
                className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
            >
                대시보드
            </Link>

            {/* 상품 관리 (아코디언) */}
            <div>
                <button
                    type="button"
                    onClick={() => setProductOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                    <span className="uppercase tracking-wide">상품 관리</span>
                    <span className="text-[10px]">
                        {productOpen ? '▾' : '▸'}
                    </span>
                </button>

                {productOpen && (
                    <div className="mt-1 space-y-1">
                        <Link
                            href="/admin/products"
                            className="block px-4 py-2 rounded-lg hover:bg-slate-800"
                        >
                            상품 목록
                        </Link>
                        <Link
                            href="/admin/products/new"
                            className="block px-4 py-2 rounded-lg hover:bg-slate-800"
                        >
                            상품 등록
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="block px-4 py-2 rounded-lg hover:bg-slate-800"
                        >
                            상품분류 관리
                        </Link>
                    </div>
                )}
            </div>

            {/* 주문 관리 */}
            <Link
                href="/admin/orders"
                className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
            >
                주문 관리
            </Link>

            {/* 고객 관리 */}
            <Link
                href="/admin/customers"
                className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
            >
                고객 관리
            </Link>

            {/* 설정 */}
            <Link
                href="/admin/settings"
                className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
            >
                설정
            </Link>
        </nav>
    );
}

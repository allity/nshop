import type { ReactNode } from 'react';
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* 사이드 바 */}
            <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-sl font-bold tracking-tight">
                        nshop <span className="text-indigo-400">Admin</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
                    <Link
                        href="/admin"
                        className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
                    >
                        대시보드
                    </Link>
                    <Link
                        href="/admin/products"
                        className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
                    >
                        상품 관리
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
                    >
                        주문 관리
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
                    >
                        고객 관리
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800"
                    >
                        설정
                    </Link>
                </nav>
                <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
                    © {new Date().getFullYear()} nshop
                </div>
            </aside>

            {/* 메인 영역 */}
            <div className="flex-1 flex flex-col">
                {/* 상단 헤더 */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-lg font-semibold">관리자 대시보드</h1>
                        <p className="text-xs text-slate-500">
                            쇼핑몰 운영 현황을 한 눈에 확인하세요.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            알림 0
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                            EN
                        </div>
                    </div>
                </header>

                {/* 컨텐츠 영역 */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
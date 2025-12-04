import type { ReactNode } from 'react';
import { fetchJson } from '../lib/api';
import { Category } from '../types/category';
import ShopHeader from './components/ShopHeader';
import ShopFooter from './components/ShopFooter';

async function getCategories(): Promise<Category[]> {
    return fetchJson<Category[]>('/categories');
}

export default async function ShopLayout({
    children,
}: {
    children: ReactNode;
}) {
    const categories = await getCategories();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <ShopHeader categories={categories} />
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
            </main>
            <ShopFooter />
        </div>
    );
};

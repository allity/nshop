import Link from 'next/link';
import type { Category } from '../../types/category';

type Props = {
    categories: Category[];
};

export default function ShopHeader({ categories }: Props) {
    return (
        <header className= "border-b border-slate-200 bg-white" >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" >
            {/* 로고 */ }
            < Link href = "/shop" className = "flex items-center gap-2" >
                <span className="text-xl font-semibold text-slate-900" > NShop </span>
                    </Link>

    {/* 상단 네비게이션 */ }
    <nav className="hidden gap-4 text-sm text-slate-700 md:flex" >
        <Link href="/shop" className = "hover:text-indigo-600" >
            홈
            </Link>
            < Link href = "/products" className = "hover:text-indigo-600" >
                전체 상품
                    </Link>
                    </nav>
                    </div>

    {/* 카테고리 바 */ }
    <div className="border-t border-slate-200 bg-slate-50" >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 text-sm" >
        {
            categories.map((cat) => (
                <Link
              key= { cat.cid }
              href = {`/shop/categories/${cat.cid}`}
    className = "whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
        >
        { cat.name }
        </Link>
          ))
}
</div>
    </div>
    </header>
    );
};
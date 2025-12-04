// app/(shop)/_components/ShopFooter.tsx
export default function ShopFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        <p className="font-semibold text-slate-600">NShop</p>
        <p className="mt-1">
          ⓒ {new Date().getFullYear()} NShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

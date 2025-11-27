type Product = {
    pid: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnailUrl?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/products`);

    return res.json();
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <main style={{ padding: '24px' }}>
            <h1>상품 목록</h1>

            <ul>
                {products.map((p) => (
                    <li key={p.pid}>
                        <a href={`/products/${p.pid}`}>
                            {p.name} - {p.price}원
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    );
}
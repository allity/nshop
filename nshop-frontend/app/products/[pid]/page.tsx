type Product = {
    pid: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnailUrl?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Props = {
    params: Promise<{
        pid: string 
    }>;
};

async function getProduct(pid : string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${pid}`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch');

    return res.json();
}

export default async function ProductDetailPage({ params }: Props) {
    const { pid } = await params;
    const product = await getProduct(pid);

    return (
        <main style={{ padding: '24px' }}>
            <h1>{product.name}</h1>
            <p>{product.price}원</p>
            <p>{product.description}</p>
        </main>
    );
}
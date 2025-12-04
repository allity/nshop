const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${input}`, {
        next: { revalidate: 1 },
        ...init,
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}
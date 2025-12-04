const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchMe() {
    const token = 
        typeof window !== 'undefined'
        ? localStorage.getItem('nshop_access_token')
        : null;
    
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/members/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return null;
    return res.json();
}
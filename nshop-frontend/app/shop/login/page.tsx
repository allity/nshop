'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || '로그인에 실패했습니다.');
            }

            const data = await res.json();

            if (typeof window !== 'undefined') {
                localStorage.setItem('nshop_access_token', data.accessToken);
                localStorage.setItem('nshop_member', JSON.stringify(data.member));
            }

            router.push('/shop');
        } catch (e: any) {
            setError(e.message ?? '로그인 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">로그인</h1>
            <p className="mt-1 text-xs text-slate-500">
                이메일과 비밀번호를 입력해주세요.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* 이메일 */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                        이메일
                    </label>
                    <input
                        type="email"
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* 비밀번호 */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-xs text-rose-600">
                        {error}
                    </p>
                )}

                {/* 버튼 */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                        {submitting ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </form>

            {/* 회원가입 / SNS 로그인 영역은 나중에 */}
            <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                아직 회원이 아니신가요?{' '}
                <span className="cursor-pointer text-indigo-600 hover:underline">
                    회원가입
                </span>
                <br />
                SNS 로그인은 추후 지원 예정입니다.
            </div>
        </div>
    );
}
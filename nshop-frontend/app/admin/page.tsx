// app/admin/page.tsx

export default function AdminDashboardPage() {
  const stats = [
    {
      label: '오늘 주문 수',
      value: '24',
      sub: '+12% 어제보다',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      label: '오늘 매출',
      value: '₩1,280,000',
      sub: '+8% 지난주 같은 요일',
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      label: '신규 가입자',
      value: '17',
      sub: '총 회원 4,312명',
      color: 'from-violet-400 to-violet-600',
    },
    {
      label: '품절 임박 상품',
      value: '6',
      sub: '재고 5개 이하',
      color: 'from-amber-400 to-amber-600',
    },
  ];

  const sales = [40, 52, 37, 80, 66, 92, 75]; // 더미 데이터
  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const max = Math.max(...sales);

  return (
    <div className="space-y-6">
      {/* 카드 4개 */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2"
          >
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-emerald-600">{s.sub}</div>
            <div
              className={`mt-2 h-1 rounded-full bg-gradient-to-r ${s.color}`}
            />
          </div>
        ))}
      </section>

      {/* 그래프 + 최근 주문 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* 간단한 바 차트 */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold">요일별 매출 추이</h2>
              <p className="text-xs text-slate-500">
                최근 7일 간 매출 데이터 (더미)
              </p>
            </div>
            <div className="text-xs text-slate-400">단위: 만원</div>
          </div>

          <div className="mt-4 flex items-end gap-3 h-40">
            {sales.map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 to-violet-500"
                  style={{ height: `${(value / max) * 100}%` }}
                />
                <div className="text-[11px] text-slate-500">{labels[idx]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 주문 더미 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold mb-2">최근 주문 (더미)</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">주문번호</span>
              <span className="text-slate-500">고객</span>
              <span className="text-slate-500">금액</span>
              <span className="text-slate-500">상태</span>
            </div>

            {[
              { id: '#20251127001', user: '홍길동', price: '₩120,000', status: '결제완료' },
              { id: '#20251127002', user: '김철수', price: '₩32,000', status: '배송중' },
              { id: '#20251127003', user: '이영희', price: '₩58,000', status: '취소요청' },
            ].map((o) => (
              <div key={o.id} className="flex justify-between items-center text-[11px]">
                <span className="font-mono">{o.id}</span>
                <span>{o.user}</span>
                <span>{o.price}</span>
                <span
                  className={
                    o.status === '결제완료'
                      ? 'text-emerald-600'
                      : o.status === '배송중'
                      ? 'text-indigo-600'
                      : 'text-amber-600'
                  }
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

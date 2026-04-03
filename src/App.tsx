import './App.css'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-green flex items-center justify-center text-2xl text-white mx-auto mb-4">
          ✈
        </div>
        <h1 className="font-display font-black text-3xl text-brand-black tracking-tight">
          AI 출국<span className="text-brand-green">메이트</span>
        </h1>
        <p className="text-sm text-brand-muted mt-2">초기 세팅 완료 · 개발 시작 준비됨</p>
      </div>
    </div>
  )
}

type Props = {
  from: string
  to: string
  method: string
  duration: string
  price: string
  onPress: () => void
}

export default function QuickRouteCard({ from, to, method, duration, price, onPress }: Props) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left active:scale-[0.98] transition-all border border-brand-border shadow-sm overflow-hidden relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green rounded-l-2xl" />
      <div className="w-10 h-10 rounded-xl bg-brand-pale flex items-center justify-center text-xl shrink-0 ml-1">
        🚉
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13px] text-brand-black">
          {from} <span className="text-brand-green font-black">→</span> {to}
        </p>
        <p className="text-[11px] text-brand-muted mt-0.5">{method}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-black text-[13px] text-brand-black">{duration}</p>
        <p className="text-[11px] text-brand-green font-semibold">{price}</p>
      </div>
      <svg width="5" height="9" viewBox="0 0 6 10" fill="none" className="shrink-0 ml-1 text-brand-border">
        <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

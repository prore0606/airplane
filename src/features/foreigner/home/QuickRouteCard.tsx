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
      className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left hover:bg-brand-pale active:scale-[0.98] transition-all border border-brand-border"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-pale flex items-center justify-center text-lg shrink-0">
        🚉
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13px] text-brand-black">
          {from} <span className="text-brand-green">→</span> {to}
        </p>
        <p className="text-[11px] text-brand-muted mt-0.5">{method}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-[13px] text-brand-black">{duration}</p>
        <p className="text-[11px] text-brand-green font-semibold">{price}</p>
      </div>
    </button>
  )
}

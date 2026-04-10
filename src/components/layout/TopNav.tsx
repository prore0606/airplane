type Props = {
  showNotifDot?: boolean
}

export default function TopNav({ showNotifDot = false }: Props) {
  return (
    <header className="h-14 bg-white border-b border-brand-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-white text-sm">
          ✈
        </div>
        <span className="font-display font-black text-sm tracking-tight text-brand-black">
          출국<span className="text-brand-green">메이트</span>
        </span>
      </div>
      <button className="relative w-8 h-8 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-sm hover:bg-brand-pale transition-colors">
        🔔
        {showNotifDot && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-red" />
        )}
      </button>
    </header>
  )
}

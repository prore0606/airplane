type Props = {
  showNotifDot?: boolean
}

export default function TopNav({ showNotifDot = false }: Props) {
  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-2 bg-white border-b border-brand-border">
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-white text-sm">
          ✈
        </div>
        <span className="font-display font-black text-[15px] tracking-tight text-brand-black">
          출국<span className="text-brand-green">메이트</span>
        </span>
      </div>
      <button className="relative w-8 h-8 rounded-[10px] bg-white border border-brand-border flex items-center justify-center text-sm">
        🔔
        {showNotifDot && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-red" />
        )}
      </button>
    </header>
  )
}

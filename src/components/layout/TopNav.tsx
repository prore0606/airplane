type Props = {
  showNotifDot?: boolean
}

export default function TopNav({ showNotifDot = false }: Props) {
  return (
    <header className="h-14 bg-white border-b border-brand-border flex items-center justify-between px-8 shrink-0">
      <p className="text-sm font-semibold text-brand-body">AI 출국 메이트</p>
      <button className="relative w-8 h-8 rounded-[10px] bg-white border border-brand-border flex items-center justify-center text-sm hover:bg-brand-surface transition-colors">
        🔔
        {showNotifDot && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-red" />
        )}
      </button>
    </header>
  )
}

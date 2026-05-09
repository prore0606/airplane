const NUMBERS = [
  { label: 'Police',     number: '112', emoji: '🚔' },
  { label: 'Ambulance',  number: '119', emoji: '🚑' },
  { label: 'Tourist',    number: '1330', emoji: 'ℹ️' },
]

export default function EmergencyRow() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-brand-border">
      <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-3">
        Emergency
      </p>
      <div className="flex gap-2">
        {NUMBERS.map(({ label, number, emoji }) => (
          <a
            key={number}
            href={`tel:${number}`}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-pale transition-colors"
          >
            <span className="text-lg">{emoji}</span>
            <p className="font-black text-[13px] text-brand-black">{number}</p>
            <p className="text-[10px] text-brand-muted">{label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

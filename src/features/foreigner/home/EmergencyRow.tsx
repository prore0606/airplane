const NUMBERS = [
  { label: 'Police',    number: '112',  emoji: '🚔', color: '#2563eb' },
  { label: 'Ambulance', number: '119',  emoji: '🚑', color: '#dc2626' },
  { label: 'Tourist',   number: '1330', emoji: 'ℹ️',  color: '#16a34a' },
]

export default function EmergencyRow() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm">
      <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-3">
        Emergency Numbers
      </p>
      <div className="flex gap-2">
        {NUMBERS.map(({ label, number, emoji, color }) => (
          <a
            key={number}
            href={`tel:${number}`}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all active:scale-[0.97]"
            style={{ borderColor: `${color}28`, background: `${color}0a` }}
          >
            <span className="text-xl">{emoji}</span>
            <p className="font-black text-[14px]" style={{ color }}>{number}</p>
            <p className="text-[9px] text-brand-muted font-semibold uppercase tracking-wider">{label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

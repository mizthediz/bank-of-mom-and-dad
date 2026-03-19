interface Transaction {
  id: number
  date: string
  amount: number
  type: string
  description: string
  createdAt?: string
}

interface TransactionRowProps {
  tx: Transaction
  onEdit?: (tx: Transaction) => void
  onDelete?: (id: number) => void
}

const TYPE_LABELS: Record<string, string> = {
  credit: 'Money In',
  debit: 'Money Out',
  interest: 'Interest',
  override: 'Adjustment',
  opening: 'Opening Balance',
}

function TxIcon({ type }: { type: string }) {
  const base = 'w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0'

  if (type === 'credit') return (
    <div className={`${base} bg-emerald-50`}>
      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0-16l-4 4m4-4l4 4" />
      </svg>
    </div>
  )

  if (type === 'debit') return (
    <div className={`${base} bg-rose-50`}>
      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 16l-4-4m4 4l4-4" />
      </svg>
    </div>
  )

  if (type === 'interest') return (
    <div className={`${base} bg-amber-50`}>
      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  )

  if (type === 'opening') return (
    <div className={`${base} bg-indigo-50`}>
      <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    </div>
  )

  // override / default
  return (
    <div className={`${base} bg-slate-100`}>
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
  )
}

export default function TransactionRow({ tx, onEdit, onDelete }: TransactionRowProps) {
  const isPositive = tx.amount >= 0
  const formatted = `${isPositive ? '+' : '-'}$${Math.abs(tx.amount).toFixed(2)}`
  const dateStr = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center gap-3 py-3.5 last:pb-0 first:pt-0">
      <TxIcon type={tx.type} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-700 text-sm truncate">
          {tx.description || TYPE_LABELS[tx.type] || tx.type}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {dateStr} · {TYPE_LABELS[tx.type] ?? tx.type}
        </p>
      </div>
      <div className={`font-black text-sm flex-shrink-0 ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
        {formatted}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 flex-shrink-0 ml-1">
          {onEdit && (
            <button
              onClick={() => onEdit(tx)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-500 hover:bg-indigo-50"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

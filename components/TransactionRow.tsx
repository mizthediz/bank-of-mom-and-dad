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

const TYPE_ICONS: Record<string, string> = {
  credit: '⬆️',
  debit: '⬇️',
  interest: '✨',
  override: '✏️',
  opening: '🎉',
}

const TYPE_LABELS: Record<string, string> = {
  credit: 'Money In',
  debit: 'Money Out',
  interest: 'Interest',
  override: 'Adjustment',
  opening: 'Opening',
}

export default function TransactionRow({ tx, onEdit, onDelete }: TransactionRowProps) {
  const isPositive = tx.amount >= 0
  const formatted = `${isPositive ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}`
  const date = new Date(tx.date)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="text-xl w-8 text-center flex-shrink-0">{TYPE_ICONS[tx.type] ?? '💵'}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-700 text-sm truncate">
          {tx.description || TYPE_LABELS[tx.type] || tx.type}
        </p>
        <p className="text-xs text-gray-400">{dateStr} · {TYPE_LABELS[tx.type] ?? tx.type}</p>
      </div>
      <div className={`font-bold text-sm flex-shrink-0 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
        {formatted}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(tx)}
              className="text-xs text-gray-400 hover:text-sky-500 p-1 rounded transition-colors"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tx.id)}
              className="text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  )
}

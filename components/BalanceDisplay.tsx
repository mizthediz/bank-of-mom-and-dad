interface BalanceDisplayProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function BalanceDisplay({ amount, className = '', size = 'md' }: BalanceDisplayProps) {
  const isNegative = amount < 0
  const formatted = Math.abs(amount).toFixed(2)
  const display = isNegative ? `-$${formatted}` : `$${formatted}`

  const sizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  }[size]

  return (
    <span className={`font-bold ${isNegative ? 'text-red-500' : ''} ${sizeClass} ${className}`}>
      {display}
    </span>
  )
}

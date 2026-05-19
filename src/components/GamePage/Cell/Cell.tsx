import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

type CellName = '1-1' | '1-2' | '1-3' | '2-1' | '2-2' | '2-3' | '3-1' | '3-2' | '3-3'

type Props = {
  name: CellName
  ownedBy: string
  isPlayer1Icon: boolean
  disabled: boolean
  onPlay: (name: CellName) => void
}

const Cell = ({ name, ownedBy, isPlayer1Icon, disabled, onPlay }: Props) => {
  const handleClick = () => {
    if (disabled) return
    onPlay(name)
  }

  const symbol = ownedBy ? (isPlayer1Icon ? 'O' : 'X') : null
  const isFilled = symbol !== null
  const isClickable = !disabled && !isFilled

  return (
    <button
      type='button'
      id={`cell-${name}`}
      onClick={handleClick}
      disabled={!isClickable}
      className={cn(
        'group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all',
        isClickable && 'cursor-pointer hover:border-white/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(167,139,250,0.25)]',
        !isClickable && 'cursor-default'
      )}
      aria-label={`Case ${name}${isFilled ? ` jouée par ${ownedBy}` : ''}`}
    >
      <AnimatePresence>
        {symbol && (
          <motion.span
            key={symbol}
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={cn(
              'text-[clamp(2.5rem,9vw,5rem)] font-black tracking-tighter',
              isPlayer1Icon
                ? 'text-[#22d3ee] [text-shadow:0_0_24px_rgba(34,211,238,0.6)]'
                : 'text-[#f472b6] [text-shadow:0_0_24px_rgba(244,114,182,0.6)]'
            )}
          >
            {symbol}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default Cell

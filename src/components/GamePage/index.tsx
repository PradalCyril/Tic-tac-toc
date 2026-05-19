import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { RetroGrid } from '@/components/magicui/retro-grid'
import { BorderBeam } from '@/components/magicui/border-beam'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { AuroraText } from '@/components/magicui/aurora-text'
import { Confetti, type ConfettiRef } from '@/components/magicui/confetti'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { cn } from '@/lib/utils'
import Cell from './Cell/Cell'

type CellName = '1-1' | '1-2' | '1-3' | '2-1' | '2-2' | '2-3' | '3-1' | '3-2' | '3-3'
type CellState = { checked: boolean; checkedBy: string }
type CellsState = Record<CellName, CellState>
type Outcome = { stopGame: boolean; isWin: boolean; winner: string }

const CELL_NAMES: CellName[] = ['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3']

const WINNING_LINES: [CellName, CellName, CellName][] = [
  ['1-1', '1-2', '1-3'],
  ['2-1', '2-2', '2-3'],
  ['3-1', '3-2', '3-3'],
  ['1-1', '2-1', '3-1'],
  ['1-2', '2-2', '3-2'],
  ['1-3', '2-3', '3-3'],
  ['1-1', '2-2', '3-3'],
  ['1-3', '2-2', '3-1']
]

const createEmptyCells = (): CellsState =>
  CELL_NAMES.reduce((acc, name) => {
    acc[name] = { checked: false, checkedBy: '' }
    return acc
  }, {} as CellsState)

const computeOutcome = (cells: CellsState): Outcome => {
  for (const [a, b, c] of WINNING_LINES) {
    const owner = cells[a].checkedBy
    if (owner && cells[b].checkedBy === owner && cells[c].checkedBy === owner) {
      return { stopGame: true, isWin: true, winner: owner }
    }
  }
  const allFilled = CELL_NAMES.every((name) => cells[name].checked)
  return { stopGame: allFilled, isWin: false, winner: '' }
}

const PlayerCard = ({ name, color, active }: { name: string; color: string; active: boolean }) => (
  <div
    className={cn(
      'relative rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 backdrop-blur-sm transition-all',
      active ? 'opacity-100' : 'opacity-40'
    )}
  >
    <span className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
      Tour de
    </span>
    <div className='mt-1 text-2xl font-bold' style={{ color }}>
      {name}
    </div>
    {active && <BorderBeam size={60} duration={4} colorFrom={color} colorTo='#ffffff' />}
  </div>
)

const GamePage = () => {
  const params = useParams<{ name1: string; name2: string }>()
  const name1 = params.name1 ?? ''
  const name2 = params.name2 ?? ''

  const [playerNameTurn, setPlayerNameTurn] = useState(name1)
  const [cells, setCells] = useState<CellsState>(createEmptyCells)
  const confettiRef = useRef<ConfettiRef>(null)

  const outcome = useMemo(() => computeOutcome(cells), [cells])

  useEffect(() => {
    if (outcome.isWin) {
      const trigger = () => {
        confettiRef.current?.fire({
          particleCount: 120,
          spread: 90,
          startVelocity: 45,
          origin: { y: 0.6 },
          colors: ['#22d3ee', '#f472b6', '#a78bfa', '#fde047']
        })
      }
      trigger()
      const id = window.setTimeout(trigger, 600)
      return () => window.clearTimeout(id)
    }
  }, [outcome.isWin])

  const playCell = (name: CellName) => {
    if (outcome.stopGame || cells[name].checked) return
    setCells((prev) => ({
      ...prev,
      [name]: { checked: true, checkedBy: playerNameTurn }
    }))
    setPlayerNameTurn((current) => (current === name1 ? name2 : name1))
  }

  const resetGame = () => {
    setPlayerNameTurn(name1)
    setCells(createEmptyCells())
  }

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-10'>
      <RetroGrid darkLineColor='#a78bfa' lightLineColor='#a78bfa' opacity={0.4} />
      <Confetti
        ref={confettiRef}
        manualstart
        className='pointer-events-none fixed inset-0 z-50 size-full'
      />

      <div className='relative z-10 flex w-full max-w-2xl flex-col items-center gap-8'>
        <AnimatePresence mode='wait'>
          {!outcome.stopGame && (
            <motion.div
              key='players'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex w-full items-center justify-between gap-4'
            >
              <PlayerCard name={name1} color='#22d3ee' active={playerNameTurn === name1} />
              <span className='text-xl font-bold text-muted-foreground'>vs</span>
              <PlayerCard name={name2} color='#f472b6' active={playerNameTurn === name2} />
            </motion.div>
          )}

          {outcome.isWin && (
            <motion.div
              key='winner'
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className='flex flex-col items-center gap-3'
            >
              <span className='text-sm font-medium tracking-widest text-muted-foreground uppercase'>
                Vainqueur
              </span>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SparklesText
                  className='text-5xl font-black sm:text-7xl'
                  colors={{ first: '#22d3ee', second: '#f472b6' }}
                  sparklesCount={14}
                >
                  <AuroraText
                    speed={2}
                    colors={['#22d3ee', '#a78bfa', '#f472b6', '#fde047', '#22d3ee']}
                  >
                    {outcome.winner}
                  </AuroraText>
                </SparklesText>
              </motion.div>
            </motion.div>
          )}

          {outcome.stopGame && !outcome.isWin && (
            <motion.div
              key='draw'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-4xl font-black tracking-tight text-muted-foreground sm:text-5xl'
            >
              Match nul
            </motion.div>
          )}
        </AnimatePresence>

        {!outcome.stopGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className='grid w-full max-w-md grid-cols-3 gap-3'
          >
            {CELL_NAMES.map((name) => (
              <Cell
                key={name}
                name={name}
                ownedBy={cells[name].checkedBy}
                isPlayer1Icon={cells[name].checkedBy === name1}
                disabled={cells[name].checked || outcome.stopGame}
                onPlay={playCell}
              />
            ))}
          </motion.div>
        )}

        {outcome.stopGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='flex flex-col items-stretch gap-3 sm:flex-row'
          >
            <Link to='/'>
              <ShimmerButton
                className='w-full px-6 py-3 text-sm font-semibold sm:w-auto'
                background='linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(167, 139, 250, 0.15))'
                shimmerColor='#22d3ee'
              >
                <span className='relative z-10'>Nouveaux joueurs</span>
              </ShimmerButton>
            </Link>
            <ShimmerButton
              onClick={resetGame}
              className='px-6 py-3 text-sm font-semibold'
              background='linear-gradient(135deg, rgba(244, 114, 182, 0.15), rgba(167, 139, 250, 0.15))'
              shimmerColor='#f472b6'
            >
              <span className='relative z-10'>Rejouer</span>
            </ShimmerButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default GamePage

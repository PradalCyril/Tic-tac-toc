import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { RetroGrid } from '@/components/magicui/retro-grid'
import { AuroraText } from '@/components/magicui/aurora-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { MagicCard } from '@/components/magicui/magic-card'

const HomePage = () => {
  const navigate = useNavigate()
  const [players, setPlayers] = useState({ player1: '', player2: '' })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const player1 = players.player1.trim()
    let player2 = players.player2.trim()
    if (!player1 || !player2) return
    if (player1 === player2) player2 = `${player2}2`
    navigate(`/play/${encodeURIComponent(player1)}/${encodeURIComponent(player2)}`)
  }

  const updatePlayerName = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayers((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const canPlay = players.player1.trim().length > 0 && players.player2.trim().length > 0

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6'>
      <RetroGrid darkLineColor='#a78bfa' lightLineColor='#a78bfa' opacity={0.55} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='relative z-10 w-full max-w-md'
      >
        <h1 className='mb-8 text-center text-5xl font-black tracking-tight sm:text-6xl'>
          <AuroraText colors={['#a78bfa', '#22d3ee', '#f472b6', '#a78bfa']}>Tic Tac Toe</AuroraText>
        </h1>

        <MagicCard
          className='rounded-2xl p-8'
          gradientFrom='#a78bfa'
          gradientTo='#22d3ee'
          gradientColor='#1f1f23'
        >
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                Joueur 1
              </span>
              <input
                className='w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/30'
                type='text'
                autoComplete='off'
                name='player1'
                placeholder='Son nom...'
                onChange={updatePlayerName}
                value={players.player1}
              />
            </label>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                Joueur 2
              </span>
              <input
                className='w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30'
                type='text'
                autoComplete='off'
                name='player2'
                placeholder='Son nom...'
                onChange={updatePlayerName}
                value={players.player2}
              />
            </label>

            <ShimmerButton
              className='mt-4 w-full px-6 py-3 text-base font-semibold'
              shimmerColor='#a78bfa'
              background='linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(34, 211, 238, 0.15))'
              disabled={!canPlay}
              type='submit'
            >
              <span className='relative z-10'>Lancer la partie</span>
            </ShimmerButton>
          </form>
        </MagicCard>
      </motion.div>
    </div>
  )
}

export default HomePage

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import Logo from '../../assets/tic-tac-toe.svg?react'
import './index.css'

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

  return (
    <form className='home-container' onSubmit={handleSubmit}>
      <Logo className='logo' aria-label='Tic Tac Toe' />
      <input
        className='input'
        type='text'
        autoComplete='off'
        name='player1'
        placeholder='player 1'
        onChange={updatePlayerName}
        value={players.player1}
      />
      <input
        className='input'
        type='text'
        autoComplete='off'
        name='player2'
        placeholder='player 2'
        onChange={updatePlayerName}
        value={players.player2}
      />
      <button type='submit' className='homepage-btn'>Play</button>
    </form>
  )
}

export default HomePage

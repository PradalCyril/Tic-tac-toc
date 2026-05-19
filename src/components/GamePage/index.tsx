import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import Cell from './Cell/Cell'
import './index.css'

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

const GamePage = () => {
  const params = useParams<{ name1: string; name2: string }>()
  const name1 = params.name1 ?? ''
  const name2 = params.name2 ?? ''

  const [playerNameTurn, setPlayerNameTurn] = useState(name1)
  const [cells, setCells] = useState<CellsState>(createEmptyCells)

  const outcome = useMemo(() => computeOutcome(cells), [cells])

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

  const title = outcome.isWin ? (
    <h1 className='text-turn'>Bravo {outcome.winner}!!!!!</h1>
  ) : outcome.stopGame ? (
    <h1>Match Nul !</h1>
  ) : null

  const player1Turn =
    playerNameTurn === name1 && !outcome.stopGame ? (
      <h1 className='player-name player-1'>{name1}</h1>
    ) : (
      <div className='player-container' />
    )

  const player2Turn =
    playerNameTurn === name2 && !outcome.stopGame ? (
      <h1 className='player-name player-2'>{name2}</h1>
    ) : (
      <div className='player-container' />
    )

  const cellClassName = (index: number) => `game-cells cells-${index + 1}`

  return (
    <div className='container'>
      <div>
        {title}
        {player1Turn}
        {!outcome.stopGame && (
          <div>
            {[0, 1, 2].map((row) => (
              <div key={row} className='game-row'>
                {[0, 1, 2].map((col) => {
                  const name = CELL_NAMES[row * 3 + col]
                  return (
                    <Cell
                      key={name}
                      className={cellClassName(row * 3 + col)}
                      name={name}
                      ownedBy={cells[name].checkedBy}
                      isPlayer1Icon={cells[name].checkedBy === name1}
                      disabled={cells[name].checked || outcome.stopGame}
                      onPlay={playCell}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        )}
        {player2Turn}
        {outcome.stopGame && (
          <div className='user-end-game'>
            <Link to='/'>
              <button className='button'>Rejouer avec de nouvelles personnes ?</button>
            </Link>
            <button className='button' onClick={resetGame}>
              Rejouer avec les mêmes personnes ?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage

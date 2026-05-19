import Croix from '../../../assets/croix.svg?react'
import Rond from '../../../assets/rond.svg?react'

type CellName = '1-1' | '1-2' | '1-3' | '2-1' | '2-2' | '2-3' | '3-1' | '3-2' | '3-3'

type Props = {
  className: string
  name: CellName
  ownedBy: string
  isPlayer1Icon: boolean
  disabled: boolean
  onPlay: (name: CellName) => void
}

const Cell = ({ className, name, ownedBy, isPlayer1Icon, disabled, onPlay }: Props) => {
  const handleClick = () => {
    if (disabled) return
    onPlay(name)
  }

  return (
    <div id={`cell-${name}`} className={className} onClick={handleClick}>
      {ownedBy && (isPlayer1Icon ? <Rond className='player2-img' /> : <Croix className='player2-img' />)}
    </div>
  )
}

export default Cell

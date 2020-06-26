import React from 'react';

const Cell = (props) => {
    const {haveWinner, name, className, cells, endTurn} = props; 
    return (
        <div
            className={className}
            onClick={() => endTurn({ name, isWin: haveWinner.stopGame })}
        >
            {cells[name].icon}
        </div>
    )
}

export default Cell; 
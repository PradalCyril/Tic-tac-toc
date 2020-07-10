import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';
import './index.css';
import Cell from './Cell/Cell';

const isThreeCellsAlign = (data) => {
    const { compteur, nameCells, cells } = data
    let ligne, secondCompteur = compteur;
    if (cells[nameCells[0]].checkedBy && cells[nameCells[1]].checkedBy && cells[nameCells[2]].checkedBy) {
        ligne = cells[nameCells[0]].checkedBy === cells[nameCells[1]].checkedBy && cells[nameCells[0]].checkedBy === cells[nameCells[2]].checkedBy;
        secondCompteur += 1;
    }
    return {
        isAllign: ligne,
        compteur: secondCompteur
    }
}

const isWin = (cells) => {
    let ligne1,
        ligne2,
        ligne3,
        column1,
        column2,
        column3,
        diago1,
        diago2,
        compteur = 0;

    const data1 = { compteur: compteur, nameCells: ['1-1', '1-2', '1-3'], cells }
    ligne1 = isThreeCellsAlign(data1);

    const data2 = { compteur: compteur, nameCells: ['2-1', '2-2', '2-3'], cells }
    ligne2 = isThreeCellsAlign(data2);

    const data4 = { compteur: compteur, nameCells: ['3-1', '3-2', '3-3'], cells }
    ligne3 = isThreeCellsAlign(data4);

    const data5 = { compteur: compteur, nameCells: ['1-1', '2-1', '3-1'], cells }
    column1 = isThreeCellsAlign(data5);

    const data6 = { compteur: compteur, nameCells: ['1-2', '2-2', '3-2'], cells }
    column2 = isThreeCellsAlign(data6);

    const data7 = { compteur: compteur, nameCells: ['1-3', '2-3', '3-3'], cells }
    column3 = isThreeCellsAlign(data7);

    const data8 = { compteur: compteur, nameCells: ['1-1', '2-2', '3-3'], cells }
    diago1 = isThreeCellsAlign(data8);

    const data9 = { compteur: compteur, nameCells: ['1-3', '2-2', '3-1'], cells }
    diago2 = isThreeCellsAlign(data9);

    compteur = (ligne1.compteur + ligne2.compteur + ligne3.compteur + column1.compteur + column2.compteur + column3.compteur + diago1.compteur + diago2.compteur);
    if (ligne1.isAllign || ligne2.isAllign || ligne3.isAllign || column1.isAllign || column2.isAllign || column3.isAllign || diago1.isAllign || diago2.isAllign) {
        return { stopGame: true, isWin: true };
    } else {
        return { stopGame: compteur === 8, isWin: false };
    }
}

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerNameTurn: this.props.match.params.name1,
            cells: {
                '1-1': { checked: false, checkedBy: '' },
                '1-2': { checked: false, checkedBy: '' },
                '1-3': { checked: false, checkedBy: '' },
                '2-1': { checked: false, checkedBy: '' },
                '2-2': { checked: false, checkedBy: '' },
                '2-3': { checked: false, checkedBy: '' },
                '3-1': { checked: false, checkedBy: '' },
                '3-2': { checked: false, checkedBy: '' },
                '3-3': { checked: false, checkedBy: '' },
            }
        }
    }

    // shouldComponentUpdate = (nextProps, nextState) => {
    //     if (JSON.stringify(nextState) !== JSON.stringify(this.state))
    //     return false;
    // }

    endTurn = (cellData) => {
        const { playerNameTurn, cells } = this.state;
        const { name1, name2 } = this.props.match.params;

        if (cells[cellData.name].checked || cellData.isWin) {
            return
        }
        const paramsCells = { playerNameTurn: playerNameTurn, cells: cells, name1: name1, name2: name2, cellData: cellData }
        const paramsPlayer = { playerNameTurn: playerNameTurn, name1: name1, name2: name2 }
        this.updateCells(paramsCells);
        this.updatePlayer(paramsPlayer);
    }
    updateCells = (data) => {
        const { playerNameTurn, cells, name1, name2, cellData } = data;
        let playerName;
        if (playerNameTurn !== name1) {
            playerName = name2;
        } else {
            playerName = name1;
        }
        this.setState({
            cells: {
                ...cells,
                [cellData.name]: {
                    checked: true,
                    checkedBy: playerName
                }
            }
        });

    }

    updatePlayer = (data) => {
        const { playerNameTurn, name1, name2 } = data;
        let playerName;
        if (playerNameTurn === name1) {
            playerName = name2;
        } else {
            playerName = name1;

        }
        this.setState({
            playerNameTurn: playerName,
        });
    }


    resetValues = (name1) => {
        this.setState({
            playerNameTurn: name1,
            cells: {
                '1-1': { checked: false, icon: (<div></div>) },
                '1-2': { checked: false, icon: (<div></div>) },
                '1-3': { checked: false, icon: (<div></div>) },
                '2-1': { checked: false, icon: (<div></div>) },
                '2-2': { checked: false, icon: (<div></div>) },
                '2-3': { checked: false, icon: (<div></div>) },
                '3-1': { checked: false, icon: (<div></div>) },
                '3-2': { checked: false, icon: (<div></div>) },
                '3-3': { checked: false, icon: (<div></div>) },
            }
        })
    }

    render() {
        const { playerNameTurn, cells } = this.state;
        const { name1, name2 } = this.props.match.params;
        const haveWinner = isWin(cells)
        const playerWinner = haveWinner.isWin ? playerNameTurn === name1 ? name2 : name1: '';
        const title = haveWinner.isWin ? (<h1 className='text-turn'> Bravo {playerWinner}!!!!! </h1>) : haveWinner.stopGame? (<h1>Match Nul !</h1>) : '';
        const props = {
            playerNameTurn,
            name1,
            name2,
            haveWinner: haveWinner,
            cells: cells,
            endTurn: this.endTurn
        }
        const player1Turn = playerNameTurn === name1 && !haveWinner.stopGame ? <h1 className='player-name player-1'> {name1}</h1> : <div className='player-container' />
        const player2Turn = playerNameTurn === name2 && !haveWinner.stopGame ? <h1 className='player-name player-2'> {name2}</h1> : <div className='player-container' />
        const grid = (
            <div>
                <div className='game-row'>
                    <Cell className='game-cells cells-1' name='1-1' {...props} />
                    <Cell className='game-cells cells-2' name='1-2' {...props} />
                    <Cell className='game-cells cells-3' name='1-3' {...props} />
                </div>
                <div className='game-row'>
                    <Cell className='game-cells cells-4' name='2-1' {...props} />
                    <Cell className='game-cells cells-5' name='2-2' {...props} />
                    <Cell className='game-cells cells-6' name='2-3' {...props} />
                </div>
                <div className='game-row'>
                    <Cell className='game-cells cells-7' name='3-1' {...props} />
                    <Cell className='game-cells cells-8' name='3-2' {...props} />
                    <Cell className='game-cells cells-9' name='3-3' {...props} />
                </div>
            </div>
        )
        return (
            <div className='container'>
                <div>
                    {title}
                    {player1Turn}
                    {!haveWinner.stopGame && grid}
                    {player2Turn}
                    {haveWinner.stopGame &&
                        <div className='user-end-game'>
                            <Link to='/' ><button className='button'>Rejouer avec de nouvelles personnes ?</button></Link>
                            <button className='button' onClick={() => this.resetValues(name1)} >Rejouer avec les mêmes personnes ?</button>
                        </div>}
                </div>

            </div>
        )
    }
}

export default withRouter(GamePage); 
import React, { Component } from 'react';
import croix from '../../assets/croix.svg';
import rond from '../../assets/rond.svg';
import { Link, withRouter } from 'react-router-dom';
import './index.css';

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
        return { stopGame: true };
    } else {
        return { stopGame: compteur === 8 };
    }
}

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerNameTurn: this.props.match.params.name1,
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
        }
    }

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
        let playerName, icon;
        if (playerNameTurn !== name1) {
            playerName = name2;
            icon = (<img src={croix} className="player2-img" alt="croix" />);
        } else {
            playerName = name1;
            icon = (<img src={rond} className="player2-img" alt="rond" />);
        }
        this.setState({
            cells: {
                ...cells,
                [cellData.name]: {
                    checked: true,
                    checkedBy: playerName,
                    icon: icon
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
        const { name1 } = this.props.match.params;
        const haveWinner = isWin(cells)
        return (
            <div className='container'>

                <div>
                    <h1 className='text-turn'> C'est au tour de {playerNameTurn}</h1>
                    <div>
                        <div className='game-row'>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '1-1', isWin: haveWinner.isWin })}>{cells['1-1'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '1-2', isWin: haveWinner.isWin })}>{cells['1-2'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '1-3', isWin: haveWinner.isWin })}>{cells['1-3'].icon}</div>
                        </div>
                        <div className='game-row'>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '2-1', isWin: haveWinner.isWin })}>{cells['2-1'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '2-2', isWin: haveWinner.isWin })}>{cells['2-2'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '2-3', isWin: haveWinner.isWin })}>{cells['2-3'].icon}</div>
                        </div>
                        <div className='game-row'>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '3-1', isWin: haveWinner.isWin })}>{cells['3-1'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '3-2', isWin: haveWinner.isWin })}>{cells['3-2'].icon}</div>
                            <div className='game-cells' onClick={() => this.endTurn({ name: '3-3', isWin: haveWinner.isWin })}>{cells['3-3'].icon}</div>
                        </div>
                    </div>
                    {haveWinner.stopGame &&
                        <div className='user-end-game'>
                            <Link to='/' ><button>Rejouer avec de nouvelles personnes ?</button></Link>
                            <button onClick={() => this.resetValues(name1)} >Rejouer avec les mêmes personnes ?</button>
                        </div>}
                </div>

            </div>
        )
    }
}

export default withRouter(GamePage); 
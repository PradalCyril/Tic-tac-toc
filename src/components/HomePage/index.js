import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: {
                player1: '',
                player2: ''
            }
        }
    }

    selectPlayer = (e) => {
        const inputName = e.target.name;
        const playerName = e.target.value;
        this.setState({ ...this.state, players: { ...this.state.players, [inputName]: playerName } })
    }
    render() {
        const {player1, player2} = this.state.players
        return (
            <div className='home-container'>
                <h1>Insert your names : </h1>
                <input className='input' type="text" autoComplete='off' name='player1' placeholder='player 1' onChange={this.selectPlayer} value={player1} />
                <input className='input' type="text" autoComplete='off' name='player2' placeholder='player 2' onChange={this.selectPlayer} value={player2}/>
                <Link to={`/play/${player1}/${player2}`}>Go play !</Link>
            </div>
        )
    }
}

export default HomePage; 
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './index.css';
import logo from '../../assets/tic tac toe.svg';

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

    handleSubmit = (e, click = {}) => {
        e.preventDefault();
        let { player1, player2 } = this.state.players;
        if (!player1 || !player2)
            return
        if (player1 === player2)
            player2 = player2 + '2';
        this.props.history.push(`/play/${player1}/${player2}`);
    }

    updatePlayerName = (e) => {
        const inputName = e.target.name;
        const playerName = e.target.value;
        this.setState({ ...this.state, players: { ...this.state.players, [inputName]: playerName } })
    }
    render() {
        const { player1, player2 } = this.state.players
        return (
            <form className='home-container' onSubmit={this.handleSubmit}>
                <img src={logo} className='logo' alt="logo"/>
                <input className='input' type="text" autoComplete='off' name='player1' placeholder='player 1' onChange={this.updatePlayerName} value={player1} />
                <input className='input' type="text" autoComplete='off' name='player2' placeholder='player 2' onChange={this.updatePlayerName} value={player2} />
                <button type='submit' className='homepage-btn'>Play</button>
            </form>
        )
    }
}

export default withRouter(HomePage) ; 
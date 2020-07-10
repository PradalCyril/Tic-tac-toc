import React, { Component } from 'react';
import croix from '../../../assets/croix.svg';
import rond from '../../../assets/rond.svg';

class Cell extends Component {
    state = {
        isUsed: false,
        icon: (<div></div>)
    }

    endTurn = () => {
        const { playerNameTurn, name1, endTurn, name, haveWinner } = this.props;
        if (haveWinner.stopGame || this.state.isUsed) return;
        let icon;
           if (playerNameTurn !== name1) {
            icon = (<img src={croix} className="player2-img" alt="croix" />);
        } else {
            icon = (<img src={rond} className="player2-img" alt="rond" />);
        }
        this.setState({icon, isUsed: true});
        endTurn({ name, isWin: haveWinner.stopGame });
    }

    render() {
        const { name, className } = this.props;

        return (
            <div
                id={`cell-${name}`}
                className={className}
                onClick={() => this.endTurn()}
            >
                {this.state.icon}
            </div>
        )
    }
}

export default Cell; 
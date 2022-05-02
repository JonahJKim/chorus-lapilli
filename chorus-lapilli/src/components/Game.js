import Board from './Board.js'
import React from 'react';
import '../index.css';
import calculateWinner from './CalculateWinner.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            copy: true,
            paste: false,
            tempStorage: null,
            last_i: null,
        }
    }
    

    handleClick(i) {
        if (this.state.stepNumber <= 5) {
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
            });
        }

        // if 6 or more moves
        else {
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || (squares[i] && (this.state.paste === true)) || ((squares[i] === null) && (this.state.copy === true))) {
                return;
            }
            if (this.state.copy === true) {
                let sameAsMiddle = ((squares[4] === 'X') === this.state.xIsNext) || ((squares[4] === 'O') === !this.state.xIsNext)
                if ((squares[4] !== null && i !== 4 && sameAsMiddle) || ((squares[i] === 'X') !== this.state.xIsNext) || ((squares[i] === 'O') === this.state.xIsNext)) {
                    return;
                }
                this.state.tempStorage = squares[i];
                this.setState({
                    last_i: i,
                    copy: false,
                    paste: true,
                })
            }
            else {
                squares[i] = this.state.tempStorage;
                squares[this.state.last_i] = null;
                this.setState({
                    history: history.concat([{
                        squares: squares,
                    }]),
                    stepNumber: this.state.stepNumber + 1,
                    copy: true,
                    paste: false,
                    xIsNext: !this.state.xIsNext,
                })
            }
        }

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else /*if (this.state.stepNumber <= 5)*/ {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }


export default Game;
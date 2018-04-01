import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  //className="square"
  return (
    <button
        className={`square ${props.winner?"highlight":""}`}
        onClick={props.onClick}>
    {props.value}
  </button>)
}

class Board extends React.Component {

  renderSquare(i) {
    console.log(this.props.hlsquares)
    return (
      <Square
      winner={this.props.highlight.indexOf(i) !== -1}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />)
  }

  render() {

    return (<div>
      <div className="row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>

    </div>)
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      isNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (calculateWinner(squares) || squares[i]){
      return
    }

    squares[i] = this.state.isNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      isNext: !this.state.isNext,
      stepNumber: history.length
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move # ${move}`
        : `Go to game start`
      return (<li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>)
    })

    let status, hlsquares = []
    if (winner) {
      status = 'winner: ' + winner['winner']
      hlsquares = winner['hlsquares'].slice()

    } else {
      if(this.state.stepNumber === 9){
            status = `The game resulted in a tie`
            alert(status)
      }else{

      status = `Next Player: ${ (this.state.isNext)
        ? 'X'
        : 'O'}`
      }
    }

    return (<div className="container">

      <div className="game-board">

        <h1>Tic Tac Toe</h1>
        <h2>{status}</h2>
        <Board
            highlight={hlsquares}
            squares={current.squares}
            onClick={i => this.handleClick(i)}/>
      </div>
      <div>
        <ol>{moves}</ol>
      </div>
    </div>)
  }
}

ReactDOM.render(<Game/>, document.getElementById('root'))

function calculateWinner(squares) {

  const lines = [
    [
      0, 1, 2
    ],
    [
      3, 4, 5
    ],
    [
      6, 7, 8
    ],
    [
      0, 3, 6
    ],
    [
      1, 4, 7
    ],
    [
      2, 5, 8
    ],
    [
      0, 4, 8
    ],
    [
      2, 4, 6
    ]
  ]

  let res = {
    'winner': null,
    'hlsquares': []
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      res['winner'] = squares[a]
      res['hlsquares'] = [a, b, c]
      return res
    }
  }
  return null
}

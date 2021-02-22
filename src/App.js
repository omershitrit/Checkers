import { useState, useEffect } from 'react';
import Board from './components/board.js';

const WHITE = 'W';
const BLACK = 'B';

const App = () => {
    const [tiles, setTiles] = useState(fillBoard());
    const [winner, setWinner] = useState(null);
    const [clicked, setClicked] = useState(null);
    const [turn, setTurn] = useState(WHITE);
    const [blackCounter, setBlackCounter] = useState(12);
    const [whiteCounter, setWhiteCounter] = useState(12);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (blackCounter === 0) {
            setWinner(WHITE);
        } else if (whiteCounter === 0) {
            setWinner(BLACK);
        } else {
            const opponent = turn === WHITE ? BLACK : WHITE;
            if (!isPlayerAbleToMove()) {
                setWinner(opponent);
            }
        }
    }, [blackCounter, whiteCounter]);

    const onClick = index => {
        if (winner) {
            console.log("Winner: ", winner);
            return;
        }
        // if a player clicked on a tile belong to the other player - don't do anything
        if (tiles[index].color !== null && tiles[index].color !== turn) {
            return;
        }
        setClicked(index);

        // check edges
        if (isCrossingEdges(clicked, index)) {
            return;
        }
        // if tiles[index] is an empty tile
        if (!tiles[index].color) {
            const direction = turn === BLACK ? -1 : 1;
            if (isAbleToMove(direction, index)) {
                if (isPlayerAbleToEat(direction)) {
                    setMessage("You must take you're opponent's picece first!");
                    return;
                }
                move(clicked, index);
            } else if (isAbleToEat(clicked, index, direction, 7, index)) {
                eat(clicked, direction, 7);
                move(clicked, index);
            } else if (isAbleToEat(clicked, index, direction, 9, index)) {
                eat(clicked, direction, 9);
                move(clicked, index);
            }
            setMessage("");
        }
    }

    const move = (src, dst) => {
        let tempTiles = [...tiles];
        tempTiles[src].color = null;
        tempTiles[dst].color = turn;
        setTurn(turn === WHITE ? BLACK : WHITE);
        setTiles(tempTiles);
        setClicked(null);
    }

    const eat = (src, direction, offset) => {
        let tempTiles = [...tiles];
        if (tempTiles[src + direction * offset].color === BLACK) {
            setBlackCounter(blackCounter - 1);
        } else if (tempTiles[src + direction * offset].color === WHITE) {
            setWhiteCounter(whiteCounter - 1)
        }
        tempTiles[src + direction * offset].color = null;
        setTiles(tempTiles);
    }

    // handle edge cases
    const isCrossingEdges = (src, dst) => {
        const direction = turn === BLACK ? -1 : 1;
        if (src % 8 === 0 && (dst - 6) % 8 === 0) {
            return true;
        } else if ((src - 1) % 8 === 0 && (dst - 7) % 8 === 0) {
            return true;
        }
        return false;
    }

    const isPlayerAbleToMove = () => {
        const direction = turn === BLACK ? -1 : 1;
        let flag = false;
        tiles.filter(tile => tile.color === turn).forEach(tile => {

            const dst1 = tile.index + direction * 7;
            const dst2 = tile.index + direction * 9;
            if (!tiles[dst1].color || !tiles[dst2].color) {
                flag = true;
            }
        })
        if (!flag) {
            return isPlayerAbleToEat(direction);
        }
        return flag;
    }

    const isPlayerAbleToEat = direction => {
        const playerPieces = tiles.filter(tile => tile.color === turn);
        let flag = false;
        playerPieces.forEach(tile => {
            const i1 = tile.index + direction * 7;
            const dst1 = tile.index + direction * 2 * 7;
            const i2 = tile.index + direction * 9;
            const dst2 = tile.index + direction * 2 * 9;
            if (tiles[i1].color && tiles[i1].color !== turn && !tiles[dst1].color) {
                // check edges
                if (i1 % 8 !== 0 && (i1 - 7) % 8 !== 0) {
                    flag = true;
                }
                // check edges
            } else if (tiles[i2].color && tiles[i2].color !== turn && !tiles[dst2].color) {
                if (i2 % 8 !== 0 && (i2 - 7) % 8 !== 0) {
                    flag = true;
                }
            }
        })
        return flag;
    }

    const isAbleToMove = (direction, index) => clicked + direction * 7 === index || clicked + direction * 9 === index;

    const isAbleToEat = (src, dst, direction, offset) => src + direction * offset * 2 === dst;

    const reset = () => {
        setTiles(fillBoard());
        setWinner(null);
        setClicked(null);
        setTurn(WHITE);
        setBlackCounter(12);
        setWhiteCounter(12);
    }

    return (
        <div className="wrapper">
            <Board onClick={onClick} tiles={tiles} />
            <div className="msg">{message}</div>
            <button className="btn" onClick={() => reset()}>Start Game</button>
        </div>
    );
}

const fillBoard = () => {
    let arr = Array(64).fill(null);
    const whitePieces = [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23];
    const blackPieces = [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62];
    whitePieces.forEach(i => arr[i] = { index: i, color: WHITE });
    blackPieces.forEach(i => arr[i] = { index: i, color: BLACK });
    for (let i = 0; i < 64; ++i) {
        if (arr[i] === null) {
            arr[i] = { index: i, color: null };
        }
    }
    return arr;
}

export default App;





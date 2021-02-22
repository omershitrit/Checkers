import Tile from './tile.js';

const Board = ({ tiles, onClick }) => {
    return (
        <div className="board">
            {tiles.map((tile, i) => <Tile key={i} index={i} color={tile.color} onClick={() => onClick(i)} />)}
        </div>
    );
}

export default Board;
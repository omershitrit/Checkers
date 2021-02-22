const Tile = ({ index, color, onClick }) => {
    const tileColor = calculateColor(index);
    const style = `tile ${tileColor}`;
    return (
        <div className={style} onClick={onClick}>
            <div className={color ? color : "ignore"} />
        </div>
    );
}

const calculateColor = index => {
    let flip = false;
    while (index > 7) {
        flip = !flip;
        index -= 8;
    }
    let res = index % 2 === 0;
    if (flip) {
        res = !res;
    }
    return res ? "light-blue" : "blue";
}

export default Tile;
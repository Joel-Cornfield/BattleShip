import Gameboard from "./Gameboard";

function HumanPlayer() {
    const board = Gameboard();
    const name = "Player";

    function getBoard() {
        return board;
    }

    function fullReset() {
        board.resetBoard();
    }

    return {
        fullReset, 
        getBoard,
        name,
    }
}

export default HumanPlayer;
import Gameboard from "./Gameboard";
import { getRandomInt, randomIndex } from "../utils/helpers";

function ComputerPlayer() {
    const board = Gameboard();
    const name = "Enemy";

    function getBoard() {
        return board;
    }

    function placeRandomShip(length) {
        let randX, randY, randAxis;
        do {
            randX = getRandomInt(10);
            randY = getRandomInt(10);
            randAxis = getRandomInt(2);
        } while (!board.checkShipValidity([randX, randY], randAxis, length))
        board.placeShip([randX, randY], randAxis, length);
    }

    function placeShips() {
        placeRandomShip(5);
        placeRandomShip(4);
        placeRandomShip(3);
        placeRandomShip(3);
        placeRandomShip(2);
    }

    function fullReset() {
        board.resetBoard();
        clearMemory();
        permanentMemory["queue"] = [];
    }

    // Attack Logic
    let memory = {
        attacked: false,
        axis: null,
        queue: [],
        hitList: [],
    };

    const permanentMemory = {
        queue: [],
    };

    function clearMemory() {
        memory = {
            attacked: false,
            axis: null,
            queue: [],
            hitList: [],
        };
    }

    function attack(target) {
        if (memory["attacked"]) {
            const index = randomIndex(memory["queue"]);
            const cell = memory["queue"][index];
            memory["queue"].splice(index, 1)
            attackAt(target, cell);
        } else {
            attackRandomly(target);
        }
    }

    function attackRandomly(target) {
        let randX, randY;
        const targetBoard = target.getBoard();
        do {
            randX = getRandomInt(10);
            randY = getRandomInt(10);
        } while (targetBoard.getCoordinates([randX, randY])["isHit"] === true)
        attackAt(target, {x: randX, y: randY, axis: null});

    }

    function attackAt(target, {x, y, axis}) {
        const targetBoard = target.getBoard();
        targetBoard.receiveAttack([x, y]);
        const hitCell = targetBoard.getCoordinates([x, y]);
        if (hitCell["ship"] && !hitCell["ship"].isSunk()) {
            memory["hitList"].push({x, y, axis});
            const neighbors = [
                {x: x + 1, y, axis: 0}, 
                {x: x - 1, y, axis: 0}, 
                {x, y: y + 1, axis: 1}, 
                {x, y: y - 1, axis: 1}
            ].filter((cell) => {
                return targetBoard.checkCoordinateValidity([cell["x"], cell["y"]])
                    && !targetBoard.getCoordinates([cell["x"], cell["y"]])["isHit"];
            });
            if ((memory["axis"] === null) && (axis !== null)) {
                // If the axis is unknown and it isn't our first hit, find out the axis
                memory["axis"] = axis;
                memory["queue"] = memory["queue"].filter((cell) => cell["axis"] === axis);
                
            }
            if (!memory["attacked"]) {
                // If it is our first hit and so axis is unknown, add all valid neighboring cells to queue 
                memory["attacked"] = true; 
                neighbors.forEach((cell) => {
                    memory["queue"].push(cell);
                });
            } else {
                // If axis is known, add valid neighboring cells only on that axis 
                neighbors.forEach((cell) => {
                    if (cell["axis"] === memory["axis"]) {
                        memory["queue"].push(cell);
                    }
                });
            }
        } else if (hitCell["ship"] && hitCell["ship"].isSunk()) {
            const tempAxis = memory["axis"];
            clearMemory();
            if (permanentMemory["queue"].length > 0) {
                memory["queue"].push(...permanentMemory["queue"].pop());
                memory["attacked"] = true;
                memory["axis"] = tempAxis;
            }
        }
        if (memory["attacked"] && memory["queue"].length === 0) {
            const newAxis = memory["axis"] === 0 ? 1 : 0;
            const tempHitList = [...memory["hitList"]];
            clearMemory()
            memory["attacked"] = true;
            memory["axis"] = newAxis;
            enqueueValidNeighbors(tempHitList, target);
        }
    }

    function enqueueValidNeighbors(cellsList, target) {
        const targetBoard = target.getBoard();
        cellsList.forEach(({x: x, y : y}) => {
            const neighbors = [
                {x: x + 1, y, axis: 0}, 
                {x: x - 1, y, axis: 0}, 
                {x, y: y + 1, axis: 1}, 
                {x, y: y - 1, axis: 1}
            ].filter((cell) => {
                return targetBoard.checkCoordinateValidity([cell["x"], cell["y"]])
                    && !targetBoard.getCoordinates([cell["x"], cell["y"]])["isHit"]
                    && cell["axis"] === memory["axis"];
            });
            permanentMemory["queue"].push(neighbors);
        });
        memory["queue"].push(...permanentMemory["queue"].pop());
    }

    return {
        getBoard,
        placeShips,
        attack,
        fullReset,
        attackAt,
        name,
    }
}

export default ComputerPlayer;
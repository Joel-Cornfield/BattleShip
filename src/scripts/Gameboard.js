import BoardCell from "./BoardCell";
import Ship from "./Ship";

function Gameboard() {
    let shipsAlive = 0;
    const board = [];
    for (let y = 0; y < 10; y++) {
        board[y] = [];
        for (let x = 0; x < 10; x++) {
            board[y][x] = BoardCell();
        }
    }

    function getCoordinates([x, y]) {
        return board[y][x];
    }

    function checkCoordinateValidity([x, y]) {
        if (x > 9 || x < 0 || y > 9 || y < 0) return false;
        return true;
    }

    function checkShipValidity([x, y], axis, length) {
        if (axis === 0) {
            // Check if out of bounds
            if (!checkCoordinateValidity([x + length - 1, y])) {
                return false;
            }
            // Check if collides with another ship
            for (let i = 0; i < length; i++) {
                if(getCoordinates([x + i, y])["ship"]) {
                    return false;
                }
            }
        } else {
            if (!checkCoordinateValidity([x, y + length - 1])) {
                return false;
            }
            for (let i = 0; i < length; i++) {
                if(getCoordinates([x, y + i])["ship"]) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkShipValidityRotation([x, y], axis, length) {
        if (axis === 0) {
            // Check if out of bounds
            if (!checkCoordinateValidity([x + length - 1, y])) {
                return false;
            }
            // Check if collides with another ship
            for (let i = 1; i < length; i++) {
                if(getCoordinates([x + i, y])["ship"]) {
                    return false;
                }
            }
        } else {
            if (!checkCoordinateValidity([x, y + length - 1])) {
                return false;
            }
            for (let i = 1; i < length; i++) {
                if(getCoordinates([x, y + i])["ship"]) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkShipValidityMoving([oldX, oldY], [x, y], axis, length) {
        const oldShipCells = getShipCells([oldX, oldY]).map((cell) => JSON.stringify(cell));

        if (axis === 0) {
            // Check if out of bounds
            if (!checkCoordinateValidity([x + length - 1, y])) {
                return false;
            }
            // Check for collisions with other ships
            for (let i = 0; i < length; i++) {
                if (getCoordinates([x + i, y])["ship"] && !oldShipCells.includes(JSON.stringify({y, x: x + i}))) {
                    return false;
                }
            }
        } else {
            if (!checkCoordinateValidity([x, y + length - 1])) {
                return false;
            }
            for (let i = 0; i < length; i++) {
                if (getCoordinates([x, y + i])["ship"] && !oldShipCells.includes(JSON.stringify({y: y + i, x}))) {
                    return false;
                }
            }
        }
        return true;           
    }
    
    function placeShip([x, y], axis, length) {
        // Create a new ship object with the specified length
        const newShip = Ship(length);

        if (axis === 0) { 
            // Loop through each segment of the ship
            for (let i = 0; i < length; i++) {
                // Get the coordinates for the current segment of the ship
                getCoordinates([x + i, y])["ship"] = newShip; // Assign the ship to the coordinates
                getCoordinates([x + i, y])["shipStart"] = [x, y]; // Mark the starting coordinates of the ship
                // Set the direction for the first and last segments of the ship
                if (i === 0) {
                    getCoordinates([x + i, y])["direction"] = "left"; // First segment points left
                } else if (i === (length - 1)) {
                    getCoordinates([x + i, y])["direction"] = "right"; // Last segment points right
                }
            }
        } else {
            for (let i = 0; i < length; i++) {
                getCoordinates([x, y + i])["ship"] = newShip; 
                getCoordinates([x, y + i])["shipStart"] = [x, y]; 
                if (i === 0) {
                    getCoordinates([x, y + i])["direction"] = "up"; // First segment points up
                } else if (i === (length - 1)) {
                    getCoordinates([x, y + i])["direction"] = "down"; // Last segment points down
                }
            }
        }
        // Increment the count of ships that are currently alive
        shipsAlive += 1;
    }

    function rotatedShipInfo([x, y]) {
        const targetCell = getCoordinates([x, y]);
        const [startX, startY] = targetCell["shipStart"];
        const startDirection = getCoordinates([startX, startY])["direction"];
        const newAxis = (startDirection === "up") ? 0 : 1;
        const length = targetCell["ship"]["length"];
        return [[startX, startY], newAxis, length];
    }

    function removeShip([x, y]) {
        const targetCell = getCoordinates([x, y]);
        const [startX, startY] = targetCell["shipStart"];
        const startDirection = getCoordinates([startX, startY])["direction"];
        const length = targetCell["ship"]["length"];
        if (startDirection === "left") { 
            for (let i = 0; i < length; i++) {
                board[startY][startX + i] = BoardCell();
            }
        } else {
            for (let i = 0; i < length; i++) {
                board[startY + i][startX] = BoardCell();
            }
        }
        shipsAlive -= 1;
    }

    function rotateShip([x, y]) {
        const rotatedInfo = rotatedShipInfo([x, y]);
        removeShip([x, y]);
        placeShip(...rotatedInfo);
    }

    // Returns an array of absolute cell coordinates occupied by the ship based on its starting position and direction.
    function getShipCells([x, y]) {
        const shipCells = [];
        const targetCell = getCoordinates([x, y]);
        const [startX, startY] = targetCell["shipStart"];
        const startDirection = getCoordinates([startX, startY])["direction"];
        const length = targetCell["ship"]["length"];
        if (startDirection === "left") {
            for (let i = 0; i < length; i++) {
                shipCells.push({y: startY, x: startX + i});
            }
        } else {
            for (let i = 0; i < length; i++) {
                shipCells.push({y: startY + i, x: startX});
            }
        }
        return shipCells;
    }

    // Returns an array of relative cell coordinates occupied by the ship based on its starting position and direction.
    function getShipCellsRelative([x, y]) {
        const shipCells = [];
        const targetCell = getCoordinates([x, y])
        const [startX, startY] = targetCell["shipStart"];
        const startDirection = getCoordinates([startX, startY])["direction"];
        const length = targetCell["ship"]["length"];
        if (startDirection === "left") {
            for (let i = 0; i < length; i++) {
                shipCells.push([(startX + i) - x, startY - y]);
            }
        } else {
            for (let i = 0; i < length; i++) {
                shipCells.push([startX - x, (startY + i) - y]); 
            }
        }
        return shipCells;
    }

    function getShipName(length) {
        switch(length) {
            case 5:
                return "Carrier" + ` (${length})`;
            case 4:
                return "Battleship" + ` (${length})`;
            case 3:
                return "Cruiser" + ` (${length})`;
            case 2:
                return "Destroyer" + ` (${length})`;
        }
    }

    function receiveAttack([x, y]) {
        const currentCell = getCoordinates([x, y]);
        const currentShip = currentCell["ship"];
        currentCell["isHit"] = true;
        if (currentShip) {
            currentShip.hit();
            if (currentShip.isSunk()) {
                shipsAlive -= 1;
                const shipName = getShipName(currentShip["length"]);
                return shipName;
            }
        }
    }

    function allSunk() {
        if (shipsAlive <= 0) {
            return true;
        }
        return false;
    }

    function resetBoard() {
        shipsAlive = 0;
        for (let y = 0; y < 10; y++) {
            board[y] = [];
            for (let x = 0; x < 10; x++) {
                board[y][x] = BoardCell();
            }
        }
    }
    
    return {
        getCoordinates,
        checkCoordinateValidity,
        checkShipValidity,
        placeShip,
        receiveAttack,
        allSunk,
        resetBoard,
        removeShip,
        rotateShip,
        rotatedShipInfo,
        checkShipValidityRotation,
        checkShipValidityMoving,
        getShipCells,
        getShipCellsRelative,
    }
}

export default Gameboard;

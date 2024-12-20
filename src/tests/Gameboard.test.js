import Gameboard from "../scripts/Gameboard.js";

// Place ships on board

test("Ship gets placed on the board - length 2, X axis", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 0, 2); // Place ship of length 2 at (5; 6) coordinates at X axis
    expect(board.getCoordinates([5, 6])["ship"]).toBeTruthy();
    expect(board.getCoordinates([6, 6])["ship"]).toBeTruthy();
});

test("Ship gets placed on the board - length 2, Y axis", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 1, 2); // Place ship of length 2 at (5; 6) coordinates at Y axis
    expect(board.getCoordinates([5, 6])["ship"]).toBeTruthy();
    expect(board.getCoordinates([5, 7])["ship"]).toBeTruthy();
});

test("Ship gets placed on the board - length 3, X axis", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 0, 3); // Place ship of length 3 at (5; 6) coordinates at X axis
    expect(board.getCoordinates([5, 6])["ship"]).toBeTruthy();
    expect(board.getCoordinates([6, 6])["ship"]).toBeTruthy();
    expect(board.getCoordinates([7, 6])["ship"]).toBeTruthy();
});

// Placed ships face the right way

test("Ship gets placed on the board - x axis", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 0, 3); // Place ship of length 3 at (5; 6) coordinates at X axis
    expect(board.getCoordinates([5, 6])["direction"]).toBe("left");
    expect(board.getCoordinates([6, 6])["direction"]).toBe("none");
    expect(board.getCoordinates([7, 6])["direction"]).toBe("right");
});

test("Ship gets placed on the board - y axis", () => {
    const board = Gameboard();
    board.placeShip([2, 3], 1, 4); // Place ship of length 4 at (2; 3) coordinates at Y axis
    expect(board.getCoordinates([2, 3])["direction"]).toBe("up");
    expect(board.getCoordinates([2, 4])["direction"]).toBe("none");
    expect(board.getCoordinates([2, 5])["direction"]).toBe("none");
    expect(board.getCoordinates([2, 6])["direction"]).toBe("down");
});

// Placed ships know starting coordinates

test("Ship starting coordinates get saved correctly", () => {
    const board = Gameboard();
    board.placeShip([2, 3], 1, 4); // Place ship of length 4 at (2; 3) coordinates at Y axis
    expect(board.getCoordinates([2, 3])["shipStart"]).toStrictEqual([2, 3]);
    expect(board.getCoordinates([2, 4])["shipStart"]).toStrictEqual([2, 3]);
    expect(board.getCoordinates([2, 5])["shipStart"]).toStrictEqual([2, 3]);
    expect(board.getCoordinates([2, 6])["shipStart"]).toStrictEqual([2, 3]);
});

// Check invalid ship placements

test("Identify valid ship placement", () => {
    const board = Gameboard();
    const validity = board.checkShipValidity([5, 6], 0, 3); // Check validity of ship of length 3 at (5; 6) coordinates at X axis
    expect(validity).toBe(true); 
});

test("Ship cant get out of bounds of the grid - X axis", () => {
    const board = Gameboard();
    const validity = board.checkShipValidity([8, 8], 0, 3); // Check validity of ship of length 3 at (8; 8) coordinates at X axis
    expect(validity).toBe(false); 
});

test("Ship cant get out of bounds of the grid - Y axis", () => {
    const board = Gameboard();
    const validity = board.checkShipValidity([8, 8], 1, 3); // Check validity of ship of length 3 at (8; 8) coordinates at Y axis
    expect(validity).toBe(false); 
});

test("Ships cant collide", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 1, 2); // Place ship of length 2 at (5; 6) coordinates at Y axis
    const validity = board.checkShipValidity([4, 7], 0, 3); // Check validity of ship of length 3 at (4; 7) coordinates at X axis
    expect(validity).toBe(false); 
});

// Ship removal

test("Ship gets removed correctly - starting coordinates", () => {
    const board = Gameboard();
    board.placeShip([4, 6], 0, 4); // Place ship of length 4 at (4; 6) coordinates at X axis
    board.removeShip([4, 6]);
    expect(board.getCoordinates([4, 6])["ship"]).toBeFalsy();
    expect(board.getCoordinates([5, 6])["ship"]).toBeFalsy();;
    expect(board.getCoordinates([6, 6])["ship"]).toBeFalsy();
    expect(board.getCoordinates([7, 8])["ship"]).toBeFalsy();
});

test("Ship gets removed correctly - non-starting coordinates", () => {
    const board = Gameboard();
    board.placeShip([4, 6], 0, 4); // Place ship of length 4 at (4; 6) coordinates at X axis
    board.removeShip([6, 6]);
    expect(board.getCoordinates([4, 6])["ship"]).toBeFalsy();
    expect(board.getCoordinates([5, 6])["ship"]).toBeFalsy();;
    expect(board.getCoordinates([6, 6])["ship"]).toBeFalsy();
    expect(board.getCoordinates([7, 8])["ship"]).toBeFalsy();
});

// Ship Rotation

test("Ship gets rotated correctly - X axis to Y axis", () => {
    const board = Gameboard();
    board.placeShip([4, 5], 0, 4); // Place ship of length 4 at (4; 5) coordinates at X axis
    board.rotateShip([4, 5]);
    expect(board.getCoordinates([4, 5])["ship"]).toBeTruthy();
    expect(board.getCoordinates([4, 6])["ship"]).toBeTruthy();
    expect(board.getCoordinates([4, 7])["ship"]).toBeTruthy();
    expect(board.getCoordinates([4, 8])["ship"]).toBeTruthy();

    expect(board.getCoordinates([5, 5])["ship"]).toBeFalsy();;
    expect(board.getCoordinates([6, 5])["ship"]).toBeFalsy();
    expect(board.getCoordinates([7, 5])["ship"]).toBeFalsy();
});

test("Ship gets rotated correctly - Y axis to X axis", () => {
    const board = Gameboard();
    board.placeShip([4, 5], 1, 3); // Place ship of length 3 at (4; 5) coordinates at Y axis
    board.rotateShip([4, 5]);
    expect(board.getCoordinates([4, 5])["ship"]).toBeTruthy();
    expect(board.getCoordinates([5, 5])["ship"]).toBeTruthy();
    expect(board.getCoordinates([6, 5])["ship"]).toBeTruthy();

    expect(board.getCoordinates([4, 6])["ship"]).toBeFalsy();;
    expect(board.getCoordinates([4, 7])["ship"]).toBeFalsy();
});

test("Ship gets rotated correctly - non-starting coordinates", () => {
    const board = Gameboard();
    board.placeShip([4, 5], 1, 3); // Place ship of length 3 at (4; 5) coordinates at Y axis
    board.rotateShip([4, 6]);
    expect(board.getCoordinates([4, 5])["ship"]).toBeTruthy();
    expect(board.getCoordinates([5, 5])["ship"]).toBeTruthy();
    expect(board.getCoordinates([6, 5])["ship"]).toBeTruthy();

    expect(board.getCoordinates([4, 6])["ship"]).toBeFalsy();;
    expect(board.getCoordinates([4, 7])["ship"]).toBeFalsy();
});

// Attack logic

test("Missed shots get recorded", () => {
    const board = Gameboard();
    board.receiveAttack([5, 6]);
    expect(board.getCoordinates([5, 6])["isHit"]).toBe(true);
});

test("Ships take damage after being attacked", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 0, 1); // Place ship of length 1 at (5; 6) coordinates at X axis
    board.receiveAttack([5, 6]);
    expect(board.getCoordinates([5, 6])["ship"].isSunk()).toBe(true);
});

test("Report when all ships are sunk", () => {
    const board = Gameboard();
    board.placeShip([5, 6], 0, 1); // Place ship of length 1 at (5; 6) coordinates at X axis
    board.receiveAttack([5, 6]);
    expect(board.allSunk()).toBe(true);
});
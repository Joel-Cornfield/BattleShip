import ComputerPlayer from "../scripts/ComputerPlayer.js";
import HumanPlayer from "../scripts/HumanPlayer.js";

test("Randomly places all ships in valid locations", () => {
    const cp = ComputerPlayer();
    cp.placeShips();
    const board = cp.getBoard();
    let shipsNum = 0;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (board.getCoordinates([x, y])["ship"]) {
                shipsNum += 1;
            }
        }
    }
    
    expect(shipsNum).toBe(17);
});

test("Randomly attacks player", () => {
    const cp = ComputerPlayer();
    const target = HumanPlayer();
    const targetBoard = target.getBoard();
    cp.attack(target);
    let hits = 0
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (targetBoard.getCoordinates([x, y])["isHit"] === true) {
                hits += 1;
            }
        }
    }
    expect(hits).toBe(1);
});

test("Attacks surrounding cells after landing hit", () => {
    const cp = ComputerPlayer();
    const target = HumanPlayer();
    const targetBoard = target.getBoard();
    targetBoard.placeShip([5, 5], 0, 3);
    cp.attackAt(target, {x: 5, y: 5, axis: null});
    cp.attack(target);
    let hits = 0;
    [
        targetBoard.getCoordinates([4, 5]),
        targetBoard.getCoordinates([6, 5]),
        targetBoard.getCoordinates([5, 4]),
        targetBoard.getCoordinates([5, 6])
    ].forEach((cell) => {
        if (cell["isHit"] === true) {
            hits += 1;
        } 
    });
    expect(hits).toBe(1);
});

test("Follows direction of ship after landing hit", () => {
    const cp = ComputerPlayer();
    const target = HumanPlayer();
    const targetBoard = target.getBoard();
    targetBoard.placeShip([2, 5], 0, 5);
    cp.attackAt(target, {x: 2, y: 5, axis: null});
    cp.attack(target);
    cp.attack(target);
    cp.attack(target);
    cp.attack(target);
    cp.attack(target);
    cp.attack(target);
    cp.attack(target);
    expect(targetBoard.getCoordinates([6, 5])["ship"].isSunk()).toBe(true);
});

// This will sometimes fail randomly, its fine
test("Recognizes when ships are next to each-other", () => {
    const cp = ComputerPlayer();
    const target = HumanPlayer();
    const targetBoard = target.getBoard();
    targetBoard.placeShip([3, 5], 0, 3);
    targetBoard.placeShip([2, 4], 0, 3);
    cp.attackAt(target, {x: 3, y: 5, axis: null});
    for (let i = 0; i < 20; i++) {
        cp.attack(target);
    }
    expect(targetBoard.getCoordinates([3, 5])["ship"].isSunk()).toBe(true);
    expect(targetBoard.getCoordinates([2, 4])["ship"].isSunk()).toBe(true);
});
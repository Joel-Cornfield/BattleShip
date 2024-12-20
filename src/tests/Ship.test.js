import Ship from "../scripts/Ship.js";

test("ship of length 2 gets sunk after getting hit 2 times", () => {
    const newShip = Ship(2);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
});

test("ship of length 3 gets sunk after getting hit 3 times", () => {
    const newShip = Ship(3);
    newShip.hit();
    newShip.hit();
    newShip.hit()
    expect(newShip.isSunk()).toBe(true);
});

test("ship of length 2 stays unsunk after getting hit 1 times", () => {
    const newShip = Ship(2);
    newShip.hit();
    expect(newShip.isSunk()).toBe(false);
});
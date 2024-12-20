function Ship(length) {
    let hitPoints = length;

    function hit() {
        hitPoints -= 1;
    }

    function isSunk() {
        return hitPoints === 0;
    }

    return {
        hit, isSunk, length
    }
}

export default Ship;
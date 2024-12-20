function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
} 

export {
    getRandomInt, 
    randomIndex
};
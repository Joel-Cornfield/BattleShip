import hitMark from '../assets/hit-mark.png';
import explosionGif from '../assets/explosion.gif'; 

function SingleplayerDomFunctions(enemy, player) {
    let gameStarted = false;
    let gameEnded = false;

    (() => {
        placeDefaultPlayerShips();
        drawGridEnemy();
        drawGridPlayer();
        startSetupPhase();
    })();

    (() => {
        const infoDiv = document.querySelector(".info");
        const startButton = infoDiv.querySelector("button");
        startButton.addEventListener("click", () => {
            if (gameEnded) {
                showStartMenu();
                placeDefaultPlayerShips();
                gameEnded = false;
                gameStarted = false;
                drawGridEnemy();
                drawGridPlayer();
                startSetupPhase();
            } else if (!gameEnded && !gameStarted) {
                enemy.placeShips();  
                endSetupPhase();
                hideMenu(); 
                gameStarted = true;
                gameEnded = false;  
            }
            
        });
    })();

    function placeDefaultPlayerShips() {
        const playerBoard = player.getBoard();
        playerBoard.placeShip([1, 4], 1, 5);
        playerBoard.placeShip([2, 5], 1, 4);
        playerBoard.placeShip([3, 6], 1, 3);
        playerBoard.placeShip([4, 6], 1, 3);
        playerBoard.placeShip([5, 7], 1, 2);
    }

    function drawGridPlayer() {
        const grid = document.querySelector(".grid.player");
        grid.textContent = "";
        const board = player.getBoard();
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell =  board.getCoordinates([x, y]);
                const gridCell = document.createElement("div");
                gridCell.classList.add("grid-cell");
                gridCell.classList.add(cell["direction"]);
                if (cell["ship"]) {
                    gridCell.classList.add("ship");
                    if (!gameStarted && !gameEnded) {
                        gridCell.addEventListener("contextmenu", (e) => {
                            e.preventDefault();
                            if (board.checkShipValidityRotation(...board.rotatedShipInfo([x, y]))) {
                                board.rotateShip([x, y]);
                                drawGridPlayer();
                                startSetupPhase();
                            }    
                        });
                    }
                }
                if (cell["isHit"] && cell["ship"]) {
                    gridCell.classList.add("hit-strike");
                    const strikeImg = document.createElement("img");
                    strikeImg.src = hitMark;
                    const hitMarker = document.createElement("div");
                    hitMarker.classList.add("strike-marker");
                    hitMarker.appendChild(strikeImg);
                    gridCell.appendChild(hitMarker);
                } else if (cell["isHit"] && !cell["ship"]) {
                    gridCell.classList.add("hit-miss");
                    const hitMarker = document.createElement("div");
                    hitMarker.classList.add("miss-marker");                
                    gridCell.appendChild(hitMarker);
                }
                gridCell.dataset.x = x;
                gridCell.dataset.y = y;
                grid.appendChild(gridCell);
            }
        }   
        
    }
    
    function drawGridEnemy() {
        const grid = document.querySelector(".grid.enemy");
        grid.textContent = "";
        const board = enemy.getBoard();
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = board.getCoordinates([x, y]);
                const gridCell = document.createElement("div");
                gridCell.classList.add("grid-cell");
                if (cell["isHit"] && cell["ship"]) {
                    gridCell.classList.add("ship");
                    if (cell["ship"].isSunk()) {
                        gridCell.classList.add(cell["direction"]);
                    }
                    
                    const hitContainer = document.createElement("div");
                    hitContainer.classList.add("hit-container");
                    
                    // Only show explosion if this is a newly hit cell
                    if (cell.isNewHit) {
                        const explosionImg = document.createElement("img");
                        explosionImg.src = explosionGif;
                        explosionImg.classList.add("explosion-effect");
                        hitContainer.appendChild(explosionImg);
                        
                        // Remove the explosion element completely after animation
                        setTimeout(() => {
                            explosionImg.remove();
                            delete cell.isNewHit;
                        }, 1000);
                    }
                    
                    const hitMarker = document.createElement("div");
                    hitMarker.classList.add("strike-marker");
                    const strikeImg = document.createElement("img");
                    strikeImg.src = hitMark;
                    hitMarker.appendChild(strikeImg);
                    
                    if (cell.isNewHit) {
                        hitMarker.style.display = "none";
                        setTimeout(() => {
                            hitMarker.style.display = "block";
                            gridCell.classList.add("hit-strike");
                        }, 1000);
                    } else {
                        gridCell.classList.add("hit-strike");
                    }
                    
                    hitContainer.appendChild(hitMarker);
                    gridCell.appendChild(hitContainer);
                } else if (cell["isHit"] && !cell["ship"]) {
                    gridCell.classList.add("hit-miss");
                    const hitMarker = document.createElement("div");
                    hitMarker.classList.add("miss-marker");                
                    gridCell.appendChild(hitMarker);
                }
                gridCell.dataset.x = x;
                gridCell.dataset.y = y;
                gridCell.addEventListener("click", attackEnemyEventHandler.bind(this, x, y));
                grid.appendChild(gridCell);
            }
        }   
    }

    function showMessage(message) {
        const messageBox = document.querySelector(".message");
        const messageParagraph = messageBox.querySelector("p");
        messageParagraph.textContent = message;
        messageBox.classList.remove("message-anim");
        void messageBox.offsetWidth;
        messageBox.classList.add("message-anim");
    }

    function revealEnemyShips() {
        const grid = document.querySelector(".grid.enemy");
        const board = enemy.getBoard();
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = board.getCoordinates([x, y]);
                if (cell["ship"]) {
                    const gridCell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                    gridCell.classList.add("ship");
                    gridCell.classList.add(cell["direction"]);
                }
            }
        }  
    }
    
    function attackEnemyEventHandler(x, y) {
        if (!gameEnded && gameStarted) {
            const board = enemy.getBoard();
            if (!board.getCoordinates([x, y])["isHit"]) {
                // Mark this as a new hit before receiving the attack
                const cell = board.getCoordinates([x, y]);
                if (cell["ship"]) {
                    cell.isNewHit = true;
                }
                
                const message = board.receiveAttack([x, y]);
                drawGridEnemy();
                if (message) {
                    showMessage(`${player["name"]} has sunk ${enemy["name"]}'s ${message}`);
                }
                if (board.allSunk()) {
                    showMessage(`${player.name} Won!`);
                    gameEndHandler();
                    return;
                }
                enemy.attack(player);
                drawGridPlayer();
                if (player.getBoard().allSunk()) {
                    showMessage(`${player.name} Lost!`);
                    revealEnemyShips();
                    gameEndHandler();
                    return;
                }
            }
        }
    }

    function gameEndHandler() {
        player.fullReset();
        enemy.fullReset();
        gameEnded = true;
        showResetMenu();
    }

    function startSetupPhase() {
        const board = player.getBoard();
        const grid = document.querySelector(".grid.player");
        const allCells = grid.querySelectorAll(".grid-cell");
        const allShipCells = grid.querySelectorAll(".ship");
        const dragInvis = document.querySelector(".drag-invis");

        let valid;
        const dragged = {};

        allShipCells.forEach((cell) => {
            cell.setAttribute("draggable", "true");

            cell.addEventListener("dragstart", (e) => {
                e.dataTransfer.setDragImage(dragInvis, 0, 0);
                cell.classList.add("dragging");
                dragged["x"] = Number(cell.dataset.x);
                dragged["y"] = Number(cell.dataset.y);
                dragged["startX"] = board.getCoordinates([dragged["x"], dragged["y"]])["shipStart"][0];
                dragged["startY"] = board.getCoordinates([dragged["x"], dragged["y"]])["shipStart"][1];
                dragged["deltaX"] = dragged["startX"] - dragged["x"];
                dragged["deltaY"] = dragged["startY"] - dragged["y"];
                dragged["axis"] =  board.getCoordinates([dragged["startX"], dragged["startY"]])["direction"] == "up" ? 1 : 0;
                dragged["relativeShipPositions"] = board.getShipCellsRelative([cell.dataset.x, cell.dataset.y]);
                const shipGridCells = [];
                dragged["relativeShipPositions"].forEach(([x, y]) => {
                    shipGridCells.push(grid.querySelector(`[data-x="${Number(cell.dataset.x) + x}"][data-y="${Number(cell.dataset.y) + y}"]`));
                });
                shipGridCells.forEach((gridCell) => {
                    gridCell.classList.add("dragged-along");
                });
            });

            cell.addEventListener("dragend", () => {
                cell.classList.remove("dragging");
                grid.querySelectorAll(".dragged-along").forEach((element) => {
                    element.classList.remove("dragged-along");
                });
                grid.querySelectorAll(".preview").forEach((previewCell) => {
                    previewCell.classList.remove("preview");
                    previewCell.classList.remove("valid");
                    previewCell.classList.remove("invalid");
                });
            });
        });

        grid.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        allCells.forEach((cell) => {
            cell.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            cell.addEventListener("dragenter", () => {
                const [x, y] = [Number(cell.dataset.x), Number(cell.dataset.y)]
                const previewCells = [];
                const absolutePositions = [];
                dragged["relativeShipPositions"].forEach(([relX, relY]) => {
                    const absolutePos = [x + relX, y + relY];
                    absolutePositions.push(absolutePos);
                });
                absolutePositions.forEach(([absX, absY]) => {
                    const previewCell = grid.querySelector(`[data-x="${absX}"][data-y="${absY}"]`);
                    valid = true;
                    if (!board.checkCoordinateValidity([x + dragged["deltaX"], y + dragged["deltaY"]]) 
                        || !board.checkShipValidityMoving([dragged["x"], dragged["y"]], [x + dragged["deltaX"], y + dragged["deltaY"]], dragged["axis"], absolutePositions.length)) {
                        valid = false;
                    }
                    if (previewCell) {
                        previewCells.push(previewCell);
                    }
                });
                previewCells.forEach((previewCell) => {
                    if (valid) {
                        previewCell.classList.add("preview");
                        previewCell.classList.add("valid");
                    } else {
                        previewCell.classList.add("preview");
                        previewCell.classList.add("invalid");
                    }
                    
                });
            });

            cell.addEventListener("dragleave", () => {
                grid.querySelectorAll(".preview").forEach((previewCell) => {
                    previewCell.classList.remove("preview");
                    previewCell.classList.remove("valid");
                    previewCell.classList.remove("invalid");
                });
            });

            cell.addEventListener("drop", () => {
                if (valid) {
                    const [x, y] = [Number(cell.dataset.x), Number(cell.dataset.y)];
                    const [startX, startY] = [x + dragged["deltaX"], y + dragged["deltaY"]];
                    board.removeShip([dragged["x"], dragged["y"]]);
                    board.placeShip([startX, startY], dragged["axis"], dragged["relativeShipPositions"].length);
                    drawGridPlayer();
                    startSetupPhase();
                }
            });
        });
    }

    function endSetupPhase() {
        const shipCells = document.querySelectorAll(".player .ship");
        shipCells.forEach((cell) => {
            cell.removeAttribute("draggable");
        });
    }

    function showResetMenu() {
        const infoDiv = document.querySelector(".info");
        const button = infoDiv.querySelector("button");
        const infoParagraph = infoDiv.querySelector("p");
        button.textContent = "Reset";
        infoParagraph.classList.add("hidden");
        infoDiv.classList.remove("hidden");
    }

    function showStartMenu() {
        const infoDiv = document.querySelector(".info");
        const button = infoDiv.querySelector("button");
        const infoParagraph = infoDiv.querySelector("p");
        button.textContent = "Start";
        infoParagraph.classList.remove("hidden");
    }

    function hideMenu() {
        const infoDiv = document.querySelector(".info");
        infoDiv.classList.add("hidden");
    }

    return {drawGridEnemy, drawGridPlayer};
}


export default SingleplayerDomFunctions;
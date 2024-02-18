var timerInterval = null;
var secondsRemaining = 15;
var Cube = /** @class */ (function () {
    function Cube() {
        this.container = document.getElementById("container");
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }
    Cube.prototype.cubeLeftShift = function () {
        var _a;
        var containerCopy = Array.from(this.container.childNodes);
        var isEmptyColumn = new Array(5).fill(true);
        // Identify empty columns
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                if (!containerCopy[i * 5 + j].classList.contains("empty")) {
                    isEmptyColumn[j] = false;
                }
            }
        }
        // Shift columns left if an entire column is empty
        for (var col = 0; col < 5; col++) {
            if (isEmptyColumn[col]) {
                // Shift all columns to the right of it one position to the left
                for (var row = 0; row < 5; row++) {
                    for (var shiftCol = col; shiftCol < 5 - 1; shiftCol++) {
                        var currentIndex = row * 5 + shiftCol;
                        var nextIndex = row * 5 + shiftCol + 1;
                        // Swap the current and next columns
                        _a = [containerCopy[nextIndex], containerCopy[currentIndex]], containerCopy[currentIndex] = _a[0], containerCopy[nextIndex] = _a[1];
                    }
                }
                // Adjust for the shift when checking subsequent columns
                isEmptyColumn.splice(col, 1);
                isEmptyColumn.push(false); // Assume last column is now non-empty
                col--; // Re-check the current column index due to the shift
            }
        }
        this.updateContainer(containerCopy);
    };
    Cube.prototype.cubeGravity = function (idx) {
        var _a;
        var containerCopy = Array.from(this.container.childNodes);
        var row = Math.floor(idx / 5);
        for (var i = 0; i < row; i++) {
            // Swap elements in the copied array
            _a = [containerCopy[idx - 5 * (i + 1)], containerCopy[idx - 5 * i]], containerCopy[idx - 5 * i] = _a[0], containerCopy[idx - 5 * (i + 1)] = _a[1];
        }
        // Update the live container with the modified copy
        this.updateContainer(containerCopy);
    };
    Cube.prototype.updateContainer = function (containerCopy) {
        var _this = this;
        // Clear the container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        // Append nodes from the modified copy
        containerCopy.forEach(function (node) {
            _this.container.appendChild(node);
        });
    };
    Cube.prototype.getAdjacentCubes = function (cube) {
        var idx = Array.from(this.container.childNodes).indexOf(cube);
        var adjacentCubes = [];
        var row = Math.floor(idx / 5);
        var col = idx % 5;
        if (col - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 1]);
        if (col + 1 < 5)
            adjacentCubes.push(this.container.childNodes[idx + 1]);
        if (row - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 5]);
        if (row + 1 < 5)
            adjacentCubes.push(this.container.childNodes[idx + 5]);
        return adjacentCubes;
    };
    Cube.prototype.removeConnectedCubes = function () {
        var _this = this;
        var connectedCubes = this.getConnectedCubes();
        if (connectedCubes.size === 1) {
            console.log("No connected cubes");
        }
        else {
            connectedCubes.forEach(function (cube) {
                cube.classList.remove(_this.color);
                cube.classList.add("empty");
                cube.removeEventListener("click", _this.squareClick);
                _this.cubeGravity(Array.from(_this.container.childNodes).indexOf(cube)); // Apply gravity to the cubes so empty cubes are at top
            });
            this.cubeLeftShift();
        }
    };
    Cube.prototype.getRandomColorClass = function () {
        var colors = ["cuber", "cubeg", "cubeb"];
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    Cube.prototype.getConnectedCubes = function () {
        var _this = this;
        var connectedCubes = new Set();
        var queue = [this.element];
        while (queue.length > 0) {
            var currentCube = queue.shift();
            connectedCubes.add(currentCube);
            var neighbors = this.getAdjacentCubes(currentCube);
            neighbors.forEach(function (neighbor) {
                if (!connectedCubes.has(neighbor) && neighbor.classList.contains(_this.color)) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor);
                }
            });
        }
        return connectedCubes;
    };
    Cube.prototype.checkwin = function () {
        var container = document.getElementById("container");
        var divsInsideContainer = container.querySelectorAll('.empty');
        if (divsInsideContainer.length === 25) {
            endGame("win");
        }
        if (!checkSolvable()) {
            endGame("lose");
        }
    };
    Cube.prototype.squareClick = function () {
        this.removeConnectedCubes();
        this.checkwin();
    };
    return Cube;
}());
//The functions below together checks solvability of the board
function helpFunct(container, queue, path) {
    if (path === void 0) { path = []; }
    if (getColorCount(container).includes(1)) {
        console.log("FAIL, SINGLE:", path);
        return false;
    }
    var c = 0;
    container.forEach(function (cube) {
        if (cube.classList.contains("empty")) {
            c++;
        }
    });
    if (c === 25) {
        console.log("SOLVE:", path); // Path is one of the sequences of clicks that solves the board
        return true;
    }
    else if (queue.length === 0) {
        console.log("FAIL, NO QUEUE:", path);
        return false;
    }
    while (queue.length > 0) {
        var connectedCubes = queue.shift();
        var _a = cubesUpdate(container, connectedCubes), updatedContainer = _a[0], possibleClick = _a[1]; // [container, possibleClicks
        var updatedQueue = updateQueue(updatedContainer);
        var newPath = path.concat(possibleClick);
        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true;
        }
    }
    console.log("FAIL, NO PATH:", path);
    return false;
}
function cubesUpdate(container, connectedCubes) {
    var _a;
    var possibleClicks = -1;
    connectedCubes.forEach(function (cube) {
        var _a;
        var idx = container.indexOf(cube);
        cube.classList.remove(cube.classList.item(1));
        cube.classList.add("empty");
        possibleClicks = idx;
        var row = Math.floor(idx / 5);
        for (var i = 0; i < row; i++) {
            _a = [container[idx - 5 * (i + 1)], container[idx - 5 * i]], container[idx - 5 * i] = _a[0], container[idx - 5 * (i + 1)] = _a[1];
        }
    });
    var isEmptyColumn = new Array(5).fill(true);
    // Identify empty columns
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if (!container[i * 5 + j].classList.contains("empty")) {
                isEmptyColumn[j] = false;
            }
        }
    }
    // Shift columns left if an entire column is empty
    for (var col = 0; col < 5; col++) {
        if (isEmptyColumn[col]) {
            // Shift all columns to the right of it one position to the left
            for (var row = 0; row < 5; row++) {
                for (var shiftCol = col; shiftCol < 5 - 1; shiftCol++) {
                    var currentIndex = row * 5 + shiftCol;
                    var nextIndex = row * 5 + shiftCol + 1;
                    // Swap the current and next columns
                    _a = [container[nextIndex], container[currentIndex]], container[currentIndex] = _a[0], container[nextIndex] = _a[1];
                }
            }
            // Adjust for the shift when checking subsequent columns
            isEmptyColumn.splice(col, 1);
            isEmptyColumn.push(false); // Assume last column is now non-empty
            col--; // Re-check the current column index due to the shift
        }
    }
    return [container, possibleClicks];
}
function updateQueue(container) {
    var queue = [];
    var visited = new Set();
    container.forEach(function (cube) {
        if (!cube.classList.contains("empty")) {
            var connectedCubes = getConnectedCubes(container, cube);
            for (var i = 0; i < connectedCubes.size; i++) {
                var connectedCube = connectedCubes[i];
                if (!visited.has(connectedCube)) {
                    visited.add(connectedCube);
                    queue.push(connectedCubes);
                }
                else {
                    continue;
                }
            }
        }
    });
    return queue;
}
function checkSolvable() {
    var container = document.getElementById("container");
    var containerCopy = Array.from(container.childNodes).map(function (node) { return node.cloneNode(true); }); //Deep copy of the container so modification of the DOM cubes does not affect the original container
    var queue = updateQueue(containerCopy);
    return helpFunct(containerCopy, queue);
}
function getConnectedCubes(container, cube) {
    var connectedCubes = new Set();
    var queue = [cube];
    while (queue.length > 0) {
        var currentCube = queue.shift();
        connectedCubes.add(currentCube);
        var neighbors = getAdjacentCubes(container, currentCube);
        neighbors.forEach(function (neighbor) {
            if (!connectedCubes.has(neighbor) && neighbor.classList.contains(cube.classList.item(1))) {
                connectedCubes.add(neighbor);
                queue.push(neighbor);
            }
        });
    }
    if (connectedCubes.size === 1) {
        connectedCubes.clear();
    }
    return connectedCubes;
}
function getAdjacentCubes(container, cube) {
    var idx = container.indexOf(cube);
    var adjacentCubes = [];
    var row = Math.floor(idx / 5);
    var col = idx % 5;
    if (col - 1 >= 0)
        adjacentCubes.push(container[idx - 1]);
    if (col + 1 < 5)
        adjacentCubes.push(container[idx + 1]);
    if (row - 1 >= 0)
        adjacentCubes.push(container[idx - 5]);
    if (row + 1 < 5)
        adjacentCubes.push(container[idx + 5]);
    return adjacentCubes;
}
function getColorCount(container) {
    var colorCount = [0, 0, 0];
    container.forEach(function (cube) {
        if (cube.classList.contains("cuber")) {
            colorCount[0]++;
        }
        else if (cube.classList.contains("cubeg")) {
            colorCount[1]++;
        }
        else if (cube.classList.contains("cubeb")) {
            colorCount[2]++;
        }
    });
    return colorCount;
}
// ------------------------------------------------------------^
function endGame(outcome) {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var overlay = document.querySelector(".overlay");
    clearInterval(timerInterval);
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";
    if (outcome === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () { winMsg_1.style.display = 'none'; }, 2000);
    }
    else {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        setTimeout(function () { loseMsg_1.style.display = 'none'; }, 2000);
    }
    setTimeout(function () {
        timerProgress.style.display = 'flex';
        overlay.style.display = 'none';
        resetGame();
    }, 2000);
}
function resetGame() {
    clearInterval(timerInterval);
    secondsRemaining = 15;
    generateCubes();
    runTimer();
}
function generateCubes() {
    console.log("RESET");
    do {
        var container = document.getElementById("container");
        container.innerHTML = "";
        for (var i = 0; i < 88; i++) {
            var cube = new Cube();
            container === null || container === void 0 ? void 0 : container.appendChild(cube.element);
        }
    } while (!checkSolvable()); // Regenerate the cubes if the board is not solvable
}
function updateTimerDisplay() {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var percentageLeft = Math.floor(100 * secondsRemaining / 15);
    if (timerProgress) {
        timerProgress.style.width = "".concat(percentageLeft, "%");
    }
}
function runTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining < 0) {
            endGame("lose");
        }
    }, 1000);
}
document.addEventListener("DOMContentLoaded", function () {
    resetGame();
    var instructionsToggle = document.getElementById('instructions-toggle');
    var instructionsContent = document.getElementById('instructions-content');
    if (instructionsToggle) {
        instructionsToggle.addEventListener('click', function () {
            instructionsContent.classList.toggle('active');
        });
    }
});

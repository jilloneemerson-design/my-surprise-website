
// A LITTLE SURPRISE FOR YOU ♡

// SECTION NAVIGATION
const sections = [
  "welcome",
  "question",
  "puzzle",
  "audio",
  "letter",
  "machine",
  "final"
];

let currentSection = 0;

function showSection(index) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(sections[index]).classList.add("active");
  currentSection = index;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function unlockNext(buttonId, nextIndex) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => showSection(nextIndex));
}

// 1. WELCOME
document.getElementById("startBtn").addEventListener("click", () => {
  showSection(1);
});

// 2. SECRET QUESTION
const choices = document.querySelectorAll(".choice");
const questionFeedback = document.getElementById("questionFeedback");

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    choices.forEach(item => item.classList.remove("selected"));
    choice.classList.add("selected");

    questionFeedback.textContent =
      "That's right! Every little moment with you is special. ♡";

    document.getElementById("questionNext").classList.remove("hidden");
  });
});

unlockNext("questionNext", 2);


// 3. 3x3 SLIDING PHOTO PUZZLE
const board = document.getElementById("puzzleBoard");
const puzzleStatus = document.getElementById("puzzleStatus");

const puzzleImage = "assets/photos/puzzle.jpeg";

let puzzle = [];

function solvedBoard() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 0];
}

function isSolved() {
  return puzzle.every((value, index) =>
    value === (index === 8 ? 0 : index + 1)
  );
}

function neighbors(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const result = [];

  if (row > 0) result.push(index - 3);
  if (row < 2) result.push(index + 3);
  if (col > 0) result.push(index - 1);
  if (col < 2) result.push(index + 1);

  return result;
}

function renderPuzzle() {
  board.innerHTML = "";

  puzzle.forEach((value, index) => {
    const tile = document.createElement("button");
    tile.className = "puzzle-tile";

    if (value === 0) {
      tile.classList.add("empty");
      tile.disabled = true;
    } else {
      const row = Math.floor((value - 1) / 3);
      const col = (value - 1) % 3;

      tile.style.backgroundImage = `url("${puzzleImage}")`;
      tile.style.backgroundSize = "300% 300%";
      tile.style.backgroundPosition =
        `${col * 50}% ${row * 50}%`;

      tile.setAttribute("aria-label", `Photo piece ${value}`);
      tile.addEventListener("click", () => moveTile(index));
    }

    board.appendChild(tile);
  });

  if (isSolved()) {
    puzzleStatus.textContent =
      "You did it! Picture completed! ♡";

    document.getElementById("puzzleNext")
      .classList.remove("hidden");
  }
}

function moveTile(index) {
  const emptyIndex = puzzle.indexOf(0);

  if (!neighbors(emptyIndex).includes(index)) return;

  [puzzle[index], puzzle[emptyIndex]] =
    [puzzle[emptyIndex], puzzle[index]];

  renderPuzzle();
}

function shufflePuzzle() {
  puzzle = solvedBoard();
  let previousEmpty = -1;

  for (let i = 0; i < 100; i++) {
    const empty = puzzle.indexOf(0);

    let possible = neighbors(empty)
      .filter(n => n !== previousEmpty);

    if (possible.length === 0) {
      possible = neighbors(empty);
    }

    const chosen =
      possible[Math.floor(Math.random() * possible.length)];

    [puzzle[empty], puzzle[chosen]] =
      [puzzle[chosen], puzzle[empty]];

    previousEmpty = empty;
  }

  puzzleStatus.textContent = "Let's complete the picture!";

  document.getElementById("puzzleNext")
    .classList.add("hidden");

  renderPuzzle();
}

document.getElementById("shufflePuzzle")
  .addEventListener("click", shufflePuzzle);

shufflePuzzle();

unlockNext("puzzleNext", 3);


// 4. FLOWER REVEAL GAME 💐

const flowerBoard = document.getElementById("flowerBoard");
const flowerStatus = document.getElementById("flowerStatus");
const flowerMessage = document.getElementById("flowerMessage");
const flowerNext = document.getElementById("audioNext");

const coverObjects = document.querySelectorAll(".cover-object");

let remainingObjects = coverObjects.length;

// Set the starting positions of the objects
function arrangeFlowerObjects() {
  const columns = 7;
  const rows = Math.ceil(coverObjects.length / columns);

  coverObjects.forEach((object, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    object.style.left =
      `${(column / columns) * 100 + 0.5}%`;

    object.style.top =
      `${(row / rows) * 100 + 0.5}%`;

    object.style.width = `${100 / columns - 1}%`;
    object.style.height = `${100 / rows - 1}%`;
  });
}

arrangeFlowerObjects();

function updateFlowerProgress() {
  flowerStatus.textContent =
    `Objects remaining: ${remainingObjects}`;

  if (remainingObjects === 0) {
    flowerStatus.textContent =
      "You found the flowers! Every little surprise was worth it. ♡";

    flowerMessage.classList.remove("hidden");
    flowerNext.classList.remove("hidden");

    flowerBoard.classList.add("flower-complete");
  }
}

// Make each object draggable
coverObjects.forEach(object => {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originalLeft = "";
  let originalTop = "";

  object.addEventListener("pointerdown", event => {
    if (object.classList.contains("removed")) return;

    event.preventDefault();

    dragging = true;

    const boardRect = flowerBoard.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    startX = event.clientX - objectRect.left;
    startY = event.clientY - objectRect.top;

    originalLeft = object.style.left;
    originalTop = object.style.top;

    object.style.zIndex = "100";
    object.style.transition = "none";

    object.classList.add("dragging");

    object.setPointerCapture(event.pointerId);
  });

  object.addEventListener("pointermove", event => {
    if (!dragging) return;

    const boardRect = flowerBoard.getBoundingClientRect();

    const newLeft =
      event.clientX - boardRect.left - startX;

    const newTop =
      event.clientY - boardRect.top - startY;

    object.style.left =
      `${(newLeft / boardRect.width) * 100}%`;

    object.style.top =
      `${(newTop / boardRect.height) * 100}%`;
  });

  function finishDragging(event) {
    if (!dragging) return;

    dragging = false;

    const boardRect = flowerBoard.getBoundingClientRect();

    // Object must be dragged completely outside the board
    const outside =
      event.clientX < boardRect.left ||
      event.clientX > boardRect.right ||
      event.clientY < boardRect.top ||
      event.clientY > boardRect.bottom;

    object.classList.remove("dragging");

    if (outside) {
      object.classList.add("removed");

      object.style.transition = "opacity 0.35s ease";
      object.style.opacity = "0";
      object.style.pointerEvents = "none";

      remainingObjects--;

      updateFlowerProgress();

      setTimeout(() => {
        object.remove();
      }, 350);

    } else {
      // Return the object to its original position
      object.style.transition =
        "left 0.2s ease, top 0.2s ease";

      object.style.left = originalLeft;
      object.style.top = originalTop;
      object.style.zIndex = "";
    }
  }

  object.addEventListener("pointerup", finishDragging);
  object.addEventListener("pointercancel", finishDragging);
});

flowerStatus.textContent =
  `Objects remaining: ${remainingObjects}`;

unlockNext("audioNext", 4);


// 5. LOVE LETTER
document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("envelope").classList.add("hidden");
  document.getElementById("letterContent").classList.remove("hidden");
  document.getElementById("letterNext").classList.remove("hidden");
});

unlockNext("letterNext", 5);


// 6. GIFT MACHINE
const capsules = document.querySelectorAll(".capsule");
const giftResult = document.getElementById("giftResult");

capsules.forEach(capsule => {
  capsule.addEventListener("click", () => {
    capsules.forEach(item => item.classList.remove("selected"));
    capsule.classList.add("selected");

    giftResult.textContent =
      "You picked: " + capsule.dataset.gift + " ♡";

    document.getElementById("machineNext").classList.remove("hidden");
  });
});

unlockNext("machineNext", 6);


// 7. FINAL GIFT REVEAL
document.getElementById("unwrapBtn").addEventListener("click", () => {
  const box = document.getElementById("giftBox");

  box.classList.add("opened");
  box.textContent = "💝";

  document.getElementById("finalMessage").classList.remove("hidden");

  document.getElementById("unwrapBtn").classList.add("hidden");
});


// BACKGROUND MUSIC
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

if (backgroundMusic && musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        musicToggle.textContent = "♫ Pause Music";
      } catch (error) {
        console.error("Music playback failed:", error);
        musicToggle.textContent = "♫ Try Again";
      }
    } else {
      backgroundMusic.pause();
      musicToggle.textContent = "♫ Play Music";
    }
  });
}

console.log("A Little Surprise for You is ready! ♡");

const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lifeLeft: document.querySelector("#life-left"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    currentLife: 3,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
    gameStarted: false,
  },
};

function countDown() {
  if (!state.actions.gameStarted) return;

  if (state.values.currentTime > 0) {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
  } else {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    clearInterval(state.view.score);
  }
  if (state.values.currentTime === 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    clearInterval(state.view.score);

    if (state.values.result < 40) {
      alert("Você fez menos que 30 pontos e perdeu uma vida! Tente novamente!");
      state.values.currentLife--;

      if (state.values.currentLife > 0) {
        state.view.lifeLeft.textContent = state.values.currentLife;
        state.values.currentTime = 60;
        state.values.result = 0;
        state.view.score.textContent = state.values.result;
        restartGame();

      } else if (state.values.currentLife === 0) {
        state.view.lifeLeft.textContent = state.values.currentLife;
        playSound("gameover", "wav");
        alert("Game Over! O seu resultado foi: " + state.values.result);
      }
    } else {
      alert("Parabéns! Você venceu!");
    }
  }
}

function restartGame() {
  addListenerHitBox();
  state.view.lifeLeft.textContent = state.values.currentLife;

  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  state.actions.timerId = setInterval(randomSquare, 1000);
}

function playSound(audioName, audioFormat = "") {
  if (!["m4a", "wav"].includes(audioFormat)) {
    console.error("Unsupported audio format");
    return;
  }
  let audio = new Audio(`./src/audios/${audioName}.${audioFormat}`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit", "m4a");
      }
    });
  });
}

function initialize() {
  addListenerHitBox();
  document.body.addEventListener("mousedown", () => {
    if (!state.actions.gameStarted) {
      state.actions.gameStarted = true;

      state.actions.countDownTimerId = setInterval(countDown, 1000);
      state.actions.timerId = setInterval(randomSquare, 1000);
    }
  });
}

initialize();

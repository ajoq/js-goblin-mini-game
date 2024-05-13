export default class Game {
  constructor() {
    this.randomItemNumber = 0;
    this.intervalId = null;
    this.countPoints = 0;
    this.countMissing = 0;
  }

  init() {
    this.field = Array.from(document.querySelectorAll('.field-item'));
    this.newGameBtn = document.getElementById('start-game');
    this.stopGameBtn = document.getElementById('stop-game');
    this.fieldList = document.getElementById('field-list');
    this.gameOverDiv = document.getElementById('game-over-id');
    this.spanCountPoints = document.getElementById('count-points');
    this.spanCountMissing = document.getElementById('count-missing');
    this.gamePointsFunc = this.gamePoints.bind(this);

    this.newGameBtn.addEventListener('click', () => this.startGame());
    this.stopGameBtn.addEventListener('click', () => this.stopGame());

    this.fieldList.addEventListener('pointerdown', (e) => this.hammerDown(e));
    this.fieldList.addEventListener('pointerup', (e) => this.hammerUp(e));
  }

  checkGameOver() {
    if (this.countMissing === 5) {
      this.removeGoblin();
      this.stopGame();
      this.gameOverDiv.classList.add('display');
      return true;
    }
    return false;
  }

  countsClear() {
    this.countPoints = 0;
    this.countMissing = 0;
    this.spanCountPoints.textContent = this.countPoints;
    this.spanCountMissing.textContent = this.countMissing;
  }

  hammerDown() {
    this.fieldList.classList.add('hummer-bang');
  }

  hammerUp() {
    this.fieldList.classList.remove('hummer-bang');
  }

  gamePoints(e) {
    const divGoblin = e.target.closest('div.field-item.field-item-img');
    if (!divGoblin) {
      this.missingGoblin();
      this.checkGameOver();
      return;
    }

    this.countPoints += 1;
    this.spanCountPoints.textContent = this.countPoints;
    divGoblin.classList.remove('field-item-img');
  }

  getRandom(max, except) {
    const num = Math.floor(Math.random() * max);
    return num === except ? this.getRandom(max, except) : num;
  }

  missingGoblin() {
    this.countMissing += 1;
    this.spanCountMissing.textContent = this.countMissing;
  }

  generateGoblin() {
    this.randomItemNumber = this.getRandom(this.field.length, this.randomItemNumber);
    this.field[this.randomItemNumber].classList.add('field-item-img');
  }

  removeGoblin() {
    const indexGoblin = this.field.findIndex((item) => item.classList.contains('field-item-img'));
    if (indexGoblin !== -1) {
      this.field[indexGoblin].classList.remove('field-item-img');
    }
  }

  startGame() {
    this.fieldList.addEventListener('click', this.gamePointsFunc);
    this.gameOverDiv.classList.remove('display');
    this.stopGameBtn.disabled = false;
    this.newGameBtn.disabled = true;
    this.generateGoblin();

    this.intervalId = setInterval(() => {
      this.stepGame();
    }, 1000);
  }

  stepGame() {
    const indexGoblin = this.field.findIndex((item) => item.classList.contains('field-item-img'));
    if (indexGoblin === -1) {
      this.generateGoblin();
    } else {
      this.removeGoblin();
      this.missingGoblin();
      if (!this.checkGameOver()) {
        this.generateGoblin();
      }
    }
  }

  stopGame() {
    this.removeGoblin();
    clearInterval(this.intervalId);
    this.fieldList.removeEventListener('click', this.gamePointsFunc);
    this.countsClear();
    this.stopGameBtn.disabled = true;
    this.newGameBtn.disabled = false;
  }
}

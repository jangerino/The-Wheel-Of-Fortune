let container = document.querySelector(".container");
let btn = document.getElementById("spin");
let number = Math.ceil(Math.random() * 10000);
let isSpinning = false;

// Вероятности для каждого сектора (в процентах)
const prizeProbabilities = {
  "Приз 1": 100,
  "Приз 2": 0,
  "Приз 3": 0,
  "Приз 4": 0,
  "Ничего": 0
};

// Функция для взвешенного случайного выбора
function weightedRandom(probabilities) {
  const prizes = Object.keys(probabilities);
  const weights = Object.values(probabilities);

  let i;
  let random = Math.random();

  for (i = 0; i < prizes.length; i++) {
    random -= weights[i] / 100;
    if (random <= 0) {
      return prizes[i];
    }
  }

  return prizes[prizes.length - 1]; // Вернуть последний приз по умолчанию
}

btn.onclick = function () {
  if (isSpinning) {
    return;
  }

  isSpinning = true;

  // Определяем победивший сектор С УЧЕТОМ ВЕРОЯТНОСТЕЙ
  const winningPrize = weightedRandom(prizeProbabilities);

  // Вычисляем угол, соответствующий выпавшему сектору
  let winningAngle = getAngleForPrize(winningPrize); // Новая функция

  // Добавляем случайное число оборотов, чтобы не было очевидно
  let randomNumber = Math.ceil(Math.random() * 3600);

  let finalRotation = number + randomNumber + winningAngle;


  container.style.transition = 'transform 5s cubic-bezier(0.23, 1, 0.320, 1)';
  container.style.transform = "rotate(" + finalRotation + "deg)";


  setTimeout(function () {
    isSpinning = false;
    container.style.transition = 'none';
    number = finalRotation % 360;

    alert("Вы выиграли: " + winningPrize); // Используем winningPrize

  }, 5000);
};



function getAngleForPrize(prize) {
  // Функция, которая возвращает угол для заданного приза
  // ВАЖНО: Убедитесь, что порядок секторов в HTML соответствует порядку в prizeProbabilities
  const numberOfSectors = 5;
  const sectorAngle = 360 / numberOfSectors;

  switch (prize) {
    case "Приз 1": return 0 * sectorAngle; // Первый сектор начинается с 0
    case "Приз 2": return 1 * sectorAngle;
    case "Приз 3": return 2 * sectorAngle;
    case "Приз 4": return 3 * sectorAngle;
    case "Ничего": return 4 * sectorAngle;
    default: return 0; //  Обработка ошибки
  }
}

// Убираем функцию getWinningSector, она больше не нужна

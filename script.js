let container = document.querySelector(".container");
let spinBtn = document.getElementById("spin");
let result = document.getElementById("result");
let websocketOutputDiv = document.getElementById("websocket-output");

// Инициализация WebSocket
let websocket = new WebSocket('wss://callback.thewheeloffortune.ru/ws');

// Обработчики WebSocket
websocket.onopen = function(e) {
  console.log('[open] Соединение установлено');

};

websocket.onmessage = function(event) {
  console.log('[message] Данные получены с сервера: ${event.data}');
};

websocket.onclose = function(event) {
  if (event.wasClean) {
    console.log('[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}');
  } else {
   console.log('Соединение прервано');
  }
};

websocket.onerror = function(error) {
  console.log('[error]');
};





// Призы и их вероятности
const prizes = [
    { name: "Приз 1", chance: 10 },
    { name: "Приз 2", chance: 10 },
    { name: "Приз 3", chance: 10 },
    { name: "Приз 4", chance: 10 },
    { name: "Ничего", chance: 60 }
];

let rotationDegrees = 0;

// Создание секторов колеса
function createSectors() {
    const numPrizes = prizes.length;
    const angle = 360 / numPrizes;
    let currentAngle = 0;

    prizes.forEach((prize) => {
        const sector = document.createElement("div");
        sector.classList.add("sector");
        sector.style.transformOrigin = "50% 100%";
        sector.style.transform = `rotate(${currentAngle}deg)`;
        sector.style.width = '100%';
        sector.style.height = '50%';
        sector.style.position = 'absolute';
        sector.style.top = '0';
        sector.style.left = '0';
        sector.style.textAlign = 'center';
        sector.style.lineHeight = '150px';
        // Создаем элемент для текста приза
        const prizeText = document.createElement("span");
        prizeText.textContent = prize.name;

        // Если это "Приз 3", разворачиваем его
        if (prize.name === "Приз 3") {
            prizeText.style.transform = "rotate(180deg)";
            prizeText.style.display = "inline-block"; // Для правильного отображения
        }
        if (prize.name === "Приз 2") {
            prizeText.style.transform = "rotate(180deg)";
            prizeText.style.display = "inline-block"; // Для правильного отображения
        }

        sector.appendChild(prizeText);  // Добавляем текст в сектор

        // Цвета секторов
        const hue = (currentAngle / 360) * 360;
        sector.style.backgroundColor = `hsl(${hue})`;

        container.appendChild(sector);
        currentAngle += angle;

    });

}



// Выбор приза на основе вероятностей
function choosePrize() {
    const randomNumber = Math.random() * 100;
    let cumulativeChance = 0;

    for (let i = 0; i < prizes.length; i++) {
        cumulativeChance += prizes[i].chance;
        if (randomNumber <= cumulativeChance) {
            return prizes[i];
        }
    }
    return prizes[prizes.length - 1];
}

// Функция вращения колеса
function spinWheel() {
spinBtn.disabled = true;
const winningPrize = choosePrize();
const numPrizes = prizes.length;
const winningIndex = prizes.findIndex(prize => prize.name === winningPrize.name);
const anglePerPrize = 360 / numPrizes;

const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);

container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
container.style.transform = `rotate(${stopAngle}deg)`;

setTimeout(() => {
container.style.transition = 'none';
container.style.transform = `rotate(${stopAngle % 360}deg)`;
result.textContent = `Вы выиграли: ${winningPrize.name}`;
alert(`Вы выиграли: ${winningPrize.name}`);

// Сохраняем выигрыш
localStorage.setItem('wonPrize', winningPrize.name);

// Отправка данных о выигрыше на сервер
const userId = localStorage.getItem('userId');
if (userId) {
const message = JSON.stringify({
user_id: userId,
prize: winningPrize.name
 });
 sendWebSocketMessage(message);
 }

// Больше нельзя крутить
spinBtn.disabled = true;
}, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
createSectors();

if (window.Telegram && Telegram.WebApp) {
const user = Telegram.WebApp.initDataUnsafe.user;
if (user && user.id) {
localStorage.setItem('userId', user.id);
console.log('User ID сохранен:', user.id);
}
}

// Проверяем, есть ли уже выигрыш
const wonPrize = localStorage.getItem('wonPrize');
if (wonPrize) {
result.textContent = '';
spinBtn.disabled = true;
alert(`Вы выиграли: ${wonPrize}`);
} else {
spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spinWheel);
});

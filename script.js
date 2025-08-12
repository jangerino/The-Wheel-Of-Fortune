let container = document.querySelector(".container");
let spinBtn = document.getElementById("spin");
let result = document.getElementById("result");
const websocketOutputDiv = document.getElementById("websocket-output");

// Инициализация WebSocket
const websocket = new WebSocket('wss://6716fe27991b.ngrok-free.app');

// Обработчики WebSocket
websocket.onopen = () => {
    console.log('Соединение установлено');
    websocketOutputDiv.innerHTML += '';
};

websocket.onmessage = (event) => {
    console.log(`Получено сообщение от сервера: ${event.data}`);
    websocketOutputDiv.innerHTML += `<p>Сервер: ${event.data}</p>`;
};

websocket.onclose = () => {
    console.log('Соединение закрыто');
    websocketOutputDiv.innerHTML += '';
};

websocket.onerror = (error) => {
    console.error('Ошибка WebSocket:', error);
    websocketOutputDiv.innerHTML += '';
};

// Функция для отправки сообщений
function sendWebSocketMessage(message) {
    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(message);
        websocketOutputDiv.innerHTML += '';
    } else {
        console.error('WebSocket не подключен');
    }
}

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
        sector.textContent = prize.name;

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

    // Расчет угла остановки
    const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);

    container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.transform = `rotate(${stopAngle}deg)`;

    setTimeout(() => {
        container.style.transition = 'none';
        container.style.transform = `rotate(${stopAngle % 360}deg)`;
        result.textContent = "";
        alert(`Вы выиграли: ${winningPrize.name}`);
        // Отправка данных о выигрыше на сервер
        const userId = localStorage.getItem('userId');
        if (userId) {
            const message = JSON.stringify({
                user_id: userId,
                prize: winningPrize.name
            });
            sendWebSocketMessage(message);
        }

        spinBtn.disabled = true;

    }, 5000);
}



// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    createSectors();

    // Получаем user_id из Telegram WebApp
    if (window.Telegram && Telegram.WebApp) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
            localStorage.setItem('userId', user.id);
            console.log('User ID сохранен:', user.id);
        }
    }

// ОТВЕЧАЕТ ЗА ТО ЧТОБ МОЖНО БЫЛО КРУТИТЬ ТОЛЬКО 1 РАЗ


    spinBtn.addEventListener('click', spinWheel);
});










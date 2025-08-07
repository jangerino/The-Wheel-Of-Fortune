
let container = document.querySelector(".container");
let btn = document.getElementById("spin");
let websocket;

const prizes = [
    { name: "Приз 1", chance: 10 },
    { name: "Приз 2", chance: 10 },
    { name: "Приз 3", chance: 10 },
    { name: "Приз 4", chance: 10 },
    { name: "Ничего", chance: 60 }
];

let rotationDegrees = 0;

function sectors() {
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

        container.appendChild(sector);
        currentAngle += angle;
    });
}

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

function spinWheel() {
    btn.disabled = true;

    const winningPrize = choosePrize();
    const numPrizes = prizes.length;
    const winningIndex = prizes.findIndex(p => p.name === winningPrize.name);
    const anglePerPrize = 360 / numPrizes;
    const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);

    container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.transform = `rotate(${stopAngle}deg)`;
    rotationDegrees = stopAngle;

    localStorage.setItem('rotationDegrees', rotationDegrees);
    localStorage.setItem('winningPrize', winningPrize.name);
    localStorage.setItem('spun', 'true');

    // Отправка приза на сервер через WebSocket
    setTimeout(() => {
        container.style.transition = 'none';
        container.style.transform = `rotate(${rotationDegrees % 360}deg)`;
        alert("Вы выиграли: " + winningPrize.name);

        const user_id = localStorage.getItem('user_id');
        if (websocket && websocket.readyState === WebSocket.OPEN && user_id) {
            const message = {
                prize: winningPrize.name,
                user_id: user_id
            };
            websocket.send(JSON.stringify(message));
            console.log("Приз отправлен через WebSocket:", message);
        } else {
            console.warn("WebSocket не открыт или user_id отсутствует");
        }
    }, 5000);
}

function connectWebSocket() {
    websocket = new WebSocket("ws://localhost:8765"); // замените на ваш IP/домен при деплое

    websocket.onopen = () => {
        console.log("✅ WebSocket соединение установлено");
        const userId = localStorage.getItem('userId');
        if (userId) {
            const message = { user_id: userId };
            websocket.send(JSON.stringify(message));
        } else {
            console.warn("❌ userId не найден в localStorage");
        }
    };

    websocket.onerror = (error) => {
        console.error("WebSocket ошибка:", error);
    };

    websocket.onclose = () => {
        console.log("🔌 WebSocket соединение закрыто");
    };

    websocket.onmessage = (event) => {
        console.log("📨 Получено сообщение от сервера:", event.data);
    };
}

// Вызов подключения при загрузке страницы
window.addEventListener("load", () => {
    if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", prompt("Введите ваш userId"));
    }
    connectWebSocket();
});

if (websocket && websocket.readyState === WebSocket.OPEN) {
    const userId = localStorage.getItem("userId");
    if (userId) {
        const message = {
            user_id: userId,
            prize: winningPrize.name
        };
        websocket.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket не открыт или userId отсутствует");
    }
}


btn.addEventListener("click", spinWheel);


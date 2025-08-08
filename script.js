//let container = document.querySelector(".container");
//let btn = document.getElementById("spin");
//let result = document.getElementById("result");
/// @type {WebSocket} */
//let websocket;
//
//
//const prizes = [
//    { name: "Приз 1", chance: 10 },
//    { name: "Приз 2", chance: 10 },
//    { name: "Приз 3", chance: 10 },
//    { name: "Приз 4", chance: 10 },
//    { name: "Ничего", chance: 60 }
//];
//
//let rotation = 0;
//let rotationDegrees = 0; // Add this line
//
//function sectors() {
//    const numPrizes = prizes.length;
//    const angle = 360 / numPrizes;
//    let currentAngle = 0;
//
//    prizes.forEach((prize, index) => {
//        const sector = document.createElement("div");
//        sector.classList.add("sector");
//        sector.style.transformOrigin = "50% 100%";
//        sector.style.transform = `rotate(${currentAngle}deg)`;
//        sector.style.width = '100%';
//        sector.style.height = '50%';
//        sector.style.position = 'absolute';
//        sector.style.top = '0';
//        sector.style.left = '0';
//        sector.style.textAlign = 'center';
//        sector.style.lineHeight = '150px';
//        sector.textContent = prize.name;
//
//        // Добавляем немного стилизации (можно улучшить в CSS)
//     // Added saturation and lightness
//
//        container.appendChild(sector);
//        currentAngle += angle;
//    });
//}
//
//function choosePrize() {
//    const randomNumber = Math.random() * 100;
//    let cumulativeChance = 0;
//
//    for (let i = 0; i < prizes.length; i++) {
//        cumulativeChance += prizes[i].chance;
//        if (randomNumber <= cumulativeChance) {
//            return prizes[i];
//        }
//    }
//    return prizes[prizes.length - 1]; // Corrected the index
//}
//
//// Функция для запуска вращения
//function spinWheel() {
//    btn.disabled = true; // Отключаем кнопку, чтобы нельзя было крутить несколько раз
//
//    const winningPrize = choosePrize();
//    const numPrizes = prizes.length;
//    const winningIndex = prizes.findIndex(prize => prize.name === winningPrize.name);
//    const anglePerPrize = 360 / numPrizes;
//
//    // Рассчитываем угол остановки (добавляем случайность для более реалистичного вида)
//    const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);
//
//
//    container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Более интересная кривая замедления
//    container.style.transform = `rotate(${stopAngle}deg)`;
//    rotationDegrees = stopAngle; // Store the rotation angle
//    localStorage.setItem('rotationDegrees', rotationDegrees); // Store rotation in localStorage
//    localStorage.setItem('winningPrize', winningPrize.name); // Store prize in localStorage
//
//
//    // После завершения вращения показываем результат
//    setTimeout(() => {
//        container.style.transition = 'none'; // Убираем transition, чтобы следующий поворот был корректным
//        container.style.transform = `rotate(${rotationDegrees % 360}deg)`; // Устанавливаем конечное положение
//        alert("Вы выиграли: " + winningPrize.name);
//        btn.disabled = true;
//        console.log(winningPrize.name);
//    }, 5000); // 5 секунд
//}
//
//// Создаем сектора при загрузке страницы
//sectors();
//
//window.addEventListener('load', () => {
//    const savedRotation = localStorage.getItem('rotationDegrees');
//    const savedPrize = localStorage.getItem('winningPrize');
//    const spun = localStorage.getItem('spun'); // Check the flag
//
//    if (savedRotation && savedPrize) {
//        rotationDegrees = parseFloat(savedRotation);
//        container.style.transition = 'none';
//        container.style.transform = `rotate(${rotationDegrees % 360}deg)`;
//        alert("Последний выигрыш: " + savedPrize);
//        btn.disabled = true; // Always disable the button
//    }
//    if (spun === 'true') {
//        btn.disabled = true;
//    }
//});
//
//function connectWebSocket() {
//  websocket = new WebSocket("ws://localhost:63342"); // Замените URL
//
//  websocket.onopen = () => {
//    console.log("Соединение с WebSocket установлено");
//
//  websocket.onclose = () => {
//       console.log("WebSocket connection closed");
//   };
//
//   websocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//   };
//     const userId = localStorage.getItem('userId'); // Получаем user_id из localStorage
//      if (userId) {
//          const connectionMessage = { user_id: userId };
//          websocket.send(JSON.stringify(connectionMessage)); // Отправляем user_id при подключении
//      } else {
//          console.error("User ID не найден в localStorage");
//      }
//
//  };
//function spinWheel() {
//    //...
//
//        // Отправка приза через WebSocket
//        if (websocket && websocket.readyState === WebSocket.OPEN) {
//            const userId = localStorage.getItem('userId');
//            const message = { prize: winningPrize.name, user_id: userId }; //Send user ID
//            websocket.send(JSON.stringify(message));
//            localStorage.setItem('prizeShown', 'true'); //Mark prize shown
//            prizeShown = true; // Mark prize as shown
//        }
//
//// Добавляем слушатель на кнопку
//btn.addEventListener("click", spinWheel);
//
//// Disable the button on load if spun flag is set
//if (localStorage.getItem('spun') === 'true') {
//    btn.disabled = true;
//}
//}}

let container = document.querySelector(".container");
let spinBtn = document.getElementById("spin"); // Получаем кнопку по ID
let result = document.getElementById("result");
const websocketOutputDiv = document.getElementById("websocket-output"); // Элемент для вывода сообщений WebSocket

const websocket = new WebSocket('ws://localhost:63342');

websocket.onopen = () => {
    console.log('Соединение установлено');
    websocketOutputDiv.innerHTML += '<p>Соединение установлено</p>';
};

websocket.onmessage = (event) => {
    console.log(`Получено сообщение от сервера: ${event.data}`);
    websocketOutputDiv.innerHTML += `<p>Сервер: ${event.data}</p>`;
};

websocket.onclose = () => {
    console.log('Соединение закрыто');
    websocketOutputDiv.innerHTML += '<p>Соединение закрыто</p>';
};

websocket.onerror = (error) => {
    console.error('Ошибка WebSocket:', error);
    websocketOutputDiv.innerHTML += `<p>Ошибка: ${error}</p>`;
};

function sendMessage(message) {  // Функция принимает сообщение в качестве аргумента
    websocket.send(message);
    websocketOutputDiv.innerHTML += `<p>Вы: ${message}</p>`;
}

const prizes = [
    {name: "Приз 1", chance: 10},
    {name: "Приз 2", chance: 10},
    {name: "Приз 3", chance: 10},
    {name: "Приз 4", chance: 10},
    {name: "Ничего", chance: 60}
];

let rotation = 0;
let rotationDegrees = 0; // Add this line

function sectors() {
    const numPrizes = prizes.length;
    const angle = 360 / numPrizes;
    let currentAngle = 0;

    prizes.forEach((prize, index) => {
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
    return prizes[prizes.length - 1]; // Corrected the index
}

// Функция для запуска вращения
function spinWheel() {
    spinBtn.disabled = true; // Отключаем кнопку, чтобы нельзя было крутить несколько раз
    const winningPrize = choosePrize();
    const numPrizes = prizes.length;
    const winningIndex = prizes.findIndex(prize => prize.name === winningPrize.name);
    const anglePerPrize = 360 / numPrizes;

    // Рассчитываем угол остановки (добавляем случайность для более реалистичного вида)
    const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);
    container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.transform = `rotate(${stopAngle}deg)`;

    setTimeout(() => {
        container.style.transition = 'none';
        container.style.transform = `rotate(${stopAngle % 360}deg)`;
        result.textContent = `Вы выиграли: ${winningPrize.name}`;
        spinBtn.disabled = false; // Включаем кнопку снова
        sendMessage(`Пользователь выиграл: ${winningPrize.name}`); // Отправляем сообщение на сервер
    }, 5000);

}

spinBtn.addEventListener('click', spinWheel);
sectors(); // Вызываем функцию для создания секторов


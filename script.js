// WebSocket соединение с обработкой ошибок
let websocket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
const reconnectDelay = 1000;

function connectWebSocket() {
    websocket = new WebSocket('wss://6zf7li9gr.localto.net');
    
    websocket.onopen = () => {
        console.log('WebSocket подключен');
        reconnectAttempts = 0;
        
        // Получаем user_id из Telegram WebApp или localStorage
        const userId = Telegram.WebApp.initDataUnsafe?.user?.id || localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID не найден');
            return;
        }
        
        // Сохраняем userId для последующих запросов
        window.userId = userId;
    };
    
    websocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Ответ сервера:', data);
            
            if (data.status === 'success') {
                showPrizeResult(data.prize);
            } else {
                console.error('Ошибка сервера:', data.message);
            }
        } catch (e) {
            console.error('Ошибка парсинга ответа:', e);
        }
    };
    
    websocket.onclose = (event) => {
        console.log(`Соединение закрыто (код: ${event.code})`);
        
        if (reconnectAttempts < maxReconnectAttempts) {
            const delay = reconnectDelay * (reconnectAttempts + 1);
            console.log(`Повторное подключение через ${delay}мс...`);
            
            setTimeout(() => {
                reconnectAttempts++;
                connectWebSocket();
            }, delay);
        }
    };
    
    websocket.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
    };
}

// Функция отправки данных о призе
async function sendPrizeToServer(prize) {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket не готов');
        return false;
    }
    
    if (!window.userId) {
        console.error('User ID не определен');
        return false;
    }
    
    try {
        const message = JSON.stringify({
            user_id: window.userId,
            prize: prize
        });
        
        websocket.send(message);
        return true;
    } catch (e) {
        console.error('Ошибка отправки:', e);
        return false;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    createSectors();
    
    // Обработчик кнопки
    document.getElementById('spin').addEventListener('click', async () => {
        const prize = choosePrize();
        const success = await sendPrizeToServer(prize.name);
        
        if (success) {
            spinWheel(prize);
        } else {
            alert('Ошибка соединения. Попробуйте позже.');
        }
    });
});

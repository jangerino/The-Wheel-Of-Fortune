let container = document.querySelector(".container");
let btn = document.getElementById("spin");
let result = document.getElementById("result")
// let number = Math.ceil(Math.random(1000) * 10000);
// let isSpinning = false;

const prizes =[
  {name:"Приз 1", chance:0},
  {name:"Приз 2", chance:0},
  {name:"Приз 3", chance:100},
  {name:"Приз 4", chance:0},
  {name:"Ничего", chance:0}
];

let rotation = 0;

function sectors(){
  const numPrizes = prizes.length;
  const angle = 360/numPrizes;
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

        // Добавляем немного стилизации (можно улучшить в CSS)
        sector.style.backgroundColor = `hsl(${index * (360 / numPrizes)} `;

        container.appendChild(sector);
        currentAngle += angle;
      });
    }

    function choosePrize(){
      const randomNumber = Math.random()*100;
      let cumulativeChance = 0;

      for(let i = 0;i<prizes.length;i++){
        cumulativeChance +=prizes[i].chance;
        if(randomNumber <=cumulativeChance){
          return prizes[i];
        }
      }
      return prizes[prizes,length-1]
    }
    // Функция для запуска вращения
    function spinWheel() {
        spin.disabled = true; // Отключаем кнопку, чтобы нельзя было крутить несколько раз

        const winningPrize = choosePrize();
        const numPrizes = prizes.length;
        const winningIndex = prizes.findIndex(prize => prize.name === winningPrize.name);
        const anglePerPrize = 360 / numPrizes;

        // Рассчитываем угол остановки (добавляем случайность для более реалистичного вида)
        const stopAngle = 360 * 5 + (360 - winningIndex * anglePerPrize) - anglePerPrize / 2 + (Math.random() * anglePerPrize);


        container.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Более интересная кривая замедления
        container.style.transform = `rotate(${stopAngle}deg)`;
        rotationDegrees = stopAngle;

        // После завершения вращения показываем результат
        setTimeout(() => {
            container.style.transition = 'none'; // Убираем transition, чтобы следующий поворот был корректным
            container.style.transform = `rotate(${rotationDegrees % 360}deg)`; // Устанавливаем конечное положение
            alert("Вы выиграли: " + winningPrize.name);
            spin.disabled = true; // Включаем кнопку снова
        }, 5000); // 5 секунд
    }


    // Создаем сектора при загрузке страницы
    sectors();

    // Добавляем слушатель на кнопку
    spin.addEventListener("click", spinWheel);


  let spinner = new Spinner({
    lines: 13, // Кількість ліній
    length: 28, // Довжина ліній
    width: 14, // Товщина ліній
    radius: 42, // Радіус кола
    scale: 1, // Масштаб
    corners: 1, // Форма кутів (0 - круглі, 1 - квадратні)
    color: "#ffffff", // Колір
    speed: 1, // Швидкість обертання
    rotate: 0, // Початковий оберт (градуси)
    animation: "spinner-line-fade-quick", // Анімація
    direction: 1, // Напрямок обертання (1 - годинникова стрілка, -1 - проти годинникової стрілки)
    zIndex: 2e9, // Z-index
    className: "spinner", // Клас елементу спінера
    top: "50%", // Верхній відступ
    left: "50%", // Лівий відступ
    shadow: false, // Тінь
    hwaccel: false, // Використання апаратного прискорення
    position: "absolute", // Позиція
  });


function showSpinner() {
  spinner.spin(document.body); // Показати спінер на сторінці
}

function hideSpinner() {
  spinner.stop(); // Приховати спінер
}

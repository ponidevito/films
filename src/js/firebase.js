// console.log(form);
// console.log(imageInput); // Переконайтеся, що виводить правильний елемент вводу файлу

if (document.title === "Додати фільм - Ваш заголовок сторінки") {
  // Отримання посилань на елементи форми
  const form = document.querySelector(".form");
  const imageInput = document.querySelector("#imageInput"); // Додаєте input для вибору файлу

  // Додайте слухача подій для форми
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Отримання файлу з input
    const imageFile = imageInput.files[0];

    // Викликати функцію для завантаження картинки на Firebase
    uploadImage(imageFile);
  });

  // Функція для завантаження картинки на Firebase Storage
  function uploadImage(file) {
    // Створення посилання на Storage
    //   const storageRef = storage.ref();
    const storageRef = firebase.storage().ref();

    // Створення посилання на файл у папці "images" (ви можете вказати свою папку)
    const imageRef = storageRef.child("images/" + file.name);

    // Завантаження файлу на Firebase Storage
    imageRef.put(file).then((snapshot) => {
      console.log("Файл успішно завантажено!");
    });
  }
}

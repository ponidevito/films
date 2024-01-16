// console.log(form);
// console.log(imageInput); // Переконайтеся, що виводить правильний елемент вводу файлу

// if (document.title === "Додати фільм - Ваш заголовок сторінки") {
//   // Отримання посилань на елементи форми
//   const form = document.querySelector(".form");
//   const imageInput = document.querySelector("#imageInput"); // Додаєте input для вибору файлу

//   // Додайте слухача подій для форми
//   form.addEventListener("submit", function (event) {
//     event.preventDefault();

//     // Отримання файлу з input
//     const imageFile = imageInput.files[0];

//     // Викликати функцію для завантаження картинки на Firebase
//     uploadImage(imageFile);
//   });

//   // Функція для завантаження картинки на Firebase Storage
//   function uploadImage(file) {
//     // Створення посилання на Storage
//     //   const storageRef = storage.ref();
//     const storageRef = firebase.storage().ref();

//     // Створення посилання на файл у папці "images" (ви можете вказати свою папку)
//     const imageRef = storageRef.child("images/" + file.name);

//     // Завантаження файлу на Firebase Storage
//     imageRef.put(file).then((snapshot) => {
//       console.log("Файл успішно завантажено!");
//     });
//   }
// }

if (document.title === "Додати фільм") {
const firebaseConfig = {
  apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
  authDomain: "cinema-collection-ce9ba.firebaseapp.com",
  projectId: "cinema-collection-ce9ba",
  storageBucket: "cinema-collection-ce9ba.appspot.com",
  messagingSenderId: "597377281566",
  appId: "1:597377281566:web:c49563737b63b6c131080f"
  };

firebase.initializeApp(firebaseConfig);

// Отримання посилань на елементи форми

// Ініціалізація firestore, якщо він не був декларований раніше
const firestore = firebase.firestore();

// Отримання посилань на елементи форми
// const form = document.querySelector(".form");
// const imageInput = document.querySelector("#imageInput");

// form.addEventListener("submit", function (event) {
//   event.preventDefault();

//   const imageFile = imageInput.files[0];

//   uploadImage(imageFile);
// });

// function uploadImage(file) {
//   const storageRef = firebase.storage().ref();
//   const imageRef = storageRef.child("images/" + file.name);

//   imageRef.put(file).then((snapshot) => {
//     console.log("Файл успішно завантажено!");

//     imageRef.getDownloadURL().then((url) => {
//       firestore.collection("films").add({
//         title: form.querySelector("input[placeholder='Назва']").value,
//         year: form.querySelector("input[placeholder='Рік']").value,
//         description: form.querySelector("input[placeholder='Про фільм']").value,
//         youtubeURL: form.querySelector("input[name='youtube']").value,
//         imageURL: url,
//       }).then((docRef) => {
//         console.log("Документ успішно додано з ID:", docRef.id);
//       }).catch((error) => {
//         console.error("Помилка при додаванні документа:", error);
//       });
//     });
//   });
// }


const form = document.querySelector(".form");
const imageInput = document.querySelector("#imageInput");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const imageFile = imageInput.files[0];

  uploadImage(imageFile);
});

function uploadImage(file) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("images/" + file.name);

  imageRef.put(file).then((snapshot) => {
    console.log("Файл успішно завантажено!");

    imageRef.getDownloadURL().then((url) => {
      firestore.collection("films").add({
        title: form.querySelector("input[placeholder='Назва']").value,
        year: form.querySelector("input[placeholder='Рік']").value,
        description: form.querySelector("input[placeholder='Про фільм']").value,
        youtubeURL: form.querySelector("input[name='youtube']").value,
        imageURL: url,
      }).then((docRef) => {
        console.log("Документ успішно додано з ID:", docRef.id);

        // Використовуйте docRef.id як ID документа
        // Наприклад, ви можете зберігати цей ID в базі даних або виводити його на сторінці
        // Наприклад, вивести ID на консоль:
        console.log("ID документа:", docRef.id);
      }).catch((error) => {
        console.error("Помилка при додаванні документа:", error);
      });
    });
  });
}




}

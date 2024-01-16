// Custom Scripts

// Custom scripts

// checkbox toogle

function togglePasswordVisibility() {
  let checkboxColorText = document.querySelector(".modal__checkbox");
  var passwordField = document.getElementById("password");
  var showPasswordCheckbox = document.getElementById("showPassword");

  showPasswordCheckbox.checked = !showPasswordCheckbox.checked;

  if (showPasswordCheckbox.checked) {
    checkboxColorText.classList.add("changeColor");
    // Показати пароль
    passwordField.type = "text";
  } else {
    // Приховати пароль
    checkboxColorText.classList.remove("changeColor");
    passwordField.type = "password";
  }
}



;
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
;
// Модальное окно
function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger),
    modal = document.querySelector(modal),
    close = document.querySelector(close)

  const body = document.body

  trigger.addEventListener('click', e => {
    e.preventDefault()
    modal.style.display = 'flex'
    body.classList.add('locked')
  });
  close.addEventListener('click', () => {
    modal.style.display = 'none'
     body.classList.remove('locked')
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
       body.classList.remove('locked')
    }
  })
}

bindModal('.modal__btn', '.modal__wrapper', '.modal__close')


;
// login

let searchBox = document.querySelector(".header__box");
let modalLogin = document.querySelector(".modal__wrapper");
let userEnter = document.querySelector(".header__user");
let loginBox = document.querySelector(".header__login-box");

// function submitForm() {
//   let emailValue = document.getElementById("loginForm").elements.email.value;
//   let passwordValue =
//     document.getElementById("loginForm").elements.password.value;

//   // Sign in with email and password
//   firebase
//     .auth()
//     .signInWithEmailAndPassword(emailValue, passwordValue)
//     .then((userCredential) => {
//       let user = userCredential.user;
//       searchBox.classList.add("show");
//       modalLogin.classList.add("hide");
//       userEnter.classList.add("hide");
//       loginBox.classList.add("show-box");
//       console.log("Login successful:", user);
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.error("Login error:", errorCode, errorMessage);
//     });
// }

function submitForm() {
  let emailValue = document.getElementById("loginForm").elements.email.value;
  let passwordValue =
    document.getElementById("loginForm").elements.password.value;

  // Увійти за допомогою електронної пошти та паролю
  firebase
    .auth()
    .signInWithEmailAndPassword(emailValue, passwordValue)
    .then((userCredential) => {
      let user = userCredential.user;

      // Зберегти інформацію про користувача в localStorage
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userEmail", user.email);

      // Додати/видалити класи або виконати інші дії, пов'язані з інтерфейсом
      searchBox.classList.add("show");
      modalLogin.classList.add("hide");
      userEnter.classList.add("hide");
      loginBox.classList.add("show-box");

      console.log("Успішний вхід:", user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Помилка входу:", errorCode, errorMessage);
    });
}

// Перевірка наявності даних користувача в localStorage
let userId = localStorage.getItem("userId");
let userEmail = localStorage.getItem("userEmail");

if (userId && userEmail) {
  // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
  searchBox.classList.add("show");
  modalLogin.classList.add("hide");
  userEnter.classList.add("hide");
  loginBox.classList.add("show-box");

  console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);
} else {
  // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
  // або здійсніть інші дії відповідно до вашого сценарію
  console.log(
    "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
  );
}

function logOut() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  searchBox.classList.remove("show");
  modalLogin.classList.remove("hide");
  userEnter.classList.remove("hide");
  loginBox.classList.remove("show-box");
  console.log("Користувач вийшов.");
}
;


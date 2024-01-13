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

// // login

let searchBox = document.querySelector(".header__box");
let modalLogin = document.querySelector(".modal__wrapper");
let userEnter = document.querySelector(".header__user");
let loginBox = document.querySelector(".header__login-box");

function submitForm() {
  let emailValue = document.getElementById("loginForm").elements.email.value;
  let passwordValue =
    document.getElementById("loginForm").elements.password.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(emailValue, passwordValue)
    .then((userCredential) => {
      let user = userCredential.user;

      // Зчитати роль користувача з бази даних або Firestore
      const db = firebase.firestore();
      const userDocRef = db.collection("users").doc(user.uid);

      userDocRef.get().then((doc) => {
        if (doc.exists) {
          const userRole = doc.data().role;

          // Зберегти роль в localStorage
          localStorage.setItem("userRole", userRole);

          // Зберегти інші дані користувача в localStorage
          localStorage.setItem("userId", user.uid);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", doc.data().firstName); // Припустимо, що в Firestore є поле name

          // Додати/видалити класи або виконати інші дії, пов'язані з інтерфейсом
          // searchBox.classList.add("show");
          modalLogin.classList.add("hide");
          userEnter.classList.add("hide");
          loginBox.classList.add("show-box");

          // Виконайте додаткові дії відповідно до ролі користувача
          if (userRole === "admin") {
            console.log(userRole);
            // Дії для адміністратора
          } else {
            console.log(userRole);
            // Дії для звичайного користувача
          }

          console.log("Успішний вхід:", user);
          // Перенаправити на сторінку collection-films
          window.location.href = "collection-films.html";
        } else {
          console.error("Документ користувача не існує!");
        }
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Помилка входу:", errorCode, errorMessage);
    });
}

function logOut() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  searchBox.classList.remove("show");
  modalLogin.classList.remove("hide");
  userEnter.classList.remove("hide");
  loginBox.classList.remove("show-box");
  console.log("Користувач вийшов.");
  window.location.href = "/index.html";
}

// test
const effectBurger = document.querySelector ('.effect')

document.addEventListener("DOMContentLoaded", async function () {
  const filmCollection = document.getElementById("filmCollection");

  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // Якщо користувач авторизований
      const isAdmin = await checkIfUserIsAdmin(user);
      // if (window.location.pathname.includes("index.html")) {
      //   console.log("Користувач вже авторизований, перенаправляю на collection-films.html");
      //   window.location.href = "collection-films.html"; // Замініть на свій URL
      // }
      // Отримання дані про фільми з Firebase
      if (filmCollection) {
        try {
          const querySnapshot = await firebase
            .firestore()
            .collection("films")
            .get();

          querySnapshot.forEach((doc) => {
            const filmData = doc.data();
          });
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
      }
    } else if (!window.location.pathname.includes("index.html")) {
      console.log("Направляю неавторизованого користувача на index.html");
      window.location.href = "index.html";
    } else {
      homeContainerAuth.style.display = "none";
    }
  });
});

async function checkIfUserIsAdmin(user) {
  if (user) {
    try {
      const userDocRef = firebase.firestore().collection("users").doc(user.uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        const userRole = doc.data().role;
        return userRole === "admin";
      } else {
        console.error("Документ користувача не існує!");
        return false;
      }
    } catch (error) {
      console.error("Помилка при отриманні ролі користувача:", error);
      return false;
    }
  } else {
    // Якщо користувач не авторизований, перевірте localStorage на наявність даних
    const userRole = localStorage.getItem("userRole");
    return userRole === "admin";
  }
}

const homeContainer = document.querySelector(".home__container");
const homeContainerAuth = document.querySelector(".home__container-auth");


function handleUserAuthentication() {
  let userId = localStorage.getItem("userId");
  let userEmail = localStorage.getItem("userEmail");

  if (userId && userEmail) {
    // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
    modalLogin.classList.add("hide");
    userEnter.classList.add("hide");
    loginBox.classList.add("show-box");
    if (window.location.pathname.includes("index.html")) {
      console.log("Користувач вже авторизований, перенаправляю на collection-films.html");
      window.location.href = "collection-films.html"; // Замініть на свій URL
    }
    // homeContainer.style.display = "none";
    hideContainer();
    console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);
    if (document.title === "Collection") {
      searchBox.classList.add("show");
    }
  } else if (!window.location.pathname.includes("index.html")) {
    // Якщо користувач не увійшов і не знаходиться на сторінці index.html,
    // перенаправляємо його на сторінку index.html
    console.log("Направляю неавторизованого користувача на index.html");
    window.location.href = "/index.html"; // Замініть на свій шлях
  } else {
    homeContainerAuth.style.display = "none";
    effectBurger.style.display = "none";

    // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
    // або здійсніть інші дії відповідно до вашого сценарію
    console.log(
      "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
    );
  }
}
document.addEventListener("DOMContentLoaded", handleUserAuthentication);

function hideContainer() {
  if (document.title === "home") {
    homeContainer.style.display = "none";
  }
}


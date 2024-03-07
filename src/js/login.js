// // login

let searchBox = document.querySelector(".header__box");
let modalLogin = document.querySelector(".modal__wrapper");
let userEnter = document.querySelector(".header__user");
let loginBox = document.querySelector(".header__login-box");

function submitForm(event) {
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
          displaySuccesToaster();
        } else {
          console.error("Документ користувача не існує!");
        }
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Помилка входу:", errorCode, errorMessage);
      displayWrongToaster();
    });
}

// test
const effectBurger = document.querySelector(".effect");

document.addEventListener("DOMContentLoaded", async function () {
  const filmCollection = document.getElementById("filmCollection");
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // Якщо користувач авторизований
      const isAdmin = await checkIfUserIsAdmin(user);

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
    } 
    // else {
    //   homeContainerAuth.style.display = "none";
    // }
    const homeContainerAuth = document.getElementById("homeContainerAuth");
    if (homeContainerAuth) {
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
const bgNonAuth = document.querySelector(".background");
const siteNameHeader = document.querySelector(".header__site-name");

// function handleUserAuthentication() {
//   let userId = localStorage.getItem("userId");
//   let userEmail = localStorage.getItem("userEmail");

//   if (userId && userEmail) {
//     // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
//     modalLogin.classList.add("hide");
//     userEnter.classList.add("hide");
//     loginBox.classList.add("show-box");
//     siteName.style.display = "none";
//     siteNameHeader.style.display = "none";
//     if (window.location.pathname === "/") {
//       console.log(
//         "Користувач вже авторизований, перенаправляю на collection-films.html"
//       );
//       window.location.href = "collection-films.html"; // Замініть на свій URL
//     } 
//     else if (window.location.pathname === "/") {
//       window.location.href = "collection-films.html"; // Замініть на свій URL
//     }
//     hideContainer();
//     console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);
//     if (document.title === "Моя коллекція") {
//       searchBox.classList.add("show");
//     }
//   } 
//   else if (window.location.pathname !== "/") {
//     // Якщо користувач не увійшов і не знаходиться на сторінці index.html,
//     // перенаправляємо його на домашню сторінку
//     console.log("Направляю неавторизованого користувача на домашню сторінку");
//     window.location.href = "/"; // Замініть на свій шлях
// }

//   else {
//     homeContainerAuth.style.display = "none";
//     userEnter.classList.remove("hide-modal");
//     homeContainer.classList.remove("hide");
//     effectBurger.style.display = "none";
//     bgNonAuth.style.display = "block";
//     siteName.style.display = "block";
//     siteNameHeader.style.display = "block";

//     // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
//     // або здійсніть інші дії відповідно до вашого сценарію
//     console.log(
//       "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
//     );
//   }
// }

function handleUserAuthentication() {
  let userId = localStorage.getItem("userId");
  let userEmail = localStorage.getItem("userEmail");
  let currentPath = window.location.pathname;

  if (userId && userEmail) {
    // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
    modalLogin.classList.add("hide");
    userEnter.classList.add("hide");
    loginBox.classList.add("show-box");
    siteName.style.display = "none";
    siteNameHeader.style.display = "none";
    if (currentPath === "/") {
      console.log(
        "Користувач вже авторизований, перенаправляю на collection-films.html"
      );
      window.location.href = "collection-films.html"; // Замініть на свій URL
    }
    hideContainer();
    console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);
    if (document.title === "Моя коллекція") {
      searchBox.classList.add("show");
    }
  } 
  else if (currentPath !== "/" && currentPath !== "/about.html") {
    // Якщо користувач не увійшов і не знаходиться на сторінці index.html або about.html,
    // перенаправляємо його на домашню сторінку

    console.log("Направляю неавторизованого користувача на домашню сторінку");
    window.location.href = "/"; // Замініть на свій шлях
  }
  else {
    if (document.title === "Створіть свою колекцію кіно") {
      homeContainerAuth.style.display = "none";
      userEnter.classList.remove("hide-modal");
      homeContainer.classList.remove("hide");
      effectBurger.style.display = "none";
      bgNonAuth.style.display = "block";
      siteNameHeader.style.display = "block";   
     }
     if (document.title === "Про нас") {
      userEnter.classList.remove("hide-modal");
      siteNameHeader.style.display = "block";   
     }
    
   

    // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
    // або здійсніть інші дії відповідно до вашого сценарію
    console.log(
      "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
    );
  }
}


document.addEventListener("DOMContentLoaded", handleUserAuthentication);

function hideContainer() {
  if (document.title === "home" && document.title === "Про нас") {
    homeContainer.style.display = "none";
  }
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
  window.location.href = "/";
}
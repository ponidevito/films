// checkAuth.js

// window.checkAuth = function () {
//     const userId = localStorage.getItem("userId");
//     const userEmail = localStorage.getItem("userEmail");
  
//     if (userId && userEmail) {
//         console.log('yec')
//       // Користувач увійшов, повертаємо true
//       return true;
//     } else {
//         console.log('h')
//       // Користувач не увійшов, повертаємо false
//       return false;
//     }
//   };


// // Перевірка автентифікації для захищених сторінок
// document.addEventListener("DOMContentLoaded", function () {
//     const protectedPages = ["collection-films.html", "інша-захищена-сторінка.html"];
  
//     if (protectedPages.includes(window.location.pathname) && !checkAuth()) {
//       console.log("Користувач не увійшов. Перенаправлення на сторінку авторизації.");
//       window.location.href = "/index.html"; // Замініть це на URL вашої сторінки авторизації
//     }
//   });
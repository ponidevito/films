// Custom Scripts

// // checkAuth.js

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

// add film column 


document.addEventListener('DOMContentLoaded', async function () {
  if (document.title === "Collection") {
    const firebaseConfig = {
      apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
      authDomain: "cinema-collection-ce9ba.firebaseapp.com",
      projectId: "cinema-collection-ce9ba",
      storageBucket: "cinema-collection-ce9ba.appspot.com",
      messagingSenderId: "597377281566",
      appId: "1:597377281566:web:c49563737b63b6c131080f"
    };

    // Ініціалізація Firebase з конфігураційними даними
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();
    const filmCollection = document.getElementById('filmCollection');

    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const userId = user.uid;
        const isAdmin = await checkIfUserIsAdmin(user);
      
        try {
          const querySnapshot = await db.collection('films').where('authorUid', '==', userId).get();

          querySnapshot.forEach((doc) => {
            const filmData = doc.data();

            // Перевірте, чи користувач є адміном або автором фільму
            if (isAdmin || (userId && userId === filmData.authorUid)) {
              // Створіть DOM-елемент для фільму та додайте його до відображення
              const filmElement = document.createElement('a');
              filmElement.className = 'collection__column';
              filmElement.href = `details.html?id=${doc.id}`;
              filmElement.innerHTML = `
                <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                <div class="collection__about">
                  <h2 class="collection__name">${filmData.title}</h2>
                </div>
              `;
              filmCollection.appendChild(filmElement);
            }
          });
        } catch (error) {
          console.error('Помилка при отриманні фільмів з Firebase:', error);
        }
      } else if (!window.location.pathname.includes('index.html')) {
        console.log('Направляю неавторизованого користувача на index.html');
        window.location.href = 'index.html';
      }
    });
  }
});
















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



const form = document.querySelector(".form");
const imageInput = document.querySelector("#imageInput");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const imageFile = imageInput.files[0];

  uploadImage(imageFile,form);
});



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
//         // Оновлення додавання збереження id разом із даними
//         docRef.update({
//           id: docRef.id
//         }).then(() => {
//           console.log("Документ успішно додано з ID:", docRef.id);
//         }).catch((error) => {
//           console.error("Помилка при оновленні ID:", error);
//         });
//       }).catch((error) => {
//         console.error("Помилка при додаванні документа:", error);
//       });
//     });
//   });
// }

// test працює добре

function uploadImage(file) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("images/" + file.name);

  imageRef.put(file).then((snapshot) => {
    console.log("Файл успішно завантажено!");

    imageRef.getDownloadURL().then((url) => {
      const userId = localStorage.getItem('userId'); // Отримуємо userId з localStorage

      firestore.collection("films").add({
        title: form.querySelector("input[placeholder='Назва']").value,
        year: form.querySelector("input[placeholder='Рік']").value,
        description: form.querySelector("input[placeholder='Про фільм']").value,
        youtubeURL: form.querySelector("input[name='youtube']").value,
        imageURL: url,
        authorUid: localStorage.getItem('userId'),
      }).then((docRef) => {
        // Оновлення додавання збереження id разом із даними
        docRef.update({
          id: docRef.id
        }).then(() => {
          console.log("Документ успішно додано з ID:", docRef.id);
        }).catch((error) => {
          console.error("Помилка при оновленні ID:", error);
        });
      }).catch((error) => {
        console.error("Помилка при додаванні документа:", error);
      });
    });
  });
}


// тест 2 

// function uploadImage(file, form) {
//   const storageRef = firebase.storage().ref();
//   const imageRef = storageRef.child("images/" + file.name);

//   imageRef.put(file).then((snapshot) => {
//     console.log("Файл успішно завантажено!");

//     imageRef.getDownloadURL().then((url) => {
//       const title = form.querySelector("input[placeholder='Назва']").value;
//       const year = form.querySelector("input[placeholder='Рік']").value;
//       const description = form.querySelector("input[placeholder='Про фільм']").value;
//       const youtubeURL = form.querySelector("input[name='youtube']").value;

//       // Перевірка наявності фільму з такою ж назвою в колекції
//       const query = firestore.collection("films").where("title", "==", title);
//       console.log(query)

//       query.get().then((querySnapshot) => {
//         if (!querySnapshot.empty) {
//           console.log("Фільм вже є в колекції!");
//           // Додаткові дії або повідомлення можна додати тут
//         } else {
//           // Додавання фільму до колекції
//           firestore.collection("films").add({
//             title: title,
//             year: year,
//             description: description,
//             youtubeURL: youtubeURL,
//             imageURL: url,
//           }).then((docRef) => {
//             // Оновлення додавання збереження id разом із даними
//             docRef.update({
//               id: docRef.id
//             }).then(() => {
//               console.log("Документ успішно додано з ID:", docRef.id);
//             }).catch((error) => {
//               console.error("Помилка при оновленні ID:", error);
//             });
//           }).catch((error) => {
//             console.error("Помилка при додаванні документа:", error);
//           });
//         }
//       }).catch((error) => {
//         console.error("Помилка при перевірці наявності фільму:", error);
//       });
//     });
//   });
// }




}



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



// // login



let searchBox = document.querySelector(".header__box");
let modalLogin = document.querySelector(".modal__wrapper");
let userEnter = document.querySelector(".header__user");
let loginBox = document.querySelector(".header__login-box");


function submitForm() {
  let emailValue = document.getElementById("loginForm").elements.email.value;
  let passwordValue = document.getElementById("loginForm").elements.password.value;

  firebase.auth()
    .signInWithEmailAndPassword(emailValue, passwordValue)
    .then((userCredential) => {
      let user = userCredential.user;

      // Зчитати роль користувача з бази даних або Firestore
      const db = firebase.firestore();
      const userDocRef = db.collection('users').doc(user.uid);

      userDocRef.get().then((doc) => {
        if (doc.exists) {
          const userRole = doc.data().role;

          // Зберегти роль в localStorage
          localStorage.setItem('userRole', userRole);

          // Зберегти інші дані користувача в localStorage
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', doc.data().firstName); // Припустимо, що в Firestore є поле name

          // Додати/видалити класи або виконати інші дії, пов'язані з інтерфейсом
          searchBox.classList.add("show");
          modalLogin.classList.add("hide");
          userEnter.classList.add("hide");
          loginBox.classList.add("show-box");

          // Виконайте додаткові дії відповідно до ролі користувача
          if (userRole === 'admin') {
            console.log(userRole)
            // Дії для адміністратора
          } else {
            console.log(userRole)
            // Дії для звичайного користувача
          }

          console.log("Успішний вхід:", user);
        } else {
          console.error('Документ користувача не існує!');
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
  window.location.href = '/index.html'; 
}

// let userId = localStorage.getItem("userId");
// let userEmail = localStorage.getItem("userEmail");

// if (userId && userEmail) {
//   // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
//   searchBox.classList.add("show");
//   modalLogin.classList.add("hide");
//   userEnter.classList.add("hide");
//   loginBox.classList.add("show-box");

//   console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);
// } else {
//   // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
//   // або здійсніть інші дії відповідно до вашого сценарію
//   console.log(
//     "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
//   );
// }

// test





// document.addEventListener('DOMContentLoaded', async function () {
//   const filmCollection = document.getElementById('filmCollection');

//   firebase.auth().onAuthStateChanged(async function (user) {
//     if (user) {
//       // Якщо користувач авторизований
//       const isAdmin = await checkIfUserIsAdmin(user);

//       // Отримання дані про фільми з Firebase
//       if (filmCollection) {
//         try {
//           const querySnapshot = await firebase.firestore().collection('films').get();

//           querySnapshot.forEach((doc) => {
//             const filmData = doc.data();

//             // Перевірка, чи користувач є автором фільму
//             if (user.uid === filmData.authorUid) {
//               // Створіть DOM-елемент для фільму та додайте його до відображення
//               const filmElement = document.createElement('div');
//               filmElement.className = 'collection__column';
//               filmElement.innerHTML = `
//                 <h2 class="collection__name">${filmData.title}</h2>
//                 <img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster">
//               `;
//               filmCollection.appendChild(filmElement);
//             }
//           });
//         } catch (error) {
//           console.error('Помилка при отриманні фільмів з Firebase:', error);
//         }
//       }
//     } else if (!window.location.pathname.includes('index.html')) {
//       console.log('Направляю неавторизованого користувача на index.html');
//       window.location.href = 'index.html';
//     }
//   });
// });

// async function checkIfUserIsAdmin(user) {
//   if (user) {
//     try {
//       const userDocRef = firebase.firestore().collection('users').doc(user.uid);
//       const doc = await userDocRef.get();

//       if (doc.exists) {
//         const userRole = doc.data().role;
//         return userRole === 'admin';
//       } else {
//         console.error('Документ користувача не існує!');
//         return false;
//       }
//     } catch (error) {
//       console.error('Помилка при отриманні ролі користувача:', error);
//       return false;
//     }
//   } else {
//     // Якщо користувач не авторизований, перевірте localStorage на наявність даних
//     const userRole = localStorage.getItem('userRole');
//     return userRole === 'admin';
//   }
// }





document.addEventListener('DOMContentLoaded', async function () {
  const filmCollection = document.getElementById('filmCollection');

  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // Якщо користувач авторизований
      const isAdmin = await checkIfUserIsAdmin(user);

      // Отримання дані про фільми з Firebase
      if (filmCollection) {
        try {
          const querySnapshot = await firebase.firestore().collection('films').get();

          querySnapshot.forEach((doc) => {
            const filmData = doc.data();
          });
        } catch (error) {
          console.error('Помилка при отриманні фільмів з Firebase:', error);
        }
      }
    } else if (!window.location.pathname.includes('index.html')) {
      console.log('Направляю неавторизованого користувача на index.html');
      window.location.href = 'index.html';
    }
  });
});

async function checkIfUserIsAdmin(user) {
  if (user) {
    try {
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        const userRole = doc.data().role;
        return userRole === 'admin';
      } else {
        console.error('Документ користувача не існує!');
        return false;
      }
    } catch (error) {
      console.error('Помилка при отриманні ролі користувача:', error);
      return false;
    }
  } else {
    // Якщо користувач не авторизований, перевірте localStorage на наявність даних
    const userRole = localStorage.getItem('userRole');
    return userRole === 'admin';
  }
}



let userId = localStorage.getItem("userId");
let userEmail = localStorage.getItem("userEmail");

if (userId && userEmail) {
  // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
  searchBox.classList.add("show");
  modalLogin.classList.add("hide");
  userEnter.classList.add("hide");
  loginBox.classList.add("show-box");

  console.log("Користувач увійшов. ID:", userId, "Email:", userEmail);


}  else if (!window.location.pathname.includes('index.html')) {
  // Якщо користувач не увійшов і не знаходиться на сторінці index.html,
  // перенаправляємо його на сторінку index.html
  console.log('Направляю неавторизованого користувача на index.html');
  window.location.href = '/index.html'; // Замініть на свій шлях
}


else {
  // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
  // або здійсніть інші дії відповідно до вашого сценарію
  console.log(
    "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
  );
}








if (document.title === "Інформація про фільм") {
  document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = String(urlParams.get("id"));
    const moviePoster = document.getElementById("moviePoster");
    const trailerIframe = document.getElementById("movieTrailer");

    const releaseYearLabel = document.getElementById("releaseYearLabel");
    const releaseYearValue = document.getElementById("releaseYearValue");

    const movieDescrLabel = document.getElementById("movieDescrLabel");
    const movieDescrValue = document.getElementById("movieDescrValue");

    console.log("movieId:", movieId); // Додайте цей рядок

    // Отримати інформацію про фільм із Firebase Firestore за допомогою movieId
    const db = firebase.firestore();
    const moviesRef = db.collection("films");

    moviesRef
      .doc(movieId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const movieData = doc.data();
          // Відобразити детальну інформацію про фільм
          moviePoster.src = movieData.imageURL;
          document.getElementById("movieTitle").innerText = movieData.title;

          releaseYearLabel.innerText = "Рік виходу: ";
          releaseYearValue.innerText = movieData.year;

          movieDescrLabel.innerText = "Опис: ";
          movieDescrValue.innerText = movieData.description;
          trailerIframe.src = movieData.youtubeURL;

          // Додайте інші поля інформації, які вам потрібні
        } else {
          console.error("No such document!");
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  });
}


// Перевірка автентифікації для захищених сторінок
document.addEventListener("DOMContentLoaded", function () {
  const protectedPages = ["collection-films.html", "інша-захищена-сторінка.html"];

  if (protectedPages.includes(window.location.pathname) && !checkAuth()) {
    console.log("Користувач не увійшов. Перенаправлення на сторінку авторизації.");
    window.location.href = "/index.html"; // Замініть це на URL вашої сторінки авторизації
  }
});





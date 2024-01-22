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

// add film column 

// document.addEventListener('DOMContentLoaded', function () {
//   if (document.title === "Collection") {
//     const firebaseConfig = {
//       apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
//       authDomain: "cinema-collection-ce9ba.firebaseapp.com",
//       projectId: "cinema-collection-ce9ba",
//       storageBucket: "cinema-collection-ce9ba.appspot.com",
//       messagingSenderId: "597377281566",
//       appId: "1:597377281566:web:c49563737b63b6c131080f"
//       };

//       // Ініціалізація Firebase з конфігураційними даними
//       firebase.initializeApp(firebaseConfig);

//       const db = firebase.firestore();
//       const filmCollection = document.getElementById('filmCollection');

//       // Отримайте дані про фільми з Firebase
//       db.collection('films').get()
//           .then((querySnapshot) => {
//               querySnapshot.forEach((doc) => {
//                   const filmData = doc.data();
//                   // Створіть DOM-елемент для фільму та додайте його до відображення
//                   const filmElement = document.createElement('a');
//                   filmElement.className = 'collection__column';
//                   filmElement.href = 'details.html?id=${movie.id}';
//                   filmElement.innerHTML = `
//                   <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
//                   <div class="collection__about">
//                   <h2 class="collection__name">${filmData.title}</h2>
//                   </a>
                  
//                   `;
//                   filmCollection.appendChild(filmElement);
//               });
//           })
//           .catch((error) => {
//               console.error('Помилка при отриманні фільмів з Firebase:', error);
//           });
//   }
// });



// test


document.addEventListener('DOMContentLoaded', function () {
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

      // Отримайте дані про фільми з Firebase
      db.collection('films').get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  const filmData = doc.data();
                  // Створіть DOM-елемент для фільму та додайте його до відображення
                  const filmElement = document.createElement('a');
                  filmElement.className = 'collection__column';
                  filmElement.href = `details.html?id=${doc.id}`;
                  filmElement.innerHTML = `
                <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                <div class="collection__about">
                <h2 class="collection__name">${filmData.title}</h2>
                </a>
                
                `;
                  filmCollection.appendChild(filmElement);
              });
          })
          .catch((error) => {
              console.error('Помилка при отриманні фільмів з Firebase:', error);
          });
  }
});


;


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




;


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

let db; // Глобальна змінна для доступу до db
let counter = 1; // Лічильник

document.addEventListener("DOMContentLoaded", async function () {
  if (document.title === "Collection") {
    const firebaseConfig = {
      apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
      authDomain: "cinema-collection-ce9ba.firebaseapp.com",
      projectId: "cinema-collection-ce9ba",
      storageBucket: "cinema-collection-ce9ba.appspot.com",
      messagingSenderId: "597377281566",
      appId: "1:597377281566:web:c49563737b63b6c131080f",
      // конфігурація Firebase
    };

    window.searchFilms = async function () {
      const searchTerm = document.forms["header__search"]["txt"].value
        .trim()
        .toLowerCase();
      const filmCollection = document.getElementById("filmCollection");

      if (searchTerm === "") {
        alert("Введіть назву фільму для пошуку.");
        return;
      }

      try {
        const user = firebase.auth().currentUser;
        const userId = user.uid;

        const filmsSnapshot = await db
          .collection("films")
          .where("authorUid", "==", userId)
          .where("searchTitle", ">=", searchTerm.toLowerCase())
          .where("searchTitle", "<=", searchTerm.toLowerCase() + "\uf8ff")
          .get();

        // Очищення поточного вмісту перед відображенням нових результатів
        filmCollection.innerHTML = "";

        displaySearchResults(filmsSnapshot);
      } catch (error) {
        console.error("Помилка при пошуку фільмів:", error);
      }
    };

    try {
      firebase.initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Помилка при ініціалізації Firebase:", error);
    }

    db = firebase.firestore();
    const filmCollection = document.getElementById("filmCollection");

    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const userId = user.uid;
        const isAdmin = await checkIfUserIsAdmin(user);

        try {
          const querySnapshot = await db
            .collection("films")
            .where("authorUid", "==", userId)
            .get();

          querySnapshot.forEach((doc) => {
            const filmData = doc.data();

            if (isAdmin || (userId && userId === filmData.authorUid)) {
              const filmElement = document.createElement("a");
              filmElement.className = "collection__column";
              filmElement.href = `details.html?id=${doc.id}`;
              filmElement.innerHTML = `
                <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                <div class="collection__about">
                  <h2 class="collection__name">${filmData.title}</h2>
                </div>
              `;

              if (filmCollection) {
                filmCollection.appendChild(filmElement);
              } else {
                console.error("Елемент #filmCollection не знайдено.");
              }
            }
          });
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
      } else if (!window.location.pathname.includes("index.html")) {
        console.log("Направляю неавторизованого користувача на index.html");
        window.location.href = "index.html";
      }
    });
  }

  if (document.title === "cabinet") {
    const adminTableBody = document.querySelector(
      ".admin-cabinet__table tbody"
    );

    db = firebase.firestore(); // Задаємо db глобальній змінній

    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const isAdmin = await checkIfUserIsAdmin(user);

        try {
          if (isAdmin) {
            const filmsSnapshot = await db.collection("films").get();

            adminTableBody.innerHTML = ""; // Очистити поточний вміст таблиці перед заповненням новими даними
            filmsSnapshot.forEach(async (doc) => {
              const filmData = doc.data();

              // Отримати дані користувача з колекції "users"
              const userSnapshot = await db
                .collection("users")
                .doc(filmData.authorUid)
                .get();
              const userData = userSnapshot.exists ? userSnapshot.data() : {};

              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${counter}</td>
                <td>${userData.firstName}&nbsp${userData.lastName}</td>
                <td><p>${filmData.title}</p></td>
                <td>${filmData.time}, ${filmData.date}</td>
                <td>
                  <button class="admin-cabinet__button-delete delete-button link" data-id="${doc.id}" onclick="deleteFilm('${doc.id}')">Видалити</button>
                </td>
              `;

              adminTableBody.appendChild(row);
              counter++;
            });

            const deleteButtons = document.querySelectorAll(".delete-button");
            deleteButtons.forEach((button) => {
              button.addEventListener("click", handleDeleteButtonClick);
            });
          } else {
            // Якщо користувач не адміністратор, виводити тільки його власні фільми
            const userFilmsSnapshot = await db
              .collection("films")
              .where("authorUid", "==", user.uid)
              .get();
            const userSnapshot = await db
              .collection("users")
              .doc(user.uid)
              .get();
            const userData = userSnapshot.exists ? userSnapshot.data() : {};
            console.log(userData);

            adminTableBody.innerHTML = ""; // Очистити поточний вміст таблиці перед заповненням новими даними
            userFilmsSnapshot.forEach((doc) => {
              const filmData = doc.data();

              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${counter}</td>
                <td>${userData.firstName}&nbsp${userData.lastName}</td>
                <td>${filmData.title}</td>
                <td>${filmData.time}, ${filmData.date}</td>
                <td>
                  <button class="admin-cabinet__button-delete delete-button link" data-id="${doc.id}" onclick="deleteFilm('${doc.id}')">Видалити</button>
                </td>
              `;

              adminTableBody.appendChild(row);
              counter++;
            });

            const deleteButtons = document.querySelectorAll(".delete-button");
            deleteButtons.forEach((button) => {
              button.addEventListener("click", handleDeleteButtonClick);
            });
          }
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
      }
    });
  }
});

// Поза блоком event listener
function displaySearchResults(filmsSnapshot) {
  const filmCollection = document.getElementById("filmCollection");

  filmsSnapshot.forEach((doc) => {
    const filmData = doc.data();

    const filmElement = document.createElement("a");
    filmElement.className = "collection__column";
    filmElement.href = `details.html?id=${doc.id}`;
    filmElement.innerHTML = `
      <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
      <div class="collection__about">
        <h2 class="collection__name">${filmData.title}</h2>
      </div>
    `;

    if (filmCollection) {
      filmCollection.appendChild(filmElement);
    } else {
      console.error("Елемент #filmCollection не знайдено.");
    }
  });
}

// Функція для обробки кліку на кнопку видалення
function handleDeleteButtonClick(event) {
  const filmId = event.target.dataset.id;
  const confirmDelete = confirm("Ви впевнені, що хочете видалити цей фільм?");
  if (confirmDelete) {
    deleteFilm(filmId);
  }
}

// Функція для форматування дати
function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("uk-UA");
}

// Функція для видалення фільму

document.addEventListener("DOMContentLoaded", async function () {
  // Інші частини вашого коду...

  // Функція для видалення фільму
  window.deleteFilm = async function (filmId) {
    try {
      if (!db) {
        console.error("Помилка: db не ініціалізовано.");
        return;
      }

      await db.collection("films").doc(filmId).delete();
      console.log("Фільм видалено успішно!");

      // Оновлення DOM-елементу після видалення
      const deletedRow = document.querySelector(`[data-id="${filmId}"]`);
      if (deletedRow) {
        deletedRow.parentElement.parentElement.remove();
        console.log("Лічильник після видалення:", counter);
      } else {
        console.warn(`Елемент з data-id=${filmId} не знайдено для видалення.`);
      }

      // Перерахування номерів рядків
      const rows = document.querySelectorAll(".admin-cabinet__table tbody tr");
      rows.forEach((row, index) => {
        const cell = row.querySelector("td:first-child");
        if (cell) {
          cell.textContent = index + 1;
        }
      });
    } catch (error) {
      console.error("Помилка при видаленні фільму:", error);
    }
  };

  // Інші частини вашого коду...
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

const filmNameInput = document.getElementById("filmName");
const filmDescriptionInput = document.getElementById("filmDescription");

filmNameInput.addEventListener("input", function () {
    this.value = capitalizeFirstLetter(this.value);
});

filmDescriptionInput.addEventListener("input", function () {
    this.value = capitalizeFirstLetter(this.value);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function uploadImage(file) {
  try {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child("images/" + file.name);
  
    // Операція завантаження файлу
    const snapshot = await imageRef.put(file);
  
    // Отримання URL для завантаженого зображення
    const url = await imageRef.getDownloadURL();
  
    const userId = localStorage.getItem('userId');
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
  
    const formattedTime = `${hours}.${minutes}`;
    const formattedDate = `${month}/${day}/${year}`;
  
    const filmTitle = form.querySelector("input[placeholder='Назва']").value;
  
    // Перевірка, чи існує фільм з такою ж назвою
    const existingFilms = await firestore.collection("films").where("title", "==", filmTitle).get();
  
    if (!existingFilms.empty) {
      console.error("Фільм з такою назвою вже існує.");
      return;
    }
    console.log("Файл успішно завантажено!");

  
    // Додавання нового фільму
    const docRef = await firestore.collection("films").add({
      title: filmTitle,
      time: formattedTime,
      date: formattedDate,
      year: form.querySelector("input[placeholder='Рік']").value,
      description: form.querySelector("input[placeholder='Про фільм']").value,
      youtubeURL: form.querySelector("input[name='youtube']").value,
      imageURL: url,
      authorUid: userId,
      searchTitle: filmTitle.toLowerCase(),
    });
  
    // Оновлення додавання збереження id разом із даними
    await docRef.update({
      id: docRef.id
    });
  
    console.log("Документ успішно додано з ID:", docRef.id);
  } catch (error) {
    console.error("Виникла помилка при обробці:", error);
  }
}








}



// Модальное окно

// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger),
//     modal = document.querySelector(modal),
//     close = document.querySelector(close)

//   const body = document.body

//   trigger.addEventListener('click', e => {
//     e.preventDefault()
//     modal.style.display = 'flex'
//     body.classList.add('locked')
//   });
//   close.addEventListener('click', () => {
//     modal.style.display = 'none'
//      body.classList.remove('locked')
//   });
//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none'
//        body.classList.remove('locked')
//     }
//   })
// }

// bindModal('.modal__btn', '.modal__wrapper', '.modal__close')


// test 1

// const modalBtnEnter = document.querySelector ('.modal__button')
// const modalTitle = document.querySelector ('.modal__title')


// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger);
//   modal = document.querySelector(modal);
//   close = document.querySelector(close);
//   const body = document.body;

//   trigger.addEventListener('click', e => {
//     e.preventDefault();
//     modal.style.display = 'flex';
//     body.classList.add('locked');
//   });

//   close.addEventListener('click', () => {
//     modal.style.display = 'none';
//     body.classList.remove('locked');
//   });

//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none';
//       body.classList.remove('locked');
//     }
//   });
// }

// function toggleRegistrationForm() {
//   const loginForm = document.getElementById('loginForm');
//   const registrationForm = document.getElementById('registrationForm');
//   const registrationLink = document.getElementById('registrationLink');

//   loginForm.style.display = 'none';
//   modalBtnEnter.style.display = 'none';
//   registrationForm.style.display = 'flex';
//   registrationLink.textContent = 'Увійти';
//   modalTitle.textContent = 'Реєстрація';
//   registrationLink.onclick = toggleLoginForm;
// }

// function toggleLoginForm() {
//   const loginForm = document.getElementById('loginForm');
//   const registrationForm = document.getElementById('registrationForm');
//   const registrationLink = document.getElementById('registrationLink');

//   loginForm.style.display = 'flex';
//   registrationForm.style.display = 'none';
//   registrationLink.textContent = 'Зареєструватись';
//   registrationLink.onclick = toggleRegistrationForm;
// }

// // Initialize modal with default content
// bindModal('.modal__btn', '.modal__wrapper', '.modal__close');


// test

// const modalBtnEnter = document.querySelector ('.modal-enter')
// const modalTitle = document.getElementById ('title')

// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger);
//   modal = document.querySelector(modal);
//   close = document.querySelector(close);
//   const body = document.body;

//   trigger.addEventListener('click', e => {
//     e.preventDefault();
//     modal.style.display = 'flex';
//     body.classList.add('locked');
//   });

//   close.addEventListener('click', () => {
//     modal.style.display = 'none';
//     body.classList.remove('locked');
//   });

//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none';
//       body.classList.remove('locked');
//     }
//   });
// }

// function toggleRegistrationForm() {
//   const loginForm = document.querySelector('.first-modal');
//   const registrationForm = document.querySelector('.second-modal');
//   const registrationLink = document.getElementById('registrationLink');
//   const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button


//   loginForm.style.display = 'none';
//   modalBtnEnter.style.display = 'none';
//   registrationForm.classList.add('form-registration')
//   registrationForm.style.display = 'flex';
//   registrationLink.textContent = 'Увійти';
//   registrationLink.style.textAlign = 'start';
//   registrationLink.onclick = toggleLoginForm;
//   regButton.style.display = 'flex';
//   modalTitle.textContent = 'Зареєструватись';
// }

// function toggleLoginForm() {
//   const loginForm = document.querySelector('.first-modal');
//   const registrationForm = document.querySelector('.second-modal');
//   const registrationLink = document.getElementById('registrationLink');
//   const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button

//   loginForm.style.display = 'flex';
//   registrationForm.classList.remove('form-registration')
//   registrationForm.style.display = 'none';
//   registrationLink.textContent = 'Зареєструватись';
//   modalTitle.textContent = 'Вхід';
//   registrationLink.style.textAlign = 'end';
//   registrationLink.onclick = toggleRegistrationForm;
//   regButton.style.display = 'none';
// }

// // Initialize modal with default content
// bindModal('.modal__btn', '.modal__wrapper', '.modal__close');


const firstModal = document.querySelector ('.firstM')
const secondModal = document.querySelector ('.secondM')


if(firstModal) {
  const modalBtnEnter = document.querySelector ('.modal-enter')
  const modalTitle = document.getElementById ('title')
  
  function bindModal(trigger, modal, close) {
    trigger = document.querySelector(trigger);
    modal = document.querySelector(modal);
    close = document.querySelector(close);
    const body = document.body;
  
    trigger.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'flex';
      body.classList.add('locked');
    });
  
    close.addEventListener('click', () => {
      modal.style.display = 'none';
      body.classList.remove('locked');
    });
  
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
        body.classList.remove('locked');
      }
    });
  }
  
  function toggleRegistrationForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
  
    loginForm.style.display = 'none';
    modalBtnEnter.style.display = 'none';
    registrationForm.classList.add('form-registration')
    registrationForm.style.display = 'flex';
    registrationLink.textContent = 'Увійти';
    registrationLink.style.textAlign = 'start';
    registrationLink.onclick = toggleLoginForm;
    regButton.style.display = 'flex';
    modalTitle.textContent = 'Зареєструватись';
  }
  
  function toggleLoginForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
    loginForm.style.display = 'flex';
    registrationForm.classList.remove('form-registration')
    registrationForm.style.display = 'none';
    registrationLink.textContent = 'Зареєструватись';
    modalTitle.textContent = 'Вхід';
    registrationLink.style.textAlign = 'end';
    registrationLink.onclick = toggleRegistrationForm;
    regButton.style.display = 'none';
  }
  
  // Initialize modal with default content
  bindModal('.modal__btn', '.modal__wrapper', '.modal__close');
}

if(secondModal) {
  const modalBtnEnter = document.querySelector ('.modal-enter')
  const modalTitle = document.getElementById ('title')
  
  function bindModal(trigger, modal, close) {
    trigger = document.querySelector(trigger);
    modal = document.querySelector(modal);
    close = document.querySelector(close);
    const body = document.body;
  
    trigger.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'flex';
      body.classList.add('locked');
    });
  
    close.addEventListener('click', () => {
      modal.style.display = 'none';
      body.classList.remove('locked');
    });
  
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
        body.classList.remove('locked');
      }
    });
  }
  
  function toggleRegistrationForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
  
    loginForm.style.display = 'none';
    modalBtnEnter.style.display = 'none';
    registrationForm.classList.add('form-registration')
    registrationForm.style.display = 'flex';
    registrationLink.textContent = 'Увійти';
    registrationLink.style.textAlign = 'start';
    registrationLink.onclick = toggleLoginForm;
    regButton.style.display = 'flex';
    modalTitle.textContent = 'Зареєструватись';
  }
  
  function toggleLoginForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
    loginForm.style.display = 'flex';
    registrationForm.classList.remove('form-registration')
    registrationForm.style.display = 'none';
    registrationLink.textContent = 'Зареєструватись';
    modalTitle.textContent = 'Вхід';
    registrationLink.style.textAlign = 'end';
    registrationLink.onclick = toggleRegistrationForm;
    regButton.style.display = 'none';
  }
  
  // Initialize modal with default content
  bindModal('.modal__btnReg', '.modal__wrapper', '.modal__close');
}
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

let userId = localStorage.getItem("userId");
let userEmail = localStorage.getItem("userEmail");

if (userId && userEmail) {
  // Якщо дані користувача знайдено в localStorage, виконати відповідні дії
  modalLogin.classList.add("hide");
  userEnter.classList.add("hide");
  loginBox.classList.add("show-box");
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
  // Якщо дані користувача не знайдено, можливо, покажіть стандартний інтерфейс
  // або здійсніть інші дії відповідно до вашого сценарію
  console.log(
    "Користувач не увійшов. Покажіть стандартний інтерфейс або виконайте інші дії."
  );
}

function hideContainer() {
  if (document.title === "home") {
    homeContainer.style.display = "none";
  }
}

// function hideContainer() {
//   if (document.title === "home") {
//     homeContainer.style.display = "none";
//   }
// }
function regForm() {
    const firstName = document.getElementsByName("firstName")[0].value;
    const lastName = document.getElementsByName("lastName")[0].value;
    const emailValue = document.getElementsByName("regEmail")[0].value;
    const passwordValue = document.getElementsByName("regPassword")[0].value;

    // Створення нового користувача в Firebase
    firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
        .then((userCredential) => {
            const user = userCredential.user;

            // Зчитування ролі користувача з бази даних або Firestore
            const db = firebase.firestore();
            const userDocRef = db.collection("users").doc(user.uid);

            // Створення документа для нового користувача в Firestore
            userDocRef.set({
                firstName: firstName,
                lastName: lastName,
                email:emailValue,
                role: 'user'
                // Додайте інші поля користувача, які вам потрібні
            }).then(() => {
                // Збереження ролі в localStorage
                localStorage.setItem("userRole", "USER");

                // Збереження інших даних користувача в localStorage
                localStorage.setItem("userId", user.uid);
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("userName", firstName);

                // Додавання/видалення класів або виконання інших дій, пов'язаних з інтерфейсом
                modalLogin.classList.add("hide");
                userEnter.classList.add("hide");
                loginBox.classList.add("show-box");

                console.log("Успішна реєстрація та вхід:", user);
                // Перенаправлення на сторінку collection-films
                // window.location.href = "collection-films.html";
            }).catch((error) => {
                console.error("Помилка при створенні документа користувача:", error);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Помилка реєстрації та входу:", errorCode, errorMessage);
        });
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





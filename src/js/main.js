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
  const firebaseConfig = {
    apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
    authDomain: "cinema-collection-ce9ba.firebaseapp.com",
    projectId: "cinema-collection-ce9ba",
    storageBucket: "cinema-collection-ce9ba.appspot.com",
    messagingSenderId: "597377281566",
    appId: "1:597377281566:web:c49563737b63b6c131080f",
    // конфігурація Firebase
  };
  const filmCollection = document.getElementById("filmCollection");

  if (document.title === "Collection") {
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

  if (document.title === "home") {
    try {
      firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const userId = user.uid;

          // Перевірка ініціалізації db
          if (!firebase.firestore) {
            console.error("Firestore не ініціалізовано.");
            return;
          }

          const db = firebase.firestore();

          const filmsSnapshot = await db
            .collection("films")
            .where("authorUid", "==", userId)
            .get();

          filmsSnapshot.forEach((doc) => {
            const filmData = doc.data();

            const slide = document.createElement("a");
            slide.className = "swiper-slide";
            slide.href = `details.html?id=${doc.id}`;
            slide.innerHTML = `
                        <div class="collection__column">
                            <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                            <div class="collection__about">
                                <h2 class="collection__name">${filmData.title}</h2>
                            </div>
                        </div>
                    `;

            filmCollection.appendChild(slide);
          });

          // Після додавання всіх елементів ініціалізуйте Swiper
          initializeSwiper();
        }
      });
    } catch (error) {
      console.error("Помилка при отриманні фільмів з Firebase:", error);
    }
  }

  // Якщо сторінка - це "home", відображення слайдера

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

// Функція для ініціалізації Swiper
function initializeSwiper() {
  new Swiper(".swiper", {
    // Налаштування Swiper
    loop: true,
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },
    pagination: {
      // el: ".swiper-pagination",
      // clickable: true,
    },
    slidesPerView: 8, // Відображення чотирьох слайдів
    spaceBetween: 30, // Відступ між слайдами
    autoplay: {
      delay: 2500, // Затримка між слайдами у мілісекундах (в цьому випадку 5000 мс, тобто 5 секунд)
      disableOnInteraction: false, // Вимкнення автопрокрутки після взаємодії користувача (необов'язково)
    },
    speed: 1500, 
  });
}

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

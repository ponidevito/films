window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    // document.body.scrollTop > 600 ||
    document.documentElement.scrollTop > 0
  ) {
    document.querySelector(".header").classList.add("_active");
  } else {
    document.querySelector(".header").classList.remove("_active");
  }
}

function togglePasswordVisibility() {
  let checkboxColorText = document.querySelector(".modal__checkbox");
  let passwordField = document.getElementById("password");
  let showPasswordCheckbox = document.getElementById("showPassword");

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

let current_page = 1;
let records_per_page = 12;
let filmsData = [];

function prevPage() {
  if (current_page > 1) {
    current_page--;
    showSpinner(); // Показати спінер перед початком завантаження
    changePage(current_page);
    renderFilms();
    window.scrollTo(0, 0);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    showSpinner(); // Показати спінер перед початком завантаження
    changePage(current_page);
    renderFilms();
    window.scrollTo(0, 0);
  }
}

function numPages() {
  return Math.ceil(filmsData.length / records_per_page);
}

// Функція для завантаження даних з Firebase

async function loadFilmsData(userId) {
  try {
    showSpinner(); // Показати спінер перед початком завантаження
    const filmsSnapshot = await db
      .collection("films")
      .where("authorUid", "==", userId)
      .get();
    filmsData = filmsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    renderFilms();
    hideSpinner(); // Приховати спінер після завершення завантаження
  } catch (error) {
    console.error("Помилка при завантаженні фільмів з Firebase:", error);
    hideSpinner(); // Приховати спінер після завершення завантаження
  }
}

function generatePageButtons() {
  let pageButtonsContainer = document.getElementById("page-buttons");
  pageButtonsContainer.innerHTML = ""; // Очищаємо контейнер кнопок перед генерацією
  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");
  let totalPages = numPages(); // Отримуємо загальну кількість сторінок
  let maxVisibleButtons = window.innerWidth < 992 ? 5 : 10; // Визначаємо максимальну кількість видимих кнопок в залежності від розміру екрану

  if (totalPages <= 1) {
    // Якщо тільки одна сторінка, приховуємо обидві кнопки
    btn_prev.style.display = "none";
    btn_next.style.display = "none";
    return;
  }

  let startPage, endPage;

  if (totalPages <= maxVisibleButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (current_page <= Math.floor(maxVisibleButtons / 2) + 1) {
      startPage = 1;
      endPage = maxVisibleButtons;
    } else if (current_page + Math.floor(maxVisibleButtons / 2) >= totalPages) {
      startPage = totalPages - maxVisibleButtons + 1;
      endPage = totalPages;
    } else {
      startPage = current_page - Math.floor(maxVisibleButtons / 2);
      endPage = current_page + Math.floor(maxVisibleButtons / 2);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    let button = document.createElement("button");
    button.textContent = i;
    button.dataset.page = i;
    if (i === current_page) {
      button.classList.add("active"); // Позначаємо активну сторінку
    }
    button.addEventListener("click", function () {
      changePage(parseInt(this.dataset.page));
    });
    pageButtonsContainer.appendChild(button);
  }
}

function changePage(page) {
  current_page = page;
  renderFilms();
  generatePageButtons(); // Оновлюємо кнопки сторінки
  window.scrollTo(0, 0);
  hideSpinner(); // Приховати спінер після завершення завантаження
}

function renderFilms() {
  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");
  let listing_table = document.getElementById("filmCollection");
  listing_table.innerHTML = ""; // Очищаємо колекцію перед відображенням нових фільмів
  let startIndex = (current_page - 1) * records_per_page;
  let endIndex = startIndex + records_per_page;

  for (let i = startIndex; i < endIndex && i < filmsData.length; i++) {
    const filmData = filmsData[i];
    const filmElement = document.createElement("a");
    filmElement.className = "collection__column";
    filmElement.href = `details.html?id=${filmData.id}`; // Формуємо посилання з ідентифікатором фільму
    filmElement.innerHTML = `
      <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster" loading="lazy"></div>
      <div class="collection__about">
        <h2 class="collection__name">${filmData.title}</h2>
      </div>
    `;
    listing_table.appendChild(filmElement);
  }
  generatePageButtons(); // Оновлюємо кнопки сторінки

  if (current_page === 1) {
    btn_prev.style.visibility = "hidden";
    btn_next.style.visibility = "visible";
  } else if (current_page === numPages()) {
    btn_prev.style.visibility = "visible";
    btn_next.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
    btn_next.style.visibility = "visible";
  }
}

let db; // Глобальна змінна для доступу до db
let counter = 1; // Лічильник

const backgroundCollection = document.querySelector(".background-collection");

// Додаємо прослуховувач подій на зміну розміру вікна
window.addEventListener("resize", function () {
  if (document.title === "Моя коллекція") {
    generatePageButtons(); // Викликаємо функцію генерації кнопок сторінок при кожній зміні розміру вікна
  }
});

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

  if (document.title === "Моя коллекція") {
    window.onload = function () {
      let listing_table = document.getElementById("filmCollection");
      let items = Array.from(listing_table.children);
      // Приховуємо всі елементи, крім перших records_per_page
      for (let i = records_per_page; i < items.length; i++) {
        items[i].style.display = "none";
      }
    };

    window.searchFilms = async function () {
      const searchTerm = document.forms["header__search"]["txt"].value.trim();
      const filmCollection = document.getElementById("filmCollection");

      if (searchTerm === "") {
        displaySearchToaster();
        return;
      }

      const pagination = document.querySelector(".pagination");

      try {
        const user = firebase.auth().currentUser;
        const userId = user.uid;

        // Отримання всіх фільмів користувача
        const filmsSnapshot = await db
          .collection("films")
          .where("authorUid", "==", userId)
          .get();

        // Очищення поточного вмісту перед відображенням нових результатів
        filmCollection.innerHTML = "";
        document.forms["header__search"]["txt"].value = "";

        // Виклик функції для відображення результатів пошуку
        displaySearchResults(filmsSnapshot, searchTerm);

        pagination.style.display = "none";
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
        showSpinner();
        const userId = user.uid;
        const isAdmin = await checkIfUserIsAdmin(user);
        const collectionBody = document.querySelector(".collection__body");
        const collectionTitle = document.querySelector(".collection__title");
        try {
          const querySnapshot = await db
            .collection("films")
            .where("authorUid", "==", userId)
            .get();

          if (querySnapshot.empty) {
            collectionBody.style.display = "block";
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty";
            emptyMessage.textContent = "Ваша колекція порожня";
            emptyMessage.style.width = "100%";
            emptyMessage.style.textAlign = "center";
            filmCollection.appendChild(emptyMessage);
            collectionTitle.style.display = "none";
            hideSpinner();
            // Створення посилання "додати фільм"
            const addFilmLink = document.createElement("a");
            addFilmLink.textContent = "Додати фільм";
            addFilmLink.className = "link link-add";
            addFilmLink.href = "add-film.html"; // Замініть це на посилання на вашу сторінку додавання фільму
            addFilmLink.style.display = "flex"; // Щоб посилання відображалося в новому рядку
            addFilmLink.style.textAlign = "center";
            btn_prev.style.display = "none";
            btn_next.style.display = "none";
            collectionCounter.classList.add('hide')
            filmCollection.appendChild(addFilmLink);
          } else {
            loadFilmsData(userId);
            updateCounter();
            collectionCounter.classList.remove('hide')

            hideSpinner();
          }
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
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

          if (filmsSnapshot.empty) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "swipet-empty";
            emptyMessage.textContent = "Ваша колекція порожня";
            emptyMessage.style.fontSize = "25px";
            emptyMessage.style.width = "100%";
            emptyMessage.style.textAlign = "center";
          }
        }
      });
    } catch (error) {
      console.error("Помилка при отриманні фільмів з Firebase:", error);
    }
  }

  if (document.title === "Кабінет") {
    const adminTableBody = document.querySelector(
      ".admin-cabinet__table tbody"
    );

    db = firebase.firestore(); // Задаємо db глобальній змінній

    firebase.auth().onAuthStateChanged(async function (user) {
      window.deleteFilm = async function (filmId) {
        try {
          if (!db) {
            console.error("Помилка: db не ініціалізовано.");
            return;
          }

          await db.collection("films").doc(filmId).delete();
          console.log("Фільм видалено успішно!");
          displayDeleteSuccesToaster();
          // Оновлення DOM-елементу після видалення
          const deletedRow = document.querySelector(`[data-id="${filmId}"]`);
          if (deletedRow) {
            deletedRow.remove();
            // Перерахувати номери рядків
            const rows = document.querySelectorAll(
              ".admin-cabinet__table tbody tr"
            );
            rows.forEach((row, index) => {
              const cell = row.querySelector("td:first-child");
              if (cell) {
                cell.textContent = index + 1;
              }
            });
          } else {
            console.warn(
              `Елемент з data-id=${filmId} не знайдено для видалення.`
            );
          }
        } catch (error) {
          console.error("Помилка при видаленні фільму:", error);
        }
      };

      if (user) {
        const isAdmin = await checkIfUserIsAdmin(user);
        showSpinner();

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

              const row = document.createElement(`tr data-id="${filmId}`);
              row.innerHTML = `
                <td>${counter}</td>
                <td>${userData.firstName}&nbsp${userData.lastName}</td>
                <td><p>${filmData.title}</p></td>
                <td>${filmData.time}, ${filmData.date}</td>
                <td class="d-flex">
                <button class="admin-cabinet__button-edit edit-button link" data-id="${doc.id}" onclick="editFilm('${doc.id}')">Редагувати</button>
                <button class="admin-cabinet__button-delete delete-button link" data-id="${doc.id}" onclick="deleteFilm('${doc.id}')">Видалити</button>
                </td>
              `;

              adminTableBody.appendChild(row);
              counter++;
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

            adminTableBody.innerHTML = ""; // Очистити поточний вміст таблиці перед заповненням новими даними
            userFilmsSnapshot.forEach((doc) => {
              const filmData = doc.data();

              const row = document.createElement("tr");
              row.setAttribute("data-id", doc.id); // Додайте атрибут data-id зі значенням filmId

              row.innerHTML = `
                <td>${counter}</td>
                <td >${userData.firstName}&nbsp${userData.lastName}</td>
                <td class="title">${filmData.title}</td>
                <td>${filmData.time}, ${filmData.date}</td>
                <td class="d-flex">
                <button class="admin-cabinet__button-edit edit-button link" data-id="${doc.id}" onclick="editFilm('${doc.id}')">Редагувати</button>
                <button class="admin-cabinet__button-delete delete-button link" data-id="${doc.id}" onclick="deleteFilm('${doc.id}')">Видалити</button>
                </td>
              `;

              adminTableBody.appendChild(row);
              counter++;

              // Додати прослуховувачів подій після додавання рядка до таблиці
            });
          }

          hideSpinner();
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
      }
    });
  }
});

let previousListener;

async function editFilm(filmId) {
  window.scrollTo(0, 0);

  let form = document.querySelector(".form");
  form.classList.toggle("block");

  try {
    const filmDoc = await db.collection("films").doc(filmId).get();

    if (!filmDoc.exists) {
      console.error("Фільм не знайдено.");
      return;
    }

    const filmData = filmDoc.data();

    // Заповнюємо форму даними фільму
    document.getElementById("filmName").value = filmData.title;
    document.getElementById("filmYear").value = filmData.year;
    document.getElementById("filmDescription").value = filmData.description;
    document.getElementById("trailer").value = filmData.youtubeURL;
    document.getElementById("moviePoster").src = filmData.imageURL;

    const editFilmForm = document.getElementById("editFilmForm");
    editFilmForm.removeEventListener("submit", previousListener);

    previousListener = async function (event) {
      event.preventDefault();

      const editedFilm = {
        title: document.getElementById("filmName").value,
        year: document.getElementById("filmYear").value,
        description: document.getElementById("filmDescription").value,
        youtubeURL: document.getElementById("trailer").value,
        imageURL: filmData.imageURL,
        searchTitle: document.getElementById("filmName").value.toLowerCase(),
      };

      const file = document.getElementById("imageInput").files[0];

      if (file) {
        const imageUrl = await uploadImage(file);
        editedFilm.imageURL = imageUrl;
      }

      await updateFilm(filmId, editedFilm);

      form.classList.remove("block");

      // Додайте будь-яке інше оновлення DOM, яке вам потрібно зробити тут
    };

    editFilmForm.addEventListener("submit", previousListener);
  } catch (error) {
    console.error("Помилка при редагуванні фільму:", error);
  }
}

// update film

async function updateFilm(filmId, editedFilm) {
  try {
    const db = firebase.firestore();

    // Оновити документ фільму з використанням методу update
    await db.collection("films").doc(filmId).update(editedFilm);

    console.log("Фільм успішно оновлено у Firebase.");
    displayEditSuccesToaster();
    // Отримати посилання на рядок у таблиці
    // Отримати посилання на рядок у таблиці за допомогою data-id
    const editedRow = document.querySelector(`[data-id="${filmId}"]`);

    if (editedRow) {
      // Оновлення даних фільму в таблиці відповідно до нових даних
      const filmNameElement = editedRow.querySelector(".title"); // Знайти елемент, який містить назву фільму
      if (filmNameElement) {
        filmNameElement.textContent = editedFilm.title;
      }
    } else {
      console.warn(`Елемент з data-id=${filmId} не знайдено для оновлення.`);
    }
  } catch (error) {
    console.error("Помилка при оновленні фільму в Firebase:", error);
  }
}

// Оновлення рядка таблиці з новими даними

async function uploadImage(file) {
  try {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child("images/" + file.name);

    // Операція завантаження файлу
    const snapshot = await imageRef.put(file);

    // Отримання URL для завантаженого зображення
    const url = await imageRef.getDownloadURL();

    console.log("Файл успішно завантажено:", url);

    return url; // Повертаємо URL завантаженого зображення
  } catch (error) {
    console.error("Виникла помилка при завантаженні зображення:", error);
    throw error; // Передаємо помилку для обробки у вищих рівнях коду
  }
}

function displaySearchResults(filmsSnapshot, searchTerm) {
  const filmCollection = document.getElementById("filmCollection");
  filmCollection.innerHTML = ""; // Очищуємо вміст колекції перед відображенням нових результатів
  let foundFilms = false; // Змінна, щоб визначити, чи були знайдені фільми
  const collectionBody = document.querySelector(".collection__body");

  filmsSnapshot.forEach((doc) => {
    const filmData = doc.data();
    const searchTitle = filmData.searchTitle.toLowerCase();

    // Перевірка, чи співпадає назва фільму з пошуковим терміном
    if (searchTitle.includes(searchTerm.toLowerCase())) {
      const filmElement = document.createElement("a");
      filmElement.className = "collection__column";
      filmElement.href = `details.html?id=${doc.id}`;
      filmElement.innerHTML = `
        <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
        <div class="collection__about">
          <h2 class="collection__name">${filmData.title}</h2>
        </div>
      `;

      filmCollection.appendChild(filmElement);
      window.scrollTo(0, 0);

      foundFilms = true; // Встановлюємо значення, якщо фільми знайдено
    }
  });

  // Якщо фільми не були знайдені, вивести повідомлення
  if (!foundFilms) {
    collectionBody.classList.add("flex");
    const noResultsElement = document.createElement("div");
    noResultsElement.innerHTML = "<p class='no-results'>Нічого не знайдено</p>";
    filmCollection.appendChild(noResultsElement);
  } else {
    collectionBody.classList.remove("flex");
  }
}

// Функція для форматування дати
function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("uk-UA");
}

// Функція для видалення фільму

function validatePassword() {
  const passwordInput = document.getElementById("regPassword");
  const password = passwordInput.value;
  const passwordPattern = /^[A-Za-z0-9]{6,}$/; // Регулярний вираз для валідації пароля

  if (!passwordPattern.test(password)) {
    console.log("wrong");
  } else {
    console.log("good");

    passwordInput.setCustomValidity(""); // Скидаємо валідацію, якщо пароль відповідає вимогам
  }
}

// counter

// Функція для анімації зміни значення лічильника
function animateCounter(targetValue, duration) {
  const startTime = new Date().getTime();
  const endTime = startTime + duration;

  function updateCounter() {
    const currentTime = new Date().getTime();
    const progress = Math.min(1, (currentTime - startTime) / duration);
    const counterValue = Math.floor(targetValue * progress);
    counterElement.textContent = counterValue.toLocaleString(); // Форматування числа з комами

    if (currentTime < endTime) {
      requestAnimationFrame(updateCounter);
    }
  }
  updateCounter();
}


const collectionCounter = document.querySelector(".collection__counter");
const counterElement = document.querySelector(".numCounter");
const counterElementFilms = document.querySelector(".filmsSpan");

// Функція для оновлення значення лічильника
async function updateCounter() {

  try {
    const querySnapshot = await firebase.firestore().collection("films").get();
    const numberOfFilms = querySnapshot.size;
    animateCounter(numberOfFilms, 1000); // Змініть час анімації за необхідності
    counterElement.textContent = numberOfFilms;
    
    if (numberOfFilms >= 2 && numberOfFilms <= 4) {
      counterElementFilms.textContent = "фільма";
  } 
    else if (numberOfFilms === 1) {
      counterElementFilms.textContent = "фільм";

    }
    else {
      counterElementFilms.textContent = "фільмів";

    }
  } catch (error) {
    console.error("Помилка при отриманні кількості фільмів:", error);
  }
}


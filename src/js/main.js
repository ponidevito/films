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

// тест

let current_page = 1;
let records_per_page = 4;
let filmsData = [];

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
    renderFilms();
    window.scrollTo(0, 0);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
    renderFilms();
    window.scrollTo(0, 0);
  }
}

function numPages() {
  let listing_table = document.getElementById("filmCollection");
  let items = Array.from(listing_table.children);
  // return Math.ceil(items.length / records_per_page);
  return Math.ceil(filmsData.length / records_per_page);
}

// Функція для завантаження даних з Firebase


async function loadFilmsData(userId) {
  try {
    const filmsSnapshot = await db.collection("films").where("authorUid", "==", userId).get();
    filmsData = filmsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    renderFilms();
  } catch (error) {
    console.error("Помилка при завантаженні фільмів з Firebase:", error);
  }
}


// Змінена функція changePage для оновлення кнопок сторінки після зміни сторінки

// function generatePageButtons() {
//   let pageButtonsContainer = document.getElementById("page-buttons");
//   pageButtonsContainer.innerHTML = ""; // Очищаємо контейнер кнопок перед генерацією
//   let btn_next = document.getElementById("btn_next");
//   let btn_prev = document.getElementById("btn_prev");
//   let totalPages = numPages(); // Отримуємо загальну кількість сторінок

//   if (totalPages <= 1) {
//     // Якщо тільки одна сторінка, приховуємо обидві кнопки
//     btn_prev.style.display = "none";
//     btn_next.style.display = "none";
    
//     return;
//   }

//   let startPage, endPage;

//   if (totalPages <= 10) {
//     startPage = 1;
//     endPage = totalPages;
//   } else {
//     if (current_page <= 6) {
//       startPage = 1;
//       endPage = 10;
//     } else if (current_page + 4 >= totalPages) {
//       startPage = totalPages - 9;
//       endPage = totalPages;
//     } else {
//       startPage = current_page - 5;
//       endPage = current_page + 4;
//     }
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     let button = document.createElement("button");
//     button.textContent = i;
//     button.dataset.page = i;
//     if (i === current_page) {
//       button.classList.add("active"); // Позначаємо активну сторінку
//     }
//     button.addEventListener("click", function () {
//       changePage(parseInt(this.dataset.page));
//     });
//     pageButtonsContainer.appendChild(button);
//   }
// }

function generatePageButtons() {
  let pageButtonsContainer = document.getElementById("page-buttons");
  pageButtonsContainer.innerHTML = ""; // Очищаємо контейнер кнопок перед генерацією
  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");
  let totalPages = numPages(); // Отримуємо загальну кількість сторінок
  let maxVisibleButtons = window.innerWidth < 767 ? 5 : 10; // Визначаємо максимальну кількість видимих кнопок в залежності від розміру екрану

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

  generatePageButtons(); // Оновлюємо кнопки сторінки
  renderFilms();
  window.scrollTo(0, 0);
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
  column()
  generatePageButtons(); // Оновлюємо кнопки сторінки
  if (current_page === 1) {
    btn_prev.style.visibility = "hidden";
    btn_next.style.visibility = "visible";
  }

  else if (current_page === numPages()) {
    btn_prev.style.visibility = "visible";
    btn_next.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
    btn_next.style.visibility = "visible";
  }

  // Перевіряємо чи на першій або останній сторінці і приховуємо або показуємо кнопки btn_prev та btn_next відповідно
}

// Викликаємо функцію генерації кнопок сторінки після завантаження сторінки

// test

let db; // Глобальна змінна для доступу до db
let counter = 1; // Лічильник

const backgroundCollection = document.querySelector(".background-collection");

function column() {
  const columns = document.querySelectorAll(".collection__column");
  if (columns.length > 0) {
    columns.forEach((column) => {
      column.addEventListener("mouseenter", function () {
        backgroundCollection.classList.add("active");
      });

      column.addEventListener("mouseleave", function () {
        backgroundCollection.classList.remove("active");
      });
    });
  } else {
    console.error("Елементи з класом .collection__column не знайдено.");
  }
}

// Додаємо прослуховувач подій на зміну розміру вікна
window.addEventListener('resize', function() {
  generatePageButtons(); // Викликаємо функцію генерації кнопок сторінок при кожній зміні розміру вікна
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

  const filmCollection = document.getElementById("filmCollection");

  if (document.title === "Collection") {
    // generatePageButtons();
    window.onload = function () {
      var listing_table = document.getElementById("filmCollection");
      var items = Array.from(listing_table.children);
      // Приховуємо всі елементи, крім перших records_per_page
      for (var i = records_per_page; i < items.length; i++) {
        items[i].style.display = "none";
      }
      // Викликаємо функцію changePage(1) для відображення першої сторінки

      // changePage(1);
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
        document.forms["header__search"]["txt"].value = "";

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
        const collectionBody = document.querySelector(".collection__body");
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

            // Створення посилання "додати фільм"
            const addFilmLink = document.createElement("a");
            addFilmLink.textContent = "Додати фільм";
            addFilmLink.className = "link link-add";
            addFilmLink.href = "add-film.html"; // Замініть це на посилання на вашу сторінку додавання фільму
            addFilmLink.style.display = "flex"; // Щоб посилання відображалося в новому рядку
            addFilmLink.style.textAlign = "center";
            filmCollection.appendChild(addFilmLink);
          } else {
            loadFilmsData(userId)
          }
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

          if (filmsSnapshot.empty) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "swipet-empty";
            emptyMessage.textContent = "Ваша колекція порожня";
            emptyMessage.style.fontSize = "25px";
            emptyMessage.style.width = "100%";
            emptyMessage.style.textAlign = "center";
            // filmCollection.appendChild(emptyMessage);
          }
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
                <td class="d-flex">
                <button class="admin-cabinet__button-edit edit-button link" data-id="${doc.id}" onclick="editFilm('${doc.id}')">Редагувати</button>
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
                <td class="d-flex">
                <button class="admin-cabinet__button-edit edit-button link" data-id="${doc.id}"  onclick="editFilm('${doc.id}')">Редагувати</button>
                <button class="admin-cabinet__button-delete delete-button link" data-id="${doc.id}" onclick="deleteFilm('${doc.id}')">Видалити</button>
                </td>
              `;

              adminTableBody.appendChild(row);
              counter++;
            });
          }
        } catch (error) {
          console.error("Помилка при отриманні фільмів з Firebase:", error);
        }
      }
    });
  }
});

// Функція для редагування фільму

async function editFilm(filmId) {
  let form = document.querySelector(".form");
  form.classList.toggle("block");
  try {
    const filmDoc = await db.collection("films").doc(filmId).get();
    if (!filmDoc.exists) {
      console.error("Фільм не знайдено.");
      return;
    }

    const filmData = filmDoc.data();

    document.getElementById("filmName").value = filmData.title;
    document.getElementById("filmYear").value = filmData.year;
    document.getElementById("filmDescription").value = filmData.description;
    document.getElementById("trailer").value = filmData.youtubeURL;
    document.getElementById("moviePoster").src = filmData.imageURL;

    document
      .getElementById("editFilmForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const editedFilm = {
          title: document.getElementById("filmName").value,
          year: document.getElementById("filmYear").value,
          description: document.getElementById("filmDescription").value,
          youtubeURL: document.getElementById("trailer").value,
          imageURL: filmData.imageURL,
          searchTitle: document.getElementById("filmName").value,
        };

        const file = document.getElementById("imageInput").files[0];

        if (file) {
          const imageUrl = await uploadImage(file);
          editedFilm.imageURL = imageUrl;
        }

        await updateFilm(filmId, editedFilm);

        // Оновлення відповідного рядка у таблиці після успішного оновлення фільму в Firebase
        // Закриття форми після успішного оновлення фільму
        document.getElementById("editFilmForm").style.display = "none";
      });
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
  } catch (error) {
    console.error("Помилка при оновленні фільму в Firebase:", error);
  }
}

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
      displayDeleteSuccesToaster();
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

// test

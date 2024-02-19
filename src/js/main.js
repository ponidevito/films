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

const backgroundCollection = document.querySelector(
  ".background-collection"
);

function column() {
  const columns = document.querySelectorAll(".collection__column");
  if (columns.length > 0) {
      columns.forEach((column) => {
          column.addEventListener('mouseenter', function() {
            backgroundCollection.classList.add("active")
          });

          column.addEventListener('mouseleave', function() {
            backgroundCollection.classList.remove("active")
          });
      });
  } else {
      console.error('Елементи з класом .collection__column не знайдено.');
  }
}

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
            addFilmLink.style.display = "block"; // Щоб посилання відображалося в новому рядку
            addFilmLink.style.textAlign = "center";
            filmCollection.appendChild(addFilmLink);
          } else {
            querySnapshot.forEach((doc) => {
              const filmData = doc.data();
              if (isAdmin || (userId && userId === filmData.authorUid)) {
                // backgroundCollection.style.display = " none";
                collectionBody.style.display = "grid";
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
            column()
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
    displayEditSuccesToaster()
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
      displayDeleteSuccesToaster()
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


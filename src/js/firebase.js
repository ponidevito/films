if (document.title === "Додати фільм") {
  const firebaseConfig = {
    apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
    authDomain: "cinema-collection-ce9ba.firebaseapp.com",
    projectId: "cinema-collection-ce9ba",
    storageBucket: "cinema-collection-ce9ba.appspot.com",
    messagingSenderId: "597377281566",
    appId: "1:597377281566:web:c49563737b63b6c131080f",
  };

  firebase.initializeApp(firebaseConfig);

  // Отримання посилань на елементи форми

  // Ініціалізація firestore, якщо він не був декларований раніше
  const firestore = firebase.firestore();

  const form = document.querySelector(".form");
  const imageInput = document.querySelector("#imageInput");
  const addFilmForm = document.querySelector("#addFilmForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const imageFile = imageInput.files[0];

    uploadImage(imageFile, form);
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

      const userId = localStorage.getItem("userId");
      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");

      const formattedTime = `${hours}.${minutes}`;
      const formattedDate = `${month}/${day}/${year}`;

      const filmTitle = form.querySelector(
        "input[placeholder='* Назва']"
      ).value;

      // Перевірка, чи існує фільм з такою ж назвою, але не належить поточному користувачеві
      const existingFilms = await firestore
        .collection("films")
        .where("title", "==", filmTitle)
        .where("authorUid", "==", userId) // Додайте умову перевірки userId
        .get();

      if (!existingFilms.empty) {
        console.error("Фільм з такою назвою вже існує.");
        displayNameToaster();
        return;
      }

      // Додавання нового фільму
      const docRef = await firestore.collection("films").add({
        title: filmTitle,
        time: formattedTime,
        date: formattedDate,
        year: document.getElementById("filmYear").value,
        description: document.getElementById("filmDescription").value,
        youtubeURL: document.getElementById("trailer").value,
        imageURL: url,
        authorUid: userId,
        searchTitle: filmTitle.toLowerCase(),
      });

      // Оновлення додавання збереження id разом із даними
      await docRef.update({
        id: docRef.id,
      });
      displaySuccesToaster();
      console.log("Документ успішно додано з ID:", docRef.id);
      document.getElementById("filmName").value = "";
      document.getElementById("filmYear").value = "";
      document.getElementById("filmDescription").value = "";
      if (document.getElementById("trailer")) {
        document.getElementById("trailer").value = "";
      }

      if (document.getElementById("moviePoster")) {
        document.getElementById("moviePoster").src = "";
      }
    } catch (error) {
      console.error("Виникла помилка при обробці:", error);
    }
  }
}

if (document.title === "Контакти") {
  const form = document.querySelector(".contacts__form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("textarea").value;

    sendMessage(name, email, message);
  });

  async function sendMessage(name, email, message) {
    try {
      const firestore = firebase.firestore();
      const contactRef = firestore.collection("contacts").doc();

      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");

      const formattedTime = `${hours}.${minutes}`;
      const formattedDate = `${month}/${day}/${year}`;

      await contactRef.set({
        name: name,
        email: email,
        message: message,
        time: formattedTime,
        date: formattedDate,
      });

      console.log("Повідомлення успішно відправлено!");
      displaySuccesMessage();
      form.reset();
    } catch (error) {
      console.error("Виникла помилка при відправці повідомлення:", error);
    }
  }
}

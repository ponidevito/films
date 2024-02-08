

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



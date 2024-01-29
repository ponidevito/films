

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




// test працює добре

function uploadImage(file) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("images/" + file.name);

  imageRef.put(file).then((snapshot) => {
    console.log("Файл успішно завантажено!");

    imageRef.getDownloadURL().then((url) => {
      const userId = localStorage.getItem('userId'); // Отримуємо userId з localStorage
      const currentDate = new Date(); // Отримуємо поточну дату і час
      const hours = currentDate.getHours().toString().padStart(2, '0'); // Години
      const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Хвилини
      const year = currentDate.getFullYear().toString().slice(-2); // Рік в форматі yy
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Місяць
      const day = currentDate.getDate().toString().padStart(2, '0'); // День

      const formattedTime = `${hours}.${minutes}`;
      const formattedDate = `${month}/${day}/${year}`;

      firestore.collection("films").add({
        title: form.querySelector("input[placeholder='Назва']").value,
        time: formattedTime, // Додаємо форматований час
        date: formattedDate,
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






}





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



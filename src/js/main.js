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
                  const filmElement = document.createElement('div');
                  filmElement.className = 'collection__column';
                  filmElement.innerHTML = `
                  <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                  <div class="collection__about">
                  <h2 class="collection__name">${filmData.title}</h2>
                  </div>
                  
                  `;
                  filmCollection.appendChild(filmElement);
              });
          })
          .catch((error) => {
              console.error('Помилка при отриманні фільмів з Firebase:', error);
          });
  }
});

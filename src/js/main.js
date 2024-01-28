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

// document.addEventListener('DOMContentLoaded', function () {
//   if (document.title === "Collection") {
//       const firebaseConfig = {
//           apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
//           authDomain: "cinema-collection-ce9ba.firebaseapp.com",
//           projectId: "cinema-collection-ce9ba",
//           storageBucket: "cinema-collection-ce9ba.appspot.com",
//           messagingSenderId: "597377281566",
//           appId: "1:597377281566:web:c49563737b63b6c131080f"
//       };

//       // Ініціалізація Firebase з конфігураційними даними
//       firebase.initializeApp(firebaseConfig);

//       const db = firebase.firestore();
//       const filmCollection = document.getElementById('filmCollection');

//       // Отримайте дані про фільми з Firebase
//       db.collection('films').get()
//           .then((querySnapshot) => {
//               querySnapshot.forEach((doc) => {
//                   const filmData = doc.data();
//                   // Створіть DOM-елемент для фільму та додайте його до відображення
//                   const filmElement = document.createElement('a');
//                   filmElement.className = 'collection__column';
//                   filmElement.href = `details.html?id=${doc.id}`; // зміни тут
//                   filmElement.innerHTML = `
//                 <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
//                 <div class="collection__about">
//                 <h2 class="collection__name">${filmData.title}</h2>
//                 </a>
                
//                 `;
//                   filmCollection.appendChild(filmElement);
//               });
//           })
//           .catch((error) => {
//               console.error('Помилка при отриманні фільмів з Firebase:', error);
//           });
//   }
// });





// test

// document.addEventListener('DOMContentLoaded', async function () {
//   if (document.title === "Collection") {
//     const firebaseConfig = {
//       apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
//       authDomain: "cinema-collection-ce9ba.firebaseapp.com",
//       projectId: "cinema-collection-ce9ba",
//       storageBucket: "cinema-collection-ce9ba.appspot.com",
//       messagingSenderId: "597377281566",
//       appId: "1:597377281566:web:c49563737b63b6c131080f"
//     };

//     // Ініціалізація Firebase з конфігураційними даними
//     firebase.initializeApp(firebaseConfig);

//     const db = firebase.firestore();
//     const filmCollection = document.getElementById('filmCollection');
//     const userId = localStorage.getItem('userId');

//     // Отримайте дані про фільми з Firebase
//     try {
//       const querySnapshot = await db.collection('films').get();

//       querySnapshot.forEach((doc) => {
//         const filmData = doc.data();
//         // Створіть DOM-елемент для фільму та додайте його до відображення
//         const filmElement = document.createElement('a');
//         filmElement.className = 'collection__column';
//         filmElement.href = `details.html?id=${doc.id}`; // зміни тут
//         filmElement.innerHTML = `
//           <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
//           <div class="collection__about">
//             <h2 class="collection__name">${filmData.title}</h2>
//             <p>Added by: ${filmData.userId}</p>
//           </div>
//         `;
//         filmCollection.appendChild(filmElement);
//       });
//     } catch (error) {
//       console.error('Помилка при отриманні фільмів з Firebase:', error);
//     }
//   }
// });




// document.addEventListener('DOMContentLoaded', async function () {
//   if (document.title === "Collection") {
//     const firebaseConfig = {
//       apiKey: "AIzaSyCL7wAwDtfMIDshLv4_aZLD0QXbC_BEBFo",
//       authDomain: "cinema-collection-ce9ba.firebaseapp.com",
//       projectId: "cinema-collection-ce9ba",
//       storageBucket: "cinema-collection-ce9ba.appspot.com",
//       messagingSenderId: "597377281566",
//       appId: "1:597377281566:web:c49563737b63b6c131080f"
//     };

//     // Ініціалізація Firebase з конфігураційними даними
//     firebase.initializeApp(firebaseConfig);

//     const db = firebase.firestore();
//     const filmCollection = document.getElementById('filmCollection');

//     firebase.auth().onAuthStateChanged(async function (user) {
//       if (user) {
//         const userId = localStorage.getItem('userId');

//         // Отримання дані про фільми з Firebase
//         try {
//           const querySnapshot = await db.collection('films').get();

//           querySnapshot.forEach((doc) => {
//             const filmData = doc.data();
//             console.log('userId from localStorage:', userId);
//             console.log('authorUid from filmData:', filmData.authorUid);
//             // Перевірте, чи користувач є автором фільму
//             if (userId && userId === filmData.authorUid) {
//               // Створіть DOM-елемент для фільму та додайте його до відображення
//               const filmElement = document.createElement('a');
//               filmElement.className = 'collection__column';
//               filmElement.href = `details.html?id=${doc.id}`; // зміни тут
//               filmElement.innerHTML = `
//                 <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
//                 <div class="collection__about">
//                   <h2 class="collection__name">${filmData.title}</h2>
//                   <p>Added by: ${filmData.authorUid}</p>
//                 </div>
//               `;
//               filmCollection.appendChild(filmElement);
//             }
//           });
//         } catch (error) {
//           console.error('Помилка при отриманні фільмів з Firebase:', error);
//         }
//       } else if (!window.location.pathname.includes('index.html')) {
//         console.log('Направляю неавторизованого користувача на index.html');
//         window.location.href = 'index.html';
//       }
//     });
//   }
// });


// test 2 

document.addEventListener('DOMContentLoaded', async function () {
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

    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const isAdmin = await checkIfUserIsAdmin(user);
      
        // Отримання дані про фільми з Firebase
        try {
          const querySnapshot = await db.collection('films').get();
      
          querySnapshot.forEach((doc) => {
            const filmData = doc.data();
            console.log('userId from localStorage:', userId);
            console.log('authorUid from filmData:', filmData.authorUid);
      
            // Перевірте, чи користувач є адміном або автором фільму
            if (isAdmin || (userId && userId === filmData.authorUid)) {
              // Створіть DOM-елемент для фільму та додайте його до відображення
              const filmElement = document.createElement('a');
              filmElement.className = 'collection__column';
              filmElement.href = `details.html?id=${doc.id}`; // зміни тут
              filmElement.innerHTML = `
                <div class="collection__picture"><img class="collection__poster" src="${filmData.imageURL}" alt="Film Poster"></div>
                <div class="collection__about">
                  <h2 class="collection__name">${filmData.title}</h2>
                  <p>Added by: ${filmData.authorUid}</p>
                </div>
              `;
              filmCollection.appendChild(filmElement);
            }
          });
        } catch (error) {
          console.error('Помилка при отриманні фільмів з Firebase:', error);
        }
      }
      
      else if (!window.location.pathname.includes('index.html')) {
        console.log('Направляю неавторизованого користувача на index.html');
        window.location.href = 'index.html';
      }
    });
  }
});














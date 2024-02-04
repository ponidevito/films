function regForm() {
    const firstName = document.getElementsByName("firstName")[0].value;
    const lastName = document.getElementsByName("lastName")[0].value;
    const emailValue = document.getElementsByName("regEmail")[0].value;
    const passwordValue = document.getElementsByName("regPassword")[0].value;

    // Створення нового користувача в Firebase
    firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
        .then((userCredential) => {
            const user = userCredential.user;

            // Зчитування ролі користувача з бази даних або Firestore
            const db = firebase.firestore();
            const userDocRef = db.collection("users").doc(user.uid);

            // Створення документа для нового користувача в Firestore
            userDocRef.set({
                firstName: firstName,
                lastName: lastName,
                email:emailValue,
                role: 'user'
                // Додайте інші поля користувача, які вам потрібні
            }).then(() => {
                // Збереження ролі в localStorage
                localStorage.setItem("userRole", "USER");

                // Збереження інших даних користувача в localStorage
                localStorage.setItem("userId", user.uid);
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("userName", firstName);

                // Додавання/видалення класів або виконання інших дій, пов'язаних з інтерфейсом
                modalLogin.classList.add("hide");
                userEnter.classList.add("hide");
                loginBox.classList.add("show-box");

                console.log("Успішна реєстрація та вхід:", user);
                // Перенаправлення на сторінку collection-films
                // window.location.href = "collection-films.html";
            }).catch((error) => {
                console.error("Помилка при створенні документа користувача:", error);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Помилка реєстрації та входу:", errorCode, errorMessage);
        });
}


  
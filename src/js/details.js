if (document.title === "Інформація про фільм") {
  document.addEventListener("DOMContentLoaded", function () {
    showSpinner();
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = String(urlParams.get("id"));
    const moviePoster = document.getElementById("moviePoster");
    const trailerIframe = document.getElementById("movieTrailer");

    const releaseYearLabel = document.getElementById("releaseYearLabel");
    const releaseYearValue = document.getElementById("releaseYearValue");

    const movieDescrLabel = document.getElementById("movieDescrLabel");
    const movieDescrValue = document.getElementById("movieDescrValue");

    // Отримати інформацію про фільм із Firebase Firestore за допомогою movieId
    const db = firebase.firestore();
    const moviesRef = db.collection("films");

    moviesRef
      .doc(movieId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const movieData = doc.data();
          moviePoster.style.display = "block";
          releaseYearLabel.style.display = "block";
          movieDescrLabel.style.display = "block";
          // Відобразити детальну інформацію про фільм
          moviePoster.src = movieData.imageURL;
          document.getElementById("movieTitle").innerText = movieData.title;

          releaseYearLabel.innerText = "Рік виходу: ";
          releaseYearValue.innerText = movieData.year;

          movieDescrLabel.innerText = "Опис: ";
          movieDescrValue.innerText = movieData.description;
          trailerIframe.src = movieData.youtubeURL;

          // Вставити URL-посилання на відео YouTube
          embed(movieData.youtubeURL);
          hideSpinner();
        } else {
          console.error("No such document!");
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  });
}

// Перевірка автентифікації для захищених сторінок
document.addEventListener("DOMContentLoaded", function () {
  const protectedPages = ["collection-films.html"];

  if (protectedPages.includes(window.location.pathname) && !checkAuth()) {
    console.log(
      "Користувач не увійшов. Перенаправлення на сторінку авторизації."
    );
    window.location.href = "/";
  }
});

function embed(url) {
  var id;
  // Шукати ідентифікатор відео в URL
  if (url.includes("youtube.com")) {
    id = url.split("?v=")[1];
  } else if (url.includes("youtu.be")) {
    id = url.split("/").pop();
  } else {
    console.error("Invalid YouTube URL");
    return;
  }

  // Створити посилання для вбудовування
  var embedlink = "https://www.youtube.com/embed/" + id;

  // Отримати посилання на iframe і встановити новий src
  var iframe = document.getElementById("movieTrailer");
  iframe.src = embedlink;
}

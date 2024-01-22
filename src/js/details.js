

if (document.title === "Інформація про фільм") {
  document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = String(urlParams.get("id"));
    const moviePoster = document.getElementById("moviePoster");
    const trailerIframe = document.getElementById("movieTrailer");

    const releaseYearLabel = document.getElementById("releaseYearLabel");
    const releaseYearValue = document.getElementById("releaseYearValue");

    const movieDescrLabel = document.getElementById("movieDescrLabel");
    const movieDescrValue = document.getElementById("movieDescrValue");

    console.log("movieId:", movieId); // Додайте цей рядок

    // Отримати інформацію про фільм із Firebase Firestore за допомогою movieId
    const db = firebase.firestore();
    const moviesRef = db.collection("films");

    moviesRef
      .doc(movieId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const movieData = doc.data();
          // Відобразити детальну інформацію про фільм
          moviePoster.src = movieData.imageURL;
          document.getElementById("movieTitle").innerText = movieData.title;

          releaseYearLabel.innerText = "Рік виходу: ";
          releaseYearValue.innerText = movieData.year;

          movieDescrLabel.innerText = "Опис: ";
          movieDescrValue.innerText = movieData.description;
          trailerIframe.src = movieData.youtubeURL;

          // Додайте інші поля інформації, які вам потрібні
        } else {
          console.error("No such document!");
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  });
}





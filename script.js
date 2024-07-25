const displayCard = document.getElementById("mainCard");
const time = document.getElementById("footerDate");
const poster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieDetails = document.getElementById("movie-details");
const genreButtons = document.getElementById("genreFilter");
const dateButtons = document.getElementById("dateFilter");
const ratingOne = document.getElementById("ratingBelow6");
const ratingTwo = document.getElementById("ratingAbove6");
const resetButton = document.getElementById("resetBtn");
const topButton = document.getElementById("backToTopBtn");

let currentData = [];
let totalData = [];

// importing the json elements
fetch("reviews.json")
  .then((response) => response.json())
  .then((data) => {
    currentData = data;
    displayData(currentData);

    // Create date buttons after data is loaded
    const releaseDates = getUniqueDates(data);
    createDateButtons(releaseDates);
  })

  .catch((error) => console.error("Error in loading data", error));

function displayData(data) {
  // displaying the data
  const mainCard = displayCard;

  // clearing any existent data;
  mainCard.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("h2");
    title.textContent = item.title;

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.title;

    const reviewComment = document.createElement("p");
    reviewComment.textContent = `Review: ${item.reviewComment}`;

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Year: ${item.releaseDate}`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${item.rating}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${item.genre}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(reviewComment);
    card.appendChild(releaseDate);
    card.appendChild(rating);
    card.appendChild(genre);

    mainCard.appendChild(card);
  });
}

// displaying date on footer
function displayTime() {
  let now = moment().format("MMMM Do YYYY");
  time.innerHTML = now;
}
displayTime();

// displaying movie of the week
const apiKey = "28b99e8";

const movieList = [
  "tt0111161", // IMDB ID for The Shawshank Redemption
  "tt0068646", // IMDB ID The Godfather
  "tt0071562", // IMDB ID The Godfather: Part II
  "tt0468569", // IMDB ID The Dark Knight
  "tt0050083", // IMDB ID 12 Angry Men
  "tt0108052", // IMDB ID Schindler's List
  "tt0167260", // IMDB ID The Lord of the Rings: The Return of the King
];

function currentWeekNumber() {
  const startDate = new Date("2024-01-01");
  const today = new Date();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.ceil(
    ((today - startDate) / oneWeek) % movieList.length
  );
  return weekNumber - 1; // Subtract 1 to get zero-based index
}

async function fetchMovies(movieId) {
  const response = await fetch(
    `http://omdbapi.com/?i=${movieId}&apikey=${apiKey}`
  );
  const data = await response.json();
  return data;
}

async function displayMovie() {
  const weekNumber = currentWeekNumber();
  const movieId = movieList[weekNumber];
  const movieData = await fetchMovies(movieId);

  poster.src = movieData.Poster;
  movieTitle.textContent = movieData.Title;
  movieDetails.textContent = `${movieData.Year} | ${movieData.Genre} | ${movieData.Runtime}`;
}

displayMovie();

// Function to create and display genre radio buttons
function createGenreButtons(genres) {
  genreButtons.innerHTML = ""; // Clear existing content

  genres.forEach((genre) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "genre";
    input.value = genre;

    label.appendChild(input);
    label.appendChild(document.createTextNode(genre));

    genreButtons.appendChild(label);
  });

  // Add event listener to filter data based on selected genre
  genreButtons.addEventListener("change", (event) => {
    const selectedGenre = event.target.value;
    filterDataByGenre(selectedGenre);
  });
}

// Function to extract unique genres from the JSON data
function getUniqueGenres(data) {
  const genres = new Set();

  data.forEach((item) => {
    item.genre.forEach((genre) => genres.add(genre));
  });

  return Array.from(genres);
}

// Function to filter data based on selected genre
function filterDataByGenre(genre) {
  const filteredData = currentData.filter((item) => item.genre.includes(genre));
  displayData(filteredData);
}

// Fetch and process JSON data
fetch("reviews.json")
  .then((response) => response.json())
  .then((data) => {
    currentData = data;
    displayData(currentData);

    // Create genre buttons after data is loaded
    const genres = getUniqueGenres(data);
    createGenreButtons(genres);
  })
  .catch((error) => console.error("Error in loading data", error));

// radio buttons for date

function createDateButtons(dates) {
  dateButtons.innerHTML = "";

  dates.forEach((date) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "releaseDate";
    input.value = date;

    label.appendChild(input);
    label.appendChild(document.createTextNode(date));

    dateButtons.appendChild(label);
  });

  dateButtons.addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    filterDataByDate(selectedDate);
  });
}

function getUniqueDates(data) {
  const dates = new Set();

  data.forEach((item) => {
    dates.add(item.releaseDate);
  });

  return Array.from(dates);
}

function filterDataByDate(date) {
  const filteredData = currentData.filter((item) => item.releaseDate === date);
  displayData(filteredData);
}

// Rating filter buttons
ratingOne.addEventListener("click", () => {
  totalData = currentData.filter((item) => item.rating < 6);
  displayData(totalData);
});

ratingTwo.addEventListener("click", () => {
  totalData = currentData.filter((item) => item.rating > 6);
  displayData(totalData);
});

// reset button

resetButton.addEventListener("click", () => {
  genreButtons
    .querySelectorAll("input[type='radio']")
    .forEach((radio) => (radio.checked = false));

  dateButtons
    .querySelectorAll("input[type='radio']")
    .forEach((radio) => (radio.checked = false));

  totalData = [...currentData];
  displayData(totalData);
});

// back to top button

// Show or hide the "Back to Top" button based on scroll position
window.addEventListener("scroll", () => {
  const backToTopBtn = document.getElementById("backToTop");
  if (window.scrollY > 200) { // Show button after scrolling down 200px
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// Add click event listener to the "Back to Top" button
document.getElementById("backToTopBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

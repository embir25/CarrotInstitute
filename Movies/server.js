

//API URL 
const SEARCH_URL = 'http://www.omdbapi.com/?apiKey=2f48d571';

//ACCESSING DOCUMENT ELEMENT FROM APP.HTML
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const paginationContainer = document.getElementById('pagination-container');
const detailsModal = document.getElementById('details-modal');
const detailsContent = document.getElementById('details-content');
const closeButtons = document.getElementsByClassName('close-button');
const sortTitleButton = document.getElementById('sort-title-button');
const sortRatingButton = document.getElementById('sort-rating-button');
const loadingSpinner = document.getElementById('loading-spinner');


//PAGINATION VARIABLES
let currentPage = 1;
let totalResults = 0;
let currentSort = ''; // Track the current sorting option

let loading = false
const eventEmitterClick = 'click'
const eventEmitterKeyup = 'keyup'

// EVENT LISTENERS 
searchButton.addEventListener(`${eventEmitterClick || eventEmitterKeyup}`, searchMovies);
sortTitleButton.addEventListener('click', sortMoviesByTitle);
sortRatingButton.addEventListener('click', sortMoviesByRating);

//SEACRCH MOVIE FUNCTION

function searchMovies() {
  const inputValue = searchInput.value;


  if (inputValue === '') {
    // Display an error message or handle empty input
    let alertMessage = 'Sorry your search value cannot be empty.'
    detailsContent.innerText = alertMessage;
    detailsModal.append = detailsContent
    detailsModal.style.display = 'block'
    return;
  }
  //PATH URL TO GET MOVIE BY TITLE
  const url = `${SEARCH_URL}&s=${inputValue}&page=${currentPage}`;

  // Show loading spinner
  loadingSpinner.style.display = 'block';
  // Make an API request to fetch movie data
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {

        totalResults = data.totalResults;
        displayResults(data.Search);
        displayPagination();

      }

      else {
        // Display an error message or handle no results found
        alert('Sorry Enter a valid movie title. e.g Lion heart')
      }
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
    })
    .catch(error => {
      // Display an error message or handle API request failure
      detailsContent.innerText = 'Sorry we cannot access the server at the moment.Kindly check if you are connected to the internet and try again.'
      detailsModal.append = detailsContent
      detailsModal.style.display ='block'
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
    });
  searchInput.value = ''
}

//DISPLAY MOVIES 
function displayResults(movies) {
  resultsContainer.innerHTML = '';

  if (movies.length == 0) {
    // Display a message when no movies are found
    resultsContainer.innerHTML = '<p>No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const posterElement = document.createElement('img');
    posterElement.classList.add('movie-poster');
    posterElement.src = movie.Poster;
    movieElement.appendChild(posterElement);

    const titleElement = document.createElement('h3');
    titleElement.classList.add('movie-title');
    titleElement.textContent = movie.Title;
    movieElement.appendChild(titleElement);

    const detailsElement = document.createElement('div');
    detailsElement.classList.add('movie-details');

    const yearElement = document.createElement('span');
    yearElement.textContent = `Year released: ${movie.Year}`;
    detailsElement.appendChild(yearElement);

    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.classList.add('detailBtn')
    viewDetailsButton.textContent = 'View Details';
    viewDetailsButton.addEventListener('click', () => {
      openDetailsModal(movie.imdbID);
    });
    detailsElement.appendChild(viewDetailsButton);

    movieElement.appendChild(detailsElement);

    resultsContainer.appendChild(movieElement);
  });




}

//PAGINATION FUNCTION
function displayPagination() {
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(totalResults / 10);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      searchMovies();
    });
    paginationContainer.appendChild(pageButton);
  }
}

// Modal to display each movie details
function openDetailsModal(movieId) {
  const detailsUrl = `${SEARCH_URL}&i=${movieId}`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      const details = `
        <h2>${data.Title}</h2>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>Cast:</strong> ${data.Actors}</p>
        <p><strong>Rating:</strong> ${data.imdbRating}/10</p>
      `;
      detailsContent.innerHTML = details;
      detailsModal.style.display = 'block';
    })
    .catch(error => {
      // Display an error message or handle API request failure
    });
}

//Sort by movies title
function sortMoviesByTitle() {
  currentSort = 'title';
  const movies = Array.from(resultsContainer.children);
  movies.sort((a, b) => {
    const titleA = a.querySelector('.movie-title').textContent.toLowerCase();
    const titleB = b.querySelector('.movie-title').textContent.toLowerCase();
    return titleA.localeCompare(titleB);
  });
  movies.forEach(movie => resultsContainer.appendChild(movie));
}

//Sort by movies rating
function sortMoviesByRating() {
  currentSort = 'rating';
  const movies = Array.from(resultsContainer.children);
  movies.sort((a, b) => {
    const ratingA = parseFloat(a.querySelector('.movie-rating').textContent);
    const ratingB = parseFloat(b.querySelector('.movie-rating').textContent);
    return ratingB - ratingA;
  });
  movies.forEach(movie => resultsContainer.appendChild(movie));
}

//Modal close function
Array.from(closeButtons).forEach(button => {
  button.addEventListener('click', () => {
    detailsModal.style.display = 'none';
  });
});

window.addEventListener('click', event => {
  if (event.target === detailsModal) {
    detailsModal.style.display = 'none';
  }
});

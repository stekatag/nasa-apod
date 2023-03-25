"use strict";

const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const favoritesBtn = document.querySelector('.favorite');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const API_KEY = "dLWQuyJaWbNBspRgfj789gENOdLeFquhoXXxcSxV";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

let resultsArray = [];
let favorites = {};

const showContent = function (page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Switching between Results and Favorites
  resultsNav.classList.toggle('hidden', page === 'favorites');
  favoritesNav.classList.toggle('hidden', page === 'results');
  // Hide Loader
  loader.classList.add('hidden');
}

const createDOMNodes = function (page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
  console.log('Current Array', page, currentArray);

  let markup = '';
  currentArray.forEach((result) => {
    const favoritesBtnText = page === 'results' ? 'Add to Favorites' : 'Remove Favorite';
    const favoritesBtnOnClick = page === 'results' ? `saveFavorite('${result.url}')` : `removeFavorite('${result.url}')`;

    markup += `
      <div class="card">
        <a href="${result.hdurl}" title="View Full Image" target="_blank">
          <img
            class="card-img-top"
            src="${result.url}"
            alt="NASA Picture of the day"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="clickable favorite" onclick="${favoritesBtnOnClick}">${favoritesBtnText}</p>
          <p class="card-text">${result.explanation}</p>
          <small class="text-muted">
            <strong>${result.date}</strong>
            <span>${result.copyright ?? ""}
            </span>
          </small>
        </div>
      </div>
    `;
  });
  imagesContainer.insertAdjacentHTML('beforeend', markup);
}

const updateDOM = function (page) {
  // Get Favorites from localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  // Reset DOM, Show Loader
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
};


// Get 10 images from NASA API
const getNasaPictures = async function () {
  // Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(API_URL);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
    console.error(error);
  }
}

// Add result to Favorites
const saveFavorite = function (itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

// Remove item from Favorites
const removeFavorite = function (itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set Favorites in localStorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// On Load
getNasaPictures();
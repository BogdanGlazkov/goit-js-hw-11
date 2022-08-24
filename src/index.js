import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-aio';
import templateImages from './templates/photo-card.hbs';
import ImgApiService from './js/api-service';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  input: document.querySelector('.search-form__input'),
  button: document.querySelector('.search-form__btn'),
};

const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.input.addEventListener('input', () => (refs.button.disabled = false));

function onSearch(event) {
  event.preventDefault();
  refs.button.disabled = true;

  imgApiService.searchQuery = event.currentTarget.elements.searchQuery.value;

  imgApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  imgApiService.fetchImages().then(({ data }) => {
    imgApiService.totalPage = Math.ceil(data.total / imgApiService.per_page);
    imgApiService.loadedNow += data.hits.length;

    appendImagesMarkup(data.hits);
    simpleLightbox.refresh();
  });
}

function appendImagesMarkup(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', templateImages(images));
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

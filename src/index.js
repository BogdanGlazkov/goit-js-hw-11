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

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
  scrollZoomFactor: false,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.input.addEventListener('input', () => (refs.button.disabled = false));

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  )
    fetchImages();
});

function onSearch(event) {
  event.preventDefault();
  refs.button.disabled = true;

  imgApiService.searchQuery = event.currentTarget.elements.searchQuery.value;

  if (imgApiService.searchQuery === '') {
    Notify.failure('Enter text');
    return;
  }

  imgApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  imgApiService.fetchImages().then(({ data }) => {
    imgApiService.totalPage = Math.ceil(data.total / imgApiService.per_page);
    imgApiService.loadedNow += data.hits.length;

    if (imgApiService.page === 2 && data.hits.length > 0) {
      Notify.success(`Hooray! We found ${data.total} images.`);
    }

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Loaded ${imgApiService.loadedNow} images.`);
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

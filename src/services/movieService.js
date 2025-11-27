import { api } from './api'

export const movieService = {
  // getMovies: (page = 1) => api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`),
  getMovies: () => api.get(`/movies`),
  getMovieDetail: (slug) => api.get(`/movies/${slug}`),
  
  searchMovies: (query) => api.get(`/movies/search?keyword=${query}`),
  getCategories: () => api.get('/categories'),
  moviesByCategory: (slug, page = 1) => api.get(`/v1/api/the-loai/${slug}?page=${page}`),
  getCountries: () => api.get('/countries'),
  moviesByCountry: (slug, page = 1) => api.get(`/v1/api/quoc-gia/${slug}?page=${page}`),

  manageCategories: () => api.get('/admin/categories'),
  manageMovies: () => api.get('/admin/movies'),
  manageCountries: () => api.get('/admin/countries'),
  manageActors: () => api.get('/admin/actors'),
  manageDirectors: () => api.get('/admin/directors'),
}
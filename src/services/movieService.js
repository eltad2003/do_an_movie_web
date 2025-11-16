import { api } from './api'

export const movieService = {
  getMovies: (page = 1) => api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`),
  getMovieDetail: (slug) => api.get(`/phim/${slug}`),
  searchMovies: (query) => api.get(`/v1/api/tim-kiem?keyword=${query}`),
  getCategories: () => api.get('/the-loai'),
  moviesByCategory: (slug, page = 1) => api.get(`/v1/api/the-loai/${slug}?page=${page}`),
  getCountries: () => api.get('/quoc-gia'),
  moviesByCountry: (slug, page = 1) => api.get(`/v1/api/quoc-gia/${slug}?page=${page}`),

  manageCategories: () => api.get('/admin/categories'),
  manageMovies: () => api.get('/admin/movies'),
  manageCountries: () => api.get('/admin/countries'),
  manageActors: () => api.get('/admin/actors'),
  manageDirectors: () => api.get('/admin/directors'),
}
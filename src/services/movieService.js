import { api } from './api'

export const movieService = {
  getMovies: (page = 1) => api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`),
  getMovieDetail: (slug) => api.get(`/phim/${slug}`),
  searchMovies: (query) => api.get(`/tim-kiem?keyword=${query}`),
  getMoviesByCategory: (category) => api.get(`/the-loai/${category}`)
}
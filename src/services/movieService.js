import { api } from './api'

export const movieService = {
  getMovies: (page = 1) => api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`),
  getMovieDetail: (slug) => api.get(`/phim/${slug}`),
  searchMovies: (query) => api.get(`/v1/api/tim-kiem?keyword=${query}`),
}
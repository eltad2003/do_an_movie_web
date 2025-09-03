export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: '/phim/:slug',
  WATCH_MOVIE: '/xem-phim/:slug',
  SEARCH: '/tim-kiem',
  CATEGORY: '/the-loai/:slug',
  COUNTRY: '/quoc-gia/:slug',
  NOT_FOUND: '/404'
}

export const API_ENDPOINTS = {
  MOVIES: '/danh-sach/phim-moi-cap-nhat',
  MOVIE_DETAIL: '/phim',
  SEARCH: '/tim-kiem',
  CATEGORIES: '/the-loai',
  COUNTRIES: '/quoc-gia'
}


export const MOVIE_TYPES = ['Phim lẻ', 'Phim bộ', 'Hoạt hình', 'TV Show']
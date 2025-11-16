export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: '/phim/:slug',
  WATCH_MOVIE: '/xem-phim/:slug',
  SEARCH: '/tim-kiem',
  CATEGORY: '/the-loai/:slug',
  COUNTRY: '/quoc-gia/:slug',
  NOT_FOUND: '/404',
  PROFILE: '/profile',
  ADMIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  MANAGE_MOVIES: '/admin/quan-ly-phim',
  MANAGE_USERS: '/admin/quan-ly-nguoi-dung',
  MANAGE_CATEGORIES: '/admin/quan-ly-the-loai',
  MANAGE_COUNTRIES: '/admin/quan-ly-quoc-gia',
  MANAGE_ACTORS: '/admin/quan-ly-dien-vien'
}

export const API_ENDPOINTS = {
  MOVIES: '/danh-sach/phim-moi-cap-nhat',
  MOVIE_DETAIL: '/phim',
  SEARCH: '/tim-kiem',
  CATEGORIES: '/the-loai',
  COUNTRIES: '/quoc-gia'
}


export const MOVIE_TYPES = ['Phim lẻ', 'Phim bộ', 'Hoạt hình', 'TV Show']
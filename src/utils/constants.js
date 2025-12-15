export const ROUTES = {
    HOME: '/',
    LOGIN: '/dang-nhap',
    REGISTER: '/dang-ky',

    MOVIE_DETAIL: '/phim/:slug',
    WATCH_MOVIE: '/xem-phim/:slug',
    BY_CATEGORY: '/the-loai/:slugCat',
    BY_COUNTRY: '/quoc-gia/:slugCountry',

    SEARCH: '/tim-kiem',
    NOT_FOUND: '/404',

    PROFILE: '/ho-so',
    HISTORY: '/lich-su',
    FAVORITE: '/yeu-thich',

    ROOMS: '/xem-chung',
    ROOM: '/xem-chung/:id',
    CREAT_ROOM: '/xem-chung/tao-phong/:episodeId',

    ADMIN: '/admin',
    MANAGE_MOVIES: 'quan-ly-phim',
    MANAGE_DETAIL_MOVIE: 'quan-ly-phim/:id',
    MANAGE_USERS: 'quan-ly-nguoi-dung',
    MANAGE_CATEGORIES: 'quan-ly-the-loai',
    MANAGE_COUNTRIES: 'quan-ly-quoc-gia',
    MANAGE_ACTORS: 'quan-ly-dien-vien',
    MANAGE_DIRECTORS: 'quan-ly-dao-dien'
}

export const API_ENDPOINTS = {
    MOVIES: '/danh-sach/phim-moi-cap-nhat',
    MOVIE_DETAIL: '/phim',
    SEARCH: '/tim-kiem',
    CATEGORIES: '/the-loai',
    COUNTRIES: '/quoc-gia'
}



import React, { useState } from 'react'
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Star,
    Calendar,
    Clock,
    Play,
    Image,
    MoreHorizontal,
    Download,
    Upload
} from 'lucide-react'
import AddMovie from './AddMovie'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ManageMovie = () => {
    const [movies, setMovies] = useState([
        {
            id: "15341840eedadf2f5",
            name: "Biệt Đội Siêu Anh Hùng 4: Hồi Kết",
            origin_name: "Avengers: Endgame",
            slug: "biet-doi-sieu-anh-hung-4-hoi-ket",
            type: "Phim bộ",
            description: "Sau những sự kiện tàn khốc trong Infinity War...",
            poster_url: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            thumb_url: "https://image.tmdb.org/t/p/w200/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
            duration: "2 tiếng 36 phút",
            director: ["Anthony Russo", "Joe Russo"],
            actors: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
            country: "Mỹ",
            subtitle: true,
            year: 2019,
            category: [
                { "id": "5e0b6c4b5c3c4a0017b2c123", "name": "Hành Động", "slug": "hanh-dong" },
                { "id": "5e0b6c4b5c3c4a0017b2c124", "name": "Viễn Tưởng", "slug": "vien-tuong" },
                { "id": "5e0b6c4b5c3c4a0017b2c125", "name": "Phiêu Lưu", "slug": "phieu-luu" }
            ],
            rating: 8.4,
            views: 1250000,
            status: "released",
            created_at: "2024-01-15",
            updated_at: "2024-01-20"
        },
        {
            id: "25341840eedadf2f6",
            name: "Spider-Man: No Way Home",
            origin_name: "Spider-Man: No Way Home",
            slug: "spider-man-no-way-home",
            type: "Phim lẻ",
            description: "Peter Parker phải đối mặt với những hậu quả...",
            poster_url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            thumb_url: "https://image.tmdb.org/t/p/w200/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            trailer_url: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
            duration: "2 tiếng 28 phút",
            director: ["Jon Watts"],
            actors: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
            country: "Mỹ",
            subtitle: true,
            year: 2021,
            category: [
                { "id": "5e0b6c4b5c3c4a0017b2c123", "name": "Hành Động", "slug": "hanh-dong" },
                { "id": "5e0b6c4b5c3c4a0017b2c124", "name": "Viễn Tưởng", "slug": "vien-tuong" },
                { "id": "5e0b6c4b5c3c4a0017b2c125", "name": "Phiêu Lưu", "slug": "phieu-luu" },
            ],
            rating: 8.2,
            views: 980000,
            status: "released",
            created_at: "2024-01-10",
            updated_at: "2024-01-15"
        },
        {
            id: "35341840eedadf2f7",
            name: "The Dark Knight",
            origin_name: "The Dark Knight",
            slug: "the-dark-knight",
            type: "Phim lẻ",
            description: "Batman phải đối mặt với Joker...",
            poster_url: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            thumb_url: "https://image.tmdb.org/t/p/w200/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
            duration: "2 tiếng 36 phút",
            director: ["Anthony Russo", "Joe Russo"],
            actors: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
            country: "Mỹ",
            subtitle: true,
            year: 2019,
            category: [
                { "id": "5e0b6c4b5c3c4a0017b2c123", "name": "Hành Động", "slug": "hanh-dong" },
                { "id": "5e0b6c4b5c3c4a0017b2c124", "name": "Viễn Tưởng", "slug": "vien-tuong" },
                { "id": "5e0b6c4b5c3c4a0017b2c125", "name": "Phiêu Lưu", "slug": "phieu-luu" }
            ],
            rating: 8.4,
            views: 1250000,
            status: "released",
            created_at: "2024-01-15",
            updated_at: "2024-01-20"
        },
        {
            id: "45341840eedadf2f8",
            name: "Ghost in the Shell",
            origin_name: "Ghost in the Shell",
            slug: "ghost-in-the-shell",
            type: "Phim lẻ",
            description: "Ghost in the Shell phải đối mặt với những hậu quả...",
            poster_url: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            thumb_url: "https://image.tmdb.org/t/p/w200/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
            duration: "2 tiếng 36 phút",
            director: ["Anthony Russo", "Joe Russo"],
            actors: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
            country: "Mỹ",
            subtitle: true,
            year: 2019,
            category: [
                { "id": "5e0b6c4b5c3c4a0017b2c123", "name": "Hành Động", "slug": "hanh-dong" },
                { "id": "5e0b6c4b5c3c4a0017b2c124", "name": "Viễn Tưởng", "slug": "vien-tuong" },
                { "id": "5e0b6c4b5c3c4a0017b2c125", "name": "Phiêu Lưu", "slug": "phieu-luu" }
            ],
            rating: 8.4,
            views: 1250000,
            status: "released",
            created_at: "2024-01-15",
            updated_at: "2024-01-20"
        }
    ])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [filterYear, setFilterYear] = useState('ALL')
    const [showAddMovie, setShowAddMovie] = useState(false)


    if (showAddMovie) {
        return <AddMovie onBack={() => setShowAddMovie(false)} />
    }

    const filteredMovies = movies.filter(movie => {
        const matchSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.origin_name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = filterStatus === 'ALL' || movie.status === filterStatus
        const matchYear = filterYear === 'ALL' || movie.year.toString() === filterYear

        return matchSearch && matchStatus && matchYear
    })

    const getStatusBadge = (status) => {
        const statusConfig = {
            'released': { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã phát hành' },
            'coming_soon': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sắp chiếu' },
            'updating': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang cập nhật' }
        }

        const config = statusConfig[status] || statusConfig['updating']
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        )
    }

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
        return views.toString()
    }

    const handleDeleteMovie = (movieId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
            toast.success('Xóa phim thành công')
            setMovies(movies.filter(movie => movie.id !== movieId))
        }
    }

    return (
        <div className='bg-white min-h-screen'>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý phim</h1>
                {/* <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <div className="text-2xl font-bold">{movies.length}</div>
                            <div className="text-sm text-purple-100">Tổng số phim</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{movies.filter(m => m.status === 'released').length}</div>
                            <div className="text-sm text-purple-100">Đã phát hành</div>
                        </div>
                    </div> */}
            </div>

            <div className="p-6">
                {/* Search and Filter Bar */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên phim..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters and Actions */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="released">Đã phát hành</option>
                                <option value="coming_soon">Sắp chiếu</option>
                                <option value="updating">Đang cập nhật</option>
                            </select>

                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="ALL">Tất cả năm</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                            </select>



                            <button
                                onClick={() => setShowAddMovie(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                                <Plus size={18} />
                                Thêm phim
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}


                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Phim</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Năm phát hành</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Đánh giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Thể loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Lượt xem</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <img
                                                    src={movie.thumb_url}
                                                    alt={movie.name}
                                                    className="w-16 h-12 rounded object-cover mr-4"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/64x48?text=No+Image'
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{movie.name}</div>
                                                    <div className="text-sm text-gray-500">{movie.origin_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-900">{movie.year}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                {movie.rating}
                                            </div>
                                        </td>
                                        <td>
                                            {movie.category.map(cat => (
                                                <span
                                                    key={cat.id}
                                                    className="inline-block bg-light-100 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-3 text-gray-900">{formatViews(movie.views)}</td>
                                        <td className="px-6 py-3">{getStatusBadge(movie.status)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    className="p-2 cursor-pointer text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                                    to={`/admin/quan-ly-phim/${movie.id}`}>
                                                    <Eye size={16} />
                                                </Link>
                                                <Link className="p-2 cursor-pointer text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    className="p-2 cursor-pointer text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    onClick={() => handleDeleteMovie(movie.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Empty State */}
                {filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <Image size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy phim</h3>
                        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{filteredMovies.length}</span> trên tổng số{' '}
                        <span className="font-medium">{movies.length}</span> phim
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Trước
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">
                            1
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageMovie
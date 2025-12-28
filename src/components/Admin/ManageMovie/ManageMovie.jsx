import React, { useContext, useEffect, useState } from 'react'
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
import { AuthContext } from '../../../context/AuthContext'
import Loading from '../../UI/Loading'
import Pagination from '../../UI/Pagination'

const ManageMovie = () => {
    const { user } = useContext(AuthContext)
    const [movies, setMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [filterYear, setFilterYear] = useState('ALL')
    const [showAddMovie, setShowAddMovie] = useState(false)
    const [pageData, setPageData] = useState([])


    const filteredMovies = movies.filter(movie => {
        const matchSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.originName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = filterStatus === 'ALL' || movie.status === filterStatus
        const matchYear = filterYear === 'ALL' || movie.year.toString() === filterYear

        return matchSearch && matchStatus && matchYear
    })

    const handlePageChange = (currentData) => {
        setPageData(currentData)
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'RELEASED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã phát hành' },
            'COMING_SOON': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sắp chiếu' },
            'UPDATING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang cập nhật' }
        }

        const config = statusConfig[status] || statusConfig['UPDATING']
        return (
            <span className={`inline-block  px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        )
    }

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}T`
        if (views >= 1000) return `${(views / 1000).toFixed(2)}N`
        return views.toString()
    }

    const handleDeleteMovie = async (movieId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/movies/${movieId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete movie')
                }
                toast.success('Xóa phim thành công')
                setMovies(movies.filter(movie => movie.id !== movieId))
            } catch (error) {
                console.error('Error deleting movie:', error)
                toast.error('Xóa phim thất bại')
            }
        }
    }



    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/movies`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                });
                const data = await res.json();
                setMovies(data);
                console.log(data);

            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        fetchMovies();
    }, []);

    if (showAddMovie) {
        return <AddMovie onBack={() => setShowAddMovie(false)} />
    }
    if (!movies) {
        return <Loading />
    }
    return (
        <div className='bg-white min-h-screen'>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý phim</h1>
            </div>

            <div className="p-6">
                {/* Search and Filter Bar */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên phim..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Filters and Actions */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-6 py-2 border border-gray-300 rounded-lg "
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="RELEASED">Đã phát hành</option>
                                <option value="COMING_SOON">Sắp chiếu</option>
                                <option value="UPDATING">Đang cập nhật</option>
                            </select>

                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="px-6 py-2 border border-gray-300 rounded-lg "
                            >
                                <option value="ALL">Tất cả năm</option>
                                {Array.from({ length: 16 }, (_, i) => {
                                    const year = new Date().getFullYear() - i
                                    return <option key={year} value={year} >{year}</option>
                                })}

                            </select>
                            <button
                                onClick={() => setShowAddMovie(true)}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                                <Plus size={18} />
                                Thêm phim
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}


                <div className="bg-white rounded-xl shadow-sm border border-gray-400 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-400">
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
                            <tbody className="divide-y divide-gray-300">
                                {(filteredMovies.length <= 10 ? filteredMovies : pageData).map((movie) => (
                                    <tr key={movie.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={movie.thumbUrl}
                                                    alt={movie.name}
                                                    className="w-21 h-15 rounded object-cover"

                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{movie.name}</div>
                                                    <div className="text-sm text-gray-500">{movie.originName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-900">{movie.year}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                {movie.rating?.toFixed(1) || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {movie.categories.length > 0 ? movie.categories.map(cat => (
                                                <span
                                                    key={cat.id}
                                                    className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                                >
                                                    {cat.name}
                                                </span>

                                            )) : (
                                                <span className="text-gray-400 text-sm">Chưa có</span>
                                            )}
                                            {/* {movie.categories.length > 3 && (
                                                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">+{movie.categories.length - 2}</span>
                                            )} */}
                                        </td>
                                        <td className="px-6 py-3 text-gray-900" title={`${movie.views} lượt xem`}>{formatViews(movie?.views || 0)}</td>
                                        <td>{getStatusBadge(movie.status)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    className="p-2 cursor-pointer text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-full transition-colors"
                                                    to={`/admin/quan-ly-phim/${movie.id}`}>
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    className="p-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                                                    onClick={() => handleDeleteMovie(movie.id)}
                                                >
                                                    <Trash2 size={18} />
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
                {filteredMovies.length > 9 && (

                    <Pagination data={filteredMovies} onPageChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default ManageMovie
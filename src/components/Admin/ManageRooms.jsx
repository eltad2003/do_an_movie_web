import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Eye, Trash2, Lock, Globe, Users, Clock, Search } from 'lucide-react'
import { useWatchRoom } from '../../hooks/useWatchRoom'
import { formatDate } from '../../utils/helpers'
import { Link } from 'react-router-dom'

const ManageRooms = () => {
    const { user } = useContext(AuthContext)
    const { rooms, loading } = useWatchRoom()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all')
    const handleDeleteRoom = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/api/watch-rooms/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete room')
                }
                toast.success('Xóa phòng thành công')
                // Reload page hoặc refetch data
                window.location.reload()
            } catch (error) {
                console.error('Error deleting room:', error)
                toast.error('Xóa phòng thất bại')
            }
        }
    }

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.movieName.toLowerCase().includes(searchQuery.toLowerCase()) || room.id.toString().includes(searchQuery)

        const matchesFilter = filterType === 'all' ||
            (filterType === 'public' && !room.hasPassword) ||
            (filterType === 'private' && room.hasPassword) ||
            (filterType === 'actived' && room.active === true) ||
            (filterType === 'ended' && !room.active)

        return matchesSearch && matchesFilter
    })

    if (loading) {
        return (
            <div className='min-h-dvh flex items-center justify-center'>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-dvh'>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Phòng Xem Chung</h1>
            </div>

            <div className='p-6'>
                {/* Filter */}
                <div className="flex gap-3 flex-1 mb-5">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã phòng hoặc phim..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full  pl-10 pr-4 py-2 rounded-lg border border-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className=" px-4 py-2 rounded-lg border border-gray-400 focus:outline-none"
                    >
                        <option value="all">Tất cả phòng</option>
                        <option value="public">Phòng công khai</option>
                        <option value="private">Phòng riêng tư</option>
                        <option value="actived">Đang chiếu</option>
                        <option value="ended">Đã kết thúc</option>
                    </select>
                </div>

                {/* Table */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden'>
                    <div className="overflow-x-auto">
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-300'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-left text-gray-700'>Phòng</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-left text-gray-700'>Phim</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-left text-gray-700'>Chủ phòng</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-center text-gray-700'>Trạng thái</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-center text-gray-700'>Người xem</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-left text-gray-700'>Tạo lúc</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase text-center text-gray-700'>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {filteredRooms.length > 0 ? filteredRooms.map((room) => (
                                    <tr key={room.id} className='hover:bg-gray-50s'>
                                        {/* Room Info */}
                                        <td className='px-4 py-4'>
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={room.posterUrl}
                                                    alt={room.title}
                                                    className="w-16 h-20 object-cover rounded border"
                                                    onError={(e) => {
                                                        e.target.src = '/watch-party.webp'
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800 line-clamp-1">
                                                        {room.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        ID: {room.id.substring(0, 8)}...
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {room.hasPassword ? (
                                                            <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded" title={room.password}>
                                                                <Lock className="w-3 h-3" />
                                                                Riêng tư
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                                <Globe className="w-3 h-3" />
                                                                Công khai
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Movie Info */}
                                        <td className='px-4 py-4'>
                                            <p className=" text-gray-800 font-semibold line-clamp-1">
                                                {room.movieName}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {room.episodeName}
                                            </p>
                                        </td>

                                        {/* Host */}
                                        <td className='px-4 py-4'>
                                            <p className="text-sm text-gray-800 font-semibold line-clamp-1">
                                                {room.hostName}
                                            </p>

                                        </td>

                                        {/* Status */}
                                        <td className='px-4 py-4 text-center'>
                                            {room.active ? (
                                                <span className="inline-block px-3 py-1 bg-green-600 text-green-100 text-xs font-semibold rounded-full">
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-red-700 text-red-100 text-xs font-semibold rounded-full">
                                                    Đã kết thúc
                                                </span>
                                            )}
                                        </td>

                                        {/* Viewers */}
                                        <td className='px-4 py-4 text-center'>
                                            <div className="inline-flex items-center gap-1 text-gray-700">
                                                <Users className="w-4 h-4" />
                                                <span className="font-semibold">{room.currentViewers}</span>
                                            </div>
                                        </td>

                                        {/* Created At */}
                                        <td className='px-4 py-4'>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(room.createdAt)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className='px-4 py-4'>
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/xem-chung/${room.id}`}
                                                    target="_blank"
                                                    className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700s inline-flex items-center gap-1 text-sm'
                                                >
                                                    <Eye size={16} />
                                                    Xem
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteRoom(room.id)}
                                                    className='p-2 bg-red-600 text-white rounded-lg hover:bg-red-700s inline-flex items-center gap-1 text-sm'
                                                >
                                                    <Trash2 size={16} />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className='px-6 py-8 text-center'>
                                            <div className="text-gray-400">
                                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p className="font-medium">Không có phòng nào</p>
                                                <p className="text-sm mt-1">Không tìm thấy phòng nào phù hợp với tiêu chí của bạn.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ManageRooms
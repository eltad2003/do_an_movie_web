import React, { useContext } from 'react'
import { Clock, Play, Trash2, Film } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import Loading from '../UI/Loading'
import { useHistory } from '../../hooks/useHistory'
import { formatDate } from '../../utils/helpers'

const History = () => {
    const { user } = useContext(AuthContext)
    const { watchHistory, setWatchHistory, loading } = useHistory()

    const handleDeleteHistory = async (historyId) => {
        if (!window.confirm('Bạn có chắc muốn xóa lịch sử này?')) return

        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/history/${historyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })

            if (res.ok) {
                toast.success('Đã xóa lịch sử')
                setWatchHistory(prev => prev.filter(item => item.historyId !== historyId))
            } else {
                const errorText = await res.text()
                console.error('Delete error:', errorText)
                toast.error('Xóa lịch sử thất bại')
            }
        } catch (error) {
            console.error('Error deleting history:', error)
            toast.error('Có lỗi xảy ra')
        }
    }



    if (loading) {
        return <Loading />
    }

    if (watchHistory.length === 0) {
        return (
            <main >
                <div className='container mx-auto p-5 max-w-3xl text-center py-20'>
                    <Film size={64} className='mx-auto text-gray-500 mb-4' />
                    <h3 className='text-2xl text-white font-semibold mb-2'>
                        Chưa có lịch sử xem phim
                    </h3>
                    <p className='text-gray-400 mb-6'>
                        Bắt đầu xem phim để lưu lại lịch sử của bạn
                    </p>
                    <Link
                        to='/'
                        className='btn font-bold'
                    >
                        Khám phá phim
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main >
            <div className='pattern' />
            <div className='wrapper '>
                <div className='bg-dark-100 mt-10 rounded-lg p-5 '>
                    {/* Header */}
                    <div className='mb-5'>
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <Clock size={28} />
                            Lịch sử xem phim
                        </h2>
                    </div>

                    {/* History List */}
                    <div className='space-y-4'>
                        {watchHistory.map((history) => (
                            <div
                                key={history.historyId}
                                className='flex flex-col sm:flex-row gap-4 p-4 bg-dark-100 border border-gray-700 rounded-lg'
                            >
                                {/* Thumbnail */}
                                <Link
                                    to={`/xem-phim/${history.movie.slug}?ep=${history.episodeSlug}`}
                                    className='flex-shrink-0 relative'
                                >
                                    <img
                                        src={history.movie.thumbUrl || 'https://via.placeholder.com/200x120?text=No+Image'}
                                        alt={history.movie.name}
                                        className='w-full sm:w-52 h-32 object-cover rounded-lg hover:opacity-80 transition-opacity'
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 ">
                                        <div className="bg-white/50 rounded-full p-3 backdrop-blur-sm">
                                            <Play className="w-8 h-8 cursor-pointer text-gray-500" />
                                        </div>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className='flex-1 min-w-0 '>
                                    <Link
                                        to={`/xem-phim/${history.movie.slug}?ep=${history.episodeSlug}`}
                                        className='text-lg font-semibold text-white hover:text-light-100 transition line-clamp-2'
                                    >
                                        {history.movie.name}
                                    </Link>
                                    <p className=' text-light-100 mt-1 flex items-center gap-2'>
                                        {history.movie.originName}
                                    </p>

                                    <div className='mt-3 text-sm text-white/50'>
                                        <span className='flex items-center gap-1'>
                                            <Clock size={14} />
                                            {formatDate(history.watchedAt)} • {history.episodeName}
                                        </span>
                                        <span>

                                        </span>

                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='flex sm:flex-col gap-3'>
                                    <Link
                                        to={`/xem-phim/${history.movie.slug}?ep=${history.episodeSlug}`}
                                        className='btn inline-flex items-center gap-1'
                                    >
                                        <Play size={16} />
                                        Xem tiếp
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteHistory(history.historyId)}
                                        className='flex-1 sm:flex-none px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-1 text-sm'
                                    >
                                        <Trash2 size={16} />
                                        Xóa
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default History
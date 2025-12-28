import { Heart, Play, Star, Tv, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import Modal from 'react-modal'
import { useSaveHistory } from '../../hooks/useHistory'
import { useFavorite } from '../../hooks/useFavorite'
import { toast } from 'react-toastify'
import { increaseViewCount } from '../../hooks/useIncreView'

const Header = ({ detailMovie, episodes, movieId }) => {
    const { user } = useContext(AuthContext)
    const [modalIsOpen, setIsOpen] = useState(false);
    const { saveHistory } = useSaveHistory()
    const { isFavorite, addFavorite, deleteFavorite } = useFavorite(movieId)
    const getStatusBadge = (status) => {
        const statusConfig = {
            'RELEASED': { bg: 'bg-green-900', text: 'text-green-100', label: 'Đã phát hành' },
            'COMING_SOON': { bg: 'bg-red-900', text: 'text-red-100', label: 'Sắp chiếu' },
            'UPDATING': { bg: 'bg-yellow-900', text: 'text-yellow-100', label: 'Đang cập nhật' }
        }

        const config = statusConfig[status] || statusConfig['UPDATING']
        return (
            <span className={`inline-block  px-3 py-1 rounded-lg text-sm font-semibold ${config.bg} ${config.text} `}>
                {config.label}
            </span>
        )
    }

    return (
        <div
            className={`relative h-[100dvh] sm:h-[80dvh] lg:h-[50dvh] xl:h-[90dvh] bg-cover bg-center w-full mb-5 xl:mb-20`}
            style={{
                backgroundImage: `url(${detailMovie.thumbUrl})`,
                objectFit: 'cover',
                backgroundPosition: 'center center',
            }}
        >
            {/* overlay bottom and left */}
            <div className='overlay-gradient' />
            <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/0 to-transparent'></div>
            <div className='absolute md:hidden inset-0 bg-gradient-to-l from-primary via-primary/0 to-transparent'></div>

            {/* Content */}
            <div className="absolute bottom-5 left-0 right-0 p-6">
                <div className="flex flex-col items-center md:flex-row md:items-end gap-6">
                    {/* poster */}
                    <div className="relative">
                        <img
                            src={detailMovie.posterUrl}
                            alt="poster"
                            className="w-54 h-full rounded-lg object-cover border-2 border-white shadow-xl"
                        />
                    </div>

                    {/* movie info */}
                    <div className="space-y-5 mb-0 md:mb-8">
                        <div className=''>
                            <h1 className='md:text-start text-shadow-lg/70'>{detailMovie.name}</h1>
                            <h2 className='text-yellow-400 text-center md:text-start line-clamp-1 text-shadow-lg/50'>{detailMovie.originName}</h2>
                        </div>

                        {/* Rating & Info badges */}
                        <div className="hidden md:flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-yellow-900/80 text-yellow-100 inline-flex items-center gap-1 text-sm font-semibold">
                                <Star className="w-4 h-4 fill-current" />
                                {detailMovie.rating ? (
                                    <>
                                        <b>{detailMovie.rating?.toFixed(1)}/10</b>
                                    </>
                                ) : 'N/A'}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-blue-900/80 text-blue-100 text-sm font-semibold">
                                {detailMovie.year}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-blue-900/80 text-green-100 text-sm font-semibold">
                                {detailMovie.type === 'single' ? 'Phim lẻ' : 'Phim bộ'}
                            </span>

                            {detailMovie.episodes.length > 0 && (
                                <span className="px-3 py-1 rounded-lg bg-blue-900/80 text-purple-100 text-sm font-semibold">
                                    {detailMovie.episodes.length} tập
                                </span>
                            )}

                            {getStatusBadge(detailMovie.status)}

                        </div>

                        {/* Action buttons */}
                        <div className="action-button">
                            <Link
                                to={`/xem-phim/${detailMovie.slug}?ep=${episodes[0]?.slug}`}
                                onClick={() => user ? saveHistory(episodes[0]?.id) && increaseViewCount(detailMovie.id) : increaseViewCount(detailMovie.id)}
                            >
                                <button className="bg-red-700 text-white font-bold disabled:opacity-50" disabled={episodes.length === 0}>
                                    <Play className="w-5 h-5 fill-current" />Xem ngay
                                </button>
                            </Link>

                            <button onClick={() => setIsOpen(true)} className='bg-yellow-700 text-white'>
                                <Play className="w-5 h-5" /> Xem Trailer
                            </button>

                            <button
                                onClick={() => {
                                    isFavorite ? deleteFavorite() : addFavorite()
                                }}
                                className=" bg-pink-700 text-white">
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} />Yêu thích
                            </button>

                            {user ? (
                                <Link to={`/xem-chung/tao-phong/${episodes[0].id}`}>
                                    <button className="bg-blue-700 text-white disabled:opacity-50">
                                        <Tv className="w-5 h-5 fill-blue-700" />Xem chung
                                    </button>
                                </Link>
                            ) : (
                                <button className="bg-blue-700 text-white disabled:opacity-50" onClick={() => toast.error('Bạn cần đăng nhập để sử dụng tính năng này')}>
                                    <Tv className="w-5 h-5 fill-blue-700" />Xem chung
                                </button>
                            )}

                        </div>
                    </div>
                </div>

            </div>


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    overlay: {
                        position: "fixed",
                        zIndex: 9999,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "800px",
                        width: "90%",
                    },
                }}
                contentLabel="Example Modal"
            >
                {detailMovie.trailerUrl && (
                    <div className='w-full aspect-video'>
                        <iframe
                            src={detailMovie.trailerUrl.replace('watch?v=', 'embed/')}
                            className='w-full h-full rounded-lg'
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            title="Movie Trailer"
                        />
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Header

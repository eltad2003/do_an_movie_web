import { Heart, Play, Star, Tv, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import Modal from 'react-modal'

const Header = ({ detailMovie, episodes, movieId }) => {
    const { user } = useContext(AuthContext)
    const [isFavorite, setIsFavorite] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);

    const addFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/${movieId}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                toast.success('Đã thêm phim vào mục yêu thích!')
                setIsFavorite(true)
            } else if (res.status === 400) {
                toast.error('Phim đã có trong mục yêu thích!')
            } else if (res.status === 401) {
                toast.error('Vui lòng đăng nhập để thêm vào mục yêu thích!')
            }
            else {
                toast.error('Thêm phim vào mục yêu thích thất bại!')
            }
        } catch (error) {
            console.error('Error adding favorite:', error)
            toast.error('Đã có lỗi xảy ra!')
        }
    }

    const deleteFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                toast.success('Đã xóa phim khỏi mục yêu thích!')
                setIsFavorite(false)
            }
            else {
                toast.error('Xóa phim khỏi mục yêu thích thất bại!')
            }
        } catch (error) {
            console.error('Error deleting favorite:', error)
            toast.error('Đã có lỗi xảy ra!')
        }
    }

    const checkFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/check/${movieId}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setIsFavorite(data.isFavorite)
            } else {
                setIsFavorite(false)
            }
        } catch (error) {
            console.error('Error checking favorite:', error)
            setIsFavorite(false)
        }
    }



    useEffect(() => {
        checkFavorite()
    }, [movieId, user])

    return (
        <div
            className={`relative h-[80dvh] bg-cover bg-center w-full mb-5 lg:mb-10  `}
            style={{
                backgroundImage: `url(${detailMovie.thumbUrl})`,
                objectFit: 'cover',
            }}
        >
            {/* overlay bottom and left */}
            <div className='overlay-gradient' />
            <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/0 to-transparent'></div>
            {/* <div className='absolute inset-0 bg-gradient-to-l from-primary via-primary/0 to-transparent'></div> */}



            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-10 ">
                <div className="flex items-end gap-6">
                    {/* poster */}
                    <div className="relative flex-shrink-0 hidden lg:block">
                        <img
                            src={detailMovie.posterUrl}
                            alt="poster"
                            className="w-54 h-full rounded-lg object-cover "
                        />
                        {/* play trailer */}
                        <div className='absolute z-50 inset-0 flex items-center justify-center group' title='Xem trailer'>
                            <button
                                onClick={() => setIsOpen(true)}
                                className=' rounded-full bg-white/30  text-white backdrop-blur-sm p-5 opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer'>
                                <Play size={40} />
                            </button>
                        </div>
                    </div>

                    {/* movie info */}
                    <div className="space-y-4 ">
                        <div >
                            <h1 className='text-start'>{detailMovie.name}</h1>
                            <h2 className='font-semibold text-yellow-400'>{detailMovie.originName}</h2>
                        </div>

                        {/* Rating & Info badges */}
                        <div className="flex flex-wrap items-center gap-3 ">
                            <span className="px-3 py-1 rounded-lg bg-yellow-900/80 text-yellow-100 inline-flex items-center gap-1 text-sm font-semibold">
                                <Star className="w-4 h-4 fill-current" />
                                {detailMovie.rating ? (
                                    <>
                                        <b>{detailMovie.rating.toFixed(1)}/10</b>
                                    </>
                                ) : 'N/A'}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-blue-900/80 text-blue-100 text-sm font-semibold">
                                {detailMovie.year}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-green-900/80 text-green-100 text-sm font-semibold">
                                {detailMovie.type === 'single' ? 'Phim lẻ' : 'Phim bộ'}
                            </span>

                            {detailMovie.episodes.length > 0 && (
                                <span className="px-3 py-1 rounded-lg bg-purple-900/80 text-purple-100 text-sm font-semibold">
                                    {detailMovie.episodes.length} tập
                                </span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="action-button">
                            <Link to={`/xem-phim/${detailMovie.slug}?ep=${episodes[0]?.slug}`}>
                                <button className="bg-red-700 text-white  disabled:opacity-50" disabled={episodes.length === 0}>
                                    <Play className="w-5 h-5 fill-white" />Xem ngay
                                </button>
                            </Link>

                            <button
                                onClick={() => {
                                    isFavorite ? deleteFavorite() : addFavorite()
                                }}
                                className=" bg-pink-700   text-white">
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />Yêu thích
                            </button>
                            <Link to={`/xem-chung/tao-phong/${detailMovie.slug}`}>
                                <button className="bg-blue-700   text-white">
                                    <Tv className="w-5 h-5" />Xem chung
                                </button>
                            </Link>

                        </div>
                    </div>

                    {/* title in mobile*/}
                    {/* <div className=" lg:hidden space-y-3 w-full flex flex-col items-center justify-center">
                        <div className='flex flex-col items-center justify-center'>
                            <h1 className=''>{detailMovie.name}</h1>
                            <p className="font-semibold text-white/80">{detailMovie.originName}</p>
                        </div>
                        <div className="action-button">
                            <Link to={`/xem-phim/${detailMovie.slug}?ep=${episodes[0]?.slug}`}>
                                <button className="bg-white/30 rounded-full p-3 backdrop-blur-xs">
                                    <Play className="w-10 h-10 text-white" />
                                </button>
                            </Link>
                            <Link>
                                <button className=" bg-pink-700 text-white">
                                    <Heart className="w-5 h-5 " />Yêu thích
                                </button></Link>
                            <Link to={`/xem-chung/tao-phong/${detailMovie.slug}`}>
                                <button className=" bg-blue-700 text-white">
                                    <Tv className="w-5 h-5" />
                                    Xem chung
                                </button>
                            </Link>
                        </div>
                    </div> */}

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
                    <div className='w-full aspect-video relative'>
                        <iframe
                            src={detailMovie.trailerUrl.replace('watch?v=', 'embed/')}
                            className='w-full h-full rounded-lg'
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            title="Movie Trailer"
                        />

                        <button onClick={() => setIsOpen(false)}><X /></button>

                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Header

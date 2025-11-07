import { Heart, Play, Star, Tv } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ detailMovie, episodes }) => {
    const type = {
        single: 'Phim lẻ',
        hoathinh: 'Hoạt hình',
        series: 'Phim bộ',

    }
    return (
        <section
            className={`relative h-[70vh] bg-cover bg-center w-full mb-5 lg:mb-10 `}
            style={{
                backgroundImage: `url(${detailMovie.thumb_url})`,
            }}
        >
            {/* overlay gradient */}
            <div className="overlay-gradient" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-10 ">
                <div className="flex items-end gap-6">
                    {/* poster */}
                    <div className="flex-shrink-0 hidden lg:block">
                        <img
                            src={detailMovie.poster_url}
                            alt="poster"
                            className="w-56 h-full rounded-lg object-cover shadow-primary "
                        />
                    </div>

                    {/* movie info */}
                    <div className="space-y-4 hidden lg:block">
                        <div >
                            <h1 className='text-start'>{detailMovie.name}</h1>
                            <h2 className='font-semibold text-gray-400'>{detailMovie.origin_name}</h2>
                        </div>

                        {/* Rating & Info badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-yellow-900/80 text-yellow-100 inline-flex items-center gap-1 text-sm font-semibold">
                                <Star className="w-4 h-4 fill-current" />
                                {detailMovie.tmdb.vote_average ? (
                                    <>
                                        <b>{detailMovie.tmdb.vote_average.toFixed(1)}/10</b>
                                        <span className="text-white/50">({detailMovie.tmdb.vote_count})</span>
                                    </>
                                ) : 'N/A'}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-blue-900/80 text-blue-100 text-sm font-semibold">
                                {detailMovie.year}
                            </span>

                            <span className="px-3 py-1 rounded-lg bg-green-900/80 text-green-100 text-sm font-semibold">
                                {type[detailMovie.type]}
                            </span>

                            {detailMovie.episode_total > 0 && (
                                <span className="px-3 py-1 rounded-lg bg-purple-900/80 text-purple-100 text-sm font-semibold">
                                    {detailMovie.episode_total} tập
                                </span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="action-button">
                            <Link to={`/xem-phim/${detailMovie.slug}?ver=0&ep=${episodes[0]?.server_data[0]?.slug}`}>
                                <button className="bg-light-100 shadow-light-100/50 shadow-2xl">
                                    <Play className="w-5 h-5 animate-pulse" />Xem ngay
                                </button>
                            </Link>

                            <button className=" bg-pink-700 shadow-pink-700/50 shadow-2xl text-white">
                                <Heart className="w-5 h-5 " />Yêu thích
                            </button>
                            <Link to={`/xem-chung/tao-phong/${detailMovie.slug}`}>
                                <button className="bg-blue-700 shadow-blue-700/50 shadow-2xl text-white">
                                    <Tv className="w-5 h-5" />Xem chung
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* title in mobile*/}
                    <div className="block lg:hidden space-y-3 p-1">
                        <h1 className='text-start'>{detailMovie.name}</h1>
                        <p className="font-semibold text-white/80">{detailMovie.origin_name}</p>
                        <div className="action-button">
                            <Link to={`/xem-phim/${detailMovie.slug}?ver=0&ep=${episodes[0]?.server_data[0]?.slug}`}>
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
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Header

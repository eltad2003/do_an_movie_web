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
            className="relative h-[70vh] bg-cover bg-center w-full mb-10 hidden md:block"
            style={{
                backgroundImage: `url(${detailMovie.thumb_url})`,
            }}
        >
            {/* Overlay gradient */}
            <div className="overlay-gradient" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">

                    <div className="flex-shrink-0">
                        <img
                            src={detailMovie.poster_url}
                            alt="poster"
                            className="w-48 lg:w-56 h-auto rounded-lg shadow-2xl object-cover"
                        />
                    </div>

                    {/* Movie Info */}
                    <div className="space-y-4">
                        <div>
                            <h1 className='text-start mb-3 text-6xl font-bold'>{detailMovie.name}</h1>
                            <p className="text-2xl font-semibold text-white/80 mb-4">{detailMovie.origin_name}</p>
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
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link to={`/xem-phim/${detailMovie.slug}?ver=0&ep=${episodes[0]?.server_data[0]?.slug}`}>
                                <button className="btn h-full transform hover:scale-105">
                                    <Play className="w-5 h-5" />
                                    Xem ngay
                                </button>
                            </Link>

                            <button className="inline-flex gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg">
                                <Heart className="w-5 h-5 f" />Yêu thích
                            </button>
                            <Link to={`/xem-chung/tao-phong/${detailMovie.slug}`}>
                                <button className="inline-flex gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg">
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

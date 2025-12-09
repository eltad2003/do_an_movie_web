import React from 'react'
import { useMovies } from '../../hooks/useMovies'

import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import { Play, Info, Star, Clock, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom';
import InfoGenres from '../DetailMovie/Info/InfoGenres';
const MovieTrending = () => {
    const { listMovies } = useMovies()
    const trendingMovies = listMovies.sort((a, b) => b.views - a.views).slice(0, 3)
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,

        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    }

    return (
        <Carousel responsive={responsive}  >
            {trendingMovies.map((detailMovie) => (
                <div className='relative w-full h-[90dvh] mb-20 overflow-hidden group' key={detailMovie.id}>

                    <div className='absolute inset-0 aspect-auto'>
                        <img
                            src={detailMovie.thumbUrl}
                            alt={detailMovie.name}
                            className='w-full h-full  object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        {/* overlay left and bottom */}
                        <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/80 md:via-primary/50 lg:via-primary/0 to-transparent' />
                        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent' />
                    </div>

                    {/* Content */}
                    <div className='absolute bottom-0 md:bottom-10 left-0 flex items-center md:ml-3'>
                        <div className='container mx-auto px-5'>
                            <div className='max-w-2xl space-y-2 md:space-y-6'>
                                <h1 className='text-start md:text-3xl lg:text-4xl'>
                                    {detailMovie.name}
                                </h1>
                                <p className='text-sm md:text-xl text-yellow-400'>
                                    {detailMovie.originName}
                                </p>
                                <div className='flex flex-wrap items-center gap-4 text-gray-300'>
                                    {detailMovie.rating && (
                                        <div className='flex items-center gap-1.5 text-xs md:text-base bg-yellow-500/20 px-3 py-1.5 rounded-lg'>
                                            <Star size={16} className='fill-yellow-500 text-yellow-500' />
                                            <span className='font-semibold text-yellow-500'>{detailMovie.rating}</span>
                                        </div>
                                    )}
                                    {detailMovie.duration && (
                                        <div className='flex items-center gap-1.5 text-xs md:text-base'>
                                            <Clock size={16} />
                                            <span>{detailMovie.duration}</span>
                                        </div>
                                    )}
                                    {detailMovie.categories && detailMovie.categories.length > 0 && (
                                        <InfoGenres detailMovie={detailMovie} />
                                    )}
                                    {detailMovie.year && (
                                        <span className='px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1'>
                                            <Calendar size={14} />
                                            {detailMovie.year}
                                        </span>
                                    )}
                                </div>

                                <p
                                    className='text-white text-xs md:text-base leading-relaxed line-clamp-3 max-w-3xl'
                                    dangerouslySetInnerHTML={{
                                        __html: detailMovie.description?.replace(/<[^>]*>/g, '') || 'Chưa có mô tả'
                                    }}
                                />

                                {/* Action Buttons */}
                                <div className='flex flex-wrap gap-3 mt-3'>
                                    <Link
                                        to={`/xem-phim/${detailMovie.slug}?ep=${detailMovie.episodes[0]?.slug}`}
                                        className='group/btn flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105'
                                    >
                                        <Play size={20} className='fill-white ' />
                                        Xem ngay
                                    </Link>
                                    <Link
                                        to={`/phim/${detailMovie.slug}`}
                                        className='flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm hover:text-purple-400 text-white font-semibold rounded-lg border-2 border-white/30 transition-colors'
                                    >
                                        <Info size={20} />
                                        Chi tiết
                                    </Link>
                                </div>


                            </div>
                        </div>
                    </div>


                </div>
            ))}
        </Carousel>

    )
}

export default MovieTrending
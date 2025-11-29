import React from 'react'
import { useMovies } from '../../hooks/useMovies'
// import { responsive } from '../../utils/carousel'
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import { Play, Info, Star, Clock, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom';
const MovieTrending = () => {
    const { listMovies } = useMovies()
    const trendingMovies = listMovies.sort((a, b) => b.views - a.views).slice(0, 5)
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
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
        <section className='mb-5'>
            <Carousel responsive={responsive}  >
                {trendingMovies.map((detailMovie) => (
                    <div className='relative w-full h-[80dvh] mb-5 overflow-hidden group' key={detailMovie.id}>

                        <div className='absolute inset-0'>
                            <img
                                src={detailMovie.thumbUrl}
                                alt={detailMovie.name}
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/0 to-transparent' />
                        </div>

                        {/* Content */}
                        <div className='absolute bottom-27 left-5 flex items-center'>
                            <div className='container mx-auto px-5'>
                                <div className='max-w-2xl space-y-6'>
                                    {/* Title */}
                                    <h1 className='text-start text-4xl'>
                                        {detailMovie.name}
                                    </h1>
                                    <p className='text-xl text-yellow-400'>
                                        {detailMovie.originName}
                                    </p>

                                    {/* Meta Info */}
                                    <div className='flex flex-wrap items-center gap-4 text-gray-300'>
                                        {detailMovie.rating && (
                                            <div className='flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-lg'>
                                                <Star size={16} className='fill-yellow-500 text-yellow-500' />
                                                <span className='font-semibold text-yellow-500'>{detailMovie.rating}</span>
                                            </div>
                                        )}
                                        {detailMovie.duration && (
                                            <div className='flex items-center gap-1.5'>
                                                <Clock size={16} />
                                                <span>{detailMovie.duration}</span>
                                            </div>
                                        )}
                                        {detailMovie.categories && detailMovie.categories.length > 0 && (
                                            <div className='flex items-center gap-2'>
                                                {detailMovie.categories.slice(0, 3).map((cat, idx) => (
                                                    <span key={idx} className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-light-100'>
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {detailMovie.year && (
                                            <span className='px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1'>
                                                <Calendar size={14} />
                                                {detailMovie.year}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p
                                        className='text-white text-base leading-relaxed line-clamp-3 max-w-3xl'
                                        dangerouslySetInnerHTML={{
                                            __html: detailMovie.description?.replace(/<[^>]*>/g, '') || 'Chưa có mô tả'
                                        }}
                                    />

                                    {/* Action Buttons */}
                                    <div className='flex flex-wrap gap-4 pt-4'>
                                        <Link
                                            to={`/xem-phim/${detailMovie.slug}?ep=${detailMovie.episodes[0]?.slug}`}
                                            className='group/btn flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105'
                                        >
                                            <Play size={20} className='fill-white group-hover/btn:translate-x-1 transition-transform' />
                                            Xem ngay
                                        </Link>
                                        <Link
                                            to={`/phim/${detailMovie.slug}`}
                                            className='flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 transition-all duration-300 hover:scale-105'
                                        >
                                            <Info size={20} />
                                            Chi tiết
                                        </Link>
                                    </div>

                                    {/* Additional Info */}
                                    {detailMovie.actors && detailMovie.actors.length > 0 && (
                                        <div className='pt-4 border-t border-white/10'>
                                            <p className='text-sm text-gray-400'>
                                                <span className='font-semibold text-white'>Diễn viên: </span>
                                                {detailMovie.actors.slice(0, 3).map(actor => actor.name).join(', ')}
                                                {detailMovie.actors.length > 3 && '...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent' />
                    </div>
                ))}
            </Carousel>
        </section>
    )
}

export default MovieTrending
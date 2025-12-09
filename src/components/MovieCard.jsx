import { Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavorite } from '../hooks/useFavorite'


const MovieCard = ({ movie: { id, name, posterUrl, originName, year, slug, rating, duration } }) => {
    const { isFavorite, addFavorite, deleteFavorite } = useFavorite(id)

    return (
        <div className='relative rounded-xl bg-dark-100 group transition-all duration-300 cursor-pointer group'>
            <Link to={`/phim/${slug}`} className='aspect-[2/3] block overflow-hidden '>
                <img
                    src={posterUrl} alt="poster"
                    className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-300'
                    loading='lazy'
                />

                {year && (
                    <div className='absolute top-2 left-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-1 rounded'>
                        {year}
                    </div>
                )}
                {duration && (
                    <div className='absolute top-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-1 rounded'>
                        {duration}
                    </div>
                )}
            </Link>
            <div className='p-4'>
                <div>
                    <Link to={`/phim/${slug}`}>
                        <h3 className='text-white font-bold line-clamp-1 group-hover:text-purple-400 transition-colors' title={name}>
                            {name}
                        </h3>
                    </Link>
                    <p className='text-gray-400 text-sm line-clamp-1' title={originName}>{originName}</p>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center gap-1 ">
                        <Star className='h-4 w-4 fill-current text-yellow-400' />
                        <p className='text-white font-semibold text-sm'>{rating ? rating.toFixed(1) : 'N/A'}</p>

                    </div>

                    <button
                        className='text-white cursor-pointer hover:text-pink-500'
                        onClick={() => {
                            isFavorite ? deleteFavorite() : addFavorite()
                        }}
                    >
                        <Heart className={`${isFavorite ? 'fill-current' : 'fill-none'}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieCard

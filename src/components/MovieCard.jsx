import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPosterUrl } from '../utils/helpers'

const MovieCard = ({ movie: { tmdb, name, poster_url, origin_name, year, slug } }) => {


    return (
        <div className='bg-dark-100 p-5 rounded-2xl  hover:shadow-2xl trasition-all duration-300 cursor-pointer'>
            <Link to={`/phim/${slug}`}>
                <img src={formatPosterUrl(poster_url)} alt="poster" className='h-auto w-full rounded-lg' loading='lazy' />
            </Link>
            <div className='mt-3'>
                <p className='text-white font-bold line-clamp-1' title={name}>{name}</p>
                <p className='text-white/50 line-clamp-1' title={origin_name}>{origin_name}</p>

                <div className="mt-2 flex items-center flex-wrap gap-2 text-white">
                    <div className="flex items-center gap-1">
                        <Star className='h-4 w-4 text-yellow-400' />
                        <p className='font-bold'>{tmdb.vote_average ? tmdb.vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className="text-white/50">{year}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard

import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'


const MovieCard = ({ movie: { name, posterUrl, originName, year, slug, rating } }) => {


    return (
        <div className='bg-dark-100 p-5 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer'>
            <Link to={`/phim/${slug}`}>
                <img src={posterUrl} alt="poster" className='rounded-lg h-auto lg:h-76 w-full' loading='lazy' />
            </Link>
            <div className='mt-3'>
                <div>
                    <p className='text-white font-bold line-clamp-1' title={name}>{name}</p>
                    <p className='text-white/50 line-clamp-1' title={originName}>{originName}</p>
                </div>

                <div className="mt-2 flex items-center flex-wrap gap-2 text-white">
                    <div className="flex items-center gap-1 ">
                        <Star className='h-4 w-4 fill-current text-yellow-400' />
                        <p className='font-bold'>{rating ? rating.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className="text-white/50">{year}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard

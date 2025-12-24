import { useParams, useSearchParams } from 'react-router-dom';
import Loading from '../UI/Loading';

import Pagination from '../UI/Pagination';
import MovieCard from '../MovieCard';
import Skeleton from '../UI/Skeleton';
import { useMovies } from '../../hooks/useMovies';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import More from '../UI/More';
import FilterMovie from '../UI/FilterMovie';

const ByCountry = () => {
    const { slugCountry } = useParams();
    const [searchParams] = useSearchParams()
    const filter = {
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        year: searchParams.get('year') || '',
        type: searchParams.get('type') || '',
    }
    const { listMovies, isLoading, errorMessage } = useMovies()
    const [moviePerPage, setMoviePerPage] = useState(10)

    const moviesCountry = listMovies.filter(movie => movie.countries.map(country => country.slug).includes(slugCountry));//phim theo quoc gia

    const filterdMovie = searchParams ? moviesCountry.filter(movie => {
        const matchCategory = movie.categories.some(cate => cate.slug === filter.category) || filter.category === '';
        const matchYear = movie.year.toString() === filter.year || filter.year === '';
        const matchType = movie.type === filter.type || filter.type === '';
        return matchCategory && matchYear && matchType;
    }) : moviesCountry;

    if (isLoading) return <Skeleton />

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper mb-20'>
                <h2 className='mt-5 mb-5'>Phim {slugCountry}</h2>
                <FilterMovie />
                <ul>
                    {filterdMovie.length > 0 ? filterdMovie.slice(0, moviePerPage).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    )) :
                        <p className='text-gray-500'>Không tìm thấy phim nào từ quốc gia này.</p>
                    }
                </ul>
                {filterdMovie.length > moviePerPage && (
                    <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                )}
            </div>
        </main>
    )
}

export default ByCountry

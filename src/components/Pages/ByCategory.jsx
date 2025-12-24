import { useParams, useSearchParams } from 'react-router-dom';
import MovieCard from '../MovieCard';
import Loading from '../UI/Loading';
import Pagination from '../UI/Pagination';

import Filter from '../UI/FilterMovie';
import Skeleton from '../UI/Skeleton';
import { useMovies } from '../../hooks/useMovies';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import More from '../UI/More';
import FilterMovie from '../UI/FilterMovie';


const ByCategory = () => {
    const { slugCat } = useParams();
    const [searchParams] = useSearchParams()
    const filter = {
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        year: searchParams.get('year') || '',
        type: searchParams.get('type') || '',

    }
    const { listMovies, isLoading, errorMessage } = useMovies()
    const [moviePerPage, setMoviePerPage] = useState(10)

    const moviesCategory = listMovies.filter(movie => movie.categories.map(cat => cat.slug).includes(slugCat));

    const filterdMovie = searchParams ? moviesCategory.filter(movie => {
        const matchCountry = movie.countries.some(country => country.slug === filter.country) || filter.country === '';
        const matchYear = movie.year.toString() === filter.year || filter.year === '';
        const matchType = movie.type === filter.type || filter.type === '';

        return matchCountry && matchYear && matchType;
    }) : moviesCategory;

    if (isLoading) return <Skeleton />

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper mb-20'>
                <h2 className='mt-5 mb-5'>Phim {slugCat}</h2>
                {/* <Filter /> */}
                <FilterMovie />
                <ul>
                    {filterdMovie.length > 0 ? filterdMovie.slice(0, moviePerPage).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    )) :
                        <p className='text-gray-500'>Không tìm thấy phim nào trong thể loại này.</p>
                    }
                </ul>
                {filterdMovie.length > moviePerPage && (
                    <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                )}
            </div>
        </main>
    )
}

export default ByCategory

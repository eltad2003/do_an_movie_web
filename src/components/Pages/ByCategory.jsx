import { useParams } from 'react-router-dom';
import MovieCard from '../MovieCard';
import Loading from '../UI/Loading';
import Pagination from '../UI/Pagination';

import Filter from '../Filter/Filter';
import Skeleton from '../UI/Skeleton';
import { useMovies } from '../../hooks/useMovies';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import More from '../UI/More';

const ByCategory = () => {
    const { slugCat } = useParams();
    const { listMovies, isLoading, errorMessage } = useMovies()
    const [moviePerPage, setMoviePerPage] = useState(10)
    const filteredMovies = listMovies.filter(movie => movie.categories.map(cat => cat.slug).includes(slugCat));

    if (isLoading) return <Skeleton />

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper mb-20'>
                <h2 className='mt-5 mb-5'>Phim {slugCat}</h2>
                {/* <Filter /> */}
                <ul>
                    {filteredMovies.length > 0 ? filteredMovies.slice(0, moviePerPage).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    )) :
                        <p className='text-gray-500'>Không tìm thấy phim nào trong thể loại này.</p>
                    }
                </ul>
                {filteredMovies.length > moviePerPage && (
                    <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                )}
            </div>
        </main>
    )
}

export default ByCategory

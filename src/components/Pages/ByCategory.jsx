import { useParams } from 'react-router-dom';
import MovieCard from '../MovieCard';
import Loading from '../UI/Loading';
import Pagination from '../UI/Pagination';

import Filter from '../Filter/Filter';
import Skeleton from '../UI/Skeleton';
import { useMovies } from '../../hooks/useMovies';

const ByCategory = () => {
    const { slugCat } = useParams();
    const { listMovies, isLoading, errorMessage } = useMovies()
    if (isLoading) return <Skeleton />
    const filteredMovies = listMovies.filter(movie => movie.categories.map(cat => cat.slug).includes(slugCat));

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper mb-20'>
                <h2 className='mt-5 mb-5'>Phim {slugCat}</h2>
                {/* <Filter /> */}
                <ul>
                    {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    )) :
                        <p className='text-gray-500'>Không tìm thấy phim nào trong thể loại này.</p>
                    }
                </ul>
                {/* <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} /> */}
            </div>
        </main>
    )
}

export default ByCategory

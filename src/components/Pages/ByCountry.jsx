import { useParams } from 'react-router-dom';
import Loading from '../UI/Loading';

import Pagination from '../UI/Pagination';
import MovieCard from '../MovieCard';
import Skeleton from '../UI/Skeleton';
import { useMovies } from '../../hooks/useMovies';

const ByCountry = () => {
    const { slugCountry } = useParams();
    const { listMovies, isLoading, errorMessage } = useMovies()
    if (isLoading) return <Skeleton />
    const filteredMovies = listMovies.filter(movie => movie.countries.map(country => country.slug).includes(slugCountry));
    console.log(filteredMovies);

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper'>
                <h2 className='mt-5 mb-5'>Phim {slugCountry}</h2>
                <ul>
                    {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    )) :
                        <p className='text-gray-500'>Không tìm thấy phim nào từ quốc gia này.</p>
                    }
                </ul>
                {/* <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} /> */}
            </div>
        </main>
    )
}

export default ByCountry

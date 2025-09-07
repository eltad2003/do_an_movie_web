import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../UI/Loading';
import { useMovieByCountry } from '../../hooks/useMovies';
import Pagination from '../UI/Pagination';
import MovieCard from '../MovieCard';
import Skeleton from '../UI/Skeleton';

const ByCountry = () => {
    const { slugCountry } = useParams();
    const [currentPage, setCurrentPage] = useState(1)
    const { listMovies, data, totalPages, isLoading, errorMessage } = useMovieByCountry(slugCountry, currentPage)
    if (isLoading) return <Skeleton />
    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper'>
                <h1 className='mb-10'>Phim {data?.titlePage}</h1>
                <ul>
                    {listMovies.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </ul>
                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </main>
    )
}

export default ByCountry

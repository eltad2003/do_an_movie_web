import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import MovieCard from '../MovieCard';
import Loading from '../UI/Loading';
import Pagination from '../UI/Pagination';
import { useMovieByCategory } from '../../hooks/useMovies';
import Filter from '../Filter/Filter';

const ByCategory = () => {
    const { slugCat } = useParams();
    const [currentPage, setCurrentPage] = useState(1)
    const { listMovies, data, totalPages, isLoading, errorMessage } = useMovieByCategory(slugCat, currentPage)
    if (isLoading) return <Loading />

    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            <div className='wrapper'>
                <h1 className='mb-10'>Phim {data?.titlePage}</h1>
                <Filter />
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

export default ByCategory

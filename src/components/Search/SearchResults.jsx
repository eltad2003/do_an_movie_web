import React from 'react'
import { useSearch } from '../../hooks/useSearch'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../MovieCard'
import Loading from '../UI/Loading'
import Filter from '../Filter/Filter'

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const { searchResults, isLoading, errorMessage } = useSearch(query)


    if (isLoading) {
        return <Loading text="Đang tìm kiếm..." />
    }

    return (
        <main>
            {errorMessage && <p className='text-red-500 text-center p-5'>{errorMessage}</p>}
            <div className='container p-5 mx-auto '>
                <h2 className='text-white text-2xl font-bold mb-5'>Kết quả tìm kiếm cho "{query}" ({searchResults.length})</h2>
                <Filter />
                <ul>
                    {!searchResults || searchResults.length === 0 ? (
                        <p className='text-gray-400 italic'>Không tìm thấy kết quả nào</p>
                    ) : (
                        searchResults.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                    )}
                </ul>
            </div>
        </main>
    )
}

export default SearchResults

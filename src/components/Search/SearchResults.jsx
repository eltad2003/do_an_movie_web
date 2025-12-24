import React, { useState } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../MovieCard'
import Loading from '../UI/Loading'
import FilterMovie from '../UI/FilterMovie'
import More from '../UI/More'


const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const filter = {
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        year: searchParams.get('year') || '',
        type: searchParams.get('type') || '',
        query: searchParams.get('q') || ''
    }
    const [moviePerPage, setMoviePerPage] = useState(10)
    const { searchResults, isLoading, errorMessage } = useSearch(filter.query)
    console.log(searchResults);

    const filterdMovie = searchParams ? searchResults.filter(movie => {
        const matchCategory = movie.categories.some(cate => cate.slug === filter.category) || filter.category === '';
        const matchCountry = movie.countries.some(country => country.slug === filter.country) || filter.country === '';
        const matchYear = movie.year.toString() === filter.year || filter.year === '';
        const matchType = movie.type === filter.type || filter.type === '';
        return matchCategory && matchCountry && matchYear && matchType;
    }) : searchResults;

    if (isLoading) {
        return <Loading text="Đang tìm kiếm..." />
    }

    return (
        <main>
            {errorMessage && <p className='text-red-500 text-center p-5'>{errorMessage}</p>}
            <div className='container p-5 mx-auto mb-20'>
                <h2 className='text-white text-2xl font-bold mb-5'>Kết quả tìm kiếm cho "{filter.query}" ({filterdMovie.length})</h2>
                <FilterMovie />
                <ul>
                    {!filterdMovie || filterdMovie.length === 0 ? (
                        <p className='text-gray-400 italic'>Không tìm thấy kết quả nào</p>
                    ) : (
                        filterdMovie.slice(0, moviePerPage).map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    )}
                </ul>
                {filterdMovie.length > moviePerPage && (
                    <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                )}
            </div>
        </main>
    )
}

export default SearchResults

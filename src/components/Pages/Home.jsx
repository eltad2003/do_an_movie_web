
import Loading from '../UI/Loading'
import MovieCard from '../MovieCard'
import Search from '../Search/Search'
import { useMovies } from '../../hooks/useMovies'
import { useState } from 'react'
import Pagination from '../UI/Pagination'
import SearchTrending from '../Trending/SearchTrending'
import Skeleton from '../UI/Skeleton'
import MovieTrending from '../Trending/MovieTrending'




const Home = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { listMovies, totalPages, isLoading, errorMessage } = useMovies(currentPage)

    return (
        <main>
            {/* <div className='pattern' /> */}

            <div >
                <MovieTrending />
                <Search />
                <SearchTrending />
                {/* all movie */}
                <section className='mb-10 p-6'>
                    <h2 >Danh sách phim mới</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {listMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </section>

            </div>
        </main>
    )
}

export default Home

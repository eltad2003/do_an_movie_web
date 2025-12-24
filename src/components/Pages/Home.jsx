
import Loading from '../UI/Loading'
import MovieCard from '../MovieCard'
import Search from '../Search/Search'
import { useMovies } from '../../hooks/useMovies'
import { useState } from 'react'
import Pagination from '../UI/Pagination'
import SearchTrending from '../Trending/SearchTrending'
import Skeleton from '../UI/Skeleton'
import MovieTrending from '../Trending/MovieTrending'
import { ChevronDown } from 'lucide-react'
import More from '../UI/More'




const Home = () => {
    const { listMovies, isLoading, errorMessage } = useMovies()
    const [moviePerPage, setMoviePerPage] = useState(10)
    return (

        <main >
            <div >
                <MovieTrending />
                <Search />
                <SearchTrending />

                <section className='p-6 mb-20'>
                    <h2 >Danh sách phim mới</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {listMovies.slice(0, moviePerPage).map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />

                            ))}
                        </ul>
                    )}
                    {listMovies.length > moviePerPage && (
                        <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                    )}
                </section>

            </div>
        </main>

    )
}

export default Home

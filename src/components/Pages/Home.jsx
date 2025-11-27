
import Loading from '../UI/Loading'
import MovieCard from '../MovieCard'
import Search from '../Search/Search'
import { useMovies } from '../../hooks/useMovies'
import { useState } from 'react'
import Pagination from '../UI/Pagination'
import SearchTrending from '../Trending/SearchTrending'
import Skeleton from '../UI/Skeleton'



const Home = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { listMovies, totalPages, isLoading, errorMessage } = useMovies(currentPage)

    return (
        <main>
            <div className='pattern' />
            <div className='wrapper'>
                {/* section search */}
                <header className='space-y-9 mb-10'>

                    {/* <h1>Tìm và thưởng thức những bộ phim hay nhất.</h1>
                    <p className='text-white/70 text-center mx-auto'>
                        Khám phá hàng ngàn bộ phim chất lượng cao với phụ đề tiếng Việt
                    </p> */}
                    <img src="./hero-img.png" alt="banner" />
                    <Search />
                </header>

                {/*section search trending */}
                <SearchTrending />

                {/* section all movie */}
                <section className='space-y-9 mb-10'>
                    <h2 className='text-light-100'>Danh sách phim mới</h2>
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

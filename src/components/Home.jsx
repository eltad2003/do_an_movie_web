
import Loading from './UI/Loading'
import MovieCard from './MovieCard'
import Search from './Search'
import { Link } from 'react-router-dom'
import { useMovies } from '../hooks/useMovies'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'


const Home = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { listMovies, isLoading, errorMessage } = useMovies(currentPage)


  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  return (
    <main>
      <div></div>
      <div className='container mx-auto flex flex-col p-5'>
        <header className='space-y-9 mb-20'>
          <nav className='flex justify-between items-center'>
            <p className='text-white text-2xl font-bold cursor-pointer'>CHILLFLIX</p>
            <Link to="/login" className='btn'>Đăng nhập</Link>
          </nav>
          <h1>Tìm và thưởng thức những bộ phim hay nhất.</h1>
          <Search />
        </header>

        <section className='space-y-9'>
          <h2 className='text-light-100'>Danh sách phim mới</h2>
          {isLoading ? (
            <Loading />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {listMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
          <span className='text-light-100'>{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      </div>
    </main>
  )
}

export default Home

import React, { useEffect, useState } from 'react'
import Loading from './Button/Loading'
import MovieCard from './MovieCard'
import Search from './Search'
import { Link } from 'react-router-dom'


const Home = () => {
  const [listMovies, setListMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const fetchMovies = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/danh-sach/phim-moi-cap-nhat-v2?page=1`)
      if (!res.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await res.json()
      setListMovies(data.items)
      console.log(data.items);

    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <main>
      <div></div>
      <div className='container mx-auto flex flex-col p-5'>

        <header className='space-y-9 mb-20'>
          <div className='flex justify-between items-center'>
            <p className='text-white text-2xl font-bold cursor-pointer'>CHILLFLIX</p>
            <Link to="/login" className='btn'>Đăng nhập</Link>
          </div>
          <h1>Tìm và thưởng thức những bộ phim hay nhất.</h1>
          <Search />
        </header>

        <section className='space-y-9'>
          <h2 className='text-light-100'>Danh sách phim</h2>
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

      </div>
    </main>
  )
}

export default Home

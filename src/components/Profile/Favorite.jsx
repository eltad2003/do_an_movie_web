import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Film, X } from 'lucide-react'
import MovieCard from '../MovieCard'
import { Link } from 'react-router-dom'
import More from '../UI/More'

const Favorite = () => {
    const { user } = useContext(AuthContext)
    const [favorites, setFavorites] = useState([])
    const [moviePerPage, setMoviePerPage] = useState(10)

    const fetchFavoriteMovie = async () => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setFavorites(data || [])
                console.log(data);

            } else {
                const errorText = await res.text()
                console.error('Error fetching favorites:', errorText)
                if (res.status === 401) {
                    toast.error('Vui lòng đăng nhập để xem phim yêu thích!')
                }
            }
        } catch (error) {
            console.error('Error fetching favorites:', error)
            toast.error('An error occurred while fetching favorite movies.')
        }
    }

    const deleteFavorite = async (movieId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này khỏi mục yêu thích?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/${movieId}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (res.ok) {
                    toast.success('Đã xóa phim khỏi mục yêu thích!')
                    fetchFavoriteMovie()
                }
                else {
                    toast.error('Xóa phim khỏi mục yêu thích thất bại!')
                }
            } catch (error) {
                console.error('Error deleting favorite:', error)
                toast.error('Đã có lỗi xảy ra!')
            }
        }
    }

    useEffect(() => {
        fetchFavoriteMovie()
    }, [])


    if (favorites.length === 0) {
        return (
            <main >
                <div className='pattern' />
                <div className='wrapper container flex flex-col items-center justify-center min-h-[50vh] text-center'>
                    <Film size={64} className='mx-auto text-gray-500 mb-4' />
                    <h3 className='text-2xl text-white font-semibold mb-2'>
                        Chưa có phim yêu thích
                    </h3>
                    <p className='text-gray-400 mb-6'>
                        Bắt đầu thêm phim yêu thích để lưu lại danh sách của bạn
                    </p>
                    <Link
                        to='/'
                        className='btn font-bold'
                    >
                        Khám phá phim
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen'>
            <div className='pattern' />
            <div className='wrapper'>
                <section className='space-y-9 mb-30'>
                    <h2 className='text-3xl font-bold text-white mb-5'>Yêu thích</h2>
                    <ul>
                        {favorites.map((favorite) => (
                            <div className='relative' key={favorite.id}>
                                <MovieCard movie={favorite.movie} />
                                <button
                                    onClick={() => deleteFavorite(favorite.movie.id)}
                                    className='text-white absolute top-1 right-1 hover:bg-red-600 bg-black/80 rounded cursor-pointer'>
                                    <X size={25} />
                                </button>
                            </div>
                        ))}
                    </ul>
                    {favorites.length > moviePerPage && (
                        <More moviePerPage={moviePerPage} setMoviePerPage={setMoviePerPage} />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Favorite
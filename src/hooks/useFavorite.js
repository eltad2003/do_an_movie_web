import { useContext, useEffect, useState } from "react"

import { toast } from "react-toastify"
import { AuthContext } from "../context/AuthContext"

export const useFavorite = (movieId) => {
    const { user } = useContext(AuthContext)
    const [isFavorite, setIsFavorite] = useState(false)

    const addFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/${movieId}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                toast.success('Đã thêm phim vào mục yêu thích!')
                setIsFavorite(true)
            } else if (res.status === 400) {
                toast.error('Phim đã có trong mục yêu thích!')
            } else if (res.status === 401) {
                toast.error('Vui lòng đăng nhập để thêm vào mục yêu thích!')
            }
            else {
                toast.error('Thêm phim vào mục yêu thích thất bại!')
            }
        } catch (error) {
            console.error('Error adding favorite:', error)
            toast.error('Đã có lỗi xảy ra!')
        }
    }

    const deleteFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                toast.success('Đã xóa phim khỏi mục yêu thích!')
                setIsFavorite(false)
            }
            else {
                toast.error('Xóa phim khỏi mục yêu thích thất bại!')
            }
        } catch (error) {
            console.error('Error deleting favorite:', error)
            toast.error('Đã có lỗi xảy ra!')
        }
    }

    const checkFavorite = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/favorites/check/${movieId}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${user.accessToken}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setIsFavorite(data.isFavorite)
            } else {
                setIsFavorite(false)
            }
        } catch (error) {
            console.error('Error checking favorite:', error)
            setIsFavorite(false)
        }
    }



    useEffect(() => {
        checkFavorite()
    }, [movieId, user])

    return { isFavorite, addFavorite, deleteFavorite }
}
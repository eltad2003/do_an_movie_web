import { Star, StarIcon, Trash2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../context/AuthContext'

const ManageReview = ({ movieId }) => {
    const [reviews, setReviews] = useState([])
    const { user } = useContext(AuthContext)

    const fetchComments = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/public/comments/movie/${movieId}`)
            if (!res.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await res.json()
            setReviews(data)
            console.log(data);

        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    const handleDeleteComment = async (reviewId) => {
        // DELETE :admin/comments/:id
        if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá của người dùng này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/comments/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`,
                    },
                })
                if (!res.ok) {
                    throw new Error('Failed to delete comment')
                }
                toast.success('Xóa đánh giá thành công');
                setReviews(reviews.filter(review => review.id !== reviewId))
            } catch (error) {
                console.error('Error deleting comment:', error)
                toast.error('Xóa đánh giá thất bại');
            }
        }
    }

    useEffect(() => {
        fetchComments()
    }, [movieId])

    return (
        <div>
            <div className='overflow-auto rounded-lg shadow-sm border border-gray-200'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Người dùng</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Bình luận</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Thời gian</th>
                            <th className='p-4 text-left text-xs font-semibold uppercase'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviews.map((review, index) => (
                            <tr key={index} className='hover:bg-gray-50'>
                                <td className="px-6 py-4">
                                    <div className='flex flex-col'>
                                        <p>{review.user.name}</p>
                                        <p className='text-sm text-gray-400'> {review.user.email}</p>
                                    </div>
                                </td>

                                <td className="px-6 py-4">{review.content}</td>
                                <td className="px-6 py-4">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        className="p-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => handleDeleteComment(review.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageReview
import { MessageSquareOff, SendHorizontal } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'

const Comment = ({ movieId }) => {
    const { user } = useContext(AuthContext)
    const [comments, setComments] = useState([])
    const [addComment, setAddComment] = useState({
        movieId: movieId,
        content: ''
    })

    const fetchComments = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/public/comments/movie/${movieId}`)
            if (!res.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await res.json()
            setComments(data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    const handleInputChange = (e) => {
        setAddComment({ ...addComment, content: e.target.value })
    }

    const handleAddComment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(addComment)
            })
            if (!res.ok) {
                throw new Error('Failed to add comment')
            }
            fetchComments()
            setAddComment({ ...addComment, content: '' })
        } catch (error) {
            console.error('Error adding comment:', error)
            toast.error('Không thể thêm bình luận')
        }
    }


    useEffect(() => {
        fetchComments()
    }, [movieId])

    return (
        <section className='section'>
            <h2 >Bình luận</h2>

            {/* comment form */}
            <div className='mb-20 space-y-4'>
                <textarea
                    placeholder='Viết bình luận của bạn...'
                    className='w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-100/30 resize-none'
                    rows={4}
                    value={addComment.content}
                    onChange={handleInputChange}
                />
                <div className='text-end'>
                    <button className='btn inline-flex items-center gap-2' onClick={handleAddComment}>
                        <SendHorizontal className='w-4 h-4' /> Gửi bình luận
                    </button>
                </div>
            </div>

            {/* comments list */}
            <div className='space-y-6'>
                {/* Sample Comment */}
                {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment.id} className='border-b border-gray-700 pb-3 mb-10'>
                        <div className='flex items-center mb-2'>
                            <div className='w-10 h-10 rounded-full bg-gradient flex items-center justify-center text-primary font-bold mr-4'>
                                {comment.user.username ? comment.user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className='font-semibold capitalize'>{comment.user.username || 'User'}</p>
                                <p className='text-xs text-gray-400'>{formatDate(comment.createdAt)}</p>
                            </div>
                        </div>
                        <p className='text-gray-300'>{comment.content}</p>
                    </div>
                )) : (
                    <div className='flex items-center flex-col gap-3 text-white/50 mb-10'>
                        <MessageSquareOff  size={50}/>
                        <p>Chưa có bình luận nào</p>
                    </div>
                )}
            </div>

            {/* Load More */}
            {/* <button className='btn mt-6 w-full border rounded-lg  '>
                Xem thêm bình luận
            </button> */}
        </section>
    )
}

export default Comment

import { MessageSquareOff, Pencil, SendHorizontal, Trash } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const Comment = ({ movieId }) => {
    const { user } = useContext(AuthContext)
    const [comments, setComments] = useState([])
    const [addComment, setAddComment] = useState({
        movieId: movieId,
        content: ''
    })
    const [isEditing, setIsEditing] = useState(false)
    const [editComment, setEditComment] = useState()
    const textareaRef = useRef(null)

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
        if (isEditing) {
            setEditComment({ ...editComment, content: e.target.value })
        } else {
            setAddComment({ ...addComment, content: e.target.value })
        }
    }

    const handleEditComment = (comment) => {
        setEditComment(comment)
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus()
        }, 0)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditComment(null)
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
    const handleUpdateComment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/${editComment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(editComment)
            })
            if (!res.ok) {
                throw new Error('Failed to update comment')
            }
            toast.success('Cập nhật bình luận thành công')
            fetchComments()
            setEditComment(null)
            setIsEditing(false)
        } catch (error) {
            console.error('Error update comment:', error)
            toast.error('Không thể cập nhật bình luận')
        }
    }
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete comment')
                }
                toast.success('Xóa bình luận thành công')
                fetchComments()

            } catch (error) {
                console.error('Error deleting comment:', error)
                toast.error('Không thể xóa bình luận')
            }
        }
    }


    useEffect(() => {
        fetchComments()
    }, [movieId])

    return (
        <section className='section'>
            <h2 >Bình luận</h2>

            {/* comment form */}
            <div className='mb-10 space-y-4'>
                <textarea
                    placeholder='Viết bình luận của bạn...'
                    className='w-full p-4 rounded-lg bg-gray-800 border border-gray-500 text-white placeholder-white focus:outline-none resize-none'
                    rows={4}
                    ref={textareaRef}
                    value={isEditing ? editComment.content || '' : addComment.content}
                    onChange={handleInputChange}
                />
                <div className='text-end'>
                    {user ? (
                        isEditing ? (
                            <div className='space-x-2'>
                                <button className='btn inline-flex items-center gap-2' onClick={handleUpdateComment}>
                                    Cập nhật<SendHorizontal className='w-4 h-4' />
                                </button>
                                <button className='px-4 py-2 rounded-lg bg-gray-200 text-black' onClick={handleCancelEdit}>
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <button className='btn inline-flex items-center gap-2' onClick={handleAddComment}>
                                Gửi<SendHorizontal className='w-4 h-4' />
                            </button>
                        )
                    ) : (
                        <Link to={ROUTES.LOGIN} className='btn'>
                            Đăng nhập để bình luận
                        </Link>
                    )}
                </div>
            </div>

            {/* comments list */}
            <div className='space-y-6'>
                {/* Sample Comment */}
                {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment.id} className=' pb-3 '>
                        <div className='flex items-center mb-2'>
                            {/* <div className='w-12 h-12 rounded-full bg-gradient flex items-center justify-center text-primary font-bold mr-4'>
                                {comment.user.username ? comment.user.username.charAt(0).toUpperCase() : 'U'}
                            </div> */}
                            <img
                                src={`https://i.pravatar.cc/150?u=${comment.user.id}`}
                                alt={comment.user.name}
                                className="w-12 h-12 rounded-full mr-3 border-2 border-gray-200"
                            />
                            <div>
                                <p className='font-bold '>{comment.user.name || 'User'}</p>
                                <p className='text-xs text-gray-400 italic'>{formatDate(comment.createdAt)}</p>

                                <p className='text-white/70 mt-2'>{comment.content}</p>
                                {comment.user.username === user?.user.username && (
                                    <div className='flex gap-2 text-sm items-center mt-1'>
                                        <button className='text-white/50 hover:text-white' onClick={() => handleEditComment(comment)}>Sửa</button>
                                        <button className='text-white/50 hover:text-white' onClick={() => handleDeleteComment(comment.id)}>Xóa</button>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                )) : (
                    <div className='flex items-center flex-col gap-3 text-white/50 mb-10'>
                        <MessageSquareOff size={50} />
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

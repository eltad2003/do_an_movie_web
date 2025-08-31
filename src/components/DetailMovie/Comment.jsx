import { SendHorizontal } from 'lucide-react'
import React from 'react'

const Comment = () => {
    return (
        <div className='bg-dark-100 text-white p-5 rounded-lg'>
            <h3 className='text-xl font-bold mb-6'>Bình luận</h3>

            {/* Comment Form */}
            <div className='mb-10'>
                <textarea
                    placeholder='Viết bình luận của bạn...'
                    className='w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-100/30 resize-none'
                    rows={4}
                />
                <button className='ms-auto mt-3 px-3 py-2 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 font-semibold rounded-lg hover:opacity-90 transition inline-flex items-center gap-2'>
                    <SendHorizontal className='w-4 h-4' /> Gửi bình luận
                </button>
            </div>

            {/* Comments List */}
            <div className='space-y-6'>
                {/* Sample Comment */}
                <div className='border-b border-gray-700 pb-4'>
                    <div className='flex items-start gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-dark-100 font-bold'>
                            U
                        </div>
                        <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='font-semibold'>User123</span>
                                <span className='text-gray-400 text-sm'>2 giờ trước</span>
                            </div>
                            <p className='text-gray-300'>Phim hay quá! Cảm ơn admin đã up phim.</p>
                        </div>
                    </div>
                </div>

                <div className='border-b border-gray-700 pb-4'>
                    <div className='flex items-start gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-dark-100 font-bold'>
                            M
                        </div>
                        <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='font-semibold'>MovieLover</span>
                                <span className='text-gray-400 text-sm'>1 ngày trước</span>
                            </div>
                            <p className='text-gray-300'>Chất lượng hình ảnh rất tốt, cảm ơn!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Load More */}
            <button className='mt-6 w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition text-gray-300'>
                Xem thêm bình luận
            </button>
        </div>
    )
}

export default Comment

import { Star, StarIcon, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ManageReview = () => {
    // GET :movie_id/reviews
    const [reviews, setReviews] = useState([
        {
            id: 1,
            user: 'Nguyễn Văn An',
            rating: 5,
            comment: 'Phim hay tuyệt vời! Cốt truyện hấp dẫn, diễn xuất xuất sắc. Rất đáng xem!',
            created_at: '2024-10-20T14:30:00Z'
        },
        {
            id: 2,
            user: 'Trần Thị Bích',
            rating: 4,
            comment: 'Phim khá hay, hình ảnh đẹp. Tuy nhiên có một vài phần hơi dài dòng.',
            created_at: '2024-10-21T09:15:00Z'
        },
        {
            id: 3,
            user: 'Lê Văn Cường',
            rating: 3,
            comment: 'Âm thanh và hình ảnh tốt, nhưng cốt truyện hơi chậm và khá dễ đoán.',
            created_at: '2024-10-22T16:45:00Z'
        },
        {
            id: 4,
            user: 'Phạm Thị Dung',
            rating: 5,
            comment: 'Một kiệt tác điện ảnh! Tôi đã khóc nhiều lần khi xem. Đạo diễn quá tài năng!',
            created_at: '2024-10-23T11:20:00Z'
        },
        {
            id: 5,
            user: 'Hoàng Văn Em',
            rating: 2,
            comment: 'Phim không như kỳ vọng. Nội dung nhạt nhẽo và diễn xuất chưa thuyết phục.',
            created_at: '2024-10-23T18:30:00Z'
        },
        {
            id: 6,
            user: 'Vũ Thị Phương',
            rating: 4,
            comment: 'Phim hay, nhạc phim rất đỉnh. Tuy nhiên kết thúc hơi vội vàng.',
            created_at: '2024-10-24T10:05:00Z'
        },
        {
            id: 7,
            user: 'Đỗ Văn Giang',
            rating: 5,
            comment: 'Xuất sắc từ đầu đến cuối! Mọi thứ đều hoàn hảo. 10/10!',
            created_at: '2024-10-24T15:50:00Z'
        },
        {
            id: 8,
            user: 'Ngô Thị Hằng',
            rating: 3,
            comment: 'Phim ổn, xem được. Không quá tệ nhưng cũng không quá xuất sắc.',
            created_at: '2024-10-25T08:25:00Z'
        },
        {
            id: 9,
            user: 'Bùi Văn Inh',
            rating: 4,
            comment: 'Diễn viên chính diễn rất tốt. Hiệu ứng đặc biệt ấn tượng!',
            created_at: '2024-10-25T13:40:00Z'
        },
        {
            id: 10,
            user: 'Lý Thị Kiều',
            rating: 5,
            comment: 'Phim tuyệt vời! Sẽ xem lại nhiều lần. Cảm ơn ekip đã làm ra phim hay như vậy!',
            created_at: '2024-10-26T07:15:00Z'
        }
    ])
    const handleDeleteComment = (reviewId) => {
        // DELETE :movie_id/reviews/:review_id
        if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá của người dùng này không?')) {
            // Xóa đánh giá
            console.log('Thành công');
            toast.success('Xóa đánh giá thành công');
            setReviews(reviews.filter(review => review.id !== reviewId))

        }
    }
    return (
        <div>
            <div className='overflow-auto rounded-lg shadow-sm border border-gray-200'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>

                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Người dùng</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Đánh giá</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Bình luận</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase'>Thời gian</th>
                            <th className='p-4 text-left text-xs font-semibold uppercase'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviews.map((review, index) => (
                            <tr key={index} className='hover:bg-gray-50'>

                                <td className="px-6 py-4">{review.user}</td>
                                <td className="px-6 py-4">
                                    <span className='inline-flex justify-center items-center gap-1'>{review.rating}<StarIcon className='text-yellow-400 fill-amber-400' /></span>
                                </td>
                                <td className="px-6 py-4">{review.comment}</td>
                                <td className="px-6 py-4">
                                    {new Date(review.created_at).toLocaleDateString('vi-VN', {
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
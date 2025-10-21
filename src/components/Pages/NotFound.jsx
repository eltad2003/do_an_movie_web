import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center p-3 space-y-5">
        <h2>Lỗi 404 - Không tìm thấy trang</h2>
        <p className='text-white/50'>Trang bạn tìm kiếm không tồn tại. Vui lòng thử lại đường dẫn khác hoặc quay về trang chủ</p>
        <button
          onClick={() => navigate('/')}
          className="btn inline-flex items-center gap-2 mt-4"
        >
          <ChevronLeft className='w-4 h-4' />
          Về trang chủ
        </button>
      </div>
    </main>
  )
}

export default NotFound
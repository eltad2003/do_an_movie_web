import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { Link, Navigate } from 'react-router-dom'

const UnAuthorization = () => {
    return (
        <main className="flex items-center justify-center min-h-dvh">
            <div className="text-center p-3 space-y-5">
                <h2>Lỗi 403 - Bạn không có quyền truy cập trang này</h2>
                <p className='text-white/50'>Bạn cần là quản trị viên hoặc liên hệ quản trị viên để truy cập trang này.</p>
                <Link
                    to={'/'}
                    className="btn inline-flex items-center gap-2 mt-4"
                >
                    <ChevronLeft className='w-4 h-4' />
                    Về trang chủ
                </Link>
            </div>

        </main>
    )
}

export default UnAuthorization
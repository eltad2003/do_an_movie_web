import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const UnLogin = () => {
    return (
        <main className="flex items-center justify-center min-h-dvh">
            <div className="text-center p-3 space-y-5">
                <h2>Bạn không có quyền truy cập trang này</h2>
                <p className='text-white/50'>Bạn cần đăng nhập truy cập trang này.</p>
                <Link
                    to={ROUTES.LOGIN}
                    className="btn inline-flex items-center gap-2 mt-4"
                >
                    <ChevronLeft className='w-4 h-4' />
                    Đăng nhập ngay
                </Link>
            </div>

        </main>
    )
}

export default UnLogin
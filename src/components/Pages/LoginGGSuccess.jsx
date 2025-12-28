import { CircleCheckBig } from 'lucide-react'
import React from 'react'

const LoginGGSuccess = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <CircleCheckBig className='w-20 h-20 text-green-500' />
            <div className="text-center p-3 space-y-5">
                <h1>Đăng nhập thành công</h1>
                <p className='text-white/50'>Đang điều hướng đến trang chủ...</p>

            </div>
        </main>
    )
}

export default LoginGGSuccess
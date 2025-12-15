import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Outlet, useNavigate } from 'react-router-dom'
import UnAuthorization from './Pages/UnAuthorization'
import { ROUTES } from '../utils/constants'
import { toast } from 'react-toastify'

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    // 1. Kiểm tra đã đăng nhập chưa
    // 2. Kiểm tra có đúng role admin không
    // 3. Nếu mọi thứ OK, cho phép truy cập

    useEffect(() => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để truy cập trang quản trị')
        }
    }, [user, navigate])

    if (user?.user.roleName !== 'ROLE_ADMIN') {
        return <UnAuthorization />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Outlet, useNavigate } from 'react-router-dom'
import UnAuthorization from './Pages/UnAuthorization'

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    // 1. Kiểm tra đã đăng nhập chưa
    // 2. Kiểm tra có đúng role admin không
    // 3. Nếu mọi thứ OK, cho phép truy cập

    useEffect(() => {
        if (!user) {
            navigate('/login')
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
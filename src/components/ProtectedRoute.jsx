import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Outlet } from 'react-router-dom'
import UnAuthorization from './Pages/UnAuthorization'

const ProtectedRoute = ({ roleAdmin }) => {
    const { user } = useContext(AuthContext)
    // 1. Kiểm tra đã đăng nhập chưa
    // 2. Kiểm tra có đúng role admin không
    // 3. Nếu mọi thứ OK, cho phép truy cập
    if (!user) {
        window.location.replace('/login')
        return null
    }

    if (roleAdmin && user.user.roleName !== 'ROLE_ADMIN') {

        return <UnAuthorization />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute
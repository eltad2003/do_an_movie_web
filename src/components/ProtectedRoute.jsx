import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Outlet, useNavigate } from 'react-router-dom'
import UnAuthorization from './Pages/UnAuthorization'
import { ROUTES } from '../utils/constants'
import { toast } from 'react-toastify'
import UnLogin from './Pages/UnLogin'

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext)
    // const navigate = useNavigate()


    // useEffect(() => {
    //     if (!user) {
    //         toast.error('Vui lòng đăng nhập để truy cập trang quản trị')
    //     }
    // }, [user, navigate])

    if (!user) {
        return <UnLogin />
    }
    if (user?.user.roleName !== 'ROLE_ADMIN') {
        return <UnAuthorization />
    } 

    return (
        <Outlet />
    )
}

export default ProtectedRoute
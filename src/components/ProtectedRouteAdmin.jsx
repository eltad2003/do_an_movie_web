import React, { useContext } from 'react'
import UnAuthorization from './Pages/UnAuthorization'
import UnLogin from './Pages/UnLogin'
import { AuthContext } from '../context/AuthContext'
import { Outlet } from 'react-router-dom'

const ProtectedRouteAdmin = () => {
    const { user } = useContext(AuthContext)
    if (!user || !user.user) {
        return <UnLogin />
    }

    if (user.user.roleName !== 'ROLE_ADMIN') {
        return <UnAuthorization />
    }

    return <Outlet />
}

export default ProtectedRouteAdmin
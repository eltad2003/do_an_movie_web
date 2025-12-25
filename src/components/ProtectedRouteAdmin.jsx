import React, { useContext } from 'react'
import UnAuthorization from './Pages/UnAuthorization'
import UnLogin from './Pages/UnLogin'
import { AuthContext } from '../context/AuthContext'

const ProtectedRouteAdmin = () => {
    const { user } = useContext(AuthContext)

    console.log('User in AdminRoute:', user)

    if (!user || !user.user) {
        return <UnLogin />
    }

    if (user.user.roleName !== 'ROLE_ADMIN') {
        return <UnAuthorization />
    }

    return <Outlet />
}

export default ProtectedRouteAdmin
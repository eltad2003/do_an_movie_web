import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Outlet } from 'react-router-dom'
import UnLogin from './Pages/UnLogin'

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext)

    if (!user || !user.user) {
        return <UnLogin />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute
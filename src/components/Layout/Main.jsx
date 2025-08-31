import React from 'react'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Main = () => {
    return (
        <div className='min-h-dvh flex flex-col justify-between'>
            <Navbar />
            <Outlet />
            {/* <Footer /> */}
        </div>
    )
}

export default Main

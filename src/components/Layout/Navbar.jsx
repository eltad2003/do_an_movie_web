import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center bg-secondary  p-5'>
      <a href='/' className='text-white text-2xl font-bold cursor-pointer'>CHILLFLIX</a>
      <Link to="/login" className='btn'>Đăng nhập</Link>
    </nav>

  )
}

export default Navbar

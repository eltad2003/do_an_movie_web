import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNav } from '../../hooks/useNav'
import DropDown from './DropDown'
import { LogOut, Menu, User, X } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'


const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const { categories, countries } = useNav()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isOpenSideBar, setIsOpenSideBar] = useState(false)
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const location = useLocation()

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const handleLogout = useCallback(async () => {
    await logout()
    setIsOpenProfile(false)
    navigate('/')
  }, [logout, navigate])

  const Type = ({ to, label }) => {
    return (
      <Link to={to} className='text-white hover:text-light-200 transition-colors'>
        {label}
      </Link>
    )
  }

  useEffect(() => {
    setIsOpenSideBar(false)
    setIsOpenProfile(false)
    setOpenDropdown(null)
  }, [location.pathname])



  return (
    <nav className='flex justify-between items-center bg-dark-200 sticky top-0 z-50 p-5'>
      <div className='lg:flex items-center gap-8 hidden '>
        <a href='/' className='text-white text-2xl font-bold cursor-pointer'>CHILLFLIX</a>
        <DropDown
          text='Thể loại'
          slug='the-loai'
          data={categories}
          isDropdownOpen={openDropdown === 'category'}
          onToggle={() => handleDropdownToggle('category')}
        />
        <Type to="/phim-bo" label="Phim bộ" />
        <Type to="/phim-le" label="Phim lẻ" />
        <DropDown
          text='Quốc gia'
          slug='quoc-gia'
          data={countries}
          isDropdownOpen={openDropdown === 'country'}
          onToggle={() => handleDropdownToggle('country')}
        />
        <Type to="/hoat-hinh" label="Hoạt hình" />
        <Type to="/tv-shows" label="TV Shows" />
        <Type to="/xem-chung" label="Xem chung" />
      </div>

      {/* mobile */}
      <div className='lg:hidden relative flex items-center gap-4'>
        <button onClick={() => setIsOpenSideBar(!isOpenSideBar)} className='focus:outline-none'>
          {isOpenSideBar ? <X className='text-white' /> : <Menu className='text-white' />}
        </button>
        <Link to='/' className='text-white text-2xl font-bold'>
          CHILLFLIX
        </Link>
      </div>

      {user ? (
        <button className='btn' onClick={() => setIsOpenProfile(!isOpenProfile)}><User /></button>
      ) : (
        <Link to="/login" >
          <button className='btn'>Đăng nhập</button>
        </Link>
      )}
      {isOpenProfile && (
        <div className='absolute top-full right-0 mr-2 w-48 bg-primary rounded-lg shadow-lg p-4 z-50'>
          <Link to="/profile" className='block  text-white hover:text-light-100 mb-3'>Hồ sơ</Link>
          <Link onClick={handleLogout} className='inline-flex gap-2 text-white hover:text-light-100'><LogOut />Đăng xuất</Link>
        </div>
      )}

      {isOpenSideBar && (
        <div className='absolute top-full left-0 right-0 w-full bg-dark-200 rounded-b-lg p-3 flex flex-col gap-8 lg:hidden z-50'>
          <DropDown
            text='Quốc gia'
            slug='quoc-gia'
            data={countries}
            isDropdownOpen={openDropdown === 'country'}
            onToggle={() => handleDropdownToggle('country')}
          />
          <DropDown
            text='Thể loại'
            slug='the-loai'
            data={categories}
            isDropdownOpen={openDropdown === 'category'}
            onToggle={() => handleDropdownToggle('category')}
          />
          <Type to="/phim-bo" label="Phim bộ" />
          <Type to="/phim-le" label="Phim lẻ" />
          <Type to="/hoat-hinh" label="Hoạt hình" />
          <Type to="/tv-shows" label="TV Shows" />
          <Type to="/xem-chung" label="Xem chung" />
        </div>
      )}
    </nav>

  )
}

export default Navbar

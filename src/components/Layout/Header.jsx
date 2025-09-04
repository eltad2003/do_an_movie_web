import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'



import { useNav } from '../../hooks/useNav'
import DropDown from './DropDown'
import { Menu, X } from 'lucide-react'


const Navbar = () => {
  const { categories, countries } = useNav()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isOpenSideBar, setIsOpenSideBar] = useState(false)
  const location = useLocation()

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const Type = ({ to, label }) => {
    return (
      <Link to={to} className='text-white hover:text-light-200 transition-colors'>
        {label}
      </Link>
    )
  }

  // const handleBackdropClick = (e) => {
  //   if (e.target === e.currentTarget) {
  //     setIsOpenSideBar(false)
  //     setOpenDropdown(null)
  //   }
  // }

  useEffect(() => {
    setIsOpenSideBar(false)
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

      {isOpenSideBar && (
        <div className='absolute top-full left-0 right-0 w-full bg-dark-200 rounded-b-lg p-5 flex flex-col gap-8 lg:hidden z-50'>
          <DropDown
            text='Thể loại'
            slug='the-loai'
            data={categories}
            isDropdownOpen={openDropdown === 'category'}
            onToggle={() => handleDropdownToggle('category')}
          />
          <DropDown
            text='Quốc gia'
            slug='quoc-gia'
            data={countries}
            isDropdownOpen={openDropdown === 'country'}
            onToggle={() => handleDropdownToggle('country')}
          />
          <Type to="/phim-bo" label="Phim bộ" />
          <Type to="/phim-le" label="Phim lẻ" />
          <Type to="/hoat-hinh" label="Hoạt hình" />
          <Type to="/tv-shows" label="TV Shows" />
          <Type to="/xem-chung" label="Xem chung" />
        </div>
      )}

      <Link to="/login" className='btn '>Đăng nhập</Link>
    </nav>

  )
}

export default Navbar

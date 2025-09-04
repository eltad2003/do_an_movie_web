import React, { useState } from 'react'
import { Link } from 'react-router-dom'



import { useNav } from '../../hooks/useNav'
import DropDown from './DropDown'


const Navbar = () => {
  const { categories, countries } = useNav()
  const [openDropdown, setOpenDropdown] = useState(null)

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
  return (
    <nav className='flex justify-between items-center bg-primary/90 sticky top-0 z-50 p-5'>
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

      <Link to="/login" className='btn hidden lg:block'>Đăng nhập</Link>
    </nav>

  )
}

export default Navbar

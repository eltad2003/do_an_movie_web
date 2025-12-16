import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNav } from '../../hooks/useNav'
import DropDown from './DropDown'
import { Clock, Heart, LogOut, Menu, Shield, User, UserPen, X } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { ROUTES } from '../../utils/constants'


const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const { categories, countries } = useNav()
    const [openDropdown, setOpenDropdown] = useState(null)
    const [isOpenSideBar, setIsOpenSideBar] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const location = useLocation()


    const handleDropdownToggle = (name) => {
        setOpenDropdown(openDropdown === name ? null : name)
    }

    const handleLogout = () => {
        setIsOpenProfile(false)
        logout()
        toast.success('Đăng xuất thành công!')
        window.location.replace('/')
    }

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
        <nav className='flex justify-between items-center bg-dark-200/50 backdrop-blur-md sticky top-0 z-50 p-5'>
            <div className='lg:flex items-center gap-8 hidden '>
                <a href='/' className=' text-3xl font-bold cursor-pointer text-gradient'>CHILLFLIX</a>
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

                {user ? <Type to={ROUTES.ROOMS} label="Xem chung" /> : (
                    <div className='text-gradient text-lg hover:text-light-100 transition-colors cursor-pointer' onClick={() => toast.error('Vui lòng đăng nhập để sử dụng tính năng này')}>
                        Xem chung
                    </div>
                )}
            </div>
            {isOpenProfile && (
                <div className='absolute top-full right-0 m-1 w-[250px] flex flex-col bg-dark-100 rounded-lg shadow-lg p-4 z-50'>
                    <p className='mb-2 text-white p-1 border-b-2 border-gray-700' title={user.user.name}>{user.user.name}</p>
                    <Link to={ROUTES.PROFILE} className='inline-flex gap-4 text-white hover:text-light-100 hover:bg-gray-800 p-1.5 rounded-lg mb-3'><UserPen />Hồ sơ</Link>
                    {user && user.user.roleName === 'ROLE_ADMIN' && (
                        <Link to="/admin" className='inline-flex gap-4 text-white hover:text-light-100 hover:bg-gray-800 p-1.5 rounded-lg mb-3'><Shield />Quản trị</Link>
                    )}
                    <Link to={ROUTES.HISTORY} className='inline-flex gap-4 text-white hover:text-light-100 hover:bg-gray-800 p-1.5 rounded-lg mb-3'><Clock />Lịch sử</Link>
                    <Link to={ROUTES.FAVORITE} className='inline-flex gap-4 text-white hover:text-light-100 hover:bg-gray-800 p-1.5 rounded-lg mb-3'><Heart />Yêu thích</Link>
                    <Link onClick={handleLogout} className='inline-flex gap-4 text-white hover:text-light-100 hover:bg-gray-800 p-1.5 rounded-lg'><LogOut />Đăng xuất</Link>
                </div>
            )}

            {/* --------------------mobile-------------------------------------- */}
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
                <Link to={ROUTES.LOGIN} >
                    <button className='btn'>Đăng nhập</button>
                </Link>
            )}

            {isOpenSideBar && (
                <div className='absolute top-full left-0 right-0 w-full bg-dark-100 rounded-b-lg p-3 flex flex-col gap-8 lg:hidden z-50'>
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
                    {user ? <Type to={ROUTES.ROOMS} label="Xem chung" /> : (
                        <div className='text-light-100  cursor-pointer' onClick={() => toast.error('Vui lòng đăng nhập để sử dụng tính năng này')}>
                            Xem chung
                        </div>
                    )}
                </div>
            )}
        </nav>

    )
}

export default Navbar

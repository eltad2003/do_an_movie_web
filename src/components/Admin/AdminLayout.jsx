import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import {
    Menu,
    ChartColumn,
    Users,
    Clapperboard,
    Tag,
    Drama,
    LogOut,
    Earth,
    TvMinimal
} from 'lucide-react'

function AdminLayout() {
    const { user, logout } = useContext(AuthContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        toast.success('Đăng xuất thành công!')
    }


    const menuItems = [
        { icon: ChartColumn, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Quản lý Người Dùng', path: '/admin/quan-ly-nguoi-dung' },
        { icon: Clapperboard, label: 'Quản lý Phim', path: '/admin/quan-ly-phim' },
        { icon: Tag, label: 'Quản lý Thể Loại', path: '/admin/quan-ly-the-loai' },
        { icon: Earth, label: 'Quản lý Quốc Gia', path: '/admin/quan-ly-quoc-gia' },
        { icon: Drama, label: 'Quản lý Diễn Viên', path: '/admin/quan-ly-dien-vien' },
        { icon: Drama, label: 'Quản lý Đạo Diễn', path: '/admin/quan-ly-dao-dien' },
        {icon: TvMinimal, label: 'Quản lý phòng xem', path: '/admin/quan-ly-phong-xem-chung' }
    ]

    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    return (
        < >
            <button
                className="fixed top-3 left-3 z-50 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Menu />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 w-64 bg-gray-900 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} duration-200`}
            >
                <div className="flex flex-col min-h-dvh">
                    {/* User Profile */}
                    <div className="text-center mt-10">
                        <div className="relative inline-block">
                            <img
                                src={`https://i.pravatar.cc/150?u=${user.user.id}`}
                                alt={user.user.name}
                                className="w-24 h-24 rounded-full border-3 border-gray-700 shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-gray-900"></div>
                        </div>
                        <h3 className="font-bold text-lg text-white">{user.user.name}</h3>
                        <p className="text-sm text-gray-300">{user.user.email}</p>
                    </div>



                    {/* Navigation Menu */}
                    <div className="flex-1 p-3">
                        {/* Menu Title */}
                        <div className="mb-3">
                            <h2 className="text-xl font-bold border-b border-gray-700">
                                Quản lý
                            </h2>
                        </div>
                        <nav className='space-y-3'>
                            {menuItems.map((item, index) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center px-4 py-2 gap-3 rounded-lg text-white hover:bg-gray-800 hover:text-light-100 hover:font-bold transition-colors duration-200"
                                    >
                                        <IconComponent />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Logout Button */}
                    <div className='m-6'>
                        <button
                            onClick={handleLogout}
                            className="w-full cursor-pointer flex items-center justify-center py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                            <span>Đăng xuất</span>
                            <LogOut size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='bg-white'>
                <Outlet />
            </div>


        </>

    )
}

export default AdminLayout
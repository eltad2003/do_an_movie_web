import React, { useEffect, useState } from 'react'
// import { useContext } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import {
    Menu,
    Clock,
    Users,
    Clapperboard,
    LogOut
} from 'lucide-react'

function AdminLayout() {
    // const { user, logout } = useContext(AuthContext)
    const user = {
        "id": 1,
        "username": "admin",
        "fullName": "Admin User",
        "email": "admin@example.com",
        "role": "ADMIN",
        "avatarUrl": "https://i.pravatar.cc/150?img=1"
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const location = useLocation()


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const menuItems = [
        { icon: Clock, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Quản lý người dùng', path: '/admin/quan-ly-nguoi-dung' },
        { icon: Clapperboard, label: 'Quản lý Phim', path: '/admin/quan-ly-phim' },

    ]

    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    return (
        user && user.role === 'ADMIN' ? (
            <div className="flex min-h-screen">
                {/* Sidebar Toggle Button */}
                <button
                    className="fixed top-3 left-3 z-50 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    onClick={toggleSidebar}
                >
                    <Menu />
                </button>

                {/* Sidebar */}
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="p-3">
                        {/* User Profile */}
                        <div className="text-center mb-3 mt-10">
                            <div className="relative inline-block">
                                <img
                                    src={user.avatarUrl}
                                    alt={user.fullName}
                                    className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"></div>
                            </div>
                            <h3 className="font-semibold text-lg text-light-100">{user.fullName}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>

                        {/* Menu Title */}
                        <div className="mb-5">
                            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">
                                Quản lý
                            </h2>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-3">
                            {menuItems.map((item, index) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center px-4 py-2 gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white hover:font-bold transition-colors duration-200"
                                    >
                                        <IconComponent />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Logout Button */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <button
                                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                            >
                                <span>Đăng xuất</span>
                                <LogOut size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Main Content */}
                <div className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                    <main className='bg-white'>
                        <Outlet />
                    </main>
                </div>

            </div>
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut size={32} className="text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Truy cập bị từ chối
                        </h3>
                        <p className="text-gray-600">
                            Bạn cần đăng nhập với tài khoản Admin để truy cập trang này
                        </p>
                    </div>
                    <Link to="/login">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
                            Đăng nhập
                        </button>
                    </Link>
                </div>
            </div>
        )
    )
}

export default AdminLayout
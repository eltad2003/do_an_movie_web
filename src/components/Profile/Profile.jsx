import { LockOpen, User } from 'lucide-react'
import React, { useState } from 'react'
import ChangePassword from './ChangePassword'

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        name: 'Nguyễn Văn A',
        email: 'user@example.com'
    })
    const [isEditing, setIsEditing] = useState(false)

    const handleInfoChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const handleSaveInfo = () => {
        // Logic lưu thông tin người dùng
        console.log('Saving user info:', userInfo)
        setIsEditing(false)
        alert('Thông tin đã được cập nhật!')
    }


    return (
        <main >
            <div className="container mx-auto p-5 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1>Thông tin cá nhân</h1>
                </div>

                {/* Thông tin cơ bản */}
                <section className="section mb-10">
                    <div className="flex items-center mb-6 gap-3">
                        <User />
                        <h2>Thông tin cơ bản</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-light-100 mb-2">
                                Tên đầy đủ
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={userInfo.name}
                                    onChange={handleInfoChange}
                                    className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Nhập tên đầy đủ"
                                />
                            ) : (
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                    {userInfo.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-100 mb-2">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleInfoChange}
                                    className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Nhập email"
                                />
                            ) : (
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                    {userInfo.email}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveInfo}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                                    >
                                        Lưu thay đổi
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                                >
                                    Chỉnh sửa thông tin
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Đổi mật khẩu */}
                <ChangePassword />

                {/* Thông tin bổ sung */}
                {/* <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Trạng thái tài khoản</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-green-600 font-semibold mb-1">Tài khoản</div>
                            <div className="text-green-800 text-sm">Đã xác thực</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="text-blue-600 font-semibold mb-1">Email</div>
                            <div className="text-blue-800 text-sm">Đã xác thực</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                            <div className="text-purple-600 font-semibold mb-1">Thành viên từ</div>
                            <div className="text-purple-800 text-sm">Tháng 10, 2024</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </main>
    )
}

export default Profile
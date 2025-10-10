import { LockOpen } from 'lucide-react'
import React, { useState } from 'react'

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showChangePassword, setShowChangePassword] = useState(false)
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }
    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!')
            return
        }

        if (passwordData.newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
            return
        }

        // Logic đổi mật khẩu
        console.log('Changing password')
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setShowChangePassword(false)
        alert('Mật khẩu đã được đổi thành công!')
    }
    return (
        <section className="section mb-10">
            {!showChangePassword ? (
                <div className="text-center">
                    <button
                        onClick={() => setShowChangePassword(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center mb-6 gap-3">
                            <LockOpen />
                            <h2>Đổi mật khẩu</h2>
                        </div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 "
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 "
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 "
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={handleChangePassword}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                        >
                            Đổi mật khẩu
                        </button>
                        <button
                            onClick={() => setShowChangePassword(false)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </section>

    )
}

export default ChangePassword
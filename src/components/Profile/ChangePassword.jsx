import { LockOpen } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ChangePassword = ({ token }) => {
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
    const handleChangePassword = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            })
            if (!res.ok) {
                const errorMessage = await res.text()
                toast.error(errorMessage)
                return
            }
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setShowChangePassword(false)
            toast.success('Mật khẩu đã được đổi thành công!')
        } catch (error) {
            toast.error(error)

        }
    }

    return (
        <div className="section">
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
                <form onSubmit={handleChangePassword} className="space-y-6">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg "
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg "
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg "
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type='submit'
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
                </form>
            )}
        </div>

    )
}

export default ChangePassword
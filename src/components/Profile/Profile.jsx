import { LockOpen, User } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import ChangePassword from './ChangePassword'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../UI/Loading'
import { toast } from 'react-toastify'

const Profile = () => {
    const { user } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(null)

    const [isEditing, setIsEditing] = useState(false)

    const fetchUserInfo = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })
            if (!res.ok) {
                throw new Error('Failed to fetch user info')
            }
            const data = await res.json()
            setUserInfo(data)
            console.log(data);

        } catch (error) {
            console.error(error)
        }
    }
    const handleInfoChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const handleSaveInfo = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    username: userInfo.username
                })
            })
            if (!res.ok) {
                toast.error(await res.text())
                return
            }
            const data = await res.json()
            setUserInfo(data)
            setIsEditing(false)
            toast.success('Cập nhật thông tin thành công!')
        } catch (error) {
            console.error(error)
            toast.error('Cập nhật thông tin thất bại!')
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    if (!userInfo) {
        return <Loading />
    }

    return (
        <main >
            <div className='pattern' />
            <div className="wrapper max-w-3xl ">
                <section className="section  mt-10">
                    <div className="flex justify-center items-center mb-6 gap-3">
                        <User />
                        <h2>Thông tin cơ bản</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-light-100 mb-2">
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
                                <div className='inline-flex gap-3 items-center'>
                                    {userInfo.name}
                                    <span className='text-sm font-medium px-2.5 py-0.5 bg-green-500 rounded-full'>{userInfo.roleName}</span>
                                </div>
                            )}
                        </div>
                        {/* <div>
                            <label className="block text-sm font-semibold text-light-100 mb-2">
                                Tên đăng nhập
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={userInfo.username}
                                    onChange={handleInfoChange}
                                    className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Nhập tên đầy đủ"
                                />
                            ) : (
                                <div className='inline-flex gap-3 items-center'>
                                    {userInfo.username}

                                </div>
                            )}
                        </div> */}
                        <div>
                            <label className="block text-sm font-semibold text-light-100 mb-2">
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
                                <div>
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
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg "
                                >
                                    Chỉnh sửa thông tin
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* change password*/}
                <ChangePassword token={user.accessToken} />

            </div>
        </main>
    )
}

export default Profile
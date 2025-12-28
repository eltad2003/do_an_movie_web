import React, { useContext, useEffect, useState } from 'react'
import {
    Search,
    Trash2,
    Eye,
    Shield,
    User,
    Mail,

} from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { toast } from 'react-toastify'


const ManageUser = () => {
    const { user } = useContext(AuthContext)
    const [users, setUsers] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('ALL')
    const [pageData, setPageData] = useState([])

    const handlePageChange = (currentData) => {
        setPageData(currentData)
    }

    const fetchAllUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (res.ok) {
                    fetchAllUser()
                    toast.success('Xóa người dùng thành công')
                } else {
                    console.error('Error deleting user:', await res.text())
                }
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    }
    const handleRoleAdmin = async (userData) => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật vai trò người dùng này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/users/${userData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    },
                    body: JSON.stringify({ ...userData, roleName: 'ROLE_ADMIN' })
                })
                if (res.ok) {
                    fetchAllUser()
                    toast.success('Cập nhật vai trò thành công')
                } else {
                    console.error('Error updating user role:', await res.text())
                }
            } catch (error) {
                console.error('Error updating user role:', error)
            }
        }
    }

    // Filter 
    const filteredUsers = users.filter(user => {
        //search by username, email, name
        const matchSearch = user.username?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        //filter by role
        const matchRole = filterRole === 'ALL' || user.roleName === filterRole

        return matchSearch && matchRole
    })


    const getRoleBadge = (roleName) => {
        if (roleName === 'ROLE_ADMIN') {
            return (
                <span className="inline-flex gap-1 items-center px-2.5 py-0.5 rounded-full bg-red-200 text-red-800">
                    <Shield size={14} />
                    Admin
                </span>
            )
        }
        return (
            <span className="inline-flex gap-1 items-center px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-800">
                <User size={14} />
                User
            </span>
        )
    }

    const getProviderBadge = (provider) => {
        if (provider === 'GOOGLE') {
            return (
                <span className="bg-google px-2.5 py-1 rounded-full text-white font-semibold text-sm">
                    Google
                </span>
            )
        }
        return (
            <span className="px-2.5 py-1 rounded-full text-gray-800 bg-gray-100 font-semibold">
                Local
            </span>
        )
    }

    useEffect(() => {
        fetchAllUser()
    }, [])


    return (
        <div className="min-h-dvh">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Người Dùng</h1>
            </div>

            <div className="p-10">
                {/* Search and Filter Bar */}
                <div className="mb-6">
                    <div className="flex gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">Tất cả vai trò</option>
                                <option value="ROLE_ADMIN">Admin</option>
                                <option value="ROLE_USER">User</option>
                            </select>

                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className=" rounded-xl shadow-sm border border-gray-400 overflow-hidden">
                    <div className="overflow-x-auto">

                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-400">
                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                        Nhà cung cấp
                                    </th>

                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                {filteredUsers.length > 0 && (filteredUsers.length <= 10 ? filteredUsers : pageData).map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                                        {/* avatar: "https://i.pravatar.cc/150?img={id}" */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full mr-3 border-2 border-gray-200"
                                                />
                                                <div>
                                                    <div className=" text-gray-900" title='Tên'>
                                                        {user.name || 'Chưa cập nhật'}
                                                    </div>
                                                    <div className="text-sm text-gray-500" title='Username'>@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center  ${user.email ? 'text-gray-900' : 'italic text-gray-400'}`} title='Email'>
                                                <Mail size={16} className="mr-2 text-gray-400 font-bold" />
                                                {user.email || 'Chưa cập nhật'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.roleName)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getProviderBadge(user.provider)}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="py-1">
                                                {user.roleName !== 'ROLE_ADMIN' && (
                                                    <button
                                                        onClick={() => handleRoleAdmin(user)}
                                                        className="flex items-center font-bold w-full px-4 py-2 text-sm text-indigo-700 cursor-pointer">
                                                        <Shield size={16} className="mr-2 \" />
                                                        Cấp quyền Admin
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-300 hover:rounded-lg">
                                                    <Trash2 size={16} className="mr-2" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Empty State */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <User size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg  text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                                <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        )}
                    </div>


                </div>

                {/* Pagination */}
                {users.length > 9 && (
                    <Pagination data={filteredUsers} onPageChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default ManageUser
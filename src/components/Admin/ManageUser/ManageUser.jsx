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
    const [selectedUsers, setSelectedUsers] = useState([])


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

    // Filter 
    const filteredUsers = users.filter(user => {
        //search by username, email, name
        const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        //filter by role
        const matchRole = filterRole === 'ALL' || user.roleName === filterRole

        return matchSearch && matchRole
    })

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(user => user.id))
        } else {
            setSelectedUsers([])
        }
    }

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId])
    }

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
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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

                    {/* Bulk Actions */}
                    {selectedUsers.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">
                                    Đã chọn {selectedUsers.length} người dùng
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                                        Xóa
                                    </button>
                                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                                        Khóa tài khoản
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className=" rounded-xl shadow-sm border border-gray-400 overflow-hidden">
                    <div className="overflow-x-auto">

                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-400">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
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
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
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
                                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:rounded-lg">
                                                    <Eye size={16} className="mr-2" />
                                                    Xem chi tiết
                                                </button>
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
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Hiển thị <span className="">{filteredUsers.length}</span> trên tổng số{' '}
                        <span className="">{users.length}</span> người dùng
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-2 text-sm  text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Trước
                        </button>
                        <button className="px-3 py-2 text-sm  text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-2 text-sm  text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageUser
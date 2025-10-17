import React, { useState } from 'react'
import {
    Search,
    Filter,
    UserPlus,
    Edit,
    Trash2,
    Eye,
    Shield,
    User,
    Mail,
    Calendar,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react'

const ManageUser = () => {
    const users = [
        {
            "id": 1,
            "username": "eltad2003@gmail.com",
            "email": "eltad2003@gmail.com",
            "name": "B21DCCN212 - Lê Hoàng Đạt",
            "provider": "GOOGLE",
            "roleName": "ROLE_USER",
            "createdAt": "2024-01-15",
            "avatar": "https://i.pravatar.cc/150?img=1"
        },
        {
            "id": 4,
            "username": "test",
            "email": "test@gmail.com",
            "name": "ADMIN",
            "provider": "LOCAL",
            "roleName": "ROLE_ADMIN",
            "createdAt": "2024-01-10",
            "avatar": "https://i.pravatar.cc/150?img=2"
        },
        {
            "id": 5,
            "username": "test1",
            "email": "test1@gmail.com",
            "name": null,
            "provider": "LOCAL",
            "roleName": "ROLE_USER",
            "createdAt": "2024-02-01",
            "avatar": "https://i.pravatar.cc/150?img=3"
        },
        {
            "id": 6,
            "username": "test3",
            "email": "test3@gmail.com",
            "name": null,
            "provider": "LOCAL",
            "roleName": "ROLE_USER",
            "createdAt": "2024-02-05",
            "avatar": "https://i.pravatar.cc/150?img=4"
        },
        {
            "id": 7,
            "username": "test4",
            "email": "test4@gmail.com",
            "name": null,
            "provider": "LOCAL",
            "roleName": "ROLE_USER",
            "createdAt": "2024-02-10",
            "avatar": "https://i.pravatar.cc/150?img=5"
        },
        {
            "id": 8,
            "username": "test10",
            "email": "test10@gmail.com",
            "name": null,
            "provider": "LOCAL",
            "roleName": "ROLE_USER",
            "createdAt": "2024-02-15",
            "avatar": "https://i.pravatar.cc/150?img=6"
        },
        {
            "id": 9,
            "username": "test5",
            "email": "test5@gmail.com",
            "name": "test5",
            "provider": "LOCAL",
            "roleName": "ROLE_USER",
            "createdAt": "2024-02-20",
            "avatar": "https://i.pravatar.cc/150?img=7"
        }
    ]

    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('ALL')
    const [filterProvider, setFilterProvider] = useState('ALL')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [showDropdown, setShowDropdown] = useState(null)


    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchRole = filterRole === 'ALL' || user.roleName === filterRole
        const matchProvider = filterProvider === 'ALL' || user.provider === filterProvider

        return matchSearch && matchRole && matchProvider
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full  bg-red-100 text-red-800">
                    <Shield size={14} className="mr-1" />
                    Admin
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full  bg-blue-100 text-blue-800">
                <User size={14} className="mr-1" />
                User
            </span>
        )
    }

    const getProviderBadge = (provider) => {
        if (provider === 'GOOGLE') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full  bg-green-200 text-green-800">
                    Google
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full  bg-gray-100 text-gray-800">
                Local
            </span>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
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

                            <select
                                value={filterProvider}
                                onChange={(e) => setFilterProvider(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">Tất cả nhà cung cấp</option>
                                <option value="LOCAL">Local</option>
                                <option value="GOOGLE">Google</option>
                            </select>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <UserPlus size={18} />
                                Thêm user
                            </button>
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
                <div className=" rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 text-left text-gray-500 uppercase">
                                        Người dùng
                                    </th>
                                    <th className="px-6 text-left text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 text-left text-gray-500 uppercase">
                                        Vai trò
                                    </th>
                                    <th className="px-6 text-left text-gray-500 uppercase">
                                        Nhà cung cấp
                                    </th>

                                    <th className="px-6 text-center text-gray-500 uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
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
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name || user.username}
                                                    className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
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
                                            <div className="flex items-center text-gray-900">
                                                <Mail size={16} className="mr-2 text-gray-400 font-bold" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.roleName)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getProviderBadge(user.provider)}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                {showDropdown === user.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-40">
                                                        <div className="py-1">
                                                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <Eye size={16} className="mr-2" />
                                                                Xem chi tiết
                                                            </button>
                                                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <Edit size={16} className="mr-2" />
                                                                Chỉnh sửa
                                                            </button>
                                                            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                                <Trash2 size={16} className="mr-2" />
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <User size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg  text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}
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
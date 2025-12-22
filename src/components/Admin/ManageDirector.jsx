import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { generateSlug } from '../../utils/helpers'
import { useDirectors } from '../../hooks/useManage'

const ManageDirector = () => {
    const { user } = useContext(AuthContext)
    const { directors, setDirectors } = useDirectors()
    const [newDirector, setNewDirector] = useState({ name: '', slug: '' })
    const [editingDirector, setEditingDirector] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (isEditing) {
            setEditingDirector({ ...editingDirector, [name]: value, slug: name === 'name' ? generateSlug(value) : editingDirector.slug })
        } else {
            setNewDirector({ ...newDirector, [name]: value, slug: generateSlug(value) })
        }
    }

    const handleDeleteDirector = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đạo diễn này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/directors/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete Director')
                }
                setDirectors(directors.filter(director => director.id !== id))
                toast.success('Xóa đạo diễn thành công với id: ' + id)
            } catch (error) {
                console.error('Error deleting Director:', error)
                toast.error('Xóa đạo diễn thất bại')
            }
        }
    }

    const addDirector = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/directors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(newDirector)
            })
            if (!res.ok) {
                throw new Error('Failed to add Director')
            }
            setDirectors([...directors, await res.json()])
            setNewDirector({ name: '', slug: '' })
            setShowModal(false)
            toast.success('Thêm đạo diễn thành công')
        } catch (error) {
            console.error('Error adding Director:', error)
            toast.error('Thêm đạo diễn thất bại')
        }
    }

    const handleEditDirector = (director) => {
        setEditingDirector(director)
        setIsEditing(true)
        setShowModal(true)
    }

    const handleUpdateDirector = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/directors/${editingDirector.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ name: editingDirector.name, slug: editingDirector.slug })
            })
            if (!res.ok) {
                throw new Error('Failed to update director')
            }
            const updatedDirector = await res.json()
            setDirectors(directors.map(dir => dir.id === editingDirector.id ? updatedDirector : dir))
            setEditingDirector(null)
            setIsEditing(false)
            setShowModal(false)
            toast.success('Cập nhật đạo diễn thành công')
        } catch (error) {
            console.error('Error updating director:', error)
            toast.error('Cập nhật đạo diễn thất bại')
        }
    }
    const filteredDirectors = directors.filter(director => {
        const matchesSearch = director.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })


    return (
        <div className="min-h-dvh">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Đạo Diễn</h1>
            </div>
            <div className='p-10 rounded-lg'>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setIsEditing(false)
                            setNewDirector({ name: '', slug: '' })
                            setShowModal(true)
                        }}
                        className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
                    >
                        Thêm đạo diễn
                    </button>
                    <div className="relative flex-1 max-w-md mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đạo diễn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full  pl-10 pr-4 py-2 rounded-lg border border-gray-400 focus:outline-none"
                        />
                    </div>
                </div>
                <div className='overflow-auto rounded-lg shadow-sm border border-gray-400'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-400'>
                            <tr>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>ID</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên đạo diễn</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300'>
                            {filteredDirectors.length > 0 ? filteredDirectors.map((director, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-4'>{director.id}</td>
                                    <td className='px-6 py-4'>{director.name}</td>
                                    <td className='px-6 py-4'>{director.slug}</td>
                                    <td className='px-6 py-4'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditDirector(director)}
                                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDirector(director.id)}
                                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className='px-6 py-4 text-center'>Không có đạo diễn nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">

                        <div className="bg-white rounded-lg w-96">
                            <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa đạo diễn' : 'Thêm đạo diễn'}</h2>
                            </div>

                            <form className='p-6' onSubmit={isEditing ? handleUpdateDirector : addDirector}>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Tên đạo diễn</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='name'
                                        value={isEditing ? editingDirector?.name || '' : newDirector.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='slug'
                                        value={isEditing ? editingDirector?.slug || '' : newDirector.slug}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="submit" className="cursor-pointer hover:bg-green-700 px-4 py-2 bg-green-600 font-semibold text-white rounded-lg">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold bg-gray-300 rounded-lg"
                                        onClick={() => {
                                            setShowModal(false)
                                            setIsEditing(false)
                                            setEditingDirector(null)
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageDirector
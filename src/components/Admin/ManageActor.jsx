import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { generateSlug } from '../../utils/helpers'
import { useActors } from '../../hooks/useManage'
import Pagination from '../UI/Pagination'

const ManageActor = () => {
    const { user } = useContext(AuthContext)
    const { actors, setActors } = useActors()
    const [newActor, setNewActor] = useState({ name: '', slug: '' })
    const [editingActor, setEditingActor] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [pageData, setPageData] = useState([])

    const handlePageChange = (data) => {
        setPageData(data)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (isEditing) {
            setEditingActor({ ...editingActor, [name]: value, slug: name === 'name' ? generateSlug(value) : editingActor.slug })
        } else {
            setNewActor({ ...newActor, [name]: value, slug: generateSlug(value) })
        }
    }

    const handleDeleteActor = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa diễn viên này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/actors/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete actor')
                }
                setActors(actors.filter(actor => actor.id !== id))
                toast.success('Xóa diễn viên thành công với id: ' + id)
            } catch (error) {
                console.error('Error deleting actor:', error)
                toast.error('Xóa diễn viên thất bại')
            }
        }
    }

    const addActor = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/actors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(newActor)
            })
            if (!res.ok) {
                throw new Error('Failed to add actor')
            }
            setActors([...actors, await res.json()])
            setNewActor({ name: '', slug: '' })
            setShowModal(false)
            toast.success('Thêm diễn viên thành công')
        } catch (error) {
            console.error('Error adding actor:', error)
            toast.error('Thêm diễn viên thất bại')
        }
    }

    const handleEditActor = (actor) => {
        setEditingActor(actor)
        setIsEditing(true)
        setShowModal(true)
    }

    const handleUpdateActor = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/actors/${editingActor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ name: editingActor.name, slug: editingActor.slug })
            })
            if (!res.ok) {
                throw new Error('Failed to update actor')
            }
            const updatedActor = await res.json()
            setActors(actors.map(act => act.id === editingActor.id ? updatedActor : act))
            setEditingActor(null)
            setIsEditing(false)
            setShowModal(false)
            toast.success('Cập nhật diễn viên thành công')
        } catch (error) {
            console.error('Error updating actor:', error)
            toast.error('Cập nhật diễn viên thất bại')
        }
    }

    const filterActors = actors.filter(actor => {
        const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="min-h-dvh">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Diễn viên</h1>
            </div>
            <div className='p-10 rounded-lg'>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setIsEditing(false)
                            setNewActor({ name: '', slug: '' })
                            setShowModal(true)
                        }}
                        className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
                    >
                        Thêm diễn viên
                    </button>
                    <div className="relative flex-1 max-w-md mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên diễn viên..."
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
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên diễn viên</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300'>
                            {filterActors.length > 0 ? (filterActors.length <= 10 ? filterActors : pageData).map((actor, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-4'>{actor.id}</td>
                                    <td className='px-6 py-4'>{actor.name}</td>
                                    <td className='px-6 py-4'>{actor.slug}</td>
                                    <td className='px-6 py-4'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditActor(actor)}
                                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteActor(actor.id)}
                                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className='px-6 py-4 text-center'>Không có diễn viên nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {filterActors.length > 10 && (
                    <Pagination data={filterActors} onPageChange={handlePageChange} />
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">

                        <div className="bg-white rounded-lg w-96">
                            <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên'}</h2>
                            </div>

                            <form className='p-6' onSubmit={isEditing ? handleUpdateActor : addActor}>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Tên diễn viên</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='name'
                                        value={isEditing ? editingActor?.name || '' : newActor.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='slug'
                                        value={isEditing ? editingActor?.slug || '' : newActor.slug}
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
                                            setEditingActor(null)
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

export default ManageActor
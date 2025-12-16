import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { generateSlug } from '../../utils/helpers'
import { toast } from 'react-toastify'
import { Edit, Trash2 } from 'lucide-react'
import { useCountries } from '../../hooks/useManage'

const ManageCountry = () => {
    const { user } = useContext(AuthContext)
    const { countries, setCountries } = useCountries()
    const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
    const [editingCountry, setEditingCountry] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)



    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (isEditing) {
            setEditingCountry({ ...editingCountry, [name]: value, slug: name === 'name' ? generateSlug(value) : editingCountry.slug })
        } else {
            setNewCategory({ ...newCategory, [name]: value, slug: generateSlug(value) })
        }
    }

    const handleAddCountry = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/countries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(newCategory)
            })
            if (!res.ok) {
                throw new Error('Failed to add category')
            }
            setCountries([...countries, await res.json()])
            setNewCategory({ name: '', slug: '' })
            setShowModal(false)
            toast.success('Thêm quốc gia thành công')
        } catch (error) {
            console.error('Error adding country:', error)
            toast.error('Thêm quốc gia thất bại')
        }
    }

    const handleEditCountry = (country) => {
        setEditingCountry(country)
        setIsEditing(true)
        setShowModal(true)
    }

    const handleUpdateCountry = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/admin/countries/${editingCountry.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ name: editingCountry.name, slug: editingCountry.slug })
            })
            if (!res.ok) {
                throw new Error('Failed to update country')
            }
            const updatedCountry = await res.json()
            setCountries(countries.map(c => c.id === editingCountry.id ? updatedCountry : c))
            setEditingCountry(null)
            setIsEditing(false)
            setShowModal(false)
            toast.success('Cập nhật quốc gia thành công')
        } catch (error) {
            console.error('Error updating country:', error)
            toast.error('Cập nhật quốc gia thất bại')
        }
    }
    const handleDeleteCountry = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa quốc gia này không?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/countries/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                })
                if (!res.ok) {
                    throw new Error('Failed to delete country')
                }
                setCountries(countries.filter(country => country.id !== id))
                toast.success('Xóa quốc gia thành công với id: ' + id)
            } catch (error) {
                console.error('Error deleting country:', error)
                toast.error('Xóa quốc gia thất bại')
            }
        }
    }


    return (
        <div className='min-h-dvh'>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Quốc Gia</h1>
            </div>

            <div className='p-10 rounded-lg'>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        setNewCategory({ name: '', slug: '' })
                        setShowModal(true)
                    }}
                    className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
                >
                    Thêm quốc gia
                </button>
                <div className='overflow-auto rounded-lg shadow-sm border border-gray-400'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-400'>
                            <tr>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>ID</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên Quốc Gia</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300'>
                            {countries.length > 0 ? countries.map((country, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-4'>{country.id}</td>
                                    <td className='px-6 py-4'>{country.name}</td>
                                    <td className='px-6 py-4'>{country.slug}</td>
                                    <td className='px-6 py-4'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditCountry(country)}
                                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCountry(country.id)}
                                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className='px-6 py-4 text-center'>Không có quốc gia nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg w-96">
                            <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa quốc gia' : 'Thêm quốc gia'}</h2>
                            </div>

                            <form className='p-6' onSubmit={isEditing ? handleUpdateCountry : handleAddCountry}>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Tên quốc gia</label>
                                    <input
                                        type="text"
                                        name='name'
                                        value={isEditing ? editingCountry?.name || '' : newCategory.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        name='slug'
                                        value={isEditing ? editingCountry?.slug || '' : newCategory.slug}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type='submit'
                                        className="cursor-pointer hover:bg-green-700 px-4 py-2 bg-green-600 font-semibold text-white rounded-lg">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold bg-gray-300 rounded-lg"
                                        onClick={() => {
                                            setShowModal(false)
                                            setIsEditing(false)
                                            setEditingCountry(null)
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

export default ManageCountry
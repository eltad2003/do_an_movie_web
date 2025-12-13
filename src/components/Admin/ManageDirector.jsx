import { Edit, Trash2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { generateSlug } from '../../utils/helpers'
import { useDirectors } from '../../hooks/useManage'

const ManageDirector = () => {
    const { user } = useContext(AuthContext)
    const { directors, setDirectors } = useDirectors()
    const [newDirector, setNewDirector] = useState({ name: '', slug: '' })
    const [showModal, setShowModal] = useState(false)


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewDirector({ ...newDirector, [name]: value, slug: generateSlug(value) })
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



    return (
        <div className="min-h-dvh">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Quản lý Đạo Diễn</h1>
            </div>
            <div className='p-10 rounded-lg'>
                <button
                    onClick={() => setShowModal(!showModal)}
                    className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
                >
                    Thêm đạo diễn
                </button>
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
                            {directors.length > 0 ? directors.map((director, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-4'>{director.id}</td>
                                    <td className='px-6 py-4'>{director.name}</td>
                                    <td className='px-6 py-4'>{director.slug}</td>
                                    <td className='px-6 py-4'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
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
                                <h2 className="text-xl font-semibold mb-4">Thêm đạo diễn</h2>
                            </div>

                            <form className='p-6' onSubmit={addDirector}>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Tên đạo diễn</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='name'
                                        value={newDirector.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        name='slug'
                                        value={newDirector.slug}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button className="cursor-pointer hover:bg-green-700 px-4 py-2 bg-green-600 font-semibold text-white rounded-lg">Thêm</button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold bg-gray-300 rounded-lg"
                                        onClick={() => setShowModal(false)}
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
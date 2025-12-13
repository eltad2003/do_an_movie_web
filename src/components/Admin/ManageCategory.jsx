import { Edit, Trash2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { generateSlug } from '../../utils/helpers'
import { AuthContext } from '../../context/AuthContext'
import { useCategories } from '../../hooks/useManage'

const ManageCategory = () => {
  const { user } = useContext(AuthContext)
  const { categories, setCategories } = useCategories()
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  // const [editingCategory, setEditingCategory] = useState()
  const [showModal, setShowModal] = useState(false)


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCategory({ ...newCategory, [name]: value, slug: generateSlug(value) })
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BE}/admin/categories`, {
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
      setCategories([...categories, await res.json()])
      setNewCategory({ name: '', slug: '' })
      setShowModal(false)
      toast.success('Thêm thể loại thành công')
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Thêm thể loại thất bại')
    }
  }
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này không?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BE}/admin/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          }
        })
        if (!res.ok) {
          throw new Error('Failed to delete category')
        }
        setCategories(categories.filter(category => category.id !== id))
        toast.success('Xóa thể loại thành công với id: ' + id)
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Xóa thể loại thất bại')
      }
    }
  }



  return (
    <div className='min-h-dvh'>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
        <h1 className="text-3xl font-bold mb-2">Quản lý Thể Loại</h1>
      </div>

      <div className='p-10 rounded-lg'>
        <button
          onClick={() => setShowModal(!showModal)}
          className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
        >
          Thêm thể loại
        </button>
        <div className='overflow-auto rounded-lg shadow-sm border border-gray-400'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-400'>
              <tr>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>ID</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên Thể Loại</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-300'>
              {categories.length > 0 ? categories.map((category, index) => (
                <tr key={index}>
                  <td className='px-6 py-4'>{category.id}</td>
                  <td className='px-6 py-4'>{category.name}</td>
                  <td className='px-6 py-4'>{category.slug}</td>
                  <td className='px-6 py-4'>
                    <div className="flex items-center justify-center gap-2">
                      <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className='px-6 py-4 text-center'>Không có thể loại nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96">
              <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                <h2 className="text-xl font-semibold mb-4">Thêm thể loại</h2>
              </div>

              <form className='p-6' onSubmit={handleAddCategory}>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">Tên Thể Loại</label>
                  <input
                    type="text"
                    name='name'
                    value={newCategory.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    name='slug'
                    value={newCategory.slug}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type='submit'
                    className="cursor-pointer hover:bg-green-700 px-4 py-2 bg-green-600 font-semibold text-white rounded-lg">Thêm</button>
                  <button
                    type="button"
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

export default ManageCategory
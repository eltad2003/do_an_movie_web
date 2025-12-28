import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { generateSlug } from '../../utils/helpers'
import { AuthContext } from '../../context/AuthContext'
import { useCategories } from '../../hooks/useManage'
import Pagination from '../UI/Pagination'

const ManageCategory = () => {
  const { user } = useContext(AuthContext)
  const { categories, setCategories } = useCategories()
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageData, setPageData] = useState([])

  const handlePageChange = (currentData) => {
    setPageData(currentData)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (isEditing) {
      setEditingCategory({ ...editingCategory, [name]: value, slug: name === 'name' ? generateSlug(value) : editingCategory.slug })
    } else {
      setNewCategory({ ...newCategory, [name]: value, slug: generateSlug(value) })
    }
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

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BE}/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({ name: editingCategory.name, slug: editingCategory.slug })
      })
      if (!res.ok) {
        throw new Error('Failed to update category')
      }
      const updatedCategory = await res.json()
      setCategories(categories.map(cat => cat.id === editingCategory.id ? updatedCategory : cat))
      setEditingCategory(null)
      setIsEditing(false)
      setShowModal(false)
      toast.success('Cập nhật thể loại thành công')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Cập nhật thể loại thất bại')
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

  const filterCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })



  return (
    <div className='min-h-dvh'>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
        <h1 className="text-3xl font-bold mb-2">Quản lý Thể Loại</h1>
      </div>

      <div className='p-10 rounded-lg'>
        <div className="flex gap-3 ">
          <button
            onClick={() => {
              setIsEditing(false)
              setNewCategory({ name: '', slug: '' })
              setShowModal(true)
            }}
            className='px-4 py-2 bg-green-600 font-semibold rounded-lg text-white mb-6 cursor-pointer'
          >
            Thêm thể loại
          </button>
          <div className="relative flex-1 max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm thể loại..."
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
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên Thể Loại</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-300'>
              {filterCategories.length > 0 ? (filterCategories.length <= 10 ? filterCategories : pageData).map((category, index) => (
                <tr key={index}>
                  <td className='px-6 py-4'>{category.id}</td>
                  <td className='px-6 py-4'>{category.name}</td>
                  <td className='px-6 py-4'>{category.slug}</td>
                  <td className='px-6 py-4'>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
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
        {filterCategories.length > 10 && (
          <Pagination data={filterCategories} onPageChange={handlePageChange} />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96">
              <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'}</h2>
              </div>

              <form className='p-6' onSubmit={isEditing ? handleUpdateCategory : handleAddCategory}>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">Tên Thể Loại</label>
                  <input
                    type="text"
                    name='name'
                    value={isEditing ? editingCategory?.name || '' : newCategory.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    name='slug'
                    value={isEditing ? editingCategory?.slug || '' : newCategory.slug}
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
                      setEditingCategory(null)
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

export default ManageCategory
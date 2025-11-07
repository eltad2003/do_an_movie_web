import { Edit, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ManageCategory = () => {

  const [showModal, setShowModal] = useState(false)
  const handleDeleteCategory = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này không?')) {
      try {
        console.log(id)
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
        <div className='overflow-auto rounded-lg shadow-sm border border-gray-200'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>STT</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Tên Thể Loại</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-left'>Slug</th>
                <th className='px-6 py-3 text-xs font-semibold uppercase text-center'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>

              <tr>
                <td className='px-6 py-4'>1</td>
                <td className='px-6 py-4'>Hành động</td>
                <td className='px-6 py-4'>slug-1</td>
                <td className='px-6 py-4'>
                  <div className="flex items-center justify-center gap-2">
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(1)}
                      className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <td className='px-6 py-4'>2</td>
                <td className='px-6 py-4'>Kinh dị</td>
                <td className='px-6 py-4'>kinh-di</td>
                <td className='px-6 py-4'>
                  <div className="flex items-center justify-center gap-2">
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(2)}
                      className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-dark-100/50 flex items-center justify-center">

            <div className="bg-white rounded-lg w-96">
              <div className='bg-green-600 font-semibold text-white text-center rounded-t-lg'>
                <h2 className="text-xl font-semibold mb-4">Thêm thể loại</h2>
              </div>

              <form className='p-6'>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">URL video</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="cursor-pointer hover:bg-green-700 px-4 py-2 bg-green-600 font-semibold text-white rounded-lg">Thêm</button>
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
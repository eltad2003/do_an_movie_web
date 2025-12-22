import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Pagination = ({ data, onPageChange }) => {
    const [itemPerPage, setItemPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(data.length / itemPerPage)

    const handleItemPerPageChange = (e) => {
        setItemPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Tính toán dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemPerPage
    const endIndex = startIndex + itemPerPage
    const currentData = data.slice(startIndex, endIndex)


    useEffect(() => {
        if (onPageChange) {
            onPageChange(currentData, currentPage)
        }
    }, [currentPage, itemPerPage, data.length])

    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Hiển thị{' '}
                <select
                    name="page"
                    className='px-1.5 py-0.5 border border-gray-300 rounded'
                    value={itemPerPage}
                    onChange={handleItemPerPageChange}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                trên tổng {' '}
                <span className="font-medium">{data.length}</span>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={15} />
                </button>

                <button className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md">
                    {currentPage} / {totalPages || 1}
                </button>

                <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    )
}

export default Pagination
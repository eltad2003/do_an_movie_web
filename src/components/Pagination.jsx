import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    return (
        <section className="pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className='w-4 h-4' />
            </button>
            <span className='text-light-100'>{currentPage} / {totalPages}</span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className='w-4 h-4' />
            </button>
        </section>
    )
}

export default Pagination

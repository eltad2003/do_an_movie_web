import { ChevronDown } from 'lucide-react'
import React from 'react'

const More = ({ moviePerPage, setMoviePerPage }) => {
    return (
        <div className='mx-auto text-center mt-5 text-sm'>
            <button
                className='btn inline-flex items-center gap-1'
                onClick={() => setMoviePerPage(moviePerPage + 10)}
            >
                <ChevronDown size={20} /> Xem thêm
            </button>
        </div>
    )
}

export default More
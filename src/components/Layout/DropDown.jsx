import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const DropDown = ({ text, data, isDropdownOpen, onToggle, slug }) => {
    const closeDropdown = () => {
        onToggle()
    }

    return (
        <div className='relative'>
            <button
                onClick={onToggle}
                className='flex items-center gap-1 text-white hover:text-light-100 transition-colors cursor-pointer '
            >
                {text}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <div className='absolute p-2 top-full left-0 right-0 z-50 bg-primary backdrop-blur-md rounded-lg mt-3 grid grid-cols-3 lg:grid-cols-4 md:w-auto lg:w-[600px] overflow-y-auto '>
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <Link
                                key={item.slug}
                                to={`/${slug}/${item.slug}`}
                                className='block p-2 text-white hover:text-light-100 hover:bg-gray-700/50 transition-colors rounded'
                                onClick={closeDropdown}
                            >
                                {item.name}
                            </Link>
                        ))
                    ) : (
                        <div className='px-4 py-2 text-gray-400'>
                            Đang tải...
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default DropDown
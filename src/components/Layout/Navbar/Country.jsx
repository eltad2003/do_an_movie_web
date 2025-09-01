import { ChevronDown } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../UI/Loading'

const Country = ({ countries, isDropdownOpen, setIsDropdownOpen }) => {
    return (
        <div className='relative'>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-2 text-white hover:text-light-100 transition-colors cursor-pointer'
            >
                Quốc gia
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} `} />
            </button>
            {isDropdownOpen && (
                <div className='absolute top-full bg-dark-100/95 rounded-lg left-0 z-50 grid grid-cols-2 md:grid-cols-4 w-200 mt-3' >
                    {countries.length > 0 ? (countries.map((country) => (
                        <Link
                            key={country._id}
                            to={`/quoc-gia/${country.slug}`}
                            className='px-4 py-2 text-white hover:text-light-100 transition-colors'
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            {country.name}
                        </Link>
                    ))
                    ) : (
                        <Loading />
                    )}
                </div>
            )}
        </div>
    )
}

export default Country

import React, { useState } from 'react'
import { useNav } from '../../hooks/useNav'
import { ArrowRightIcon, FilterIcon, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const FilterMovie = () => {
    const isCountryPage = window.location.pathname.includes('/quoc-gia/')
    const isCategoryPage = window.location.pathname.includes('/the-loai/')
    const isSearchPage = window.location.pathname.includes('/tim-kiem')
    //chi danh` cho trang tim kiem
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    
    const { categories, countries } = useNav()
    const [isOpen, setIsOpen] = useState(false)

    const filterOptions = {
        years: Array.from({ length: 16 }, (_, i) => {
            const year = 2025 - i
            return { value: year.toString(), label: year.toString() }
        }),
        types: [
            { value: 'single', label: 'Phim lẻ' },
            { value: 'series', label: 'Phim bộ' },
            { value: 'hoathinh', label: 'Hoạt hình' },

        ]
    }
    return (
        <div className="mb-4 sticky top-21 z-50 ">
            <button className="btn rounded inline-flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
                <FilterIcon className="w-5 h-5" /> Bộ lọc phim
            </button>
            {isOpen && (
                <form className="bg-dark-100/80 p-4 mb-6 absolute top-full mt-1 backdrop-blur-sm min-h-screen w-full z-50">
                    {/* Filter Content */}
                    <div className='mb-6'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {isSearchPage && (
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Từ khóa</label>
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={query}
                                        placeholder="Nhập từ khóa..."
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none"
                                    />
                                </div>
                            )}
                            {/* Thể loại */}
                            <div className={isCategoryPage ? 'hidden' : ''}>
                                <label className="block text-white/70 text-sm mb-2">Thể loại</label>
                                <select
                                    name='category'
                                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none"
                                >
                                    <option value="">Tất cả thể loại</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Quốc gia */}
                            <div className={isCountryPage ? 'hidden' : ''}>
                                <label className="block text-white/70 text-sm mb-2">Quốc gia</label>
                                <select
                                    name='country'
                                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none"
                                >
                                    <option value="">Tất cả quốc gia</option>
                                    {countries.map(country => (
                                        <option key={country._id} value={country.slug}>{country.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Loại phim */}
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Loại phim</label>
                                <select
                                    name='type'
                                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none"
                                >
                                    <option value="">Tất cả loại</option>
                                    {filterOptions.types.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Năm */}
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Năm</label>
                                <select
                                    name="year"
                                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none"
                                >
                                    <option value="" >Tất cả năm</option>
                                    {filterOptions.years.map(year => (
                                        <option key={year.value} value={year.value}>{year.label}</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='btn inline-flex items-center' type='submit'>Lọc kết quả <ArrowRightIcon /></button>
                        <button
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm"
                        >
                            <X className="w-4 h-4" />
                            Xóa bộ lọc
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default FilterMovie

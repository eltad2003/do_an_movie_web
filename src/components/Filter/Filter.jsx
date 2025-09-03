import React, { useState } from 'react'
import { useNav } from '../../hooks/useNav'
import { ArrowRightIcon, FilterIcon, X } from 'lucide-react'

const Filter = () => {
    const { categories, countries } = useNav()
    const [isOpen, setIsOpen] = useState(false)
    const filterOptions = {
        years: [
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
            { value: '2021', label: '2021' },
            { value: '2020', label: '2020' },
            { value: '2019', label: '2019' },
            { value: '2018', label: '2018' },
            { value: '2017', label: '2017' }
        ],
        types: [
            { value: 'phim-le', label: 'Phim lẻ' },
            { value: 'phim-bo', label: 'Phim bộ' },
            { value: 'hoat-hinh', label: 'Hoạt hình' },
            { value: 'tv-show', label: 'TV Show' }
        ],
        sortLangs: [
            { value: 'vietsub ', label: 'Vietsub' },
            { value: 'thuyet-minh', label: 'Thuyết Minh' },
            { value: 'long-tieng', label: 'Lồng Tiếng' },
        ],
        sortFields: [
            { value: 'modified.time', label: 'Thời gian cập nhật' },
            { value: '_id', label: 'ID phim' },
            { value: 'year', label: 'Năm sản xuất' },
        ],
        sortTypes: [
            { value: 'asc', label: 'Tăng dần' },
            { value: 'desc', label: 'Giảm dần' }
        ]
    }
    return (
        <>
            {/* Filter Header  */}
            <div className="mb-4 relative">
                <button className="  btn rounded inline-flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
                    <FilterIcon className="w-5 h-5" /> Bộ lọc phim
                </button>
                {isOpen && (
                    <form className="bg-dark-100/80 rounded-xl p-4 mb-6 absolute top-full mt-3 backdrop-blur-sm min-h-screen w-full">
                        {/* Filter Content */}
                        <div className='mb-6'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">

                                {/* Thể loại */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Thể loại</label>

                                    <select
                                        name='category'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        <option value="">Tất cả thể loại</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.slug}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quốc gia */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Quốc gia</label>
                                    <select
                                        name='country'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
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
                                        name='type_list'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        <option value="">Tất cả loại</option>
                                        {filterOptions.types.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sắp xếp theo trường */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Sắp xếp theo</label>
                                    <select
                                        name='sort_field'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        {filterOptions.sortFields.map(sort => (
                                            <option key={sort.value} value={sort.value}>{sort.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Thứ tự */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Thứ tự</label>
                                    <select
                                        name='sort_type'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        {filterOptions.sortTypes.map(sort => (
                                            <option key={sort.value} value={sort.value}>{sort.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* translate*/}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Phụ đề</label>
                                    <select
                                        name='sort_lang'
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        {filterOptions.sortLangs.map(sort => (
                                            <option key={sort.value} value={sort.value}>{sort.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Năm */}
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Năm</label>
                                    {/* <select

                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                    >
                                        <option value="">Tất cả năm</option>
                                        {filterOptions.years.map(year => (
                                            <option key={year.value} value={year.value}>{year.label}</option>
                                        ))}
                                    </select> */}
                                    <input
                                        placeholder='Nhập năm...'
                                        name='year'
                                        type="text"
                                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30" />
                                </div>
                            </div>

                        </div>
                        <div className='flex items-center gap-3'>
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

        </>

    )
}

export default Filter

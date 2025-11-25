import React, { useContext, useState } from 'react'
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Save,
    Film,
    Image as ImageIcon,
    Link,
    Calendar,
    Clock,
    Globe,
    Users,
    Tag,
    ChartBarStacked
} from 'lucide-react'
import { generateSlug } from '../../../utils/helpers'
import { useActors, useCategories, useCountries, useDirectors } from '../../../hooks/useManage'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../context/AuthContext'

const AddMovie = ({ onBack }) => {
    const { user } = useContext(AuthContext)
    const { categories } = useCategories()
    const { countries } = useCountries()
    const { actors } = useActors()
    const { directors } = useDirectors()

    const [movieData, setMovieData] = useState({
        name: '',
        originName: '',
        slug: '',
        description: '',
        trailerUrl: '',
        duration: '',
        actors: [],
        directors: [],
        categories: [],
        countries: [],
        year: new Date().getFullYear(),
        status: 'RELEASED',
        type: 'single',
        subtitle: false,
        views: 0
    })

    const [posterFile, setPosterFile] = useState(null)
    const [thumbFile, setThumbFile] = useState(null)
    const [posterPreview, setPosterPreview] = useState('')
    const [thumbPreview, setThumbPreview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Selected items
    const [selectedActors, setSelectedActors] = useState([])
    const [selectedDirectors, setSelectedDirectors] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'name') {
            setMovieData(prev => ({
                ...prev,
                [name]: value,
                slug: generateSlug(value)
            }))
        } else if (type === 'checkbox') {
            setMovieData(prev => ({
                ...prev,
                [name]: checked
            }))
        } else {
            setMovieData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handlePosterChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPosterFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPosterPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleThumbChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Actor handlers
    const addActor = (actorId) => {
        const actor = actors.find(a => a.id === actorId)
        if (actor && !selectedActors.find(a => a.id === actorId)) {
            setSelectedActors(prev => [...prev, actor])
        }
    }
    const removeActor = (actorId) => {
        setSelectedActors(prev => prev.filter(a => a.id !== actorId))
    }

    // Director handlers
    const addDirector = (directorId) => {
        const director = directors.find(d => d.id === directorId)
        if (director && !selectedDirectors.find(d => d.id === directorId)) {
            setSelectedDirectors(prev => [...prev, director])
        }
    }
    const removeDirector = (directorId) => {
        setSelectedDirectors(prev => prev.filter(d => d.id !== directorId))
    }

    // Category handlers
    const addCategory = (categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        if (category && !selectedCategories.find(c => c.id === categoryId)) {
            setSelectedCategories(prev => [...prev, category])
        }
    }
    const removeCategory = (categoryId) => {
        setSelectedCategories(prev => prev.filter(c => c.id !== categoryId))
    }

    // Country handlers
    const addCountry = (countryId) => {
        const country = countries.find(c => c.id === countryId)
        if (country && !selectedCountries.find(c => c.id === countryId)) {
            setSelectedCountries(prev => [...prev, country])
        }
    }
    const removeCountry = (countryId) => {
        setSelectedCountries(prev => prev.filter(c => c.id !== countryId))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (!posterFile || !thumbFile) {
                toast.error('Vui lòng tải lên poster và thumbnail!')
                setIsSubmitting(false)
                return
            }

            const formData = new FormData()
            // Add files
            formData.append('posterFile', posterFile)
            formData.append('thumbFile', thumbFile)

            // Prepare movie data
            const moviePayload = {
                ...movieData,
                actors: selectedActors.map(a => ({ id: a.id, name: a.name })),
                directors: selectedDirectors.map(d => ({ id: d.id, name: d.name })),
                categories: selectedCategories.map(c => ({ id: c.id, name: c.name })),
                countries: selectedCountries.map(c => ({ id: c.id, name: c.name }))
            }

            // Add movie as JSON string
            formData.append('movie', new Blob([JSON.stringify(moviePayload)], {
                type: 'application/json'
            }))

            const res = await fetch(`${import.meta.env.VITE_BE}/admin/movies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: formData
            })

            if (res.ok) {
                toast.success('Thêm phim thành công!')
                onBack()
                window.location.reload()
            } else {
                const error = await res.text()
                toast.error(`Thêm phim thất bại: ${error}`)
            }
        } catch (error) {
            console.error('Error adding movie:', error)
            toast.error('Đã có lỗi xảy ra!')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="mr-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Thêm phim mới</h1>
                        <p className="text-purple-100">Điền thông tin chi tiết về bộ phim</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Images */}
                        <div className="space-y-6">
                            {/* Poster Upload */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <ImageIcon className="mr-2" size={20} />
                                    Poster phim *
                                </h3>

                                <div className="space-y-4">
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('poster-upload').click()}
                                    >
                                        {posterPreview ? (
                                            <img
                                                src={posterPreview}
                                                alt="Poster preview"
                                                className="w-full h-64 object-cover rounded-lg mb-2"
                                            />
                                        ) : (
                                            <div className="py-8">
                                                <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                                                <p className="text-gray-600">Click để tải lên poster</p>
                                                <p className="text-sm text-gray-400">JPG, PNG (tối đa 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="poster-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePosterChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <ImageIcon className="mr-2" size={20} />
                                    Thumbnail *
                                </h3>

                                <div className="space-y-4">
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('thumb-upload').click()}
                                    >
                                        {thumbPreview ? (
                                            <img
                                                src={thumbPreview}
                                                alt="Thumbnail preview"
                                                className="w-full h-32 object-cover rounded-lg mb-2"
                                            />
                                        ) : (
                                            <div className="py-4">
                                                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                                <p className="text-sm text-gray-600">Click để tải lên thumbnail</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="thumb-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Movie Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Film className="mr-2" size={20} />
                                    Thông tin cơ bản
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên phim (Tiếng Việt) *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={movieData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="VD: Biệt Đội Siêu Anh Hùng 4: Hồi Kết"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên gốc (Tiếng Anh)
                                        </label>
                                        <input
                                            type="text"
                                            name="originName"
                                            value={movieData.originName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="VD: Avengers: Endgame"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Slug (URL thân thiện)
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={movieData.slug}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                            placeholder="Tự động tạo từ tên phim"
                                            readOnly
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Mô tả phim
                                        </label>
                                        <textarea
                                            name="description"
                                            value={movieData.description}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="Nhập mô tả chi tiết về nội dung phim..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="inline mr-1" size={16} />
                                            Năm sản xuất *
                                        </label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={movieData.year}
                                            onChange={handleInputChange}
                                            min="1900"
                                            max="2030"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="inline mr-1" size={16} />
                                            Thời lượng
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={movieData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="VD: 192 minutes"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Film className="inline mr-1" size={16} />
                                            Loại phim
                                        </label>
                                        <select
                                            name="type"
                                            value={movieData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="single">Phim lẻ</option>
                                            <option value="series">Phim bộ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Tag className="inline mr-1" size={16} />
                                            Trạng thái
                                        </label>
                                        <select
                                            name="status"
                                            value={movieData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="RELEASED">Đã phát hành</option>
                                            <option value="COMING_SOON">Sắp chiếu</option>
                                            <option value="UPDATING">Đang cập nhật</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="subtitle"
                                                checked={movieData.subtitle}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Có phụ đề</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Directors */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Users className="mr-2" size={20} />
                                    Đạo diễn
                                </h3>

                                <div className="space-y-4">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            addDirector(e.target.value)
                                            e.target.value = ''
                                        }}
                                        value=""
                                    >
                                        <option value="">Chọn đạo diễn</option>
                                        {directors?.map((director) => (
                                            <option key={director.id} value={director.id}>
                                                {director.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedDirectors.map((director) => (
                                            <span
                                                key={director.id}
                                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                            >
                                                {director.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeDirector(director.id)}
                                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actors */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Users className="mr-2" size={20} />
                                    Diễn viên
                                </h3>

                                <div className="space-y-4">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            addActor(e.target.value)
                                            e.target.value = ''
                                        }}
                                        value=""
                                    >
                                        <option value="">Chọn diễn viên</option>
                                        {actors?.map((actor) => (
                                            <option key={actor.id} value={actor.id}>
                                                {actor.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedActors.map((actor) => (
                                            <span
                                                key={actor.id}
                                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                            >
                                                {actor.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeActor(actor.id)}
                                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <ChartBarStacked className="mr-2" size={20} />
                                    Thể loại
                                </h3>

                                <div className="space-y-4">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            addCategory(e.target.value)
                                            e.target.value = ''
                                        }}
                                        value=""
                                    >
                                        <option value="">Chọn thể loại</option>
                                        {categories?.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                            >
                                                {category.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(category.id)}
                                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Countries */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Globe className="mr-2" size={20} />
                                    Quốc gia
                                </h3>

                                <div className="space-y-4">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            addCountry(e.target.value)
                                            e.target.value = ''
                                        }}
                                        value=""
                                    >
                                        <option value="">Chọn quốc gia</option>
                                        {countries?.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedCountries.map((country) => (
                                            <span
                                                key={country.id}
                                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {country.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCountry(country.id)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Trailer */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Link className="mr-2" size={20} />
                                    Trailer
                                </h3>

                                <input
                                    type="url"
                                    name="trailerUrl"
                                    value={movieData.trailerUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />

                                {movieData.trailerUrl && (
                                    <div className='w-full aspect-video mt-4'>
                                        <iframe
                                            src={movieData.trailerUrl.replace('watch?v=', 'embed/')}
                                            className='w-full h-full rounded-lg'
                                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                            allowFullScreen
                                            title="Movie Trailer"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="mt-8 flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Lưu phim
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddMovie
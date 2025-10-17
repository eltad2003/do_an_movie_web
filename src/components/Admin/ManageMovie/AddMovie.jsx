import React, { useState } from 'react'
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Save,
    Eye,
    Film,
    Image as ImageIcon,
    Link,
    Calendar,
    Clock,
    Star,
    Globe,
    Users,
    FileText,
    Tag
} from 'lucide-react'

const AddMovie = ({ onBack }) => {
    const [movieData, setMovieData] = useState({
        name: '',
        origin_name: '',
        slug: '',
        description: '',
        poster_url: '',
        thumb_url: '',
        trailer_url: '',
        duration: '',
        actors: [],
        language: '',
        subtitle: false,
        year: new Date().getFullYear(),
        rating: 0,
        status: 'updating'
    })

    const [newActor, setNewActor] = useState('')
    const [posterPreview, setPosterPreview] = useState('')
    const [thumbPreview, setThumbPreview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Auto generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'name') {
            setMovieData(prev => ({
                ...prev,
                [name]: value,
                slug: generateSlug(value)
            }))
        } else {
            setMovieData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }))
        }
    }

    const handleImageUpload = (type, file) => {
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const imageUrl = e.target.result
                if (type === 'poster') {
                    setPosterPreview(imageUrl)
                    setMovieData(prev => ({ ...prev, poster_url: imageUrl }))
                } else {
                    setThumbPreview(imageUrl)
                    setMovieData(prev => ({ ...prev, thumb_url: imageUrl }))
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const addActor = () => {
        if (newActor.trim() && !movieData.actors.includes(newActor.trim())) {
            setMovieData(prev => ({
                ...prev,
                actors: [...prev.actors, newActor.trim()]
            }))
            setNewActor('')
        }
    }

    const removeActor = (index) => {
        setMovieData(prev => ({
            ...prev,
            actors: prev.actors.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // API call to save movie
            console.log('Saving movie:', movieData)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            alert('Phim đã được thêm thành công!')
            onBack()
        } catch (error) {
            console.log(error);

            alert('Có lỗi xảy ra khi thêm phim!')
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
                                    Poster phim
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
                                        onChange={(e) => handleImageUpload('poster', e.target.files[0])}
                                    />

                                    <input
                                        type="url"
                                        placeholder="Hoặc nhập URL poster"
                                        value={movieData.poster_url}
                                        onChange={(e) => {
                                            setMovieData(prev => ({ ...prev, poster_url: e.target.value }))
                                            setPosterPreview(e.target.value)
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <ImageIcon className="mr-2" size={20} />
                                    Thumbnail
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
                                        onChange={(e) => handleImageUpload('thumb', e.target.files[0])}
                                    />

                                    <input
                                        type="url"
                                        placeholder="Hoặc nhập URL thumbnail"
                                        value={movieData.thumb_url}
                                        onChange={(e) => {
                                            setMovieData(prev => ({ ...prev, thumb_url: e.target.value }))
                                            setThumbPreview(e.target.value)
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                            name="origin_name"
                                            value={movieData.origin_name}
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
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                            placeholder="Tu dong tao tu ten phim"
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
                                            placeholder="VD: 2 tiếng 36 phút"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Globe className="inline mr-1" size={16} />
                                            Ngôn ngữ
                                        </label>
                                        <select
                                            name="language"
                                            value={movieData.language}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Chọn ngôn ngữ</option>
                                            <option value="Vietnamese">Tiếng Việt</option>
                                            <option value="English">Tiếng Anh</option>
                                            <option value="Korean">Tiếng Hàn</option>
                                            <option value="Japanese">Tiếng Nhật</option>
                                            <option value="Chinese">Tiếng Trung</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Star className="inline mr-1" size={16} />
                                            Đánh giá (0-10)
                                        </label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={movieData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
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
                                            <option value="updating">Đang cập nhật</option>
                                            <option value="coming_soon">Sắp chiếu</option>
                                            <option value="released">Đã phát hành</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                name="subtitle"
                                                checked={movieData.subtitle}
                                                onChange={handleInputChange}
                                                className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Có phụ đề</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FileText className="mr-2" size={20} />
                                    Mô tả phim
                                </h3>

                                <textarea
                                    name="description"
                                    value={movieData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Nhập mô tả chi tiết về nội dung phim..."
                                />
                            </div>

                            {/* Actors */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Users className="mr-2" size={20} />
                                    Diễn viên
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newActor}
                                            onChange={(e) => setNewActor(e.target.value)}
                                            placeholder="Nhập tên diễn viên"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActor())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addActor}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {movieData.actors.map((actor, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                            >
                                                {actor}
                                                <button
                                                    type="button"
                                                    onClick={() => removeActor(index)}
                                                    className="ml-2 text-purple-600 hover:text-purple-800"
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
                                    name="trailer_url"
                                    value={movieData.trailer_url}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
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
                            type="button"
                            className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                            <Eye size={18} />
                            Xem trước
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
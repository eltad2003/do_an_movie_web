import { ArrowLeft, Calendar, ChartBarStacked, Clock, FileText, Film, Globe, ImageIcon, Plus, Save, Star, Tag, Upload, Users, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MangeEpisodes from './MangeEpisodes'
import ManageReview from './ManageReview'
import Loading from '../../UI/Loading'
import { AuthContext } from '../../../context/AuthContext'
import { generateSlug } from '../../../utils/helpers'
import { useActors, useCategories, useCountries, useDirectors } from '../../../hooks/useManage'
import { toast } from 'react-toastify'

const ManageDetailMovie = () => {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const [typeHeader, setTypeHeader] = useState('info') // 'info', 'episodes', 'reviews'
    const [movie, setMovie] = useState()
    const [editMovie, setEditMovie] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [posterFile, setPosterFile] = useState(null)
    const [thumbFile, setThumbFile] = useState(null)
    const [posterPreview, setPosterPreview] = useState('')
    const [thumbPreview, setThumbPreview] = useState('')

    const { categories } = useCategories()
    const { countries } = useCountries()
    const { actors } = useActors()
    const { directors } = useDirectors()
    const [selectedActors, setSelectedActors] = useState([])
    const [selectedDirectors, setSelectedDirectors] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'name') {
            setEditMovie(prev => ({
                ...prev,
                [name]: value,
                slug: generateSlug(value)
            }))
        } else if (type === 'checkbox') {
            setEditMovie(prev => ({
                ...prev,
                [name]: checked
            }))
        } else {
            setEditMovie(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handlePosterFile = (e) => {
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

    const handleThumbFile = (e) => {
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

            const formData = new FormData()

            formData.append('posterFile', posterFile)
            formData.append('thumbFile', thumbFile)
            formData.append('movie', new Blob(
                [JSON.stringify({
                    ...editMovie,
                    actors: selectedActors,
                    directors: selectedDirectors,
                    categories: selectedCategories,
                    countries: selectedCountries
                })], { type: 'application/json' }
            ))

            const res = await fetch(`${import.meta.env.VITE_BE}/admin/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: formData
            })
            if (res.ok) {

                toast.success('Cập nhật phim thành công!')
                console.log(formData.getAll('movie'));
            } else {
                const errorData = await res.text()
                toast.error(errorData || 'Cập nhật phim thất bại. Vui lòng thử lại.')
            }
        } catch (error) {
            console.error('Error updating movie:', error)
            toast.error('Cập nhật phim thất bại. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }


    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/admin/movies/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    },
                })
                const data = await res.json()
                setMovie(data)
                setEditMovie({ ...data })
                setSelectedActors(data.actors || [])
                setSelectedDirectors(data.directors || [])
                setSelectedCategories(data.categories || [])
                setSelectedCountries(data.countries || [])
                console.log(data);

            } catch (error) {
                console.error('Error fetching movie details:', error)
            }
        }
        fetchMovieDetail()
    }, [id, user])

    if (!movie) {
        return <Loading />
    }

    return (
        <div className='bg-white min-h-screen'>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
                <div className="flex items-center">
                    <Link
                        to="/admin/quan-ly-phim"
                        className="mr-3 rounded-lg hover:scale-130 duration-200"
                    >
                        <ArrowLeft size={25} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Phim {id}</h1>

                    </div>
                </div>
            </div>

            <div className=' rounded-lg p-6 mx-6 mt-6 '>
                {/* Tab Navigation */}
                <div className='mb-10 flex gap-4'>
                    <h3 className={`text-blue-500 font-semibold cursor-pointer ${typeHeader === 'info' ? 'text-gray-500 pb-2 border-b-3 border-gray-500 ' : ''}`} onClick={() => setTypeHeader('info')}>Thông tin phim</h3>
                    <h3 className={`text-blue-500 font-semibold cursor-pointer ${typeHeader === 'episodes' ? 'text-gray-500 pb-2 border-b-3 border-gray-500' : ''}`} onClick={() => setTypeHeader('episodes')}>Danh sách video phim</h3>
                    <h3 className={`text-blue-500 font-semibold cursor-pointer ${typeHeader === 'reviews' ? 'text-gray-500 pb-2 border-b-3 border-gray-500' : ''}`} onClick={() => setTypeHeader('reviews')}>Review</h3>
                </div>
                {typeHeader === 'info' ? (
                    <form className="mb-10 max-w-6xl mx-auto" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left Column - Images */}
                            <div className="space-y-6">
                                {/* Poster Upload */}
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ImageIcon className="mr-2" size={20} />
                                        Poster
                                    </h3>

                                    <div
                                        onClick={() => document.getElementById("poster_upload").click()}
                                        className='border-2 border-dashed rounded-2xl p-4 flex justify-center items-center cursor-pointer hover:border-purple-400 transition-colors'>
                                        {posterPreview ? (
                                            <img
                                                src={posterPreview}
                                                alt="Poster preview"
                                                className="w-full h-64 object-cover rounded-lg mb-2"
                                            />
                                        ) : (
                                            <img src={movie.posterUrl} alt="poster" className="w-full h-64 object-cover rounded-lg mb-2" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="poster_upload"
                                        className="hidden"
                                        onChange={handlePosterFile}
                                    />
                                </div>

                                {/* Thumbnail Upload */}
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ImageIcon className="mr-2" size={20} />
                                        Thumbnail
                                    </h3>
                                    <div
                                        onClick={() => document.getElementById("thumb_upload").click()}
                                        className='border-2 border-dashed rounded-2xl p-4 flex justify-center items-center cursor-pointer hover:border-purple-400 transition-colors'>
                                        {thumbPreview ? (
                                            <img
                                                src={thumbPreview}
                                                alt="Poster preview"
                                                className="w-full h-48 object-cover rounded-lg mb-2"
                                            />
                                        ) : (
                                            <img src={movie.thumbUrl} alt="thumbnail" className='w-full h-48 object-cover rounded-lg mb-2' />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="thumb_upload"
                                        className="hidden"
                                        onChange={handleThumbFile}
                                    />
                                </div>
                            </div>

                            {/* Right Column - Movie Info */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Basic Info */}
                                <div className=" p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Film className="mr-2" size={20} />
                                        Thông tin cơ bản
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tên phim (Tiếng Việt) *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editMovie.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="VD: Biệt Đội Siêu Anh Hùng 4: Hồi Kết"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tên gốc (Tiếng Anh)
                                            </label>
                                            <input
                                                type="text"
                                                name="origin_name"
                                                value={editMovie.originName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="VD: Avengers: Endgame"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Slug (URL thân thiện)
                                            </label>
                                            <input
                                                type="text"
                                                name="slug"
                                                value={editMovie.slug}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                                placeholder="Tu dong tao tu ten phim"
                                            />
                                        </div>
                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Mô tả phim
                                            </label>
                                            <textarea
                                                name="description"
                                                value={editMovie.description}
                                                onChange={handleInputChange}
                                                rows={6}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="Nhập mô tả chi tiết về nội dung phim..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Calendar className="inline mr-1" size={16} />
                                                Năm sản xuất *
                                            </label>
                                            <input
                                                type="number"
                                                name="year"
                                                value={editMovie.year}
                                                onChange={handleInputChange}
                                                min="1900"
                                                max="2030"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Clock className="inline mr-1" size={16} />
                                                Thời lượng
                                            </label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={editMovie.duration}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="VD: 2 tiếng 36 phút"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Film className="inline mr-1" size={16} />
                                                Loại phim
                                            </label>
                                            <select
                                                name="type"
                                                value={editMovie.type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="single">Phim lẻ</option>
                                                <option value="series">Phim bộ</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Tag className="inline mr-1" size={16} />
                                                Trạng thái
                                            </label>
                                            <select
                                                name="status"
                                                value={editMovie.status}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="UPDATING">Đang cập nhật</option>
                                                <option value="COMING_SOON">Sắp chiếu</option>
                                                <option value="RELEASED">Đã phát hành</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="subtitle"
                                                    checked={editMovie.subtitle}
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
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Link className="mr-2" size={20} />
                                        Trailer
                                    </h3>

                                    <input
                                        type="url"
                                        name="trailerUrl"
                                        className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={editMovie.trailerUrl}
                                        onChange={handleInputChange}
                                    />
                                    {editMovie.trailerUrl && (
                                        <div className='w-full aspect-video'>
                                            <iframe
                                                src={editMovie.trailerUrl.replace('watch?v=', 'embed/')}
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

                        <div className="mt-8 flex gap-4 justify-end">
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Cập nhật
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : typeHeader === 'episodes' ? (
                    <MangeEpisodes episodes={movie.episodes} movieId={id} />
                ) : (
                    <ManageReview movieId={id} />
                )}

            </div>
        </div >
    )
}

export default ManageDetailMovie
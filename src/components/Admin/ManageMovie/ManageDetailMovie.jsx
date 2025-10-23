import { ArrowLeft, Calendar, ChartBarStacked, Clock, FileText, Film, Globe, ImageIcon, Plus, Star, Tag, Users, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MangeEpisodes from './MangeEpisodes'

const ManageDetailMovie = () => {
    const { id } = useParams()
    const [typeHeader, setTypeHeader] = useState('info') // 'info', 'episodes', 'reviews'
    const movie = {
        id: "25341840eedadf2f6",
        name: "Spider-Man: No Way Home",
        origin_name: "Spider-Man: No Way Home",
        slug: "spider-man-no-way-home",
        type: "Phim lẻ",
        description: "Peter Parker đã bị lộ mặt và không còn có thể tách biệt cuộc sống bình thường của mình với những yêu cầu cao của việc trở thành một Siêu anh hùng. Khi anh ta yêu cầu sự giúp đỡ từ Doctor Strange, mọi thứ càng trở nên nguy hiểm hơn, buộc anh ta phải khám phá ra ý nghĩa thực sự của việc trở thành Người Nhện.",
        poster_url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        thumb_url: "https://phimimg.com/upload/vod/20250828-1/db868e69da1af78d124ed464063b27a6.jpg",
        trailer_url: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
        duration: "2 tiếng 28 phút",
        director: ["Jon Watts"],
        actors: [
            "Tom Holland",
            "Zendaya",
            "Benedict Cumberbatch",
            "Jacob Batalon",
            "Jon Favreau",
            "Jamie Foxx",
            "Willem Dafoe",
            "Alfred Molina",
            "Benedict Wong",
            "Tony Revolori",
            "Marisa Tomei",
            "Andrew Garfield",
            "Tobey Maguire",
            "Angourie Rice",
            "Arian Moayed",
            "Paula Newsome",
            "Hannibal Buress",
            "Marti"
        ],
        country: "Mỹ",
        subtitle: true,
        year: 2021,
        category: [
            { "id": "5e0b6c4b5c3c4a0017b2c123", "name": "Hành Động", "slug": "hanh-dong" },
            { "id": "5e0b6c4b5c3c4a0017b2c124", "name": "Viễn Tưởng", "slug": "vien-tuong" },
            { "id": "5e0b6c4b5c3c4a0017b2c125", "name": "Phiêu Lưu", "slug": "phieu-luu" },
        ],
        rating: 8.2,
        views: 980000,
        episodes: [
            {
                name: "Tập 1",
                video_url: "https://example.com/video1.mp4"
            },
        ],
        status: "released",
        created_at: "2024-01-10",
        updated_at: "2024-01-15"
    }
    const editMovie = { ...movie }


    return (
        <div className='bg-white min-h-screen'>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
                <div className="flex items-center">
                    <Link
                        to="/admin/quan-ly-phim"
                        className="mr-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
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
                    <div className="mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left Column - Images */}
                            <div className="space-y-6">
                                {/* Poster Upload */}
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ImageIcon className="mr-2" size={20} />
                                        Poster phim
                                    </h3>

                                    <div className='rounded-2xl'>
                                        <img src={movie.poster_url} alt="poster" />
                                    </div>
                                </div>

                                {/* Thumbnail Upload */}
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ImageIcon className="mr-2" size={20} />
                                        Thumbnail phim
                                    </h3>

                                    <div>
                                        <img src={movie.thumb_url} alt="thumbnail" />
                                    </div>
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
                                                value={editMovie.origin_name}
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
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="VD: 2 tiếng 36 phút"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Globe className="inline mr-1" size={16} />
                                                Ngôn ngữ
                                            </label>
                                            <select
                                                name="country"
                                                value={editMovie.country}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="" >Chọn quốc gia</option>
                                                <option value="Việt Nam">Việt Nam</option>
                                                <option value="Anh">Anh</option>
                                                <option value="Hàn Quốc">Hàn Quốc</option>
                                                <option value="Nhật Bản">Nhật Bản</option>
                                                <option value="Trung Quốc">Trung Quốc</option>
                                                <option value="Mỹ">Mỹ</option>
                                                <option value="Other">Khác</option>
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
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="updating">Đang cập nhật</option>
                                                <option value="coming_soon">Sắp chiếu</option>
                                                <option value="released">Đã phát hành</option>
                                            </select>
                                        </div>


                                    </div>
                                </div>



                                {/* director */}
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Users className="mr-2" size={20} />
                                        Đạo diễn
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhập tên đạo diễn"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"

                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.director.map((direc, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                                >
                                                    {direc}
                                                    <button
                                                        type="button"

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
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Users className="mr-2" size={20} />
                                        Diễn viên
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"

                                                placeholder="Nhập tên diễn viên"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"

                                            />
                                            <button
                                                type="button"

                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.actors.map((actor, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                                >
                                                    {actor}
                                                    <button
                                                        type="button"

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
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ChartBarStacked className="mr-2" size={20} />
                                        Danh mục
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                placeholder='Nhập thể loại'
                                                type="text"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.category.map((cat, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                                >
                                                    {cat.name}
                                                    <button
                                                        type="button"

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
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Link className="mr-2" size={20} />
                                        Trailer
                                    </h3>

                                    <input
                                        type="url"
                                        name="trailer_url"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={editMovie.trailer_url}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                ) : typeHeader === 'episodes' ? (
                    <MangeEpisodes episodes={movie.episodes} />
                ) : (
                    null
                )}

            </div>
        </div >
    )
}

export default ManageDetailMovie
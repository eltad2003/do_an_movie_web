import { Edit, Trash2, Upload, X, Plus } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../context/AuthContext'

const MangeEpisodes = ({ episodes, movieId }) => {
    const { user } = useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)
    const [editingEpisode, setEditingEpisode] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const [episodeData, setEpisodeData] = useState({
        name: '',
        slug: '',
        episodeNumber: 1,
        duration: 0,
        videoUrl: '',
        movie: { id: movieId }
    })

    const [videoFile, setVideoFile] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEpisodeData(prev => ({
            ...prev,
            [name]: name === 'episodeNumber' || name === 'duration' ? parseInt(value) || 0 : value,
            slug: name === 'name' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug
        }))
    }

    const handleVideoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('video/')) {
                toast.error('Vui lòng chọn file video!')
                return
            }
            setVideoFile(file)
        }
    }

    const uploadToCloudinary = async () => {
        try {
            setIsUploading(true)
            setUploadProgress(10)

            // BƯỚC 1: Lấy signature từ backend
            const signatureRes = await fetch(
                `${import.meta.env.VITE_BE}/admin/episodes/generate-upload-signature`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                }
            )

            if (!signatureRes.ok) {
                throw new Error('Không thể lấy chữ ký upload')
            }

            const signatureData = await signatureRes.json()
            console.log('Signature data:', signatureData)

            const { signature, timestamp, api_key, cloud_name, folder } = signatureData
            setUploadProgress(30)

            // BƯỚC 2: Upload trực tiếp lên Cloudinary
            const formData = new FormData()
            formData.append('file', videoFile)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            formData.append('api_key', api_key)
            if (folder) {
                formData.append('folder', folder)
            }

            setUploadProgress(50)

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            )

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json()
                console.error('Cloudinary error:', errorData)
                throw new Error(errorData.error?.message || 'Upload video thất bại')
            }

            const uploadResult = await uploadRes.json()
            console.log('Upload result:', uploadResult)

            setUploadProgress(100)
            setIsUploading(false)

            return uploadResult.secure_url // Return secure video URL

        } catch (error) {
            console.error('Upload error:', error)
            setIsUploading(false)
            setUploadProgress(0)
            toast.error('Upload video thất bại: ' + error.message)
            return null
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            let videoUrl = episodeData.videoUrl

            // Nếu có file video mới, upload lên Cloudinary trước
            if (videoFile) {
                toast.info('Đang upload video lên Cloudinary...')
                videoUrl = await uploadToCloudinary()
                if (!videoUrl) {
                    setIsSubmitting(false)
                    return
                }
                toast.success('Upload video thành công!')
            } else if (!editingEpisode) {
                // Khi tạo mới bắt buộc phải có video
                toast.error('Vui lòng chọn file video!')
                setIsSubmitting(false)
                return
            }

            // BƯỚC 3: Tạo/Cập nhật episode với videoUrl
            const url = editingEpisode
                ? `${import.meta.env.VITE_BE}/admin/episodes/${editingEpisode.id}`
                : `${import.meta.env.VITE_BE}/admin/episodes`

            const method = editingEpisode ? 'PUT' : 'POST'

            const payload = {
                name: episodeData.name,
                slug: episodeData.slug,
                episodeNumber: episodeData.episodeNumber,
                duration: episodeData.duration,
                videoUrl: videoUrl,
                movie: { id: movieId }
            }

            console.log('Sending payload:', payload)

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const result = await res.json()
                console.log('Success:', result)
                toast.success(editingEpisode ? 'Cập nhật tập phim thành công!' : 'Thêm tập phim thành công!')
                resetForm()

                // Reload page sau 1 giây
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } else {
                const error = await res.text()
                console.error('Error response:', error)

                // Parse error message
                if (res.status === 400) {
                    if (error.includes('episodeNumber')) {
                        toast.error('Số tập này đã tồn tại cho phim này!')
                    } else if (error.includes('videoUrl')) {
                        toast.error('Vui lòng cung cấp URL video!')
                    } else {
                        toast.error('Dữ liệu không hợp lệ: ' + error)
                    }
                } else if (res.status === 401) {
                    toast.error('Bạn không có quyền thực hiện thao tác này!')
                } else {
                    toast.error(error || 'Có lỗi xảy ra!')
                }
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Có lỗi xảy ra: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (episode) => {
        setEditingEpisode(episode)
        setEpisodeData({
            name: episode.name,
            slug: episode.slug,
            episodeNumber: episode.episodeNumber || 1,
            duration: episode.duration || 0,
            videoUrl: episode.videoUrl,
            movie: { id: movieId }
        })
        setShowModal(true)
    }

    const handleDelete = async (episodeId) => {
        if (!window.confirm('Bạn có chắc muốn xóa tập phim này?')) return

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BE}/admin/episodes/${episodeId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.accessToken}`
                    }
                }
            )

            if (res.ok || res.status === 204) {
                toast.success('Xóa tập phim thành công!')
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } else {
                const error = await res.text()
                toast.error(error || 'Xóa tập phim thất bại!')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const resetForm = () => {
        setShowModal(false)
        setEditingEpisode(null)
        setEpisodeData({
            name: '',
            slug: '',
            episodeNumber: 1,
            duration: 0,
            videoUrl: '',
            movie: { id: movieId }
        })
        setVideoFile(null)
        setUploadProgress(0)
    }

    return (
        <div>
            <button
                onClick={() => {
                    resetForm()
                    setShowModal(true)
                }}
                className='px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mb-6 cursor-pointer hover:bg-blue-600 flex items-center gap-2'
            >
                <Plus size={18} />
                Thêm tập phim
            </button>

            <div className='overflow-auto rounded-lg shadow-sm border border-gray-200'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-xs text-left font-semibold uppercase'>Số tập</th>
                            <th className='px-6 py-3 text-xs text-left font-semibold uppercase'>Tên tập</th>
                            <th className='px-6 py-3 text-xs text-left font-semibold uppercase'>Thời lượng</th>
                            <th className='px-6 py-3 text-xs text-left font-semibold uppercase'>Video</th>
                            <th className='px-6 py-3 text-xs text-center font-semibold uppercase'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {episodes && episodes.length > 0 ? episodes.map((episode) => (
                            <tr key={episode.id} className='hover:bg-gray-50'>
                                <td className="px-6 py-4 font-semibold">{episode.episodeNumber || '-'}</td>
                                <td className="px-6 py-4 font-medium">{episode.name}</td>
                                <td className="px-6 py-4 text-gray-500">{episode.duration ? `${episode.duration} phút` : '-'}</td>
                                <td className="px-6 py-4">
                                    {episode.videoUrl ? (
                                        <a
                                            href={episode.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='hover:underline text-blue-500 flex items-center gap-1'
                                        >
                                            <Upload size={14} />
                                            Xem video
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Chưa có video</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex items-center justify-center gap-2'>
                                        <button
                                            onClick={() => handleEdit(episode)}
                                            className="p-2 rounded-lg cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(episode.id)}
                                            className="p-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    Chưa có tập phim nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-black">
                                {editingEpisode ? 'Cập nhật tập phim' : 'Thêm tập phim'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    Tên tập *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={episodeData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: Tập 1 - Khởi đầu"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Số tập *
                                    </label>
                                    <input
                                        type="number"
                                        name="episodeNumber"
                                        value={episodeData.episodeNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="VD: 1"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Thời lượng (phút) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={episodeData.duration}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="VD: 45"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    Slug (URL thân thiện)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={episodeData.slug}
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                                    placeholder="Tự động tạo từ tên tập"
                                    readOnly
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    Video {!editingEpisode && '*'}
                                </label>

                                {editingEpisode && episodeData.videoUrl && (
                                    <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                        Video hiện tại:
                                        <a
                                            href={episodeData.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline ml-1"
                                        >
                                            Xem video
                                        </a>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className="cursor-pointer"
                                    >
                                        {videoFile ? (
                                            <div className="text-green-600">
                                                <Upload size={32} className="mx-auto mb-2" />
                                                <p className="font-medium">{videoFile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">
                                                <Upload size={32} className="mx-auto mb-2" />
                                                <p>Click để chọn video</p>
                                                <p className="text-sm mt-1">
                                                    {editingEpisode ? '(Tùy chọn - để trống nếu không đổi)' : '(Bắt buộc)'}
                                                </p>
                                                <p className="text-xs mt-1">MP4, AVI, MOV, WebM</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {isUploading && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 text-center">
                                            Đang upload lên Cloudinary... {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer bg-gray-100 rounded-lg"
                                    onClick={resetForm}
                                    disabled={isSubmitting || isUploading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer hover:bg-blue-600 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || isUploading}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : isUploading ? 'Đang upload...' : (editingEpisode ? 'Cập nhật' : 'Thêm')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MangeEpisodes
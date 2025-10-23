import { Edit, Trash2, Upload } from 'lucide-react'
import React, { useState } from 'react'

const MangeEpisodes = ({ episodes }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <button
                onClick={() => setShowModal(!showModal)}
                className='px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mb-6 cursor-pointer'
            >
                Thêm tập phim
            </button>
            <div className='overflow-auto rounded-lg shadow-sm border border-gray-200'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-left text-gray-500 uppercase'>STT</th>
                            <th className='px-6 py-3 text-left text-gray-500 uppercase'>Tên tập</th>
                            <th className='px-6 py-3 text-left text-gray-500 uppercase'>URL video</th>
                            <th className='px-6 py-3 text-left text-gray-500 uppercase'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {episodes.map((episode, index) => (
                            <tr key={index} className='hover:bg-gray-50'>
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{episode.name}</td>
                                <td className="px-6 py-4">
                                    <a href={episode.video_url} className='hover:underline text-blue-500'>{episode.video_url}</a>
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex items-center gap-2'>
                                        <button className="p-2 rounded-lg cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600"> <Upload size={18} /></button>
                                        <button className="p-2 rounded-lg cursor-pointer bg-blue-500 text-white hover:bg-blue-600"> <Edit size={18} /></button>
                                        <button className="p-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600"> <Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-dark-100/50  flex items-center justify-center">

                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-black">Thêm tập phim</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">Tên tập</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">URL video</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className="cursor-pointer hover:bg-blue-600 px-4 py-2 bg-blue-500 text-white rounded-lg">Thêm</button>
                                <button
                                    type="button"
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer bg-gray-300 rounded-lg"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
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
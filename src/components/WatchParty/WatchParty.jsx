import React, { useContext, useState } from 'react'
import { Play, Users, MessageCircle, Settings, Share2, Crown, Volume2, VolumeX, Maximize, Copy, Check, LogOut, ChevronLeft } from 'lucide-react'
import VideoPlayer from '../WatchMovie/VideoPlayer'
import { useWatchRoomById } from '../../hooks/useWatchRoom'
import { Link, useParams } from 'react-router-dom'
import VideoSocket from './VideoSocket'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const WatchParty = () => {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const [copied, setCopied] = useState(false)

    const [messages, setMessages] = useState([
        { id: 1, user: 'Minh', message: 'Phim này hay quá!', time: '20:15' },
        { id: 2, user: 'Lan', message: 'Đồng ý, cốt truyện rất hấp dẫn', time: '20:16' },
        { id: 3, user: 'Bạn', message: 'Cảnh này kinh quá 😱', time: '20:17' }
    ])
    const [newMessage, setNewMessage] = useState('')
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)


    const { room } = useWatchRoomById(id)

    const isUserHost = () => {
        return room.hostId === user.user.id || room.hostName === user.user.name
    }

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                user: 'Bạn',
                message: newMessage,
                time: new Date().toLocaleTimeString('vi-VN')
            }
            setMessages([...messages, message])
            setNewMessage('')
        }
    }
    const handleCloseRoom = async () => {
        if (window.confirm('Bạn có chắc muốn đóng phòng này?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BE}/api/watch-rooms/${room.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
                    },
                })
                if (!res.ok) {
                    throw new Error('Failed to close room');
                }

                toast.success('Đóng phòng thành công')
                window.location.href = '/xem-chung';

            } catch (error) {
                console.error('Error close room:', error);
            }
        }
    }

    const handleCopyRoomCode = () => {
        alert('Đã sao chép mã phòng!')
        navigator.clipboard.writeText(room.id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!room) return null

    return (
        <main>
            <div className="wrapper">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <Link to="/xem-chung" className='flex items-center gap-2'>
                        <ChevronLeft className='w-7 h-7 text-white' />
                        <h2>{room.title}</h2>
                    </Link>
                    <div className="flex items-center gap-4">
                        {isUserHost() &&
                            <button
                                className='font-semibold inline-flex items-center gap-2 text-red-400 p-2 bg-dark-100 hover:text-red-700 transition-colors cursor-pointer rounded-lg'
                                onClick={handleCloseRoom}
                            >
                                <LogOut className='w-6 h-6' /> Kết thúc
                            </button>}
                        {/* Settings */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-dark-100 text-white rounded-lg hover:bg-dark-200 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Video Player Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-dark-100 rounded-lg overflow-hidden">
                            {/* Video Player */}
                            <div className="relative aspect-video">

                                <VideoSocket videoUrl={room.videoUrl} room={room} user={user.user} />


                            </div>

                            {/* Movie Info */}

                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Participants */}
                        <div className="bg-dark-100 rounded-lg p-4">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Thành viên
                            </h3>

                            <div className="space-y-3">

                                {/* {[Array(_, length: 3)].map((participant) => (
                                <div key={participant.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-dark-100 font-bold">
                                        {participant.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{participant.name}</p>
                                    </div>
                                    {participant.isHost && (
                                        <Crown className="w-4  h-4 text-yellow-400" />
                                    )}
                                </div>
                                ))} */}
                            </div>

                            {/* Invite Button */}
                            <button
                                className="btn w-full inline-flex items-center justify-center"
                                onClick={handleCopyRoomCode}
                            >
                                <Share2 className="w-4 h-4" />
                                Mời bạn bè
                            </button>
                        </div>

                        {/* Chat */}
                        <div className="bg-dark-100 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Chat
                                </h3>
                                <button
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {isChatOpen ? '−' : '+'}
                                </button>
                            </div>

                            {isChatOpen && (
                                <>
                                    {/* Messages */}
                                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-light-100 font-medium text-sm">
                                                        {msg.user}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {msg.time}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-sm bg-dark-200 px-3 py-2 rounded-lg">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-700">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                                placeholder="Nhập tin nhắn..."
                                                className="flex-1 bg-dark-200 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                            />
                                            <button
                                                onClick={sendMessage}
                                                className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                            >
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings Modal */}
                {
                    isSettingsOpen && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-dark-100 rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-white text-xl font-bold mb-4">Cài đặt phòng</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Tên phòng</label>
                                        <input
                                            type="text"
                                            defaultValue="Phòng xem phim của tôi"
                                            className="w-full bg-dark-200 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Quyền điều khiển</label>
                                        <select className="w-full bg-dark-200 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none">
                                            <option>Chỉ chủ phòng</option>
                                            <option>Tất cả thành viên</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Cho phép chat</span>
                                        <button className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 px-3 py-1 rounded-full text-sm font-semibold">
                                            BẬT
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="flex-1 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </main >
    )
}

export default WatchParty
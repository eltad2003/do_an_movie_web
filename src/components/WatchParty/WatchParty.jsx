import React, { useState, useEffect } from 'react'
import { Play, Users, MessageCircle, Settings, Share2, Crown, Volume2, VolumeX, Maximize, Copy, Check } from 'lucide-react'
import VideoPlayer from '../WatchMovie/VideoPlayer'
import { useWatchRoomById } from '../../hooks/useWatchRoom'
import { useParams } from 'react-router-dom'

const WatchParty = () => {
    const { id } = useParams()
    const [isHost, setIsHost] = useState(false)
    const [roomCode, setRoomCode] = useState(id)
    const [participants, setParticipants] = useState([
        { id: 1, name: 'Bạn', avatar: '👤', isHost: true },
        { id: 2, name: 'Minh', avatar: '😊', isHost: false },
        { id: 3, name: 'Lan', avatar: '🙂', isHost: false }
    ])
    const [messages, setMessages] = useState([
        { id: 1, user: 'Minh', message: 'Phim này hay quá!', time: '20:15' },
        { id: 2, user: 'Lan', message: 'Đồng ý, cốt truyện rất hấp dẫn', time: '20:16' },
        { id: 3, user: 'Bạn', message: 'Cảnh này kinh quá 😱', time: '20:17' }
    ])
    const [newMessage, setNewMessage] = useState('')
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [movieInfo] = useState({
        title: 'Spider-Man: No Way Home',
        currentTime: '45:23',
        duration: '148:00',
        isPlaying: true
    })

    const { room } = useWatchRoomById(id)

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

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    if (!room) return null

    return (
        <main>
            <div className="container mx-auto p-4 mb-30">
                {/* Header */}
                <header className="flex justify-between items-center mb-5">

                    <h2>{room.title}</h2>

                    <div className="flex items-center gap-4">
                        {/* Room Code */}
                        {/* <div className="bg-dark-100 px-4 py-2 rounded-lg flex items-center gap-2">
                            <span className="text-white font-medium">Mã phòng:</span>
                            <code className="text-light-100 font-mono bg-dark-200 px-2 py-1">
                                {roomCode}
                            </code>
                            <button
                                onClick={copyRoomCode}
                                className="text-light-100 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div> */}

                        {/* Settings */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-dark-100 text-white rounded-lg hover:bg-dark-200 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Video Player Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-dark-100 rounded-lg overflow-hidden">
                            {/* Video Player */}
                            <div className="relative aspect-video">
                                <VideoPlayer videoUrl="https://player.phimapi.com/player/?url=https://s6.kkphimplayer6.com/20250828/c0xkSuds/index.m3u8" />

                                {/* Sync Status */}
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    Đồng bộ
                                </div>

                                {/* Participants Count */}
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {participants.length}
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-4 bg-dark-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">
                                            <span>{room.movieName} {room.episodeName}</span>
                                        </h3>
                                        <p className="text-gray-400">
                                            {movieInfo.currentTime} / {movieInfo.duration}
                                        </p>
                                    </div>

                                    {/* Host Controls */}
                                    {isHost && (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                <Crown className="w-4 h-4" />
                                                Chủ phòng
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Participants */}
                        <div className="bg-dark-100 rounded-lg p-4">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Thành viên ({participants.length})
                            </h3>

                            <div className="space-y-3">
                                {participants.map((participant) => (
                                    <div key={participant.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-dark-100 font-bold">
                                            {participant.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{participant.name}</p>
                                        </div>
                                        {participant.isHost && (
                                            <Crown className="w-4 h-4 text-yellow-400" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Invite Button */}
                            <button className="w-full mt-4 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 font-bold py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
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
                {isSettingsOpen && (
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
                )}
            </div>
        </main>
    )
}

export default WatchParty
import React, { useContext, useState } from 'react'
import { Play, Users, MessageCircle, Settings, Share2, Crown, Volume2, VolumeX, Maximize, Copy, Check, LogOut, ChevronLeft, Minus, Plus } from 'lucide-react'
import VideoPlayer from '../WatchMovie/VideoPlayer'
import { useWatchRoomById } from '../../hooks/useWatchRoom'
import { Link, useParams } from 'react-router-dom'
import VideoSocket from './VideoSocket'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { useSocket } from '../../hooks/useSocket'

const WatchParty = () => {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const [isChatOpen, setIsChatOpen] = useState(false)
    const { room } = useWatchRoomById(id)
    const {
        videoRef,
        isConnected,
        isHost,
        messages,
        newMessage,
        handleUserAction,
        sendRequestSync,
        setNewMessage,
        sendMessage,
        sendLeaveSignal
    } = useSocket(room, user.user);

    if (!room) return null

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



    return (
        <main>
            <div className="wrapper mb-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <Link to="/xem-chung" className='flex items-center gap-2' onClick={sendLeaveSignal}>
                        <ChevronLeft className='w-7 h-7 text-white hover:text-light-200' />
                        <h2>{room.title}</h2>
                    </Link>
                    <div className="flex items-center gap-4">
                        {isHost &&
                            <button
                                className='font-semibold inline-flex items-center text-sm gap-2 text-red-600 p-2 bg-dark-200 cursor-pointer rounded-lg border border-red-600'
                                onClick={handleCloseRoom}
                            >
                                <LogOut className='w-5 h-5' /> Kết thúc
                            </button>
                        }
                        <div className="p-2 gap-2 flex justify-between items-center text-sm bg-dark-100 text-white rounded-lg border border-gray-700">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Chat
                            </h3>
                            <button
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {isChatOpen ? <Minus /> : <Plus />}
                            </button>
                        </div>

                    </div>

                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Video Player Area */}
                    <div className='w-full'>

                        <VideoSocket videoUrl={room.videoUrl} room={room} handleUserAction={handleUserAction} isConnected={isConnected} isHost={isHost} sendRequestSync={sendRequestSync} videoRef={videoRef} />
                    </div>

                    <>
                        {isChatOpen && (
                            <div className=" bg-dark-100 rounded-lg overflow-hidden flex flex-col h-[500px] lg:h-[97%] lg:fixed top-0 right-0 m-3 lg:w-1/4">
                                <div className="p-2 gap-2 flex justify-between items-center bg-dark-100 text-white border-b border-gray-700">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        Chat
                                    </h3>
                                    <button
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {isChatOpen ? <Minus /> : <Plus />}
                                    </button>
                                </div>
                                {/* Messages */}
                                <div className=" overflow-y-auto px-6 py-3 space-y-3 flex-1 h-[100px]">
                                    {messages.length > 0 ? messages.map((msg, index) => (
                                        <div key={index} className="flex flex-col">
                                            {msg.message === 'đã rời phòng' || msg.message === 'đã tham gia phòng' ? (
                                                <p className="text-gray-400 text-sm italic mb-1 text-center">{msg.senderName} {msg.message}</p>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`${msg.senderName === 'Bạn' ? 'text-yellow-400' : ' text-light-100'} font-bold `}>
                                                            {msg.senderName}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">
                                                            {msg.time}
                                                        </span>
                                                    </div>
                                                    <p className='text-white px-2.5 py-1.5 rounded-lg w-fit bg-gray-800'>
                                                        {msg.message}
                                                    </p>

                                                </>
                                            )}

                                        </div>
                                    )) : <p className="text-gray-400 text-sm">Chưa có tin nhắn nào.</p>}
                                </div>

                                {/* Message Input */}
                                <div className="p-5 border-t border-gray-700 ">
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
                                            className="bg-amber-50 text-dark-100 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>


                </div>


            </div >
        </main >
    )
}

export default WatchParty
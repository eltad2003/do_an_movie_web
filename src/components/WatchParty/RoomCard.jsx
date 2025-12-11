import { Clock, Crown, Globe, Lock, LockIcon, Play, Users, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'
import ReactModal from 'react-modal'
import { toast } from 'react-toastify'

const RoomCard = ({ room }) => {
    const [password, setPassword] = useState('')

    const [typePassword, setTypePassword] = useState(false);
    const navigate = useNavigate()

    const getStatusColor = (status) => {
        switch (status) {
            case 'watching': return 'bg-green-900 text-green-100'
            case 'waiting': return 'bg-yellow-900 text-yellow-100'
            case 'paused': return 'bg-red-900 text-red-100'
            default: return 'bg-gray-900 text-gray-100'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'watching': return 'Đang xem'
            case 'waiting': return 'Chờ bắt đầu'
            case 'paused': return 'Tạm dừng'
            default: return 'Không xác định'
        }
    }

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (password.trim() === '') return;
        if (password === room.password) {
            navigate(`/xem-chung/${room.id}`);
            toast.success('Tham gia phòng thành công!')
        } else {
            toast.error('Mật khẩu không đúng. Vui lòng thử lại.');
            setPassword('')
            setTypePassword(false)
        }


    }

    return (
        <div className="bg-dark-100 rounded-2xl mb-10">
            {/* Movie Poster & Info */}
            <div className="relative">
                <img
                    src={room.posterUrl}
                    alt="poster"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = '/watch-party.webp'
                    }}
                />

                {/* Overlay */}
                <div className="overlay-gradient" />

                {/* Room Status */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {/* <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(room.status)}`}>
                        {getStatusText(room.status)}
                    </span> */}
                    {room.hasPassword ? (
                        <span className="bg-red-900/80 text-red-100 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Riêng tư
                        </span>
                    ) : (
                        <span className="bg-green-900/80 text-green-100 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Công khai
                        </span>
                    )}
                </div>

                {/* Movie Info at Bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-white/90 font-bold line-clamp-1">
                        {room.movieName}
                    </h4>
                    <p className="text-yellow-400 text-xs font-semibold">
                        {room.episodeName}
                    </p>
                </div>
            </div>

            {/* Room Details */}
            <div className="p-5 md:p-3">
                <div className="mb-4">
                    <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">
                        {room.title}
                    </h3>

                    <div className="flex items-center gap-3">
                        <div className=" text-sm flex items-center gap-1 text-light-100 font-semibold">
                            <Crown className="w-4 h-4" />
                            <span>{room.hostName}</span>
                        </div>
                        <div className="text-xs flex items-center  gap-1 text-gray-400 ">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(room.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Participants & Join */}

                <div className="flex items-center justify-between gap-3">

                    {typePassword ? (
                        <form className='flex-1 flex gap-1' onSubmit={handleJoinRoom}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 bg-white/5 border border-light-100/20 text-white rounded-lg px-4 py-2 focus:outline-none"
                                placeholder="Nhập mật khẩu"
                                autoFocus
                                required
                            />
                            <button
                                type='submit'
                                className='btn'
                            >
                                OK
                            </button>
                            <button
                                type='button'
                                onClick={() => {
                                    setTypePassword(false)
                                    setPassword('')
                                }}
                                className='px-3 py-2 text-white cursor-pointer bg-red-800 hover:bg-red-900 rounded-lg'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </form>
                    ) : (
                        <>
                            {/* Show participants when NOT typing password */}
                            <div className="flex items-center gap-2 flex-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                    {room.currentViewers} đang xem
                                </span>
                            </div>

                            {/* Join button */}
                            {room.hasPassword ? (
                                <button
                                    className="btn inline-flex items-center gap-1"
                                    onClick={() => setTypePassword(true)}
                                >
                                    <Lock className='w-4 h-4' />
                                    Tham gia
                                </button>
                            ) : (
                                <Link to={`/xem-chung/${room.id}`}>
                                    <button className="btn">Tham gia</button>
                                </Link>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div >
    )
}

export default RoomCard

import { Clock, Crown, Globe, Lock, Play, Users } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'

const RoomCard = ({ room }) => {
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

                {/* Play Button Overlay */}
                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100  ">
                    <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                        <Play className="w-8 h-8 cursor-pointer text-white" />
                    </div>
                </div> */}

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

                    <div className="flex items-center gap-4 ">
                        <div className=" text-sm flex items-center gap-1 text-light-100 font-semibold">
                            <Crown className="w-4 h-4" />
                            <span>{room.hostName.split(' ')[0]}</span>
                        </div>
                        <div className="text-xs flex items-center gap-1 text-gray-400 ">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(room.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Participants & Join */}
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 flex-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">
                            {room.currentViewers} đang xem
                        </span>
                        {/* <div className="flex -space-x-2">
                            {[...Array(Math.min(3, 10))].map((_, i) => (
                                <div key={i} className="w-6 h-6 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full border-2 border-dark-100 flex items-center justify-center text-xs font-bold text-dark-100">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                            {room.participants > 3 && (
                                <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-dark-100 flex items-center justify-center text-xs font-bold text-white">
                                    +{room.currentViewers - 3}
                                </div>
                            )}
                        </div> */}
                    </div>

                    <Link to={`/xem-chung/${room.id}`}>
                        <button
                            className="btn disabled:cursor-not-allowed"
                        // disabled={room.currentViewers >= room.currentViewers}
                        >
                            Tham gia
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RoomCard

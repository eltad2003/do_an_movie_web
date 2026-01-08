import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Play, Crown, Lock, Globe, Clock, Search, Plus, Filter } from 'lucide-react'
import RoomCard from './RoomCard'
import { useWatchRoom } from '../../hooks/useWatchRoom'
import More from '../UI/More'

const Room = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all') // all, public, private
    const [roomPerPage, setRoomPerPage] = useState(12)

    const { rooms } = useWatchRoom()

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.movieName.toLowerCase().includes(searchQuery.toLowerCase()) || room.id.toString().includes(searchQuery)

        const matchesFilter = filterType === 'all' ||
            (filterType === 'public' && !room.hasPassword) ||
            (filterType === 'private' && room.hasPassword) ||
            (filterType === 'actived' && room.active === true) ||
            (filterType === 'ended' && !room.active)

        return matchesSearch && matchesFilter
    })

    return (
        <main>
            <div className='relative h-[30dvh] xl:h-[50dvh] bg-cover bg-center w-full'
                style={{
                    backgroundImage: "url(./watch-party.webp)",
                    objectFit: 'cover',
                    backgroundPosition: 'center center',
                }}
            >
                <div className="overlay-gradient" />
                <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/10 to-transparent'></div>
                <div className='absolute inset-0 bg-gradient-to-l from-primary via-primary/10 to-transparent'></div>
                <div className='absolute inset-0 mt-5 '>
                    <h1 className='text-white/80'> Phòng xem chung </h1>
                    <p className="text-white/60 text-center mx-auto text-xs md:text-base max-w-md mt-2">
                        Tham gia hoặc tạo phòng để xem phim cùng bạn bè. Chia sẻ cảm xúc và thảo luận về bộ phim ngay trong phòng chat!
                    </p>
                </div>
            </div>
            <div className="p-2 md:p-6 mb-20" >
                {/* Controls */}

                <section className="my-8">
                    <div className="flex gap-3 items-center ">
                        <div className="flex gap-3 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo mã phòng hoặc phim..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-dark-100 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-dark-100 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none"
                            >
                                <option value="all">Tất cả phòng</option>
                                <option value="public">Phòng công khai</option>
                                <option value="private">Phòng riêng tư</option>
                                <option value="actived">Đang chiếu</option>
                                <option value="ended">Đã kết thúc</option>
                            </select>
                        </div>


                    </div>
                </section>

                {/* Rooms Grid */}
                <section >
                    {filteredRooms.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredRooms.slice(0, roomPerPage).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Không tìm thấy phòng nào
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo phòng mới
                            </p>

                        </div>
                    )}
                    {filteredRooms.length > roomPerPage && (
                        <More moviePerPage={roomPerPage} setMoviePerPage={setRoomPerPage} />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Room
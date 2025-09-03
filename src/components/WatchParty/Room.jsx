import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Play, Crown, Lock, Globe, Clock, Search, Plus, Filter } from 'lucide-react'
import RoomCard from './RoomCard'

const Room = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all') // all, public, private
    const [rooms] = useState([
        {
            id: 1,
            name: 'Spider-Man: No Way Home - Thảo luận',
            movie: {
                title: 'Spider-Man: No Way Home',
                poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
                year: 2021
            },
            host: 'Minh Anh',
            participants: 12,
            maxParticipants: 20,
            isPrivate: false,
            status: 'watching', // waiting, watching, paused
            currentTime: '45:23',
            roomCode: 'WP123456',
            createdAt: '2 phút trước'
        },
        {
            id: 2,
            name: 'Phòng xem phim kinh dị 😱',
            movie: {
                title: 'The Conjuring 3',
                poster: 'https://image.tmdb.org/t/p/w500/xbEhcK7NjJvK4C5eFO6u1WTe7wA.jpg',
                year: 2021
            },
            host: 'Horror Fan',
            participants: 8,
            maxParticipants: 15,
            isPrivate: true,
            status: 'waiting',
            currentTime: '00:00',
            roomCode: 'WP789012',
            createdAt: '5 phút trước'
        },
        {
            id: 3,
            name: 'Anime chill với friends',
            movie: {
                title: 'Your Name',
                poster: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg',
                year: 2016
            },
            host: 'Otaku_kun',
            participants: 25,
            maxParticipants: 30,
            isPrivate: false,
            status: 'watching',
            currentTime: '78:45',
            roomCode: 'WP345678',
            createdAt: '15 phút trước'
        },
        {
            id: 4,
            name: 'Marvel Marathon 🦸‍♂️',
            movie: {
                title: 'Avengers: Endgame',
                poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
                year: 2019
            },
            host: 'MCU_Lover',
            participants: 45,
            maxParticipants: 50,
            isPrivate: false,
            status: 'watching',
            currentTime: '120:30',
            roomCode: 'WP901234',
            createdAt: '30 phút trước'
        }
    ])

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.movie.title.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter = filterType === 'all' ||
            (filterType === 'public' && !room.isPrivate) ||
            (filterType === 'private' && room.isPrivate)

        return matchesSearch && matchesFilter
    })

    return (
        <main >
            <div className='relative h-[70vh]'>
                <img src="./watch-party.webp" alt="banner" className='w-full h-full bg-center bg-contain' />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
                <div className='absolute inset-0  text-center mt-20 shadow-2xl'>
                    <h1 >
                        Phòng xem chung
                    </h1>
                    <p className="text-white/70 text-lg">
                        Tham gia hoặc tạo phòng để xem phim cùng bạn bè. Chia sẻ cảm xúc và thảo luận trong thời gian thực.
                    </p>
                </div>
            </div>
            {/* <div className="pattern"></div> */}
            <div className="wrapper">
                {/* Controls */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search & Filter */}

                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm phòng hoặc phim..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-dark-100 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-dark-100 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-100/30"
                            >
                                <option value="all">Tất cả phòng</option>
                                <option value="public">Phòng công khai</option>
                                <option value="private">Phòng riêng tư</option>
                            </select>
                        </div>

                        {/* Create Room Button */}
                        <Link to="/xem-chung/tao-phong">
                            <button className="btn">
                                <Plus className="w-5 h-5" />
                                Tạo phòng mới
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Rooms Grid */}
                <section>
                    {filteredRooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredRooms.map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Không tìm thấy phòng nào
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo phòng mới
                            </p>
                            <Link to="/xem-chung/tao-phong">
                                <button className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-100 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                                    Tạo phòng đầu tiên
                                </button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Quick Stats */}
                {/* <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-dark-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-light-100 mb-2">
                            {rooms.length}
                        </div>
                        <p className="text-gray-400">Phòng đang hoạt động</p>
                    </div>

                    <div className="bg-dark-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-light-100 mb-2">
                            {rooms.reduce((total, room) => total + room.participants, 0)}
                        </div>
                        <p className="text-gray-400">Người đang xem</p>
                    </div>

                    <div className="bg-dark-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-light-100 mb-2">
                            {rooms.filter(room => room.status === 'watching').length}
                        </div>
                        <p className="text-gray-400">Phòng đang phát</p>
                    </div>
                </section> */}
            </div>
        </main>
    )
}

export default Room
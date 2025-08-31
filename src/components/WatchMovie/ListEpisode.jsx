import { Play } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ListEpisode = ({ episodes, detailMovie: { slug }, epSlug }) => {

    const [selectedServer, setSelectedServer] = useState(0)
    const handleChangeServer = (e) => {
        setSelectedServer(e.target.value)
    }
    return (
        <div className='mb-10 bg-dark-100 text-white p-5 rounded-lg'>
            <h3 className='text-xl font-bold mb-3'>Danh sách tập</h3>

            <select
                className='bg-gray-800 text-light-100 rounded-lg p-2 mb-6'
                value={selectedServer}
                onChange={handleChangeServer}
            >
                {episodes.map((e, idx) => (
                    <option key={idx} value={idx}>
                        {e.server_name}
                    </option>
                ))}
            </select>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                {episodes[selectedServer]?.server_data.map((ep, idx) => (
                    <Link
                        to={`/xem-phim/${slug}?ver=${selectedServer}&ep=${ep.slug}`}
                        key={idx}
                        className={`text-sm px-3 py-2 rounded-lg ${ep.slug === epSlug ? 'bg-yellow-700' : 'bg-gray-800'} inline-flex cursor-pointer gap-2 items-center justify-center hover:bg-gray-700 transition`}
                    >
                        <Play className='w-4 h-4' />
                        {ep.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ListEpisode

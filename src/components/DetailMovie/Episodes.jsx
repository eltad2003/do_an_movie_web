import { Play } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { chunkArray } from '../../utils/helpers'

const Episodes = ({ episodes, detailMovie: { slug } }) => {
    const [selectedServer, setSelectedServer] = useState(0)
    const [selectedRange, setSelectedRange] = useState(0)
    const listEpisodes = episodes[selectedServer]?.server_data || [] //contain info episode: name, slug, link_embed
    const MAX_EPISODE_PER_RANGE = 50

    const handleChangeServer = (e) => {
        setSelectedServer(e.target.value)
        setSelectedRange(0)
    }

    const handleChangeRange = (e) => {
        setSelectedRange(e.target.value)
    }

    const groupEpisode = chunkArray(listEpisodes, MAX_EPISODE_PER_RANGE);

    if (!episodes || episodes.length === 0) {
        return (
            <div className='mb-10 bg-dark-100 text-white p-5 rounded-lg'>
                <h3 className='text-xl font-bold mb-3'>Danh sách tập</h3>
                <p className='text-gray-400'>Không có tập phim nào</p>
            </div>
        )
    }
    return (
        <section className='mb-10 bg-dark-100 text-white p-5 rounded-lg'>
            <h3 className='text-xl font-bold mb-3'>Danh sách tập</h3>
            <div className="flex flex-wrap gap-2">
                {/* select server */}
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
                {/* select range episode */}
                {groupEpisode.length > 1 && (
                    <select
                        className='bg-gray-800 text-light-100 rounded-lg p-2 mb-6'
                        value={selectedRange}
                        onChange={handleChangeRange}
                    >
                        {groupEpisode.map((_, idx) => (
                            <option key={idx} value={idx}>
                                Tập {idx * MAX_EPISODE_PER_RANGE + 1} - {Math.min((idx + 1) * MAX_EPISODE_PER_RANGE, listEpisodes.length)}
                                {/* Tập {idx * MAX_EPISODE_PER_RANGE + 1} - {((idx + 1) * MAX_EPISODE_PER_RANGE)} */}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* list episode */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {groupEpisode[selectedRange].map((ep, idx) => (
                    <Link
                        to={`/xem-phim/${slug}?ver=${selectedServer}&ep=${ep.slug}`}
                        key={idx}
                        className='text-sm px-3 py-2 rounded-lg bg-gray-800 inline-flex cursor-pointer gap-2 items-center justify-center hover:bg-gray-700 transition hover:text-light-100'
                    >
                        <Play className='w-4 h-4' />
                        {ep.name}
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default Episodes

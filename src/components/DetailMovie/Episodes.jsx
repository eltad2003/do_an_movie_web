import { Play } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { chunkArray } from '../../utils/helpers'
import { AuthContext } from '../../context/AuthContext'
import { useSaveHistory } from '../../hooks/useHistory'

const Episodes = ({ episodes, detailMovie: { slug } }) => {
    const { user } = useContext(AuthContext)
    const [selectedRange, setSelectedRange] = useState(0)
    const MAX_EPISODE_PER_RANGE = 50
    const groupEpisode = chunkArray(episodes, MAX_EPISODE_PER_RANGE);
    const { saveHistory } = useSaveHistory() //save history when user click episode

    const handleChangeRange = (e) => {
        setSelectedRange(Number(e.target.value))
    }

    if (!episodes || episodes.length === 0) {
        return (
            <div className='mb-10 bg-dark-100 text-white p-5 rounded-lg'>
                <h3 className='text-xl font-bold mb-3'>Danh sách tập</h3>
                <p className='text-gray-400'>Không có tập phim nào</p>
            </div>
        )
    }
    return (
        <section className='section'>
            <h2 >Danh sách tập</h2>
            {/* range episode */}
            {groupEpisode.length > 1 && (
                <div className='mb-4'>
                    <label htmlFor='episode-range' className='mr-2'>Chọn khoảng tập:</label>
                    <select
                        id='episode-range'
                        value={selectedRange}
                        onChange={handleChangeRange}
                        className='bg-dark-200 text-white p-2 rounded-lg'
                    >
                        {groupEpisode.map((group, index) => (
                            <option key={index} value={index}>
                                Tập {index * MAX_EPISODE_PER_RANGE + 1} - {index * MAX_EPISODE_PER_RANGE + group.length}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {/* list episode */}
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {groupEpisode[selectedRange].map((ep, idx) => (
                    <Link
                        to={`/xem-phim/${slug}?ep=${ep.slug}`}
                        key={idx}
                        className='text-sm px-3 py-2 rounded-lg bg-gray-800 inline-flex cursor-pointer gap-2 items-center justify-center hover:bg-gray-700 transition hover:text-light-100'
                        onClick={() => user && saveHistory(ep.id)}
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

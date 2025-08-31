import { ChevronRight } from 'lucide-react'
import React from 'react'

const InfoMovie = ({ detailMovie: { name, origin_name, content, episode_current, poster_url, category } }) => {
    return (
        <div className='mb-10'>
            <div className='flex items-start gap-5 flex-col md:flex-row'>
                <div className='flex items-start gap-3'>
                    <img src={poster_url} alt="poster" className='w-full h-auto max-h-[350px] max-w-[120px] rounded-lg object-cover shadow-lg' />
                    <div className='space-y-3'>
                        <h2>{name}</h2>
                        <p className='text-light-100 font-bold'>{origin_name}</p>
                        <div className="flex gap-2 flex-wrap">
                            {category.map((cat) => (
                                <span key={cat.id} className="px-3 py-1 rounded-lg bg-gray-800 text-light-100">{cat.name}</span>
                            ))}
                        </div>
                        <div className='bg-green-900 inline-block px-3 py-1 rounded-lg text-sm font-semibold text-green-800 mb-4'>
                            <span className='text-green-100'>{episode_current} </span>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <p className="text-gray-300 mb-8">{content}</p>
                    <button className='btn text-sm flex items-center text-dark-100 '>
                        Thông tin phim <ChevronRight className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InfoMovie

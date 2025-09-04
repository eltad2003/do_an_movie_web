import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import InfoGenres from '../DetailMovie/Info/InfoGenres'

const InfoMovie = ({ detailMovie: { name, slug, origin_name, content, episode_current, poster_url, category } }) => {
    return (
        <div className='mb-20 hidden md:block'>
            <div className='flex items-start gap-3 flex-col lg:flex-row'>
                <div className='flex items-start gap-3 flex-1'>
                    <img src={poster_url} alt="poster" className='w-full h-auto max-h-[350px] max-w-[150px] rounded-lg object-cover shadow-lg' />
                    <div className='space-y-3'>
                        <div>
                            <h2>{name}</h2>
                            <p className='text-light-100 font-bold'>{origin_name}</p>
                        </div>
                        <InfoGenres detailMovie={{ category }} />

                        <div className='bg-green-900 inline-block px-3 py-1 rounded-lg text-sm font-semibold text-green-800 mb-4'>
                            <span className='text-green-100'>{episode_current} </span>
                        </div>

                    </div>
                </div>
                <div className='flex-1'>
                    <p className='text-gray-300 mb-3' dangerouslySetInnerHTML={{ __html: content }} />
                    <Link
                        to={`/phim/${slug}`}
                        className='btn inline-flex items-center text-dark-100 '>
                        Thông tin phim <ChevronRight className='w-4 h-4' />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default InfoMovie

import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import InfoGenres from '../DetailMovie/Info/InfoGenres'

const InfoMovie = ({ detailMovie: { name, slug, originName, description, posterUrl, categories } }) => {
    return (
        <div className='mb-20 hidden md:block'>
            <div className='flex items-start gap-3 flex-col lg:flex-row'>
                <div className='flex items-start gap-3 flex-1'>
                    <img src={posterUrl} alt="poster" className='w-full h-auto max-h-[350px] max-w-[150px] rounded-lg object-cover shadow-lg' />
                    <div className='space-y-3'>
                        <div>
                            <h2>{name}</h2>
                            <p className='text-light-100 font-bold'>{originName}</p>
                        </div>
                        <InfoGenres detailMovie={{ categories }} />

                    </div>
                </div>
                <div className='flex-1'>
                    <p className='text-gray-300 mb-3' dangerouslySetInnerHTML={{ __html: description }} />
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

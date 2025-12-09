import { ChevronRight, Heart, Tv } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import InfoGenres from '../DetailMovie/Info/InfoGenres'
import { useFavorite } from '../../hooks/useFavorite'

const InfoMovie = ({ detailMovie: { id, name, slug, originName, description, posterUrl, categories } }) => {
    const { isFavorite, addFavorite, deleteFavorite } = useFavorite(id)
    return (
        <div className='section'>
            <div className='flex gap-6 flex-col'>
                {/* Action buttons */}
                <div className="action-button mt-5">
                    <button
                        onClick={() => {
                            isFavorite ? deleteFavorite() : addFavorite()
                        }}
                        className=" bg-pink-700 text-white">
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} />Yêu thích
                    </button>

                    <Link to={`/xem-chung/tao-phong/${slug}`}>
                        <button className="bg-blue-700 text-white">
                            <Tv className="w-5 h-5 fill-blue-700" />Xem chung
                        </button>
                    </Link>

                </div>
                <div className='flex md:flex-row flex-col gap-6' >
                    <div className='flex items-end gap-3 flex-1'>
                        <div className='aspect-3/4'>
                            <img
                                src={posterUrl}
                                alt="poster"
                                className='max-h-[120px] max-w-[90px] rounded-lg object-cover border-2 border-white shadow-lg'
                            />
                        </div>
                        <div className='space-y-3'>
                            <div>
                                <h2>{name}</h2>
                                <p className='text-yellow-400 font-bold '>{originName}</p>
                            </div>
                            <InfoGenres detailMovie={{ categories }} />

                        </div>
                    </div>
                    <div className='flex-1'>
                        <p className='text-gray-300 mb-3 text-sm md:text-base' dangerouslySetInnerHTML={{ __html: description }} />
                        <Link
                            to={`/phim/${slug}`}
                            className='bg-gray-800 px-2 py-1.5  rounded-lg  inline-flex items-center text-xs md:text-sm'>
                            Thông tin phim <ChevronRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoMovie

import { Play, Star } from 'lucide-react'
import React from 'react'
import InfoItem from './InfoItem'
import { Link } from 'react-router-dom'

const InfoMovie = ({ detailMovie }) => {
    const type = {
        generes: 'Thể loại',
        content: 'Nội dung',
        year: 'Năm phát hành',
        country: 'Quốc gia',
        status: 'Trạng thái',
        actors: ' Diễn viên',
        director: 'Đạo diễn'
    }

    return (
        <div>
            <section className='flex justify-between mb-10'>
                <h2>{detailMovie.origin_name}</h2>
                <span className='hidden px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100 md:inline-flex md:items-center gap-1 text-sm'>
                    <Star className='w-4 h-4' />
                    {detailMovie.tmdb.vote_average ? (
                        <>
                            <b>{`${detailMovie.tmdb.vote_average.toFixed(1)} /10`}</b>
                            <span className='text-white/50 '>({detailMovie.tmdb.vote_count})</span>
                        </>
                    ) : 'N/A'}

                </span>
            </section>

            <section>
                <div className="flex gap-3 mb-10">
                    {/* Poster */}
                    <div className="hidden lg:block ">
                        <img
                            src={detailMovie.poster_url}
                            alt="poster"
                            className="w-full h-auto max-h-[550px] rounded-lg object-cover shadow-lg"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="relative ">
                        <img
                            src={detailMovie.thumb_url}
                            alt="thumb"
                            className="w-full h-auto max-h-[550px] rounded-lg object-cover shadow-lg"
                        />
                        <Link to={`/xem-phim/${detailMovie.slug}`}>
                            <button className="z-10 absolute bottom-4 left-4 cursor-pointer bg-gray-900/60 font-bold gap-2 px-4 py-2 inline-flex items-center text-white rounded-full hover:bg-gray-500/60 transition">
                                <Play className="w-4 h-4" /> Xem ngay
                            </button>
                        </Link>
                    </div>
                </div>

            </section>

            <section className='flex flex-col'>
                <div className="bg-dark-100 text-white p-5 rounded-lg mb-10">
                    {/*review*/}
                    <div className='flex gap-2 mb-4'>
                        <span className='block md:hidden px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100'>Imdb <b>{(detailMovie.tmdb.vote_average) ? detailMovie.tmdb.vote_average.toFixed(1) : 'N/A'}</b></span>
                        <span className='px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100'> Phần {detailMovie.tmdb.season ? detailMovie.tmdb.season : 'N/A'}</span>
                        <span className='px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100' title='Số tập'>  {detailMovie.episode_total > 0 ? `Tập ${detailMovie.episode_total}` : 'Đang cập nhật'}</span>
                    </div>

                    {/* Genres */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {detailMovie.category.map((cat) => (
                            <span key={cat.id} className="px-3 py-1 rounded-lg bg-gray-800">{cat.name}</span>
                        ))}
                    </div>

                    {/* Current episode */}
                    <div className='bg-green-900 inline-block px-3 py-1 rounded-lg text-sm font-semibold text-green-800 mb-4'>
                        <span className='text-green-100'>{detailMovie.episode_current} </span>
                    </div>

                    {/* content */}
                    <p className="text-gray-300 mb-8">{detailMovie.content}</p>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-8">
                        <InfoItem label={type.year} value={detailMovie.year} />
                        <InfoItem label='Thời lượng' value={detailMovie.time} />
                        <InfoItem label={type.country} value={detailMovie.country.map((c) => c.name).join(', ')} />
                        <InfoItem label={type.actors} value={detailMovie.actor.join(', ')} />
                        <InfoItem label={type.director} value={detailMovie.director.join(', ')} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default InfoMovie

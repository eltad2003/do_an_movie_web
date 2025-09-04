import { Play, Star } from 'lucide-react'
import React from 'react'
import InfoItem from './InfoItem'
import { Link } from 'react-router-dom'
import InfoGenres from './InfoGenres'

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

        <section>
            {/*infos movie */}
            <div className="section">
                <h2 >Thông tin phim</h2>
                {/*review*/}
                <div className='flex gap-2 mb-4 flex-wrap'>
                    <span className='block md:hidden px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100'>Imdb <b>{(detailMovie.tmdb.vote_average) ? detailMovie.tmdb.vote_average.toFixed(1) : 'N/A'}</b></span>
                    <span className='px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100'> Phần {detailMovie.tmdb.season ? detailMovie.tmdb.season : 'N/A'}</span>
                    <span className='px-3 py-1 rounded-lg bg-yellow-900 text-yellow-100' title='Số tập'>  {detailMovie.episode_total > 0 ? `Tập ${detailMovie.episode_total}` : 'Đang cập nhật'}</span>
                </div>

                {/* Genres */}
                <InfoGenres detailMovie={detailMovie} />

                {/* Current episode */}
                <div className='bg-green-900 inline-block px-3 py-1 rounded-lg text-sm font-semibold text-green-800 mb-4'>
                    <span className='text-green-100'>{detailMovie.episode_current} </span>
                </div>

                {/* content */}
                <p className="text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: detailMovie.content }} />
                <div className="grid grid-cols-1 gap-y-3 ">
                    <InfoItem label={type.year} value={detailMovie.year} />
                    <InfoItem label='Thời lượng' value={detailMovie.time} />
                    <InfoItem label={type.country} value={detailMovie.country.map((c) => c.name).join(', ')} />
                    <InfoItem label={type.actors} value={detailMovie.actor.join(', ')} />
                    <InfoItem label={type.director} value={detailMovie.director.join(', ')} />
                </div>
            </div>

        </section>

    )
}

export default InfoMovie

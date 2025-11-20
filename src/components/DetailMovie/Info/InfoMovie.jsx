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

                {/* Genres */}
                <InfoGenres detailMovie={detailMovie} />

                {/* Current episode */}
                <div className='bg-green-900 inline-block px-3 py-1 rounded-lg text-sm font-semibold text-green-800 mb-4' title='tập phim'>
                    {detailMovie.episodes.length > 0
                        ? <span className='text-green-100'>{detailMovie.episodes.length} tập</span>
                        : <span className='text-green-50'>Đang cập nhật</span>}
                </div>

                {/* content */}
                <p className="text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: detailMovie.description }} />
                <div className="grid grid-cols-1 gap-y-3 ">
                    <InfoItem label={type.year} value={detailMovie.year} />
                    <InfoItem label='Thời lượng' value={detailMovie.duration} />
                    <InfoItem label={type.country} value={detailMovie.countries.map((c) => c.name).join(', ')} />
                    <InfoItem label={type.actors} value={detailMovie.actors.map((a) => a.name).join(', ')} />
                    <InfoItem label={type.director} value={detailMovie.directors.map((d) => d.name).join(', ')} />
                </div>
            </div>

        </section>

    )
}

export default InfoMovie

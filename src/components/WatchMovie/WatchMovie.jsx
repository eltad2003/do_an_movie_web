import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import { ChevronLeft, Play } from 'lucide-react'
import Episodes from '../DetailMovie/Episodes'
import Comment from '../DetailMovie/Comment'
import InfoMovie from './InfoMovie'
import VideoPlayer from './VideoPlayer'

const WatchMovie = () => {
  const { slug } = useParams()
  const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)
  return (
    <main>
      <div>

        {isLoading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {detailMovie && (
          <div className='container mx-auto flex flex-col p-5'>
            <header className='flex items-center gap-3 mb-5'>
              <Link to={`/phim/${detailMovie.slug}`}>
                <button className='text-dark font-bold btn'><ChevronLeft className='w-5 h-5' /></button>
              </Link>
              <h3 className='text-lg font-bold text-white flex-wrap'>Xem phim {detailMovie.name}</h3>
            </header>

            <VideoPlayer
              videoUrl="https://s5.phim1280.tv/20250305/AfwfXbUk/index.m3u8"
            />

            <InfoMovie detailMovie={detailMovie} />
            <Episodes episodes={episodes} isWatchMovie={true} />
            <Comment />

          </div>
        )}
      </div>
    </main>
  )
}

export default WatchMovie

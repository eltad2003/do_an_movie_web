import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import { ChevronLeft, Play } from 'lucide-react'
import Loading from '../UI/Loading'
import Comment from '../DetailMovie/Comment'
import InfoMovie from './InfoMovie'
import VideoPlayer from './VideoPlayer'
import ListEpisode from './ListEpisode'


const WatchMovie = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const epSlug = searchParams.get('ep')
  const serverVersion = searchParams.get('ver') || 0
  const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)
  return (
    <main>
      {isLoading && <Loading />}
      {errorMessage && <p className="text-red-500 text-center p-5">{errorMessage}</p>}
      {detailMovie && (
        <div className='wrapper'>
          <header className='flex items-center gap-3 mb-20'>
            <Link to={`/phim/${detailMovie.slug}`}>
              <button className='text-dark font-bold btn'><ChevronLeft className='w-5 h-5' /></button>
            </Link>
            <h3 className='text-lg font-bold text-white flex-wrap'>Xem phim {detailMovie.name}</h3>
          </header>

          {episodes[serverVersion].server_data.map(ep => ep.slug === epSlug && (
            <VideoPlayer
              key={ep.id}
              videoUrl={ep.link_embed}
            />
          ))}

          <InfoMovie detailMovie={detailMovie} />
          <ListEpisode episodes={episodes} detailMovie={detailMovie} epSlug={epSlug} />
          <Comment />

        </div>
      )}
    </main>
  )
}

export default WatchMovie

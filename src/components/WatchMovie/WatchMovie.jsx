import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import { ChevronLeft, Play } from 'lucide-react'
import Loading from '../UI/Loading'
import Comment from '../DetailMovie/Comment'
import InfoMovie from './InfoMovie'
import VideoPlayer from './VideoPlayer'
import Episodes from '../DetailMovie/Episodes'
import ListEpisode from './ListEpisode'


const WatchMovie = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const epSlug = searchParams.get('ep')
  const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)

  if (isLoading) { return <Loading /> }

  return (
    <main>

      {errorMessage && <p className="text-red-500 text-center p-5">{errorMessage}</p>}
      {detailMovie && (
        <div className='wrapper'>
          <header className='flex items-center gap-3 mb-10'>
            <Link to={`/phim/${detailMovie.slug}`}>
              <button className='btn text-sm'><ChevronLeft className='w-4 h-4' /></button>
            </Link>
            <h3 className='text-sm md:text-lg font-bold text-white flex-wrap '>Xem phim {detailMovie.name}</h3>
          </header>

          {episodes.map(ep => ep.slug === epSlug && (
            <VideoPlayer
              key={ep.id}
              videoUrl={ep.videoUrl}
            />
          ))}

          <InfoMovie detailMovie={detailMovie} />
          {/* <Episodes episodes={episodes} detailMovie={detailMovie} epSlug={epSlug} /> */}
          <ListEpisode episodes={episodes} detailMovie={detailMovie} epSlug={epSlug} />
          <Comment />

        </div>
      )}
    </main>
  )
}

export default WatchMovie

import { useParams } from 'react-router-dom'
import Loading from '../UI/Loading'
import { Play, SendHorizontal, Star } from 'lucide-react'
import Comment from './Comment'
import Episodes from './Episodes'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import InfoMovie from './Info/InfoMovie'
import Header from './Header'
import RecommendMovies from './RecommendMovies'

const DetailMovie = () => {
    const { slug } = useParams()
    const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)

    if (isLoading) { return <Loading /> }
    return (
        <main>
            {/* <div className='pattern'></div> */}
            {errorMessage && <p>Error: {errorMessage}</p>}
            {detailMovie && (
                <div>
                    <Header detailMovie={detailMovie} episodes={episodes} movieId={detailMovie.id} />
                    <div className='wrapper'>
                        <InfoMovie detailMovie={detailMovie} />
                        <Episodes episodes={episodes.sort((a, b) => a.name.localeCompare(b.name))} detailMovie={detailMovie} />
                        <Comment movieId={detailMovie.id} />
                    </div>
                    <RecommendMovies movieId={detailMovie.id} />
                </div>
            )}


        </main>
    )
}

export default DetailMovie


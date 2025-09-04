import { useParams } from 'react-router-dom'
import Loading from '../UI/Loading'
import { Play, SendHorizontal, Star } from 'lucide-react'
import Comment from './Comment'
import Episodes from './Episodes'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import InfoMovie from './Info/InfoMovie'
import Header from './Header'

const DetailMovie = () => {
    const { slug } = useParams()
    const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)

    if (isLoading) { return <Loading /> }
    return (
        <main>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {detailMovie && (
                <div>
                    <Header detailMovie={detailMovie} episodes={episodes} />
                    <div className='wrapper'>
                        <InfoMovie detailMovie={detailMovie} />
                        <Episodes episodes={episodes} detailMovie={detailMovie} />
                        <Comment />
                    </div>
                </div>
            )}


        </main>
    )
}

export default DetailMovie


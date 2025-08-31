import { useParams } from 'react-router-dom'
import Loading from '../UI/Loading'
import { Play, SendHorizontal, Star } from 'lucide-react'
import Comment from './Comment'
import Episodes from './Episodes'
import { useDetailMovie } from '../../hooks/useDetailMovie'
import InfoItem from './InfoItem'
import InfoMovie from './InfoMovie'

const DetailMovie = () => {
    const { slug } = useParams()
    const { detailMovie, episodes, isLoading, errorMessage } = useDetailMovie(slug)


    return (
        <main>
            <div >
                {isLoading && <Loading />}
                {errorMessage && <p>Error: {errorMessage}</p>}
                {detailMovie && (
                    <div className='container mx-auto flex flex-col p-5'>
                        <InfoMovie detailMovie={detailMovie} />
                        <Episodes episodes={episodes} detailMovie={detailMovie} />
                        <Comment />
                    </div>
                )}
            </div>

        </main>
    )
}

export default DetailMovie


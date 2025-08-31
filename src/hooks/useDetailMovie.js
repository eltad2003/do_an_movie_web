import { useState, useEffect } from 'react'
import { movieService } from '../services/movieService'

export const useDetailMovie = (slug) => {
    const [detailMovie, setDetailMovie] = useState()
    const [episodes, setEpisodes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchDetailMovies = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.getMovieDetail(slug)
                setDetailMovie(data.movie || [])
                setEpisodes(data.episodes || [])
            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDetailMovies()
    }, [slug])

    return { detailMovie, episodes, isLoading, errorMessage }
}

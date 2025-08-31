import { useState, useEffect } from 'react'
import { movieService } from '../services/movieService'

export const useMovies = (page = 1) => {
    const [listMovies, setListMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.getMovies(page)
                setListMovies(data.items || [])
            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovies()
    }, [page])

    return { listMovies, isLoading, errorMessage }
}

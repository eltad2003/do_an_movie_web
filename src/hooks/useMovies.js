import { useState, useEffect } from 'react'
import { movieService } from '../services/movieService'


export const useMovies = (page = 1) => {
    const [listMovies, setListMovies] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.getMovies(page)
                setListMovies(data.items || [])
                setTotalPages(data.pagination.totalPages || 0)
           
            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovies()
    }, [page])

    return { listMovies, totalPages, isLoading, errorMessage }
}

export const useMovieByCategory = (slugCat, page = 1) => {
    const [listMovies, setListMovies] = useState([])
    const [data, setData] = useState(null)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.moviesByCategory(slugCat, page)
                setListMovies(data.data.items || [])
                setTotalPages(data.data.params.pagination.totalPages || 0)
                setData(data.data)

            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovies()
    }, [page, slugCat])
    return { listMovies, data, totalPages, isLoading, errorMessage }
}
export const useMovieByCountry = (slugCountry, page = 1) => {
    const [listMovies, setListMovies] = useState([])
    const [data, setData] = useState(null)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.moviesByCountry(slugCountry, page)
                setListMovies(data.data.items || [])
                setTotalPages(data.data.params.pagination.totalPages || 0)
                setData(data.data)

            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovies()
    }, [page, slugCountry])
    return { listMovies, data, totalPages, isLoading, errorMessage }
}
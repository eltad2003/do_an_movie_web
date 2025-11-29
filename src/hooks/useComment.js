import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"

export const useComment = (movieId) => {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.getComments(movieId)
                setComments(data || [])


            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchComments()
    }, [movieId])

    return { comments, isLoading, errorMessage }
}
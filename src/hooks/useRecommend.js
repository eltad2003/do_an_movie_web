import { useEffect, useState } from "react";
import { movieService } from "../services/movieService";

export const useRecommend = (movieId) => {
    const [recommends, setRecommends] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchRecommendMovie = async () => {
            try {
                setIsLoading(true)
                const data = await movieService.getRecommendMovies(movieId)
                setRecommends(data)


            } catch (err) {
                setErrorMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRecommendMovie()
    }, [movieId])

    return { recommends, isLoading, errorMessage }
}

import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"
import { updateSearchCount } from "../utils/appwrite"

export const useSearch = (query) => {
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true)
            try {
                const data = await movieService.searchMovies(query)
                setSearchResults(data || [])

                if (query && data?.length > 0) {
                    await updateSearchCount(query, data[0])
                }
            } catch (error) {
                console.error("Error fetching search results:", error)
                setErrorMessage("Failed to fetch search results")
            } finally {
                setIsLoading(false)
            }
        }

        fetchSearchResults()
    }, [query])

    return { searchResults, isLoading, errorMessage }
}   
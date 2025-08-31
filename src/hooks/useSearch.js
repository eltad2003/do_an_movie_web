import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"

export const useSearch = (query) => {
    const [searchResults, setSearchResults] = useState([])
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const data = await movieService.searchMovies(query)
                setSearchResults(data.items || [])
            } catch (error) {
                console.error("Error fetching search results:", error)
            }
        }

        fetchSearchResults()
    }, [query])

    return { searchResults }
}   
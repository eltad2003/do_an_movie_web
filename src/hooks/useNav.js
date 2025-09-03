import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"

export const useNav = () => {
    const [categories, setCategories] = useState([])
    const [countries, setCountries] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataCategories, dataCountries] = await Promise.all([
                    movieService.getCategories(),
                    movieService.getCountries()

                ])
                setCategories(dataCategories || [])
                setCountries(dataCountries || [])
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchData()
    }, [])
    return { categories, countries }
}
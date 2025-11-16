import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"

export const useCategories = () => {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await movieService.manageCategories()
                setCategories(data || [])
            } catch (err) {
                console.error(err.message)
            }
        }

        fetchCategories()
    }, [])

    return { categories, setCategories }
}

export const useCountries = () => {
    const [countries, setCountries] = useState([])
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await movieService.manageCountries()
                setCountries(data || [])
            } catch (err) {
                console.error(err.message)
            }
        }

        fetchCountries()
    }, [])

    return { countries, setCountries }
}

export const useActors = () => {
    const [actors, setActors] = useState([])
    useEffect(() => {
        const fetchActors = async () => {
            try {
                const data = await movieService.manageActors()
                setActors(data || [])
            } catch (err) {
                console.error(err.message)
            }
        }

        fetchActors()
    }, [])

    return { actors, setActors }
}

export const useDirectors = () => {
    const [directors, setDirectors] = useState([])
    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const data = await movieService.manageDirectors()
                setDirectors(data || [])
            }
            catch (err) {
                console.error(err.message)
            }
        }
        fetchDirectors()
    }, [])

    return { directors, setDirectors }
}
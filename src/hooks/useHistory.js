import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

export const useSaveHistory = () => {
    const { user } = useContext(AuthContext)
    const saveHistory = async (episodeId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    episodeId: episodeId
                }),
            })
            if (!res.ok) {
                throw new Error('Failed to save history')
            }
            const data = await res.json()
            console.log('History saved:', data)
        } catch (error) {
            console.error('Error saving history:', error)
        }
    }
    return { saveHistory }
}

export const useHistory = () => {
    const [watchHistory, setWatchHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)

    const fetchWatchHistory = async () => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BE}/api/history/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })

            if (res.ok) {
                const historyData = await res.json()
                if (!historyData || historyData.length === 0) {
                    setWatchHistory([])
                    setLoading(false)
                    return
                }
                // save history with detailed movie info and episode slug
                const detailedHistory = await Promise.all(
                    historyData.map(async (record) => {
                        try {
                            const movieRes = await fetch(`${import.meta.env.VITE_BE}/movies/id/${record.episode.movieId}`)
                            if (movieRes.ok) {
                                const movie = await movieRes.json()
                                return {
                                    historyId: record.id,
                                    episodeSlug: record.episode.slug,
                                    episodeName: record.episode.name,
                                    watchedAt: record.watchedAt,
                                    movie
                                }
                            }
                            return null
                        } catch (error) {
                            console.error(`Error fetching episode ${record.episode.id}:`, error)
                            return null
                        }
                    })
                )

                // sort by watchedAt desc
                const filteredHistory = detailedHistory
                    .filter(item => item !== null)
                    .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))

                setWatchHistory(filteredHistory)
                console.log('History data:', filteredHistory)
            } else {
                const errorText = await res.text()
                console.error('Error response:', errorText)
                toast.error('Không thể tải lịch sử xem phim')
            }
        } catch (error) {
            console.error('Error fetching watch history:', error)
            toast.error('Không thể tải lịch sử xem phim')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWatchHistory()
    }, [])

    return { watchHistory, loading, setWatchHistory }
}
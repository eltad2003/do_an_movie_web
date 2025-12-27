export const increaseViewCount = async (movieId) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BE}/movies/${movieId}/view`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!res.ok) {
            throw new Error('Failed to increase view count')
        }

    } catch (error) {
        console.error('Error increasing view count:', error)
    }
}
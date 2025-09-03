// Format duration
export const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export const formatPosterUrl = (url) => {
    if (!url) return '/images/placeholder-movie.jpg'

    if (url.startsWith('https://phimimg.com/')) return url

    return `https://phimimg.com${url.startsWith('/') ? url : `/${url}`}`
}

export const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};
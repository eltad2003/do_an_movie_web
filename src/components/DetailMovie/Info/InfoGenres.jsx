import React from 'react'
import { Link } from 'react-router-dom'

const InfoGenres = ({ detailMovie: { categories } }) => {
    return (
        <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
                <Link
                    to={`/the-loai/${cat.slug}`}
                    key={cat.id}
                    className="px-3 py-1 bg-purple-600/30 backdrop-blur-sm rounded-full text-sm text-light-100"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    )
}

export default InfoGenres

import React from 'react'
import { Link } from 'react-router-dom'

const InfoGenres = ({ detailMovie: { categories } }) => {
    return (
        <div className="flex gap-1 mb-4 flex-wrap">
            {categories.map((cat) => (
                <Link
                    to={`/the-loai/${cat.slug}`}
                    key={cat.id}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-light-200 hover:text-white cursor-pointer"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    )
}

export default InfoGenres

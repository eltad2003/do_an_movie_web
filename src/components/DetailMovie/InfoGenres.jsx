
import React from 'react'
import { Link } from 'react-router-dom'

const InfoGenres = ({ detailMovie: { category } }) => {
    return (
        <div className="flex gap-2 mb-4 flex-wrap">
            {category.map((cat) => (
                <Link
                    to={`/the-loai/${cat.slug}`}
                    key={cat.id}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-white/90 hover:text-light-100 cursor-pointer"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    )
}

export default InfoGenres

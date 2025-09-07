import React from 'react'

const Skeleton = () => {
    return (

        <div className="wrapper">
            <ul className=''>
                {[...Array(10)].map((_, index) => (
                    <div key={index} className='bg-dark-100 p-5 rounded-2xl transition cursor-pointer mb-5 animate-pulse'>
                        <div className="h-64 bg-gray-700 rounded-lg mb-3"></div>
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                ))}
            </ul>
        </div>

    )
}

export default Skeleton

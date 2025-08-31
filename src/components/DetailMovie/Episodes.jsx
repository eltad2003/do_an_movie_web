import { Play } from 'lucide-react'
import React from 'react'

const Episodes = ({ episodes }) => {
    return (
        <div className='mb-10 bg-dark-100 text-white p-5 rounded-lg'>
            <h3 className='text-xl font-bold mb-6'>Danh sách tập</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                {episodes.map(e => e.server_data.map((ep, idx) => (
                    <div key={idx} className='text-sm px-3 py-2 rounded-lg bg-gray-800 inline-flex cursor-pointer gap-2 items-center justify-center hover:bg-gray-700 transition'>
                        <Play className='w-4 h-4' />
                        {ep.name}
                    </div>
                )))}
            </div>
        </div>
    )
}

export default Episodes

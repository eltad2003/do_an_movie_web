import React from 'react'

const InfoItem = ({ label, value }) => {
    return (
        <div className='flex gap-3'>
            <p className="text-gray-400 font-semibold w-[120px]">{label}</p>
            <p className="text-white flex-1">{value}</p>
        </div>
    )
}

export default InfoItem

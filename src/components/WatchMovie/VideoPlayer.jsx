import React from 'react'

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div className='w-full aspect-video mb-20'>
            <iframe
                src={videoUrl}
                className='w-full h-full'
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture "
                title="Video Player"
            />
        </div>
    )
}

export default VideoPlayer
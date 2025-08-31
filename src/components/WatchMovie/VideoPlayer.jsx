import React from 'react'

const VideoPlayer = ({ videoUrl }) => {
    const playerUrl = `https://player.phimapi.com/player/?url=${encodeURIComponent(videoUrl)}`

    return (
        <div className='w-full aspect-video bg-black rounded-lg overflow-hidden mb-8'>
            <iframe
                src={playerUrl}
                className='w-full h-full'
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Video Player"
                frameBorder="0"
            />
        </div>
    )
}

export default VideoPlayer
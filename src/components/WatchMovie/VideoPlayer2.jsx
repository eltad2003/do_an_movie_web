import Hls from 'hls.js';
import React, { useEffect, useRef } from 'react'

const VideoPlayer2 = ({ videoUrl }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        const video = videoRef.current;
        if (Hls.isSupported() && videoUrl.endsWith('.m3u8')) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // videoRef.current.play();
            });
            return () => {
                if (hls) hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            // videoRef.current.play();
        }

    }, [videoUrl]);
    return (
        <div className='aspect-video w-full'>
            <video ref={videoRef} controls className='w-full h-full' />
        </div>
    )
}

export default VideoPlayer2
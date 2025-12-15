import { Crown, RefreshCcw, Share2, Users, WifiSync } from 'lucide-react';
import React, { useEffect } from 'react';
import Hls from 'hls.js';
import { handleCopy } from '../../utils/helpers';



const VideoSocket = ({ room, videoUrl, videoRef, isConnected, isHost, handleUserAction, sendRequestSync }) => {
    // Thiết lập HLS nếu cần
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
        }
    }, [videoUrl]);


    return (
        <div className='w-full aspect-video relative'>
            {isConnected ? (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Đã kết nối
                </div>
            ) : (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    Đang kết nối...
                </div>
            )}
            <video
                ref={videoRef}
                controls
                className='w-full h-full object-contain cursor-pointer'
                src={videoUrl}
                onPlay={isHost && (() => handleUserAction('PLAY'))}
                onPause={isHost && (() => handleUserAction('PAUSE'))}
                onSeeked={isHost && (() => handleUserAction('SEEK'))}
            />
            {/* Participants Count */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {room.currentViewers}
            </div>
            <div className="p-4 bg-dark-200 rouneded rounded-b-lg">
                <div className="flex justify-between items-start">
                    <div className='flex flex-col gap-3'>

                        <div className='flex items-center gap-3'>
                            {!isHost && (
                                <button
                                    onClick={sendRequestSync}
                                    className='inline-flex items-center gap-2 text-sm px-1.5 py-0.5 cursor-pointer text-light-100 rounded-lg border-1 border-white'>
                                    <RefreshCcw className='w-5 h-5' /> Đồng bộ
                                </button>
                            )}
                            <button
                                onClick={() => handleCopy(room.id)}
                                className="px-1.5 py-0.5 inline-flex items-center gap-2 text-sm cursor-pointer text-light-100 rounded-lg border-1 border-white" >
                                <Share2 className="w-5 h-5" />
                                Mời bạn bè
                            </button>
                        </div>
                        <h2 >
                            <span>{room.movieName} - <span className='text-white/70 font-medium '>{room.episodeName}</span></span>
                        </h2>
                    </div>

                    {isHost && (
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-300 text-dark-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <Crown className="w-5 h-5" />
                                Chủ phòng
                            </span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VideoSocket;
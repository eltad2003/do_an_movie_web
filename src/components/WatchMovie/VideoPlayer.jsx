import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    Settings,
    ArrowLeftRight,
    SkipBack,
    SkipForward,
    Loader2,
    AlertCircle,
    Volume1
} from "lucide-react";

export default function VideoPlayerCustom({ videoUrl }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const hlsRef = useRef(null);
    const hideTimerRef = useRef(null);

    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [videoError, setVideoError] = useState(null);

    // HLS specific state
    const [levels, setLevels] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState("auto");
    // 1. INITIALIZE VIDEO (HLS or MP4)

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        // Reset states khi đổi URL
        setIsBuffering(true);
        setVideoError(null);
        setIsPlaying(false);
        setLevels([]);
        setSelectedQuality("auto");

        // Cleanup HLS cũ nếu có
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const isHLS = videoUrl.includes('.m3u8');

        // Setup Video Properties
        video.crossOrigin = "anonymous"; // Quan trọng cho Cloudinary/CDN

        const loadVideo = () => {
            // A. Trường hợp dùng HLS.js (Chrome, Firefox, Edge...)
            if (isHLS && Hls.isSupported()) {
                console.log("Loading HLS via hls.js");
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsRef.current = hls;

                hls.loadSource(videoUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    console.log(`Manifest loaded, found ${data.levels.length} quality levels`);
                    setLevels(hls.levels); // Lưu danh sách độ phân giải
                    // video.play().catch(() => {/* Autoplay block is fine */ });
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("Network error, trying to recover...");
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log("Media error, trying to recover...");
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error("Unrecoverable HLS error");
                                setVideoError("Cannot load video stream.");
                                hls.destroy();
                                break;
                        }
                    }
                });
            }
            // B. Trường hợp Safari (Native HLS)
            else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
                console.log("Loading Native HLS (Safari)");
                video.src = videoUrl;
            }
            // C. Trường hợp MP4/WebM thường
            else {
                console.log("Loading Standard Video (MP4/WebM)");
                video.src = videoUrl;
            }
        };

        loadVideo();

        // Cleanup function
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
            video.removeAttribute('src');
            video.load();
        };
    }, [videoUrl]);

    // =========================================================
    // 2. STANDARD EVENT LISTENERS (Chung cho cả HLS & MP4)
    // =========================================================
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false); // Đã buffer xong và đang chạy
        const onCanPlay = () => setIsBuffering(false);

        const onTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            // Fallback: nếu đang chạy mà time update thì chắc chắn ko buffering
            if (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
                setIsBuffering(false);
            }
        };

        const onLoadedMetadata = () => {
            setDuration(video.duration);
            setIsBuffering(false);
        };

        const onError = (e) => {
            console.error("Video Error:", video.error);
            setVideoError("Error loading video format.");
            setIsBuffering(false);
        };

        // Gán sự kiện
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("waiting", onWaiting);
        video.addEventListener("playing", onPlaying);
        video.addEventListener("canplay", onCanPlay);
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("error", onError);

        return () => {
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("waiting", onWaiting);
            video.removeEventListener("playing", onPlaying);
            video.removeEventListener("canplay", onCanPlay);
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
        };
    }, [videoUrl]);

    // =========================================================
    // 3. CONTROLS LOGIC
    // =========================================================

    const togglePlay = async () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            try {
                await videoRef.current.play();
            } catch (err) {
                console.error(err);
            }
        } else {
            videoRef.current.pause();
        }
    };

    const seekTo = (time) => {
        if (!videoRef.current) return;
        const target = Math.max(0, Math.min(time, duration));
        videoRef.current.currentTime = target;
        setCurrentTime(target);
    };

    const handleVolume = (newVol) => {
        if (!videoRef.current) return;
        const v = Math.max(0, Math.min(1, newVol));
        videoRef.current.volume = v;
        videoRef.current.muted = v === 0;
        setVolume(v);
        setIsMuted(v === 0);
    };

    const handlePlaybackRate = (rate) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        document.getElementById('speed-details')?.removeAttribute('open');
    };

    const handleQualityChange = (index) => {
        if (!hlsRef.current) return;
        hlsRef.current.currentLevel = Number(index);
        setSelectedQuality(String(index));
        document.getElementById('quality-details')?.removeAttribute('open');
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(console.error);
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(console.error);
            setIsFullscreen(false);
        }
    };

    // Auto hide controls
    useEffect(() => {
        const resetTimer = () => {
            setShowControls(true);
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        const el = containerRef.current;
        if (el) {
            el.addEventListener("mousemove", resetTimer);
            el.addEventListener("touchstart", resetTimer);
            el.addEventListener("click", resetTimer);
        }
        return () => {
            if (el) {
                el.removeEventListener("mousemove", resetTimer);
                el.removeEventListener("touchstart", resetTimer);
                el.removeEventListener("click", resetTimer);
            }
        };
    }, [isPlaying]);
    // Hotkeys
    useEffect(() => {
        const onKey = (e) => {
            const active = document.activeElement;
            if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

            if (e.code === "Space" || e.key.toLowerCase() === "k") {
                e.preventDefault();
                togglePlay();
            } else if (e.key.toLowerCase() === "j") {
                seekTo(Math.max(0, currentTime - 10));
            } else if (e.key.toLowerCase() === "l") {
                seekTo(Math.min(duration, currentTime + 10));
            } else if (e.key === "f") {
                toggleFullscreen();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [currentTime, duration]);

    // Format time helper
    const fmt = (s) => {
        if (!isFinite(s)) return "00:00";
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        const str = `${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`;
        return h > 0 ? `${h}:${str}` : str;
    };



    // =========================================================
    // 4. RENDER
    // =========================================================
    return (
        <div
            ref={containerRef}
            className="group relative w-full aspect-video bg-black overflow-hidden mb-10"
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                playsInline
            />

            {/* Error Layer */}
            {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 text-white">
                    <AlertCircle size={48} className="text-red-500 mb-2" />
                    <p className="font-semibold">{videoError}</p>
                </div>
            )}

            {/* Buffering Layer */}
            {isBuffering && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <Loader2 size={48} className="animate-spin text-white/80" />
                </div>
            )}

            {/* Control Bar */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 py-3 transition-opacity duration-300 z-20 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Progress Bar */}
                <div
                    className="w-full h-1.5 bg-white/30 rounded cursor-pointer hover:h-2.5 transition-all mb-3 relative group/progress"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        seekTo(percent * duration);
                    }}
                >
                    <div
                        className="h-full bg-purple-500 rounded relative"
                        style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md" />
                    </div>
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="hover:text-purple-400 transition">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>

                        {/* Skip Buttons */}
                        <div className="flex gap-2">
                            <button onClick={() => seekTo(currentTime - 10)} className="hover:text-purple-400 p-1">
                                <SkipBack size={20} />
                            </button>
                            <button onClick={() => seekTo(currentTime + 10)} className="hover:text-purple-400 p-1">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={() => handleVolume(isMuted ? 1 : 0)} className="hover:text-purple-400">
                                {isMuted || volume === 0 ? <VolumeX size={24} /> : volume <= 0.4 ? <Volume1 size={24} /> : <Volume2 size={24} />}
                            </button>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={volume}
                                onChange={(e) => handleVolume(parseFloat(e.target.value))}
                                className="w-20 h-0.5 bg-light-100"
                            />
                        </div>

                        {/* Time */}
                        <span className="select-none">
                            {fmt(currentTime)} / {fmt(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Playback Speed */}
                        <div className="relative">
                            <details id="speed-details" className="group/menu">
                                <summary className="list-none cursor-pointer flex items-center gap-1 hover:text-purple-400 text-sm font-medium">
                                    <ArrowLeftRight size={18} />
                                    <span>{playbackRate}x</span>
                                </summary>
                                <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg p-1 min-w-[80px] flex flex-col gap-1 shadow-xl">
                                    {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                                        <button
                                            key={rate}
                                            onClick={() => handlePlaybackRate(rate)}
                                            className={`text-xs px-2 py-1.5 rounded text-left hover:bg-white/20 ${playbackRate === rate ? 'text-purple-400 font-bold' : 'text-white'}`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            </details>
                        </div>

                        {/* Quality Selector (Only for HLS) */}
                        {levels.length > 0 && (
                            <div className="relative">
                                <details id="quality-details" className="group/menu">
                                    <summary className="list-none cursor-pointer hover:text-purple-400 transition">
                                        <Settings size={20} />
                                    </summary>
                                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg p-1 min-w-[120px] flex flex-col gap-1 shadow-xl max-h-60 overflow-y-auto">
                                        <button
                                            onClick={() => handleQualityChange(-1)}
                                            className={`text-xs px-2 py-1.5 rounded text-left hover:bg-white/20 ${selectedQuality === 'auto' ? 'text-purple-400 font-bold' : 'text-white'}`}
                                        >
                                            Auto
                                        </button>
                                        {levels.map((level, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQualityChange(index)}
                                                className={`text-xs px-2 py-1.5 rounded text-left hover:bg-white/20 ${selectedQuality === String(index) ? 'text-purple-400 font-bold' : 'text-white'}`}
                                            >
                                                {level.height}p
                                            </button>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="hover:text-purple-400 transition">
                            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
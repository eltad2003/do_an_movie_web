import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
    Play,
    Pause,
    Volume2,
    Maximize2,
    Minimize2,
    RefreshCw,
    Settings,
    ArrowLeftRight,
    SkipBack,
    SkipForward,
} from "lucide-react";

// VideoPlayerCustom
// - HLS (.m3u8) via hls.js
// - Custom UI (Play, progress, volume, speed, quality, fullscreen)
// - Auto-hide control bar
// - Hotkeys: Space (play/pause), K (play/pause), J (seek -10s), L (seek +10s)
// - Auto reconnect logic on error

export default function VideoPlayerCustom({ videoUrl }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const hlsRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [levels, setLevels] = useState([]); // quality levels from hls
    const [selectedQuality, setSelectedQuality] = useState("auto");
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // Auto-hide controls timer
    const hideTimerRef = useRef(null);

    // Reconnect config
    const MAX_RECONNECT = 4;
    const RECONNECT_DELAY_MS = 2000;

    // Initialize HLS or native playback
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        // cleanup previous instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // Safari/native support
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;
        } else if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsRef.current = hls;

            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(videoUrl);
            });

            // When levels (qualities) are parsed
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const foundLevels = hls.levels || [];
                setLevels(foundLevels);
                setSelectedQuality("auto");
            });

            // update buffering state
            hls.on(Hls.Events.BUFFER_STALLED, () => setIsBuffering(true));
            hls.on(Hls.Events.BUFFER_APPENDED, () => setIsBuffering(false));

            // error handling + reconnect logic
            hls.on(Hls.Events.ERROR, (event, data) => {
                const { type, details, fatal } = data;
                console.warn("HLS error", type, details, fatal);

                if (fatal) {
                    // Attempt to recover based on error
                    if (reconnectAttempts < MAX_RECONNECT) {
                        setReconnectAttempts((s) => s + 1);
                        setTimeout(() => {
                            tryReconnect();
                        }, RECONNECT_DELAY_MS);
                    } else {
                        console.error("Max reconnect attempts reached");
                    }
                }
            });

            // expose hls for quality switching
        }

        // standard video event listeners
        const onLoadedMeta = () => setDuration(video.duration || 0);
        const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onVolumeChange = () => {
            setIsMuted(video.muted);
            setVolume(video.volume);
        };

        video.addEventListener("loadedmetadata", onLoadedMeta);
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("volumechange", onVolumeChange);

        return () => {
            video.removeEventListener("loadedmetadata", onLoadedMeta);
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("volumechange", onVolumeChange);
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl]);

    // reconnect helper
    function tryReconnect() {
        const video = videoRef.current;
        if (!video) return;

        setIsBuffering(true);

        // destroy and recreate HLS instance
        if (hlsRef.current) {
            try {
                hlsRef.current.destroy();
            } catch (e) {
                console.warn(e);
            }
            hlsRef.current = null;
        }

        // small delay then re-init
        setTimeout(() => {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsRef.current = hls;
            hls.attachMedia(video);
            hls.loadSource(videoUrl);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsBuffering(false);
                // try to resume playback
                if (video.paused === false || isPlaying) {
                    video.play().catch(() => { });
                }
            });
        }, 800);
    }

    // Play/pause toggle
    const togglePlay = async () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            try {
                await video.play();
            } catch (e) {
                // autoplay blocked
            }
        } else {
            video.pause();
        }
    };

    // Seek by fraction or seconds
    const seekTo = (seconds) => {
        const video = videoRef.current;
        if (!video || !duration) return;
        video.currentTime = Math.max(0, Math.min(duration, seconds));
    };

    // handle progress bar clicks
    const onProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const perc = (e.clientX - rect.left) / rect.width;
        seekTo(perc * duration);
    };

    // Volume
    const onVolumeChange = (v) => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = Math.max(0, Math.min(1, v));
        video.muted = video.volume === 0;
        setVolume(video.volume);
        setIsMuted(video.muted);
    };

    // Speed
    const changePlaybackRate = (rate) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = rate;
        setPlaybackRate(rate);
    };

    // Quality switch (level index) - "auto" uses -1
    const changeQuality = (q) => {
        const video = videoRef.current;
        const hls = hlsRef.current;
        if (!hls || !video) {
            setSelectedQuality("auto");
            return;
        }

        if (q === "auto") {
            hls.currentLevel = -1; // auto
            setSelectedQuality("auto");
        } else {
            hls.currentLevel = Number(q);
            setSelectedQuality(String(q));
        }
    };

    // Fullscreen
    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(() => { });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => { });
            setIsFullscreen(false);
        }
    };

    // Hotkeys
    useEffect(() => {
        const onKey = (e) => {
            if (!containerRef.current) return;
            // If focus is in an input, skip
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, duration]);

    // Auto-hide controls
    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(hideTimerRef.current);
            setShowControls(true);
            hideTimerRef.current = setTimeout(() => setShowControls(false), 2000);
        };

        const root = containerRef.current;
        if (!root) return;
        root.addEventListener("mousemove", resetTimer);
        root.addEventListener("touchstart", resetTimer);

        resetTimer();
        return () => {
            clearTimeout(hideTimerRef.current);
            root.removeEventListener("mousemove", resetTimer);
            root.removeEventListener("touchstart", resetTimer);
        };
    }, []);

    // format time mm:ss
    const fmt = (s = 0) => {
        if (!isFinite(s)) return "0:00";
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
    };

    return (
        <div ref={containerRef} className="w-full relative aspect-video mb-20">
            <div className="relative rounded-lg" style={{ paddingTop: '56.25%' }}>
                {/* Video element positioned absolute to keep aspect ratio */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 "
                    playsInline
                    // don't autoplay by default to avoid browser blocks; user can trigger play
                    onClick={togglePlay}
                />

                {/* Loading / buffering indicator */}
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full" />
                    </div>
                )}



            </div>
            {/* Controls overlay */}
            <div
                className={`absolute bg-dark-200/50 text-white bottom-0 left-0 right-0 transition-opacity duration-200 bg-gradient-to-t from-black/20 to-transparent px-4 py-3 z-30 ${showControls ? "opacity-100" : "opacity-0"}`}
            >
                {/* Top row */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                // skip back 10s
                                seekTo(Math.max(0, currentTime - 10));
                            }}
                            className="p-2 rounded-md hover:bg-white/20"
                            title="Skip back 10s (J)">
                            <SkipBack size={16} />
                        </button>

                        <button onClick={togglePlay} className="p-2  hover:bg-white/20 rounded-full border-3 border-gray-500 cursor-pointer">
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>

                        <button
                            onClick={() => {
                                seekTo(Math.min(duration, currentTime + 10));
                            }}
                            className="p-2 rounded-md hover:bg-white/20"
                            title="Skip forward 10s (L)">
                            <SkipForward size={16} />
                        </button>

                        <div className="ml-2 text-sm select-none">{fmt(currentTime)} / {fmt(duration)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Volume */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const v = isMuted ? Math.max(0.1, volume) : 0;
                                    onVolumeChange(v);
                                }}
                                className="p-2 rounded-md hover:bg-white/20 "
                            >
                                <Volume2 size={16} />
                            </button>
                            <input
                                aria-label="Volume"
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                className="w-24"
                            />
                        </div>

                        {/* Speed menu */}
                        <div className="relative z-50">
                            <details className="group">
                                <summary className="flex items-center gap-1 p-2 rounded-md hover:bg-white/20 cursor-pointer  list-none">
                                    <ArrowLeftRight size={16} />
                                    <span className="text-sm">{playbackRate}x</span>
                                </summary>
                                <div className="absolute bottom-full mb-2 right-0 w-36 bg-gray-900 text-white rounded-lg shadow-2xl p-2 border border-gray-700">
                                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => {
                                                changePlaybackRate(r);
                                                // Close dropdown
                                                const details = document.querySelector('details.group');
                                                if (details) details.removeAttribute('open');
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20/10 transition ${playbackRate === r ? 'font-semibold bg-purple-600' : ''}`}
                                        >
                                            {r}x
                                        </button>
                                    ))}
                                </div>
                            </details>
                        </div>

                        {/* Quality menu */}
                        <div className="relative z-50">
                            <details className="relative">
                                <summary className="flex items-center gap-1 p-2 rounded-md hover:bg-white/20 cursor-pointer">
                                    <Settings size={16} />
                                    <span className="text-sm">{selectedQuality === 'auto' ? 'Auto' : `${levels[selectedQuality]?.height || 'Q'}`}</span>
                                </summary>
                                <div className="absolute bottom-full mb-2 right-0 w-36 bg-gray-900 text-white rounded-lg shadow-2xl p-2 border border-gray-700">
                                    <button onClick={() => changeQuality('auto')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition ${selectedQuality === 'auto' ? 'font-semibold bg-purple-600' : ''}`}>Auto</button>
                                    {levels.map((lev, idx) => (
                                        <button

                                            key={idx}
                                            onClick={() => changeQuality(String(idx))}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition ${selectedQuality === String(idx) ? 'font-semibold bg-purple-600' : ''}`}
                                        >
                                            {lev.width}x{lev.height} ({Math.round(lev.bitrate / 1000)}kbps)
                                        </button>
                                    ))}
                                </div>
                            </details>
                        </div>

                        {/* Reconnect button */}
                        <button onClick={() => tryReconnect()} title="Reconnect" className="p-2 rounded-md hover:bg-white/20">
                            <RefreshCw size={16} />
                        </button>

                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="p-2 rounded-md hover:bg-white/20">
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer" onClick={onProgressClick}>
                    <div className="h-2 bg-light-100 rounded" style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }} />
                </div>
            </div>

            {/* Small footer note / controls when controls hidden */}
            {/* <div className="mt-2 text-xs text-gray-400 text-center select-none">Custom HLS Player • Hotkeys: Space/K Play-Pause, J/L Seek</div> */}
        </div>
    );
}

import { Client } from '@stomp/stompjs';
import { Crown, RefreshCcw, Users, WifiSync } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import SockJS from "sockjs-client/dist/sockjs";


const VideoSocket = ({ room, user, videoUrl }) => {
    const videoRef = useRef(null);
    const stompClientRef = useRef(null);
    const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
    const [isConnected, setIsConnected] = useState(false); // Thêm state để biết đã kết nối chưa
    const isHost = room.hostId === user.id || room.hostName === user.name;

    useEffect(() => {
        // Cấu hình Client
        const stompClient = new Client({
            // Lưu ý: webSocketFactory nên trả về một instance mới
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-watch-party'),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true); // Đánh dấu là đã kết nối

                stompClient.subscribe(`/topic/room/${room.id}`, (message) => {
                    const action = JSON.parse(message.body);
                    handleRemoteAction(action);
                });

                sendJoinSignal(stompClient)
            },
            onDisconnect: () => {
                console.log('Disconnected');
                setIsConnected(false);
            },
            // Tự động kết nối lại nếu rớt mạng
            reconnectDelay: 5000,
        });

        // 1. KÍCH HOẠT KẾT NỐI (Bạn bị thiếu dòng này)
        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            // Hủy kết nối khi component unmount
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [room.id]);

    // Hàm gửi tín hiệu JOIN
    const sendJoinSignal = (client) => {
        if (client && client.connected) {
            client.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'JOIN',
                    roomId: room.id,
                    senderId: user.id,
                    senderName: user.name
                })
            });
        }
    };

    const sendSyncSignal = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            const video = videoRef.current;
            stompClientRef.current.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'SYNC',
                    roomId: room.id,
                    timestamp: video.currentTime,
                    senderId: user.id,
                    senderName: user.name,
                    isPlaying: !video.paused
                })
            });
        }
    }

    const handleRemoteAction = (action) => {
        if (action.senderId === user.id) return;
        const video = videoRef.current;

        switch (action.type) {
            case 'JOIN':
                // Nếu mình là HOST, mình phải có trách nhiệm gửi dữ liệu chuẩn cho người mới
                if (room.hostId === user.id || room.hostName === user.name) {
                    console.log("Người mới vào, Host đang gửi dữ liệu đồng bộ...");
                    sendSyncSignal();
                }
                break;

            case 'SYNC':
                // Nhận dữ liệu đồng bộ (chỉ áp dụng nếu mình lệch quá nhiều hoặc mới vào)
                setIsRemoteUpdate(true);

                // Nhảy tới đúng giây
                if (Math.abs(video.currentTime - action.timestamp) > 0.5) {
                    video.currentTime = action.timestamp;
                }

                // Đồng bộ trạng thái Play/Pause
                if (action.isPlaying) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }

                setTimeout(() => setIsRemoteUpdate(false), 500);
                break;

            case 'PLAY':
                setIsRemoteUpdate(true);
                video.play().catch(() => { });
                setTimeout(() => setIsRemoteUpdate(false), 500);
                break;

            case 'PAUSE':
                setIsRemoteUpdate(true);
                video.pause();
                setTimeout(() => setIsRemoteUpdate(false), 500);
                break;

            case 'SEEK':
                setIsRemoteUpdate(true);
                video.currentTime = action.timestamp;
                setTimeout(() => setIsRemoteUpdate(false), 500);
                break;

            default:
                break;
        }

    };

    const handleUserAction = (type) => {
        if (isRemoteUpdate) return;

        // 2. KIỂM TRA KẾT NỐI TRƯỚC KHI GỬI
        // Nếu stompClient chưa tồn tại hoặc chưa kết nối thì không gửi lệnh
        if (stompClientRef.current && stompClientRef.current.connected) {
            const video = videoRef.current;
            stompClientRef.current.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: type,
                    roomId: room.id,
                    timestamp: video.currentTime,
                    senderId: user.id,
                    senderName: user.name
                })
            });
        } else {
            console.warn("Socket chưa kết nối, không thể gửi lệnh:", type);
        }
    };

    return (
        <div className='w-full aspect-video'>
            {/* Hiển thị trạng thái kết nối để debug */}
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
            <div className="p-4 bg-dark-200">
                <div className="flex justify-between items-start">
                    <div className='flex flex-col gap-3'>
                        <h3 className="text-white font-bold text-lg">
                            <span>{room.movieName} {room.episodeName}</span>
                        </h3>
                        <div>

                            <button
                                onClick={() => handleRemoteAction('SYNC')}
                                className='inline-flex items-center gap-2 text-sm px-1.5 py-0.5 cursor-pointer text-light-100 rounded-lg border-1 border-white'>
                                <RefreshCcw className='w-5 h-5' /> Đồng bộ
                            </button>
                        </div>
                    </div>

                    {/* Host Controls */}
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
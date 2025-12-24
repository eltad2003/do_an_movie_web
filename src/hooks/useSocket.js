import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

export const useSocket = (room, user) => {
    const videoRef = useRef(null);
    const stompClientRef = useRef(null);
    const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [views, setViews] = useState(0);
    //  {id: '',
    //     senderName: '',
    //     message: '',
    //     time: ''}
    const isHost = String(room?.hostId) === String(user?.id) || room?.hostName === user?.name;

    useEffect(() => {
        // Cấu hình Client
        const stompClient = new Client({
            // Lưu ý: webSocketFactory nên trả về một instance mới
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BE}/ws-watch-party`),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);

                stompClient.subscribe(`/topic/room/${room.id}`, (message) => {
                    const action = JSON.parse(message.body);
                    console.log(action);
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

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            // Hủy kết nối khi component unmount
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [room?.id, user?.id]);

    // Hàm gửi tín hiệu JOIN
    const sendJoinSignal = (client) => {
        if (client && client.connected) {
            client.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'JOIN',
                    roomId: room.id,
                    senderId: String(user.id),
                    senderName: user.name,
                    currentViewers: views
                })
            });
        }
    };
    const sendLeaveSignal = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'LEAVE',
                    roomId: room.id,
                    senderId: String(user.id),
                    senderName: user.name,
                    currentViewers: views
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
                    senderId: String(user.id),
                    senderName: user.name,
                    isPlaying: !video.paused
                })
            });
        }
    }
    const sendRequestSync = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("Đang yêu cầu chủ phòng đồng bộ...");
            stompClientRef.current.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'REQUEST_SYNC', // Gửi tín hiệu "Cho tôi xin thời gian chuẩn"
                    roomId: room.id,
                    senderId: String(user.id),
                    senderName: user.name
                })
            });
        }
    };

    const handleRemoteAction = (action) => {
        if (action.senderId === user.id) return;
        const video = videoRef.current;

        switch (action.type) {
            case 'JOIN':
                setMessages(prev => [...prev, {
                    id: String(action.senderId),
                    senderName: action.senderId === String(user.id) ? 'Bạn' : action.senderName,
                    message: 'đã tham gia phòng',
                    time: new Date().toLocaleTimeString('vi-VN')
                }])
                setViews(prev => prev + 1);
                console.log(views);

                if (isHost) {
                    console.log("Host đang gửi dữ liệu đồng bộ...");
                    sendSyncSignal();
                }
                break;
            case 'LEAVE':
                setMessages(prev => [...prev, {
                    id: String(action.senderId),
                    senderName: action.senderName,
                    message: 'đã rời phòng',
                    time: new Date().toLocaleTimeString('vi-VN')
                }])
                setViews(prev => Math.max(0, prev - 1));
                console.log(views);

                break;
            case 'REQUEST_SYNC':
                if (isHost) {
                    console.log("Host đang gửi dữ liệu đồng bộ...");
                    sendSyncSignal();
                }
                break;

            case 'SYNC':
                // Nhận dữ liệu đồng bộ 
                setIsRemoteUpdate(true);
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
                if (!action.isPlaying) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
                setTimeout(() => setIsRemoteUpdate(false), 500);
                break;
            case 'CHAT':
                setMessages(prev => [...prev, {
                    id: String(action.senderId),
                    senderName: action.senderId === String(user.id) ? 'Bạn' : action.senderName,
                    message: action.message,
                    time: new Date().toLocaleTimeString('vi-VN')
                }])
                break;

            default:
                break;
        }

    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: `/app/room/${room.id}/action`,
                body: JSON.stringify({
                    type: 'CHAT',
                    roomId: room.id,
                    senderId: String(user.id),
                    senderName: user.name,
                    message: newMessage
                })
            });
            setNewMessage('');
        }
    }

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
                    senderId: String(user.id),
                    senderName: user.name
                })
            });
        } else {
            console.warn("Socket chưa kết nối, không thể gửi lệnh:", type);
        }
    };




    return {
        videoRef,
        stompClientRef,
        isRemoteUpdate,
        isConnected,
        isHost,
        messages,
        newMessage,
        views,
        handleUserAction,
        sendRequestSync,
        setNewMessage,
        sendLeaveSignal,
        sendMessage
    };
}
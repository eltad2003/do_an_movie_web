import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"

export const useWatchRoom = () => {
    const { user } = useContext(AuthContext)
    const [rooms, setRooms] = useState([])

    const fetchAllRoom = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/watch-rooms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch rooms')
            }
            const data = await res.json()
            setRooms(data || [])
        } catch (error) {
            console.error('Error fetching rooms:', error)
        }
    }
    useEffect(() => {
        fetchAllRoom()
    }, [])

    return { rooms, fetchAllRoom }
}

export const useWatchRoomById = (roomId) => {
    const { user } = useContext(AuthContext)
    const [room, setRoom] = useState(null)
    const fetchRoomById = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/api/watch-rooms/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch rooms')
            }
            const data = await res.json()
            setRoom(data)
        } catch (error) {
            console.error('Error fetching rooms:', error)
        }
    }
    useEffect(() => {
        fetchRoomById()
    }, [roomId])



    return { room, fetchRoomById }
}
import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";


export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('user'))
        return storage ?? null
    })
    const [loading, setLoading] = useState(false)
    const refreshTokenTimeoutRef = useRef(null)
    const isRefreshingRef = useRef(false) // ✅ Thêm flag để tránh gọi refresh nhiều lần

    // Decode JWT để lấy thời gian hết hạn
    const getTokenExpirationTime = useCallback((token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp * 1000 // milliseconds
        } catch (error) {
            console.error('Error decoding token:', error)
            return null
        }
    }, [])

    // Refresh access token - Dùng useCallback để stabilize function
    const refreshAccessToken = useCallback(async () => {
        // ✅ Kiểm tra nếu đang refresh thì không gọi lại
        if (isRefreshingRef.current) {
            console.log('⏳ Đang refresh token, bỏ qua request...')
            return null
        }

        const currentUser = JSON.parse(localStorage.getItem('user'))

        if (!currentUser?.refreshToken) {
            console.log('Không có refresh token, logout')
            setUser(null)
            localStorage.removeItem('user')
            return null
        }

        try {
            isRefreshingRef.current = true // ✅ Set flag
            console.log('🔄 Đang refresh access token...')

            const res = await fetch(`${import.meta.env.VITE_BE}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.accessToken}`
                },
                body: JSON.stringify({
                    refreshToken: currentUser.refreshToken
                })
            })

            if (res.ok) {
                const data = await res.json()

                const updatedUser = {
                    ...currentUser,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken || currentUser.refreshToken
                }

                setUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))

                console.log('✅ Refresh token thành công!')

                return data.accessToken
            } else {
                console.error('Refresh token thất bại:', res.status)

                if (res.status === 401 || res.status === 403) {
                    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                    setUser(null)
                    localStorage.removeItem('user')
                }
                return null
            }
        } catch (error) {
            console.error('Error refreshing token:', error)
            toast.error('Lỗi khi làm mới phiên đăng nhập')
            setUser(null)
            localStorage.removeItem('user')
            return null
        } finally {
            isRefreshingRef.current = false // ✅ Clear flag
        }
    }, []) // ✅ Empty deps - function chỉ tạo 1 lần

    // Schedule refresh token - Dùng useCallback
    const scheduleTokenRefresh = useCallback((token) => {
        // ✅ Clear timeout cũ trước khi schedule mới
        if (refreshTokenTimeoutRef.current) {
            clearTimeout(refreshTokenTimeoutRef.current)
            refreshTokenTimeoutRef.current = null
        }

        if (!token) return

        const expirationTime = getTokenExpirationTime(token)
        if (!expirationTime) return

        const now = Date.now()
        const timeUntilRefresh = expirationTime - now - (5 * 60 * 1000) // 5 phút trước khi hết hạn

        if (timeUntilRefresh > 0) {
            console.log(`⏰ Token sẽ refresh sau ${Math.floor(timeUntilRefresh / 1000 / 60)} phút`)

            refreshTokenTimeoutRef.current = setTimeout(() => {
                refreshAccessToken()
            }, timeUntilRefresh)
        } else {
            console.log('⚠️ Token đã hết hạn, refresh ngay')
            refreshAccessToken()
        }
    }, [getTokenExpirationTime, refreshAccessToken])

    // ✅ Effect riêng để schedule - CHỈ chạy 1 lần khi mount hoặc token thay đổi
    useEffect(() => {
        if (user?.accessToken) {
            scheduleTokenRefresh(user.accessToken)
        }

        // Cleanup khi unmount
        return () => {
            if (refreshTokenTimeoutRef.current) {
                console.log('🧹 Cleanup timeout')
                clearTimeout(refreshTokenTimeoutRef.current)
            }
        }
    }, [user?.accessToken]) 

    const login = async (username, password) => {
        try {
            setLoading(true)
            const res = await fetch(`${import.meta.env.VITE_BE}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (res.ok) {
                const data = await res.json()

                const userData = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: data.user
                }

                setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))

                return { success: true, message: 'Đăng nhập thành công' }
            } else {
                const errorData = await res.text()
                return { success: false, message: errorData }
            }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
        } finally {
            setLoading(false)
        }
    }

    const loginGoogle = async () => {
        return new Promise((resolve) => {
            const popup = window.open(
                `${import.meta.env.VITE_BE}/oauth2/authorization/google`,
                'Đăng nhập ChillFLix bằng Google',
                'width=600,height=600'
            )

            const interval = window.setInterval(() => {
                if (popup.closed) {
                    clearInterval(interval)
                    resolve({ success: false, message: 'Đăng nhập bằng Google thất bại' })
                    return
                }

                try {
                    const url = popup.location.href
                    if (url.includes('success')) {
                        const urlParams = new URLSearchParams(new URL(url).search)
                        const userData = {
                            accessToken: urlParams.get('accessToken'),
                            refreshToken: urlParams.get('refreshToken'),
                            user: {
                                id: urlParams.get('id'),
                                username: urlParams.get('username'),
                                name: urlParams.get('name'),
                                email: urlParams.get('email'),
                                roleName: urlParams.get('roleName')
                            }
                        }

                        setUser(userData)
                        localStorage.setItem('user', JSON.stringify(userData))

                        clearInterval(interval)
                        popup.close()

                        resolve({ success: true, message: 'Đăng nhập bằng Google thành công!' })
                    }
                } catch (error) {
                    console.log(error)
                }
            }, 1000)
        })
    }

    const logout = async () => {
        setUser(null)
        localStorage.removeItem('user')
        toast.info('Đã đăng xuất')
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            loginGoogle,
            refreshAccessToken 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
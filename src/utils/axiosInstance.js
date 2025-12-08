import axios from 'axios'
import { toast } from 'react-toastify'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BE
})

// Request interceptor - Thêm access token vào headers
axiosInstance.interceptors.request.use(
    (config) => {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData?.accessToken) {
            config.headers['Authorization'] = `Bearer ${userData.accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Xử lý 401 và refresh token
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh, đợi trong queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            const userData = JSON.parse(localStorage.getItem('user'))

            if (!userData?.refreshToken) {
                // Không có refresh token, logout
                localStorage.removeItem('user')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                console.log('🔄 Axios Interceptor: Refreshing token...')

                // Call refresh token API
                const response = await axios.post(
                    `${import.meta.env.VITE_BE}/refresh`,
                    {
                        refreshToken: userData.refreshToken
                    }
                )

                const { accessToken, refreshToken } = response.data

                // Update localStorage
                const updatedUser = {
                    ...userData,
                    accessToken,
                    refreshToken: refreshToken || userData.refreshToken
                }
                localStorage.setItem('user', JSON.stringify(updatedUser))

                // Update axios default header
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

                // Process queued requests
                processQueue(null, accessToken)

                console.log('✅ Axios Interceptor: Token refreshed successfully')

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)

                // Refresh token thất bại, logout
                console.error('❌ Axios Interceptor: Refresh token failed')
                localStorage.removeItem('user')
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')

                // Delay redirect để toast hiển thị
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1000)

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance

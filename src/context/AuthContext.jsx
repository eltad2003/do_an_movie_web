import { createContext, useState } from "react";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('user'))
        return storage ?? null
    })

    const login = async (username, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (res.ok) {
                const data = await res.json()
                setUser(data)
                localStorage.setItem('user', JSON.stringify(data))
                return { success: true, message: 'Đăng nhập thành công' }
            }
            else {
                const errorData = await res.text()
                return { success: false, message: errorData }
            }

        } catch (error) {
            console.log(error)
            return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }

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
                    console.log(error);
                }
            }, 1000)
        })
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')

    }
    return (
        <AuthContext.Provider value={{ user, login, logout, loginGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
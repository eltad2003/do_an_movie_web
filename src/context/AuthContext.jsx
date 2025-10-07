import { createContext, useState } from "react";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = JSON.parse(localStorage.getItem('user'))
        return token ?? null
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
    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        alert('Đăng xuất thành công')
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
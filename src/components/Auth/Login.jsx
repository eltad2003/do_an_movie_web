import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { login } = useContext(AuthContext)
    const [creds, setCreds] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const res = await login(creds.username, creds.password)
        if (!res.success) {
            setError(res.message)
        }
        else {
            alert('Đăng nhập thành công')
            navigate('/')
        }
    }
    const handleChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }

    return (
        <div className='auth-form'>
            <form>
                <h2 >Đăng nhập</h2>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" required={true} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input type="password" name="password" required onChange={handleChange} />
                </div>
                <div>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                </div>

                <button type="submit" className='btn w-full' onClick={handleLogin}>Đăng nhập</button>
                <p className='text-center text-light-100'>Hoặc</p>
                <button type="button" className='btn w-full'> Đăng nhập bằng Google</button>
                <div className='flex items-center justify-center gap-1'>
                    <p className='text-white/50'>Bạn mới sử dụng ChillFilx?</p>
                    <a href="/register" className='text-light-100 font-bold'>Đăng ký ngay.</a>
                </div>
            </form>

        </div>
    )
}

export default Login

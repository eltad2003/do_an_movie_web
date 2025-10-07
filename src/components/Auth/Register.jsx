import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const [creds, setCreds] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const handleRegister = async (e) => {
        e.preventDefault()
        if (creds.password !== creds.confirmPassword) {
            setError('Mật khẩu không khớp')
            return
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creds)
            })
            if (res.ok) {
                alert('Đăng ký thành công. Vui lòng đăng nhập.')
                navigate('/login')
            }
            else {
                const errorData = await res.text()
                setError(errorData)
                alert('Đăng ký không thành công. Vui lòng thử lại.')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }
    return (
        <div className='auth-form'>
            <form>
                <h2>Đăng ký</h2>
                <div>
                    <label htmlFor="fullname">Tên đăng nhập</label>
                    <input type="text" name="username" placeholder="Username...." required onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="fullname">Tên đầy đủ</label>
                    <input type="text" name="name" placeholder="Nhập họ và tên" required onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Nhập email" required onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input type="password" name="password" placeholder="Nhập mật khẩu" required onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required onChange={handleChange} />
                </div>
                <div>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                </div>

                <button type="submit" className='btn w-full' onClick={handleRegister}>Đăng ký</button>
                <p className='text-center text-light-100'>Hoặc</p>
                <button type="button" className='btn w-full'>Đăng nhập bằng Google</button>
                <div className='flex items-center justify-center gap-1'>
                    <p className='text-white/50'>Đã có tài khoản?</p>
                    <Link to="/login" className='text-light-100 font-bold hover:underline'>
                        Đăng nhập ngay
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Register
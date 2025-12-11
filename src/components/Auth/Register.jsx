import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import logoGoogle from '/google-color.svg'
import { ROUTES } from '../../utils/constants'


const Register = () => {
    const { loginGoogle } = useContext(AuthContext)

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
                toast.success('Đăng ký thành công. Vui lòng đăng nhập.')
                navigate('/login')
            }
            else {
                const errorData = await res.text()
                setError(errorData)
                toast.error('Đăng ký không thành công. Vui lòng thử lại.')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }
    const handleLoginGoogle = async (e) => {
        e.preventDefault()
        try {
            const res = await loginGoogle()
            if (!res.success) {
                toast.error(res.message)
            }
            else {
                navigate('/')
                toast.success(res.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
        }

    }

    return (
        <main>
            <div className='pattern' />
            <div className='auth-form wrapper'>
                <form onSubmit={handleRegister}>
                    <h2>Đăng ký</h2>
                    <div>
                        <label htmlFor="fullname">Tên đăng nhập</label>
                        <input type="text" name="username" placeholder="Username...." required onChange={handleChange} />
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

                    <button type="submit" className='btn w-full' >Đăng ký</button>
                    <p className='text-center text-light-100'>Hoặc</p>
                    <button type="button" className='btn w-full inline-flex items-center justify-center' onClick={handleLoginGoogle}>
                        <img src={logoGoogle} alt="Google" className='w-5 h-5' />  Đăng nhập bằng Google
                    </button>
                    <div className='flex items-center justify-center gap-1'>
                        <p className='text-white/50'>Bạn đã có tài khoản?</p>
                        <Link to={ROUTES.LOGIN} className='text-light-100 font-bold hover:underline'>
                            Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </main>

    )
}

export default Register
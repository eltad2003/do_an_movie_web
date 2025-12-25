import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import logoGoogle from '/google-color.svg'
import { ROUTES } from '../../utils/constants'
import { ChevronLeft } from 'lucide-react'

const Login = () => {
    const { login, loginGoogle } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [creds, setCreds] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const res = await login(creds.username, creds.password)
            if (!res.success) {
                toast.error(res.message)
            }
            else {
                toast.success(res.message)
                if (res.user.roleName === 'ROLE_ADMIN') {
                    navigate('/admin')
                } else {
                    navigate('/')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
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
                <form onSubmit={handleLogin}>
                    <div className='flex items-center gap-1'>
                        <Link to='/' className='text-white'>
                            <ChevronLeft />
                        </Link>
                        <h2 >Đăng nhập</h2>
                    </div>
                    <div>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input type="text" name="username" required={true} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" name="password" required onChange={handleChange} />
                    </div>
                    <div>
                        <a href={ROUTES.RESET_PASSWORD} className='text-light-100 hover:underline text-sm'>Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className='btn w-full' disabled={isLoading}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    <p className='text-center text-white/50 divide-x divide-amber-500'>Hoặc</p>
                    <button type="button" className='btn w-full inline-flex items-center justify-center' onClick={handleLoginGoogle}>
                        <img src={logoGoogle} alt="Google" className='w-5 h-5' />  Đăng nhập bằng Google
                    </button>
                    <div className='flex items-center justify-center gap-1'>
                        <p className='text-white/50'>Bạn mới sử dụng ChillFilx?</p>
                        <a href={ROUTES.REGISTER} className='text-light-100 font-bold hover:underline'>Đăng ký ngay.</a>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Login

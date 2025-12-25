import { ChevronLeft } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ROUTES } from '../../utils/constants'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleLinkForgotPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            if (!res.ok) {
                toast.error(await res.text())
            } else {
                toast.success('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến của bạn.')
                setStep(2)

            }
        } catch (error) {
            console.log(error)
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        // if (data.newPassword !== data.confirmPassword) {
        //     toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.')
        //     return
        // }
        setIsLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_BE}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: data.token,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                })
            })
            if (!res.ok) {
                toast.error(await res.text())
                setData({ ...data, newPassword: '', confirmPassword: '' })
            }
            else {
                toast.success('Đặt lại mật khẩu thành công. Đăng nhập để tiếp tục trải nghiệm')
                navigate(ROUTES.LOGIN)
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')

        } finally {
            setIsLoading(false)
        }
    }

    const onBack = () => {
        if (step === 2) {
            setStep(1)
            setData({ token: '', newPassword: '', confirmPassword: '' })
        }
    }

    return (
        <main>
            <div className='pattern' />
            <div className='auth-form wrapper'>
                {step === 1 ? (
                    <form onSubmit={handleLinkForgotPassword}>
                        <div className='flex items-center gap-1'>
                            <Link to={ROUTES.LOGIN} className='text-white'>
                                <ChevronLeft />
                            </Link>
                            <h2>Đặt lại mật khẩu</h2>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                value={email}
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email đã đăng ký"
                            />
                        </div>

                        <button type="submit" className='btn w-full' disabled={isLoading}>
                            {isLoading ? 'Đang gửi...' : 'Gửi mã TOKEN'}
                        </button>

                        <div className='mt-4 text-xs text-gray-400 italic'>
                            Vui lòng nhập email đã đăng ký tài khoản. Chúng tôi sẽ gửi mã TOKEN để đặt lại mật khẩu đến email của bạn.
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className='flex items-center gap-1'>
                            <button type="button" className='text-white' onClick={onBack}>
                                <ChevronLeft />
                            </button>
                            <h2>Đặt lại mật khẩu</h2>
                        </div>

                        <div>
                            <label htmlFor="token">Mã TOKEN</label>
                            <input
                                type="text"
                                name='token'
                                value={data.token}
                                required={true}
                                onChange={handleChange}
                                placeholder="Nhập mã TOKEN từ email"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={data.newPassword}
                                required={true}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                required={true}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className='btn w-full' disabled={isLoading}>
                            {isLoading ? 'Đang xử lí...' : 'Đặt lại mật khẩu'}
                        </button>

                        <div className='mt-4 text-xs text-gray-400 italic'>
                            Mã TOKEN có hiệu lực trong 10 phút. Nếu không nhận được email, vui lòng kiểm tra thư mục spam.
                        </div>
                    </form>
                )}
            </div>
        </main>
    )
}

export default ForgotPassword
import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    return (
        <div className='auth-form'>
            <form>
                <h2>Đăng ký</h2>

                <div>
                    <label htmlFor="fullname">Họ và tên</label>
                    <input type="text" id="fullname" name="fullname" placeholder="Nhập họ và tên" required />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Nhập email" required />
                </div>

                <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" required />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" required />
                </div>

                <button type="submit" className='btn w-full'>Đăng ký</button>

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
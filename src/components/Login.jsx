import React from 'react'

const Login = () => {
    return (
        <div className='login-form'>
            {/* login form  */}
            <form>
                <h2 >Đăng nhập</h2>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit" className='btn w-full'>Đăng nhập</button>
                <p className='text-center text-light-100'>Hoặc</p>
                <button type="button" className='btn w-full'> Đăng nhập bằng Google</button>
                <div className='flex items-center justify-center'>
                    <p className='text-white/50'>Bạn mới sử dụng ChillFilx?</p>
                    <a href="" className='text-light-100 font-bold'>Đăng ký ngay.</a>
                </div>
            </form>

        </div>
    )
}

export default Login

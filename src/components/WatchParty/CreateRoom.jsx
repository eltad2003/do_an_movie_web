import { ChevronLeft, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { back } from '../../utils/helpers';

const CreateRoom = () => {
  const { episodeId } = useParams();
  const [hasPassword, setHasPassword] = useState(false);
  const { navigate } = useNavigate()
  const [createRoom, setCreateRoom] = useState({
    title: 'Phòng xem phim ',
    password: '',
    episodeId: episodeId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BE}/api/watch-rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify(createRoom)
      })
      if (!res.ok) {
        throw new Error('Failed to create watch room');
      }
      const data = await res.json();
      toast.success('Tạo phòng thành công')
      navigate(`/xem-chung/${data.id}`);


    } catch (error) {
      console.error('Error creating watch room:', error);
    }
  }

  const handleChange = (e) => {
    setCreateRoom({ ...createRoom, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    if (createRoom.title.trim() || createRoom.password) {
      if (window.confirm('Bạn có chắc muốn hủy? Dữ liệu đã nhập sẽ bị mất.')) {
        back();
      }
    } else {
      back();
    }
  }

  return (
    <main>
      <div className="wrapper">
        <div className='text-white flex gap-2 items-center '>
          <ChevronLeft
            className='w-10 h-10 cursor-pointer hover:bg-light-100/50 rounded-full transition-colors p-1'
            onClick={back} />
          <h2 className="text-2xl font-bold">Tạo Phòng Xem Chung</h2>
        </div>

        <div className='auth-form min-h-0' >
          <form onSubmit={handleSubmit} >
            <div>
              <label htmlFor="title">1. Tên phòng</label>
              <input type="text" name="title" value={createRoom.title} required onChange={handleChange} />
            </div>
            <div className='flex justify-between items-center bg-white/5 p-4 rounded-lg border border-light-100/10'>
              <div className='inline-flex items-center gap-2'>
                <Lock className='w-5 h-5 text-purple-400' />
                <span className='text-white font-medium'>Đặt mật khẩu</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasPassword(!hasPassword)
                  if (hasPassword) {
                    setCreateRoom({ ...createRoom, password: '' })
                  }
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${hasPassword ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${hasPassword ? 'translate-x-6' : ''
                    }`}
                />
              </button>
            </div>
            {hasPassword && (
              <div>
                <label htmlFor="password">2. Mật khẩu (Tùy chọn)</label>
                <input type="password" name="password" value={createRoom.password} onChange={handleChange} />
              </div>
            )}
            <div className='flex justify-between gap-3'>
              <button type="submit" className='btn flex-1'>Tạo phòng</button>
              <button
                type='button'
                className='bg-white/90 px-4 py-2 rounded-lg font-semibold cursor-pointer'
                onClick={handleCancel}>Hủy bỏ</button>
            </div>
          </form>
        </div>

      </div>
    </main>
  )
}

export default CreateRoom

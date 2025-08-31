import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Auth/Login'
import DetailMovie from './components/DetailMovie/DetailMovie'
import NotFound from './components/NotFound'
import WatchMovie from './components/WatchMovie/WatchMovie'
import Register from './components/Auth/Register'
import Navbar from './components/Layout/navbar'
import Main from './components/Layout/Main'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/phim/:slug" element={<DetailMovie />} />
          <Route path="/xem-phim/:slug" element={< WatchMovie />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/Home'

import Login from './components/Login'
import DetailMovie from './components/DetailMovie/DetailMovie'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phim/:slug" element={<DetailMovie />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Auth/Login'
import DetailMovie from './components/DetailMovie/DetailMovie'
import NotFound from './components/NotFound'
import WatchMovie from './components/WatchMovie/WatchMovie'
import Register from './components/Auth/Register'
import Main from './components/Layout/Main'
import SearchResults from './components/SearchResults'
import ScrollToTop from './components/ScrollToTop'
import ByCategory from './components/MovieByType/ByCategory'
import ByCountry from './components/MovieByType/ByCountry'


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/phim/:slug" element={<DetailMovie />} />
          <Route path="/xem-phim/:slug" element={< WatchMovie />} />
          <Route path="/the-loai/:slugCat" element={< ByCategory />} />
          <Route path="/quoc-gia/:slugCountry" element={< ByCountry />} />
          <Route path="/tim-kiem" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

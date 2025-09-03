import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/Pages/Home'
import Login from './components/Auth/Login'
import DetailMovie from './components/DetailMovie/DetailMovie'
import NotFound from './components/Pages/NotFound'
import WatchMovie from './components/WatchMovie/WatchMovie'
import Register from './components/Auth/Register'
import Main from './components/Layout/Main'
import SearchResults from './components/Search/SearchResults'
import ScrollToTop from './components/ScrollToTop'
import ByCategory from './components/Pages/ByCategory'
import ByCountry from './components/Pages/ByCountry'
import WatchParty from './components/WatchParty/WatchParty'
import Room from './components/WatchParty/Room'
import CreateRoom from './components/WatchParty/CreateRoom'


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

          <Route path="/xem-chung" element={<Room />} />
          <Route path="/xem-chung/:id" element={<WatchParty />} />
          <Route path="/xem-chung/tao-phong" element={<CreateRoom />} />

          <Route path="/tim-kiem" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

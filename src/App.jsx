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
import Profile from './components/Profile/Profile'
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './components/Admin/Dashboard'
import ManageMovie from './components/Admin/ManageMovie/ManageMovie'
import ManageUser from './components/Admin/ManageUser'
import ManageDetailMovie from './components/Admin/ManageMovie/ManageDetailMovie'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute'

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

          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute roleAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quan-ly-phim" element={<ManageMovie />} />
            <Route path="quan-ly-phim/:id" element={<ManageDetailMovie />} />
            <Route path="quan-ly-nguoi-dung" element={<ManageUser />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  )
}

export default App

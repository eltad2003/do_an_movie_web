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
import ManageUser from './components/Admin/ManageUser/ManageUser'
import ManageDetailMovie from './components/Admin/ManageMovie/ManageDetailMovie'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute'
import ManageActor from './components/Admin/ManageActor'
import ManageCategory from './components/Admin/ManageCategory'
import ManageCountry from './components/Admin/ManageCountry'
import ManageDirector from './components/Admin/ManageDirector'
import History from './components/Profile/History'
import Favorite from './components/Profile/Favorite'
import { ROUTES } from './utils/constants'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.HOME} element={<Main />}>
          <Route index element={<Home />} />

          <Route path={ROUTES.MOVIE_DETAIL} element={<DetailMovie />} />
          <Route path={ROUTES.WATCH_MOVIE} element={< WatchMovie />} />
          <Route path={ROUTES.BY_CATEGORY} element={< ByCategory />} />
          <Route path={ROUTES.BY_COUNTRY} element={< ByCountry />} />

          <Route path={ROUTES.ROOM} element={<Room />} />

          <Route path="/xem-chung/tao-phong/:episodeId" element={<CreateRoom />} />

          <Route path={ROUTES.SEARCH} element={<SearchResults />} />


          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.FAVORITE} element={<Favorite />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path="/xem-chung/:id" element={<WatchParty />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path={ROUTES.MANAGE_MOVIES} element={<ManageMovie />} />
            <Route path={ROUTES.MANAGE_DETAIL_MOVIE} element={<ManageDetailMovie />} />
            <Route path={ROUTES.MANAGE_USERS} element={<ManageUser />} />
            <Route path={ROUTES.MANAGE_CATEGORIES} element={<ManageCategory />} />
            <Route path={ROUTES.MANAGE_COUNTRIES} element={<ManageCountry />} />
            <Route path={ROUTES.MANAGE_ACTORS} element={<ManageActor />} />
            <Route path={ROUTES.MANAGE_DIRECTORS} element={<ManageDirector />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1000}
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

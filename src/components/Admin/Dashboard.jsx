import React, { useState, useEffect, useContext } from 'react'
import {
    Film, Users, Eye, TrendingUp, MessageSquare, Calendar,
    Plus, BarChart3, Activity, Star, Clock, Award, AlertTriangle,
    Zap, TrendingDown, Target, CheckCircle, XCircle, AlertCircle,
    Video, UserPlus, PlayCircle, FileText, Lightbulb, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Loading from '../UI/Loading'

const Dashboard = () => {
    const { user } = useContext(AuthContext)

    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalViews: 0,
        newMoviesThisMonth: 0,
        totalEpisodes: 0,
        totalReviews: 0,
        movieChange: 0,
        userChange: 0,
        viewChange: 0
    })
    const [topMovies, setTopMovies] = useState([])
    const [recentMovies, setRecentMovies] = useState([])
    const [categoryStats, setCategoryStats] = useState([])
    const [viewsData, setViewsData] = useState([])
    const [alerts, setAlerts] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [lowPerformingMovies, setLowPerformingMovies] = useState([])
    const [incompleteMovies, setIncompleteMovies] = useState([])
    const [moviesNoEpisodes, setMoviesNoEpisodes] = useState([])
    const [categoryPerformance, setCategoryPerformance] = useState([])
    const [roomStats, setRoomStats] = useState({
        totalRooms: 0,
        activeRooms: 0,
        totalParticipants: 0,
        topRooms: []
    })

    const [loading, setLoading] = useState(true)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Fetch all data in parallel
            const [
                moviesRes,
                usersRes,
                categoriesRes,
                roomsRes
            ] = await Promise.all([
                fetch(`${import.meta.env.VITE_BE}/movies`),
                fetch(`${import.meta.env.VITE_BE}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                }),
                fetch(`${import.meta.env.VITE_BE}/categories`),
                fetch(`${import.meta.env.VITE_BE}/api/watch-rooms`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                })
            ])

            const movies = await moviesRes.json()
            const users = await usersRes.json()
            const categories = await categoriesRes.json()
            const rooms = await roomsRes.json()

            // Calculate stats
            const totalViews = movies.reduce((sum, movie) => sum + (movie.views || 0), 0)
            const totalEpisodes = movies.reduce((sum, movie) =>
                sum + (movie.episodes?.length || 0), 0
            )
            const totalReviews = movies.reduce((sum, movie) =>
                sum + (movie.comments?.length || 0), 0
            )

            // thang nay
            const now = new Date()
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            //thang truoc
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
            // phim moi thang nay`
            const newMoviesThisMonth = movies.filter(movie =>
                new Date(movie.createdAt) >= firstDayOfMonth
            ).length

            //phim thang truoc
            const moviesLastMonth = movies.filter(movie => {
                const createdDate = new Date(movie.createdAt)
                return createdDate >= firstDayOfLastMonth && createdDate <= lastDayOfLastMonth
            }).length

            const movieChange = moviesLastMonth > 0
                ? Math.round(((newMoviesThisMonth - moviesLastMonth) / moviesLastMonth) * 100)
                : 0

            // Users this month
            const usersThisMonth = users.filter(user =>
                new Date(user.createdAt) >= firstDayOfMonth
            ).length

            // Users last month
            const usersLastMonth = users.filter(user => {
                const createdDate = new Date(user.createdAt)
                return createdDate >= firstDayOfLastMonth && createdDate <= lastDayOfLastMonth
            }).length
            const userChange = usersLastMonth > 0
                ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
                : 0

            // Calculate views for last 7 days
            const last7DaysViews = Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                date.setHours(0, 0, 0, 0)

                const nextDate = new Date(date)
                nextDate.setDate(nextDate.getDate() + 1)

                // Count movies created on this day and sum their views
                const dayViews = movies.filter(movie => {
                    const movieDate = new Date(movie.updatedAt)
                    return movieDate >= date && movieDate < nextDate
                }).reduce((sum, movie) => sum + (movie.views || 0), 0)

                return {
                    date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                    views: dayViews
                }
            })

            // Calculate total views for this month vs last month
            const viewsThisMonth = movies.filter(movie =>
                new Date(movie.createdAt) >= firstDayOfMonth
            ).reduce((sum, movie) => sum + (movie.views || 0), 0)

            const viewsLastMonth = movies.filter(movie => {
                const createdDate = new Date(movie.createdAt)
                return createdDate >= firstDayOfLastMonth && createdDate <= lastDayOfLastMonth
            }).reduce((sum, movie) => sum + (movie.views || 0), 0)

            // Calculate view change percentage
            const viewChange = viewsLastMonth > 0
                ? Math.round(((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100)
                : 0

            // Top 5 movies by views
            const top5 = movies
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)

            // Recent movies (last 5)
            const recent = movies
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)



            // Category distribution
            const categoryDistribution = categories.map(cat => {
                const count = movies.filter(movie =>
                    movie.categories?.some(c => c.id === cat.id)
                ).length
                return {
                    name: cat.name,
                    value: count
                }
            }).filter(cat => cat.value > 0)

            // ============ ALERTS & ACTION ITEMS ============
            const alertsList = []
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            // 1. Low performing movies (created 7+ days ago with < 100 views)
            const lowPerformMovies = movies.filter(movie => {
                const createdDate = new Date(movie.createdAt)
                const daysSinceCreation = (now - createdDate) / (1000 * 60 * 60 * 24)
                return daysSinceCreation >= 7 && (movie.views || 0) < 2000
            })

            if (lowPerformMovies.length > 0) {
                alertsList.push({
                    type: 'warning',
                    icon: TrendingDown,
                    title: `${lowPerformMovies.length} phim có lượt xem thấp`,
                    description: 'Phim đã phát hành hơn 7 ngày nhưng có ít hơn 2000 lượt xem',
                    action: 'Xem chi tiết',
                    link: null,
                    color: 'orange',
                    alertType: 'lowPerforming'
                })
            }

            // 2. Movies with incomplete info (no poster or description)
            const incompleteMoviesList = movies.filter(movie =>
                !movie.posterUrl || !movie.description || !movie.thumbUrl || !movie.duration || !movie.year || !movie.name ||
                !movie.trailerUrl
            )
            if (incompleteMoviesList.length > 0) {
                alertsList.push({
                    type: 'error',
                    icon: XCircle,
                    title: `${incompleteMoviesList.length} phim thiếu thông tin`,
                    description: 'Phim chưa đầy đủ thông tin',
                    action: 'Hoàn thiện ngay',
                    link: null,
                    color: 'red',
                    alertType: 'incomplete'
                })
            }

            // 3. Movies without episodes
            const moviesNoEpisodesList = movies.filter(movie => movie.episodes.length === 0)

            if (moviesNoEpisodesList.length > 0) {
                alertsList.push({
                    type: 'info',
                    icon: AlertCircle,
                    title: `${moviesNoEpisodesList.length} phim chưa có tập`,
                    description: 'Phim đã tạo nhưng chưa upload tập nào',
                    action: 'Upload tập',
                    link: null,
                    color: 'blue',
                    alertType: 'noEpisodes'
                })
            }



            // ============ TRENDING & PERFORMANCE ============
            // Trending movies (created in last 7 days with high views)
            const trendingList = movies
                .filter(movie => {
                    const createdDate = new Date(movie.updatedAt)
                    return createdDate >= sevenDaysAgo && (movie.views || 0) > 50
                })
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)

            // Category performance analysis
            const categoryPerf = categories.map(cat => {
                const categoryMovies = movies.filter(movie =>
                    movie.categories?.some(c => c.id === cat.id)
                )
                const totalViews = categoryMovies.reduce((sum, m) => sum + (m.views || 0), 0)
                const avgViews = categoryMovies.length > 0 ? totalViews / categoryMovies.length : 0
                const totalReviews = categoryMovies.reduce((sum, m) => sum + (m.comments?.length || 0), 0)

                return {
                    name: cat.name,
                    movieCount: categoryMovies.length,
                    totalViews,
                    avgViews: Math.round(avgViews),
                    totalReviews,
                    engagementRate: totalViews > 0 ? ((totalReviews / totalViews) * 100).toFixed(2) : 0
                }
            })
                .filter(cat => cat.movieCount > 0)
                .sort((a, b) => b.totalViews - a.totalViews)

            // ============ ROOM STATISTICS ============
            const roomsArray = Array.isArray(rooms) ? rooms : []
            const activeRooms = roomsArray.filter(room => room.active)
            const totalParticipants = roomsArray.reduce((sum, room) =>
                sum + (room.currentViewers || 0), 0
            )

            // Top 5 rooms by participants
            const topRoomsList = roomsArray
                .sort((a, b) => {
                    const aCount = a.participants?.length || a.memberCount || 0
                    const bCount = b.participants?.length || b.memberCount || 0
                    return bCount - aCount
                })
                .slice(0, 5)
                .map(room => ({
                    ...room,
                    participantCount: room.participants?.length || room.memberCount || 0
                }))

            setStats({
                totalMovies: movies.length,
                totalUsers: users.length,
                totalViews,
                newMoviesThisMonth,
                totalEpisodes,
                totalReviews,
                movieChange,
                userChange,
                viewChange
            })
            setTopMovies(top5)
            setRecentMovies(recent)
            setCategoryStats(categoryDistribution)
            setViewsData(last7DaysViews)
            setAlerts(alertsList)
            setTrendingMovies(trendingList)
            setLowPerformingMovies(lowPerformMovies)
            setIncompleteMovies(incompleteMoviesList)
            setMoviesNoEpisodes(moviesNoEpisodesList)
            setCategoryPerformance(categoryPerf)
            setRoomStats({
                totalRooms: roomsArray.length,
                activeRooms: activeRooms.length,
                totalParticipants,
                topRooms: topRoomsList
            })

            console.log(alerts);

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

    const handleAlertClick = (alert) => {
        setSelectedAlert(alert)
        setShowAlertModal(true)
    }

    const getAlertMovies = () => {
        if (!selectedAlert) return []
        switch (selectedAlert.alertType) {
            case 'lowPerforming':
                return lowPerformingMovies
            case 'incomplete':
                return incompleteMovies
            case 'noEpisodes':
                return moviesNoEpisodes
            default:
                return []
        }
    }

    const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
        <div className={`${bgColor} rounded-xl p-3 border border-gray-300 shadow-lg`}>
            <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 ${color} rounded-lg`}>
                    <Icon className='w-6 h-6 text-white' />
                </div>
                <div className='flex-1 ml-4'>
                    <h3 className='text-gray-600 text-sm font-medium mb-1'>{title}</h3>
                    <p className='text-3xl font-bold text-gray-800'>{value.toLocaleString()}</p>
                </div>
                {change && (
                    <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
        </div>
    )

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className='min-h-dvh'>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            </div>

            <div className='container mx-auto p-6'>
                {/* Alerts & Action Items */}
                {alerts.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-2xl font-bold text-gray-800  flex items-center gap-2'>
                            <AlertTriangle className='w-6 h-6 text-orange-600' />
                            Cảnh báo
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`bg-white border-l-4 ${alert.color === 'red' ? 'border-red-500' :
                                        alert.color === 'orange' ? 'border-orange-500' :
                                            alert.color === 'blue' ? 'border-blue-500' :
                                                'border-green-500'
                                        } rounded-lg p-4 shadow`}
                                >
                                    <div className='flex items-start gap-3'>
                                        <div className={`p-2 rounded-lg ${alert.color === 'red' ? 'bg-red-100' :
                                            alert.color === 'orange' ? 'bg-orange-100' :
                                                alert.color === 'blue' ? 'bg-blue-100' :
                                                    'bg-green-100'
                                            }`}>
                                            <alert.icon className={`w-8 h-8 ${alert.color === 'red' ? 'text-red-600' :
                                                alert.color === 'orange' ? 'text-orange-600' :
                                                    alert.color === 'blue' ? 'text-blue-600' :
                                                        'text-green-600'
                                                }`} />
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='font-bold text-gray-800 text-sm mb-1'>{alert.title}</h3>
                                            <p className='text-xs text-gray-600 mb-2'>{alert.description}</p>
                                            <button
                                                onClick={() => handleAlertClick(alert)}
                                                className={`text-xs font-semibold ${alert.color === 'red' ? 'text-red-600' :
                                                    alert.color === 'orange' ? 'text-orange-600' :
                                                        alert.color === 'blue' ? 'text-blue-600' :
                                                            'text-green-600'
                                                    } hover:underline cursor-pointer`}
                                            >
                                                {alert.action} →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Statistics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    {/* rooms  */}
                    <StatCard
                        icon={Video}
                        title="Phòng xem chung"
                        value={roomStats.totalRooms}
                        color="bg-indigo-600"
                        bgColor="bg-indigo-50"
                    />
                    <StatCard
                        icon={PlayCircle}
                        title="Phòng đang hoạt động"
                        value={roomStats.activeRooms}
                        color="bg-teal-600"
                        bgColor="bg-teal-50"
                    />
                    <StatCard
                        icon={UserPlus}
                        title="Người đang xem chung"
                        value={roomStats.totalParticipants}
                        color="bg-cyan-600"
                        bgColor="bg-cyan-50"
                    />
                    {/* movíes */}
                    <StatCard
                        icon={TrendingUp}
                        title="Phim mới tháng này"
                        value={stats.newMoviesThisMonth}
                        color="bg-green-600"
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        icon={MessageSquare}
                        title="Tổng bình luận"
                        value={stats.totalReviews}
                        change={stats.reviewChange}
                        color="bg-orange-600"
                        bgColor="bg-orange-50"
                    />
                    <StatCard
                        icon={Eye}
                        title="Tổng lượt xem"
                        value={stats.totalViews}
                        change={stats.viewChange}
                        color="bg-pink-600"
                        bgColor="bg-pink-50"
                    />
                </div>


                {/* Charts Row */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                    {/* Views Chart */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Activity className='w-8 h-8 text-purple-600' />
                            Lượt xem 7 ngày qua
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={viewsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    name="Lượt xem"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={viewsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#ec4899" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer> */}
                    </div>

                    {/* Category Distribution */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Award className='w-8 h-8 text-pink-600' />
                            Phân bố thể loại
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                </div>

                {/* Top Movies & Recent Activities */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                    {/* Top 5 Movies */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Star className='w-8 h-8 text-yellow-600' />
                            Top 5 phim xem nhiều
                        </h2>

                        <div className='space-y-3'>
                            {topMovies.map((movie, index) => (
                                <div key={movie.id} className='flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg transition-colors'>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' :
                                        index === 1 ? 'bg-blue-400' :
                                            index === 2 ? 'bg-orange-600' : 'bg-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.name}
                                        className='w-12 h-16 object-cover rounded'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-800 truncate'>{movie.name}</h3>
                                        <p className='text-sm text-gray-500 flex items-center gap-1'>
                                            <Eye className='w-4 h-4' />
                                            {movie.views?.toLocaleString() || 0} lượt xem
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Recent Movies */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Clock className='w-8 h-8 text-blue-600' />
                            Phim mới thêm
                        </h2>
                        <div className='space-y-3'>
                            {recentMovies.map(movie => (
                                <div key={movie.id} className='flex items-center gap-3 p-3 hover:bg-gray-200  rounded-lg transition-colors'>
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.name}
                                        className='w-12 h-16 object-cover rounded'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-800 truncate'>{movie.name}</h3>
                                        <p className='text-sm text-gray-500'>
                                            {new Date(movie.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/admin/quan-ly-phim/${movie.id}`}
                                        className='px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors'
                                    >
                                        Chi tiết
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Performance Analysis */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                    {/* Category Performance */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Target className='w-8 h-8 text-purple-600' />
                            Hiệu suất thể loại
                        </h2>
                        <div className='space-y-3 max-h-120 overflow-y-auto'>
                            {categoryPerformance.map((cat, index) => (
                                <div key={index} className='p-3 rounded-lg hover:bg-gray-200 transition-colors'>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h3 className='font-semibold text-gray-800'>{cat.name}</h3>
                                        <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full'>
                                            {cat.movieCount} phim
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-3 gap-2 text-sm'>
                                        <div>
                                            <p className='text-gray-500 text-xs'>Tổng view</p>
                                            <p className='font-semibold text-gray-700 inline-flex items-center gap-1'>
                                                {cat.totalViews.toLocaleString()}
                                                {cat.totalViews > 50000 && <TrendingUp className='w-4 h-4 text-green-500' />}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-gray-500 text-xs'>TB/phim</p>
                                            <p className='font-semibold text-gray-700'>{cat.avgViews.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-500 text-xs'>Tương tác</p>
                                            <p className='font-semibold text-gray-700'>{cat.engagementRate}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Performing Movies */}
                    <div className='bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <TrendingDown className='w-8 h-8 text-red-600' />
                            Phim có lượt xem thấp
                        </h2>
                        {lowPerformingMovies.length > 0 ? (
                            <div className='space-y-3'>
                                {lowPerformingMovies.sort((a, b) => a.views - b.views).slice(0, 5).map(movie => (
                                    <div key={movie.id} className='flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors'>
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.name}
                                            className='w-12 h-16 object-cover rounded'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-semibold text-gray-800 truncate'>{movie.name}</h3>
                                            <div className='flex items-center gap-2 text-xs '>
                                                <span className='text-gray-500 flex items-center gap-1'>
                                                    <Eye className='w-4 h-4' />
                                                    {movie.views || 0}
                                                </span>
                                                <span className='text-orange-500'>
                                                    {Math.floor((new Date() - new Date(movie.createdAt)) / (1000 * 60 * 60 * 24))} ngày trước
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/admin/quan-ly-phim/${movie.id}`}
                                            className='px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors'
                                        >
                                            Sửa
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500 text-center py-8'>Tất cả phim đều có hiệu suất tốt!</p>
                        )}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
                    {/* Trending Movies */}
                    <div className='lg:col-span-2 bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Zap className='w-8 h-8 text-yellow-500' />
                            Phim Trending (7 ngày)
                        </h2>
                        {trendingMovies.length > 0 ? (
                            <div className='space-y-3'>
                                {trendingMovies.map((movie, index) => (
                                    <div key={movie.id} className='flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg transition-colors'>
                                        <div className='bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white'>
                                            {index + 1}
                                        </div>
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.name}
                                            className='w-12 h-16 object-cover rounded'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-semibold text-gray-800 truncate'>{movie.name}</h3>
                                            <div className='flex items-center gap-3 text-sm text-gray-500'>
                                                <span className='flex items-center gap-1 text-black'>
                                                    <Eye className='w-4 h-4' />
                                                    {movie.views?.toLocaleString() || 0}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <TrendingUp className='w-4 h-4 text-green-600' />
                                                    Hot
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500 text-center py-8'>Chưa có phim trending trong 7 ngày qua</p>
                        )}
                    </div>
                    {/* Top Rooms */}
                    <div className='lg:col-span-2 bg-white border border-gray-300 rounded-xl shadow-lg p-6'>
                        <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Video className='w-8 h-8 text-indigo-600' />
                            Top 5 Phòng Đông Người
                        </h3>
                        {roomStats.topRooms.length > 0 ? (
                            <div className='space-y-3'>
                                {roomStats.topRooms.map((room, index) => (
                                    <div key={room.id || index} className='flex items-center gap-3 p-3  hover:bg-gray-200 transition-colors rounded-lg'>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-red-500' : 'bg-gray-400'}`
                                        }>
                                            {index + 1}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h4 className='font-semibold text-gray-800 truncate' title={room.id}>{room.title}</h4>
                                            <div className='flex items-center gap-3 text-sm text-gray-500 mt-1'>
                                                <span className='flex items-center gap-1'>
                                                    <Users className='w-4 h-4' />
                                                    {room.currentViewers} người
                                                </span>
                                                {room.movie && (
                                                    <span className='flex items-center gap-1'>
                                                        <Film className='w-4 h-4' />
                                                        {room.movie.name || room.movieName}
                                                    </span>
                                                )}
                                                {(room.active) && (
                                                    <span className='flex items-center gap-1'>
                                                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                                        <span className='text-green-600 font-medium'>Live</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-xs text-gray-500'>Chủ phòng</p>
                                            <p className='text-sm font-medium text-gray-700'>
                                                {room.hostName || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-center py-12'>
                                <Video className='w-16 h-16 text-gray-300 mx-auto mb-3' />
                                <p className='text-gray-500'>Chưa có phòng xem chung nào</p>
                                <p className='text-sm text-gray-400 mt-1'>Người dùng có thể tạo phòng để xem cùng bạn bè</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Alert Modal */}
                {showAlertModal && selectedAlert && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className={`p-2 border-l-4 rounded-t-xl ${selectedAlert.color === 'red' ? 'border-red-500 bg-red-50' :
                                selectedAlert.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                                    selectedAlert.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                                        'border-green-500 bg-green-50'
                                }`}>

                                <div className='flex items-start gap-3'>
                                    <div className={`rounded-lg ${selectedAlert.color === 'red' ? 'bg-red-100' :
                                        selectedAlert.color === 'orange' ? 'bg-orange-100' :
                                            selectedAlert.color === 'blue' ? 'bg-blue-100' :
                                                'bg-green-100'
                                        }`}>
                                        <selectedAlert.icon className={`w-8 h-8 ${selectedAlert.color === 'red' ? 'text-red-600' :
                                            selectedAlert.color === 'orange' ? 'text-orange-600' :
                                                selectedAlert.color === 'blue' ? 'text-blue-600' :
                                                    'text-green-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-bold text-gray-800'>{selectedAlert.title}</h2>
                                        <p className='text-gray-600 text-sm'>{selectedAlert.description}</p>
                                    </div>
                                </div>


                            </div>

                            <div className='flex-1 overflow-y-auto p-6'>
                                <div className='space-y-3'>
                                    {getAlertMovies().map((movie, index) => (
                                        <div key={movie.id} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors'>
                                            <div className='text-gray-400 font-semibold min-w-[30px]'>#{index + 1}</div>
                                            <img
                                                src={movie.posterUrl || '/placeholder.jpg'}
                                                alt={movie.name}
                                                className='w-16 h-20 object-cover rounded'
                                                onError={(e) => e.target.src = '/placeholder.jpg'}
                                            />
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-semibold text-gray-800 truncate mb-1'>{movie.name}</h3>
                                                <div className='flex flex-wrap items-center gap-3 text-sm text-gray-600'>
                                                    <span className='flex items-center gap-1'>
                                                        <Eye className='w-4 h-4' />
                                                        {movie.views?.toLocaleString() || 0} lượt xem
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <Calendar className='w-4 h-4' />
                                                        {new Date(movie.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    {selectedAlert.alertType === 'noEpisodes' && (
                                                        <span className='text-blue-600 font-medium'>Chưa có tập</span>
                                                    )}
                                                    {selectedAlert.alertType === 'incomplete' && (
                                                        <span className='text-red-600 font-medium'>
                                                            Thiếu: {!movie.posterUrl && 'Poster '}
                                                            {!movie.thumbUrl && 'Thumbnail '}
                                                            {!movie.description && 'Mô tả'}
                                                            {!movie.duration && 'Thời lượng '}
                                                            {!movie.trailerUrl && 'Trailer '}
                                                        </span>
                                                    )}
                                                    {selectedAlert.alertType === 'lowPerforming' && (
                                                        <span className='text-orange-600 font-medium'>
                                                            {Math.floor((new Date() - new Date(movie.createdAt)) / (1000 * 60 * 60 * 24))} ngày trước
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                to={`/admin/quan-ly-phim/${movie.id}`}
                                                className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${selectedAlert.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                                                    selectedAlert.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                                                        selectedAlert.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                                                            'bg-green-500 hover:bg-green-600'
                                                    }`}
                                            >
                                                Sửa ngay
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='p-4 border-t flex justify-end'>
                                <button
                                    onClick={() => setShowAlertModal(false)}
                                    className='px-6 py-2 bg-gray-200 rounded-lg font-semibold'
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}

export default Dashboard
import React, { useState, useEffect, useContext } from 'react'
import {
    Film, Users, Eye, TrendingUp, MessageSquare, Calendar,
    Plus, BarChart3, Activity, Star, Clock, Award
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
        totalReviews: 0
    })
    const [topMovies, setTopMovies] = useState([])
    const [recentMovies, setRecentMovies] = useState([])
    const [recentUsers, setRecentUsers] = useState([])
    const [categoryStats, setCategoryStats] = useState([])
    const [viewsData, setViewsData] = useState([])
    const [loading, setLoading] = useState(true)

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
                categoriesRes
            ] = await Promise.all([
                fetch(`${import.meta.env.VITE_BE}/movies`),
                fetch(`${import.meta.env.VITE_BE}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                }),
                fetch(`${import.meta.env.VITE_BE}/categories`)
            ])

            const movies = await moviesRes.json()
            const users = await usersRes.json()
            const categories = await categoriesRes.json()

            // Calculate stats
            const totalViews = movies.reduce((sum, movie) => sum + (movie.views || 0), 0)
            const totalEpisodes = movies.reduce((sum, movie) =>
                sum + (movie.episodes?.length || 0), 0
            )
            const totalReviews = movies.reduce((sum, movie) =>
                sum + (movie.reviews?.length || 0), 0
            )

            // New movies this month
            const now = new Date()
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const newMoviesThisMonth = movies.filter(movie =>
                new Date(movie.createdAt) >= firstDayOfMonth
            ).length

            // Top 5 movies by views
            const top5 = movies
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)

            // Recent movies (last 5)
            const recent = movies
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)

            // Recent users (last 5)
            const recentUsersList = users
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

            // Views data for chart (last 7 days)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                return {
                    date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                    views: Math.floor(Math.random() * 1000) + 500 // Mock data
                }
            })

            setStats({
                totalMovies: movies.length,
                totalUsers: users.length,
                totalViews,
                newMoviesThisMonth,
                totalEpisodes,
                totalReviews
            })
            setTopMovies(top5)
            setRecentMovies(recent)
            setRecentUsers(recentUsersList)
            setCategoryStats(categoryDistribution)
            setViewsData(last7Days)

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

    const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
        <div className={`${bgColor} rounded-xl p-3`}>
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
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            </div>

            <div className='container mx-auto p-6'>
                {/* Statistics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    <StatCard
                        icon={Film}
                        title="Tổng số phim"
                        value={stats.totalMovies}
                        change={12}
                        color="bg-purple-600"
                        bgColor="bg-white"
                    />
                    <StatCard
                        icon={Users}
                        title="Người dùng"
                        value={stats.totalUsers}
                        change={8}
                        color="bg-blue-600"
                        bgColor="bg-white"
                    />
                    <StatCard
                        icon={Eye}
                        title="Tổng lượt xem"
                        value={stats.totalViews}
                        change={23}
                        color="bg-pink-600"
                        bgColor="bg-white"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Phim mới tháng này"
                        value={stats.newMoviesThisMonth}
                        color="bg-green-600"
                        bgColor="bg-white"
                    />
                    <StatCard
                        icon={Calendar}
                        title="Tổng số tập"
                        value={stats.totalEpisodes}
                        color="bg-orange-600"
                        bgColor="bg-white"
                    />
                    <StatCard
                        icon={MessageSquare}
                        title="Tổng bình luận"
                        value={stats.totalReviews}
                        color="bg-red-600"
                        bgColor="bg-white"
                    />
                </div>

                {/* Charts Row */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                    {/* Views Chart */}
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Activity className='w-5 h-5 text-purple-600' />
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
                    </div>

                    {/* Category Distribution */}
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Award className='w-5 h-5 text-pink-600' />
                            Phân bố thể loại
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
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
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Star className='w-5 h-5 text-yellow-600' />
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
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Clock className='w-5 h-5 text-blue-600' />
                            Phim mới thêm
                        </h2>
                        <div className='space-y-3'>
                            {recentMovies.map(movie => (
                                <div key={movie.id} className='flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg transition-colors'>
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


            </div>
        </div>
    )
}

export default Dashboard
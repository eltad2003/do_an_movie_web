import { useEffect, useState } from 'react'
import { getTrendingMovies } from '../../utils/appwrite'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from '../../utils/carousel'
import { Search, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom';

const SearchTrending = () => {
    const [listMovies, setListMovies] = useState([])

    const fetchTrendingSearch = async () => {
        try {
            const data = await getTrendingMovies()
            setListMovies(data || [])
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        fetchTrendingSearch()
    }, [])

    if (!listMovies.length) return null

    return (
        <section className='mb-10 p-6'>
            <h2 className=' text-white inline-flex items-center gap-2 '>
        
                Tìm kiếm thịnh hành
            </h2>

            <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000} transitionDuration={500} >
                {listMovies.map((movie) => (
                    <div key={movie.$id}>
                        <Link to={`/tim-kiem?q=${movie.searchQuery}`}>
                            <div className="relative flex items-center justify-center overflow-hidden transition-all hover:scale-105 duration-300 group">
                                <div className="absolute bottom-0 left-2 z-10">
                                    <p className="fancy-text">{listMovies.indexOf(movie) + 1}</p>
                                </div>

                                <img
                                    src={movie.poster_url}
                                    alt="poster"
                                    className="w-auto h-auto object-cover rounded-lg"

                                />
                                {/* Hover overlay */}
                                <div
                                    title={movie.searchQuery}
                                    className="absolute bg-primary/50 bottom-20 backdrop-blur-lg rounded-full p-3 gap-2 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center z-20 text-white flex-wrap">
                                    <Search className="w-6 h-6 mx-auto" />
                                    <p className="font-bold text-xl" >{movie.searchQuery}</p>

                                </div>
                            </div>

                        </Link>
                    </div>
                ))}
            </Carousel>

        </section>
    )
}

export default SearchTrending

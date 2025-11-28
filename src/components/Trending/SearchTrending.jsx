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
        <section className='mb-10 space-y-9'>
            <h2 className='text-gradient inline-flex items-center gap-2'>
                <TrendingUp className='w-8 h-8 text-green-300' />
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
                                    src={movie.poster_url }
                                    alt="poster"
                                    className="w-auto h-[340px] object-cover rounded-2xl"

                                />
                                {/* Hover overlay */}
                                <div
                                    title={movie.searchQuery}
                                    className="absolute bottom-10 backdrop-blur-lg rounded-full p-3 gap-2 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center z-20 text-white flex-wrap">
                                    <Search className="w-6 h-6 mx-auto" />
                                    <p className="font-bold" >{movie.searchQuery}</p>

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

import React from 'react'
import { useRecommend } from '../../hooks/useRecommend'
import MovieCard from '../MovieCard'
import { Car } from 'lucide-react'
import Carousel from 'react-multi-carousel'
import { responsive } from '../../utils/carousel'

const RecommendMovies = ({ movieId }) => {
    const { recommends } = useRecommend(movieId)
    console.log(recommends);

    return (
        <div className=''>
            <h2 className='p-4 md:p-6'>Phim đề xuất</h2>
            <Carousel responsive={responsive} infinite={true} autoPlay={true}  autoPlaySpeed={3000} transitionDuration={500} removeArrowOnDeviceType={["tablet", "mobile"]} >
                {recommends.slice(0, 6).map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </Carousel>
        </div>
    )
}

export default RecommendMovies
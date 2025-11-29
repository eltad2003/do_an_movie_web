import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Info, Star, Clock, Calendar } from 'lucide-react'
import "react-multi-carousel/lib/styles.css";
import Carousel from 'react-multi-carousel'
import { responsive } from '../../utils/carousel'
import { useMovies } from '../../hooks/useMovies'

const BannerMovieTrending = () => {
    const { listMovies } = useMovies()

    return (
        <Carousel responsive={responsive}>

        </Carousel>
    )
}

export default BannerMovieTrending
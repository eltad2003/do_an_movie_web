import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        console.log(searchQuery);
    }
    const handleSubmitSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.replace(/\s+/g, ' ').trim())}`)
        }
    }

    const handlePress = (e) => {
        if (e.key === "Enter") {
            handleSubmitSearch(e)
        }
    }

    return (
        <form onSubmit={handleSubmitSearch}>
            <div className="relative w-full bg-dark-100/80 rounded-2xl" >
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-light-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    className="w-full bg-transparent py-4 sm:pr-10 pl-10 text-light-100 outline-hidden"
                    placeholder="Bạn tìm phim gì..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handlePress}
                />
                {/* <button type="submit" className="text-primary bg-gradient absolute end-2.5 bottom-2.5 hover:opacity-90 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">Tìm kiếm</button> */}
            </div>
        </form>


    )
}

export default Search

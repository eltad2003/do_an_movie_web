import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "react-use"

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [debounceSearchQuery, setDebounceSearchQuery] = useState("")
    const navigate = useNavigate()

    useDebounce(() => {
        setDebounceSearchQuery(searchQuery)
        console.log(debounceSearchQuery);
    }, 500, [searchQuery])

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
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
            <div className="relative bg-dark-100/60 rounded-2xl mx-auto max-w-5xl" >
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
                    required
                />
                <button type="submit" className=" absolute end-2.5 bottom-2.5 btn disabled:cursor-not-allowed" disabled={!searchQuery.trim()}>Tìm kiếm</button>
            </div>
        </form>


    )
}

export default Search

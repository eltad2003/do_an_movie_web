const Search = () => {
    return (
        <div className="relative w-full bg-light-100/5 rounded-2xl" >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-light-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input type="search" id="default-search" className="w-full bg-transparent py-4 sm:pr-10 pl-10 text-gray-100 outline-hidden" placeholder="Bạn tìm phim gì..." required />
            {/* <button type="submit" className="text-primary bg-gradient absolute end-2.5 bottom-2.5 hover:opacity-90 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">Tìm kiếm</button> */}
        </div>


    )
}

export default Search

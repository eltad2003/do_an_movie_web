import React from 'react' 

const Loading = ({ text = 'Đang tải...' }) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">{text}</p>
            </div>
        </div>
    )
}

export default Loading
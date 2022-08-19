import React from 'react'

const VideoPlayer = ({id}: {id:string}) => {
    console.log(`Id in videoplayer is ${id}`)
  return (
    <video
        src={`/api/videos?videoId=${id}`}
        width='800px'
        height='auto'
        controls 
        autoPlay 
        id='videoId'
    />
  )
}

export default VideoPlayer
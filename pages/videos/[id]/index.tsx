import { GetServerSideProps } from "next"
import VideoPlayer from "../../../components/VideoPlayer"

interface VideoIdType{
    id: string
}

const index = ({videoId}: {videoId: VideoIdType}) => {
  return (
    <VideoPlayer id={videoId.id}/>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return{
        props:{
            videoId: context.query
        }
    }
}

export default index
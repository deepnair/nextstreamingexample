import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import VideoPlayer from "../../../components/VideoPlayer"

interface VideoIdType{
    id: string
}

const index = ({videoId}: {videoId: VideoIdType}) => {
    const router = useRouter()
    const {id} = router.query as {id: string}
  return (
    <VideoPlayer id={id}/>
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
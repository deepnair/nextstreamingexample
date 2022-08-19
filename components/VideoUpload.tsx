import React, { useState } from 'react'
import axios, {AxiosRequestConfig} from 'axios'

const VideoUpload = () => {

    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        const data = new FormData()
        if(!file){
            return
        }

        setSubmitting(true)

        data.append("file", file)

        const config: AxiosRequestConfig = {
            onUploadProgress: function(progressEvent){
                const percentComplete = Math.round(
                    (progressEvent.loaded * 100)/progressEvent.total
                )

                setProgress(percentComplete)
            }
        }
        try{
            const response = await axios.post('/api/videos', data, config)
            console.log(response)
        }catch(e:any){
            setError(e.message)
            console.log(e)
        }finally{
            setSubmitting(false)
            setProgress(0)
        }
    }

    const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files 
        if(files?.length){
            setFile(files[0])
        }
    }
  return (
    <>
        {error && <p>{error}</p>}
        {submitting && <p>Submitting {progress}%</p>}
        
        <form action='POST'>
            <label htmlFor="file">File</label>
            <input type='file' id='file' accept='.mp4' onChange={handleSetFile}/>
        </form>
        <button onClick={handleSubmit}>Upload video</button>
    </>
  )
}

export default VideoUpload
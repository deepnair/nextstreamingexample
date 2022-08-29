# Streaming with Next.js

This is based on a tutorial [Build a video stream and stream app with Next.js 12](https://www.youtube.com/watch?v=Jl2OmUqDpEQ&t=1098s) by [TomDoesTech](https://www.youtube.com/c/TomDoesTech).

Objective: Create a means to upload video to a web app and then stream the video back. For this we will be using Next.js, and we will use the apis within Next.js (which runs express in the background) to handle the backend.

## Steps

### Setup App

1. Create the app with Next.js:
    ```
    yarn create next-app nextstreamingexample --ts
    ```
1. Install the dependencies busboy and axios and their types
    ```
    yarn add busboy axios && yarn add @types/busboy @types/axios
    ```

### Upload Video segment
1. Rename the hello.ts in the pages/apis folder to videos.ts.
1. In the export default handler function add different functions to be called if the method is get (view video) or post (upload video). In case the request method is neither, give a status 400 response with a JSON message saying the method is not allowed. The code will look as follows:
    ```ts
    export default function handler(req: NextApiRequest, res: NextApiResponse){
        if(req.method === 'GET'){
            return getVideoStream(req, res)
        }else if(req.method === 'POST'){
            return uploadVideoStream(req, res)
        }
        return res.status(405).json({error: `Method ${req.method} is not allowed`})
    }
    ```
    Make sure to use NextApiRequest and NextApiResponse as the types of the request and response rather than NextRequest and NextResponse. Status 405 is used, since it is the status code for method not allowed.
1. Create an empty uploadVideoStream and getVideoStream functions above the handler function to prevent typescript from yelling at you. Both of them will take the req and res from the handler function.
    ```ts
    const getVideoStream = (req: NextApiRequest, res: NextApiResponse) => {

    }
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {

    }
    ```
1. Busboy is a nodejs module for parsing incoming HTML form data. In the uploadVideoStream, we first create a const bb which will be busboy and this will take an object with a headers parameter, and the headers will be the headers from the request. The code will look as follows:
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})
    }
    ```
1. Then we will write the bb method that will run when busboy receives a file. We want it to name the file something and write it a particular folder in your nodejs server. The code will look as follows:
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})

        bb.on('file', (_, file, info) => {
            const fileName = `${nanoid()}.mp4`

            const filePath = `./videos/${fileName}`
        })
    }
    ```
1. In the bb.on file a fileName needs to be generated, a filePath needs to be created for where the file will go. We will generate the fileName with nanoid so that each file name is unique and they will be stored in a videos folder. So we'll create a videos directory in the root of Next.js as well (is deleted in the repo as we don't want to upload any videos with the repo). The code will look as follows:
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})

        bb.on('file', (_, file, info) => {

        })
    }
    ```
1. Then we create a const stream which is be a createWriteStream from fs (don't have to import fs. fs which stands for file system is an inbuilt import in nodejs). In this writeStream, we'll write to the filePath as that's where we want our uploaded video to go. The code will look as follows:
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})
        bb.on('file', (_, file, info) => {
            const fileName = `${nanoid()}.mp4`

            const filePath = `./videos/${fileName}`

            const stream = fs.createWriteStream(filePath)
        })
    }
    ```
1. Finally we'll pipe the stream in the file.
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})
        bb.on('file', (_, file, info) => {
            const fileName = `${nanoid()}.mp4`

            const filePath = `./videos/${fileName}`

            const stream = fs.createWriteStream(filePath)

            file.pipe(stream)
        })
    }
    ```
1. Now we'll write the bb method that'll happen on close. We want the res to have a header of 200 indicating the file has been written, a {Connection: close object} as the text, and a message saying 'This is the end'. The code will look as follows:
    ```ts
    bb.on('close', () => {
        res.writeHead(200, {Connection: 'close'})
        res.end('This is the end')
    })
    ```
1. Finally we pipe bb into the request and return to end the function. The code will look as follows:
    ```ts
    req.pipe(bb)

    return
    ```
    The final code for the uploadVideoStream function will look as follows:
    ```ts
    const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
        const bb = busboy({headers: req.headers})
        bb.on('file', (_, file, info) => {
            const fileName = `${nanoid()}.mp4`

            const filePath = `./videos/${fileName}`

            const stream = fs.createWriteStream(filePath)

            file.pipe(stream)
        })

        bb.on('close', () => {
            res.writeHead(200, {Connection: 'close'})
            res.end('This is the end')
        })

        req.pipe(bb)

        return
    }
    ```
1. Now create a components folder and create a file called UploadVideo.tsx. This component will be imported on the index page to upload the file.
1. In the UploadVideo.tsx, use 'rafce' to create a function. Create four states: file, progress, error, submitting. File will be of type File | undefined, progress will be a number, submitting will be a boolean. The code will look as follows:
    ```jsx
    const VideoUpload = () => {

    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState<number>(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState<boolean>(false)

        return (
        <>
        </>
    )
    }

    export default VideoUpload
    ```
1. In the return, display the error if there's an error. Then display submitting and the percentage if the file is submitting. Create a form, a label, and a file type input that will accept .mp4 files. And a submit button. The function that will run on changing the file will be called handleSetFile and on clicking the submit button will be called handleSubmit. Code will be as follows:
    ```jsx
    const VideoUpload = () => {

    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState<number>(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState<boolean>(false)

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
    ```
1. The handleSetFile function will take in an event of type React.ChangeEvent\<HTMLInputElement>. Then you set a const files equal to event.target.files. If there's a files.?length, set the file state to files[0]. The code will look as follows:
    ```ts
    const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files 
        if(files?.length){
            setFile(files[0])
        }
    }
    ```
1. Then we write the handleSubmit function. This will take in nothing but will be an async function since we will call axios in the function.
1. First we set a const data equal to new FormData(). Then we check if the file state has anything, if not, we return and end the function. If yes, we add the file as file to the formdata. We will also set the submitting state to true once there is a file state. The code will look as follows:
    ```ts
    const data = new FormData()
    if(!file){
        return
    }

    setSubmitting(true)

    data.append("file", file)
    ```
1. Then we create a const config which will be of type AxiosRequestConfig (which is imported from axios). This will be an object with a property onUploadProgress which in turn takes a function with a progressEvent parameter. We create a percentComplete variable that tracks how far the upload has progressed and we set the progress state to that value. The code will look as follows:
    ```ts
    const config: AxiosRequestConfig = {
        onUploadProgress: function(progressEvent){
            const percentComplete = Math.round(
                (progressEvent.loaded * 100)/progressEvent.total
            )

            setProgress(percentComplete)
        }
    }
    ```
1. Then in a try catch and finally. We try to send an axios request with the data and config to '/api/videos'. Then in the catch we set the error to e.message. Finally, we set the submitting to false and the progress to zero. The code will look as follows:
    ```ts
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
    ```
    The final code for the handleSubmit function will look as follows:
    ```ts
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
    ```





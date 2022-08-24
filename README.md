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
1. Create an empty uploadVideoStream and getVideoStream functions above the handler function to prevent typescript from yelling at you.
    ```ts
    const getVideoStream = () => {

    }
    const uploadVideoStream = () => {

    }
    ```
1. In the uploadVideoStream function, a fileName needs to be generated, a filePath needs to be created for where the file will go. We will generate the fileName with nanoid so that each file name is unique and they will be stored in a videos folder. So we'll create a videos directory in the root of Next.js as well (is deleted in the repo as we don't want to upload any videos with the repo). The code will look as follows:
    ```ts
    const uploadVideoStream = () => {
        const fileName = `${nanoid()}.mp4`

        const filePath = `./videos/${fileName}`

        
    }

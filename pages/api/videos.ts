// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import busboy from 'busboy'
import {nanoid} from 'nanoid'
import fs from 'fs'

export const config = {
  api: {
      bodyParser: false
  }
}

const uploadVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
  const bb = busboy({headers: req.headers})

  bb.on("file", (_, file, info) => {
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

const CHUNK_SIZE_IN_BYTES = 100000

const getVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
  const range = req.headers.range 

  if(!range){
    return res.status(400).send('You must provide a range')
  }

  const videoId = req.query.videoId 

  const videoPath = `./videos/${videoId}.mp4`

  const videoSizeInBytes = fs.statSync(videoPath).size

  const chunkStart = Number(range.replace(/\D/g, ""))

  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, videoSizeInBytes - 1)

  const contentLength = chunkEnd - chunkStart +1

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  }

  res.writeHead(206, headers)
  const videoStream = fs.createReadStream(videoPath, {
    start: chunkStart,
    end: chunkEnd
  })

  videoStream.pipe(res)
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  if(req.method === 'GET'){
    return getVideoStream(req, res)
  }
  else if(req.method === 'POST'){
    return uploadVideoStream(req, res)
  }
  return res.status(405).json({error: `Method ${req.method} is not allowed`})
}

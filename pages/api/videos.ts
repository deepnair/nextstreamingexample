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
    console.log(fileName)
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

const getVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
  
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

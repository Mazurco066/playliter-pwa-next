// Dependencies
import crypto from 'crypto'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Login using nextjs api and iron session
async function uploadFilesRoute(req: NextApiRequest, res: NextApiResponse) {
  try {

    // Retrieve enviroment files
    const CLOUDINARY_KEY: string = process.env.CLOUDINARY_KEY || ''
    const CLOUDINARY_SECRET: string = process.env.CLOUDINARY_SECRET || ''
    const CLOUDINARY_PRESET: string = process.env.CLOUDINARY_PRESET || ''
    const CLOUDINARY_URL: string = process.env.CLOUDINARY_URL || ''

    // Request URL data
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_URL}/image/upload`

    // Generate cloudinary hash
    const timestamp: number = Date.now()
    let shasum = crypto.createHash('sha1')
    const info: string = `folder=playliter_band_logos&timestamp=${timestamp}&upload_preset=${CLOUDINARY_PRESET}${CLOUDINARY_SECRET}`
    shasum.update(info, 'binary')
    const requestHash: string = shasum.digest('hex')

    // Request body data
    const formData = new FormData()
    //formData.append('file', file)
    formData.append('folder', 'playliter_band_logos')
    formData.append('upload_preset', CLOUDINARY_PRESET)
    formData.append('api_key', CLOUDINARY_KEY)
    formData.append('timestamp', `${timestamp}`)
    formData.append('signature', requestHash)

    // Send upload request
    const response = await fetchJson(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })

    // const uploadedUrl = response.data.url

    // Retrieve user data from response
    const { data } = response

    // Returns created account
    res.status(200).json(data)

  } catch (error) {
    if (error instanceof FetchError) {
      res.status(error.response.status).json({ message: error.message })
    }
    res.status(500).json({ message: (error as Error).message })
  }
}

// Exporting login service
export default withIronSessionApiRoute(uploadFilesRoute, sessionOptions)

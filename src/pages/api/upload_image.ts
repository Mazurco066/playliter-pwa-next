// Dependencies
import formidable from 'formidable'
import toStream from 'buffer-to-stream'
import { v2 as Cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import { Writable } from 'stream'

// Formidable body parser setup
const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false
}

// Formidable promise to retrieve body file
function formidablePromise(
  req: NextApiRequest, 
  opts?: Parameters<typeof formidable>[0]
): Promise<{fields: formidable.Fields; files: formidable.Files}> {
  return new Promise((accept, reject) => {
    const form = formidable(opts)
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return accept({ fields, files })
    })
  })
}

// Formidable consumer to convert file to Buffer
const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    }
  })
  return writable
}

// Cloudinary upload function
const uploadToCloudinary = async (buffer: any): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const upload = Cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
    toStream(buffer).pipe(upload)
  })
}

// Upload image to cloudinary service
async function uploadImageRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    
    const chunks: never[] = [];
    await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: () => fileConsumer(chunks)
    })

    // Retrieve file buffer
    const fileData = Buffer.concat(chunks)

    // Create cloudinary instance
    Cloudinary.config({ secure: true })

    // Upload file to cloudinary and verify results
    const cloudinaryResult = await uploadToCloudinary(fileData)
    if (cloudinaryResult && cloudinaryResult.secure_url) {
      const { public_id, secure_url } = cloudinaryResult
      res.status(200).json({ public_id, secure_url })
    } else {
      res.status(500).json({ message: 'An error ocourred while uploading your file' })
    }    

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Disable default nextjs body parser
export const config: PageConfig = {
  api: {
    bodyParser: false
  }
}

// Exporting service
export default withIronSessionApiRoute(
  uploadImageRoute,
  sessionOptions
)

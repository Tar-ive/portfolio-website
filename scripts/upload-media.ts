import { config } from 'dotenv'
import { join } from 'path'
import { readdirSync } from 'fs'
import { uploadToCloudinary } from '../lib/cloudinary-upload'

// Load environment variables
config()

// Verify Cloudinary configuration
console.log('Cloudinary config:', {
  cloud_name: 'dvjrzkbnx',
  api_key: process.env.CLOUDINARY_API_KEY?.slice(0, 5) + '...',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'
})

async function uploadMedia() {
  try {
    const mediaDir = join(process.cwd(), 'public', 'media')
    const files = readdirSync(mediaDir)

    for (const file of files) {
      console.log(`Uploading ${file}...`)
      try {
        const filePath = join(mediaDir, file)
        await uploadToCloudinary(filePath)
      } catch (error) {
        console.error(`Error uploading ${file}:`, error)
      }
    }
  } catch (error) {
    console.error('Error uploading files:', error)
  }
}

uploadMedia() 
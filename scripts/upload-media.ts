import { uploadToCloudinary } from '../lib/cloudinary.js'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Load env variables manually
const envFile = readFileSync('.env', 'utf-8')
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    process.env[key.trim()] = value.trim()
  }
})

// Verify env variables are loaded with their actual values
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 5) + '...', // Only show first 5 chars for security
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Not set'
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MEDIA_DIR = join(process.cwd(), 'public', 'media')

async function uploadMediaFiles() {
  try {
    const files = readdirSync(MEDIA_DIR)
    
    for (const file of files) {
      if (file === '.gitkeep') continue
      
      const filePath = join(MEDIA_DIR, file)
      console.log(`Uploading ${file}...`)
      await uploadToCloudinary(filePath)
    }
    
    console.log('All files uploaded successfully!')
  } catch (error) {
    console.error('Error uploading files:', error)
  }
}

uploadMediaFiles() 
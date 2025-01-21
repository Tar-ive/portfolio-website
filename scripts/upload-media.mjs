import { uploadToCloudinary } from '../lib/cloudinary.mjs'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MEDIA_DIR = join(dirname(__dirname), 'public', 'media')

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
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Upload image to Cloudinary (Node.js compatible)
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Convert File to Buffer for Node.js
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create a data URL from the buffer
    const base64String = buffer.toString('base64')
    const dataURL = `data:${file.type};base64,${base64String}`
    
    const result = await cloudinary.uploader.upload(dataURL, {
      folder: 'clearway-capital-kyc',
      resource_type: 'auto',
    })
    
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image:', error)
  }
} 
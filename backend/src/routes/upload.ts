import { Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Upload image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }
    
    // Generate unique filename
    const filename = `tree-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`
    const filepath = path.join(process.env.UPLOAD_DIR || './uploads', filename)
    
    // Process image with sharp (resize, optimize)
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath)
    
    // Return the file URL
    const imageUrl = `/uploads/${filename}`
    res.json({ imageUrl, filename })
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default router

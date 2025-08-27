import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all trees
router.get('/', async (req, res) => {
  try {
    const trees = await prisma.tree.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(trees)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trees' })
  }
})

// Create tree (protected - requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Received tree creation request:', req.body)
    
    const { name, species, description, datePlanted, latitude, longitude, address, imageUrl, tags } = req.body
    
    // Validate required fields
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required' })
    }
    
    // Create a default user if none exists (for testing)
    let defaultUser = await prisma.user.findFirst()
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          passwordHash: 'temp'
        }
      })
    }
    
    const tree = await prisma.tree.create({
      data: {
        name,
        species,
        description: description || '',
        datePlanted: datePlanted ? new Date(datePlanted) : null,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        address: address || '',
        imageUrl: imageUrl || '',
        tags: tags || [],
        userId: req.user!.userId // Use authenticated user
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
    
    console.log('Tree created successfully:', tree)
    res.status(201).json(tree)
  } catch (error) {
    console.error('Error creating tree:', error)
    res.status(500).json({ error: 'Failed to create tree', details: (error as Error).message })
  }
})

// Get tree by ID
router.get('/:id', async (req, res) => {
  try {
    const tree = await prisma.tree.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' })
    }

    res.json(tree)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tree' })
  }
})

export default router

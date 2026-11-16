import express from 'express'
import cors from 'cors'
import type { DatabaseError } from 'pg'
import type { Pool } from 'pg'
import { waitlistSchema } from './validation'

export function createApp(pool: Pool) {
  const app = express()

  // All your existing middleware and routes go here.

  app.use(cors({ origin: 'http://localhost:5173' }))
  app.use(express.json())

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.get('/api/db-test', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW() AS server_time')

      return res.json({
        success: true,
        serverTime: result.rows[0].server_time,
      })
    } catch (error) {
      console.error('Database connection failed:', error)

      return res.status(500).json({
        success: false,
        error: 'Database unavailable',
      })
    }
  })

  app.post('/api/waitlist', async (req, res) => {
    try {
      const result = waitlistSchema.safeParse(req.body)

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email address',
        })
      }

      const email = result?.data?.email

      await pool.query('INSERT INTO waitlist (email) VALUES ($1) RETURNING id, email, created_at', [
        email.trim().toLowerCase(),
      ])

      return res.status(200).json({
        success: true,
      })
    } catch (error) {
      console.error('Waitlist registration failed:', error)

      if ((error as DatabaseError).code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Email already registered',
        })
      }

      return res.status(500).json({
        success: false,
        error: 'Unable to save waitlist registration',
      })
    }
  })

  return app
}

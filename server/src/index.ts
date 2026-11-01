import express from 'express'
import cors from 'cors'
import type { DatabaseError } from 'pg'
import { pool } from './db'

const app = express()
const port = 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// app.post('/api/waitlist', (req, res) => {
//   try {
//     const email = req?.body?.email
//     if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
//       return res.status(400).json({ error: 'Invalid email address' })
//     }
//     console.log('📧: ', email)
//     res.json({ success: true })
//   } catch (e) {
//     res.status(400).json({ error: e.message })
//   }
// })

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
    const email = req.body?.email

    if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      })
    }

    await pool.query('INSERT INTO waitlist (email) VALUES ($1) RETURNING id, email, created_at', [
      email.trim().toLowerCase(),
    ])

    return res.status(200).json({
      success: true,
      // serverTime: result.rows[0].server_time,
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

app.listen(port, () => console.log(`app on 🔥 on port ${port}`))

import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { pool } from './db'
import { createApp } from './app'

const app = createApp(pool)

describe('FieldFlow API', () => {
  it('returns a healthy status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('rejects invalid waitlist registrations', async () => {
    const response = await request(app).post('/api/waitlist').send({ email: 'invalid-email' })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('returns 500 when the database fails', async () => {
    const querySpy = vi.spyOn(pool, 'query')

    querySpy.mockRejectedValueOnce(new Error('Database unavailable'))

    try {
      const response = await request(app).post('/api/waitlist').send({ email: 'yes@gmail.com' })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
    } finally {
      querySpy.mockRestore()
    }
  })

  it('returns 409 for duplicate emails', async () => {
    const querySpy = vi.spyOn(pool, 'query')

    const duplicateError = Object.assign(new Error('Duplicate email'), { code: '23505' })

    querySpy.mockRejectedValueOnce(duplicateError)

    try {
      const response = await request(app)
        .post('/api/waitlist')
        .send({ email: 'duplicate@gmail.com' })
      expect(response.status).toBe(409)
      expect(response.body.success).toBe(false)
    } finally {
      querySpy.mockRestore()
    }
  })

  it('registers a valid email successfully', async () => {
    const querySpy = vi.spyOn(pool, 'query')

    querySpy.mockResolvedValueOnce({ rows: [] } as any)

    try {
      const response = await request(app).post('/api/waitlist').send({ email: 'TEST@GMAIL.COM' })
      expect(response.status).toBe(200)
      expect(querySpy).toHaveBeenCalledOnce()
      expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO waitlist'), [
        'test@gmail.com',
      ])
      expect(response.body.success).toBe(true)
    } finally {
      querySpy.mockRestore()
    }
  })
})

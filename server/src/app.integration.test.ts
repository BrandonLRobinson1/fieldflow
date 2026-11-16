import { describe, it, expect } from 'vitest'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { createApp } from './app'
import { testPool, verifyTestDatabase } from './test-db'

const app = createApp(testPool)

describe('Waitlist API integration', () => {
  it('saves a registration through the HTTP API', async () => {
    const email = `integration-${randomUUID()}@fieldflow.dev`

    const database = await testPool.query('SELECT current_database() AS name')

    expect(database.rows[0].name).toBe('fieldflow_test')

    try {
      const response = await request(app).post('/api/waitlist').send({ email })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      const result = await testPool.query('SELECT * FROM waitlist WHERE email = $1', [email])
      expect(result.rows).toHaveLength(1)
      expect(result.rows[0].email).toBe(email)
    } finally {
      await testPool.query('DELETE FROM waitlist WHERE email = $1', [email])
    }
  })
})

import { describe, it, expect } from 'vitest'
import { randomUUID } from 'node:crypto'
import { testPool } from './test-db'

describe('PostgreSQL integration', () => {
  it('connects to the test database', async () => {
    const result = await testPool.query('SELECT current_database() AS name')

    expect(result.rows[0].name).toBe('fieldflow_test')
  })

  it('persists a waitlist email in PostgreSQL', async () => {
    const email = `integration-${randomUUID()}@fieldflow.dev`

    try {
      await testPool.query('INSERT INTO waitlist (email) VALUES ($1)', [email])

      const result = await testPool.query('SELECT * FROM waitlist WHERE email = $1', [email])

      expect(result.rows).toHaveLength(1)
      expect(result.rows[0].email).toBe(email)
    } finally {
      await testPool.query('DELETE FROM waitlist WHERE email = $1', [email])
    }
  })
})

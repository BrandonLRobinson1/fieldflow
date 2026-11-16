import { Pool } from 'pg'

if (process.env.DB_NAME !== 'fieldflow_test') {
  throw new Error('Integration tests must use fieldflow_test')
}

export const testPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export async function verifyTestDatabase() {
  const result = await testPool.query('SELECT current_database() AS name')

  if (result.rows[0]?.name !== 'fieldflow_test') {
    throw new Error('Refusing to modify a non-test database')
  }
}

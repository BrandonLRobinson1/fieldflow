import { createApp } from './app'
import { pool } from './db'

const app = createApp(pool)

const port = 3000

app.listen(port, () => {
  console.log(`app on 🔥 on port ${port}`)
})

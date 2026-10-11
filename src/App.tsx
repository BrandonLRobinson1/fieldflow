import { useState } from 'react'
import './App.css'

function App() {
  const [joinedWaitlist, setJoinedWaitlist] = useState(false)
  const waitlistText = joinedWaitlist ? `You're on the Waitlist!` : 'Join the Waitlist'

  return (
    <section id="center">
      <h1>FieldFlow</h1>
      <h2>Capture extra work. Get it approved. Get it paid.</h2>
        <p>Stop letting field changes become free work.</p>
        <button onClick={() => setJoinedWaitlist(true)}>{waitlistText}</button>
    </section>
  )
}

export default App

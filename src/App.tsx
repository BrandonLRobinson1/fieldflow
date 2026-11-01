import { useState, useEffect, type FormEvent } from 'react'
import './App.css'

function App() {
  const [joinedWaitlist, setJoinedWaitlist] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!email.trim()) return
      const response = await fetch('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success !== true) {
        throw new Error('Waitlist request was not accepted')
      }

      console.log(data)
      setJoinedWaitlist(true)
    } catch (e) {
      console.error(e)
    }
  }

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (!email.trim()) return
  //   setJoinedWaitlist(true)
  //   setEmail('')
  // }

  useEffect(() => {
    const checkHealthCall = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/health')
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json()

        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }

    checkHealthCall()
  }, [])

  return (
    <div className="app">
      <main className="container">
        <section className="hero">
          <h1 className="hero__title">FieldFlow</h1>

          <h2 className="hero__subtitle">Capture extra work. Get it approved. Get it paid.</h2>

          <p className="hero__description">Stop letting field changes become free work.</p>

          {!joinedWaitlist ? (
            <form className="form" onSubmit={handleSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  className="form__input"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="btn btn--primary" type="submit">
                Join the Waitlist
              </button>
            </form>
          ) : (
            <p className="message message--success">✅ You're on the Waitlist!</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App

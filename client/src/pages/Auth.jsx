import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Auth() {
  const isRegister = useLocation().pathname === '/register'
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser's default page reload
    setError(null)
    setSubmitting(true)
    try {
      if (isRegister) await register(name, email, password)
      else await login(email, password)
      navigate('/') // success: go home
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'h-11 w-full rounded-lg bg-surface-700 px-4 text-sm outline-none placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500'

  return (
    <div className="mx-auto mt-8 max-w-sm">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {isRegister ? 'Create your account' : 'Welcome back'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {isRegister && (
          <input
            className={inputClass}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className={inputClass}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-full bg-brand-500 font-semibold transition hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? 'Please wait...' : isRegister ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-300">
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-brand-400 hover:underline">
          {isRegister ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}

export default Auth
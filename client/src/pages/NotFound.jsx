import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <p className="text-6xl font-extrabold text-brand-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page doesn't exist</h1>
      <p className="mt-2 text-ink-300">The link may be broken, or the page may have moved.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-brand-500 px-6 py-2 font-semibold transition hover:bg-brand-600"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
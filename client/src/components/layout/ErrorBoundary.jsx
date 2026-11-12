import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  // React calls this when a child throws while rendering
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  // A good place to log; later this could go to an error-tracking service
  componentDidCatch(error, info) {
    console.error('UI crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-extrabold">Something went wrong</h1>
          <p className="text-ink-300">An unexpected error occurred. Your music is safe.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-brand-500 px-6 py-2 font-semibold transition hover:bg-brand-600"
          >
            Reload Sonic
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
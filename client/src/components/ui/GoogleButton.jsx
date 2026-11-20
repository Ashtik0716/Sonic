import { useEffect, useRef } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleButton({ onCredential }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!CLIENT_ID) return

    // Google's script loads asynchronously, so wait for it
    function init() {
      if (!window.google || !ref.current) return false
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      })
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        width: 320,
      })
      return true
    }

    if (init()) return
    const timer = setInterval(() => {
      if (init()) clearInterval(timer)
    }, 200)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!CLIENT_ID) return null
  return <div ref={ref} className="flex justify-center" />
}

export default GoogleButton
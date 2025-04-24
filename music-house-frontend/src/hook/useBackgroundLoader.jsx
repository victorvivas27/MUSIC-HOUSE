import { useEffect, useState } from 'react'

const useBackgroundLoader = (url, delay = 500) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      setTimeout(() => setLoaded(true), delay)
    }
  }, [url, delay])

  return loaded
}

export default useBackgroundLoader
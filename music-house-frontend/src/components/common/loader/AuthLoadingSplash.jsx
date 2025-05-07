import { useEffect, useState } from 'react'
import { Loader } from '@/components/common/loader/Loader'

const AuthLoadingSplash = ({ delay = 1000 }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  return (
    <Loader
      title="Verificando sesión..."
      fullSize={true}
      show={true}
      blur="5px"
    />
  )
}

export default AuthLoadingSplash
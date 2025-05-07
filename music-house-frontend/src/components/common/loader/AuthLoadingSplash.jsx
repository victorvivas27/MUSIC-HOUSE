import { useEffect, useState } from 'react'
import { Loader } from '@/components/common/loader/Loader'
import PropTypes from 'prop-types'

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
AuthLoadingSplash.propTypes = {
  delay: PropTypes.number,
 
}

export default AuthLoadingSplash
import { useEffect, useState } from "react"
import { Loader } from "../loader/Loader"
import PropTypes from "prop-types"

/**
 * SmartLoader muestra el loader solo la primera vez que se monta el componente.
 * Usa sessionStorage para recordar si ya se mostró.
 */
const SmartLoader = ({
    title = 'Cargando...',
    delay = 1000,
    storageKey = 'hasVisitedSmartLoader',
    fullSize = true,
    ...rest
  }) => {
    const [show, setShow] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
  
    useEffect(() => {
      const hasVisited = sessionStorage.getItem(storageKey) === 'true'
      if (hasVisited) return 
  
      setShow(true)
      setShouldRender(true)
  
      const timer = setTimeout(() => {
        sessionStorage.setItem(storageKey, 'true')
        setShow(false)
        setTimeout(() => setShouldRender(false), 100) 
      }, delay)
  
      return () => clearTimeout(timer)
    }, [delay, storageKey])
  
    if (!shouldRender) return null
  
    return (
      <Loader
        title={title}
        fullSize={fullSize}
        show={show}
        {...rest}
      />
    )
  }
  
  SmartLoader.propTypes = {
    title: PropTypes.string,
    delay: PropTypes.number,
    storageKey: PropTypes.string,
    fullSize: PropTypes.bool
  }
  
  export default SmartLoader
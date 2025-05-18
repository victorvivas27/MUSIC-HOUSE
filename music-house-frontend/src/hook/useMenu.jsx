import { useRef } from "react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const lastButtonRef = useRef(null)
  const { pathname } = useLocation()

  const handleToggle = (event) => {
    const clickedEl = event.currentTarget
   

    if (anchorEl && lastButtonRef.current === clickedEl) {
    
      setAnchorEl(null)
      lastButtonRef.current = null
    } else {
    
      setAnchorEl(clickedEl)
      lastButtonRef.current = clickedEl
    }
  }

  const handleClose = () => {
    
    setAnchorEl(null)
    lastButtonRef.current = null
  }

  useEffect(() => {
   
    handleClose()
  }, [pathname])

  const isOpen = Boolean(anchorEl)
 

  return { anchorEl, isOpen, handleToggle, handleClose }
}
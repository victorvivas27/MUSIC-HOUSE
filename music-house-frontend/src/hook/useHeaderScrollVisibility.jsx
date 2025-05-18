import { useEffect, useRef, useState } from "react"

export const useHeaderScrollVisibility = (toggleHeaderVisibility) => {
  const [visible, setVisible] = useState(true)
  const prevScroll = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const isVisible =
        (prevScroll.current > currentScroll &&
          prevScroll.current - currentScroll > 70) ||
        currentScroll < 10

      // Solo actualizar si el valor realmente cambia
      if (isVisible !== visible) {
        setVisible(isVisible)
        toggleHeaderVisibility(isVisible)
      }

      prevScroll.current = currentScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [visible, toggleHeaderVisibility])

  return visible
}
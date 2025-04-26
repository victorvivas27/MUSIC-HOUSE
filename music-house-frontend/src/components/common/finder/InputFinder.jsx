import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, InputBase } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
export const InputFinder = ({ value, setValue, onKeyUp, onKeyDown, inputRef, collapsed }) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (collapsed) {
      setExpanded(false)
    }
  }, [collapsed])
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setExpanded(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const handleChange = (e) => {
    if (typeof setValue === 'function') {
      setValue(e.target.value.trim())
    }
  }

  return (
    <Box
      ref={inputRef}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '45px',
        backgroundColor: expanded ? 'var(--color-secundario-80)' : 'var(--background-transparente-dark)',
        borderRadius: '30px',
        overflow: 'hidden',
        padding: expanded ? '0 10px' : '0',
        boxShadow: expanded ? '0 0 8px 2px var(--color-primario)' : 'none',
        transition: 'all 0.4s ease',
        width: expanded ? { xs: '280px', md: '450px' } : '55px',
      }}
    >
      <IconButton
        onClick={() => setExpanded(true)}
        sx={{
          color: 'var(--color-primario)',
          p: 1,
          ml: expanded ? 0 : 'auto',
          animation: 'vibrate-2 1.5s linear infinite paused',
          '&:hover': { animationPlayState: 'running' }
        }}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        placeholder="Buscar instrumento....."
        value={value}
        onChange={handleChange}
        onKeyUp={(e) => onKeyUp && onKeyUp(e.keyCode)}
        onKeyDown={(e) => onKeyDown && onKeyDown(e.keyCode)}
        sx={{
          ml: 1,
          flex: 1,
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  )
}

InputFinder.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onClose: PropTypes.func,
  collapsed: PropTypes.bool
}

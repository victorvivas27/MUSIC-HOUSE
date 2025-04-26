import { useState, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { InputFinder } from './InputFinder'
import {  useLocation, useNavigate } from 'react-router-dom'

import { searchInstrumentsByName } from '@/api/instruments'
import { createPortal } from 'react-dom'

export const Finder = () => {
  const [searchPattern, setSearchPattern] = useState('')
  const [showSugests, setShowSugests] = useState(false)
  const [found, setFound] = useState(false)
  const [instruments, setInstruments] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const inputRef = useRef()
  const observer = useRef()
  const location = useLocation()
  const pageSize = 2
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const navigate = useNavigate()

  const handleNavigate = (idInstrument) => {
    navigate(`/instrument/${idInstrument}`)
    clearFinder() 
  }

  const fetchInstruments = async (pattern, currentPage = 0) => {
    if (pattern.trim() === '') {
      setInstruments([])
      setShowSugests(false)
      return
    }
    try {
      const response = await searchInstrumentsByName(pattern, currentPage, pageSize)
      const content = response?.result?.content || []
      const totalPages = response?.result?.totalPages || 1

      if (currentPage === 0) {
        setInstruments(content)
      } else {
        setInstruments((prev) => [...prev, ...content])
      }

      setFound(content.length > 0)
      setHasMore(currentPage + 1 < totalPages)
      setShowSugests(true)
    } catch (error) {
      setInstruments([])
      setFound(false)
      setShowSugests(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchPattern) {
        setPage(0)
        fetchInstruments(searchPattern, 0)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchPattern])

  useEffect(() => {
    if (location.pathname !== '/') {
      clearFinder()
    }
  }, [location.pathname])

  const clearFinder = () => {
    setSearchPattern('')
    setInstruments([])
    setShowSugests(false)
    setPage(0)
    setHasMore(false)
  }

  const handleKeyUp = (keyCode) => {
    if (keyCode === 27) {
      clearFinder()
    }
  }

  const handleKeyDown = (keyCode) => {
    if (keyCode === 9) setShowSugests(false)
  }

  const lastElementObserver = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [hasMore]
  )

  useEffect(() => {
    if (page > 0) {
      fetchInstruments(searchPattern, page)
    }
  }, [page])

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setPosition({
        left: rect.left,
        top: rect.top + rect.height + 8,
        width: rect.width
      })
    }
  }, [showSugests, searchPattern])

  return (
    <Box
      sx={{
        position: 'relative',
        padding: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <InputFinder
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        value={searchPattern}
        setValue={setSearchPattern}
        inputRef={inputRef}
        collapsed={!showSugests} 
      />

      {showSugests && found && createPortal(
        <Box
          sx={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            backgroundColor: 'var(--color-secundario-80)',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            zIndex: 99999,
            maxHeight: '300px',
            overflowY: 'auto',
            animation: 'fadeSlideDown 0.4s ease forwards'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
              backgroundColor: 'var(--color-primario)',
              borderBottom: '1px solid #ccc',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          >
            <strong style={{ fontSize: '0.95rem' }}>
              Resultados de búsqueda
            </strong>
            <IconButton
              sx={{ width: 30, height: 30 }}
              size="small"
              onClick={clearFinder}
            >
              <Close sx={{ fontSize: 22, color: 'var(--color-error)' }} />
            </IconButton>
          </Box>

          <List>
            {instruments.map((instrument, index) => {
              const isLast = index === instruments.length - 1
              return (
                <ListItem
                key={instrument.idInstrument || index}
                ref={isLast ? lastElementObserver : null}
                onClick={() => handleNavigate(instrument.idInstrument)} // ✅
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'var(--color-secundario)'
                  },
                  px: 2,
                  py: 1
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'var(--color-primario)',
                    fontWeight: 500,
                  }}
                >
                  <img
                    src={instrument.imageUrls?.[0]?.imageUrl || '/src/assets/instrumento_general_03.jpg'}
                    alt={instrument.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <ListItemText
                    primary={instrument.name}
                    primaryTypographyProps={{
                      fontSize: '0.95rem'
                    }}
                  />
                </Box>
              </ListItem>
              )
            })}
          </List>
        </Box>,
        document.body // 📢 Aquí enviamos el menú al body
      )}
    </Box>
  )
}

import { Box, Typography, keyframes, useMediaQuery, useTheme} from '@mui/material'
import  { useEffect, useState } from 'react'
import logo from '../../assets/whatsAppLogo.png'
import { useAuth } from '@/hook/useAuth'

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

export const WhatsAppContact = () => {
  const { isUserAdmin } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const phoneNumber = '+56986841970'
  const whatsappUrl = `https://wa.me/${phoneNumber}`
  useEffect(() => {
    if (isMobile && expanded) {
      const timer = setTimeout(() => setExpanded(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [expanded, isMobile])

  if (isUserAdmin) return null

  const iconSize = isMobile ? 28 : 35
  const collapsedWidth = iconSize + 15
  const expandedWidth = isMobile ? 210 : 240

  const handleClick = () => {
    if (isMobile) {
      if (!expanded) {
        setExpanded(true)
      } else {
        window.open(whatsappUrl, '_blank')
      }
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleMouseEnter = () => {
    if (!isMobile) setExpanded(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) setExpanded(false)
  }

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      sx={{
        width: expanded ? expandedWidth : collapsedWidth,
        height: collapsedWidth,
        borderRadius: '60px 60px 60px 20px',
        boxShadow: 3,
        p: 1,
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: expanded ? '#00e676' : '#00c853',
        position: 'fixed',
        bottom: 50,
        right: 20,
       '&:active': {
          transform: 'scale(0.95)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: expanded ? 'flex-start' : 'center',
          paddingLeft: expanded ? '10px' : '0'
        }}
      >
        <img
          src={logo}
          alt="WhatsApp"
          style={{ 
            width: iconSize, 
            height: iconSize,
            transition: 'transform 0.3s ease',
            transform: expanded ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        {expanded && (
          <Typography
            sx={{
              ml: 2,
              color: '#fff',
              animation: `${slideIn} 0.4s ease-out forwards`,
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: isMobile ? '0.95rem' : '1.05rem',
              letterSpacing: '0.5px',
            }}
          >
            ¿Necesitas ayuda?
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default WhatsAppContact

import { useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useNavigate, Link } from 'react-router-dom'
import '../components/styles/transitions.css'

import { Logo } from '@/components/Images/Logo'
import Login from '@/components/Form/usuario/Login'
import NewUser from '@/components/Form/usuario/NewUser'
import {
  BoxFormUnder,
  BoxLogoSuperior,
  ContainerLogo,
  MainCrearUsuario
} from '@/components/styles/ResponsiveComponents'
import useBackgroundLoader from '@/hook/useBackgroundLoader'
import { Box, CircularProgress, Typography } from '@mui/material'

const background =
  'https://music-house-78.s3.us-east-1.amazonaws.com/CrearUsuarioBackGround.avif'

const AuthPage = () => {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(true)
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)
  const bgLoaded = useBackgroundLoader(background, 300)

  const handleSwitch = (e) => {
    e.preventDefault()
    setShowLogin(!showLogin)
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [showLogin])

  return (
    <MainCrearUsuario container bgLoaded={bgLoaded}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background:
            'linear-gradient(135deg, rgba(30, 30, 30, 0.44) 0%, rgba(45, 45, 45, 0.38) 100%)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 1s ease-in-out',
          animation: bgLoaded ? 'fadeOut 1s ease-out forwards' : 'none',
          '@keyframes fadeOut': {
            '0%': { opacity: 1 },
            '100%': { opacity: 0, visibility: 'hidden' }
          }
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CircularProgress size={48} thickness={4} color="inherit" />
        </Box>
        <Typography
          sx={{
            color: 'white',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            fontWeight: 300,
            opacity: 0.6
          }}
        >
          Cargando...
        </Typography>
      </Box>

      <BoxLogoSuperior>
        <Link to="/" onClick={() => navigate('/')}>
          <ContainerLogo>
            <Logo />
          </ContainerLogo>
        </Link>
      </BoxLogoSuperior>

      <BoxFormUnder sx={{ height: contentHeight }}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={showLogin ? 'Login' : 'NewUser'}
            timeout={1000}
            classNames="fade"
            unmountOnExit
          >
            <div ref={contentRef}>
              {showLogin ? (
                <Login onSwitch={handleSwitch} />
              ) : (
                <NewUser onSwitch={handleSwitch} />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </BoxFormUnder>
    </MainCrearUsuario>
  )
}

export default AuthPage

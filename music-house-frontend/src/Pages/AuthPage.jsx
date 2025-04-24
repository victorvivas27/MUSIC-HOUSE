import { useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useNavigate, Link } from 'react-router-dom'
import '../components/styles/transitions.css'

import { Logo } from '@/components/Images/Logo'
import Login from '@/components/Form/usuario/Login'
import NewUser from '@/components/Form/usuario/NewUser'
import { BoxFormUnder, BoxLogoSuperior, ContainerLogo, MainCrearUsuario } from '@/components/styles/ResponsiveComponents'
import useBackgroundLoader from '@/hook/useBackgroundLoader'
import { Box, Skeleton } from '@mui/material'

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
     
      {!bgLoaded && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#1a1a1a',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{
              backgroundColor: '#1a1a1a',
              backgroundImage:
                'linear-gradient(90deg, rgba(60,60,60,0.15) 25%, rgba(90,90,90,0.25) 50%, rgba(60,60,60,0.15) 75%)',
              backgroundSize: '200% 100%'
            }}
          />
        </Box>
      )}

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
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
import FullScreenLoader from '@/components/common/fullScreenLoader/FullScreenLoader'
import { Box } from '@mui/material'
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

        {/* 👉 Fondo tipo vidrio */}
  {bgLoaded && (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        //backdropFilter: 'blur(7px) brightness(1)',
        background: 'var(--gradiente-dorado)',
        zIndex: 0
      }}
    />
  )}
      <FullScreenLoader bgLoaded={bgLoaded} text="Cargando" />

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

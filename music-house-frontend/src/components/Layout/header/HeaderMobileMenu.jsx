import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { pagesMobile } from '../NavBar'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import MenuIcon from '@mui/icons-material/Menu'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'
import { useAuth } from '@/hook/useAuth'
import { useMenu } from '@/hook/useMenu'

const HeaderMobileMenu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    authGlobal,
    logOut,
    isUserAdmin,
    isUser,
    userPicture
  } = useAuth()

  const { anchorEl, isOpen, handleToggle, handleClose } = useMenu()

  return (
    <Box
      sx={{
        display: {
           xs: 'flex',
            md: 'none' 
          },
      cursor: 'pointer'
      }}
      onClick={handleToggle}
    >
    <Box>
  {authGlobal ? (
    userPicture ? (
      <Avatar
        src={userPicture}
        sx={{
          height: { md: 35, lg: 40 },
          width: { md: 35, lg: 40 },
          fontSize: 18,
          bgcolor: 'var(--color-claro)',
          color: 'var(--color-primario)',
          fontWeight: 'bold'
        }}
      />
    ) : null
  ) : (
    <MenuIcon />
  )}
</Box>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        hideBackdrop
         sx={{
          '& .MuiPaper-root': {
            background: 'var(--gradiente-cafe)',
            color: 'var(--texto-primario)',
            borderRadius: '1.5rem',
            padding: '0.5rem',
            width: {
              md: '18%',
              lg: '20%',
              xl:'15%'
            },
            border: '2px solid var(--color-primario)'
          },
          marginTop: 1
        }}
      >
        {pagesMobile.map((page, index) => {
          const handleClick = () => {
            if (page.scrollTo) {
              if (pathname !== page.to) {
                navigate(page.to)
                setTimeout(() => {
                  const element = document.querySelector(page.scrollTo)
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }, 300)
              } else {
                const element = document.querySelector(page.scrollTo)
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }
            } else {
              navigate(page.to)
            }
            handleClose()
          }

          const shouldShow =
            (page.user && isUser) ||
            (page.admin && isUserAdmin) ||
            (page.anonymous && !(isUser || isUserAdmin)) ||
            page.any

          return (
            shouldShow && (
              <MenuItem key={`menu-nav-${index}`} onClick={handleClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {page.icon}
                  <Typography textAlign="left" fontWeight={500}>
                    {page.text}
                  </Typography>
                </Box>
              </MenuItem>
            )
          )
        })}

        {authGlobal ? (
          [
            <MenuItem
              key="perfil"
              onClick={() => {
                navigate('/perfil')
                handleClose()
              }}
            >
              <AssignmentIndRoundedIcon  sx={{  color: 'var(--color-primario)', mr: 1 }} />
              <Typography textAlign="center">Mi Perfil</Typography>
            </MenuItem>,

            <MenuItem key="logout" onClick={logOut}>
              <LogoutRoundedIcon sx={{  color: 'red', mr: 1 }} />
              <Typography textAlign="center">Cerrar sesión</Typography>
            </MenuItem>
          ]
        ) : (
          <MenuItem
            onClick={() => {
              navigate('/autentificacion')
              handleClose()
            }}
          >
            <LoginRoundedIcon className="vibrate-2" />
            <Typography textAlign="center">Iniciar sesión</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default HeaderMobileMenu

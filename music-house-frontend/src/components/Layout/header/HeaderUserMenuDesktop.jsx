import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { useAuth } from '@/hook/useAuth'
import { useMenu } from '@/hook/useMenu'
import { Avatar, Box, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'

const HeaderUserMenuDesktop = () => {
  const { authGlobal, logOut, userName, userLastName, userPicture } = useAuth()
  const navigate = useNavigate()
  const { anchorEl, isOpen, handleToggle, handleClose } = useMenu()

  return (
    <>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex'
          }
        }}
      >
        <Tooltip title="Opciones" arrow placement="left">
          <Box
            onClick={handleToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              background: 'var(--gradiente-cafe)',
              borderRadius: '32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              },
              width: {
                md: 150,
                lg: 260
              }
            }}
          >
            <Avatar
              src={userPicture || undefined}
              sx={{
                height: {
                  md: 35,
                  lg: 40
                },
                width: {
                  md: 35,
                  lg: 40
                },
                fontSize: 18,
                bgcolor: 'var(--color-claro)',
                color: 'var(--color-primario)',
                fontWeight: 'bold'
              }}
            >
              {!userPicture && userName && userLastName
                ? `${userName.charAt(0)}${userLastName.charAt(0)}`
                : null}
            </Avatar>
            <ParagraphResponsive
              sx={{
                
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={`${userName} ${userLastName}`} // Tooltip nativo
            >
              {`${userName} ${userLastName}`}
            </ParagraphResponsive>
          </Box>
        </Tooltip>
      </Box>

      {/* Menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
        {authGlobal ? (
          [
            <MenuItem
              key="perfil"
              onClick={() => {
                navigate('/perfil')
                handleClose()
              }}
            >
              <AssignmentIndRoundedIcon
                sx={{ fontSize: 30, color: 'var(--color-primario)', mr: 1 }}
              />
              <Typography>Mi Perfil</Typography>
            </MenuItem>,

            <MenuItem key="logout" onClick={logOut}>
              <LogoutRoundedIcon sx={{ fontSize: 30, color: 'red', mr: 1 }} />
              <Typography>Cerrar sesión</Typography>
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
            <Typography>Iniciar sesión</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default HeaderUserMenuDesktop

// HeaderDesktopMenu.jsx
import { Box, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/useAuth'
import { pagesDesktop } from '../NavBar'

const HeaderDesktopMenu = () => {
  const { isUserAdmin, isUser } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: {
          xs: 'none',
          md: 'flex',
          justifyContent: 'space-evenly'
        }
      }}
    >
      {pagesDesktop.map((page, index) => {
        const shouldShow =
          (page.admin && isUserAdmin) ||
          (page.user && isUser) ||
          (page.anonymous && !(isUser || isUserAdmin)) ||
          page.any

        const isActive = pathname === page.to && !page.scrollTo

        return (
          shouldShow && (
            <Button
              key={`menu-option-${index}`}
              onClick={() => {
                if (page.scrollTo) {
                  navigate(page.to, { replace: false })
                  setTimeout(() => {
                    const element = document.querySelector(page.scrollTo)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }, 100)
                } else {
                  navigate(page.to)
                }
              }}
              sx={{
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                fontSize: {
                  md: 10,
                  lg: 13
                },
                backgroundColor: isActive
                  ? 'var(--background-claro)'
                  : 'var( --background-transparente)',
                color: isActive
                  ? 'var( --texto-primario)'
                  : 'var( --texto-secundario)',
                height: 45,
                px: 2,

                transition: 'all 0.2s ease-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-1px)',
                  boxShadow: 'var(--box-shadow)',
                  color: 'var(--color-primario)'
                }
              }}
            >
              {page.icon}
              {page.text}
            </Button>
          )
        )
      })}
    </Box>
  )
}

export default HeaderDesktopMenu

import { HeaderWrapper } from './HeaderWrapper'
import { UpperStyledToolbar, LowerStyledToolbar } from '../StyledToolbar'
import { Link, useLocation } from 'react-router-dom'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import background from '../../../assets/background.svg'
import { useAuth } from '../../../hook/useAuth'
import HeaderMobileMenu from './HeaderMobileMenu'
import HeaderDesktopMenu from './HeaderDesktopMenu'
import { Container } from '@mui/material'
import { Finder } from '@/components/common/finder/InstrumentsFinder'
import { ContainerLogo } from '@/components/styles/ResponsiveComponents'
import { Logo } from '@/components/Images/Logo'
import { useHeaderScrollVisibility } from '@/hook/useHeaderScrollVisibility'
import HeaderUserMenuDesktop from './HeaderUserMenuDesktop'

export const Header = () => {
  const { authGlobal } = useAuth()
  const { toggleHeaderVisibility } = useHeaderVisibility()
  const visible = useHeaderScrollVisibility(toggleHeaderVisibility)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <HeaderWrapper
      backgroundImageUrl={background}
      sx={{
        transition: 'top 1.2s',
        top: visible ? '0' : '-300px'
      }}
    >
      <Container maxWidth="xl" sx={{marginTop:"10px"}} >
        <UpperStyledToolbar >
          
          <HeaderMobileMenu />

          <HeaderDesktopMenu />

          {authGlobal && <HeaderUserMenuDesktop />}

          <Link to="/">
            <ContainerLogo>
              <Logo />
            </ContainerLogo>
          </Link>
        </UpperStyledToolbar>

        <LowerStyledToolbar sx={{ display: `${isHome ? 'flex' : 'none'}` }}>
          <Finder />
        </LowerStyledToolbar>
      </Container>
    </HeaderWrapper>
  )
}

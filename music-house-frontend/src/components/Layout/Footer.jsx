import { TitleResponsive } from '../styles/ResponsiveComponents'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Copyright } from '@mui/icons-material'
import { flexRowContainer } from '../styles/styleglobal'
import FaqForm from '../common/faq/FaqForm'


export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
        color: 'var(--color-primario)',
        px: { xs: 2, sm: 4 },
        pt: 6,
        pb: 3,
        mt: 6
      }}
    >
      <Box
        sx={{
          borderTop: '1px solid var( --texto-secundario)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          ...flexRowContainer,
          justifyContent: 'space-evenly',
          margin: 'auto',
          gap: 4
        }}
      >
        {/* Contacto */}
        <Box>
          <TitleResponsive gutterBottom>Contacto</TitleResponsive>
          <Typography variant="body2">📍 Av. Principal 1234, Ciudad</Typography>
          <Typography variant="body2">📞 +56 9 1234 5678</Typography>
        </Box>

        {/* Redes Sociales */}
        <Box>
          <TitleResponsive gutterBottom>Redes Sociales</TitleResponsive>
          <Stack direction="row" spacing={1}>
            {[
              FacebookIcon,
              InstagramIcon,
              TwitterIcon,
              LinkedInIcon,
              YouTubeIcon
            ].map((Icon, i) => (
              <IconButton
                key={i}
                color="inherit"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Stack>
        </Box>
        <FaqForm />
      </Box>

      {/* Copyright */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="body2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <Copyright /> 2024 MusicHouse. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer

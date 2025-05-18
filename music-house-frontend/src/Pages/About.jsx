import { styled } from '@mui/material/styles'
import {
  CssBaseline,
 
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  MainWrapper,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import imageAbout from '@/components/Images/image_about.png'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'
import { useContext } from 'react'
import { AuthContext } from '@/components/utils/context/AuthContext'
import Feedback from './Feedback'
import Faq from './Faq'



const CustomTypography = styled(Box)(({ theme, bgColor }) => ({
  padding: '1rem 1rem',
  fontWeight: 'bold',
  width: 'fit-content',
  color: 'white',
  backgroundColor: bgColor || theme.palette.primary.main,
  borderRadius: '8px',
  boxShadow: 'var(--box-shadow)',
  marginBottom: '1rem'
}))

export const About = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery('(max-width: 1240px) and (min-width: 1000px)')
  const { isUser, isUserAdmin } = useContext(AuthContext);

const shouldShowFeedback = isUser && !isUserAdmin;

  return (
    <main>
      <CssBaseline />
      <MainWrapper>
          
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',

            gap: 1
          }}
        >
          <Box>
            <TitleResponsive sx={{ color: 'var(--color-primario)' }}>
              🎶 Bienvenido a Music House
            </TitleResponsive>
            <ParagraphResponsive sx={{ color: 'var(--color-primario)' }}>
              Donde cada nota cobra vida. Nos dedicamos a ofrecer experiencias
              musicales auténticas a través del alquiler de instrumentos de alta
              calidad y asesoría personalizada para artistas de todos los
              niveles.
            </ParagraphResponsive>
          </Box>

          <Box>
            <CustomTypography>
              <TitleResponsive>🎸 Nuestra Propuesta</TitleResponsive>
            </CustomTypography>

            <ParagraphResponsive sx={{ color: 'var(--color-primario)' }}>
              En Music House nos enfocamos en facilitar el acceso a instrumentos
              musicales profesionales para estudio, práctica o eventos.
              Transformamos sueños en experiencias musicales satisfactorias, sin
              importar tu nivel o trayectoria artística.
            </ParagraphResponsive>
          </Box>

          <Box>
            <CustomTypography>
              <TitleResponsive>🧑‍🎤 ¿Quiénes somos?</TitleResponsive>
            </CustomTypography>
            <ParagraphResponsive sx={{ color: 'var(--color-primario)' }}>
              Somos un equipo apasionado por la música y la educación artística.
              Conectamos a músicos con las herramientas necesarias para
              potenciar su talento, brindando orientación, calidad y compromiso
              en cada servicio.
            </ParagraphResponsive>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3
            }}
          >
            <Box
              sx={{
                maxWidth: isMobile ? '100%' : isTablet ? '85%' : '50%',
                marginX: 'auto',
                borderRadius: 2,
                overflow: 'hidden',
                zIndex: 0,
                minHeight: 300
              }}
            >
              <ImageWithLoader
                src={imageAbout}
                alt="Músicos en escena"
                variant="rectangular"
                width="100%"
                height={{ xs: 250, sm: 300, md: 350, lg: 400 }}
                borderRadius="0.5rem"
              />
            </Box>

            <Box>
              <CustomTypography>
                <TitleResponsive>📦 Lo que ofrecemos</TitleResponsive>
              </CustomTypography>
              <ParagraphResponsive sx={{ color: 'var(--color-primario)' }}>
                Alquiler flexible, instrumentos probados y mantenidos, atención
                personalizada y variedad de accesorios complementarios.
              </ParagraphResponsive>
            </Box>
          </Box>

          <Box>
            <CustomTypography>
              <TitleResponsive>🌟 Nuestra Misión</TitleResponsive>
            </CustomTypography>
            <ParagraphResponsive sx={{ color: 'var(--color-primario)' }}>
              Ser el puente entre los músicos y sus metas. Ofrecer una
              experiencia musical completa, confiable y accesible, que acompañe
              cada nota en tu camino artístico.
            </ParagraphResponsive>
          </Box>
        </Container>
      </MainWrapper>

      {shouldShowFeedback && <Feedback />}

       {shouldShowFeedback && (<Faq/>)}
    </main>
  )
}

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import {
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { flexColumnContainer } from '@/components/styles/styleglobal'

import ImageWithLoader from '../imageWithLoader/ImageWithLoader'

const TematicCard = ({ title, imageUrlTheme, paragraph }) => {
  return (
    <Card
      sx={{
        width: { xs: '98%', sm: '99%', md: '99%', lg: '99%' },
        position: 'relative'
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: { xs: 350, sm: 400, md: 450, lg: 460 },
          position: 'relative',
          textAlign: 'center',
          ...flexColumnContainer,
          overflow: 'hidden'
        }}
      >
        {/* Fondo con loader */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ImageWithLoader
            src={imageUrlTheme}
            width="100%"
            height="100%"
            variant="rectangular"
            border="none"
            borderRadius="0"
           
          />
        </Box>

        {/* Overlay contenido */}
        <Box
          sx={{
            border: '1px solid rgba(255, 255, 255, 0.3)',
            width: '95%',
            maxWidth: 680,
            mx: 'auto',
            px: 3,
            py: 2,
            position: 'relative',
            zIndex: 2,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            mt: 'auto',
            mb: 2,
            color: '#fff',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.25)',
              boxShadow: '0 6px 36px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <TitleResponsive>{title}</TitleResponsive>
          <ParagraphResponsive>{paragraph}</ParagraphResponsive>
        </Box>
      </CardMedia>
    </Card>
  )
}

TematicCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrlTheme: PropTypes.string.isRequired,
  paragraph: PropTypes.string
}

export default TematicCard

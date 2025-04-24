import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import PropTypes from 'prop-types'
import { Box} from '@mui/material'
import {
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { flexColumnContainer } from '@/components/styles/styleglobal'
import useImageLoader from '@/hook/useImageLoader'
import ImageSkeleton from '../imageSkeleton/ImageSkeleton'
const TematicCard = ({ title, imageUrlTheme, paragraph }) => {
  const loaded = useImageLoader(imageUrlTheme, 500)
 
  
   
  return (
    <Card
    
    sx={{
      width: {
        xs: '98%',
        sm: '99%',
        md: '99%',
        lg: '99%'
      },
      position: 'relative'
    }}
  >
    {!loaded && (
     <ImageSkeleton height={{ xs: 350, sm: 400, md: 450, lg: 460 }} />
    )}

    <CardMedia
     component="div"
      sx={{
        height: {
          xs: 350,
          sm: 400,
          md: 450,
          lg: 460
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: loaded
          ? `url(${encodeURI(imageUrlTheme)})`
          : 'none',
        position: 'relative',
        color: 'white',
        textAlign: 'center',
        ...flexColumnContainer,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        },
        zIndex: 1
      }}
    >
      {loaded && (
        <Box
          sx={{
            border: '1px dotted var(--texto-inverso-white)',
            width: '90%',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            borderRadius: '8px',
            mt: 'auto',
            mb: 2,
            mx: 'auto'
          }}
        >
          <TitleResponsive>{title}</TitleResponsive>
          <ParagraphResponsive>{paragraph}</ParagraphResponsive>
        </Box>
      )}
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

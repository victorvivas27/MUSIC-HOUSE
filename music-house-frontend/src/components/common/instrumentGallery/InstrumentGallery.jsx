import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import ImageWithLoader from '../imageWithLoader/ImageWithLoader'

export const InstrumentGallery = ({ itemData }) => {
  return (
    <Box>
      <ImageList>
        {itemData?.map((item, index) => (
          <ImageListItem
            key={`gallery-image-${index}`}
            sx={{
              overflow: 'hidden',
              borderRadius: '14px',
              transition:
                'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 'var(--box-shadow)'
              }
            }}
          >
            <ImageWithLoader
              src={item.imageUrl}
              fallbackSrc="/src/assets/instrumento_general_03.jpg"
              alt="Instrumento de galería"
               variant="rectangular"
              width="100%"
              height="auto"
              borderRadius="10px"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}
InstrumentGallery.propTypes = {
  itemData: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired
    })
  )
}

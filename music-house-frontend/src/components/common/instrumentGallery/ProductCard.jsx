import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  IconButton
} from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PropTypes from 'prop-types'
import { red } from '@mui/material/colors'

import { useAuth } from '@/hook/useAuth'
import { CustomTooltip } from '../customTooltip/CustomTooltip'
import FavoriteIcon from '../favorito/FavoriteIcon'

import ImageWithLoader from '../imageWithLoader/ImageWithLoader'
import { slugify } from '@/components/utils/slugify'

const ProductCard = ({ name, imageUrl, id, rentalPrice }) => {
  const { isUser } = useAuth()
  const slug = slugify(name)
  return (
    <Card
      sx={{
        width: { xs: 160, sm: 200, md: 220, lg: 230, xl: 250 },
        height: { xs: 280, sm: 360, md: 380, lg: 400, xl: 420 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        borderRadius: 4,
        boxShadow: 'var(--box-shadow)',
        padding: 2,
        gap: 1,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
          backgroundColor: 'background.default'
        },
        margin: 1
      }}
    >
      <CardHeader
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          width: '100%',
          padding: 0
        }}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], width: 30, height: 30 }}
            aria-label="product"
          >
            {name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />

      <CustomTooltip
        title={
          <Typography sx={{ fontFamily: 'Roboto', fontSize: 10 }}>
            <strong>✅ Más info</strong>
          </Typography>
        }
        arrow
      >
       <Link to={`/instrument/${id}/${slug}`}>
          <ImageWithLoader
            src={imageUrl}
            variant="circular"
            width={{ xs: 100, sm: 120, md: 140, lg: 160, xl: 180 }}
            height={{ xs: 100, sm: 120, md: 140, lg: 160, xl: 180 }}
          />
        </Link>
      </CustomTooltip>

      {/* ✅ Título debajo de la imagen */}
      <Box
        sx={{
          width: '110%',
          minHeight: { xs: 40, sm: 60, md: 70 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: {
              xs: '0.5rem',   
              sm: '0.6rem',   
              md: '0.7rem',  
              lg: '0.8rem',   
              xl: '0.9rem'    
            },
           
            fontStyle: 'italic'
          }}
        >
          {name}
        </Typography>
      </Box>

      <CardActions
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
          marginTop: 'auto',
          height: 40
        }}
      >
        {isUser && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon idInstrument={id} />
              <ShareIcon
                sx={{
                  fontSize: { xs: 18, sm: 20, md: 22, lg: 23, xl: 24 }
                }}
              />
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                color: 'text.primary'
              }}
            >
              ${rentalPrice}
            </Typography>
          </>
        )}
      </CardActions>
    </Card>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  rentalPrice: PropTypes.number
}

export default ProductCard

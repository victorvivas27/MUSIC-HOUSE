import { Rating } from '@mui/material'
import PropTypes from 'prop-types'
 import StarIcon from '@mui/icons-material/Star'

const CustomRating = ({ value, size = 'medium' }) => (
  <Rating
    value={value}
    readOnly
    precision={1}
    size={size}
    icon={<StarIcon  sx={{ color: '#ffb400', fontSize: 40}}/>}
    emptyIcon={
     <StarIcon  sx={{  fontSize: 40}}/>
    }
  />
)

CustomRating.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default CustomRating

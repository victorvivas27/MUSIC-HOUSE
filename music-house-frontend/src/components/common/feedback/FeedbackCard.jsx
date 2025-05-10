import { Card, CardHeader, CardContent, Avatar, Box } from '@mui/material'
import CustomRating from './CustomRating'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import PropTypes from 'prop-types'
import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'

const FeedbackCard = ({ feedback }) => {
  const { name, lastName, comment, picture, rating } = feedback

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
    >
      <Card
        sx={{
          width: {
            xs: 330,
            sm: 350,
            md: 360,
            lg: 370
          },
         
          borderRadius: 3,
          bgcolor: 'var(--background-vidrio)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var( --color-primario-active)',
          zIndex: 67
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={picture}
              alt={`${name} ${lastName}`}
              sx={{ width: 48, height: 48 }}
            />
          }
          title={`${name} ${lastName}`}
          titleTypographyProps={{
            fontWeight: 'bold',
            fontSize: '1rem',
            color: 'var(--color-primario)'
          }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {inView && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CustomRating value={rating} size="large" />
              </motion.div>
            )}
            <ParagraphResponsive
              sx={{
                color: 'var(--texto-secundario)'
              }}
            >
              ({rating}/5)
            </ParagraphResponsive>
          </Box>

          <ParagraphResponsive
            sx={{
              color: 'var(--texto-primario)',
              fontFamily: '"Roboto Slab", serif',
             
            }}
          >
            {comment}
          </ParagraphResponsive>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FeedbackCard

FeedbackCard.propTypes = {
  feedback: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    picture: PropTypes.string,
    rating: PropTypes.number.isRequired
  }).isRequired
}

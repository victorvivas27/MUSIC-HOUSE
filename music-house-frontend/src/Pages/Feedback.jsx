import { useEffect, useState } from 'react'
import { getAllFeedback } from '@/api/feedback'

import { Box, Grid } from '@mui/material'
import FeedbackCard from '@/components/common/feedback/FeedbackCard'

import { useInView } from 'react-intersection-observer'
import { TitleResponsive } from '@/components/styles/ResponsiveComponents'

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([])

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await getAllFeedback()
      if (res?.result?.content) {
        setFeedbackList(res.result.content)
      }
    }
    fetchFeedback()
  }, [])

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 })

  return (
    <Box sx={{ mt: 35, px: 2 }}>
      <div ref={ref}>
        <TitleResponsive
          className={inView ? 'text-focus-in' : ''}
          sx={{
            mb: 20,
            fontSize: {
              xs: '1.7rem',
              sm: '2.6rem',
              md: '2.7rem',
              lg: '2.8rem',
              xl: '3rem'
            },
            visibility: inView ? 'visible' : 'hidden',
            opacity: inView ? 1 : 0
          }}
        >
          Opiniones de nuestros usuarios
        </TitleResponsive>
      </div>

      <Grid container spacing={2} justifyContent="space-evenly" marginTop={35}>
        {feedbackList.map((item) => (
          <Grid item key={item.idFeedback}>
            <FeedbackCard feedback={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Feedback

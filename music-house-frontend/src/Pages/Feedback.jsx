import { useEffect } from 'react'
import { getAllFeedback } from '@/api/feedback'
import { Box, Grid } from '@mui/material'
import FeedbackCard from '@/components/common/feedback/FeedbackCard'
import { useInView } from 'react-intersection-observer'
import { TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import { flexColumnContainer } from '@/components/styles/styleglobal'

const Feedback = () => {
  const { state, dispatch } = useAppStates()
  const feedbackList = state.feedback?.content || []

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!feedbackList.length) {
        const res = await getAllFeedback()
        if (res?.result?.content) {
          dispatch({ type: actions.SET_FEEDBACK, payload: res.result })
        }
      }
    }
    fetchFeedback()
  }, [dispatch, feedbackList.length])

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5
  })

  return (
    <Box
      sx={{
        ...flexColumnContainer,
        marginTop:110,
        width: { xs: 330, sm: 350, md: 1000, lg: 1000, xl: 1400 }
      }}
      id="feedback-section"
    >
      <div ref={ref}>
        <TitleResponsive
          className={inView ? 'text-focus-in' : ''}
          sx={{
            fontSize: {
              xs: '1.2rem',
              sm: '1.7rem',
              md: '1.8rem',
              lg: '1.9rem',
              xl: '2rem'
            },
            visibility: inView ? 'visible' : 'hidden',
            opacity: inView ? 1 : 0
          }}
        >
          💬 Opiniones de quienes confían en nosotros
        </TitleResponsive>
      </div>

      <Grid container spacing={2} justifyContent="space-evenly" marginTop={10}>
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

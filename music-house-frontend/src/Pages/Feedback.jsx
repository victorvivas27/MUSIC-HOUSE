import { useEffect} from 'react'
import { getAllFeedback } from '@/api/feedback'
import { Box, Grid } from '@mui/material'
import FeedbackCard from '@/components/common/feedback/FeedbackCard'
import { useInView } from 'react-intersection-observer'
import { TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'

const Feedback = () => {
  const { state, dispatch } = useAppStates()
  const feedbackList = state.feedbacks?.content || []

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!feedbackList.length) {
        const res = await getAllFeedback()
        if (res?.result?.content) {
          dispatch({ type: actions.SET_FEEDBACKS, payload: res.result })
        }
      }
    }
    fetchFeedback()
  }, [dispatch, feedbackList.length])

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.5 })

  return (
    <Box sx={{
       mt: 35,
        px: 2
         }} id="feedback-section">
      <div ref={ref}>
        <TitleResponsive
          className={inView ? 'text-focus-in' : ''}
          sx={{
          
            fontSize: {
              xs: '1.2rem',
              sm: '1.8rem',
              md: '2.2rem',
              lg: '2.4rem',
              xl: '2.6rem'
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

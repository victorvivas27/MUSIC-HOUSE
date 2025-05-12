import { getAllFaq } from '@/api/faq'
import FaqCard from '@/components/common/faq/FaqCard'
import { TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { flexColumnContainer} from '@/components/styles/styleglobal'

import { Box, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const Faq = () => {
  const [faqs, setFaqs] = useState([])
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5
  })

  useEffect(() => {
    const fetchFaq = async () => {
      const res = await getAllFaq(0, 3, 'registDate,desc')
      if (res?.result?.content) {
        const activeOnly = res.result.content.filter((faq) => faq.active)
        setFaqs(activeOnly)
      }
    }
    fetchFaq()
  }, [])

  return (
    <Box
      sx={{
       ...flexColumnContainer,
        mt: 60,
         width: { xs: 330, sm: 350, md: 1000, lg:1000,xl:1400 },
      }}
      id="faq-preview-home"
    >
      <div ref={ref}>
        <TitleResponsive
          className={inView ? 'text-focus-in' : ''}
          sx={{
           visibility: inView ? 'visible' : 'hidden',
            opacity: inView ? 1 : 0
          }}
        >
         ❓Preguntas Frecuentes
        </TitleResponsive>
      </div>

      <Grid container spacing={2} justifyContent="space-evenly" mt={10}>
        {faqs.map((item) => (
          <Grid item key={item.idFaq}>
            <FaqCard faq={item} showAnswer={false} />
          </Grid>
        ))}
      </Grid>

     
    </Box>
  )
}

export default Faq

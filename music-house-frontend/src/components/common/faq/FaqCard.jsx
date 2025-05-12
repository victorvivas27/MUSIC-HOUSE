import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card
} from '@mui/material'
import {
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const FaqCard = ({ faq, showAnswer = true }) => {
  const { question, answer } = faq
  const navigate = useNavigate()
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3
  })

  const handleClick = () => {
    if (!showAnswer) {
      navigate('/faqs', { state: { scrollToQuestion: question } })
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
      style={{ cursor: !showAnswer ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      {showAnswer ? (
        <Accordion
          sx={{
            width: { xs: 330, sm: 350, md: 450, lg: 500 },
            borderRadius: 2,
            bgcolor: 'var(--background-vidrio)',
            border: '1px solid var(--color-primario-active)',
            backdropFilter: 'blur(8px)',
            boxShadow: 3
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TitleResponsive
              sx={{
                fontSize: {
                  xs: '1rem',
                  sm: '1.1rem',
                  md: '1.2rem'
                },
                color: 'var(--color-primario)'
              }}
            >
              {question}
            </TitleResponsive>
          </AccordionSummary>
          <AccordionDetails>
            <ParagraphResponsive
              sx={{
                fontSize: {
                  xs: '0.95rem',
                  sm: '1rem',
                  md: '1.05rem'
                },
                color: 'var(--texto-primario)',
                fontFamily: '"Roboto Slab", serif',
                lineHeight: 1.6
              }}
            >
              {answer}
            </ParagraphResponsive>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Card
          sx={{
            width: { xs: 330, sm: 350, md: 360 },
            borderRadius: 3,
            bgcolor: 'var(--background-vidrio)',
            border: '1px solid var(--color-primario-active)',
            backdropFilter: 'blur(8px)',
            boxShadow: 3,
            p: 2
          }}
        >
          <TitleResponsive
            sx={{
              fontWeight: 'bold',
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.2rem'
              },
              color: 'var(--color-primario)'
            }}
          >
            {question}
          </TitleResponsive>
        </Card>
      )}
    </motion.div>
  )
}

FaqCard.propTypes = {
  faq: PropTypes.shape({
    idFaq: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
  }).isRequired,
  showAnswer: PropTypes.bool
}

export default FaqCard

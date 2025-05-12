import { getAllFaq } from '@/api/faq'
import FaqCard from '@/components/common/faq/FaqCard'

import { flexColumnContainer } from '@/components/styles/styleglobal'
import { Box, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
const Faqs = () => {
  const [faqs, setFaqs] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 3

  const fetchFaq = async (pageToLoad = 0) => {
    const res = await getAllFaq(pageToLoad, pageSize, 'registDate,desc')
    const content = res?.result?.content || []

    const activeFaqs = content.filter((faq) => faq.active)

    if (activeFaqs.length < pageSize) {
      setHasMore(false)
    }

    setFaqs((prev) => [...prev, ...activeFaqs])
  }

  useEffect(() => {
    fetchFaq()
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchFaq(nextPage)
  }

  return (
    <Box
      sx={{
        ...flexColumnContainer,
        mt: 40,
        width: { xs: 330, sm: 350, md: 1000, lg: 1000, xl: 1400 }
      }}
      id="faq-preview-home"
    >
      <Grid container spacing={2} justifyContent="center" mt={10}>
        {faqs.map((item) => (
          <Grid item key={item.idFaq}>
            <FaqCard faq={item} />
          </Grid>
        ))}
      </Grid>

      {hasMore && (
        <Box mt={4} textAlign="center">
          <Button onClick={handleLoadMore} variant="outlined" color="primary">
            Cargar más preguntas
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Faqs

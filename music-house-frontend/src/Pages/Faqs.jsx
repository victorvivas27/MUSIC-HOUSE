import { getAllFaq } from '@/api/faq'
import FaqCard from '@/components/common/faq/FaqCard'
import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'


import { Box, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
const Faqs = () => {
  const [faqs, setFaqs] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 2

  const fetchFaq = async (pageToLoad = 0) => {
    const res = await getAllFaq(pageToLoad, pageSize, 'registDate,desc')
    const content = res?.result?.content || []

    setFaqs((prev) => [...prev, ...content])

    if (res.result.last || content.length < pageSize) {
      setHasMore(false)
    }
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
        mt: { xs: 40, sm: 45, md: 50, lg:55, xl: 60 },
        width: {}
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
            <ParagraphResponsive>
              Cargar más preguntas
            </ParagraphResponsive>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Faqs

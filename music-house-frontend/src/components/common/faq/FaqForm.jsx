import { submitFaq } from '@/api/faq'
import { getErrorMessage } from '@/api/getErrorMessage'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { inputStyles } from '@/components/styles/styleglobal'
import useAlert from '@/hook/useAlert'
import { Box, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const FaqForm = () => {
  const { showSuccess, showError } = useAlert()

  const formik = useFormik({
    initialValues: {
      question: ''
    },
    validationSchema: Yup.object({
      question: Yup.string()
        .min(5, 'La pregunta debe tener un mínimo de 5 caracteres')
        .max(200, 'La pregunta debe tener un máximo de 200 caracteres')
        .required('La pregunta es obligatoria')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await submitFaq(values)
        if (response?.result) {
          showSuccess(`✅ ${response.message}`)
          resetForm()
        }
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      }
    }
  })

  return (
    <Box
      sx={{
        maxWidth: 450
      }}
    >
      <TitleResponsive gutterBottom>¿Tienes una pregunta?</TitleResponsive>
      <ParagraphResponsive variant="body2" gutterBottom>
        Envíala aquí y podríamos incluirla en nuestra sección de preguntas
        frecuentes.
      </ParagraphResponsive>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1}>
          <TextField
            name="question"
            fullWidth
            placeholder="Escribe tu duda..."
            value={formik.values.question}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={
              formik.touched.question && formik.errors.question
                ? formik.errors.question
                : ' '
            }
            sx={{
              ...inputStyles,
              '& .MuiInputBase-input': {
                color: 'var( --texto-inverso)',
                fontSize: '18px'
              }
            }}
          />
          <ContainerBottom>
            <CustomButton type="submit">Enviar</CustomButton>
          </ContainerBottom>
        </Stack>
      </form>
    </Box>
  )
}

export default FaqForm

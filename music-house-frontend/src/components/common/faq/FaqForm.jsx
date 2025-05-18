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
import { Box, FormControl, TextField, useTheme } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const FaqForm = () => {
  const { showSuccess, showError } = useAlert()
  const theme = useTheme()

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
        maxWidth: 550,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <TitleResponsive gutterBottom>¿Tienes una pregunta?</TitleResponsive>
      <ParagraphResponsive>
        Envíala aquí y podríamos incluirla en nuestra sección de preguntas
        frecuentes.
      </ParagraphResponsive>
      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={inputStyles(theme)}>
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
              '& .MuiInputBase-input': {
                color: 'var( --texto-inverso)',
                fontSize: '18px'
              },
              boxShadow: 'var(--box-shadow)'
            }}
          />
        </FormControl>
        <ContainerBottom>
          <CustomButton type="submit">Enviar</CustomButton>
        </ContainerBottom>
      </form>
    </Box>
  )
}

export default FaqForm

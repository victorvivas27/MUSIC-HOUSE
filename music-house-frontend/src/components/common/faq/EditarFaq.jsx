import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Paper,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getFaqById } from '@/api/faq'
import { updateFaq } from '@/api/faq'
import { getErrorMessage } from '@/api/getErrorMessage'
import useAlert from '@/hook/useAlert'
import { useHeaderVisibility } from '@/components/utils/context/HeaderVisibilityGlobal'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import { Loader } from '../loader/Loader'
import { CreateWrapper } from '@/components/styles/ResponsiveComponents'

const EditarFaq = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()
  const { isHeaderVisible } = useHeaderVisibility()
  const { dispatch } = useAppStates()

  const [initialData, setInitialData] = useState(null)
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    const fetchFaq = async () => {
      dispatch({ type: actions.SET_LOADING, payload: true })
      try {
        const res = await getFaqById(id)
        if (res?.result) {
          setInitialData(res.result)
        } else {
          showError('Pregunta no encontrada')
          navigate('/faq')
        }
      } catch (err) {
        showError(`❌ ${err.message}`)
        navigate('/faq')
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    }
    fetchFaq()
  }, [id, dispatch, showError, navigate])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      idFaq: initialData?.idFaq || '',
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      active: initialData?.active || false
    },
    validationSchema: Yup.object({
      answer: Yup.string()
        .min(10, 'La respuesta debe tener al menos 10 caracteres')
        .required('La respuesta es obligatoria')
    }),
    onSubmit: async (formData) => {
      if (!formData) return
      isSubmittingRef.current = true
      dispatch({ type: actions.SET_LOADING, payload: true })

      try {
        const response = await updateFaq(formData)
        showSuccess(`✅ ${response.message}`)

        setTimeout(() => {
          navigate('/faq')
        }, 1100)
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
        isSubmittingRef.current = false
      }
    }
  })

  if (!initialData && !isSubmittingRef.current) {
    return <Loader title="Un momento por favor..." />
  }

  return (
    <CreateWrapper isHeaderVisible={isHeaderVisible}>
      <Paper sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Pregunta"
            name="question"
            value={formik.values.question}
            InputProps={{ readOnly: true }}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="Respuesta"
            name="answer"
            value={formik.values.answer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.answer && Boolean(formik.errors.answer)}
            helperText={formik.touched.answer && formik.errors.answer}
            multiline
            rows={4}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formik.values.active}
                onChange={(e) =>
                  formik.setFieldValue('active', e.target.checked)
                }
                name="active"
                color="primary"
              />
            }
            label={formik.values.active ? 'Activa' : 'Inactiva'}
            sx={{ mt: 2 }}
          />

          <Box textAlign="right" mt={3}>
            <Button type="submit" variant="contained" color="primary">
              Guardar cambios
            </Button>
          </Box>
        </form>

        {/* Warning para móviles */}
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ paddingTop: 30, fontWeight: 'bold' }}
          >
            Funcionalidad no disponible en esta resolución
          </Typography>
        </Box>
      </Paper>
    </CreateWrapper>
  )
}

export default EditarFaq

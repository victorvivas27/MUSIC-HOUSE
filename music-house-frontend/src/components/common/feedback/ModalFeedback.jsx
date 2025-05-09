import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { submitFeedback } from '@/api/feedback'
import { useState } from 'react'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
const ModalFeedback = ({ open, onClose }) => {
  const [submitting, setSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, 'Debe dar al menos 1 estrella')
        .max(5, 'Máximo 5 estrellas')
        .required('La calificación es obligatoria'),
      comment: Yup.string()
        .min(10, 'El comentario debe tener al menos 10 caracteres')
        .max(500, 'Máximo 500 caracteres')
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true)
        await submitFeedback(values)
        toast.success('¡Gracias por tu opinión!')
        onClose()
      } catch (err) {
        toast.error('Hubo un error al enviar tu feedback')
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleStarClick = () => {
    const current = formik.values.rating
    const next = current < 5 ? current + 1 : 1
    formik.setFieldValue('rating', next)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionProps={{ timeout: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background:
            'linear-gradient(145deg,rgba(255, 255, 255, 0.98),rgb(245, 245, 245))',

          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          fontWeight: 'bold',
          py: 2,
          textAlign: 'center'
        }}
      >
        Dejanos tu opinión
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              mb: 2,
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            Califica tu experiencia
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
              gap: 1
            }}
          >
            {[1, 2, 3, 4, 5].map((i) =>
              i <= formik.values.rating ? (
                <StarIcon
                  key={i}
                  sx={{
                    color: '#FFD700',
                    fontSize: 42,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.2)'
                    }
                  }}
                  onClick={handleStarClick}
                />
              ) : (
                <StarBorderIcon
                  key={i}
                  sx={{
                    color: '#E0E0E0',
                    fontSize: 42,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: '#FFD700'
                    }
                  }}
                  onClick={handleStarClick}
                />
              )
            )}
          </Box>

          {formik.touched.rating && formik.errors.rating && (
            <Typography
              sx={{
                color: 'error.main',
                fontSize: '0.8rem',
                textAlign: 'center',
                mt: -1,
                mb: 1
              }}
            >
              {formik.errors.rating}
            </Typography>
          )}

          <TextField
            name="comment"
            label="Tu comentario"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#E0E0E0'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                }
              }
            }}
            InputProps={{
              style: {
                fontSize: '0.95rem'
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            textTransform: 'none',
            px: 3,
            borderRadius: '8px',
            color: 'text.secondary',
            border: ' 2px solid red'
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={formik.handleSubmit}
          disabled={submitting || !formik.isValid}
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            px: 3,
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          {submitting ? 'Enviando...' : 'Enviar feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ModalFeedback.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ModalFeedback

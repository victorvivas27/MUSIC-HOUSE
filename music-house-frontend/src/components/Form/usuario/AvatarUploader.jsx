import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'
import { flexColumnContainer } from '@/components/styles/styleglobal'
import { Avatar, Box, Typography } from '@mui/material'
import { ErrorMessage } from 'formik'
import PropTypes from 'prop-types'

export const AvatarUploader = ({ preview, setPreview, setFieldValue }) => {
  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setFieldValue('picture', file)
    }
  }

  return (
    <Box
      sx={{
        ...flexColumnContainer,
        gap: 1,
        padding: 2
      }}
    >
      <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
        <Avatar
          src={preview}
          sx={{
            width: {
              xs: 50,
              sm: 60,
              md: 70,
              lg: 75,
              xl: 80
            },
            height: {
              xs: 50,
              sm: 60,
              md: 70,
              lg: 75,
              xl: 80
            },
            border: '2px solid #1976d2',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          {!preview && <ParagraphResponsive>Avatar</ParagraphResponsive>}
        </Avatar>
      </label>

      <input
        id="avatar-upload"
        name="picture"
        type="file"
        hidden
        onChange={handleFileChange}
      />

      <ParagraphResponsive
        variant="body2"
        color="var(--texto-inverso)"
        sx={{ textAlign: 'center' }}
      >
        Haz clic en la imagen para subir una nueva (máx 5MB)
      </ParagraphResponsive>

      <ErrorMessage name="picture">
        {(msg) => (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {msg}
          </Typography>
        )}
      </ErrorMessage>
    </Box>
  )
}

AvatarUploader.propTypes = {
  preview: PropTypes.string,
  setPreview: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
}

import { getErrorMessage } from '@/api/getErrorMessage'
import { UsersApi } from '@/api/users'
import {
  ContainerBottom,
  CustomButton,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { inputStyles } from '@/components/styles/styleglobal'
import useAlert from '@/hook/useAlert'
import { useAuth } from '@/hook/useAuth'
import { Box, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VerifyForm = ({ initialEmail = '', onSuccess }) => {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const { showError, showSuccess } = useAlert()
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
setLoading(true)

    try {
      const response = await UsersApi.userAuthVerify(email, code)
      showSuccess(`✅ ${response.message}`)

      setTimeout(async () => {
        await fetchUser()
        if (onSuccess) {
          onSuccess() // usado si se muestra como modal
        } else {
          navigate('/') // fallback si se accede desde ruta directa
        }
      }, 800)
    } catch (err) {
      showError(`❌ ${getErrorMessage(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
         width: {
      xs: '90%',
      sm: '80%',
      md: '70%',
      lg: '60%',
      xl: '500px'
    },
        mt: 50,
        backgroundImage: 'var(--gradiente-dorado)',
        borderRadius: '12px',
        marginBottom: '20px',
        padding: '24px',
        marginInline: 'auto'
      }}
    >
      <TitleResponsive variant="h5" gutterBottom>
        Verificar cuenta
      </TitleResponsive>
      <TextField
        fullWidth
        label="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ ...inputStyles }}
      />
      <TextField
        fullWidth
        label="Código de verificación"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        sx={{ ...inputStyles }}
      />
      <ContainerBottom>
        <CustomButton type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar'}
        </CustomButton>
      </ContainerBottom>
    </Box>
  )
}

VerifyForm.propTypes = {
  initialEmail: PropTypes.string,
  onSuccess: PropTypes.func
}

export default VerifyForm

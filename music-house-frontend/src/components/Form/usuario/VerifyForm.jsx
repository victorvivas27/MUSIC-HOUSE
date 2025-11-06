import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, CircularProgress } from '@mui/material'

import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'

import {
  ContainerBottom,
  CustomButton,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { inputStyles } from '@/components/styles/styleglobal'

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
        onSuccess ? onSuccess() : navigate('/')
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
        mb: 5,
        mx: 'auto',
        p: 4,
        borderRadius: 2,
        border: '2px solid var(--color-primario)',
        backgroundColor: 'var(--color-select)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
        }
      }}
    >
      <TitleResponsive
        variant="h5"
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: '600' }}
      >
        Verificar cuenta
      </TitleResponsive>

      <TextField
        fullWidth
        label="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ ...inputStyles, mb: 3 }}
      />

      <TextField
        fullWidth
        label="Código de verificación"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        sx={{ ...inputStyles, mb: 4 }}
      />

      <ContainerBottom>
        <CustomButton
          type="submit"
          disabled={loading || !email || !code}
          sx={{ width: '100%' }}
        >
          {loading ? (
            <>
              <CircularProgress size={22} sx={{ color: '#fff', mr: 1 }} />
              Verificando...
            </>
          ) : (
            'Verificar'
          )}
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
import {
  FormControl,
  Grid,
  InputAdornment,
  IconButton,
  TextField,
  useTheme
} from '@mui/material'
import Link from '@mui/material/Link'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { useAuth } from '@/hook/useAuth'
import { UsersApi } from '@/api/users'
import {
  ContainerBottom,
  ContainerForm,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { inputStyles } from '@/components/styles/styleglobal'
import { loginValidationSchema } from '@/validations/login'
import useAlert from '@/hook/useAlert'
import { getErrorMessage } from '@/api/getErrorMessage'
import { useAppStates } from '@/components/utils/global.context'
import LoaderOverlay from '@/components/common/loader/LoaderOverlay'
import OAuthLoginButton from '@/components/common/googleLoginButton/OAuthLoginButton'

const Login = ({ onSwitch }) => {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const { state } = useAppStates()
  const [showPassword, setShowPassword] = useState(false)
  const { showSuccess, showError } = useAlert()
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true)

      try {
        const response = await UsersApi.loginUser(values)

        if (response?.statusCode === 200) {
          await fetchUser()
          showSuccess(`✅ ${response.message}`)

          setTimeout(() => {
            navigate('/')
          }, 1300)
        } else {
          showError(`❌ ${response.message}`)
        }
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <fieldset
          disabled={loading}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <ContainerForm>
            <Grid>
              <TitleResponsive sx={{ color: 'var(--color-secundario)' }}>Iniciar Sesión</TitleResponsive>
              <Grid>
                <FormControl fullWidth margin="normal" sx={inputStyles(theme)}>
                  <TextField
                    sx={{ width: { xs: '90%' }, marginLeft: 2 }}
                    label="📧 Email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                      (formik.touched.email && formik.errors.email) || ' '
                    }
                  />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={inputStyles(theme)}>
                  <TextField
                    sx={{ width: { xs: '90%' }, marginLeft: 2 }}
                    label="🔒 Password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={showPassword ? 'text' : 'password'}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      (formik.touched.password && formik.errors.password) || ' '
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff
                                sx={{
                                  color: 'var(--color-exito)'
                                }}
                              />
                            ) : (
                              <Visibility
                                sx={{
                                  color: 'var(--color-secundario)'
                                }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Grid>

              <ContainerBottom>
                <CustomButton type="submit" disabled={state.loading}>
                  Iniciar Sesión
                </CustomButton>

                <OAuthLoginButton provider="google" />
                <OAuthLoginButton provider="github" />

                <Link
                  href=""
                  underline="none"
                  onClick={onSwitch}
                  sx={{
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <ParagraphResponsive
                    sx={{
                      fontWeight: '700',
                      color: 'var(--texto-primario)',
                      position: 'relative',
                      zIndex: 2,
                      background:
                        'linear-gradient(45deg, #8B5A2B 0%, #D2B48C 50%, #A67C52 100%)',
                      borderRadius: '20px',
                      padding: '12px 24px',
                      marginTop: 4,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',

                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(45deg, #A67C52 0%, #D2B48C 50%, #8B5A2B 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: -1
                      },
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                        '&:before': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    No tienes una cuenta? <strong>Regístrate</strong>
                  </ParagraphResponsive>
                </Link>
              </ContainerBottom>
            </Grid>
          </ContainerForm>
        </fieldset>
      </form>
      {loading && <LoaderOverlay texto={'Iniciando sesión...'} />}
    </>
  )
}

Login.propTypes = {
  onSwitch: PropTypes.func.isRequired
}

export default Login

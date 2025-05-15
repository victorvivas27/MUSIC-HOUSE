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
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded'
import { useAuth } from '@/hook/useAuth'
import { UsersApi } from '@/api/users'
import {
  ContainerBottom,
  ContainerForm,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import {  inputStyles } from '@/components/styles/styleglobal'
import { loginValidationSchema } from '@/validations/login'
import useAlert from '@/hook/useAlert'
import { getErrorMessage } from '@/api/getErrorMessage'
import { useAppStates } from '@/components/utils/global.context'
import LoaderOverlay from '@/components/common/loader/LoaderOverlay'
import GoogleLoginButton from '@/components/common/googleLoginButton/GoogleLoginButton'


const Login = ({ onSwitch }) => {
  const navigate = useNavigate()
  const { fetchUser} = useAuth()
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
            <TitleResponsive>Iniciar Sesión</TitleResponsive>
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
                                color: 'var(--color-exito)',
                               
                              }}
                            />
                          ) : (
                            <Visibility
                              sx={{
                                color: 'var(--color-secundario)',
                               
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

              <GoogleLoginButton />
              <Link href="" underline="always" onClick={onSwitch}>
                <ParagraphResponsive
                  sx={{ fontWeight: '600', color: 'var(--color-azul)' }}
                >
                  No tienes una cuenta? Regístrate
                  <ContactSupportRoundedIcon />
                </ParagraphResponsive>
              </Link>
            </ContainerBottom>
          </Grid> 
        </ContainerForm>
      </fieldset>
    </form>
    {loading && <LoaderOverlay texto={"Iniciando sesión..."} />}
    </>
  )
}

Login.propTypes = {
  onSwitch: PropTypes.func.isRequired
}

export default Login

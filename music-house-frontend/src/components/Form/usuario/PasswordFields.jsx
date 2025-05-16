import { inputStyles } from '@/components/styles/styleglobal'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useTheme
} from '@mui/material'
import { Field } from 'formik'
import PropTypes from 'prop-types'
import { useState } from 'react'

export const PasswordFields = ({ values, touched, errors, setFieldValue }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)
   const theme = useTheme()

  return (
    <Grid container justifyContent="center" spacing={1}  >
      {/* Campo de contraseña */}
      <Grid  item xs={6} sm={5} md={5} lg={4}>
        <FormControl sx={inputStyles(theme)}>
          <Field
            as={TextField}
            name="password"
            label="🔒 Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(e) => setFieldValue('password', e.target.value)}
            error={touched.password && Boolean(errors.password)}
            helperText={
              touched.password && errors.password
                ? errors.password
                : ' '
            }

 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        sx={{
                          color: 'var(--color-exito)',
                        zIndex:23344
                        }}
                      />
                    ) : (
                      <Visibility
                        sx={{
                          color: 'var(--color-secundario)',
                            zIndex:23344
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

      <Grid  item xs={6} sm={5} md={5} lg={4}>
        <FormControl sx={inputStyles(theme)}>
          <Field
            as={TextField}
            name="repeatPassword"
            label="🔓 Repetir Contraseña"
            type={showPasswordRepeat ? 'text' : 'password'}
            value={values.repeatPassword}
            onChange={(e) => setFieldValue('repeatPassword', e.target.value)}
            error={touched.repeatPassword && Boolean(errors.repeatPassword)}
            helperText={
              touched.repeatPassword && errors.repeatPassword
                ? errors.repeatPassword
                : ' '
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                    edge="end"
                  >
                    {showPasswordRepeat ? (
                      <VisibilityOff
                        sx={{
                          color: 'var(--color-exito)',
                          zIndex:23344
                        }}
                      />
                    ) : (
                      <Visibility
                        sx={{
                          color: 'var(--color-secundario)',
                          zIndex:23344
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
    </Grid>
  )
}
PasswordFields.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired
}

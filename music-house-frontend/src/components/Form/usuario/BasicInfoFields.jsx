import { inputStyles } from '@/components/styles/styleglobal'
import { FormControl, Grid, TextField, useTheme } from '@mui/material'
import { Field } from 'formik'
import PropTypes from 'prop-types'

export const BasicInfoFields = ({ values, touched, errors }) => {
  const theme = useTheme()
  return (
    <Grid container  justifyContent="center" spacing={2}   >
      <Grid  item xs={6} sm={5} md={5} lg={4} >
        <FormControl sx={inputStyles(theme)}>
          <Field
            as={TextField}
            label="🏷️Nombre"
            name="name"
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name ? errors.name : ' '}
          />
        </FormControl>
      </Grid>
      <Grid  item xs={6} sm={5} md={5} lg={4}>
        <FormControl sx={inputStyles(theme)}>
          <Field
            as={TextField}
            label="👤Apellido"
            name="lastName"
            value={values.lastName}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={
              touched.lastName && errors.lastName ? errors.lastName : ' '
            }
          />
        </FormControl>
      </Grid>

      <Grid  item xs={6} sm={6} md={5} lg={5} >
        <FormControl sx={inputStyles(theme)}>
          <Field
            as={TextField}
            label="📧 Email"
            name="email"
            type="email"
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email ? errors.email : ' '}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

BasicInfoFields.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

import { useEffect, useState } from 'react'
import {
  Typography,
  FormControlLabel,
  Checkbox,
  styled,
  Grid,
  Box
} from '@mui/material'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'

import { ErrorMessage, Formik } from 'formik'
import { userValidationSchema } from '@/validations/userValidationSchema'
import { AddressFields } from './AddressFields'
import { PhoneFields } from './PhoneFields'
import { AvatarUploader } from './AvatarUploader'
import { PasswordFields } from './PasswordFields'
import { UserRolesSection } from './UserRolesSection'
import { BasicInfoFields } from './BasicInfoFields'
//import { TelegramField } from './TelegramField'
import LoaderOverlay from '@/components/common/loader/LoaderOverlay'
import { flexRowContainer } from '@/components/styles/styleglobal'
import OAuthLoginButton from '@/components/common/googleLoginButton/OAuthLoginButton'

const CustomCheckbox = styled(Checkbox)(() => ({
  color: 'blue',
  '&.Mui-checked': {
    color: 'red'
  },
  '& .MuiSvgIcon-root': {
    fontSize: {
      xs: '10px',
      sm: '13px',
      md: '14px',
      lg: '15px'
    }
  }
}))

export const UserForm = ({
  onSwitch,
  initialFormData,
  onSubmit,
  loading,
  isSubmitting,
  user
}) => {
  const [preview, setPreview] = useState(null)
  const { isUserAdmin } = useAuth()
  const { showError } = useAlert()
  const idUser = user?.data?.idUser || null
  const isLoggedUser = idUser && idUser === Number(initialFormData?.idUser)
  const isNewUser = !initialFormData.idUser

  const showPasswordFields =
    (!isUserAdmin && isNewUser) || (isUserAdmin && isNewUser)

  const title = isLoggedUser
    ? 'Mi perfil'
    : initialFormData.idUser
      ? 'Editar cuenta usuario'
      : 'Crear cuenta'

  const combinedLoading = loading || isSubmitting
  const buttonText =
    initialFormData.idUser || isUserAdmin ? 'Guardar' : 'Registrar'
  const buttonTextLoading =
    initialFormData.idUser || isUserAdmin ? 'Guardando' : 'Registrando'

  useEffect(() => {
    // Solo setear preview si viene de backend como string
    if (typeof initialFormData.picture === 'string') {
      setPreview((prev) => prev ?? initialFormData.picture)
    }
  }, [initialFormData.picture, preview])

  const formikInitialValues = {
    ...initialFormData,
    idUser: initialFormData.idUser || null,
    accept: !!initialFormData.idUser || isUserAdmin,
    roles: initialFormData.roles || [],
    addresses: initialFormData.addresses || [
      { street: '', number: '', city: '', state: '', country: '' }
    ],
    phones: initialFormData.phones || [{ countryCode: '', phoneNumber: '' }]
  }

  return (
    <Box
      sx={{
        marginBottom: 10,
        backgroundColor: isUserAdmin ? 'var( --background-vidrio-soft)' : 'none',
        borderRadius: '16px'
      }}
    >
      <Formik
        initialValues={formikInitialValues}
        validationSchema={userValidationSchema}
        validateOnChange
        validateOnBlur
        onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        context={{ isUserAdmin }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              ...flexRowContainer,
              width: '95vw',
              maxWidth: '900px'
            }}
          >
            <fieldset
              disabled={loading}
              style={{ border: 'none', padding: 0, margin: 0 }}
            >
              <TitleResponsive sx={{ mb: 4 }}>{title}</TitleResponsive>

              <Grid container>
                <Grid item xs={12}>
                  <AvatarUploader
                    preview={preview}
                    setPreview={setPreview}
                    setFieldValue={setFieldValue}
                    showError={showError}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/*<TitleResponsive>Información Personal</TitleResponsive>*/}
                  <BasicInfoFields
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/*<TitleResponsive>Dirección</TitleResponsive>*/}
                  <AddressFields
                    addresses={values.addresses}
                    touched={touched.addresses}
                    errors={errors.addresses}
                    setFieldValue={setFieldValue}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/*<TitleResponsive>Teléfono</TitleResponsive>*/}
                  <PhoneFields
                    phones={values.phones}
                    touched={touched.phones}
                    errors={errors.phones}
                    setFieldValue={setFieldValue}
                  />
                </Grid>

                {initialFormData?.idUser && (
                  <Grid item xs={12}>
                    {/*<TitleResponsive>Roles del Usuario</TitleResponsive>*/}
                    <UserRolesSection
                      roles={values.roles}
                      isUserAdmin={isUserAdmin}
                      setFieldValue={setFieldValue}
                      showError={showError}
                    />
                  </Grid>
                )}

                {showPasswordFields && (
                  <Grid item xs={12}>
                    {/*<TitleResponsive>Contraseña</TitleResponsive>*/}
                    <PasswordFields
                      values={values}
                      touched={touched}
                      errors={errors}
                      setFieldValue={setFieldValue}
                    />
                  </Grid>
                )}

                {/* <Grid item xs={12}>
                  <TitleResponsive>Telegram</TitleResponsive>
                  <TelegramField
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </Grid>*/}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={values.accept}
                        onChange={(e) =>
                          setFieldValue('accept', e.target.checked)
                        }
                      />
                    }
                    label={
                      <ParagraphResponsive>
                        Acepto los términos y condiciones del servicio
                      </ParagraphResponsive>
                    }
                  />
                  <ErrorMessage name="accept">
                    {(msg) => (
                      <Typography
                        sx={{
                          margin: '5px',
                          color: 'var(--color-error)',
                          textAlign: 'center',
                          fontSize: '0.5rem'
                        }}
                      >
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>
                </Grid>

                <Grid item xs={12}>
                  <ContainerBottom>
                    <CustomButton type="submit" disabled={loading}>
                      {buttonText}
                    </CustomButton>
                    {combinedLoading && (
                      <LoaderOverlay
                        texto={buttonTextLoading}
                        containerProps={{
                          justifyContent: 'end'
                        }}
                        fontSize="1.5rem"
                        circularProgressProps={{
                          thickness: 2
                        }}
                      />
                    )}

                    <OAuthLoginButton provider="google" />
                    <OAuthLoginButton provider="github" />

                    {!initialFormData.idUser && !isUserAdmin && (
                      <Link
                        onClick={onSwitch}
                        underline="none"
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
                            color: 'white',
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
                          <strong>Ya tengo una cuenta </strong>
                        </ParagraphResponsive>
                      </Link>
                    )}
                  </ContainerBottom>
                </Grid>
              </Grid>
            </fieldset>
          </Box>
        )}
      </Formik>
    </Box>
  )
}

UserForm.propTypes = {
  onSwitch: PropTypes.func,
  initialFormData: PropTypes.object,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  user: PropTypes.object
}

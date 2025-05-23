import { createReservation } from '@/api/reservations'
import useAlert from '@/hook/useAlert'
import { Box, FormControl, Grid, TextField, useTheme } from '@mui/material'

import {  useNavigate } from 'react-router-dom'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import {  Field, Form, Formik } from 'formik'
import { PaymentValidationSchema } from '@/validations/PaymentValidationSchema'
import LoaderOverlay from '@/components/common/loader/LoaderOverlay'
import { inputStyles } from '@/components/styles/styleglobal'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const FormularioPagoReserva = () => {
  const navigate = useNavigate()
  const { showError, showSuccess } = useAlert()
  const [reservationData, setReservationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  // Cargar datos de localStorage al montar el componente
  useEffect(() => {
    const savedReservation = localStorage.getItem('currentReservation')
    if (savedReservation) {
      setReservationData(JSON.parse(savedReservation))
    } else {
      navigate(-1) // Redirigir si no hay datos
    }
    setLoading(false)
  }, [navigate])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleCancelReservation = () => {
    localStorage.removeItem('currentReservation')
    navigate(-1)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createReservation({
        idUser: reservationData.idUser,
        idInstrument: reservationData.idInstrument,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        paymentDtoEntrance: {
          ...values,
          amount: reservationData.totalPrice,
          paymentType: 'Tarjeta de crédito',
          currency: 'CLP'
        }
      })
      
      // Limpiar localStorage después de reserva exitosa
      localStorage.removeItem('currentReservation')
      
      showSuccess('🎉 Pago exitoso y reserva confirmada.')
      navigate('/')
    } catch (err) {
      showError(`❌ Error al crear la reserva: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <LoaderOverlay 
        texto="Cargando datos de reserva..."
        containerProps={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}
      />
    )
  }

  if (!reservationData) {
    return null // Redirige automáticamente por el useEffect
  }

  return (
    <Box
      sx={{
        borderRadius: 5,
        margin: 'auto',
        mt: { xs: 37, sm: 38, md: 39, lg: 41, xl:45 },
        background: 'var(--background-claro)',
        px: 2,
        position: 'relative',
        width: {
          xs: "93%",
          sm: "80%", 
          md: "70%", 
          lg: "60%", 
          xl: "55%" 
        },
        py: 4
      }}
    >
      {/* Botones de navegación */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <CustomButton 
          onClick={handleGoBack}
          sx={{ 
            backgroundColor: 'var(--color-primario)',
            '&:hover': { backgroundColor: 'var(--color-primario-hover)' }
          }}
        >
          ← Volver al calendario
        </CustomButton>
        
       
      </Box>

      {/* Resumen de la reserva */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'var(--color-exito)', 
        borderRadius: 2,
        boxShadow: 1
      }}>
        <TitleResponsive sx={{ mb: 2 }}>📋 Resumen de Reserva</TitleResponsive>
        <ParagraphResponsive>
          <strong>Instrumento:</strong> {reservationData.instrumentName}
        </ParagraphResponsive>
        <ParagraphResponsive>
          <strong>Desde:</strong> {dayjs(reservationData.startDate).format('dddd, D [de] MMMM [de] YYYY')}
        </ParagraphResponsive>
        <ParagraphResponsive>
          <strong>Hasta:</strong> {dayjs(reservationData.endDate).format('dddd, D [de] MMMM [de] YYYY')}
        </ParagraphResponsive>
        <ParagraphResponsive>
          <strong>Días totales:</strong> {dayjs(reservationData.endDate).diff(dayjs(reservationData.startDate), 'day') + 1}
        </ParagraphResponsive>
        <ParagraphResponsive>
          <strong>Precio por día:</strong> ${reservationData.rentalPrice.toLocaleString('es-CL')}
        </ParagraphResponsive>
        <ParagraphResponsive sx={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          mt: 1
        }}>
          <strong>Total a pagar:</strong> ${reservationData.totalPrice.toLocaleString('es-CL')}
        </ParagraphResponsive>
      </Box>

      <TitleResponsive sx={{ mb: 3 }}>💳 Ingresá los datos de tu tarjeta</TitleResponsive>

      {/* Formulario de pago */}
      <Formik
        initialValues={{
          cardNumber: '',
          cardHolderName: '',
          expirationDate: '',
          cvv: '',
          email: '',
          documentNumber: ''
        }}
        validationSchema={PaymentValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, isSubmitting, setFieldValue }) => (
          <Form>
            <Box sx={{ 
              my: 3, 
              display: 'flex', 
              justifyContent: 'center',
              transform: 'scale(0.9)'
            }}>
              <Cards
                number={values.cardNumber}
                name={values.cardHolderName}
                expiry={values.expirationDate.replace('/', '')}
                cvc={values.cvv}
                focused=""
              />
            </Box>

            <Grid container spacing={2}>
              {[
                {
                  name: 'cardNumber',
                  label: 'Número de tarjeta',
                  placeholder: '4242 4242 4242 4242'
                },
                {
                  name: 'cardHolderName',
                  label: 'Nombre del titular',
                  placeholder: 'Juan Pérez'
                },
                {
                  name: 'expirationDate',
                  label: 'Vencimiento (MM/AA)',
                  placeholder: '12/30'
                },
                { 
                  name: 'cvv', 
                  label: 'CVV', 
                  placeholder: '123',
                  type: 'password'
                },
                {
                  name: 'email',
                  label: 'Correo electrónico',
                  placeholder: 'correo@ejemplo.com',
                  type: 'email'
                },
                {
                  name: 'documentNumber',
                  label: 'RUT / Documento',
                  placeholder: '12345678-9'
                }
              ].map(({ name, label, placeholder, type = 'text' }) => (
                <Grid
                  item
                  xs={name === 'expirationDate' || name === 'cvv' ? 6 : 12}
                  key={name}
                >
                  <FormControl sx={inputStyles(theme)} fullWidth>
                    <Field
                      as={TextField}
                      name={name}
                      label={label}
                      type={type}
                      fullWidth
                      placeholder={placeholder}
                      value={values[name]}
                      error={touched[name] && Boolean(errors[name])}
                      helperText={
                        touched[name] && errors[name] ? errors[name] : ' '
                      }
                      onChange={(e) => {
                        const { value } = e.target
                        let formatted = value
                        
                        if (name === 'cardNumber') {
                          formatted = value
                            .replace(/\D/g, '')
                            .replace(/(\d{4})/g, '$1 ')
                            .trim()
                        } else if (name === 'expirationDate') {
                          formatted = value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '$1/$2')
                            .substring(0, 5)
                        } else if (name === 'documentNumber') {
                          formatted = value
                            .replace(/\D/g, '')
                            .replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, '$1.$2.$3-$4')
                        }
                        
                        setFieldValue(name, formatted)
                      }}
                    />
                  </FormControl>
                </Grid>
              ))}

              <ContainerBottom sx={{ mt: 3 }}>
                <CustomButton 
                  type="submit" 
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    maxWidth: '400px',
                    fontSize: '1.1rem',
                    py: 1.5
                  }}
                >
                  {isSubmitting ? 'Procesando...' : `Confirmar y pagar $${reservationData.totalPrice.toLocaleString('es-CL')}`}
                </CustomButton>
              </ContainerBottom>
              
            </Grid>
            

            {isSubmitting && (
              <LoaderOverlay
                texto="Procesando pago"
                containerProps={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              />
            )}
          </Form>
        )}
      </Formik>
       {/* Botones de navegación */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <CustomButton 
          onClick={handleGoBack}
          sx={{ 
            backgroundColor: 'var(--color-primario)',
            '&:hover': { backgroundColor: 'var(--color-primario-hover)' }
          }}
        >
          ← Volver al calendario
        </CustomButton>
        
        <CustomButton 
          onClick={handleCancelReservation}
          sx={{ 
            backgroundColor: 'var(--color-error)',
            '&:hover': { backgroundColor: 'var(--color-error-hover)' }
          }}
        >
          Cancelar Reserva
        </CustomButton>
      </Box>
    </Box>
  )
}

export default FormularioPagoReserva
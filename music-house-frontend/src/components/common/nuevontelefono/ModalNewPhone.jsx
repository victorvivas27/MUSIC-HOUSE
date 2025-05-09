import { getErrorMessage } from '@/api/getErrorMessage'
import { addPhone } from '@/api/phones'
import { ContainerBottom, CustomButton } from '@/components/styles/ResponsiveComponents'
import { countryCodes } from '@/components/utils/codepaises/CountryCodes'
import useAlert from '@/hook/useAlert'
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import LoaderOverlay from '../loader/LoaderOverlay'



const ModalNewPhone = ({
  open,
  handleCloseModalPhone,
  idUser,
  refreshPhoneData
}) => {
  const [formData, setFormData] = useState({
    countryCode: '',
    phoneNumber: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showSuccess } = useAlert()
  const isMobile = useMediaQuery('(max-width:600px)')

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 500,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: isMobile ? 3 : 4
  }

  useEffect(() => {
    if (!open) {
      setFormData({ countryCode: '', phoneNumber: '' })
      setError(null)
    }
  }, [open])

  const handleCountryCodeChange = (event) => {
    setFormData({
      countryCode: event.target.value,
      phoneNumber: ''
    })
    setError(null)
  }

  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/\D/g, '') 

    if (!formData.countryCode) {
      setError('Debe seleccionar un código de país antes de escribir.')
      return
    }

    setError(null)
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value
    }))
  }

  const validatePhoneNumber = () => {
    const minLength = 7
    const maxLength = 15

    if (!formData.phoneNumber || formData.phoneNumber.length < minLength) {
      setError(`⚠️ Mínimo ${minLength} dígitos`)
      return false
    }
    if (formData.phoneNumber.length > maxLength) {
      setError(`⚠️ Máximo ${maxLength} dígitos`)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.countryCode) {
      setError('Debe seleccionar un código de país.')
      setLoading(false)
      return
    }

    if (!validatePhoneNumber()) {
      setLoading(false)
      return
    }

    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`

      await addPhone({ idUser, phoneNumber: fullPhoneNumber })

      setTimeout(() => {
        setLoading(false)
        handleCloseModalPhone()

        showSuccess(
          'Teléfono agregado',
          'El teléfono ha sido agregado con éxito.'
        )

        setFormData({ countryCode: '', phoneNumber: '' })
      }, 1500)
      await refreshPhoneData()
    } catch (error) {
      setError(`❌ ${getErrorMessage(error)}`)
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModalPhone}
      aria-labelledby="modal-title"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
        >
          Agregar un Nuevo Teléfono
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* 📌 Select para código de país */}
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              value={formData.countryCode}
              onChange={handleCountryCodeChange}
              sx={{
                backgroundColor: '#D7D7D7D7',
                color: 'var(--color-secundario)',
                borderRadius: '5px',
                '&:hover': {
                  backgroundColor: '#D7D7D7D7'
                }
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un código de país
              </MenuItem>
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.country} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 📌 Input para número de teléfono con código visible */}

          <TextField
            fullWidth
            label="Número de Teléfono"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            margin="normal"
            required
            multiline
            disabled={!formData.countryCode}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {formData.countryCode || '📞'}
                </InputAdornment>
              )
            }}
          />

          {/* 📌 Mensaje de error con espacio fijo debajo del input */}
          <Typography
            color="error"
            sx={{ minHeight: '20px', display: 'block' }}
          >
            {error || ' '}
          </Typography>

          <ContainerBottom>
            <CustomButton type="submit"disabled={loading} >
              Agregar
              </CustomButton>

            <Typography
              onClick={handleCloseModalPhone}
              sx={{
                cursor: 'pointer', 
                fontWeight: '600',
                color: 'var(--color-azul)',
                marginTop: { xs: '40px', md: '20px' },
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 0.8
                }
              }}
            >
              Cancelar
            </Typography>
          </ContainerBottom>
        </form>
          {loading && (
                  <LoaderOverlay
                    texto={'Cargando nuevo telefono'}
                    containerProps={{
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                )}
      </Box>
    </Modal>
  )
}

ModalNewPhone.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalPhone: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshPhoneData: PropTypes.func.isRequired
}

export default ModalNewPhone

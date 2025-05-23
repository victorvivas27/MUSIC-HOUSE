import { useState, useEffect, useRef } from 'react'
import { UserForm } from './UserForm'
import { Box, Typography } from '@mui/material'
import { useNavigate, useParams, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { updateAddress } from '@/api/addresses'
import { updatePhone } from '@/api/phones'
import {
  BoxFormUnder,
  BoxLogoSuperior,
  MainCrearUsuario
} from '@/components/styles/ResponsiveComponents'
import { Logo } from '@/components/Images/Logo'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'
import { countryCodes } from '@/components/utils/codepaises/CountryCodes'
import useBackgroundLoader from '@/hook/useBackgroundLoader'

import FullScreenLoader from '@/components/common/fullScreenLoader/FullScreenLoader'

const background =
  'https://music-house-78.s3.us-east-1.amazonaws.com/CrearUsuarioBackGround.avif'
const EditUser = ({ onSwitch }) => {
  const { id } = useParams()
  const [user, setUser] = useState()
  const [formData, setFormData] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user: loggedUser, isUserAdmin } = useAuth()
  const isLoggedUser = loggedUser?.idUser === id
  const canEditUser = !(isUserAdmin && !isLoggedUser)
  const { showSuccess, showError } = useAlert()
  const { dispatch } = useAppStates()
  const isSubmittingRef = useRef(false)
  const bgLoaded = useBackgroundLoader(background, 300)

  const parsePhone = (fullNumber) => {
    if (!fullNumber) return { countryCode: '', phoneNumber: '' }
    const code = countryCodes.find((c) => fullNumber.startsWith(c.code))
    if (!code) return { countryCode: '', phoneNumber: fullNumber }
    return {
      countryCode: code.code,
      phoneNumber: fullNumber.replace(code.code, '')
    }
  }
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        dispatch({ type: actions.SET_LOADING, payload: true })
        return
      }
      try {
        const userData = await UsersApi.getUserById(id)
        const result = userData.result
        setUser(userData)
        setFormData({
          idUser: id,
          picture: result.picture || '',
          name: result.name || '',
          lastName: result.lastName || '',
          email: result.email || '',
          addresses: result.addresses?.length ? result.addresses : [],
          phones: result.phones?.length
            ? result.phones.map((p) => {
                const parsed = parsePhone(p.phoneNumber)
                return {
                  ...p,
                  countryCode: parsed.countryCode,
                  phoneNumber: parsed.countryCode + parsed.phoneNumber,
                  idPhone: p.idPhone
                }
              })
            : [
                {
                  countryCode: '',
                  phoneNumber: ''
                }
              ],
          telegramChatId: result.telegramChatId || '',
          roles: result.roles || [],
          selectedRole: ''
        })
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
        navigate('/')
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    }

    fetchUser()
  }, [dispatch, id, navigate, showError])

  const handleSubmit = async (formData) => {
    if (!formData) return

    isSubmittingRef.current = true
    setIsSubmitting(true)
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData

      if (
        !picture ||
        picture === '' ||
        (typeof picture === 'object' && !(picture instanceof File))
      ) {
        userWithoutPicture.picture = user?.data?.picture || ''
      }

      if (Object.keys(userWithoutPicture).length === 0) {
        setIsSubmitting(false)
        return
      }

      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }
      const response = await UsersApi.updateUser(formDataToSend)

      if (formData.addresses.length > 0) {
        const address = formData.addresses[0]
        await updateAddress({
          idAddress: address.idAddress,
          street: address.street,
          number: address.number,
          city: address.city,
          state: address.state,
          country: address.country
        })
      }

      if (formData.phones.length > 0) {
        const phone = formData.phones[0]
        await updatePhone({
          idPhone: phone.idPhone,
          phoneNumber: phone.phoneNumber
        })
      }

      showSuccess(`✅ ${response.message}`)
      setTimeout(() => {
        navigate(-1)
      }, 1100)

      setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
        isSubmittingRef.current = false
      }, 1000)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
      dispatch({ type: actions.SET_LOADING, payload: false })
      isSubmittingRef.current = false
    }
  }

  if (!(isLoggedUser || isUserAdmin)) {
    setTimeout(() => {
      navigate('/')
      setIsSubmitting(false)
    }, 1100)
  }
return (
    <MainCrearUsuario container bgLoaded={bgLoaded}>
       <FullScreenLoader bgLoaded={bgLoaded} text="Cargando" />
      <>
        <BoxLogoSuperior>
          <Link to="/">
            <Logo />
          </Link>
        </BoxLogoSuperior>
        {formData && (
          <BoxFormUnder
            sx={{ display: { xs: canEditUser ? 'flex' : 'none', lg: 'flex' } }}
          >
            <UserForm
              onSwitch={onSwitch}
              initialFormData={formData}
              onSubmit={handleSubmit}
              user={user}
              setUser={setUser}
              isSubmitting={isSubmitting}
            />
          </BoxFormUnder>
        )}
      </>
      {!canEditUser && (
        <Box
          sx={{
            display: {
              xs: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              lg: 'none'
            },
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            textAlign="center"
            sx={{
              paddingTop: 30,
              fontWeight: 'bold'
            }}
          >
            Funcionalidad no disponible en esta resolución
          </Typography>
        </Box>
      )}
    </MainCrearUsuario>
  )
}

export default EditUser

EditUser.propTypes = {
  onSwitch: PropTypes.func
}


import { UserForm } from './UserForm'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { useState } from 'react'

const NewUser = ({ onSwitch,isAdminCreating }) => {
  const initialFormData = {
    name: '',
    picture: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    telegramChatId: '',
    addresses: [{ street: '', number: '', city: '', state: '', country: '' }],
    phones: [{ phoneNumber: '', countryCode: '' }],
    roles: [],
    idRol: ''
  }

  const {  fetchUser } = useAuth()
  const navigate = useNavigate()
  const { showError } = useAlert()
  
  const [loading, setLoading] = useState(false)
  const { showSuccess } = useAlert()

  const handleSubmit = async (formData) => {
    setLoading(true )

    try {
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData
      delete userWithoutPicture.repeatPassword
      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      const response = await UsersApi.registerUser(formDataToSend)

    if (response?.statusCode === 201) {
      showSuccess(`✅ ${response.message}`)

      setTimeout(async () => {
        if (isAdminCreating) {
          navigate(-1)
        } else {
          await fetchUser() 
          navigate('/')
        }
      }, 100)
    }
  } catch (error) {
    showError(`❌ ${getErrorMessage(error)}`)
    setLoading(false)
  } finally {
    setTimeout(() => setLoading(false), 100)
  }
}

  return (
    <>
      <UserForm
        onSwitch={onSwitch}
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes = {
  onSwitch: PropTypes.func,
  isAdminCreating: PropTypes.bool
}

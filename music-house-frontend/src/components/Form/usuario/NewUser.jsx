
import { UserForm } from './UserForm'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'

const NewUser = ({ onSwitch }) => {
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

  const { setAuthData } = useAuth()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()
  const { isUserAdmin } = useAuth()
  const { dispatch, state } = useAppStates()

  const handleSubmit = async (formData) => {
    console.log('🔄 Submitting new user...', formData)

    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData
      delete userWithoutPicture.repeatPassword

      console.log('📝 User data without picture:', userWithoutPicture)

      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        console.log('📸 Picture is a File:', picture.name)
        formDataToSend.append('file', picture)
      } else {
        console.warn('⚠️ Picture is NOT a File:', picture)
      }

      const response = await UsersApi.registerUser(formDataToSend)
      console.log('📬 API response:', response)

      if (response?.result?.token) {
        showSuccess(`✅ ${response.message}`)

        try {
          console.log('🔐 Setting auth data...')
          setAuthData({ token: response.result.token })
        } catch (authError) {
          console.error('❌ Error setting auth data:', authError)
        }

        console.log('👤 isUserAdmin:', isUserAdmin)

        setTimeout(() => {
          if (isUserAdmin) {
            console.log('🔙 Going back...')
            navigate(-1)
          } else {
            console.log('🏠 Navigating to home...')
            navigate('/')
          }
        }, 1000)
      } else {
        console.warn('❗ Response did not contain token:', response)
        showError('❌ Error inesperado al crear usuario')
      }
    } catch (error) {
      const msg = getErrorMessage(error)
      console.error('❌ Error al registrar usuario:', error)
      showError(`❌ ${msg}`)
    } finally {
      console.log('🧹 Finalizando submit, quitando loading...')
      dispatch({ type: actions.SET_LOADING, payload: false })
    }
  }

  return (
    <>
      <UserForm
        onSwitch={onSwitch}
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
        loading={state.loading}
      />
    </>
  )
}

NewUser.propTypes = {
  onSwitch: PropTypes.func
}

export default NewUser

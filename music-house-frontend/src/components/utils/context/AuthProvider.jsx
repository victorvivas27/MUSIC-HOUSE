import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { ADMIN, USER } from '../roles/constants'

import { UsersApi } from '@/api/users'

export const AuthProvider = ({ children }) => {
  const [authGlobal, setAuthGlobal] = useState(false)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [idUser, setIdUser] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userLastName, setUserLastName] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const navigate = useNavigate()

  const fetchUser = async () => {
    console.log('%c🔍 Verificando cookies...', 'color: orange')
    console.log('📦 Document.cookie:', document.cookie)
    console.log('🌐 Intentando obtener usuario con cookie JWT...')
    try {
      console.log('✅ Usuario autenticado:', response.result)
      const response = await UsersApi.getCurrentUser()
      const user = response.result
      if (user) {
        setAuthGlobal(true)
        setIsUserAdmin(user.roles?.includes(ADMIN))
        setIsUser(user.roles?.includes(USER))
        setIdUser(user.idUser)
        setUserName(user.name)
        setUserLastName(user.lastName)
        setUserRoles(user.roles || [])
      }
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error)
      setAuthGlobal(false)
      setIsUserAdmin(false)
      setIsUser(false)
      setIdUser(null)
      setUserName(null)
      setUserLastName(null)
      setUserRoles([])
    }
  }
  useEffect(() => {
    fetchUser()
  }, [])

  const logOut = async () => {
    await UsersApi.logOut()
    setAuthGlobal(false)
    setIsUserAdmin(false)
    setIsUser(false)
    setIdUser(null)
    setUserName(null)
    setUserLastName(null)
    setUserRoles([])
    navigate('/', { replace: true })
  }
  return (
    <AuthContext.Provider
      value={{
        authGlobal,
        setAuthGlobal,
        isUserAdmin,
        setIsUserAdmin,
        isUser,
        setIsUser,
        idUser,
        userName,
        userLastName,
        userRoles,
        logOut,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

import { Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '@/hook/useAuth'
import { ROLE_ADMIN, ROLE_USER } from '@/components/utils/roles/constants'

export const ProtectedRoute = ({ redirectPath = '/autentificacion', role, children }) => {
  const { authGlobal, isUserAdmin, isUser} = useAuth()
  
 
  if (!authGlobal) {
    return <Navigate to={redirectPath} replace />
  }
  // 🎯 Usuario autenticado pero sin el rol adecuado
  const hasAccess =
    (role === ROLE_ADMIN && isUserAdmin) ||
    (role === ROLE_USER && isUser) ||
    !role

  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return children || <Outlet />
}

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.node
}

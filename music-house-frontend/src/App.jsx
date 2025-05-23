import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HeaderVisibilityProvider } from "./components/utils/context/HeaderVisibilityGlobal"
import { AuthProvider } from "./components/utils/context/AuthProvider"
import { ContextProvider } from "./components/utils/global.context"
import AuthPage from "./Pages/AuthPage"
import { AdminLayout, AdminLayoutWithoutHeaderFooter, UserLayout, UserLayoutWithoutHeaderFooter } from "./components/Layout/Layout"
import EditUser from "./components/Form/usuario/EditUser"
import { Home } from "./Pages/Home"
import Perfil from "./Pages/Perfil"
import { About } from "./Pages/About"
import { Instrument } from "./Pages/Instrument"
import { ProtectedRoute } from "./components/common/routes/ProtectedRoute"
import { Favorites } from "./Pages/Favorites"
import MisReservas from "./Pages/MisReservas"
import { ROLE_ADMIN } from "./components/utils/roles/constants"
import Instruments from "./Pages/Instruments"
import { Usuarios } from "./Pages/Admin/Usuarios"
import { Categories } from "./Pages/Admin/Categories"
import { Theme } from "./Pages/Admin/Theme"
import { AgregarTheme } from "./Pages/Admin/AgregarThem"
import { EditarTheme } from "./Pages/Admin/EditarTheme"
import { AgregarInstrumento } from "./Pages/Admin/AgregarInstrumento"
import { EditarInstrumento } from "./Pages/Admin/EditarInstrumento"
import { AgregarCategoria } from "./Pages/Admin/AgregarCategoria"
import { EditarCategoria } from "./Pages/Admin/EditarCategoria"
import CrearUsuario from "./Pages/CrearUsuario"
import { ServerError } from "./Pages/ServerError"
import { NotFoundPage } from "./Pages/NotFound"
import Reservationes from "./Pages/Admin/Reservationes"
import Feedback from "./Pages/Feedback"
import { FeedbackAdmin } from "./Pages/Admin/FeedbackAmin"
import { FaqAdmin } from "./Pages/Admin/FaqAdmin"
import EditarFaq from "./components/common/faq/EditarFaq"
import Faqs from "./Pages/Faqs"
import VerifyForm from "./components/Form/usuario/VerifyForm"
import FormularioPagoReserva from "./components/Form/formularioPagoReserva/FormularioPagoReserva"




export const App = () => {
  return (
    <BrowserRouter>
      <HeaderVisibilityProvider>
        <AuthProvider>
          <ContextProvider>
            <Routes>
              {/* 🔓 RUTAS PÚBLICAS (acceso sin login) */}
              <Route path="/autentificacion" element={<AuthPage />} />
              <Route path="/noDisponible" element={<ServerError />} />
              <Route path="/verify" element={<VerifyForm />} />
              <Route path="*" element={<NotFoundPage />} />

              {/* 🔐 RUTAS USUARIO LOGUEADO SIN HEADER/FOOTER */}
              <Route element={<UserLayoutWithoutHeaderFooter />}>
                <Route path="/editarUsuario/:id" element={<EditUser />} />
              </Route>

              {/* 🔐 RUTAS USUARIO LOGUEADO CON HEADER */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path='/feedback' element={<Feedback/>} />
                <Route path='/faqs' element={<Faqs/>} />
                <Route path="/instrument/:id/:slug?" element={<Instrument />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/reservations" element={<MisReservas />} />
                  <Route path='/reserva/pago' element={<FormularioPagoReserva/>} />
                </Route>
              </Route>

              {/* 🛠️ RUTAS DE ADMIN (con header y protegidas) */}
              <Route element={<AdminLayout />}>
                <Route element={<ProtectedRoute role={ROLE_ADMIN} />}>
                  <Route path="/instruments" element={<Instruments />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/reservations-user" element={<Reservationes />} />
                  <Route path="/theme" element={<Theme />} />
                  <Route path="/agregarTheme" element={<AgregarTheme />} />
                  <Route path="/editarTheme/:id" element={<EditarTheme />} />
                  <Route path="/agregarInstrumento" element={<AgregarInstrumento />} />
                  <Route path="/editarInstrumento/:id" element={<EditarInstrumento />} />
                  <Route path="/agregarCategoria" element={<AgregarCategoria />} />
                  <Route path="/editarCategoria/:id" element={<EditarCategoria />} />
                    <Route path="/feedback-user" element={<FeedbackAdmin/>} />
                    <Route path="/faq" element={<FaqAdmin/>} />
                    <Route path="/editarPregunta/:id" element={<EditarFaq/>} />
                </Route>
              </Route>

              {/* 🛠️ RUTA DE ADMIN SIN HEADER/FOOTER */}
              <Route element={<AdminLayoutWithoutHeaderFooter />}>
                <Route element={<ProtectedRoute role={ROLE_ADMIN} />}>
                  <Route path="/agregarUsuario" element={<CrearUsuario />} />
                </Route>
              </Route>
            </Routes>
          </ContextProvider>
        </AuthProvider>
      </HeaderVisibilityProvider>
    </BrowserRouter>
  )
}

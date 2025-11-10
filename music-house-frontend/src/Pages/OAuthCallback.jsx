import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/hook/useAuth";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    // ✅ Captura el token de la URL (ej: /oauth-success?token=eyJhbGciOi...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ Guarda el token en localStorage
      localStorage.setItem("authToken", token);

      // ✅ Limpia la URL (quita el ?token=... del navegador)
      window.history.replaceState({}, document.title, "/");

      // ✅ Obtiene los datos del usuario autenticado
      fetchUser();

      // ✅ Redirige a la página principal
      navigate("/");
    } else {
      // ❌ Si no hay token, vuelve a la pantalla de autenticación
      navigate("/autentificacion");
    }
  }, [navigate, fetchUser]);

  return <p>Procesando autenticación con Google...</p>;
};

export default OAuthCallback;
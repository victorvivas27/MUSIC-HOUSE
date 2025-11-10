import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/hook/useAuth";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const token = Cookies.get("oauth_token");
    if (token) {
      localStorage.setItem("authToken", token);
      Cookies.remove("oauth_token");
      fetchUser();
      navigate("/");
    } else {
      navigate("/autentificacion");
    }
  }, [navigate, fetchUser]);

  return <p>Procesando autenticación con Google...</p>;
};

export default OAuthCallback;
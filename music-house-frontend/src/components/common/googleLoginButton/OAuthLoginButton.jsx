
//import GoogleIcon from '@mui/icons-material/Google'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ContainerBottom, CustomButton } from "@/components/styles/ResponsiveComponents"
import PropTypes from "prop-types";

const OAuthLoginButton = ({ provider = "google" }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleOAuthLogin = () => {
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  const icons = {
    google: <FcGoogle size={35} />,
    github: <FaGithub size={35} />,
  };

  const labels = {
    google: "Google",
    github: "GitHub",
  };

  return (
    <ContainerBottom>
      <CustomButton
        onClick={handleOAuthLogin}
        startIcon={icons[provider]}
      >
        Continuar con {labels[provider]}
      </CustomButton>
    </ContainerBottom>
  );
};

export default OAuthLoginButton;

OAuthLoginButton.propTypes={
  provider:PropTypes.string
}


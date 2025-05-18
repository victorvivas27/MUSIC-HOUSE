
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
    google: <FcGoogle size={25} />,
    github: <FaGithub size={25} />,
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
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(66, 133, 244, 0.08)",
            borderColor: "rgba(66, 133, 244, 0.5)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        }}
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


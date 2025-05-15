
//import GoogleIcon from '@mui/icons-material/Google'
import { FcGoogle } from "react-icons/fc";
import { ContainerBottom, CustomButton } from "@/components/styles/ResponsiveComponents"

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/google';
  };

  return (
    <ContainerBottom>
      <CustomButton
        variant="outlined"
        onClick={handleGoogleLogin}
        startIcon={<FcGoogle size={20} />}
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
            lg: "45%",
            xl: "35%"
          },
          py: 1.5,
          fontSize: {
            xs: "0.875rem",
            sm: "1rem"
          },
          fontWeight: 500,
          color: 'text.secondary',
          borderColor: 'divider',
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.08)',
            borderColor: 'rgba(66, 133, 244, 0.5)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }}
      >
        Continue with Google
      </CustomButton>
    </ContainerBottom>
  );
};

export default GoogleLoginButton;
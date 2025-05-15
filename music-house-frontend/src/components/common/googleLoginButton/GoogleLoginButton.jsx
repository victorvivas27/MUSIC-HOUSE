
//import GoogleIcon from '@mui/icons-material/Google'
import { FcGoogle } from "react-icons/fc";
import { ContainerBottom, CustomButton } from "@/components/styles/ResponsiveComponents"

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <ContainerBottom>
      <CustomButton
       
        onClick={handleGoogleLogin}
        startIcon={<FcGoogle size={25} />}
        sx={{
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
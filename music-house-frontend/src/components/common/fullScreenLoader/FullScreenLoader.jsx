import { Box, CircularProgress } from "@mui/material";
import LoadingText from "../loadingText/LoadingText";
import PropTypes from "prop-types";

const FullScreenLoader = ({ bgLoaded, text = "Cargando" }) => {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'var(--gradiente-dorado)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 1s ease-in-out',
          animation: bgLoaded ? 'fadeOut 1s ease-out forwards' : 'none',
          '@keyframes fadeOut': {
            '0%': { opacity: 1 },
            '100%': { opacity: 0, visibility: 'hidden' }
          }
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CircularProgress 
            size={70} 
            thickness={2}
            sx={{ color: 'var(--color-primario)' }}
          />
        </Box>
        <LoadingText 
        fontSize="1.5rem"
        text={text}
        color="var(--color-info)"
        />
        
      </Box>
    );
  };
  
  FullScreenLoader.propTypes = {
    bgLoaded: PropTypes.bool,
    text: PropTypes.string
  };
  
  export default FullScreenLoader;
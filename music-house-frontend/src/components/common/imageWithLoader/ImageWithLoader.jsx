import PropTypes from "prop-types";
import ImageSkeleton from "../imageSkeleton/ImageSkeleton";
import { Box } from "@mui/material";
import useImageLoader from "@/hook/useImageLoader";

const ImageWithLoader = ({
    src,
    alt = '',
    width = 80,
    height = 80,
    variant = 'circular', 
    border = '1px solid #ccc',
    borderRadius = '50%',
    fallbackSrc = '/src/assets/instrumento_general_03.jpg',
    delay = 500,
  }) => {
    const loaded = useImageLoader(src, delay);
  
    return (
      <Box sx={{ width, height, position: 'relative' }}>
        {!loaded && (
          <ImageSkeleton
            variant={variant}
            width={width}
            height={height}
          />
        )}
        <img
          src={src || fallbackSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: variant === 'circular' ? '50%' : borderRadius,
            border,
            boxShadow: 'var(--box-shadow)',
            display: loaded ? 'block' : 'none'
          }}
        />
      </Box>
    );
  };
  
  ImageWithLoader.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variant: PropTypes.oneOf(['circular', 'rectangular']),
    border: PropTypes.string,
    borderRadius: PropTypes.string,
    fallbackSrc: PropTypes.string,
    delay: PropTypes.number
  };
  
  export default ImageWithLoader;
import PropTypes from 'prop-types'
import './LoadingText.css' 

const LoadingText = ({ 
  text ='Cargando', 
  color='var( --texto-primario)' ,
  fontSize="1rem"
}) => {
  return (
    <span className="loading-text">
      <span className="loading-label" style={{color,fontSize}}>{text}</span>
      <span style={{ color: 'red' }} className="dot">.</span>
      <span style={{ color: 'blue' }} className="dot">.</span>
      <span style={{ color: 'red' }} className="dot">.</span>
      <span style={{ color: 'blue' }} className="dot">.</span>
      <span style={{ color: 'red' }} className="dot">.</span>
    </span>
  )
}

export default LoadingText
LoadingText.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string
}

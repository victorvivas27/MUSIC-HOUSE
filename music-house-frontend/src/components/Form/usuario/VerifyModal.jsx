import { Modal, Box, Fade, Backdrop } from '@mui/material'

import PropTypes from 'prop-types'
import VerifyForm from './VerifyForm'

const VerifyModal = ({ open, onClose, email }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
    >
      <Fade in={open}>
        <Box>
          <VerifyForm initialEmail={email} onSuccess={onClose} />
        </Box>
      </Fade>
    </Modal>
  )
}

VerifyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

export default VerifyModal

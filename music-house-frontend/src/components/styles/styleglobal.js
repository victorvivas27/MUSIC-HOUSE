export const inputStyles = {
  width: '99%',
  color: 'var(--texto-primario)',
  margin: 2,

  '& .MuiInputBase-input': {
    color: 'var(--texto-primario)',
    fontSize: '18px',
     '&::placeholder': {
      color: 'var(  --texto-primario)', 
      opacity: 1,
    },

   
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px rgba(255,255,255,0) inset',
      WebkitTextFillColor: 'var(--texto-primario)',
      transition: 'background-color 9999s ease-in-out 0s'
    }
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)',
      borderWidth: '2px',
      borderRadius: '8px',
      fontSize: '18px'
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)',
      fontSize: '18px'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-exito)',
      fontSize: '18px'
    }
  },

  '& .MuiInputLabel-root': {
    color: 'var(--texto-primario)',
    fontSize: '18px'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--texto-primario)',
    fontSize: '18px'
  }
}

export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 


};

export const flexColumnContainer = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
};

export const paginationStyles = {
  '& .MuiTablePagination-selectLabel': {
    fontSize: 20,
    fontWeight: 'bold',
    textShadow: '0 1px 2px var(--color-primario)',
  },
  '& .MuiTablePagination-input': {
    fontSize: '20px',
    color: 'var(--color-error)'
  },
  '& .MuiTablePagination-displayedRows': {
    fontStyle: 'italic',
    fontSize: 20,
    color: 'var(--color-exito)'
  },
  '& .MuiTablePagination-actions button': {
   color: 'var( --texto-primario)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2rem', 
  }
}

export const fontSizeResponsi = {
  fontSize: {
    xs: '20px',
    sm: '23px',
    md: '25px',
    lg: '30px',
    xl: '35px'
  },
  marginRight: 1
}



export const inputStyles = (theme) => ({
  width: '100%',
// 👉 Borde custom solo en left y right
  '& .MuiOutlinedInput-notchedOutline': {
    boxShadow: "var(--box-shadow)",
    border: 'none',
    borderLeft: '1px solid var(--color-primario)',
    borderRight: 'none',
    borderTop: 'none',
    borderBottom: '1px solid var(--color-primario)',
    borderRadius: 1,
    background: 'var(--gradiente-vidrio)',

  },

  '& .MuiInputBase-input': {
    fontSize: '1rem',
    height: 10,
    zIndex: 1223,
    [theme.breakpoints.up('sm')]: {
      height: 15,
      fontSize: '0.9rem',
    },
    [theme.breakpoints.up('md')]: {
      height: 12,
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      height: 13,
      fontSize: '1rem',
    }
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    fontSize: '1rem',
    transform: 'translate(10px, -18px) scale(1)',
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.9rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
    },
  },

  '& .MuiInputLabel-root': {
    color: 'var(--texto-inverso)',
    fontSize: '1rem',


    [theme.breakpoints.up('sm')]: {
      fontSize: '0.9rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--texto-inverso)'
  },
  '& .MuiSelect-select': {
    padding: '10px',
    fontSize: '15px',

  },
})

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

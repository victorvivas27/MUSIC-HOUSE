export const inputStyles = (theme) => ({
  width: '100%',

  // 🔲 Personalización del borde del input
  '& .MuiOutlinedInput-notchedOutline': {
    boxShadow: 'var(--box-shadow)', // Sombra general
    border: 'none',                 // Borde desactivado por defecto
    borderLeft: '1px solid var(--color-primario)', // Solo borde izquierdo visible
    borderRight: 'none',
    borderTop: 'none',
    borderBottom: '1px solid var(--color-primario)', // Borde inferior personalizado
    borderRadius: 1, // Bordes suaves
  },

  // 🟡 Comportamiento cuando se hace hover sobre el input
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primario)',
    borderBottom: '2px solid var(--color-primario)',
  },

  // 🔵 Comportamiento cuando el input está enfocado (activo)
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primario)',
    borderBottom: '2px solid var(--color-primario)',
  },

  // ✍️ Estilos para el texto dentro del input
  '& .MuiInputBase-input': {
    fontSize: '0.9rem',
    height: 10,
    color: 'var(--texto-inverso)',

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
    },
  },

  // 🏷️ Label cuando está shrink (desplazada hacia arriba)
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    fontSize: '0.9rem',
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

  // 🏷️ Label por defecto (sin foco)
  '& .MuiInputLabel-root': {
    color: 'var(--texto-inverso)',
    fontSize: '0.9rem',

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

  // 🟢 Color del label cuando el input está enfocado
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--texto-inverso)'
  },

  // 🔽 Estilos para selects (opcional, si usás el mismo estilo para Select)
  '& .MuiSelect-select': {
    padding: '10px',
    fontSize: '15px',
    color: 'var(--texto-inverso)',
  },
});

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

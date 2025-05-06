import { styled, Tooltip, tooltipClasses } from "@mui/material";

 export const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-primario)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '10px 14px',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)',
    fontFamily: 'Arial, sans-serif',
    maxWidth: 220
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--color-primario)'
  }
}))
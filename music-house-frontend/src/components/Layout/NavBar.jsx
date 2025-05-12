import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CategoryIcon from '@mui/icons-material/Category'
import PeopleIcon from '@mui/icons-material/People'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PaletteIcon from '@mui/icons-material/Palette'
import FeedbackIcon from '@mui/icons-material/Feedback'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'

export const pagesMobile = [
  {
    to: '/',
    text: 'Inicio',
    icon: <HomeIcon sx={{ color: '#4caf50' }} />,
    any: true
  }, // verde
  {
    to: '/about',
    text: 'Acerca de',
    icon: <InfoIcon sx={{ color: '#2196f3' }} />,
    anonymous: true,
    user: true
  }, // azul
  {
    to: '/favorites',
    text: 'Favoritos',
    icon: <FavoriteIcon sx={{ color: '#e91e63' }} />,
    user: true
  }, // rosa
  {
    to: '/reservations',
    text: 'Mis reservas',
    icon: <CalendarMonthIcon sx={{ color: '#ff9800' }} />,
    user: true
  }, // naranja
 {
  to: '/',
  text: 'Feedback',
  icon: <FeedbackIcon sx={{ color: '#ff9800' }} />,
  scrollTo: '#feedback-section',
  anonymous: true,
  user: true
}
]

export const pagesDesktop = [
  {
    to: '/',
    text: 'Inicio',
    icon: <HomeIcon sx={{ color: '#4caf50' }} />,
    any: true
  }, // verde
  {
    to: '/instruments',
    text: 'Instrumentos',
    icon: <MusicNoteIcon sx={{ color: '#9c27b0' }} />,
    admin: true
  }, // púrpura
  {
    to: '/usuarios',
    text: 'Usuarios',
    icon: <PeopleIcon sx={{ color: '#3f51b5' }} />,
    admin: true
  }, // azul oscuro
  {
    to: '/categories',
    text: 'Categorías',
    icon: <CategoryIcon sx={{ color: '#ff5722' }} />,
    admin: true
  }, // naranja fuerte
  {
    to: '/theme',
    text: 'Tematica',
    icon: <PaletteIcon sx={{ color: '#795548' }} />,
    admin: true
  }, // marrón
  {
    to: '/about',
    text: 'Acerca de',
    icon: <InfoIcon sx={{ color: '#2196f3' }} />,
    anonymous: true,
    user: true
  }, // azul
  {
    to: '/favorites',
    text: 'Favoritos',
    icon: <FavoriteIcon sx={{ color: '#e91e63' }} />,
    user: true
  }, // rosa
  {
    to: '/reservations',
    text: 'Mis reservas',
    icon: <CalendarMonthIcon sx={{ color: '#ff9800' }} />,
    user: true
  }, // naranja
  {
    to: '/reservations-user',
    text: 'Reservas Usuario',
    icon: <CalendarMonthIcon sx={{ color: '#ff9800' }} />,
    admin: true
  }, // naranja
   {
    to: '/feedback-user',
    text: 'Feedback Usuario',
     icon: <FeedbackIcon sx={{ color: '#ff9800' }} />,
    admin: true
  } ,
  {
  to: '/',
  text: 'Feedback',
  icon: <FeedbackIcon sx={{ color: '#ff9800' }} />,
  scrollTo: '#feedback-section',
  anonymous: true,
  user: false
},
   {
    to: '/faq',
    text: 'Preguntas',
    icon: <QuestionAnswerIcon sx={{ color: '#2196f3' }} />,
    admin: true
  },
   {
    to: '/faqs',
    text: 'Preguntas frecuentes',
  icon: <QuestionAnswerIcon sx={{ color: '#2196f3' }} />,
    anonymous: true,
    user: true
  },

]

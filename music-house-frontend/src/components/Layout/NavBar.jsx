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
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'

export const pagesMobile = [
  {
    to: '/',
    text: 'Inicio',
    icon: <HomeIcon sx={{ color: '#4caf50' }} />, // verde
    any: true
  },
  {
    to: '/about',
    text: 'Acerca de',
    icon: <InfoIcon sx={{ color: '#42a5f5' }} />, // azul celeste
    anonymous: true,
    user: true
  },
  {
    to: '/favorites',
    text: 'Favoritos',
    icon: <FavoriteIcon sx={{ color: '#ab47bc' }} />, // violeta suave
    user: true
  },
  {
    to: '/reservations',
    text: 'Mis reservas',
    icon: <CalendarMonthIcon sx={{ color: '#26a69a' }} />, // verde azulado
    user: true
  },
  {
    to: '/',
    text: 'Feedback',
    icon: <FeedbackIcon sx={{ color: '#5c6bc0' }} />, // índigo
    scrollTo: '#feedback-section',
    anonymous: true,
    user: true
  }
]

export const pagesDesktop = [
  {
    to: '/',
    text: 'Inicio',
    icon: <HomeIcon sx={{ color: '#4caf50' }} />, // verde
    any: true
  },
  {
    to: '/instruments',
    text: 'Instrumentos',
    icon: <MusicNoteIcon sx={{ color: '#9575cd' }} />, // violeta suave
    admin: true
  },
  {
    to: '/usuarios',
    text: 'Usuarios',
    icon: <PeopleIcon sx={{ color: '#5c6bc0' }} />, // índigo suave
    admin: true
  },
  {
    to: '/categories',
    text: 'Categorías',
    icon: <CategoryIcon sx={{ color: '#26a69a' }} />, // verde azulado
    admin: true
  },
  {
    to: '/theme',
    text: 'Temática',
    icon: <PaletteIcon sx={{ color: '#8d6e63' }} />, // marrón claro
    admin: true
  },
  {
    to: '/about',
    text: 'Acerca de',
    icon: <InfoIcon sx={{ color: '#42a5f5' }} />, // azul cielo
    anonymous: true,
    user: true
  },
  {
    to: '/favorites',
    text: 'Favoritos',
    icon: <FavoriteIcon sx={{ color: '#ba68c8' }} />, // rosa-violeta
    user: true
  },
  {
    to: '/reservations',
    text: 'Mis reservas',
    icon: <CalendarMonthIcon sx={{ color: '#4db6ac' }} />, // turquesa suave
    user: true
  },
  {
    to: '/reservations-user',
    text: 'Reservas Usuario',
    icon: <CalendarMonthIcon sx={{ color: '#4db6ac' }} />, // mismo turquesa
    admin: true
  },
  {
    to: '/feedback-user',
    text: 'Feedback Usuario',
    icon: <FeedbackIcon sx={{ color: '#7986cb' }} />, // azul lavanda
    admin: true
  },
  {
    to: '/',
    text: 'Feedback',
    icon: <FeedbackIcon sx={{ color: '#7986cb' }} />, // igual que arriba
    scrollTo: '#feedback-section',
    anonymous: true,
    user: false
  },
  {
    to: '/faq',
    text: 'Preguntas',
    icon: <QuestionAnswerIcon sx={{ color: '#64b5f6' }} />, // celeste suave
    admin: true
  },
  {
    to: '/faqs',
    text: 'Preguntas frecuentes',
    icon: <QuestionAnswerIcon sx={{ color: '#64b5f6' }} />,
    anonymous: true,
    user: true
  },
  {
    text: 'Iniciar sesión',
    to: '/autentificacion',
    icon: <LoginRoundedIcon className="vibrate-2" sx={{ color: '#81c784' }} />, // verde claro
    anonymous: true
  }
]

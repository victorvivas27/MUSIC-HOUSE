import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Alert, Box, Snackbar, Typography } from '@mui/material'
import {
  addAvailableDates,
  getAllAvailableDatesByInstrument
} from '@/api/availability'
import { getErrorMessage } from '@/api/getErrorMessage'
import { TitleResponsive } from '@/components/styles/ResponsiveComponents'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

const CalendarAdmin = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const id = instrument?.result.idInstrument

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!id) return
      try {
        const response = await getAllAvailableDatesByInstrument(id)
        const dates = response.result || []

        const filteredDates = dates
          .filter((item) => item.available)
          .map((item) => dayjs(item.dateAvailable).format('YYYY-MM-DD'))

        setAvailableDates(filteredDates)
      } catch (error) {
        setError(`❌ ${getErrorMessage(error)}`)
        setOpenSnackbar(true)
      }
    }

    fetchAvailableDates()
  }, [id])

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleDayClick = async (day) => {
    const formattedDay = day.format('YYYY-MM-DD')

    if (!id) return

    const isAlreadyAvailable = availableDates.includes(formattedDay)

    const newDate = {
      idInstrument: id,
      dateAvailable: formattedDay,
      available: !isAlreadyAvailable
    }

    try {
      await addAvailableDates([newDate])

      setAvailableDates((prevDates) =>
        isAlreadyAvailable
          ? prevDates.filter((date) => date !== formattedDay)
          : [...prevDates, formattedDay]
      )
    } catch (error) {
      setError(`❌ ${getErrorMessage(error)}`)
      setOpenSnackbar(true)
    }
  }

  const CustomDayComponent = (props) => {
    const { day, selected, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)
    const today = dayjs()
    const isPastDate = day.isBefore(today, 'day')

    return (
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        onClick={() => handleDayClick(day)}
        sx={{
          bgcolor: isPastDate
            ? 'var( --color-secundario-50) !important'
            : isAvailable
              ? 'var( --color-exito) !important'
              : 'var(--color-error)!important',

          color: isPastDate
            ? 'var( --texto-primario) !important'
            : isAvailable
            ? 'var( --texto-primario) !important'
            : 'var( --color-primario)!important',
        }}
      />
    )
  }

  CustomDayComponent.propTypes = {
    day: PropTypes.object.isRequired,
    selected: PropTypes.bool
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        slots={{ day: CustomDayComponent }}
        sx={{
          backgroundColor: 'rgba(251, 193, 45, 0.57)',
          borderRadius: 2, // opcional: bordes redondeados
          width: { xs: '90%', sm: '90%', md: '80%', lg: '40%' },
          minWidth: 280
        }}
      />

      {/* 🔥 Leyenda de colores */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem'
        }}
      >
        <TitleResponsive sx={{
          color:"var(--color-primario)"
          }}>Leyenda del Calendario</TitleResponsive>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          {/* 🔹 Fechas Pasadas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '25px',
                height: '25px',
                backgroundColor: 'var(--color-secundario-50)',
                borderRadius: '50%',
                border: '1px solid var(--color-primario)',
              
              }}
            />
            <Typography
             variant="body1"
             sx={{   color:"var(--color-primario)"}}
             >Fechas pasadas</Typography>
          </Box>

          {/* 🟢 Fechas Disponibles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '25px',
                height: '25px',
                backgroundColor:
                  'var(--color-error)!important',
                borderRadius: '50%',
              
              }}
            />
            <Typography
             variant="body1"
             sx={{   color:"var(--color-primario)"}}
             >
              Lista para ingresar a disponible
            </Typography>
          </Box>

          {/* 🔸 Fechas Seleccionadas como Disponibles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '25px',
                height: '25px',
                backgroundColor: 'var( --color-exito) !important',
                borderRadius: '50%',
                border: '1px solid var( --color-exito) !important'
              }}
            />
            <Typography
             variant="body1"
             sx={{   color:"var(--color-primario)"}}
             >
              Instrumento marcado como disponible
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Snackbar para errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{
            backgroundColor: 'var(--color-advertencia)',
            color: 'var(--color-error)',
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '8px'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  )
}

CalendarAdmin.propTypes = {
  instrument: PropTypes.shape({
    result: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default CalendarAdmin

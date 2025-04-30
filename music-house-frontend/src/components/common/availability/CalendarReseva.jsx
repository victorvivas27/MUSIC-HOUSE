import { Box } from '@mui/material'
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { getAllAvailableDatesByInstrument } from '@/api/availability'
import { getErrorMessage } from '@/api/getErrorMessage'
import { createReservation, getReservationById } from '@/api/reservations'
import { flexColumnContainer } from '@/components/styles/styleglobal'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import LoaderOverlay from '../loader/LoaderOverlay'

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [reservedDates, setReservedDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [isInstrumentReserved, setIsInstrumentReserved] = useState(false)
  const idInstrument = instrument?.result?.idInstrument
  const { idUser } = useAuth()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!idInstrument) return
      try {
        const dates = await getAllAvailableDatesByInstrument(idInstrument)
        const filtered = dates.result
          .filter((d) => d.available)
          .map((d) => formatDate(d.dateAvailable))
        setAvailableDates(filtered)
      } catch (err) {
        showError(`❌ ${getErrorMessage(err)}`)
      }
    }
    fetchAvailableDates()
  }, [idInstrument, showError])

  const handleDateSelect = (date) => {
    const formatted = formatDate(date)
    if (!availableDates.includes(formatted)) {
      const isPast = dayjs(formatted).isBefore(dayjs(), 'day')
      showError(
        isPast
          ? '❌ No se puede seleccionar una fecha pasada.'
          : '❌ El instrumento no está habilitado para esa fecha.'
      )
      return
    }
    setSelectedDates((prev) => {
      const updated = prev.includes(formatted)
        ? prev.filter((d) => d !== formatted)
        : [...prev, formatted]
      return updated.sort((a, b) => dayjs(a).unix() - dayjs(b).unix())
    })
  }

  const handleConfirmReservation = async () => {
    setLoading(true)
    const startDate = selectedDates[0]
    const endDate = selectedDates[selectedDates.length - 1]
    try {
      await createReservation(idUser, idInstrument, startDate, endDate)
      showSuccess(
        '¡Reserva realizada!',
        `Tu reserva ha sido confirmada del ${startDate} al ${endDate}.`
      )
      setSelectedDates([])
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      showError(`❌ ${getErrorMessage(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservedDates = useCallback(async () => {
    try {
      const res = await getReservationById(idUser)
      const reservas = res.result || []
      const instrumentRes = reservas.filter(
        (r) => r.idInstrument === idInstrument
      )
      setIsInstrumentReserved(instrumentRes.length > 0)

      const booked = instrumentRes.flatMap((r) => {
        const start = dayjs(r.startDate)
        const end = dayjs(r.endDate)
        const range = []
        for (
          let d = start;
          d.isSame(end) || d.isBefore(end);
          d = d.add(1, 'day')
        ) {
          range.push(formatDate(d))
        }
        return range
      })
      setReservedDates(booked)
    } catch (err) {
      showError(`❌ ${getErrorMessage(err)}`)
      setReservedDates([])
    }
  }, [idInstrument, idUser, showError])

  useEffect(() => {
    if (idUser) fetchReservedDates()
  }, [fetchReservedDates, idUser])

  const CustomDayComponent = (props) => {
    const { day, ...other } = props
    const formattedDay = formatDate(day)
    const isAvailable = availableDates.includes(formattedDay)
    const isSelected = selectedDates.includes(formattedDay)
    const isReserved = reservedDates.includes(formattedDay)

    return (
      <PickersDay
        {...other}
        day={day}
        onClick={() => !isReserved && handleDateSelect(day)}
        sx={{
          bgcolor: isReserved
            ? 'var(--color-primario) !important'
            : isSelected
              ? 'var(--color-azul) !important'
              : isAvailable
                ? 'var(--color-exito) !important'
                : 'var(--calendario-color-no-disponible) !important',
          color: 'var( --color-primario-active) !important',
          pointerEvents: isReserved ? 'none' : 'auto',
          cursor: isReserved ? 'not-allowed' : 'pointer'
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
      <Box sx={{ position: 'relative', minHeight: '600px', width: '100%' }}>
        <Box sx={{ ...flexColumnContainer, gap: 2, padding: 2 }}>
          <Box
            sx={{
              width: '100%',
              maxHeight: { xs: 280, sm: 320, md: 360 },
              overflowY: 'auto',
              display: 'flex',
              justifyContent: 'center',
              p: 1
            }}
          >
            <DateCalendar
              slots={{ day: CustomDayComponent }}
              sx={{
                backgroundColor: 'rgba(251, 193, 45, 0.57)',
                borderRadius: 2, // opcional: bordes redondeados
                width: { xs: '90%', sm: '90%', md: '80%', lg: '40%' },
                minWidth: 280
              }}
            />
          </Box>

          {selectedDates.length > 0 && !isInstrumentReserved && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: 'var(--color-exito)',
                borderRadius: 2,
                color: 'var(--texto-inverso-black)',
                textAlign: 'center',
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '90%',
                  lg: '72%',
                  xl: '70%'
                }
              }}
            >
              <TitleResponsive>📅 Fechas seleccionadas:</TitleResponsive>
              <ParagraphResponsive>
                {selectedDates.join(' • ')}
              </ParagraphResponsive>
            </Box>
          )}

          <ContainerBottom
            sx={{
              width: { xs: '100%', sm: '100%', md: '90%', lg: '70%', xl: '50%' }
            }}
          >
            <CustomButton
              onClick={handleConfirmReservation}
              disabled={loading}
              sx={{
                visibility:
                  selectedDates.length > 0 && !isInstrumentReserved
                    ? 'visible'
                    : 'hidden',
                boxShadow: 'var(--box-shadow)'
              }}
              className={
                selectedDates.length > 1 ? 'fade-in-up' : 'fade-out-soft'
              }
            >
              Reservar
            </CustomButton>
          </ContainerBottom>
        </Box>

        {loading && (
          <LoaderOverlay
            texto={'Cargando reserva'}
            containerProps={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}

CalendarReserva.propTypes = {
  instrument: PropTypes.shape({
    result: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default CalendarReserva

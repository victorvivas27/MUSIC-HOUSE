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
import { getReservationById } from '@/api/reservations'
import { flexColumnContainer } from '@/components/styles/styleglobal'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'

dayjs.extend(utc)
dayjs.extend(timezone)
const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [reservedDates, setReservedDates] = useState([])
  const [isInstrumentReserved, setIsInstrumentReserved] = useState(false)
  const idInstrument = instrument?.result?.idInstrument
  const { idUser } = useAuth()
  const navigate = useNavigate()
  const { showError } = useAlert()

  // Calculamos las fechas de inicio y fin
  const startDate = selectedDates.length > 0 ? dayjs(selectedDates[0]) : null
  const endDate =
    selectedDates.length > 0
      ? dayjs(selectedDates[selectedDates.length - 1])
      : null
  const totalDays =
    startDate && endDate ? endDate.diff(startDate, 'day') + 1 : 0
  const pricePerDay = instrument?.result?.rentalPrice || 0
  const totalPrice = pricePerDay * totalDays
  const isRangeValid = selectedDates.length >= 1

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!idInstrument) return
      try {
        const dates = await getAllAvailableDatesByInstrument(idInstrument)
        const filtered = dates.result
          .filter((d) => d.available)
          .map((item) => dayjs(item.dateAvailable).format('YYYY-MM-DD'))
        setAvailableDates(filtered)
      } catch (err) {
        showError(`❌ ${getErrorMessage(err)}`)
      }
    }
    fetchAvailableDates()
  }, [idInstrument, showError])

  const handleDateSelect = (date) => {
    const formatted = dayjs
      .utc(date)
      .tz('America/Santiago')
      .format('YYYY-MM-DD')

    if (!availableDates.includes(formatted)) {
      const isPast = dayjs(formatted).isBefore(dayjs(), 'day')
      showError(
        isPast
          ? '❌ No se puede seleccionar una fecha pasada.'
          : '❌ El instrumento no está habilitado para esa fecha.'
      )
      return
    }

    // Si no hay fechas seleccionadas o se hace shift+click, seleccionamos rango
    if (
      selectedDates.length === 0 ||
      (window.event && window.event.shiftKey && startDate)
    ) {
      const start = startDate || dayjs(formatted)
      const end = dayjs(formatted)
      const range = []

      // Ordenamos las fechas por si el usuario selecciona primero la fecha mayor
      const [from, to] = start.isBefore(end) ? [start, end] : [end, start]

      // Generamos todas las fechas en el rango
      for (let d = from; d.isBefore(to) || d.isSame(to); d = d.add(1, 'day')) {
        const dateStr = formatDate(d)
        if (
          availableDates.includes(dateStr) &&
          !reservedDates.includes(dateStr)
        ) {
          range.push(dateStr)
        }
      }

      setSelectedDates(range)
    } else {
      // Selección/deselección individual
      setSelectedDates((prev) => {
        const updated = prev.includes(formatted)
          ? prev.filter((d) => d !== formatted)
          : [...prev, formatted]
        return updated.sort((a, b) => dayjs(a).unix() - dayjs(b).unix())
      })
    }
  }

  // Recuperar el estado al cargar el componente desde localStorage
  useEffect(() => {
    const savedReservation = localStorage.getItem('currentReservation')
    if (savedReservation) {
      const { selectedDates: savedDates } = JSON.parse(savedReservation)
      setSelectedDates(savedDates)
    }
  }, [])

  const handleConfirmReservation = () => {
    // Guardar en localStorage antes de navegar
    const reservationData = {
      idInstrument,
      idUser,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      totalPrice,
      selectedDates,
      instrumentName: instrument?.result?.name,
      rentalPrice: instrument?.result?.rentalPrice
    }

    localStorage.setItem('currentReservation', JSON.stringify(reservationData))

    navigate('/reserva/pago')
  }

  // Función para cancelar y limpiar la reserva
  const handleCancelReservation = () => {
    localStorage.removeItem('currentReservation')
    setSelectedDates([])
  }

  const fetchReservedDates = useCallback(async () => {
    try {
      const res = await getReservationById(idUser)
      const reservas = res.result?.content || []
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
    const { day, outsideCurrentMonth=false, ...other } = props
    const formattedDay = formatDate(day)
    const isAvailable = availableDates.includes(formattedDay)
    const isSelected = selectedDates.includes(formattedDay)
    const isReserved = reservedDates.includes(formattedDay)
    const isInRange =
      startDate && endDate && day.isAfter(startDate) && day.isBefore(endDate)

    if (outsideCurrentMonth) {
      return <PickersDay {...other} outsideCurrentMonth day={day} />
    }

    return (
      <PickersDay
        {...other}
        day={day}
      outsideCurrentMonth={outsideCurrentMonth}
        onClick={() => !isReserved && handleDateSelect(day)}
        sx={{
          bgcolor: isReserved
            ? 'var(--color-primario-active) !important'
            : isSelected
              ? 'var(--color-info) !important'
              : isInRange
                ? 'rgba(0, 123, 255, 0.3) !important'
                : isAvailable
                  ? 'var(--color-exito) !important'
                  : 'var(--calendario-color-no-disponible) !important',
          color: isReserved
            ? 'var(--color-primario) !important'
            : isSelected || isInRange
              ? 'white !important'
              : 'inherit',
          pointerEvents: isReserved ? 'none' : 'auto',
          cursor: isReserved ? 'not-allowed' : 'pointer',
          border: isInRange ? '1px solid var(--color-info)' : 'none',
          borderRadius: isInRange ? '0' : '50%',
          '&:first-of-type': {
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%'
          },
          '&:last-of-type': {
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%'
          }
        }}
      />
    )
  }

  CustomDayComponent.propTypes = {
    day: PropTypes.object.isRequired,
    outsideCurrentMonth: PropTypes.bool
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{}}>
        <Box sx={{ ...flexColumnContainer, gap: 2, padding: 2 }}>
          <Box>
            <DateCalendar
              slots={{ day: CustomDayComponent }}
              sx={{
                backgroundColor: 'rgba(251, 193, 45, 0.57)',
                borderRadius: 2
              }}
            />
          </Box>

          {startDate && endDate && isRangeValid && !isInstrumentReserved && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: 'var(--color-exito)',
                borderRadius: 2,
                color: 'var(--texto-inverso-black)',
                maxWidth: 500,
                mx: 'auto',
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '90%',
                  lg: '72%',
                  xl: '70%'
                }
              }}
            >
              <TitleResponsive>📋 Resumen de reserva</TitleResponsive>
              <ParagraphResponsive>
                <strong>Instrumento:</strong> {instrument?.result?.name}
              </ParagraphResponsive>
              <ParagraphResponsive>
                <strong>Desde:</strong>{' '}
                {startDate.format('dddd, D [de] MMMM [de] YYYY')}
              </ParagraphResponsive>
              <ParagraphResponsive>
                <strong>Hasta:</strong>{' '}
                {endDate.format('dddd, D [de] MMMM [de] YYYY')}
              </ParagraphResponsive>
              <ParagraphResponsive>
                <strong>Días totales:</strong> {totalDays}
              </ParagraphResponsive>
              <ParagraphResponsive>
                <strong>Precio por día:</strong> ${pricePerDay.toLocaleString()}
              </ParagraphResponsive>
              <ParagraphResponsive
                sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                <strong>Total a pagar:</strong> ${totalPrice.toLocaleString()}
              </ParagraphResponsive>
              <ParagraphResponsive sx={{ mt: 1, fontStyle: 'italic' }}>
                {selectedDates.length > 1
                  ? `(${selectedDates.length} días seleccionados)`
                  : '(1 día seleccionado)'}
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
              Confirmar Reserva
            </CustomButton>
          </ContainerBottom>

          {/* Botón de cancelar reserva */}
          <ContainerBottom
           sx={{
              width: { xs: '100%', sm: '100%', md: '90%', lg: '70%', xl: '30%' }
            }}>
            <CustomButton
              onClick={handleCancelReservation}
              sx={{
                backgroundColor: 'var(--color-error)',

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
              Cancelar Reserva
            </CustomButton>
          </ContainerBottom>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

CalendarReserva.propTypes = {
  instrument: PropTypes.shape({
    result: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired,
      name: PropTypes.string,
      rentalPrice: PropTypes.number
    })
  })
}

export default CalendarReserva

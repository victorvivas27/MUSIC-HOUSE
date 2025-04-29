import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Button,
  Collapse
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { deleteReservation, getReservationById } from '@/api/reservations'
import { getErrorMessage } from '@/api/getErrorMessage'

import { Loader } from '@/components/common/loader/Loader'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { CustomTooltip } from '@/components/common/customTooltip/CustomTooltip'
import { Link } from 'react-router-dom'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'

const MisReservas = () => {
  const [reservas, setReservas] = useState([])
  const [loadingState, setLoadingState] = useState({
    initial: true,
    deleting: false
  })
  const [expandedId, setExpandedId] = useState(null)

  const { idUser } = useAuth()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getAllReservations = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, initial: true }))
    try {
      const response = await getReservationById(idUser)
      setReservas(response.result || [])
    } catch (error) {
      setReservas([])
      showError(`Error al cargar reservas: ${getErrorMessage(error)}`)
    } finally {
      setLoadingState((prev) => ({ ...prev, initial: false }))
    }
  }, [idUser, showError])

  useEffect(() => {
    getAllReservations()
  }, [getAllReservations])

  const handleDelete = async (idReservation) => {
    const reserva = reservas.find((r) => r.idReservation === idReservation)
    if (!reserva) return

    const isConfirmed = await showConfirm(
      '¿Eliminar reserva?',
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    setLoadingState((prev) => ({ ...prev, deleting: true }))
    showLoading('Eliminando reserva...')

    try {
      await deleteReservation(
        reserva.idInstrument,
        reserva.idUser,
        reserva.idReservation
      )
      showSuccess('✅ Reserva eliminada correctamente')
      await getAllReservations()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setLoadingState((prev) => ({ ...prev, deleting: false }))
    }
  }

  const handleExpandClick = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  if (loadingState.initial) {
    return (
      <Loader
        title="Cargando tus reservas..."
        fullSize={true}
        overlayColor="rgba(255, 255, 255, 0.8)"
        progressColor="var(--color-primario)"
      />
    )
  }

  return (
    <Box
      sx={{
        mt: { xs: 20, sm: 12, md: 40 },
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        margin: 2,
        boxShadow: 'var(--box-shadow)',
        opacity: loadingState.deleting ? 0.7 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: 'var(--color-primario)',
          backgroundColor: '#fff',
          borderRadius: 2,
          px: 3,
          py: 1,
          display: 'inline-block',
          mx: 'auto',
          width: 'fit-content',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        🎸 Mis Reservas
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {reservas.map((reserva) => {
          const start = new Date(reserva.startDate)
          const end = new Date(reserva.endDate)
          const diffTime = Math.abs(end - start)
          const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          return (
            <Grid item key={reserva.idReservation} xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  maxWidth: { xs: 180, sm: 200, md: 220, lg: 230, xl: 250 },
                  borderRadius: 4,
                  boxShadow: 'var(--box-shadow)',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'background.paper',
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Imagen + Botón delete */}
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <CustomTooltip
                    title={
                      <Typography sx={{ fontFamily: 'Roboto', fontSize: 10 }}>
                        <strong>✅ Más info</strong>
                      </Typography>
                    }
                    arrow
                  >
                    <Link
                      to={`/instrument/${reserva.idInstrument}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ImageWithLoader
                        src={
                          reserva.imageUrl || '/images/default-placeholder.png'
                        }
                        variant="circular"
                        width={{ xs: 100, sm: 120, md: 140, lg: 160, xl: 180 }}
                        height={{ xs: 100, sm: 120, md: 140, lg: 160, xl: 180 }}
                      />
                    </Link>
                  </CustomTooltip>
                  <IconButton
                    onClick={() => handleDelete(reserva.idReservation)}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#fff',
                      '&:hover': { backgroundColor: '#ffe5e5' },
                      boxShadow: 2
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Box>

                {/* Expandir */}
                <Button
                  size="small"
                  onClick={() => handleExpandClick(reserva.idReservation)}
                  endIcon={
                    expandedId === reserva.idReservation ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )
                  }
                  sx={{ fontSize: '0.7rem', mt: 1 }}
                >
                  {expandedId === reserva.idReservation
                    ? 'Ocultar detalles'
                    : 'Ver detalles'}
                </Button>

                {/* Contenido expandible */}
                <Collapse
                  in={expandedId === reserva.idReservation}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        mb: 1,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {reserva.instrumentName}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, mb: 0.5 }}
                    >
                      <strong>Inicio:</strong> {reserva.startDate}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, mb: 0.5 }}
                    >
                      <strong>Fin:</strong> {reserva.endDate}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, mb: 0.5 }}
                    >
                      <strong>Días:</strong> {rentalDays} días
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        color: '#d32f2f',
                        fontSize: { xs: '0.7rem', sm: '0.9rem' },
                        mt: 1
                      }}
                    >
                      Total: ${reserva.totalPrice}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Sin reservas */}
      {reservas.length === 0 && !loadingState.initial && (
        <Typography mt={6} textAlign="center" sx={{ color: '#757575' }}>
          No tienes reservas activas.
        </Typography>
      )}
    </Box>
  )
}

export default MisReservas

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Button,
  Collapse,
  CircularProgress,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { cancelReservation, getReservationById } from '@/api/reservations'
import { getErrorMessage } from '@/api/getErrorMessage'

import { Loader } from '@/components/common/loader/Loader'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { CustomTooltip } from '@/components/common/customTooltip/CustomTooltip'
import { Link } from 'react-router-dom'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'
import {
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { slugify } from '@/components/utils/slugify'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'

const MisReservas = () => {
  const [loadingState, setLoadingState] = useState({
    initial: true,
    deleting: false
  })
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 2
  const { idUser } = useAuth()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()

  const getAllReservations = useCallback(
    async (pageToLoad = 0) => {
      setLoadingState((prev) => ({
        ...prev,
        [pageToLoad === 0 ? 'initial' : 'more']: true
      }))

      try {
        const response = await getReservationById(idUser, pageToLoad, pageSize)
        const data = response?.result

        dispatch({
          type: actions.UPDATE_RESERVATION,
          payload:
            pageToLoad === 0
              ? data
              : {
                  ...data,
                  content: [...(state.reservas?.content || []), ...data.content]
                }
        })

        setHasMore(!data.last)
      } catch (error) {
        showError(`❌${getErrorMessage(error)}`)
      } finally {
        setLoadingState((prev) => ({
          ...prev,
          [pageToLoad === 0 ? 'initial' : 'more']: false
        }))
      }
    },
    [dispatch, idUser, showError, state.reservas]
  )

  useEffect(() => {
    getAllReservations(0)
  }, [idUser])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    getAllReservations(nextPage)
  }

  const handleCancel = async (reserva) => {
    const isConfirmed = await showConfirm(
      '¿Cancelar reserva?',
      'Recuerda que solo puedes cancelar la reserva dentro de las 24 horas previas al inicio. Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    setLoadingState((prev) => ({ ...prev, cancelling: true }))
    showLoading('Cancelando reserva...')

    try {
      await cancelReservation(
        reserva.idInstrument,
        reserva.idUser,
        reserva.idReservation
      )
      showSuccess('✅ Reserva cancelada correctamente')
      await getAllReservations()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setLoadingState((prev) => ({ ...prev, cancelling: false }))
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
        mt: { xs: 25, sm: 22, md: 40 },
        p: 2,
        borderRadius: 4,
        margin: 1,
        opacity: loadingState.deleting ? 0.7 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <TitleResponsive
        sx={{
          color: 'var(--color-primario)',
          px: 3,
          py: 1,
          display: 'inline-block',
          mx: 'auto'
        }}
      >
        🎸 Mis Reservas
      </TitleResponsive>

      <Grid container spacing={2} justifyContent="center">
        {(state.reservas?.content || []).map((reserva) => {
          const start = new Date(reserva.startDate)
          const end = new Date(reserva.endDate)
          const diffTime = Math.abs(end - start)
          const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          const slug = slugify(reserva.instrumentName)

          return (
            <Grid item key={reserva.idReservation} xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  maxWidth: { xs: 180, sm: 200, md: 220, lg: 230, xl: 250 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Imagen + Botón delete */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 1
                  }}
                >
                  <CustomTooltip
                    title={
                      <Typography sx={{ fontSize: 20 }}>
                        <strong>✅Más info</strong>
                      </Typography>
                    }
                     placement="top"
                    
                  >
                    <Link
                      to={`/instrument/${reserva.idInstrument}/${slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ImageWithLoader
                        src={
                          reserva.imageUrl || '/images/default-placeholder.png'
                        }
                        variant="circular"
                        width={{ xs: 100, sm: 110, md: 120, lg: 130, xl: 140 }}
                        height={{ xs: 100, sm: 110, md: 120, lg: 130, xl: 140 }}
                      />
                    </Link>
                  </CustomTooltip>
                  {/* Mostrar leyenda si la reserva está cancelada */}
                  {reserva.cancelled && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 8,
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        fontSize: '1rem',
                        borderBottomLeftRadius: '4px',
                        zIndex: 1
                      }}
                    >
                      Reserva Cancelada
                    </Box>
                  )}

                  {/* Mostrar botón de cancelar solo si NO está cancelada */}
                  {!reserva.cancelled && (
                    <CustomTooltip
                     
                      title={
                        <Typography sx={{ fontSize: 13}}>
                          <strong>❗Cancelar reserva (solo hasta 24h antes del inicio)</strong>
                        </Typography>
                      }
                      placement="top"
                    >
                      <IconButton
                        onClick={() => handleCancel(reserva)}
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: { xs: 1, sm: -1, md: 1, lg: -1 },
                          left: { xs: 1, sm: -1, md: 1, lg: -1 },
                          '&:hover': { backgroundColor: '#ffe5e5' },
                          boxShadow: 2
                        }}
                      >
                        <CancelIcon
                          sx={{
                            fontSize: {
                              xs: 18,
                              sm: 20
                            }
                          }}
                        />
                      </IconButton>
                    </CustomTooltip>
                  )}
                </Box>

                {/* Expandir */}
                <Button
                  onClick={() => handleExpandClick(reserva.idReservation)}
                  endIcon={
                    expandedId === reserva.idReservation ? (
                      <ExpandLessIcon sx={{ color: 'var(--color-info)' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ color: 'var( --color-info)' }} />
                    )
                  }
                >
                  {expandedId === reserva.idReservation ? (
                    <ParagraphResponsive
                      sx={{ color: 'var( --color-primario-active)' }}
                    >
                      Ocultar detalles
                    </ParagraphResponsive>
                  ) : (
                    <ParagraphResponsive
                      sx={{ color: 'var( --color-primario-active)' }}
                    >
                      Ver detalles
                    </ParagraphResponsive>
                  )}
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
                        fontWeight: 300,
                        fontSize: { xs: '0.6rem', sm: '0.8rem' },
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
      {state.reservas?.content?.length === 0 && !loadingState.initial && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 8,
            mb: 10,
            minHeight: '30vh',
            borderRadius: 4,
            px: 4,
            py: 6,
            textAlign: 'center'
          }}
        >
          <TitleResponsive>🎷No tienes reservas activas🎻</TitleResponsive>
          <TitleResponsive>
            📯Aquí aparecerán las reservas cuando alquiles un instrumento 🎸
          </TitleResponsive>
        </Box>
      )}
      {hasMore && !loadingState.more && (
        <Box
          sx={{
            textAlign: 'center',
            mt: 2,
            position: 'relative',
            minHeight: 50
          }}
        >
          {!loadingState.more ? (
            <button
              onClick={handleLoadMore}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primario)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cargar más reservas
            </button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress
                size={24}
                sx={{ color: 'var(--color-primario)' }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default MisReservas

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'
import { useAuth } from '@/hook/useAuth'
import { getInstrumentById } from '@/api/instruments'

import {
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import {
  flexColumnContainer,
  flexRowContainer
} from '@/components/styles/styleglobal'
import FavoriteIcon from '@/components/common/favorito/FavoriteIcon'
import { Si } from '@/components/Images/Si'
import { No } from '@/components/Images/No'
import CalendarAdmin from '@/components/common/availability/CalendarAdmin'
import CalendarReserva from '@/components/common/availability/CalendarReseva'
import { InstrumentTerms } from '@/components/common/terms/InstrumentTerms'
import { ScreenModal } from '@/components/common/instrumentGallery/ScreenModal'
import { InstrumentGallery } from '@/components/common/instrumentGallery/InstrumentGallery'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'

export const Instrument = () => {
  const { id } = useParams()
  const { state } = useAppStates()
  const navigate = useNavigate()
  const [instrumentSelected, setInstrumentSelected] = useState({
    characteristics: {}
  })
  const [instrument, setInstrument] = useState()
  const [showGallery, setShowGallery] = useState(false)
  const { isUser, isUserAdmin } = useAuth()

  useEffect(() => {
    getInstrumentById(id)
      .then((instrument) => {
        setInstrument(instrument)
        !instrument?.result?.imageUrls?.length
      })
      .catch(() => {
        navigate('/noDisponible')
      })
  }, [id, navigate])
  useEffect(() => {
    if (!instrument?.result) return
    setInstrumentSelected(instrument.result)
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [instrument])
  const onClose = () => {
    setShowGallery(false)
  }

  return (
    <>
      <Box
        sx={{
          marginTop: { xs: 25, sm: 30, md: 35, lg: 40, xl: 45 },
          paddingX: 2,
          maxWidth: '1500px',
          marginX: 'auto'
        }}
      >
        <ArrowBack />
        {/*Contenedor de la imagen,de los datos y del iciono de favoritos */}
        <Box
          sx={{
            ...flexRowContainer,
            justifyContent: 'space-evenly'
          }}
        >
          {/* Datos del instrumento */}
          <Box
            sx={{
              ...flexColumnContainer,
              width: {
                xs: '98%',
                sm: '97%',
                md: '65%',
                lg: '65%',
                xl: '60%'
              }
            }}
          >
            {/* Descripción */}
            <ParagraphResponsive
              sx={{
                color: 'var( --texto-secundario)',
                width: '97%'
              }}
            >
              {instrumentSelected?.description}
            </ParagraphResponsive>

            <Divider sx={{ width: '100%', my: 2 }} />

            {/* Otras características */}
            {[
              { label: 'Medida', value: instrumentSelected?.measures },
              {
                label: 'Peso',
                value: instrumentSelected?.formattedWeight
              },
              {
                label: 'Tipo',
                value: instrumentSelected?.category?.categoryName
              },
              {
                label: 'Temática',
                value: instrumentSelected?.theme?.themeName
              }
            ].map(({ label, value }, index) => (
              <Typography
                key={index}
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontWeight: '300',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem'
                  },
                  color: 'var( --texto-secundario)',
                  padding: '0.3rem 0'
                }}
              >
                <strong>{label}:</strong> {value}
              </Typography>
            ))}
          </Box>
          {/* Fin Datos del instrumento */}

          {/*Comienzo Imagen del instrumento */}
          <Box
            sx={{
              overflow: 'hidden',
              minHeight: 480,
              width: {
                xs: '60%',
                sm: '65%',
                md: '31%',
                lg: '30%',
                xl: '32%'
              }
            }}
          >
            {/* Nombre del instrumento */}
            <TitleResponsive
              sx={{
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '3px'
              }}
            >
              {instrumentSelected?.name}
            </TitleResponsive>
            {/* Fin Nombre del instrumento */}

            <Tooltip
              title="Ver más imágenes"
              arrow
              placement="left"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'var(--color-primario)',
                    color: 'var(--texto-primario)',
                    fontWeight: 'bold',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    borderRadius: 2
                  }
                },
                arrow: {
                  sx: { color: 'var(--color-primario)' }
                }
              }}
            >
              <Button
                onClick={() => setShowGallery(true)}
                disableRipple
                disableElevation
              >
                <ImageWithLoader
                  src={instrumentSelected?.imageUrls?.[0]?.imageUrl || null} // Asegura que sea null si no existe
                  alt={instrumentSelected?.name || 'Imagen del instrumento'}
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  borderRadius="0.5rem"
                  placeholderComponent={
                    <Typography variant="body2">Sin imagen</Typography>
                  }
                />
              </Button>
            </Tooltip>

            {/* 📌 Icono de favorito si el usuario está autenticado */}
            {isUser && (
              <Box>
                <FavoriteIcon />
              </Box>
            )}
            {/* 📌 Fin  Icono de favorito si el usuario está autenticado */}
          </Box>
          {/*Fin imagen de instrumento */}
        </Box>
        {/* Fin Contenedor de la imagen,de los datos y del iciono de favoritos */}

        {/*Aqui comienzan las caracteristicas*/}
        <Box>
          <TitleResponsive
            sx={{
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: 'var(--texto-secundario)'
            }}
          >
            Características
          </TitleResponsive>

          <Box
            sx={{
              width: '99vw',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            {state?.characteristics?.map((characteristic) => {
              const hasCharacteristic =
                instrumentSelected?.characteristics[characteristic.id] === 'si'

              return (
                <Tooltip
                  key={characteristic.id}
                  title={characteristic.name}
                  arrow
                  placement="top"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'var(--color-primario)',
                        color: 'var(--texto-primario)',
                        fontWeight: 'bold',
                        px: 2,
                        py: 1,
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        boxShadow: 'var(--box-shadow)'
                      }
                    },
                    arrow: {
                      sx: { color: 'var(--color-primario)' }
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      margin: 1,
                      width: {
                        xs: '65px',
                        sm: '71px',
                        md: '72px',
                        lg: '73px',
                        xl: '74px'
                      },

                      backgroundColor: 'var(--color-primario)',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={characteristic.image}
                      alt={characteristic.name}
                    />

                    {/* Ícono en esquina inferior derecha */}
                    <Box
                      sx={{
                        position: 'absolute',
                        margin: 1,
                        right: 29,
                        top: -2
                      }}
                    >
                      {hasCharacteristic ? (
                        <Si color="var(--color-info)" />
                      ) : (
                        <No color="var(--color-error)" />
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>
        </Box>
        {/*Fin de las caracteristicas */}
        <Divider
          sx={{
            width: '100%',
            mb: 2,
            borderColor: 'var( --texto-secundario)'
          }}
        />
        {/*Inicio del calendario ADMIN*/}
        {isUserAdmin && (
          <Box
            sx={{
              width: {
                xs: '100%',
                sm: '69%',
                md: '70%',
                lg: '72%',
                xl: '75%'
              }
            }}
          >
            {/* 📌 Título del calendario */}
            <TitleResponsive
              sx={{
                textTransform: 'uppercase',
                color: 'var( --texto-secundario)'
              }}
            >
              📅 Calendario para agregar Disponibilidad
            </TitleResponsive>
            <Divider sx={{ width: '100%' }} />

            {/* 📌 Contenedor del Calendario */}
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: '69%',
                  md: '70%',
                  lg: '72%',
                  xl: '75%'
                }
              }}
            >
              <CalendarAdmin instrument={instrument} />
            </Box>
          </Box>
        )}
        {/*Fin del calendario ADMIN*/}

        {/* 📌 Sección para el usuario */}

        {/* 📌 Contenedor del Calendario */}
        {isUser && (
          <>
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: '69%',
                  md: '70%',
                  lg: '72%',
                  xl: '75%'
                }
              }}
            >
              {/* 🔹 Precio por día */}
              <TitleResponsive sx={{ color: 'var(--texto-secundario)' }}>
                Valor por día de alquiler:{' '}
                <Typography
                  component="span"
                  sx={{
                    color: 'var(--color-info)',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    backgroundColor: 'rgba(251, 193, 45, 0.75)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    letterSpacing: '0.5px'
                  }}
                >
                  $ {instrumentSelected?.rentalPrice}
                </Typography>
              </TitleResponsive>
              {/* 🔹Fin  Precio por día */}

              <Divider sx={{ width: '100%' }} />

              <CalendarReserva instrument={instrument} />
            </Box>
            {/* 📌 Fin Contenedor del Calendario */}

            {/* 📌 Términos del Instrumento */}
            <Box
              sx={{
                width: '100%',
                height: '100%'
              }}
            >
              <Divider sx={{ width: '100%' }} />
              <InstrumentTerms />
            </Box>
          </>
        )}
        <ScreenModal isOpen={showGallery} onClose={onClose}>
          <InstrumentGallery itemData={instrumentSelected?.imageUrls} />
        </ScreenModal>
      </Box>
    </>
  )
}

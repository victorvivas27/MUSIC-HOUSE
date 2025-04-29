import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'
import { useAuth } from '@/hook/useAuth'
import { getInstrumentById } from '@/api/instruments'

import {
  InstrumentDetailWrapper,
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
      <InstrumentDetailWrapper>
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
                color: 'var(--color-oscuro-suave)',
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
                  color: 'var(--color-suave)',
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
              width: {
                xs: '60%',
                sm: '65%',
                md: '31%',
                lg: '30%',
                xl: '25%'
              },

              boxShadow: 'var(--box-shadow)',
              borderRadius: 3
            }}
          >
            {/* Nombre del instrumento */}
            <TitleResponsive
              sx={{
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                padding: 1
              }}
            >
              {instrumentSelected?.name}
            </TitleResponsive>
            {/* Fin Nombre del instrumento */}

            <Tooltip title="Ver más imágenes">
              <Button
                onClick={() => setShowGallery(true)}
                disableRipple
                disableElevation
              >
                <ImageWithLoader
                  src={instrumentSelected?.imageUrls?.[0]?.imageUrl}
                  alt={instrumentSelected?.name}
                  variant="rectangular"
                  width="100%"
                  height="auto"
                  borderRadius="0.5rem"
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
        <Box
          sx={{
            width: {
              sm: '87%',
              md: '88%',
              lg: '89%',
              xl: '90%'
            },

            margin: 1
          }}
        >
          <Divider sx={{ width: '100%' }} />
          <TitleResponsive
            sx={{
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Características
          </TitleResponsive>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            {state?.characteristics?.map((characteristic) => {
              return (
                <Box
                  key={characteristic.id}
                  sx={{
                    ...flexRowContainer
                  }}
                >
                  <Tooltip title={characteristic.name}>
                    <Box
                      component="img"
                      src={characteristic.image}
                      sx={{
                        width: {
                          xs: '30%',
                          sm: '32%',
                          md: '35%',
                          lg: '38%',
                          xl: '40%'
                        },
                        backgroundColor: 'var(--color-primario)',
                        borderRadius: 4,
                        margin: 1
                      }}
                    />
                  </Tooltip>

                  {instrumentSelected?.characteristics[characteristic.id] ===
                  'si' ? (
                    <Si size={16} color="var(--color-azul)" />
                  ) : (
                    <No size={15} color="var(--color-error)" />
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
        {/*Fin de las caracteristicas */}

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
                textTransform: 'uppercase'
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
              <TitleResponsive>
                Valor por día de alquiler:{' '}
                <TitleResponsive
                  sx={{
                    color: 'var(--color-azul)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(100, 181, 246, 0.1)', 
                    padding: '2px 6px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    letterSpacing: '0.5px'
                  }}
                >
                  $ {instrumentSelected?.rentalPrice}
                </TitleResponsive>
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
      </InstrumentDetailWrapper>
    </>
  )
}

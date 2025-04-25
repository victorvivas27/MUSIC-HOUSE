import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Grid,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { deleteReservation, getReservationById } from '@/api/reservations'
import { getErrorMessage } from '@/api/getErrorMessage'
import TooltipMy from '@/components/common/toolTip/ToolTipMy'
import { Loader } from '@/components/common/loader/Loader'



const MisReservas = () => {
 
  const [reservas, setReservas] = useState([]);
  const [loadingState, setLoadingState] = useState({
    initial: true,
    deleting: false
  });
  const { idUser } = useAuth();
  const { showConfirm, showLoading, showSuccess, showError } = useAlert();

  // Función de carga con manejo de estado mejorado
  const getAllReservations = useCallback(async () => {
    setLoadingState(prev => ({ ...prev, initial: true }));
    try {
      const response = await getReservationById(idUser);
      setReservas(response.result || []);
    } catch (error) {
      setReservas([]);
      showError(`Error al cargar reservas: ${getErrorMessage(error)}`);
    } finally {
      setLoadingState(prev => ({ ...prev, initial: false }));
    }
  }, [idUser, showError]);

  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);


  const handleDelete = async (idReservation) => {
    const reserva = reservas.find(r => r.idReservation === idReservation);
    if (!reserva) return;

    const isConfirmed = await showConfirm(
      '¿Eliminar reserva?',
      'Esta acción no se puede deshacer.'
    );
    if (!isConfirmed) return;

    setLoadingState(prev => ({ ...prev, deleting: true }));
    showLoading('Eliminando reserva...');
    
    try {
      await deleteReservation(
        reserva.idInstrument,
        reserva.idUser,
        reserva.idReservation
      );
      showSuccess('✅ Reserva eliminada correctamente');
      await getAllReservations();
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`);
    } finally {
      setLoadingState(prev => ({ ...prev, deleting: false }));
    }
  };

 
  if (loadingState.initial) {
    return (
      <Loader 
        title="Cargando tus reservas..." 
        fullSize={true}
        overlayColor="rgba(255, 255, 255, 0.8)"
        progressColor="var(--color-primario)"
      />
    );
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          borderRadius: 2,
          px: 3,
          py: 1,
          display: 'inline-block',
          mx: 'auto',
          width: 'fit-content',
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.5rem'
          }
        }}
      >
        🎸 Mis Reservas
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {reservas.map((reserva) => (
          <Grid item key={reserva.idReservation} xs={6} sm={4} md={3} lg={2}>
            <Card
              sx={{
                maxWidth: '100%',
                mx: 'auto',
                boxShadow: 'var(--box-shadow)',
                borderRadius: 4,
                transition: 'transform 0.3s',
                height: '95%',
                '&:hover': {
                  transform: loadingState.deleting ? 'none' : 'scale(1.05)'
                },
                position: 'relative'
              }}
            >
              {/* Overlay durante eliminación */}
              {loadingState.deleting && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <CircularProgress size={24} color="primary" />
                </Box>
              )}

              <CardMedia
                component="img"
                image={reserva.imageUrl || '/images/default-placeholder.png'}
                alt={reserva.instrumentName}
                sx={{
                  padding: 1,
                  objectFit: 'contain',
                  borderRadius: '4px 4px 0 0'
                }}
              />
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                    {reserva.instrumentName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Inicio:</strong> {reserva.startDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fin:</strong> {reserva.endDate}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#d32f2f' }}>
                    Total: ${reserva.totalPrice}
                  </Typography>
                </Stack>
               
                <TooltipMy
                  message="¿Seguro que deseas quitar esto de tus reservas?"
                  backgroundColor="var(--color-primario)"
                  textColor="var(--color-error)"
                  fontSize="0.9rem"
                  width="300px"
                >
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(reserva.idReservation)}
                    disabled={loadingState.deleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TooltipMy>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {reservas.length === 0 && !loadingState.initial && (
        <Typography mt={6} textAlign="center" sx={{ color: '#757575' }}>
          No tienes reservas activas.
        </Typography>
      )}
    </Box>
  );
};

export default MisReservas;

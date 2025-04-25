import { useEffect, useState } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'
import { useAuth } from '@/hook/useAuth'
import {  getFavoritesByUserId } from '@/api/favorites'
import { actions } from '@/components/utils/actions'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper, ProductsWrapper } from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import ProductCard from '@/components/common/instrumentGallery/ProductCard'


export const Favorites = () => {
  const [loadingState, setLoadingState] = useState({
    initial: true,
    more: false
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 3;
  const { state, dispatch } = useAppStates();
  const { favorites } = state;
  const { idUser } = useAuth();

  const fetchFavorites = async (pageToLoad = 0) => {
    setLoadingState(prev => ({
      ...prev,
      [pageToLoad === 0 ? 'initial' : 'more']: true
    }));
    
    try {
      const response = await getFavoritesByUserId(idUser, pageToLoad, pageSize);
      const data = response?.result;

      dispatch({
        type: actions.UPDATE_FAVORITES,
        payload: pageToLoad === 0
          ? data.content
          : [...favorites, ...data.content]
      });

      setHasMore(!data.last);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoadingState(prev => ({
        ...prev,
        [pageToLoad === 0 ? 'initial' : 'more']: false
      }));
    }
  };

  useEffect(() => {
    fetchFavorites(0);
  }, [idUser]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFavorites(nextPage);
  };

  if (loadingState.initial) {
    return (
      <Loader 
        title="Cargando tus favoritos..." 
        fullSize={true}
        overlayColor="rgba(255, 255, 255, 0.8)"
        progressColor="var(--color-primario)"
      />
    );
  }

  return (
    <MainWrapper
      sx={{
        padding: { xs: '2rem 1rem', sm: '2rem' },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      <ArrowBack />

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ color: 'var(--color-primario)', marginBottom: 1 }}
        >
          🎵 Tus Favoritos
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Aquí puedes ver los instrumentos que marcaste como favoritos.
        </Typography>
      </Box>

      <ProductsWrapper
        sx={{
          opacity: loadingState.initial ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <ProductCard
              key={`favorite-card-${index}`}
              name={favorite.instrument.name}
              imageUrl={favorite.instrument.imageUrl}
              id={favorite.instrument.idInstrument}
              isFavorite={true}
            />
          ))
        ) : (
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              marginTop: 4,
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            No se han encontrado favoritos. ¡Explora instrumentos y agrega algunos! 🎸🎺
          </Typography>
        )}
      </ProductsWrapper>

      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2, position: 'relative', minHeight: 50 }}>
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
              Cargar más favoritos
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
    </MainWrapper>
  );
};

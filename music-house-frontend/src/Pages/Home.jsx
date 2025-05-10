import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAppStates } from '@/components/utils/global.context'
import { getInstruments } from '@/api/instruments'
import { actions } from '@/components/utils/actions'
import { getTheme } from '@/api/theme'
import { Loader } from '@/components/common/loader/Loader'
import {
  MainWrapper,
  ProductsWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import AutoScrollCarousel from '@/components/common/autoScrollCarousel/AutoScrollCarousel'
import ProductCard from '@/components/common/instrumentGallery/ProductCard'
import { getErrorMessage } from '@/api/getErrorMessage'
import useAlert from '@/hook/useAlert'
import SmartLoader from '@/components/common/smartLoader/SmartLoader'
import Feedback from './Feedback'
import ModalFeedback from '@/components/common/feedback/ModalFeedback'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '@/components/utils/context/AuthContext'

export const Home = () => {
  const { state, dispatch } = useAppStates()
  const { showError } = useAlert()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(5)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [open, setOpen] = useState(false)
  const [hasClosedModal, setHasClosedModal] = useState(false)
  const [hasSentFeedback, setHasSentFeedback] = useState(
    localStorage.getItem('hasSentFeedback') === 'true'
  )
    const { isUser, isUserAdmin, authGlobal } = useContext(AuthContext);

  const isPublic = !authGlobal && !isUser && !isUserAdmin;
  const delayTimeoutRef = useRef(null)
  const observer = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          state.instruments?.content?.length < state.instruments?.totalElements
        ) {
          setPage((prev) => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isFetchingMore, state.instruments]
  )

  useEffect(() => {
    const fetchData = async () => {
      if (page > 0) setIsFetchingMore(true)

      try {
        const instrumentsRes = await getInstruments(page, pageSize)
        const newInstruments = instrumentsRes.result

        dispatch({
          type:
            page === 0 ? actions.SET_INSTRUMENTS : actions.APPEND_INSTRUMENTS,
          payload: newInstruments
        })

        if (page === 0) {
          const themesRes = await getTheme()
          dispatch({ type: actions.SET_THEMES, payload: themesRes.result })
        }
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        setIsFetchingMore(false)
      }
    }

    fetchData()
  }, [dispatch, page, pageSize, showError])

  const instruments = state.instruments?.content || []

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50

      if (
        reachedBottom &&
        !open &&
        !hasClosedModal &&
        !hasSentFeedback &&
        !delayTimeoutRef.current
      ) {
        delayTimeoutRef.current = setTimeout(() => {
          setOpen(true)
          delayTimeoutRef.current = null
        }, 2000)
      }

      // si sube antes del tiempo, cancelamos el delay
      if (!reachedBottom && delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current)
        delayTimeoutRef.current = null
      }

      // si sube al top, reseteamos
      if (window.scrollY < 50 && hasClosedModal) {
        setHasClosedModal(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current)
    }
  }, [open, hasClosedModal])

 

  const handleCloseModal = (hasSubmitted = false) => {
    setOpen(false)
    if (hasSubmitted) {
      setHasSentFeedback(true)
      localStorage.setItem('hasSentFeedback', 'true')
    } else {
      setHasClosedModal(true)
    }
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current)
  }

  const location = useLocation()

useEffect(() => {
  if (location.hash) {
    const element = document.querySelector(location.hash)
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }
}, [location.hash])

  return (
    <>
      {page === 0 && (
        <SmartLoader title="Un momento por favor" storageKey="hasVisitedHome" />
      )}

      <MainWrapper>
        <AutoScrollCarousel themes={state.themes?.content || []} />
      </MainWrapper>

      <ProductsWrapper>
        {instruments.length > 0 ? (
          instruments.map((instrument, index) => (
            <ProductCard
              key={`product-card-${index}`}
              name={instrument.name}
              imageUrl={
                instrument.imageUrls?.length > 0
                  ? instrument.imageUrls[0].imageUrl
                  : '/src/assets/instrumento_general_03.jpg'
              }
              id={instrument.idInstrument}
              rentalPrice={instrument.rentalPrice}
            />
          ))
        ) : (
          <TitleResponsive>No se han encontrado instrumentos</TitleResponsive>
        )}

        {/* Observador para scroll infinito */}
        <div ref={lastElementRef} style={{ height: '1px' }} />

        {isFetchingMore && page > 0 && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <Loader
              title="Cargando más instrumentos..."
              fullSize={false}
              overlayColor="transparent"
              blur="0"
            />
          </div>
        )}
      </ProductsWrapper>

      {isPublic && <Feedback />}

      {isUser && (
        <ModalFeedback
          open={open}
          onClose={() => handleCloseModal(false)}
          onSubmitSuccess={() => handleCloseModal(true)}
        />
      )}
    </>
  )
}

import { deleteReservation, getReservations } from '@/api/reservations'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { useEffect, useState } from 'react'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  handleSelectAll,
  handleSelected,
  handleSort,
  isSelected
} from './common/tableHelper'
import {
  headCellsReservation,
  headCellsTheme
} from '@/components/utils/types/HeadCells'
import { getErrorMessage } from '@/api/getErrorMessage'

import {
  MainWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import {
  flexRowContainer,
  paginationStyles
} from '@/components/styles/styleglobal'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { usePaginationControl } from '@/hook/usePaginationControl'
import { Loader } from '@/components/common/loader/Loader'

const Reservationes = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState("instrumentName")
  const [selected, setSelected] = useState([])
  const [firstLoad, setFirstLoad] = useState(true)
  //const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()
  const [loading, setLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState(0)
  const {
    page,
    safePage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage
  } = usePaginationControl(state.reservas.totalElements)

  const getAllReservation = async (
    
    pageToUse = page,
    sizeToUse = rowsPerPage,
    isFirst = false
  ) => {
    if (isFirst) setLoading(true)
    const sort = `${orderBy},${order}`

    try {
      const data = await getReservations(pageToUse, sizeToUse, sort)
      dispatch({ type: actions.UPDATE_RESERVATION, payload: data.result })
    } catch {
      dispatch({
        type: actions.UPDATE_RESERVATION,
        payload: { content: [], totalElements: 0 }
      })
    } finally {
      setTimeout(() => {
        if (isFirst) setFirstLoad(false)
        setLoading(false)
      }, 100)
    }
  }
  const rows = Array.isArray(state.reservas.content)
    ? state.reservas.content
    : []

  useEffect(() => {
    getAllReservation(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, order, orderBy])

  //const handleAdd = () => navigate('/agregarTheme')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idReservation', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    const column = headCellsTheme.find((col) => col.id === property)
    if (column?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  //const handleEdit = (id) => navigate(`/editarTheme/${id}`)

  const handleConfirmDelete = async (idReservation = null) => {
    const selectedIds = idReservation ? [idReservation] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay reservas seleccionadas para eliminar.')
      return
    }

    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} reserva(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')

    try {
      const reservasToDelete = state.reservas.content.filter((reserva) =>
        selectedIds.includes(reserva.idReservation)
      )

      await Promise.all(
        reservasToDelete.map((reserva) =>
          deleteReservation(
            reserva.idInstrument,
            reserva.idUser,
            reserva.idReservation
          )
        )
      )

      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} reserva(s) eliminada(s) correctamente.`
      )
      setSelected([])
      getAllReservation(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }
 

  return (
    <>
      {(loading || loadedImages < rows.length) && page === 0 && (
        <Loader title="Cargando reservas" fullSize={true} />
      )}
      <MainWrapper>
        <Paper
          sx={{
            width: '90%',
            display: { xs: 'none', lg: 'initial' },
            margin: 10,
            borderRadius: 4,
            boxShadow: 'var(--box-shadow)',
            backgroundColor: 'var(--background-claro)'
          }}
        >
          <ArrowBack />

          <EnhancedTableToolbar
            title="Reservas Usuario"
            titleAdd="Agregar reserva"
            //handleAdd={handleAdd}
            numSelected={selected.length}
            handleConfirmDelete={() => handleConfirmDelete()}
          />

          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                headCells={headCellsReservation}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                disableSelectAll
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.idReservation, selected)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const isRowEven = index % 2 === 0

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.idReservation}
                      selected={isItemSelected}
                      className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleClick(event, row.idReservation)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell align="left" sx={{ ...flexRowContainer }}>
                        <ImageWithLoader
                          src={
                            row.imageUrl ||
                            '/src/assets/instrumento_general_03.jpg'
                          }
                          variant="circular"
                          width={80}
                          height={80}
                          onLoad={() => setLoadedImages((prev) => prev + 1)}
                          onError={() => setLoadedImages((prev) => prev + 1)}
                        />
                      </TableCell>

                      <TableCell align="left">{row.instrumentName}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.city}</TableCell>
                      <TableCell align="left">{row.country}</TableCell>
                      <TableCell align="left">{row.startDate}</TableCell>
                      <TableCell align="left">{row.endDate}</TableCell>
                      <TableCell align="left">${row.totalPrice}</TableCell>
                      <TableCell align="left">{row.registDate}</TableCell>
                      <TableCell align="left">{row.modifiedDate}</TableCell>
                      <TableCell align="left">
                        <Box
                          style={{
                            opacity: selected.length > 0 ? 0 : 1,
                            pointerEvents:
                              selected.length > 0 ? 'none' : 'auto',
                            transition: 'opacity 0.5s ease-in-out',
                            ...flexRowContainer
                          }}
                        >
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={(event) => {
                                //handleEdit(row.idTheme)
                                event.stopPropagation()
                              }}
                            >
                              <EditIcon sx={{ color: 'var(--color-info)' }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={(event) => {
                                handleConfirmDelete(row.idReservation)
                                event.stopPropagation()
                              }}
                            >
                              <DeleteIcon
                                sx={{ color: 'var(--color-error)' }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <TitleResponsive>No hay reservas</TitleResponsive>
                    </TableCell>
                  </TableRow>
                )}
                {Array.from({
                  length: Math.max(0, rowsPerPage - rows.length)
                }).map((_, i) => (
                  <TableRow key={`empty-${i}`} style={{ height: 80 }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={state.reservas.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={safePage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            sx={{
              ...paginationStyles
            }}
          />
        </Paper>
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            height: '100vh'
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            textAlign="center"
            sx={{ paddingTop: 30, fontWeight: 'bold' }}
          >
            Funcionalidad no disponible en esta resolución
          </Typography>
        </Box>
      </MainWrapper>
    </>
  )
}

export default Reservationes

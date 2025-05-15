import { deleteFaq, getAllFaqA } from '@/api/faq'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import {
  MainWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { usePaginationControl } from '@/hook/usePaginationControl'

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
  Tooltip
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  handleSelectAll,
  handleSelected,
  handleSort,
  isSelected
} from './common/tableHelper'
import {
  flexRowContainer,
  paginationStyles
} from '@/components/styles/styleglobal'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { headCellsFaq } from '@/components/utils/types/HeadCells'
import ArrowBack from '@/components/utils/ArrowBack'

export const FaqAdmin = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('registDate')
  const [selected, setSelected] = useState([])
  const [firstLoad, setFirstLoad] = useState(true)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useAppStates()
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    safePage
  } = usePaginationControl(state.faq.totalElements)

  const fetchData = async (
    pageToUse = page,
    sizeToUse = rowsPerPage,
    isFirst = false
  ) => {
    if (isFirst) setLoading(true)
    const sort = `${orderBy},${order}`

    try {
      const data = await getAllFaqA(pageToUse, sizeToUse, sort)
      dispatch({ type: actions.SET_FAQ, payload: data.result })
    } catch {
      dispatch({
        type: actions.SET_FAQ,
        payload: { content: [], totalElements: 0 }
      })
    } finally {
      setTimeout(() => {
        if (isFirst) setFirstLoad(false)
        setLoading(false)
      }, 100)
    }
  }
  const rows = Array.isArray(state.faq.content) ? state.faq.content : []

  useEffect(() => {
    fetchData(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, order, orderBy])

  //const handleAdd = () => navigate('/modificar-pregunta')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idFeedback', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    const column = headCellsFaq.find((col) => col.id === property)
    if (column?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => navigate(`/editarPregunta/${id}`)

  const handleConfirmDelete = async (idFaq = null) => {
    const selectedIds = idFaq ? [idFaq] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay pregunta seleccionadas para eliminar.')
      return
    }

    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} preguntas(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')

    try {
      await Promise.all(selectedIds.map((id) => deleteFaq(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} pregunta eliminada(s) correctamente.`
      )
      setSelected([])
      await fetchData(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  return (
    <>
      {loading && (
        <Loader title="Cargando preguntas frecuentes" fullSize={true} />
      )}
      <MainWrapper>
        <Paper
          sx={{
            width: '90%',
            margin: 10,
            display: { xs: 'none', lg: 'initial' },
            borderRadius: 4,
            boxShadow: 'var(--box-shadow)',
            backgroundColor: 'var(--background-claro)'
          }}
        >
          <ArrowBack />

          <EnhancedTableToolbar
            title="Preguntas"
            //titleAdd="Agregar categoría"
            //handleAdd={handleAdd}
            numSelected={selected.length}
            handleConfirmDelete={() => handleConfirmDelete()}
          />
          {/* <SearchNameCategory />*/}
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                headCells={headCellsFaq}
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
                  const isItemSelected = isSelected(row.idFaq, selected)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const isRowEven = index % 2 === 0

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.idFaq}
                      selected={isItemSelected}
                      className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleClick(event, row.idFaq)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell align="left">{row.question}</TableCell>

                      <TableCell align="left">{row.answer}</TableCell>

                      <TableCell align="center">
                        <Checkbox
                          checked={row.active}
                          readOnly
                          disableRipple
                          size="medium"
                          sx={{
                            color: row.active
                              ? 'var(--color-exito)'
                              : 'var(--color-secundario)',
                            '&.Mui-checked': {
                              color: 'var(--color-exito)'
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: 22,
                              borderRadius: '6px'
                            }
                          }}
                        />
                      </TableCell>

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
                                handleEdit(row.idFaq)
                                event.stopPropagation()
                              }}
                            >
                              <EditIcon sx={{ color: 'var(--color-info)' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={(event) => {
                                handleConfirmDelete(row.idFaq)
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
                      <TitleResponsive>
                        No hay preguntas registradas aún.
                      </TitleResponsive>
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
            count={state.faq.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={safePage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            sx={{ ...paginationStyles }}
          />
        </Paper>

        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            bgcolor: 'var(--color-secundario)',
            color: 'var(--texto-inverso)',
            textAlign: 'center',
            px: 4
          }}
        >
          <WarningAmberRoundedIcon
            sx={{ fontSize: 64, mb: 2, color: 'var(--color-primario)' }}
          />
          <TitleResponsive>
            Funcionalidad no disponible en esta resolución
          </TitleResponsive>
          <Box
            component="p"
            sx={{ mt: 1, fontSize: '1rem', color: 'var(--texto-inverso)' }}
          >
            Por favor, utiliza un dispositivo con pantalla más grande.
          </Box>
        </Box>
      </MainWrapper>
    </>
  )
}

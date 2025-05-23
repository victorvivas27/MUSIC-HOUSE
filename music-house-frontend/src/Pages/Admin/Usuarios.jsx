import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { UsersApi } from '@/api/users'
import useAlert from '@/hook/useAlert'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  handleSelectAll,
  handleSelected,
  handleSort,
  isSelected
} from './common/tableHelper'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import ArrowBack from '@/components/utils/ArrowBack'
import { headCellsUser } from '@/components/utils/types/HeadCells'
import {
  flexRowContainer,
  paginationStyles
} from '@/components/styles/styleglobal'
import {
  MainWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import SearchNameUser from '@/components/common/search/SearchNameUser'
import ImageWithLoader from '@/components/common/imageWithLoader/ImageWithLoader'

export const Usuarios = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [firstLoad, setFirstLoad] = useState(true)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()
  const [loadedImages, setLoadedImages] = useState(0)
  const [loading, setLoading] = useState(true)

  const getAllUsuarios = useCallback(
    async (pageToUse = page, sizeToUse = rowsPerPage, isFirst = false) => {
      if (isFirst) setLoading(true)
      const sort = `${orderBy},${order}`

      try {
        const data = await UsersApi.getUsers(pageToUse, sizeToUse, sort)
        dispatch({ type: actions.SET_USERS, payload: data.result })
      } catch {
        dispatch({
          type: actions.SET_USERS,
          payload: { content: [], totalElements: 0 }
        })
      } finally {
        setTimeout(() => {
          if (isFirst) setFirstLoad(false)
          setLoading(false)
        }, 100)
      }
    },
    [dispatch, order, orderBy, page, rowsPerPage]
  )
  const rows = Array.isArray(state.users?.content) ? state.users.content : []

  useEffect(() => {
    getAllUsuarios(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, order, orderBy, getAllUsuarios, firstLoad])

  const handleAdd = () => navigate('/agregarUsuario')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idUser', setSelected)
  }
  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }
  const handleRequestSort = (event, property) => {
    const column = headCellsUser.find((col) => col.id === property)

    if (column?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (idUser) => navigate(`/editarUsuario/${idUser}`)

  const handleDelete = async (idUser = null) => {
    const selectedIds = idUser ? [idUser] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay usuario seleccionados para eliminar.')
      return
    }
    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} usuario(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return
    showLoading('Eliminando...', 'Por favor espera.')
    try {
      await Promise.all(selectedIds.map((id) => UsersApi.deleteUser(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} usuario(s) eliminado(s) correctamente.`
      )
      setSelected([])
      getAllUsuarios(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  return (
    <>
      {(loading || loadedImages < rows.length) && page === 0 && (
        <Loader title="Cargando usuarios" fullSize={true} />
      )}
      <MainWrapper>
        <Paper
          sx={{
            display: { xs: 'none', lg: 'initial' },
            margin: 10,
            width: '90%',
            borderRadius: 4,
            boxShadow: 'var(--box-shadow)',
            backgroundColor: 'var(--background-claro)'
          }}
        >
          <ArrowBack />

          <EnhancedTableToolbar
            title="Usuarios"
            titleAdd="Agregar usuario"
            handleAdd={handleAdd}
            numSelected={selected.length}
            handleConfirmDelete={() => handleDelete()}
          />
          <SearchNameUser />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                headCells={headCellsUser}
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
                  const isItemSelected = isSelected(row.idUser, selected)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const isRowEven = index % 2 === 0

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.idUser}
                      selected={isItemSelected}
                      className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleClick(event, row.idUser)}
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
                          src={row.picture}
                          variant="circular"
                          width={80}
                          height={80}
                          fallbackSrc={undefined}
                          delay={10}
                          onLoad={() => setLoadedImages((prev) => prev + 1)}
                          onError={() => setLoadedImages((prev) => prev + 1)}
                        />
                      </TableCell>

                      <TableCell align="left">
                        {Array.isArray(row.roles)
                          ? row.roles.join(', ')
                          : 'Sin roles'}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.registDate}</TableCell>
                      <TableCell align="left">{row.modifiedDate}</TableCell>
                      <TableCell align="left">
                        <Box
                          style={{
                            opacity: selected.length > 0 ? 0 : 1,
                            pointerEvents:
                              selected.length > 0 ? 'none' : 'auto',
                            transition: 'opacity 0.5s ease-in-out',
                               ...flexRowContainer,
                          }}
                        >
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation()
                                handleEdit(row.idUser)
                              }}
                            >
                              <EditIcon sx={{color:"var(--color-info)"}}/>
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation()
                                handleDelete(row.idUser)
                              }}
                            >
                              <DeleteIcon sx={{color:"var(--color-error)"}}/>
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={headCellsUser.length + 1}
                      align="center"
                    >
                      <TitleResponsive>
                        No se encontraron usuarios
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
            count={state.users.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
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

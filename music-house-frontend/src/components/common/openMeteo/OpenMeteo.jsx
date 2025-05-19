import { getOpenMeteo } from '@/api/open-meteo'
import { CITIES, weatherMap } from '@/components/utils/roles/constants'
import { FormControl, MenuItem, Select, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'

const OpenMeteo = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedCity) return
    setLoading(true)
    getOpenMeteo(selectedCity.lat, selectedCity.lon).then((result) => {
    
      setData(result)
      setLoading(false)
    })
  }, [selectedCity])

  return (
    <FormControl
      fullWidth
      variant="standard"
      sx={{ background: 'transparent' }}
    >
      <Select
        value={selectedCity.name}
        onChange={(e) => {
          const city = CITIES.find((c) => c.name === e.target.value)
          setSelectedCity(city)
        }}
        displayEmpty
        disableUnderline
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              ml: {
                xs: 19,
                sm: 20,
                md: 20,
                lg: 21,
                xl: 20
              },
              height: 150,
              background: 'var(--gradiente-cafe)',
              borderRadius: 2,
              border: '1px solid red',
              color: 'white',
              fontSize: {
                xs: 10,
                sm: 13,
                md: 14,
                lg: 15,
                xl: 16
              }
            }
          }
        }}
        sx={{
          fontSize: {
            xs: 12,
            sm: 13,
            md: 14,
            lg: 15,
            xl: 16
          },
          color: 'var(--color-info)',
          bgcolor: 'transparent',
          boxShadow: 'none',
          textAlign: 'center',
          width: {
            xs: 200,
            sm: 200,
            md: 220,
            lg: 200,
            xl: 210
          },
          '& .MuiSelect-select': {
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          },
          '& .MuiSelect-icon': {
            display: 'none'
          },
          '& fieldset': {
            border: 'none'
          },
          '&:hover': {
            background: 'transparent'
          }
        }}
      >
        {CITIES.map((city) => (
          <MenuItem
            key={city.name}
            value={city.name}
            sx={{
              fontSize: {
                xs: 12,
                sm: 13,
                md: 14,
                lg: 15
              },
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {city.name}
          </MenuItem>
        ))}
      </Select>

      {/* Clima actual o skeleton */}
      <div style={{ margin: '10px', fontSize: '14px', color: 'yellow' }}>
        {loading ? (
          <>
            <Skeleton
              width={130}
              height={25}
              animation="wave"
              sx={{
                backgroundColor: '#444', // color base del skeleton
                '&::after': {
                  background: 'linear-gradient(90deg, #444, #555, #444)' // efecto de onda
                }
              }}
            />
            <Skeleton
              width={80}
              height={25}
              animation="wave"
              sx={{
                backgroundColor: '#444', // color base del skeleton
                '&::after': {
                  background: 'linear-gradient(90deg, #444, #555, #444)' // efecto de onda
                }
              }}
            />
          </>
        ) : (
          data?.current && (
            <>
              🌡️ {data.current.temperature_2m}°C | 💨{' '}
              {data.current.wind_speed_10m} km/h
              <br />
              {weatherMap[data.current.weathercode]?.icon}{' '}
              {weatherMap[data.current.weathercode]?.desc}
            </>
          )
        )}
      </div>
    </FormControl>
  )
}

export default OpenMeteo

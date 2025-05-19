
export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_VISITADOR = 'ROLE_VISITADOR'; 

export const USER = 'USER';
export const ADMIN = 'ADMIN';
export const VISITADOR = 'VISITADOR';

export const roleList = () => [
  { value: USER, label: 'Usuario' },
  { value: ADMIN, label: 'Administrador' },
  { value: VISITADOR, label: 'Visitador' }
]

export const roleByValue = (value) => {
  return roleList().find((r) => r.value === value)
}

  export const CITIES = [
  { name: "Santiago, Chile", lat: -33.45, lon: -70.6667 },
  { name: "Buenos Aires, Argentina", lat: -34.6037, lon: -58.3816 },
  { name: "Brasilia, Brasil", lat: -15.7939, lon: -47.8828 },
  { name: "Lima, Perú", lat: -12.0464, lon: -77.0428 },
  { name: "La Paz, Bolivia", lat: -16.5, lon: -68.15 },
  { name: "Montevideo, Uruguay", lat: -34.9011, lon: -56.1645 },
  { name: "Asunción, Paraguay", lat: -25.2637, lon: -57.5759 }
];
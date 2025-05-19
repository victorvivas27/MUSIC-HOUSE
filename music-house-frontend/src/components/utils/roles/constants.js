
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
  // 🇨🇱 Chile
  { name: "Santiago, Chile", lat: -33.45, lon: -70.6667 },
  { name: "Valparaíso, Chile", lat: -33.0472, lon: -71.6127 },
  { name: "San Pedro de Atacama, Chile", lat: -22.9087, lon: -68.1997 },

  // 🇦🇷 Argentina
  { name: "Buenos Aires, Argentina", lat: -34.6037, lon: -58.3816 },
  { name: "Córdoba, Argentina", lat: -31.4201, lon: -64.1888 },
  { name: "Ushuaia, Argentina", lat: -54.8019, lon: -68.3030 },

  // 🇧🇷 Brasil
  { name: "Brasilia, Brasil", lat: -15.7939, lon: -47.8828 },
  { name: "São Paulo, Brasil", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro, Brasil", lat: -22.9068, lon: -43.1729 },

  // 🇵🇪 Perú
  { name: "Lima, Perú", lat: -12.0464, lon: -77.0428 },
  { name: "Machu Picchu, Perú", lat: -13.1631, lon: -72.5450 },

  // 🇧🇴 Bolivia
  { name: "La Paz, Bolivia", lat: -16.5, lon: -68.15 },

  // 🇺🇾 Uruguay
  { name: "Montevideo, Uruguay", lat: -34.9011, lon: -56.1645 },

  // 🇵🇾 Paraguay
  { name: "Asunción, Paraguay", lat: -25.2637, lon: -57.5759 },

  // 🇪🇨 Ecuador
  { name: "Quito, Ecuador", lat: -0.2299, lon: -78.5249 },
  { name: "Guayaquil, Ecuador", lat: -2.1709, lon: -79.9224 },
  { name: "Galápagos, Ecuador", lat: -0.9538, lon: -90.9656 },

  // 🇨🇴 Colombia
  { name: "Bogotá, Colombia", lat: 4.7110, lon: -74.0721 },
  { name: "Medellín, Colombia", lat: 6.2442, lon: -75.5812 },
  { name: "Cartagena, Colombia", lat: 10.3910, lon: -75.4794 },

  // 🇻🇪 Venezuela
  { name: "Caracas, Venezuela", lat: 10.4806, lon: -66.9036 },

  // 🇬🇾 Guyana
  { name: "Georgetown, Guyana", lat: 6.8013, lon: -58.1551 },

  // 🇸🇷 Surinam
  { name: "Paramaribo, Surinam", lat: 5.8520, lon: -55.2038 },
];


export const weatherMap = {
  0: { desc: "Soleado", icon: "☀️" },
  1: { desc: "Mayormente soleado", icon: "🌤️" },
  2: { desc: "Parcialmente nublado", icon: "⛅" },
  3: { desc: "Nublado", icon: "☁️" },
  45: { desc: "Niebla", icon: "🌫️" },
  48: { desc: "Niebla con escarcha", icon: "🌫️" },
  51: { desc: "Llovizna débil", icon: "🌦️" },
  53: { desc: "Llovizna moderada", icon: "🌧️" },
  55: { desc: "Llovizna intensa", icon: "🌧️" },
  56: { desc: "Llovizna congelante ligera", icon: "🌧️❄️" },
  57: { desc: "Llovizna congelante fuerte", icon: "🌧️❄️" },
  61: { desc: "Lluvia ligera", icon: "🌧️" },
  63: { desc: "Lluvia moderada", icon: "🌧️" },
  65: { desc: "Lluvia fuerte", icon: "🌧️🌊" },
  66: { desc: "Lluvia congelante ligera", icon: "🌧️❄️" },
  67: { desc: "Lluvia congelante intensa", icon: "🌧️❄️" },
  71: { desc: "Nieve ligera", icon: "🌨️" },
  73: { desc: "Nieve moderada", icon: "🌨️" },
  75: { desc: "Nieve intensa", icon: "❄️" },
  77: { desc: "Granos de nieve", icon: "🌨️❄️" },
  80: { desc: "Chubascos ligeros", icon: "🌧️" },
  81: { desc: "Chubascos moderados", icon: "🌧️" },
  82: { desc: "Chubascos violentos", icon: "🌧️🌩️" },
  85: { desc: "Chubascos de nieve ligeros", icon: "🌨️" },
  86: { desc: "Chubascos de nieve fuertes", icon: "❄️❄️" },
  95: { desc: "Tormenta", icon: "⛈️" },
  96: { desc: "Tormenta con granizo ligero", icon: "⛈️🧊" },
  99: { desc: "Tormenta con granizo fuerte", icon: "⛈️🧊🧊" }
};
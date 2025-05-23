import * as Yup from 'yup'

function validarDigitoVerificador(rut) {
  // Separar el número del dígito verificador
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = 
    dvEsperado === 11 ? '0' : 
    dvEsperado === 10 ? 'K' : 
    dvEsperado.toString();

  return dvCalculado === dv;
}
// Función para validar vencimiento MM/AA
const isValidExpiry = (value) => {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false
  const [month, year] = value.split('/').map(Number)
  if (month < 1 || month > 12) return false

  const currentDate = new Date()
  const expiryDate = new Date(2000 + year, month)
  return expiryDate > currentDate
}

export const PaymentValidationSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .required('Número de tarjeta requerido')
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Debe contener 16 números separados por espacios'),
  cardHolderName: Yup.string().required('Nombre del titular requerido'),
  expirationDate: Yup.string()
    .required('Fecha de vencimiento requerida')
    .matches(/^\d{2}\/\d{2}$/, 'Formato válido MM/AA')
    .test('not-expired', 'Tarjeta vencida', isValidExpiry),
  cvv: Yup.string()
    .required('CVV requerido')
    .matches(/^\d{3}$/, 'Debe contener 3 números'),
  email: Yup.string().email('Correo inválido').required('Correo requerido'),
documentNumber: Yup.string()
  .required('RUT requerido')
  .test('valid-rut', 'RUT inválido', (value) => {
    // Eliminar puntos y guión para validación
    const cleanValue = value.replace(/[.-]/g, '');
    
    // Validar longitud (8-9 dígitos + dígito verificador)
    if (cleanValue.length < 8 || cleanValue.length > 9) return false;
    
    // Validar formato básico (solo números + k/K al final)
    if (!/^[0-9]+[0-9kK]{1}$/.test(cleanValue)) return false;
    
    // Validar dígito verificador (opcional pero recomendado)
    return validarDigitoVerificador(cleanValue);
  })
})
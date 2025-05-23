import * as Yup from 'yup'

export const userValidationSchema = Yup.object().shape({
  
  picture: Yup.mixed()
  .nullable()
  .test('fileSize', 'La imagen debe pesar menos de 5MB', (value) => {
    if (!value) return true
    return value.size <= 5 * 1024 * 1024
  })
  .test('fileType', 'Formato no permitido. Usa JPG, PNG o WEBP', (value) => {
    if (!value) return true
    return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
  }),
  
  name: Yup.string().min(3, 'Mínimo 3 caracteres').required('El nombre es obligatorio'),
  lastName: Yup.string().min(3, 'Mínimo 3 caracteres').required('El apellido es obligatorio'),
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  //telegramChatId: Yup.string()
    //.matches(/^\d+$/, 'Solo números')
    //.min(5, 'Mínimo 5 dígitos')
    //.max(15, 'Máximo 15 dígitos')
    //.required('El código de Telegram es obligatorio'),


    password: Yup.string().when('idUser', {
      is: (val) => !val,
      then: (schema) =>
        schema
          .min(6, 'Debe tener al menos 6 caracteres')
          .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
          .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
          .matches(/[@$!%*#?&]/, 'La contraseña debe contener al menos un carácter especial (@, #, $, etc.)')
          .required('La contraseña es obligatoria'),
      otherwise: (schema) => schema.notRequired()
    }),


  repeatPassword: Yup.string().when('password', {
    is: (val) => !!val,
    then: (schema) =>
      schema
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Debes repetir la contraseña'),
    otherwise: (schema) => schema.notRequired()
  }),

  roles: Yup.array().when('$isUserAdmin', {
    is: true,
    then: (schema) => schema.min(1, 'Debe haber al menos un rol asignado'),
    otherwise: (schema) => schema.notRequired()
  }),

  addresses: Yup.array().of(
    Yup.object().shape({
      street: Yup.string().required('La calle es obligatoria'),
      number: Yup.string().required('El número es obligatorio'),
      city: Yup.string().required('La ciudad es obligatoria'),
      state: Yup.string().required('El estado es obligatorio'),
      country: Yup.string().required('El país es obligatorio')
    })
  ),

  phones: Yup.array().of(
    Yup.object().shape({
      countryCode: Yup.string().required('Código requerido'),
      phoneNumber: Yup.string()
        .matches(/^\+\d{7,15}$/, 'Debe tener entre 7 y 15 dígitos con prefijo')
        .required('Teléfono requerido')
    })
  ),

  accept: Yup.boolean()
  .oneOf([true], 'Debes aceptar los términos y condiciones')
  .notRequired()
})

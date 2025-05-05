export const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, '-')            // reemplaza espacios por guiones
      .replace(/[^\w-]+/g, '')         // elimina caracteres no válidos
      .replace(/--+/g, '-')            // reemplaza múltiples guiones
      .replace(/^-+/, '')              // remueve guión inicial
      .replace(/-+$/, '');             // remueve guión final
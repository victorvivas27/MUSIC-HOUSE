export const getErrorMessage = (error) => {
  if (!error) return '⚠️ Error desconocido (sin detalles).'

  const data = error.response?.data || error || {}
  const message = data.message || ''
  const errorText = data.error || ''
  const result = data.result || {}

  let resultText = ''
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    resultText = Object.entries(result)
      .map(([, value]) => value) // 🔹 solo el mensaje, sin 'startDate:'
      .join('\n')
  }

  return [message, errorText, resultText].filter(Boolean).join('\n')
}

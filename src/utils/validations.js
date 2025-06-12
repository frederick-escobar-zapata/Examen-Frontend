/**
 * Valida que el texto solo contenga letras, puntos, comas, espacios y acentos.
 * @param {string} text - El texto a validar.
 * @returns {boolean} - `true` si el texto es válido, `false` en caso contrario.
 */
export const validateTextWithAccents = (text) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ.,\s]*$/;
  return regex.test(text);
};

/**
 * Valida que el código solo contenga letras, números y guiones.
 * @param {string} code - El código a validar.
 * @returns {boolean} - `true` si el código es válido, `false` en caso contrario.
 */
export const validateCode = (code) => {
  const regex = /^[a-zA-Z0-9-]*$/;
  return regex.test(code);
};

/**
 * Valida que la fecha sea válida y no esté en el futuro.
 * @param {string} date - La fecha en formato ISO (YYYY-MM-DD).
 * @returns {boolean} - `true` si la fecha es válida, `false` en caso contrario.
 */
export const validateDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  return selectedDate <= today;
};

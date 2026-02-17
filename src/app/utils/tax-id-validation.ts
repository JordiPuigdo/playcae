/**
 * Utilidad compartida para validación de CIF (empresas) y DNI/NIE (trabajadores).
 *
 * CIF → LETRA + 7 dígitos + dígito/letra de control  (ej: B12345678)
 * DNI → 8 dígitos + letra de control                  (ej: 12345678Z)
 * NIE → X/Y/Z + 7 dígitos + letra de control          (ej: X1234567L)
 */

// ─── CIF (Código de Identificación Fiscal) ──────────────────────────

const CIF_REGEX = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;

// Tipos societarios cuyo dígito de control debe ser numérico
const NUMERIC_CONTROL_TYPES = new Set(["A", "B", "E", "H"]);

// Tipos societarios cuyo dígito de control debe ser letra
const LETTER_CONTROL_TYPES = new Set(["P", "Q", "R", "S", "W"]);

const CONTROL_LETTERS = "JABCDEFGHI";

/**
 * Valida un CIF español (empresas).
 * Formato: LETRA + 7 DÍGITOS + CONTROL
 */
export const validateCIF = (value: string): boolean => {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (!CIF_REGEX.test(clean)) return false;

  const societyLetter = clean[0];
  const digits = clean.substring(1, 8); // 7 dígitos centrales
  const controlChar = clean[8];

  // Algoritmo: posiciones impares (0,2,4,6 en 0-index) → multiplicar×2 y sumar dígitos
  //            posiciones pares  (1,3,5 en 0-index)    → sumar directamente
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      // Posición impar (1ª, 3ª, 5ª, 7ª)
      const doubled = digit * 2;
      sum += doubled > 9 ? Math.floor(doubled / 10) + (doubled % 10) : doubled;
    } else {
      // Posición par (2ª, 4ª, 6ª)
      sum += digit;
    }
  }

  const control = (10 - (sum % 10)) % 10;
  const controlLetter = CONTROL_LETTERS[control];

  // Según el tipo de sociedad, el control puede ser numérico, letra, o ambos
  if (NUMERIC_CONTROL_TYPES.has(societyLetter)) {
    return controlChar === control.toString();
  }
  if (LETTER_CONTROL_TYPES.has(societyLetter)) {
    return controlChar === controlLetter;
  }
  // Resto de tipos: aceptar ambos
  return controlChar === control.toString() || controlChar === controlLetter;
};

// ─── DNI (Documento Nacional de Identidad) ──────────────────────────

const DNI_REGEX = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

/**
 * Valida un DNI español (trabajadores / personas físicas).
 * Formato: 8 DÍGITOS + LETRA
 */
export const validateDNI = (value: string): boolean => {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (!DNI_REGEX.test(clean)) return false;

  const numbers = parseInt(clean.substring(0, 8), 10);
  const expectedLetter = DNI_LETTERS[numbers % 23];
  return clean[8] === expectedLetter;
};

// ─── NIE (Número de Identidad de Extranjero) ────────────────────────

const NIE_REGEX = /^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

/**
 * Valida un NIE español (trabajadores extranjeros).
 * Formato: X/Y/Z + 7 DÍGITOS + LETRA
 */
export const validateNIE = (value: string): boolean => {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (!NIE_REGEX.test(clean)) return false;

  // Reemplazar la letra inicial por su equivalente numérico
  const prefix = clean[0] === "X" ? "0" : clean[0] === "Y" ? "1" : "2";
  const numericStr = prefix + clean.substring(1, 8);
  const numbers = parseInt(numericStr, 10);
  const expectedLetter = DNI_LETTERS[numbers % 23];
  return clean[8] === expectedLetter;
};

// ─── Combinadas ─────────────────────────────────────────────────────

/**
 * Valida un CIF de empresa (solo CIF, no DNI/NIE).
 * Usar en formularios de empresa.
 */
export const validateCompanyTaxId = (value: string): boolean => {
  return validateCIF(value);
};

/**
 * Valida un documento de identidad de persona (DNI o NIE).
 * Usar en formularios de trabajadores.
 */
export const validatePersonId = (value: string): boolean => {
  return validateDNI(value) || validateNIE(value);
};

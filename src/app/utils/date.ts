export const MIN_DATE = "0001-01-01T00:00:00";

// ✅ Formatea fechas válidas, muestra "-" si es null o DateTime.MinValue
export const formatDate = (dateString?: string): string => {
  if (
    !dateString ||
    dateString === MIN_DATE ||
    new Date(dateString).getFullYear() === 1
  ) {
    return "-";
  }

  return new Date(dateString).toLocaleDateString("es-ES");
};

// ✅ Verifica si una fecha caduca en los próximos 30 días (pero aún no caducó)
export const isExpiringSoon = (expiryDate?: string): boolean => {
  if (
    !expiryDate ||
    expiryDate === MIN_DATE ||
    new Date(expiryDate).getFullYear() === 1
  ) {
    return false;
  }

  const expiry = new Date(expiryDate);
  const today = new Date();

  // Normalizar la hora a 00:00 para evitar falsos positivos
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 30 && diffDays > 0;
};

// ✅ Verifica si ya ha caducado
export const isExpired = (expiryDate?: string): boolean => {
  if (
    !expiryDate ||
    expiryDate === MIN_DATE ||
    new Date(expiryDate).getFullYear() === 1
  ) {
    return false;
  }

  const expiry = new Date(expiryDate);
  const today = new Date();

  // Normalizar la hora a 00:00 para comparar solo fechas
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expiry < today;
};
